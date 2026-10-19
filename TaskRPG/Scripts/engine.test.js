"use strict";
const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const E = require("./engine.js");

// Tests run against a frozen copy of the starting settings, NOT the live Settings.md, so tuning
// your numbers in Obsidian never breaks the suite. One test below checks the live file is valid.
const LIVE_SETTINGS_FILE = path.join(__dirname, "..", "Engine", "Settings.md");
const note = {
  skills: ["focus", "vitality", "craft", "mind", "presence"],
  dayRolloverHour: 4,
  maxHP: 10,
  maxMP: 10,
  taskSizes: {
    small: {
      mp: 1,
      xp: 1,
    },
    medium: {
      mp: 3,
      xp: 3,
    },
    large: {
      mp: 5,
      xp: 5,
    },
  },
  minTaskMP: 1,
  unplannedMP: 1,
  woundedMP: 1,
  mpDiscountLevels: [5, 10],
  overdraftXPFactor: 0.5,
  tiredPenalty: 1,
  xpBonus: {
    important: 0.5,
    urgent: 0.5,
    focus: 0.25,
  },
  xpThresholds: [0, 10, 25, 45, 70, 100, 140, 190, 250, 320],
  diceBonusLevels: [2, 4, 6, 8, 10],
  successAt: 9,
  partialAt: 6,
  lootDropRolls: [5, 6],
  hpPenalties: [
    {
      minHP: 7,
      penalty: 0,
    },
    {
      minHP: 4,
      penalty: 1,
    },
    {
      minHP: 1,
      penalty: 2,
    },
    {
      minHP: 0,
      penalty: 3,
    },
  ],
  habitWindowDays: 30,
  habitXP: 1,
  habitHP: 1,
  habitTiers: [
    {
      minShare: 0,
      cost: 2,
    },
    {
      minShare: 0.3333333333333333,
      cost: 1,
    },
    {
      minShare: 0.6666666666666666,
      cost: 0,
    },
  ],
  missedDeadlineHP: 1,
  maxHPLossPerDay: 2,
  restDaysPerMonth: 4,
  threatPerArc: 1,
  maxThreat: 4,
};
const settingsMd = (settings) =>
  "```json taskrpg-settings\n" + JSON.stringify(settings, null, 2) + "\n```\n";
const S = (overrides) => ({ ...note, ...overrides });

// 2026-10-12 is a Monday.
const D = {
  mon: "2026-10-12",
  tue: "2026-10-13",
  wed: "2026-10-14",
  thu: "2026-10-15",
  fri: "2026-10-16",
  sat: "2026-10-17",
  sun: "2026-10-18",
  nextMon: "2026-10-19",
};
const at = (day, time = "09:00") => `${day}T${time}:00+11:00`;
const task = (day, time, o = {}) => ({
  type: "task_done",
  timestamp: at(day, time),
  skill: "craft",
  size: "small",
  planned: true,
  roll: [4, 4],
  lootRoll: 1,
  ...o,
});
const habit = (day, time, o = {}) => ({
  type: "habit_done",
  timestamp: at(day, time),
  habitId: "morning",
  skill: "vitality",
  onTime: true,
  ...o,
});
const ev = (type, day, time, o = {}) => ({
  type,
  timestamp: at(day, time),
  ...o,
});
const missed = (day, habitId = "a", time = "10:00") =>
  ev("missed_deadline", day, time, { habitId });

function play(settings, actions) {
  let events = [];
  const results = [];
  let state;
  for (const action of actions) {
    ({ events, state } = E.recordAction(events, action, settings));
    results.push(E.recalculate(events, settings).results[events.at(-1).id]);
  }
  return { events, results, state };
}
const last = (run) => run.results.at(-1);

// Level 5 after 4 XP, level 10 after 9 XP.
const FAST = S({ maxMP: 100, xpThresholds: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] });
// 2 HP, so one day of missed deadlines wounds you.
const FRAGILE = S({
  maxHP: 2,
  hpPenalties: [
    { minHP: 1, penalty: 0 },
    { minHP: 0, penalty: 3 },
  ],
});

describe("engine.test.js", () => {
  describe("day and MP", () => {
    test("day rolls over at 4:00 AM", () => {
      assert.equal(E.gameDay("2026-10-13T03:59:00+11:00", 4), D.mon);
      assert.equal(E.gameDay("2026-10-13T04:00:00+11:00", 4), D.tue);
      assert.equal(play(note, [habit(D.tue, "01:00")]).state.day, D.mon);
    });

    test("MP is 10 and refills each morning", () => {
      const run = play(note, [
        task(D.mon, "09:00", { size: "medium" }),
        task(D.tue, "09:00"),
      ]);
      assert.equal(run.results[0].mp, 7);
      assert.equal(run.results[1].mp, 9);
      const mon = run.events.slice(0, 2);
      assert.equal(E.recalculate(mon, note).state.MP, 7);
      assert.equal(E.recalculate(mon, note, at(D.tue, "04:00")).state.MP, 10);
    });

    test("task MP cost by size, unplanned and wounded surcharges", () => {
      const costs = ["small", "medium", "large"].map(
        (size) => last(play(note, [task(D.mon, "09:00", { size })])).mpCost,
      );
      assert.deepEqual(costs, [1, 3, 5]);
      assert.equal(
        last(
          play(note, [
            task(D.mon, "09:00", { size: "medium", planned: false }),
          ]),
        ).mpCost,
        4,
      );
      // surcharge applies at 0 HP only, not at 1 HP
      assert.equal(
        last(
          play(FRAGILE, [
            missed(D.mon),
            missed(D.mon, "b"),
            task(D.mon, "12:00"),
          ]),
        ).mpCost,
        2,
      );
      assert.equal(
        last(play(FRAGILE, [missed(D.mon), task(D.mon, "12:00")])).mpCost,
        1,
      );
    });

    test("skill levels 5 and 10 take 1 MP off each; never below 1; only the task's own skill counts", () => {
      const big = (t, o) => task(D.mon, t, { size: "large", ...o });
      const run = play(FAST, [
        big("09:00"),
        big("09:01"),
        big("09:02"),
        task(D.mon, "09:03"),
        big("09:04", { skill: "mind" }),
      ]);
      assert.deepEqual(
        run.results.map((r) => r.mpCost),
        [5, 4, 3, 1, 5],
      );
    });

    test("an empty log gives the starting State.json", () => {
      const skills = (v) => ({
        focus: v,
        vitality: v,
        craft: v,
        mind: v,
        presence: v,
      });
      assert.deepEqual(E.recalculate([], note).state, {
        day: null,
        HP: 10,
        MP: 10,
        skillXP: skills(0),
        projectThreat: {},
        focus: null,
        habits: {},
        hpLostByDay: {},
        restDays: [],
        pauses: [],
        maxHP: 10,
        maxMP: 10,
        levels: skills(1),
        diceBonus: skills(0),
        wounded: false,
        paused: false,
      });
    });
  });

  describe("overdraft", () => {
    test("overdraft: keep going at 0 MP, XP halved (rounded up), Tired -1, HP untouched", () => {
      const run = play(note, [
        task(D.mon, "09:00", { size: "large" }),
        task(D.mon, "09:01", { size: "large" }),
        task(D.mon, "09:02", { size: "medium", important: true, roll: [3, 3] }),
      ]);
      assert.equal(run.results[1].overdraft, false);
      const r = last(run);
      // 3 + 3, +1 for craft level 2, -1 Tired
      assert.deepEqual(
        [r.overdraft, r.xp, r.tired, r.total, r.outcome],
        [true, 3, 1, 6, "partial"],
      );
      assert.equal(run.state.HP, 10);
      assert.equal(run.state.MP, 0);
    });

    test("overdraft starts when the cost is more than the MP left, not only at 0 MP", () => {
      const run = play(note, [
        task(D.mon, "09:00", { size: "large" }),
        task(D.mon, "09:01", { size: "medium" }),
        task(D.mon, "09:02", { size: "medium" }),
      ]);
      assert.equal(run.results[1].mp, 2);
      const r = last(run);
      // medium = 3 XP, halved = 1.5, rounded up = 2; MP cannot go below 0
      assert.deepEqual([r.overdraft, r.xp, r.mp], [true, 2, 0]);
    });
  });

  describe("XP, levels and focus", () => {
    test("task XP: size plus bonuses added together, focus bonus only for the focused project", () => {
      const xp = (o, extra = []) =>
        last(
          play(note, [
            ...extra,
            task(D.mon, "09:00", { size: "medium", ...o }),
          ]),
        ).xp;
      assert.equal(xp({}), 3);
      assert.equal(xp({ important: true }), 5);
      assert.equal(xp({ urgent: true }), 5);
      assert.equal(xp({ important: true, urgent: true }), 6);
      const focus = ev("focus_project", D.mon, "08:00", { projectId: "p" });
      assert.equal(
        xp({ important: true, urgent: true, projectId: "p" }, [focus]),
        7,
      );
      assert.equal(xp({ projectId: "other" }, [focus]), 3);
    });

    test("habit XP is the full habitXP per press, even at 0 MP (no overdraft halving)", () => {
      // habitXP 4 so that halving would visibly change it (1 halved and rounded up is still 1).
      const run = play(S({ habitXP: 4 }), [
        task(D.mon, "09:00", { size: "large" }),
        task(D.mon, "09:01", { size: "large" }),
        habit(D.mon, "09:02"),
      ]);
      assert.equal(last(run).xp, 4);
      assert.equal(run.state.MP, 0);
      assert.equal(run.state.skillXP.vitality, 4);
    });

    test("levels at the XP thresholds, and the dice bonus they give", () => {
      const big = (t) => task(D.mon, t, { size: "large" });
      const one = play(note, [big("09:00")]);
      assert.equal(one.state.levels.craft, 1);
      const two = play(note, [
        big("09:00"),
        big("09:01"),
        task(D.tue, "09:00", { roll: [4, 4] }),
      ]);
      assert.equal(
        E.recalculate(two.events.slice(0, 3), note).state.levels.craft,
        2,
      );
      assert.equal(
        E.recalculate(two.events.slice(0, 3), note).state.diceBonus.craft,
        1,
      );
      assert.deepEqual([last(two).total, last(two).outcome], [9, "success"]);
    });

    test("weekly focus runs Monday to Sunday and starts when it is set", () => {
      const focus = ev("focus_project", D.wed, "08:00", { projectId: "p" });
      const xp = (day) =>
        last(
          play(note, [
            focus,
            task(day, "09:00", { size: "medium", projectId: "p" }),
          ]),
        ).xp;
      // 3 XP x 1.25 = 3.75, rounded up = 4
      assert.deepEqual([xp(D.fri), xp(D.sun), xp(D.nextMon)], [4, 4, 3]);
    });

    test("dice bonus stacks: +1 for every listed level reached", () => {
      // FAST: one large task is 5 XP = level 6, so levels 2, 4 and 6 all count = +3
      const run = play(FAST, [
        task(D.mon, "09:00", { size: "large" }),
        task(D.mon, "09:01", { roll: [3, 3] }),
      ]);
      assert.equal(run.state.diceBonus.craft, 3);
      assert.deepEqual([last(run).total, last(run).outcome], [9, "success"]);
    });
  });

  describe("rolls, threat and loot", () => {
    test("roll outcomes at the base thresholds, with no project", () => {
      const outcome = (roll) =>
        last(play(note, [task(D.mon, "09:00", { roll })])).outcome;
      assert.deepEqual(
        [
          [6, 6],
          [4, 5],
          [4, 4],
          [3, 3],
          [2, 3],
          [1, 1],
        ].map(outcome),
        ["success", "success", "partial", "partial", "setback", "setback"],
      );
    });

    test("project threat raises every threshold, +1 per arc, capped at +4", () => {
      const arcs = (n) =>
        Array.from({ length: n }, (_, i) =>
          ev("arc_completed", D.mon, `08:0${i}`, { projectId: "p" }),
        );
      const roll = (n, dice) =>
        last(
          play(note, [
            ...arcs(n),
            task(D.mon, "09:00", { projectId: "p", roll: dice }),
          ]),
        );
      assert.equal(roll(3, [6, 6]).outcome, "success");
      assert.equal(roll(4, [6, 6]).outcome, "partial");
      assert.equal(roll(4, [4, 5]).outcome, "setback");
      assert.equal(roll(5, [6, 6]).threat, 4);
      assert.equal(
        last(play(note, [...arcs(4), task(D.mon, "09:00", { roll: [4, 5] })]))
          .outcome,
        "success",
      );
    });

    test("loot: only a success with a 5 or 6 on the loot die drops", () => {
      const loot = (roll, lootRoll) =>
        last(play(note, [task(D.mon, "09:00", { roll, lootRoll })])).loot;
      assert.deepEqual(
        [loot([6, 6], 5), loot([6, 6], 6), loot([6, 6], 4), loot([3, 3], 6)],
        [true, true, false, false],
      );
    });

    test("a roll never changes the task's XP or MP", () => {
      const win = last(play(note, [task(D.mon, "09:00", { roll: [6, 6] })]));
      const lose = last(play(note, [task(D.mon, "09:00", { roll: [1, 1] })]));
      assert.deepEqual([win.xp, win.mpCost], [lose.xp, lose.mpCost]);
    });
  });

  describe("HP and Wounded", () => {
    test("HP: on-time habit restores 1 (max 10), late press earns XP but no HP and no on-time day", () => {
      const onTime = play(note, [
        missed(D.mon),
        habit(D.mon, "12:00"),
        habit(D.mon, "12:01"),
      ]);
      assert.deepEqual(
        [onTime.results[1].hp, onTime.results[2].hp, onTime.state.HP],
        [1, 0, 10],
      );
      const late = play(note, [
        missed(D.mon),
        habit(D.mon, "12:00", { onTime: false }),
      ]);
      assert.deepEqual(
        [
          late.state.HP,
          late.results[1].xp,
          late.state.habits.morning.onTimeDays,
        ],
        [9, 1, []],
      );
    });

    test("missed deadline costs 1 HP, max 2 a day", () => {
      const run = play(note, [
        missed(D.mon, "a"),
        missed(D.mon, "b"),
        missed(D.mon, "c"),
      ]);
      assert.deepEqual(
        run.results.map((r) => r.hpLost),
        [1, 1, 0],
      );
      assert.equal(run.state.HP, 8);
    });

    test("missed deadlines are exempt on weekends, rest days and pause", () => {
      assert.equal(play(note, [missed(D.sat)]).state.HP, 10);
      assert.equal(
        play(note, [ev("rest_day", D.tue, "08:00"), missed(D.tue)]).state.HP,
        10,
      );
      assert.equal(
        play(note, [
          missed(D.tue),
          ev("rest_day", D.wed, "09:00", { day: D.tue }),
        ]).state.HP,
        10,
      );
      const paused = [
        ev("pause", D.mon, "08:00"),
        missed(D.wed),
        ev("resume", D.thu, "06:00"),
      ];
      assert.equal(play(note, paused).state.HP, 10);
      assert.equal(play(note, [...paused, missed(D.thu)]).state.HP, 9);
    });

    test("dice penalty by HP, and Wounded at 0 HP", () => {
      const days = [D.mon, D.tue, D.wed, D.thu, D.fri];
      const actions = days.flatMap((day) => [
        missed(day, "a"),
        missed(day, "b"),
        task(day, "12:00", { size: "small" }),
      ]);
      const run = play(note, actions);
      const rolls = run.results.filter((r) => r.hpPenalty !== undefined);
      assert.deepEqual(
        rolls.map((r) => r.hpPenalty),
        [0, 1, 1, 2, 3],
      );
      assert.equal(run.state.HP, 0);
      assert.equal(run.state.wounded, true);
    });

    test("Wounded: habits are exempt from the surcharge, and one on-time habit lifts it", () => {
      const run = play(FRAGILE, [
        missed(D.mon, "a"),
        missed(D.mon, "b"),
        habit(D.mon, "12:00"),
      ]);
      assert.equal(last(run).mpCost, 2);
      assert.deepEqual([run.state.HP, run.state.wounded], [1, false]);
    });

    test("HP never drops below 0, and hpLost is what was actually lost", () => {
      const run = play(
        { ...FRAGILE, missedDeadlineHP: 5, maxHPLossPerDay: 5 },
        [missed(D.mon)],
      );
      assert.deepEqual([run.state.HP, run.results[0].hpLost], [0, 2]);
    });
  });

  describe("habits, rest days and pause", () => {
    test("habit MP cost by on-time share of eligible days; new habit costs 2", () => {
      const three = S({ habitWindowDays: 3 });
      const cost = (settings, actions, day = D.thu) =>
        last(play(settings, [...actions, habit(day, "07:00")])).mpCost;
      const on = (day) => habit(day, "07:00");
      const late = (day) => habit(day, "07:00", { onTime: false });
      assert.equal(cost(note, [], D.mon), 2);
      assert.equal(cost(three, []), 2);
      assert.equal(cost(three, [on(D.mon)]), 1);
      assert.equal(cost(three, [on(D.mon), on(D.tue)]), 0);
      assert.equal(cost(three, [on(D.mon), on(D.tue), on(D.wed)]), 0);
      assert.equal(cost(three, [late(D.mon), late(D.tue), on(D.wed)]), 1);
      assert.equal(cost(S({ habitWindowDays: 4 }), [on(D.mon)], D.fri), 2);
    });

    test("habit measure: weekends count only if done on time; rest and pause days are left out", () => {
      const three = S({ habitWindowDays: 3 });
      const cost = (actions, day) =>
        last(play(three, [...actions, habit(day, "07:00")])).mpCost;
      const on = (day) => habit(day, "06:00");
      assert.equal(cost([], D.nextMon), 2);
      assert.equal(cost([on(D.fri)], D.nextMon), 0);
      assert.equal(
        cost([on(D.fri), habit(D.sat, "06:00", { onTime: false })], D.nextMon),
        0,
      );
      assert.equal(cost([on(D.mon)], D.thu), 1);
      const rest = [
        ev("rest_day", D.tue, "08:00"),
        ev("rest_day", D.wed, "08:00"),
      ];
      assert.equal(cost([on(D.mon), ...rest], D.thu), 0);
      const pause = [ev("pause", D.mon, "12:00"), ev("resume", D.thu, "05:00")];
      assert.equal(cost([on(D.mon), ...pause], D.thu), 0);
    });

    test("rest days: 4 a month (the count resets next month), one per day, no HP loss", () => {
      const rest = (day) => ev("rest_day", day, "08:00");
      const four = [D.mon, D.tue, D.wed, D.thu].map(rest);
      assert.equal(play(note, four).state.restDays.length, 4);
      assert.throws(() => play(note, [...four, rest(D.fri)]), /limit/);
      assert.equal(
        play(note, [...four, rest("2026-11-02")]).state.restDays.length,
        5,
      );
      assert.throws(
        () => play(note, [rest(D.mon), rest(D.mon)]),
        /already logged/,
      );
      assert.equal(
        play(note, [ev("rest_day", D.mon, "08:00"), missed(D.mon)]).state.HP,
        10,
      );
    });

    test("pause and resume set the paused flag; bad sequences are rejected", () => {
      const run = play(note, [ev("pause", D.mon, "08:00")]);
      assert.equal(run.state.paused, true);
      assert.throws(
        () =>
          play(note, [
            ev("pause", D.mon, "08:00"),
            ev("pause", D.tue, "08:00"),
          ]),
        /already paused/,
      );
      assert.throws(
        () => play(note, [ev("resume", D.mon, "08:00")]),
        /not paused/,
      );
      assert.equal(
        play(note, [ev("pause", D.mon, "08:00"), ev("resume", D.fri, "08:00")])
          .state.paused,
        false,
      );
    });
  });

  describe("settings", () => {
    test("settings change applies from its time and never rewrites the past", () => {
      const dearer = S({
        taskSizes: { ...note.taskSizes, small: { mp: 2, xp: 1 } },
      });
      let { events } = E.recordAction([], task(D.mon, "09:00"), note);
      assert.equal(
        events.filter((e) => e.type === "settings_changed").length,
        1,
      );
      const edited = E.recalculate(events, dearer);
      assert.equal(edited.pendingSettingsChange, true);
      assert.equal(edited.results[events.at(-1).id].mpCost, 1);
      const next = E.recordAction(
        events,
        task(D.tue, "09:00"),
        dearer,
        at(D.tue, "08:00"),
      );
      events = next.events;
      assert.equal(
        events.filter((e) => e.type === "settings_changed").length,
        2,
      );
      assert.equal(next.result.mpCost, 2);
      const replay = E.recalculate(events, dearer);
      assert.equal(replay.pendingSettingsChange, false);
      assert.equal(replay.results[events[1].id].mpCost, 1);
    });

    test("settings are validated with a clear message", () => {
      assert.throws(
        () => E.validateSettings({ ...note, maxMP: 0 }),
        /maxMP must be a whole number from 1 to 100/,
      );
      assert.throws(
        () =>
          E.validateSettings({
            ...note,
            xpThresholds: [0, 10, 5, 45, 70, 100, 140, 190, 250, 320],
          }),
        /xpThresholds/,
      );
      assert.throws(
        () => E.validateSettings({ ...note, successAt: 5 }),
        /successAt/,
      );
      assert.throws(
        () => E.validateSettings({ ...note, taskSizes: {} }),
        /taskSizes/,
      );
      assert.throws(
        () => E.validateSettings({ ...note, lootDropRolls: [7] }),
        /lootDropRolls/,
      );
      assert.throws(
        () =>
          E.validateSettings({
            ...note,
            hpPenalties: [{ minHP: 1, penalty: 0 }],
          }),
        /hpPenalties/,
      );
      assert.throws(
        () =>
          E.validateSettings({
            ...note,
            habitTiers: [{ minShare: 0.5, cost: 1 }],
          }),
        /habitTiers/,
      );
      assert.throws(
        () => E.parseSettingsNote("no block here"),
        /taskrpg-settings/,
      );
      assert.throws(
        () => E.parseSettingsNote("```json taskrpg-settings\n{oops\n```"),
        /not valid|invalid/i,
      );
    });

    test("lowering max HP or MP trims what you currently have", () => {
      const smaller = S({
        maxHP: 5,
        maxMP: 5,
        hpPenalties: [
          { minHP: 3, penalty: 0 },
          { minHP: 0, penalty: 1 },
        ],
      });
      const before = play(note, [
        missed(D.mon),
        task(D.mon, "11:00", { size: "medium" }),
      ]);
      assert.deepEqual([before.state.HP, before.state.MP], [9, 7]);
      const after = E.recordAction(
        before.events,
        task(D.mon, "11:05"),
        smaller,
      );
      assert.deepEqual([after.state.HP, after.state.MP], [5, 4]);
    });

    test("the live Settings.md is present and valid", () => {
      const live = E.parseSettingsNote(
        fs.readFileSync(LIVE_SETTINGS_FILE, "utf8"),
      );
      assert.doesNotThrow(() => E.validateSettings(live));
    });
  });

  describe("undo", () => {
    test("undo adds a correcting line, reverses MP, XP and HP, and keeps history", () => {
      const before = play(note, [
        missed(D.mon),
        habit(D.mon, "09:00"),
        task(D.mon, "09:05", { size: "medium" }),
      ]);
      const undone = E.recordAction(
        before.events,
        ev("undo", D.mon, "09:10"),
        note,
      );
      assert.equal(undone.state.MP, 10 - 2);
      assert.equal(undone.state.skillXP.craft, 0);
      assert.deepEqual(
        undone.events.slice(0, before.events.length),
        before.events,
      );
      assert.equal(undone.events.at(-1).type, "undo");
      const habitUndone = E.recordAction(
        undone.events,
        ev("undo", D.mon, "09:11"),
        note,
      );
      assert.deepEqual(
        [
          habitUndone.state.HP,
          habitUndone.state.MP,
          habitUndone.state.skillXP.vitality,
        ],
        [9, 10, 0],
      );
      assert.throws(
        () =>
          E.recordAction(habitUndone.events, ev("undo", D.mon, "09:12"), note),
        /Nothing to undo/,
      );
    });

    test("undo is same-day and newest-first only", () => {
      const run = play(note, [task(D.mon, "09:00"), task(D.mon, "09:01")]);
      const [older, newest] = run.events.slice(1); // events[0] is the settings_changed line
      // Both rules share one message, so each case breaks only one rule.
      const rule =
        /undo must reverse the newest task or habit action from the same game day/;
      // same day, but not the newest action
      assert.throws(
        () =>
          E.recordAction(
            run.events,
            ev("undo", D.mon, "09:02", { targetEventId: older.id }),
            note,
          ),
        rule,
      );
      // the newest action, but undone on a later game day
      assert.throws(
        () =>
          E.recordAction(
            run.events,
            ev("undo", D.tue, "09:00", { targetEventId: newest.id }),
            note,
          ),
        rule,
      );
      // nothing to undo on that day
      assert.throws(
        () => E.recordAction(run.events, ev("undo", D.tue, "09:00"), note),
        /Nothing to undo/,
      );
    });

    test("pressing Done again after an undo is a fresh roll flagged as a repeat", () => {
      const run = play(note, [
        task(D.mon, "09:00", { taskId: "t1", roll: [1, 1] }),
        ev("undo", D.mon, "09:01"),
        task(D.mon, "09:02", { taskId: "t1", roll: [6, 6] }),
      ]);
      const again = last(run);
      assert.deepEqual([again.repeat, again.outcome], [true, "success"]);
      assert.equal(run.results[0].repeat, false);
      assert.equal(run.state.skillXP.craft, 1);
    });
  });

  describe("back-fill", () => {
    test("back-fill adds a missed deadline for closed blocks with no on-time press", () => {
      const run = play(note, [
        habit(D.mon, "08:00"),
        habit(D.tue, "11:00", { onTime: false }),
      ]);
      const deadlines = [D.mon, D.tue, D.wed]
        .map((d) => ({ habitId: "morning", deadline: at(d, "10:00") }))
        .concat({ habitId: "evening", deadline: at(D.mon, "21:00") });
      const found = E.backfillMissedDeadlines(
        run.events,
        deadlines,
        note,
        at(D.wed, "09:00"),
      );
      assert.deepEqual(
        found.map((e) => e.id),
        [
          `missed:morning:${at(D.tue, "10:00")}`,
          `missed:evening:${at(D.mon, "21:00")}`,
        ],
      );
      let events = run.events;
      for (const event of found)
        events = E.recordAction(events, event, note).events;
      assert.equal(E.recalculate(events, note).state.HP, 8);
      assert.deepEqual(
        E.backfillMissedDeadlines(events, deadlines, note, at(D.wed, "09:00")),
        [],
      );
    });

    test("back-fill skips weekend, rest-day and paused deadlines", () => {
      const run = play(note, [
        ev("rest_day", D.tue, "08:00"),
        ev("pause", D.wed, "08:00"),
        ev("resume", D.thu, "05:00"),
      ]);
      const deadlines = [D.mon, D.tue, D.wed, D.sat].map((d) => ({
        habitId: "a",
        deadline: at(d, "10:00"),
      }));
      // now is after every deadline, so only the ordinary Monday can be missed
      const found = E.backfillMissedDeadlines(
        run.events,
        deadlines,
        note,
        at(D.nextMon, "09:00"),
      );
      assert.deepEqual(
        found.map((e) => e.id),
        [`missed:a:${at(D.mon, "10:00")}`],
      );
    });
  });

  describe("terminal and helpers", () => {
    test("recalc from the terminal gives identical results every time", () => {
      const dir = fs.mkdtempSync(path.join(os.tmpdir(), "taskrpg-"));
      try {
        const run = play(note, [
          missed(D.mon),
          habit(D.mon, "12:00"),
          task(D.tue, "09:00", { size: "medium", important: true }),
        ]);
        const eventsFile = path.join(dir, "Events.jsonl");
        const stateFile = path.join(dir, "State.json");
        const settingsFile = path.join(dir, "Settings.md");
        fs.writeFileSync(settingsFile, settingsMd(note));
        fs.writeFileSync(
          eventsFile,
          `${run.events.map((e) => JSON.stringify(e)).join("\n")}\n`,
        );
        const args = [
          path.join(__dirname, "engine.js"),
          "recalc",
          eventsFile,
          settingsFile,
          stateFile,
          `--now=${at(D.wed, "09:00")}`,
        ];
        const first = execFileSync(process.execPath, args, {
          encoding: "utf8",
        });
        assert.equal(
          execFileSync(process.execPath, args, { encoding: "utf8" }),
          first,
        );
        assert.equal(fs.readFileSync(stateFile, "utf8"), first);
        const state = JSON.parse(first);
        assert.deepEqual(
          state,
          JSON.parse(
            JSON.stringify(
              E.recalculate(run.events, note, at(D.wed, "09:00")).state,
            ),
          ),
        );
        // and the numbers themselves are right: missed -1 HP, on-time habit +1 HP, medium important task = 5 craft XP, new day refills MP
        assert.deepEqual(
          [
            state.HP,
            state.MP,
            state.day,
            state.skillXP.craft,
            state.skillXP.vitality,
          ],
          [10, 10, D.wed, 5, 1],
        );
      } finally {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });

    test("recalc from the terminal reports errors on stderr and exits 1", () => {
      const run = () =>
        execFileSync(
          process.execPath,
          [path.join(__dirname, "engine.js"), "bogus"],
          { stdio: "pipe" },
        );
      assert.throws(
        run,
        (error) => error.status === 1 && /Usage/.test(error.stderr.toString()),
      );
    });

    test("bad logs fail clearly", () => {
      const ok = task(D.mon, "09:00", { id: "x" });
      assert.throws(() => E.recalculate([ok, ok], note), /Duplicate event id/);
      assert.throws(
        () =>
          E.recalculate(
            [{ id: "y", type: "dance", timestamp: at(D.mon) }],
            note,
          ),
        /unknown type/,
      );
      assert.throws(
        () => E.recalculate([{ ...ok, timestamp: "yesterday" }], note),
        /Invalid timestamp/,
      );
    });

    test("bad actions are rejected before they reach the log", () => {
      const bad = [
        [task(D.mon, "09:00", { skill: "baking" }), /unknown skill/],
        [task(D.mon, "09:00", { size: "huge" }), /unknown size/],
        [
          task(D.mon, "09:00", { planned: "yes" }),
          /planned must be true or false/,
        ],
        [task(D.mon, "09:00", { roll: [7, 1] }), /roll must be two dice/],
        [
          task(D.mon, "09:00", { lootRoll: 7 }),
          /lootRoll must be a die result/,
        ],
        [
          habit(D.mon, "09:00", { onTime: "yes" }),
          /onTime must be true or false/,
        ],
        [habit(D.mon, "09:00", { habitId: "" }), /habitId is required/],
        [missed(D.mon, ""), /habitId is required/],
        [ev("rest_day", D.mon, "08:00", { day: "not-a-date" }), /invalid day/],
        [ev("arc_completed", D.mon, "08:00"), /projectId is required/],
      ];
      for (const [action, message] of bad)
        assert.throws(() => E.recordAction([], action, note), message);
    });

    test("event log text: comments, fences and blank lines are skipped; bad lines report their number", () => {
      const line = JSON.stringify(task(D.mon, "09:00", { id: "x" }));
      assert.equal(
        E.parseEvents(`# log\n\n\`\`\`\n${line}\n\`\`\`\n`).length,
        1,
      );
      assert.throws(
        () => E.parseEvents(`${line}\n{oops`),
        /line 2 is not valid JSON/,
      );
    });

    test("localStamp is ISO with an offset the engine accepts", () => {
      const stamp = E.localStamp(new Date("2026-10-13T17:00:00Z"));
      assert.match(
        stamp,
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/,
      );
      assert.equal(Date.parse(stamp), Date.parse("2026-10-13T17:00:00Z"));
      assert.doesNotThrow(() => E.gameDay(stamp, 4));
    });

    test("the engine loads with no fs, path or require (as in Obsidian on a phone)", () => {
      const module = { exports: {} };
      new Function(
        "module",
        "exports",
        fs.readFileSync(path.join(__dirname, "engine.js"), "utf8"),
      )(module, module.exports);
      assert.equal(typeof module.exports.recalculate, "function");
    });

    test("rollDice turns the rng into two d6 and a loot die, in that order", () => {
      const seq = [0, 0.2, 0.5];
      let i = 0;
      assert.deepEqual(
        E.rollDice(() => seq[i++]),
        { roll: [1, 2], lootRoll: 4 },
      );
      assert.deepEqual(
        E.rollDice(() => 0.999),
        { roll: [6, 6], lootRoll: 6 },
      );
    });
  });
});
