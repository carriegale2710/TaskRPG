## Active Quests
```dataview
TABLE status, xp, region
FROM "World/Quests"
WHERE status = "active"
```

## MP Trend (last 7 days)
```dataview
TABLE date, mp, energy
FROM "Journal"
WHERE type = "daily"
SORT date DESC
LIMIT 7
```