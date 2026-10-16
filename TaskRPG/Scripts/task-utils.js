"use strict";

const OUTCOME_TABLE = {
  success: [
    "A clean victory—the way forward opens.",
    "You find a useful clue.",
    "An ally offers unexpected help.",
    "The work lands better than expected.",
    "You uncover a small advantage.",
    "Fortune favours you; a door opens.",
  ],
  partial: [
    "You succeed, but something slips.",
    "Progress comes at a cost.",
    "You learn more than you planned.",
    "The result is mixed but usable.",
    "You get there, though not cleanly.",
    "A complication follows you home.",
  ],
  setback: [
    "The attempt stalls.",
    "Something important breaks.",
    "You are forced to change course.",
    "The situation worsens.",
    "You lose ground.",
    "An unexpected obstacle appears.",
  ],
};

function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) return {};
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const index = line.indexOf(":");
    if (index > 0)
      fields[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return fields;
}

function today(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function scheduled(task) {
  return task.scheduled || "";
}

function parseTags(value) {
  if (Array.isArray(value))
    return value
      .map((tag) => String(tag).trim().replace(/^#/, "").toLowerCase())
      .filter(Boolean);
  if (value === undefined || value === null || value === "") return [];
  let text = String(value).trim();
  if (text.startsWith("[") && text.endsWith("]")) text = text.slice(1, -1);
  return text
    .split(/[\s,]+/)
    .map((tag) => tag.trim().replace(/^#/, "").toLowerCase())
    .filter(Boolean);
}

function hasTag(value, tag) {
  return parseTags(value).includes(
    String(tag).trim().replace(/^#/, "").toLowerCase(),
  );
}

function pickTableResult(outcome, roll) {
  const table = OUTCOME_TABLE[outcome];
  if (!table) throw new Error(`Unknown outcome: ${outcome}`);
  if (!Number.isInteger(roll) || roll < 1 || roll > 6)
    throw new Error("Table roll must be 1 to 6.");
  return table[roll - 1];
}

function formatResultCard({
  name,
  roll,
  total,
  outcome,
  tableResult,
  xp,
  mpCost,
  mp,
  loot,
  overdraft,
}) {
  const lines = [
    `# ${name}`,
    "",
    `**Roll:** ${roll[0]} + ${roll[1]} = ${total}`,
    `**Outcome:** ${outcome}`,
    "",
    tableResult,
    "",
    `**XP:** +${xp}`,
    `**MP:** -${mpCost} (now ${mp})`,
  ];
  if (overdraft)
    lines.push(
      "",
      "_You are Tired: XP was reduced and the roll took a penalty._",
    );
  if (loot) lines.push("", "**Loot:** the engine flagged a drop.");
  return lines.join("\n");
}

function updateTaskStatus(text, { status, completedDate }) {
  return text
    .replace(/^status:.*$/m, `status: ${status}`)
    .replace(/^completedDate:.*$/m, `completedDate: "${completedDate ?? ""}"`);
}

// A task is unresolved when its latest relevant RPG event is task_done.
// Undo events identify the action they reverse with targetEventId, so follow
// that link back to the task_done event instead of filtering undo by taskId.
function hasUnresolvedTaskDone(events, taskId) {
  const byId = new Map(events.map((event) => [event.id, event]));
  const relevant = events.filter((event) => {
    if (event.type === "task_done") return event.taskId === taskId;
    if (event.type === "undo") {
      const target = byId.get(event.targetEventId);
      return target?.type === "task_done" && target.taskId === taskId;
    }
    return false;
  });
  const last = relevant.at(-1);
  return Boolean(last && last.type === "task_done");
}

module.exports = {
  OUTCOME_TABLE,
  formatResultCard,
  hasTag,
  hasUnresolvedTaskDone,
  parseFrontmatter,
  parseTags,
  pickTableResult,
  scheduled,
  today,
  updateTaskStatus,
};
