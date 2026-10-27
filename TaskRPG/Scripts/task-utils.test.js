"use strict";

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const utils = require("./task-utils.js");
const engine = require("./engine.js");

describe("task-utils.test.js", () => {
  describe("parseFrontmatter", () => {
    test("parses TaskNotes frontmatter", () => {
      const fields = utils.parseFrontmatter(
        [
          "---",
          "type: task",
          "taskId: abc",
          "scheduled: 2026-10-15",
          "tags: [urgent, important]",
          "---",
          "# Task",
        ].join("\n"),
      );

      assert.equal(fields.type, "task");
      assert.equal(fields.taskId, "abc");
      assert.equal(fields.scheduled, "2026-10-15");
      assert.deepEqual(utils.parseTags(fields.tags), ["urgent", "important"]);
      assert.equal(utils.hasTag(fields.tags, "urgent"), true);
      assert.equal(utils.hasTag(fields.tags, "important"), true);
    });

    test("parses TaskNotes tags written as a YAML block list", () => {
      const fields = utils.parseFrontmatter(
        [
          "---",
          "type: task",
          "tags:",
          " - task",
          " - important",
          " - #urgent",
          "---",
          "# Task",
        ].join("\n"),
      );

      assert.deepEqual(fields.tags, ["task", "important", "#urgent"]);
      assert.equal(utils.hasTag(fields.tags, "important"), true);
      assert.equal(utils.hasTag(fields.tags, "urgent"), true);
    });

    test("parses quoted flow-list tags without quotes", () => {
      const fields = utils.parseFrontmatter(
        '---\ntags: ["urgent", "important"]\n---\n# Task',
      );

      assert.deepEqual(utils.parseTags(fields.tags), ["urgent", "important"]);
    });

    test("matches tags case-insensitively and ignores prefixes", () => {
      assert.equal(utils.hasTag("#Urgent", "urgent"), true);
      assert.equal(utils.hasTag("urgently", "urgent"), false);
      assert.equal(utils.hasTag("Important", "important"), true);

      assert.deepEqual(utils.parseTags(null), []);
      assert.deepEqual(utils.parseTags(undefined), []);
      assert.deepEqual(utils.parseTags([]), []);
      assert.deepEqual(utils.parseTags(""), []);
    });

    test("strips quotes from scalar values", () => {
      const fields = utils.parseFrontmatter(
        "---\ntaskId: \"1\"\nscheduled: '2026-10-15'\nstatus: open\n---\n# Task",
      );

      assert.equal(fields.taskId, "1");
      assert.equal(fields.scheduled, "2026-10-15");
      assert.equal(fields.status, "open");
    });

    test("parses type, taskId, skill and size written in double quotes", () => {
      const fields = utils.parseFrontmatter(
        '---\ntype: "task"\ntaskId: "1"\nskill: "mind"\nsize: "medium"\n---\n# Task',
      );

      assert.equal(fields.type, "task");
      assert.equal(fields.taskId, "1");
      assert.equal(fields.skill, "mind");
      assert.equal(fields.size, "medium");
    });

    test("accepts quoted values the way task-done.js checks them", () => {
      const fields = utils.parseFrontmatter(
        '---\ntype: "task"\ntaskId: "1"\nskill: "mind"\nsize: "medium"\n---\n# Task',
      );
      const settings = {
        skills: ["mind"],
        taskSizes: { medium: { mp: 3, xp: 3 } },
      };

      assert.equal(fields.taskId, "1");
      assert.equal(settings.skills.includes(fields.skill), true);
      assert.equal(Boolean(settings.taskSizes[fields.size]), true);
    });

    test("single-quoted and unquoted values match double-quoted values", () => {
      const read = (note) => utils.parseFrontmatter(note);
      const values = [
        ["type", "task"],
        ["taskId", "1"],
        ["skill", "mind"],
        ["size", "m"],
      ];

      for (const [key, value] of values) {
        const doubleQuoted = read(`---\n${key}: "${value}"\n---\n# Task`);
        const singleQuoted = read(`---\n${key}: '${value}'\n---\n# Task`);
        const unquoted = read(`---\n${key}: ${value}\n---\n# Task`);

        assert.equal(doubleQuoted[key], value);
        assert.equal(singleQuoted[key], value);
        assert.equal(unquoted[key], value);
      }
    });

    test("parses an empty quoted value as an empty string", () => {
      const fields = utils.parseFrontmatter(
        "---\ncompletedDate: \"\"\nstatus: ''\n---\n# Task",
      );

      assert.equal(fields.completedDate, "");
      assert.equal(fields.status, "");
    });

    test("keeps a colon or quote inside a quoted value", () => {
      const fields = utils.parseFrontmatter(
        '---\nname: "a: b"\nnote: \'a "b"\'\n---\n# Task',
      );

      assert.equal(fields.name, "a: b");
      assert.equal(fields.note, 'a "b"');
    });

    test("handles CRLF, a leading BOM, empty and missing frontmatter", () => {
      const crlf = utils.parseFrontmatter(
        "---\r\ntags:\r\n - important\r\n---\r\n# Task",
      );
      assert.deepEqual(crlf.tags, ["important"]);

      const bom = utils.parseFrontmatter("\uFEFF---\ntype: task\n---\n# Task");
      assert.equal(bom.type, "task");

      assert.deepEqual(utils.parseFrontmatter("---\n---\n# Task"), {});
      assert.deepEqual(utils.parseFrontmatter("# Task"), {});
    });
  });

  describe("scheduled", () => {
    test("reads the TaskNotes scheduled date", () => {
      assert.equal(utils.scheduled({ scheduled: "2026-10-15" }), "2026-10-15");
      assert.equal(utils.scheduled({}), "");
    });
  });

  describe("planned today", () => {
    const gameDay = (timestamp) => engine.gameDay(timestamp, 4);

    test("uses the engine rollover hour: 01:00 is still the previous game day", () => {
      assert.equal(
        utils.isPlannedToday(
          "2026-10-15",
          gameDay("2026-10-16T01:00:00+11:00"),
        ),
        true,
      );
    });

    test("uses the engine rollover hour: 04:00 starts the new game day", () => {
      assert.equal(
        utils.isPlannedToday(
          "2026-10-15",
          gameDay("2026-10-16T04:00:00+11:00"),
        ),
        false,
      );
    });

    test("matches a scheduled value that includes a time", () => {
      assert.equal(
        utils.isPlannedToday(
          "2026-10-15T09:00",
          gameDay("2026-10-16T01:00:00+11:00"),
        ),
        true,
      );
    });

    test("matches a quoted scheduled value", () => {
      assert.equal(
        utils.isPlannedToday(
          '"2026-10-15"',
          gameDay("2026-10-16T01:00:00+11:00"),
        ),
        true,
      );
    });

    test("treats missing or empty scheduled values as unplanned", () => {
      const day = gameDay("2026-10-16T01:00:00+11:00");

      assert.equal(utils.isPlannedToday("", day), false);
      assert.equal(utils.isPlannedToday(undefined, day), false);
    });

    test("normalises scheduled values to their calendar date", () => {
      assert.equal(utils.scheduledDate("2026-10-15"), "2026-10-15");
      assert.equal(utils.scheduledDate("2026-10-15T09:00"), "2026-10-15");
      assert.equal(utils.scheduledDate('"2026-10-15"'), "2026-10-15");
      assert.equal(utils.scheduledDate(""), "");
      assert.equal(utils.scheduledDate(undefined), "");
    });
  });

  describe("result presentation", () => {
    const outcomes = Object.keys(utils.OUTCOME_TABLE);

    test("selects every placeholder table result for rolls 1 through 6", () => {
      for (const outcome of outcomes) {
        for (let lootRoll = 1; lootRoll <= 6; lootRoll += 1) {
          assert.equal(
            utils.pickTableResult(outcome, lootRoll),
            utils.OUTCOME_TABLE[outcome][lootRoll - 1],
            `${outcome} / loot roll ${lootRoll}`,
          );
        }
      }
    });

    test("rejects loot rolls outside 1 through 6", () => {
      for (const outcome of outcomes) {
        assert.throws(() => utils.pickTableResult(outcome, 0));
        assert.throws(() => utils.pickTableResult(outcome, 7));
      }
    });

    test("formats a basic result card without loot or overdraft", () => {
      const card = utils.formatResultCard({
        name: "Write tests",
        roll: [3, 4],
        total: 7,
        outcome: "partial",
        tableResult: "Progress comes at a cost.",
        xp: 3,
        mpCost: 3,
        mp: 7,
        loot: false,
        overdraft: false,
      });

      assert.match(card, /^# Write tests$/m);
      assert.match(card, /\*\*Roll:\*\* 3 \+ 4 = 7/);
      assert.match(card, /\*\*Outcome:\*\* partial/);
      assert.match(card, /Progress comes at a cost\./);
      assert.match(card, /\*\*XP:\*\* \+3/);
      assert.match(card, /\*\*MP:\*\* -3 \(now 7\)/);

      assert.doesNotMatch(card, /Loot/i);
      assert.doesNotMatch(card, /Tired/i);
    });

    test("formats a result card with loot", () => {
      const card = utils.formatResultCard({
        name: "Write tests",
        roll: [5, 5],
        total: 10,
        outcome: "success",
        tableResult: "You find something useful.",
        xp: 3,
        mpCost: 1,
        mp: 9,
        loot: true,
        overdraft: false,
      });

      assert.match(card, /\*\*Roll:\*\* 5 \+ 5 = 10/);
      assert.match(card, /\*\*Outcome:\*\* success/);
      assert.match(card, /You find something useful\./);
      assert.match(card, /\*\*XP:\*\* \+3/);
      assert.match(card, /\*\*MP:\*\* -1 \(now 9\)/);
      assert.match(card, /Loot/i);

      assert.doesNotMatch(card, /Tired/i);
    });

    test("formats a result card with an overdraft", () => {
      const card = utils.formatResultCard({
        name: "Write tests",
        roll: [2, 2],
        total: 4,
        outcome: "setback",
        tableResult: "The effort costs more than expected.",
        xp: 1,
        mpCost: 5,
        mp: 0,
        loot: false,
        overdraft: true,
      });

      assert.match(card, /\*\*Roll:\*\* 2 \+ 2 = 4/);
      assert.match(card, /\*\*Outcome:\*\* setback/);
      assert.match(card, /\*\*XP:\*\* \+1/);
      assert.match(card, /\*\*MP:\*\* -5 \(now 0\)/);
      assert.match(card, /Tired/i);

      assert.doesNotMatch(card, /Loot/i);
    });

    test("formats a result card with both loot and an overdraft", () => {
      const card = utils.formatResultCard({
        name: "Write tests",
        roll: [6, 6],
        total: 12,
        outcome: "success",
        tableResult: "A costly discovery.",
        xp: 6,
        mpCost: 6,
        mp: 0,
        loot: true,
        overdraft: true,
      });

      assert.match(card, /\*\*Roll:\*\* 6 \+ 6 = 12/);
      assert.match(card, /\*\*Outcome:\*\* success/);
      assert.match(card, /\*\*XP:\*\* \+6/);
      assert.match(card, /\*\*MP:\*\* -6 \(now 0\)/);
      assert.match(card, /Loot/i);
      assert.match(card, /Tired/i);
    });

    test("every table has six non-empty entries", () => {
      for (const outcome of outcomes) {
        const table = utils.OUTCOME_TABLE[outcome];

        assert.equal(Array.isArray(table), true, outcome);
        assert.equal(table.length, 6, outcome);
        for (const entry of table) {
          assert.equal(typeof entry, "string", outcome);
          assert.notEqual(entry.trim(), "", outcome);
        }
      }
    });

    test("rejects a roll that is not a whole number from 1 to 6", () => {
      const badRolls = [
        0,
        7,
        -1,
        1.5,
        "3",
        "",
        NaN,
        Infinity,
        undefined,
        null,
        [3],
      ];

      for (const outcome of outcomes) {
        for (const roll of badRolls) {
          assert.throws(
            () => utils.pickTableResult(outcome, roll),
            /Table roll must be 1 to 6/,
            `${outcome} / ${String(roll)}`,
          );
        }
      }
    });

    test("rejects an unknown outcome, and checks it before the roll", () => {
      const unknown = [
        "bogus",
        "",
        "Success",
        undefined,
        null,
        "constructor",
        "toString",
        "hasOwnProperty",
        "__proto__",
      ];

      for (const outcome of unknown) {
        assert.throws(
          () => utils.pickTableResult(outcome, 3),
          /Unknown outcome/,
          String(outcome),
        );
      }
      assert.throws(
        () => utils.pickTableResult("bogus", 99),
        /Unknown outcome/,
      );
    });

    test("every outcome the engine can return has a table, and every table is reachable", () => {
      const settings = {
        skills: ["mind"],
        dayRolloverHour: 4,
        maxHP: 10,
        maxMP: 10,
        taskSizes: { small: { mp: 1, xp: 1 } },
        minTaskMP: 1,
        unplannedMP: 1,
        woundedMP: 1,
        mpDiscountLevels: [],
        overdraftXPFactor: 0.5,
        tiredPenalty: 1,
        xpBonus: { important: 0.5, urgent: 0.5, focus: 0.25 },
        xpThresholds: [0, 10, 25, 45, 70, 100, 140, 190, 250, 320],
        diceBonusLevels: [],
        successAt: 9,
        partialAt: 6,
        lootDropRolls: [5, 6],
        hpPenalties: [{ minHP: 0, penalty: 0 }],
        habitWindowDays: 30,
        habitXP: 1,
        habitHP: 1,
        habitTiers: [{ minShare: 0, cost: 2 }],
        missedDeadlineHP: 1,
        maxHPLossPerDay: 2,
        restDaysPerMonth: 4,
        threatPerArc: 1,
        maxThreat: 4,
      };
      const seen = new Set();

      for (let a = 1; a <= 6; a += 1) {
        for (let b = 1; b <= 6; b += 1) {
          const { result } = engine.recordAction(
            [],
            {
              type: "task_done",
              timestamp: "2026-10-15T09:00:00+11:00",
              skill: "mind",
              size: "small",
              planned: true,
              roll: [a, b],
              lootRoll: 1,
            },
            settings,
          );
          seen.add(result.outcome);
        }
      }

      assert.deepEqual(
        [...seen].sort(),
        Object.keys(utils.OUTCOME_TABLE).sort(),
      );
    });

    test("lays out a result card line by line", () => {
      const card = utils.formatResultCard({
        name: "Write tests",
        roll: [3, 4],
        total: 7,
        outcome: "partial",
        tableResult: "Progress comes at a cost.",
        xp: 3,
        mpCost: 3,
        mp: 7,
        loot: false,
        overdraft: false,
      });

      assert.deepEqual(card.split("\n"), [
        "# Write tests",
        "",
        "**Roll:** 3 + 4 = 7",
        "**Outcome:** partial",
        "",
        "Progress comes at a cost.",
        "",
        "**XP:** +3",
        "**MP:** -3 (now 7)",
      ]);
    });

    test("puts the Tired line before the loot line, both after the MP line", () => {
      const lines = utils
        .formatResultCard({
          name: "Write tests",
          roll: [6, 6],
          total: 12,
          outcome: "success",
          tableResult: "A costly discovery.",
          xp: 6,
          mpCost: 6,
          mp: 0,
          loot: true,
          overdraft: true,
        })
        .split("\n");
      const at = (pattern) => lines.findIndex((line) => pattern.test(line));

      assert.ok(at(/\*\*MP:\*\*/) < at(/Tired/));
      assert.ok(at(/Tired/) < at(/Loot/));
    });

    test("shows a 0 MP cost as 0, not -0", () => {
      const card = utils.formatResultCard({
        name: "Write tests",
        roll: [4, 4],
        total: 8,
        outcome: "partial",
        tableResult: "The result is mixed but usable.",
        xp: 1,
        mpCost: 0,
        mp: 10,
        loot: false,
        overdraft: false,
      });

      assert.match(card, /^\*\*MP:\*\* 0 \(now 10\)$/m);
      assert.doesNotMatch(card, /-0/);
      assert.match(card, /\*\*XP:\*\* \+1/);
    });

    test("still shows a paid MP cost with a minus sign", () => {
      const card = utils.formatResultCard({
        name: "Write tests",
        roll: [1, 1],
        total: 2,
        outcome: "setback",
        tableResult: "The attempt stalls.",
        xp: 1,
        mpCost: 3,
        mp: 7,
        loot: false,
        overdraft: false,
      });

      assert.match(card, /^\*\*MP:\*\* -3 \(now 7\)$/m);
    });
  });

  describe("TaskNotes configuration", () => {
    const files = (text) => ({
      read: async () => {
        if (text === null) throw new Error("missing data.json");
        return text;
      },
    });

    test("taskFolder reads the configured folder and falls back to the default", async () => {
      const configured = JSON.stringify({
        tasksFolder: "/TaskNotes/Tasks/",
      });

      assert.equal(
        await utils.taskFolder(files(configured)),
        "TaskNotes/Tasks",
      );
      assert.equal(await utils.taskFolder(files(null)), "TaskNotes/Tasks");
      assert.equal(
        await utils.taskFolder(files("not json")),
        "TaskNotes/Tasks",
      );
    });

    test("taskTag reads the configured tag and falls back to 'task'", async () => {
      const configured = JSON.stringify({ taskTag: "#todo" });

      assert.equal(await utils.taskTag(files(configured)), "todo");
      assert.equal(await utils.taskTag(files(null)), "task");
      assert.equal(await utils.taskTag(files("not json")), "task");
    });
  });

  describe("updateTaskStatus", () => {
    test("updates completion fields without losing other fields", () => {
      const text =
        '---\ntype: task\ntaskId: abc\nstatus: done\ncompletedDate: ""\n---\n# Task';

      const updated = utils.updateTaskStatus(text, {
        status: "completed",
        completedDate: "2026-10-15T01:00:00+11:00",
      });
      const fields = utils.parseFrontmatter(updated);

      assert.equal(fields.status, "completed");
      assert.equal(fields.completedDate, "2026-10-15T01:00:00+11:00");
      assert.equal(fields.taskId, "abc");
    });

    test("inserts a missing completedDate into the frontmatter", () => {
      const text = "---\ntype: task\ntaskId: abc\nstatus: done\n---\n# Task";

      const updated = utils.updateTaskStatus(text, {
        status: "done",
        completedDate: "2026-10-15T01:00:00+11:00",
      });
      const fields = utils.parseFrontmatter(updated);

      assert.equal(fields.completedDate, "2026-10-15T01:00:00+11:00");
      assert.equal(fields.taskId, "abc");
      assert.equal(updated.endsWith("# Task"), true);
    });

    test("edits only the frontmatter, not a status line in the body", () => {
      const body = "# Task\n\nstatus: body-value\ncompletedDate: body-date";
      const text = `---\ntype: task\ntaskId: abc\n---\n${body}`;

      const updated = utils.updateTaskStatus(text, {
        status: "completed",
        completedDate: "2026-10-15T01:00:00+11:00",
      });

      assert.equal(utils.parseFrontmatter(updated).status, "completed");
      assert.equal(updated.endsWith(body), true);
      assert.match(updated, /^status: body-value$/m);
    });

    test("writes replacement-pattern characters literally", () => {
      const text =
        '---\ntype: task\nstatus: open\ncompletedDate: ""\n---\n# Task';

      const updated = utils.updateTaskStatus(text, {
        status: "$&",
        completedDate: "$1 and $&",
      });
      const fields = utils.parseFrontmatter(updated);

      assert.equal(fields.status, "$&");
      assert.equal(fields.completedDate, "$1 and $&");
    });

    test("writes an empty completedDate and keeps the status it is given", () => {
      const text = "---\ntype: task\ntaskId: abc\nstatus: done\n---\n# Task";

      const updated = utils.updateTaskStatus(text, {
        status: "done",
        completedDate: "",
      });
      const fields = utils.parseFrontmatter(updated);

      assert.equal(fields.status, "done");
      assert.equal(fields.completedDate, "");
    });

    test("preserves CRLF line endings when inserting a field", () => {
      const text =
        "---\r\ntype: task\r\ntaskId: abc\r\nstatus: done\r\n---\r\n# Task\r\n";

      const updated = utils.updateTaskStatus(text, {
        status: "done",
        completedDate: "2026-10-15T01:00:00+11:00",
      });

      assert.equal(
        utils.parseFrontmatter(updated).completedDate,
        "2026-10-15T01:00:00+11:00",
      );
      assert.equal(/[^\r]\n/.test(updated), false);
      assert.equal(updated.endsWith("---\r\n# Task\r\n"), true);
    });

    test("throws a clear error when there is no frontmatter to edit", () => {
      assert.throws(
        () =>
          utils.updateTaskStatus("# Task\n\nstatus: body-value", {
            status: "completed",
            completedDate: "2026-10-15T01:00:00+11:00",
          }),
        /frontmatter/i,
      );
    });
  });

  describe("reopenTaskNote", () => {
    test("reopens a note after undoing its task_done event", () => {
      const text =
        '---\ntype: task\ntaskId: abc\nstatus: done\ncompletedDate: "2026-10-15T01:00:00+11:00"\n---\n# Task';

      const updated = utils.reopenTaskNote(text);
      const fields = utils.parseFrontmatter(updated);

      assert.equal(fields.status, "open");
      assert.equal(fields.completedDate, "");
      assert.equal(fields.taskId, "abc");
      assert.equal(updated.endsWith("# Task"), true);
    });
  });

  describe("event log helpers", () => {
    const vault = (initial = {}) => {
      const store = new Map(Object.entries(initial));
      const reads = [];
      return {
        store,
        reads,
        exists: async (path) => store.has(path),
        read: async (path) => {
          reads.push(path);
          return store.get(path);
        },
        write: async (path, text) => {
          store.set(path, text);
        },
      };
    };
    const LOG = "TaskRPG/Engine/Events.md";
    const a = { id: "a", type: "habit_done" };
    const b = { id: "b", type: "undo" };
    const lineA = JSON.stringify(a);
    const lineB = JSON.stringify(b);

    describe("readLog", () => {
      test("returns an empty string without reading when the log does not exist", async () => {
        const files = vault();

        assert.equal(await utils.readLog(files, LOG), "");
        assert.deepEqual(files.reads, []);
      });

      test("returns the log text exactly as stored", async () => {
        const text = `${lineA}\r\n${lineB}\n\n`;
        const files = vault({ [LOG]: text });

        assert.equal(await utils.readLog(files, LOG), text);
      });

      test("returns an empty string for an existing empty log", async () => {
        const files = vault({ [LOG]: "" });

        assert.equal(await utils.readLog(files, LOG), "");
      });
    });

    describe("appendEvents", () => {
      test("writes one line with a trailing newline to an empty log", async () => {
        const files = vault();

        await utils.appendEvents(files, LOG, "", [a]);

        assert.equal(files.store.get(LOG), `${lineA}\n`);
      });

      test("treats a whitespace-only log as empty", async () => {
        const files = vault({ [LOG]: " \n\n" });

        await utils.appendEvents(files, LOG, " \n\n", [a]);

        assert.equal(files.store.get(LOG), `${lineA}\n`);
      });

      test("keeps leading whitespace on the first line", async () => {
        const previous = `  ${lineA}\n`;
        const files = vault({ [LOG]: previous });

        await utils.appendEvents(files, LOG, previous, [b]);

        assert.equal(files.store.get(LOG), `  ${lineA}\n${lineB}\n`);
      });

      test("appends after a log that ends with a newline without adding a blank line", async () => {
        const previous = `${lineA}\n`;
        const files = vault({ [LOG]: previous });

        await utils.appendEvents(files, LOG, previous, [b]);

        assert.equal(files.store.get(LOG), `${lineA}\n${lineB}\n`);
      });

      test("appends after a log that does not end with a newline", async () => {
        const previous = lineA;
        const files = vault({ [LOG]: previous });

        await utils.appendEvents(files, LOG, previous, [b]);

        assert.equal(files.store.get(LOG), `${lineA}\n${lineB}\n`);
      });

      test("collapses trailing blank lines into a single newline", async () => {
        const previous = `${lineA}\n\n\n`;
        const files = vault({ [LOG]: previous });

        await utils.appendEvents(files, LOG, previous, [b]);

        assert.equal(files.store.get(LOG), `${lineA}\n${lineB}\n`);
      });

      test("keeps CRLF lines already in the log and writes the new line with LF", async () => {
        const previous = `${lineA}\r\n`;
        const files = vault({ [LOG]: previous });

        await utils.appendEvents(files, LOG, previous, [b]);

        assert.equal(files.store.get(LOG), `${lineA}\n${lineB}\n`);
      });

      test("keeps CRLF between earlier lines untouched", async () => {
        const previous = `${lineA}\r\n${lineA}\r\n`;
        const files = vault({ [LOG]: previous });

        await utils.appendEvents(files, LOG, previous, [b]);

        assert.equal(files.store.get(LOG), `${lineA}\r\n${lineA}\n${lineB}\n`);
      });

      test("writes several events in order, one per line, with one trailing newline", async () => {
        const files = vault({ [LOG]: `${lineA}\n` });

        await utils.appendEvents(files, LOG, `${lineA}\n`, [b, a]);

        assert.equal(files.store.get(LOG), `${lineA}\n${lineB}\n${lineA}\n`);
      });

      test("writes only to the path it is given", async () => {
        const files = vault({ [LOG]: lineA, other: "keep" });

        await utils.appendEvents(files, "other", "keep", [b]);

        assert.equal(files.store.get(LOG), lineA);
        assert.equal(files.store.get("other"), `keep\n${lineB}\n`);
      });

      test("matches the log text the macros wrote before the helper existed", async () => {
        for (const previous of ["", lineA, `${lineA}\n`, `${lineA}\n\n`]) {
          const added = [a, b];
          const lines = added.map((e) => JSON.stringify(e)).join("\n") + "\n";
          const expected = `${previous.trimEnd()}${previous.trim() ? "\n" : ""}${lines}`;
          const files = vault({ [LOG]: previous });

          await utils.appendEvents(files, LOG, previous, added);

          assert.equal(
            files.store.get(LOG),
            expected,
            JSON.stringify(previous),
          );
        }
      });
    });
  });
});
