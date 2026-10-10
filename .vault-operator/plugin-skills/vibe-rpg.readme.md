# Life RPG

Life RPG is an Obsidian plugin that turns daily habits, water, rewards, XP, inventory, and simple wallet tracking into a compact RPG dashboard.

## Features

- Daily habits with XP progress.
- Hero profile, level, class, avatar, and radar stats.
- Quest/stat cards, including custom cards linked to one or more habits.
- Reward shop and inventory.
- Water tracking with daily goals.
- Wallet records for income and expenses.
- Home dashboard with calendar month navigation.
- Sidebar widget with daily progress.

## Privacy

Life RPG stores data locally in Obsidian plugin data. It does not use network requests, telemetry, ads, accounts, or external services.

## Support

If Life RPG helps your daily routine, you can support development with TON or USDT on the TON network:

```text
UQDm3RqcRQ_dUEjL9mYIDWDkzXuyIpTxaQ5bJ9qPAosa328q
```

Tonkeeper link:

```text
https://app.tonkeeper.com/transfer/UQDm3RqcRQ_dUEjL9mYIDWDkzXuyIpTxaQ5bJ9qPAosa328q?text=Life%20RPG%20support
```

Please send only assets on the TON network to this address.

## Installation

For beta testing, install this plugin through BRAT or manually copy the release files into:

```text
<your vault>/.obsidian/plugins/vibe-rpg/
```

Required release files:

- `main.js`
- `manifest.json`
- `styles.css`

Then enable **Life RPG** in Obsidian's Community plugins settings.

## Development

Install dependencies and build:

```bash
npm install
npm run build
```

Source code lives in `src/`. The bundled Obsidian plugin output is `main.js`.

## License

MIT
