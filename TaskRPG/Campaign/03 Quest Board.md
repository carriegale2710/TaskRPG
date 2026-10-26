---
banner: "![[11d62031-1f5f-4dcf-81fc-1c28da0decb2.webp]]"
banner_y: 0.5
---
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