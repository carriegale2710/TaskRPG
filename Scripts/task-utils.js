'use strict';

const OUTCOME_TABLE = {
  success: [
    'A clean victory—the way forward opens.',
    'You find a useful clue.',
    'An ally offers unexpected help.',
    'The work lands better than expected.',
    'You uncover a small advantage.',
    'Fortune favours you; a door opens.',
  ],
  partial: [
    'You succeed, but something slips.',
    'Progress comes at a cost.',
    'You learn more than you planned.',
    'The result is mixed but usable.',
    'You get there, though not cleanly.',
    'A complication follows you home.',
  ],
  setback: [
    'The attempt stalls.',
    'Something important breaks.',
    'You are forced to change course.',
    'The situation worsens.',
    'You lose ground.',
    'An unexpected obstacle appears.',
  ],
};

function parseFrontmatter(text) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!match) return {};
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const index = line.indexOf(':');
    if (index > 0) fields[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return fields;
}

function today(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function scheduledDate(task) {
  return task.scheduledDate || task.scheduled || '';
}

function pickTableResult(outcome, roll) {
  const table = OUTCOME_TABLE[outcome];
  if (!table) throw new Error(`Unknown outcome: ${outcome}`);
  if (!Number.isInteger(roll) || roll < 1 || roll > 6) throw new Error('Table roll must be 1 to 6.');
  return table[roll - 1];
}

function formatResultCard({ name, roll, total, outcome, tableResult, xp, mpCost, mp, loot, overdraft }) {
  const lines = [
    `# ${name}`,
    '',
    `**Roll:** ${roll[0]} + ${roll[1]} = ${total}`,
    `**Outcome:** ${outcome}`,
    '',
    tableResult,
    '',
    `**XP:** +${xp}`,
    `**MP:** -${mpCost} (now ${mp})`,
  ];
  if (overdraft) lines.push('', '_You are Tired: XP was reduced and the roll took a penalty._');
  if (loot) lines.push('', '**Loot:** the engine flagged a drop.');
  return lines.join('\n');
}

function updateTaskStatus(text, { status, completedDate }) {
  return text
    .replace(/^status:.*$/m, `status: ${status}`)
    .replace(/^completedDate:.*$/m, `completedDate: "${completedDate ?? ''}"`);
}

module.exports = {
  OUTCOME_TABLE,
  formatResultCard,
  parseFrontmatter,
  pickTableResult,
  scheduledDate,
  today,
  updateTaskStatus,
};
