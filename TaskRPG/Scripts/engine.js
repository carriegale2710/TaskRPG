"use strict";
// TaskRPG engine: plain JavaScript, no dependencies, no Obsidian code.
//
// The event log (TaskRPG/Engine/Events.jsonl, one JSON object per line) is the source of truth.
// recalculate() replays it with the settings note and returns HP, MP, XP and each result.
// Events are only ever appended. Undo is a correcting "undo" event, and events are
// replayed in timestamp order, so back-filled past events just get appended too.
//
// Every event: { id, type, timestamp }. timestamp is ISO 8601 with a UTC offset.
//   task_done        skill, size, planned, roll [d1,d2], lootRoll, [important, urgent, projectId, taskId]
//   habit_done       habitId, skill, onTime
//   missed_deadline  habitId                      (timestamp = the deadline)
//   rest_day         [day]                        (game day "YYYY-MM-DD"; default = the event's game day)
//   pause / resume
//   focus_project    projectId                    (weekly focus, valid for that Mon-Sun week)
//   arc_completed    projectId                    (raises that project's threat)
//   settings_changed settings                     (full new settings, in force from this event on)
//   undo             targetEventId                (newest task/habit action of the same game day)
// recordAction() also writes readable outcome / xp / mp fields on the line; replay ignores them.

// fs and path are only needed by the terminal command, so the engine also loads on mobile.

const ACTIONS = ["task_done", "habit_done"];
const EVENT_TYPES = [
  ...ACTIONS,
  "missed_deadline",
  "rest_day",
  "pause",
  "resume",
  "focus_project",
  "arc_completed",
  "settings_changed",
  "undo",
];

const RANGES = {
  dayRolloverHour: [0, 23],
  maxHP: [1, 100],
  maxMP: [1, 100],
  minTaskMP: [0, 10],
  unplannedMP: [0, 10],
  woundedMP: [0, 10],
  tiredPenalty: [0, 10],
  habitWindowDays: [1, 365],
  habitXP: [0, 100],
  habitHP: [0, 100],
  restDaysPerMonth: [0, 31],
  missedDeadlineHP: [0, 100],
  maxHPLossPerDay: [0, 100],
  threatPerArc: [0, 10],
  maxThreat: [0, 10],
  successAt: [2, 30],
  partialAt: [2, 30],
};

const isInt = (v, lo, hi) => Number.isInteger(v) && v >= lo && v <= hi;
const isNum = (v, lo, hi) => typeof v === "number" && v >= lo && v <= hi;

function validateSettings(s) {
  const bad = (msg) => {
    throw new Error(`Settings: ${msg}`);
  };
  if (!s || typeof s !== "object" || Array.isArray(s))
    bad("must be a JSON object.");
  for (const [key, [lo, hi]] of Object.entries(RANGES)) {
    if (!isInt(s[key], lo, hi))
      bad(`${key} must be a whole number from ${lo} to ${hi}.`);
  }
  if (
    !Array.isArray(s.skills) ||
    !s.skills.length ||
    new Set(s.skills).size !== s.skills.length ||
    s.skills.some((x) => typeof x !== "string" || !x)
  )
    bad("skills must be a list of unique names.");
  if (s.successAt <= s.partialAt)
    bad("successAt must be higher than partialAt.");
  if (!isNum(s.overdraftXPFactor, 0.01, 1))
    bad("overdraftXPFactor must be from 0.01 to 1.");
  for (const key of ["important", "urgent", "focus"]) {
    if (!isNum(s.xpBonus?.[key], 0, 10))
      bad(`xpBonus.${key} must be a number from 0 to 10.`);
  }
  const sizes = Object.entries(s.taskSizes ?? {});
  if (
    !sizes.length ||
    sizes.some(([, v]) => !isInt(v?.mp, 0, 100) || !isInt(v?.xp, 0, 100))
  ) {
    bad(
      "taskSizes needs at least one size, each with whole-number mp and xp from 0 to 100.",
    );
  }
  for (const key of ["mpDiscountLevels", "diceBonusLevels"]) {
    if (!Array.isArray(s[key]) || s[key].some((l) => !isInt(l, 1, 10)))
      bad(`${key} must list levels from 1 to 10.`);
  }
  if (
    !Array.isArray(s.lootDropRolls) ||
    s.lootDropRolls.some((n) => !isInt(n, 1, 6))
  ) {
    bad("lootDropRolls must list die results from 1 to 6.");
  }
  const xp = s.xpThresholds;
  if (
    !Array.isArray(xp) ||
    xp.length !== 10 ||
    xp[0] !== 0 ||
    xp.some((n, i) => !isInt(n, 0, 1e9) || (i && n <= xp[i - 1]))
  ) {
    bad("xpThresholds must be 10 increasing whole numbers starting at 0.");
  }
  const hp = s.hpPenalties;
  if (
    !Array.isArray(hp) ||
    !hp.length ||
    hp.at(-1).minHP !== 0 ||
    hp.some(
      (b, i) =>
        !isInt(b.minHP, 0, s.maxHP) ||
        !isInt(b.penalty, 0, 100) ||
        (i && b.minHP >= hp[i - 1].minHP),
    )
  ) {
    bad(
      "hpPenalties must be listed from the highest minHP down to 0, each with a penalty.",
    );
  }
  const tiers = s.habitTiers;
  if (
    !Array.isArray(tiers) ||
    !tiers.length ||
    tiers[0].minShare !== 0 ||
    tiers.some(
      (t, i) =>
        !isNum(t.minShare, 0, 1) ||
        !isInt(t.cost, 0, 100) ||
        (i && t.minShare <= tiers[i - 1].minShare),
    )
  ) {
    bad("habitTiers must start at minShare 0 and increase, each with a cost.");
  }
  return s;
}

function parseSettingsNote(text) {
  const match = /```json taskrpg-settings\r?\n([\s\S]*?)```/.exec(text);
  if (!match)
    throw new Error("Settings note has no ```json taskrpg-settings block.");
  let parsed;
  try {
    parsed = JSON.parse(match[1]);
  } catch (error) {
    throw new Error(`Settings JSON is invalid: ${error.message}`);
  }
  return validateSettings(parsed);
}

// How many entries in a sorted-or-not level list the given value has reached.
const countAtLeast = (list, n) => list.filter((x) => n >= x).length;

const canon = (v) =>
  JSON.stringify(v, (_, x) =>
    x && typeof x === "object" && !Array.isArray(x)
      ? Object.fromEntries(
          Object.entries(x).sort(([a], [b]) => (a < b ? -1 : 1)),
        )
      : x,
  );

function addDays(day, n) {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
const weekday = (day) => new Date(`${day}T00:00:00Z`).getUTCDay();
const weekStart = (day) => addDays(day, -((weekday(day) + 6) % 7));

// The game day is the wall-clock date in the timestamp, moved back a day before the rollover hour.
function gameDay(timestamp, rolloverHour) {
  const m =
    /^(\d{4}-\d{2}-\d{2})T(\d{2}):\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.exec(
      timestamp,
    );
  if (!m || Number.isNaN(Date.parse(timestamp))) {
    throw new Error(
      `Invalid timestamp "${timestamp}". Use ISO 8601 with a UTC offset.`,
    );
  }
  return addDays(m[1], Number(m[2]) < rolloverHour ? -1 : 0);
}

function recalculate(events, note, now) {
  validateSettings(note);
  const ids = new Set();
  for (const e of events) {
    if (!e || typeof e.id !== "string" || !e.id)
      throw new Error("Every event needs a non-empty id.");
    if (ids.has(e.id)) throw new Error(`Duplicate event id: ${e.id}`);
    ids.add(e.id);
    if (!EVENT_TYPES.includes(e.type))
      throw new Error(`Event ${e.id}: unknown type "${e.type}".`);
  }

  // Pass 1: the rules and game day in force for each event, in timestamp order.
  let rules = note;
  const ctx = events
    .map((e, i) => [e, i])
    .sort(
      ([a, i], [b, j]) =>
        Date.parse(a.timestamp) - Date.parse(b.timestamp) || i - j,
    )
    .map(([e]) => {
      if (e.type === "settings_changed") rules = validateSettings(e.settings);
      return { e, rules, day: gameDay(e.timestamp, rules.dayRolloverHour) };
    });

  // Pass 2: undo (newest-first, same game day), pauses and rest days.
  const lastActionByDay = {};
  const undone = new Set();
  const pauses = [];
  const restDays = new Set();
  for (const { e, day } of ctx) {
    const stack = (lastActionByDay[day] ??= []);
    if (ACTIONS.includes(e.type)) stack.push(e.id);
    else if (e.type === "undo") {
      if (!e.targetEventId || stack.at(-1) !== e.targetEventId) {
        throw new Error(
          `Event ${e.id}: undo must reverse the newest task or habit action from the same game day.`,
        );
      }
      undone.add(stack.pop());
    } else if (e.type === "pause") {
      if (pauses.at(-1)?.end === null)
        throw new Error(`Event ${e.id}: already paused.`);
      pauses.push({ start: day, end: null });
    } else if (e.type === "resume") {
      if (pauses.at(-1)?.end !== null || !pauses.length)
        throw new Error(`Event ${e.id}: not paused.`);
      pauses.at(-1).end = day;
    } else if (e.type === "rest_day") restDays.add(e.day ?? day);
  }
  const paused = (day) =>
    pauses.some((p) => day >= p.start && (p.end === null || day < p.end));
  const special = (day) =>
    [0, 6].includes(weekday(day)) || restDays.has(day) || paused(day);

  // Pass 3: replay.
  const first = ctx[0]?.rules ?? note;
  const state = {
    day: null,
    HP: first.maxHP,
    MP: first.maxMP,
    skillXP: Object.fromEntries(first.skills.map((s) => [s, 0])),
    projectThreat: {},
    focus: null,
    habits: {},
    hpLostByDay: {},
    restDays: [],
    pauses,
  };
  const results = {};
  const byId = new Map(ctx.map((c) => [c.e.id, c.e]));
  const undoneTasks = new Set();
  const level = (xp, r) => countAtLeast(r.xpThresholds, xp);
  const diceBonus = (lvl, r) => countAtLeast(r.diceBonusLevels, lvl);

  for (const { e, rules: r, day } of ctx) {
    if (undone.has(e.id)) continue;
    if (e.type === "undo") {
      const taskId = byId.get(e.targetEventId).taskId;
      if (taskId) undoneTasks.add(taskId);
      continue;
    }
    const fail = (msg) => {
      throw new Error(`Event ${e.id}: ${msg}`);
    };
    if (state.day === null || day > state.day) {
      state.day = day;
      state.MP = r.maxMP;
    }
    const result = {};
    if (ACTIONS.includes(e.type) && !r.skills.includes(e.skill))
      fail(`unknown skill "${e.skill}".`);

    if (e.type === "task_done") {
      const size = r.taskSizes[e.size] ?? fail(`unknown size "${e.size}".`);
      if (typeof e.planned !== "boolean")
        fail("planned must be true or false.");
      if (
        !Array.isArray(e.roll) ||
        e.roll.length !== 2 ||
        e.roll.some((d) => !isInt(d, 1, 6))
      )
        fail("roll must be two dice, 1 to 6.");
      if (!isInt(e.lootRoll, 1, 6))
        fail("lootRoll must be a die result, 1 to 6.");
      const lvl = level(state.skillXP[e.skill], r);
      const discount = countAtLeast(r.mpDiscountLevels, lvl);
      const cost = Math.max(
        r.minTaskMP,
        size.mp +
          (e.planned ? 0 : r.unplannedMP) +
          (state.HP === 0 ? r.woundedMP : 0) -
          discount,
      );
      const overdraft = cost > state.MP;
      state.MP = Math.max(0, state.MP - cost);

      const inFocus =
        e.projectId &&
        state.focus?.projectId === e.projectId &&
        state.focus.week === weekStart(day);
      const raw =
        size.xp *
        (1 +
          (e.important ? r.xpBonus.important : 0) +
          (e.urgent ? r.xpBonus.urgent : 0) +
          (inFocus ? r.xpBonus.focus : 0));
      let xp = Math.ceil(+raw.toFixed(6));
      if (overdraft) xp = Math.ceil(+(xp * r.overdraftXPFactor).toFixed(6));
      state.skillXP[e.skill] += xp;

      const hpPenalty = r.hpPenalties.find((b) => state.HP >= b.minHP).penalty;
      const tired = overdraft ? r.tiredPenalty : 0;
      const threat = e.projectId ? (state.projectThreat[e.projectId] ?? 0) : 0;
      const total =
        e.roll[0] + e.roll[1] + diceBonus(lvl, r) - hpPenalty - tired;
      const outcome =
        total >= r.successAt + threat
          ? "success"
          : total >= r.partialAt + threat
            ? "partial"
            : "setback";
      Object.assign(result, {
        outcome,
        total,
        mpCost: cost,
        mp: state.MP,
        xp,
        overdraft,
        hpPenalty,
        tired,
        threat,
        loot: outcome === "success" && r.lootDropRolls.includes(e.lootRoll),
        repeat: undoneTasks.has(e.taskId),
      });
    } else if (e.type === "habit_done") {
      if (typeof e.habitId !== "string" || !e.habitId)
        fail("habitId is required.");
      if (typeof e.onTime !== "boolean") fail("onTime must be true or false.");
      const habit = (state.habits[e.habitId] ??= { onTimeDays: [] });
      let eligible = 0;
      let done = 0;
      for (let i = 1; i <= r.habitWindowDays; i++) {
        const d = addDays(day, -i);
        const on = habit.onTimeDays.includes(d);
        if (on || !special(d)) {
          eligible++;
          if (on) done++;
        }
      }
      const share = eligible ? done / eligible : 0;
      const cost = r.habitTiers.findLast((t) => share >= t.minShare).cost;
      state.MP = Math.max(0, state.MP - cost);
      const hp = e.onTime ? Math.min(r.habitHP, r.maxHP - state.HP) : 0;
      state.HP += hp;
      state.skillXP[e.skill] += r.habitXP;
      if (e.onTime && !habit.onTimeDays.includes(day))
        habit.onTimeDays.push(day);
      Object.assign(result, {
        mpCost: cost,
        mp: state.MP,
        hp,
        xp: r.habitXP,
        share,
      });
    } else if (e.type === "missed_deadline") {
      if (typeof e.habitId !== "string" || !e.habitId)
        fail("habitId is required.");
      const exempt = special(day);
      const lost = exempt
        ? 0
        : Math.max(
            0,
            Math.min(
              r.missedDeadlineHP,
              r.maxHPLossPerDay - (state.hpLostByDay[day] ?? 0),
              state.HP,
            ),
          );
      state.HP -= lost;
      state.hpLostByDay[day] = (state.hpLostByDay[day] ?? 0) + lost;
      Object.assign(result, { hpLost: lost, exempt });
    } else if (e.type === "rest_day") {
      const d = e.day ?? day;
      if (Number.isNaN(Date.parse(d))) fail(`invalid day "${d}".`);
      if (state.restDays.includes(d)) fail(`rest day already logged for ${d}.`);
      if (
        state.restDays.filter((x) => x.slice(0, 7) === d.slice(0, 7)).length >=
        r.restDaysPerMonth
      ) {
        fail(
          `rest-day limit (${r.restDaysPerMonth}) reached for ${d.slice(0, 7)}.`,
        );
      }
      state.restDays.push(d);
    } else if (e.type === "focus_project") {
      state.focus = { projectId: e.projectId, week: weekStart(day) };
    } else if (e.type === "arc_completed") {
      if (!e.projectId) fail("projectId is required.");
      state.projectThreat[e.projectId] = Math.min(
        r.maxThreat,
        (state.projectThreat[e.projectId] ?? 0) + r.threatPerArc,
      );
    } else if (e.type === "settings_changed") {
      state.HP = Math.min(state.HP, r.maxHP);
      state.MP = Math.min(state.MP, r.maxMP);
      for (const s of r.skills) state.skillXP[s] ??= 0;
    }
    results[e.id] = result;
  }

  if (
    now &&
    state.day !== null &&
    gameDay(now, rules.dayRolloverHour) > state.day
  ) {
    state.day = gameDay(now, rules.dayRolloverHour);
    state.MP = rules.maxMP;
  }
  state.maxHP = rules.maxHP;
  state.maxMP = rules.maxMP;
  state.levels = Object.fromEntries(
    Object.entries(state.skillXP).map(([s, xp]) => [s, level(xp, rules)]),
  );
  state.diceBonus = Object.fromEntries(
    Object.entries(state.levels).map(([s, l]) => [s, diceBonus(l, rules)]),
  );
  state.wounded = state.HP === 0;
  state.paused = pauses.at(-1)?.end === null;
  return {
    state,
    results,
    rules,
    special,
    lastActionByDay,
    pendingSettingsChange: canon(rules) !== canon(note),
  };
}

// Validates and appends one action. Returns the lines to append, the new state and the action's result.
// Nothing is returned (an error is thrown) if the action would make the log invalid.
// `now` is when the action is recorded; it stamps any settings change, so past events keep their rules.
function recordAction(events, action, note, now = action.timestamp) {
  const before = recalculate(events, note);
  const added = [];
  if (
    !events.some((e) => e.type === "settings_changed") ||
    before.pendingSettingsChange
  ) {
    added.push({
      id: `e-${events.length + 1}`,
      type: "settings_changed",
      timestamp: now,
      settings: note,
    });
  }
  const event = {
    ...action,
    id: action.id ?? `e-${events.length + added.length + 1}`,
  };
  if (event.type === "undo" && !event.targetEventId) {
    const day = gameDay(event.timestamp, note.dayRolloverHour);
    event.targetEventId = before.lastActionByDay[day]?.at(-1);
    if (!event.targetEventId)
      throw new Error("Nothing to undo for this game day.");
  }
  const next = [...events, ...added, event];
  const { state, results } = recalculate(next, note);
  const result = results[event.id] ?? {};
  for (const [field, value] of [
    ["outcome", result.outcome],
    ["xp", result.xp],
    ["mp", result.mpCost],
  ]) {
    if (value !== undefined) event[field] = value;
  }
  return { events: next, added: [...added, event], state, result };
}

// Missed habit blocks: returns missed_deadline events for closed deadlines with no on-time press.
// deadlines: [{ habitId, deadline }] (ISO timestamps). Append the returned events with recordAction.
function backfillMissedDeadlines(events, deadlines, note, now) {
  const { state, rules, special } = recalculate(events, note, now);
  const have = new Set(events.map((e) => e.id));
  return deadlines.flatMap(({ habitId, deadline }) => {
    const id = `missed:${habitId}:${deadline}`;
    const day = gameDay(deadline, rules.dayRolloverHour);
    if (
      Date.parse(deadline) > Date.parse(now) ||
      have.has(id) ||
      special(day) ||
      state.habits[habitId]?.onTimeDays.includes(day)
    )
      return [];
    return [{ id, type: "missed_deadline", timestamp: deadline, habitId }];
  });
}

// Pass the dice from Dice Roller, or leave rng as is. Tests pass dice in directly.
function rollDice(rng = Math.random) {
  const die = () => 1 + Math.floor(rng() * 6);
  return { roll: [die(), die()], lootRoll: die() };
}

// One event per line. Blank lines and lines starting with "#" or a code fence are skipped,
// so the log can live in a .md note that Obsidian can show.
function parseEvents(text) {
  return text
    .split(/\r?\n/)
    .map((line, i) => [line.trim(), i + 1])
    .filter(([line]) => line && !/^(#|```)/.test(line))
    .map(([line, n]) => {
      try {
        return JSON.parse(line);
      } catch (error) {
        throw new Error(
          `Event log line ${n} is not valid JSON: ${error.message}`,
        );
      }
    });
}

// Local time as ISO 8601 with a UTC offset, e.g. 2026-10-14T06:38:30+11:00.
function localStamp(date = new Date()) {
  const offset = -date.getTimezoneOffset();
  const pad = (n) => String(Math.trunc(Math.abs(n))).padStart(2, "0");
  return `${new Date(date.getTime() + offset * 60000).toISOString().slice(0, 19)}${offset < 0 ? "-" : "+"}${pad(offset / 60)}:${pad(offset % 60)}`;
}

function main([command, ...args]) {
  const fs = require("node:fs");
  const path = require("node:path");
  if (command !== "recalc")
    throw new Error(
      "Usage: node engine.js recalc [events.jsonl] [settings.md] [state.json] [--now=ISO]",
    );
  const engineDir = path.resolve(__dirname, "..", "Engine");
  const now = args.find((a) => a.startsWith("--now="))?.slice(6);
  const [
    eventsFile = path.join(engineDir, "Events.jsonl"),
    settingsFile = path.join(engineDir, "Settings.md"),
    stateFile = path.join(engineDir, "State.json"),
  ] = args.filter((a) => !a.startsWith("--")).map((p) => path.resolve(p));
  const events = fs.existsSync(eventsFile)
    ? parseEvents(fs.readFileSync(eventsFile, "utf8"))
    : [];
  const { state } = recalculate(
    events,
    parseSettingsNote(fs.readFileSync(settingsFile, "utf8")),
    now,
  );
  const json = `${JSON.stringify(state, null, 2)}\n`;
  fs.writeFileSync(stateFile, json);
  process.stdout.write(json);
}

if (
  typeof require !== "undefined" &&
  typeof module !== "undefined" &&
  require.main === module
) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = {
  backfillMissedDeadlines,
  gameDay,
  localStamp,
  parseEvents,
  parseSettingsNote,
  recalculate,
  recordAction,
  rollDice,
  validateSettings,
};
