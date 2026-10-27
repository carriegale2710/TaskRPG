"use strict";

// TaskNotes' default, non-completed status (verified against TaskNotes 4.13.8).
const OPEN_TASK_STATUS = "open";

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

function unquote(value) {
  const text = String(value).trim();
  const quoted = /^(["'])([\s\S]*)\1$/.exec(text);
  return quoted ? quoted[2] : text;
}

function parseFrontmatter(text) {
  const match = /^(?:\uFEFF)?---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) return {};
  const fields = {};
  let listKey = null;
  for (const line of match[1].split(/\r?\n/)) {
    // TaskNotes writes tags as a block list. Attribute items to the key above.
    const item = /^\s*-\s+(.*)$/.exec(line);
    if (item && listKey) {
      if (!Array.isArray(fields[listKey])) fields[listKey] = [];
      fields[listKey].push(unquote(item[1]));
      continue;
    }
    const index = line.indexOf(":");
    if (index > 0) {
      const key = line.slice(0, index).trim();
      fields[key] = unquote(line.slice(index + 1));
      listKey = fields[key] === "" ? key : null;
    }
  }
  return fields;
}

function normalizeTag(tag) {
  return unquote(tag).replace(/^#/, "").toLowerCase();
}

function today(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function scheduledDate(value) {
  const text = unquote(value ?? "").trim();
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(text);
  return match ? match[1] : "";
}

// `gameDay` comes from engine.gameDay(), so this check shares the engine's
// rollover rule instead of keeping a second copy of it.
function isPlannedToday(value, gameDay) {
  const day = scheduledDate(value);
  return Boolean(day) && day === gameDay;
}

function scheduled(task) {
  return task.scheduled || "";
}

function parseTags(value) {
  if (Array.isArray(value)) return value.map(normalizeTag).filter(Boolean);
  if (value === undefined || value === null || value === "") return [];
  let text = String(value).trim();
  if (text.startsWith("[") && text.endsWith("]")) text = text.slice(1, -1);
  return text
    .split(/[\s,]+/)
    .map(normalizeTag)
    .filter(Boolean);
}

function hasTag(value, tag) {
  return parseTags(value).includes(normalizeTag(tag));
}

function pickTableResult(outcome, roll) {
  const table = Object.prototype.hasOwnProperty.call(OUTCOME_TABLE, outcome)
    ? OUTCOME_TABLE[outcome]
    : undefined;
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
    `**MP:** ${mpCost === 0 ? "0" : `-${mpCost}`} (now ${mp})`,
  ];
  if (overdraft)
    lines.push(
      "",
      "_You are Tired: XP was reduced and the roll took a penalty._",
    );
  if (loot) lines.push("", "**Loot:** the engine flagged a drop.");
  return lines.join("\n");
}

// Hero.md is derived display state; wrappers rewrite it after every action.
function renderHero(state) {
  const xp = Object.entries(state.skillXP)
    .map(([name, value]) => `xp_${name}: ${value}`)
    .join("\n");
  return `---\ntype: hero-state\nhp: ${state.HP}\nmaxHP: ${state.maxHP}\nmp: ${state.MP}\nmaxMP: ${state.maxMP}\n${xp}\n---\n# Hero state\n\nDerived from [[Events]]; do not edit these numbers by hand.\n\nHP: \`VIEW[{hp}][text]\` / \`VIEW[{maxHP}][text]\`  \nMP: \`VIEW[{mp}][text]\` / \`VIEW[{maxMP}][text]\`\n\n## Skill XP\n\n${Object.keys(
    state.skillXP,
  )
    .map((name) => `- ${name}: \`VIEW[{xp_${name}}][text]\``)
    .join("\n")}\n`;
}

function updateFrontmatter(text, values) {
  const match = /^(\uFEFF?---)(\r?\n)([\s\S]*?)(\r?\n---)/.exec(text);
  if (!match) throw new Error("Task note has no frontmatter to update.");
  const [, open, eol, body, close] = match;
  const lines = body ? body.split(eol) : [];
  // Values are written as plain text, never as a String.replace pattern.
  for (const [key, value] of Object.entries(values)) {
    const index = lines.findIndex((line) => line.split(":")[0].trim() === key);
    if (index === -1) lines.push(`${key}: ${value}`);
    else lines[index] = `${key}: ${value}`;
  }
  return `${open}${eol}${lines.join(eol)}${close}${text.slice(match[0].length)}`;
}

function updateTaskStatus(text, { status, completedDate }) {
  return updateFrontmatter(text, {
    status: String(status ?? ""),
    completedDate: `"${completedDate ?? ""}"`,
  });
}

// Undo restores the TaskNotes status to the plugin default and clears completion.
function reopenTaskNote(text) {
  return updateTaskStatus(text, {
    status: OPEN_TASK_STATUS,
    completedDate: "",
  });
}

// Habit Done appends one history line per press. Undo removes the line the
// undone event added, matched by its timestamp, and leaves other lines alone.
function removeHabitLogLine(text, timestamp) {
  const prefix = `- ${timestamp} | `;
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.split(/\r?\n/);
  const index = lines.findIndex((line) => line.trimStart().startsWith(prefix));
  if (index === -1) return text;
  lines.splice(index, 1);
  return lines.join(eol);
}

// TaskNotes stores task notes in the folder configured in its plugin data and
// identifies a task by a tag, not by a `type` field. Read both instead of
// guessing, so moving the folder or renaming the tag does not silently break
// task lookup. Missing or unreadable data falls back to the plugin defaults.
const TASKNOTES_DATA = ".obsidian/plugins/tasknotes/data.json";

async function tasknotesConfig(files) {
  try {
    return JSON.parse(await files.read(TASKNOTES_DATA));
  } catch {
    return {};
  }
}

async function taskFolder(files) {
  const folder = String(
    (await tasknotesConfig(files)).tasksFolder ?? "",
  ).replace(/^\/+|\/+$/g, "");
  return folder || "TaskNotes/Tasks";
}

async function taskTag(files) {
  const tag = String((await tasknotesConfig(files)).taskTag ?? "")
    .trim()
    .replace(/^#/, "");
  return tag || "task";
}

// Finds the task note carrying `taskId` directly inside `folder`. Several
// matches are "ambiguous" and return no path, so callers never guess which note
// is the real one. Statuses: found, not_found, folder_missing, ambiguous.
async function findTaskNote(files, folder, taskId) {
  if (!(await files.exists(folder)))
    return { status: "folder_missing", path: "" };
  const { files: names = [] } = await files.list(folder);
  const matches = [];
  for (const name of names) {
    if (!name.endsWith(".md")) continue;
    if (parseFrontmatter(await files.read(name)).taskId === taskId)
      matches.push(name);
  }
  if (matches.length === 1) return { status: "found", path: matches[0] };
  if (matches.length > 1) return { status: "ambiguous", path: "" };
  return { status: "not_found", path: "" };
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
  OPEN_TASK_STATUS,
  OUTCOME_TABLE,
  findTaskNote,
  formatResultCard,
  hasTag,
  hasUnresolvedTaskDone,
  isPlannedToday,
  parseFrontmatter,
  parseTags,
  pickTableResult,
  reopenTaskNote,
  removeHabitLogLine,
  renderHero,
  scheduled,
  scheduledDate,
  taskFolder,
  taskTag,
  today,
  updateFrontmatter,
  updateTaskStatus,
};
