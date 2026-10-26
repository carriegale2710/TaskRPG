---
type: taskrpg-settings
status: step-1
---

# TaskRPG Settings

Every tunable number the engine uses lives in the JSON block below. The engine rejects values outside its allowed ranges and says which one is wrong. Changing a value here never rewrites the past: the next recorded action logs the change with its time, and earlier days keep the rules they were played under.

Placeholders from the build brief (adjust after play): XP thresholds, XP rounding (round up).

- `taskSizes`: MP cost and base XP per size.
- `mpDiscountLevels`: each listed level a skill has reached takes 1 MP off its tasks (so level 10 takes off 2). A task never costs less than `minTaskMP`.
- `diceBonusLevels`: each listed level reached adds +1 to that skill's roll.
- `xpThresholds`: total skill XP needed for levels 1 to 10.
- `hpPenalties`: dice penalty by HP, highest `minHP` first.
- `habitTiers`: habit MP cost by the share of eligible days done on time (last `habitWindowDays`). The share cut-offs are one third and two thirds.
- `successAt` / `partialAt`: roll totals for success and partial success, before project threat.
- `lootDropRolls`: loot die results (1 to 6) that drop loot on a success.

```json taskrpg-settings
{
  "skills": ["focus", "vitality", "craft", "mind", "presence"],
  "dayRolloverHour": 4,
  "maxHP": 10,
  "maxMP": 10,
  "taskSizes": {
    "small": { "mp": 1, "xp": 1 },
    "medium": { "mp": 3, "xp": 3 },
    "large": { "mp": 5, "xp": 5 }
  },
  "minTaskMP": 1,
  "unplannedMP": 1,
  "woundedMP": 1,
  "mpDiscountLevels": [5, 10],
  "overdraftXPFactor": 0.5,
  "tiredPenalty": 1,
  "xpBonus": { "important": 0.5, "urgent": 0.5, "focus": 0.25 },
  "xpThresholds": [0, 10, 25, 45, 70, 100, 140, 190, 250, 320],
  "diceBonusLevels": [2, 4, 6, 8, 10],
  "successAt": 9,
  "partialAt": 6,
  "lootDropRolls": [5, 6],
  "hpPenalties": [
    { "minHP": 7, "penalty": 0 },
    { "minHP": 4, "penalty": 1 },
    { "minHP": 1, "penalty": 2 },
    { "minHP": 0, "penalty": 3 }
  ],
  "habitWindowDays": 30,
  "habitXP": 1,
  "habitHP": 1,
  "habitTiers": [
    { "minShare": 0, "cost": 2 },
    { "minShare": 0.3333333333333333, "cost": 1 },
    { "minShare": 0.6666666666666666, "cost": 0 }
  ],
  "missedDeadlineHP": 1,
  "maxHPLossPerDay": 2,
  "restDaysPerMonth": 4,
  "threatPerArc": 1,
  "maxThreat": 4
}
```
