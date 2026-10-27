"use strict";

const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const utils = require("./task-utils.js");

const FOLDER = "TaskNotes/Tasks";

const note = (taskId) => `---\ntaskId: ${taskId}\n---\n# Task\n`;

function vault(notes, folderExists = true) {
  return {
    exists: async () => folderExists,
    list: async () => ({ files: Object.keys(notes), folders: [] }),
    read: async (p) => notes[p],
  };
}

describe("task-utils.js findTaskNote", () => {
  test("returns the path when exactly one note matches", async () => {
    const files = vault({
      [`${FOLDER}/a.md`]: note("task-1"),
      [`${FOLDER}/b.md`]: note("task-2"),
    });

    assert.deepEqual(await utils.findTaskNote(files, FOLDER, "task-1"), {
      status: "found",
      path: `${FOLDER}/a.md`,
    });
  });

  test("ignores files that are not markdown notes", async () => {
    const files = vault({
      [`${FOLDER}/a.md`]: note("task-1"),
      [`${FOLDER}/copy.txt`]: note("task-1"),
    });

    assert.equal(
      (await utils.findTaskNote(files, FOLDER, "task-1")).status,
      "found",
    );
  });

  test("returns not_found when no note matches", async () => {
    const files = vault({ [`${FOLDER}/a.md`]: note("task-2") });

    assert.deepEqual(await utils.findTaskNote(files, FOLDER, "task-1"), {
      status: "not_found",
      path: "",
    });
  });

  test("returns folder_missing when the folder does not exist", async () => {
    const files = vault({}, false);

    assert.deepEqual(await utils.findTaskNote(files, FOLDER, "task-1"), {
      status: "folder_missing",
      path: "",
    });
  });

  test("returns ambiguous with no path when several notes match", async () => {
    const files = vault({
      [`${FOLDER}/a.md`]: note("task-1"),
      [`${FOLDER}/a copy.md`]: note("task-1"),
    });

    assert.deepEqual(await utils.findTaskNote(files, FOLDER, "task-1"), {
      status: "ambiguous",
      path: "",
    });
  });
});
