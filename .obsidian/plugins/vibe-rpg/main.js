var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/constants.js
var require_constants = __commonJS({
  "src/constants.js"(exports2, module2) {
    var APP_VIEW2 = "vibe-rpg-app-view";
    var SIDEBAR_VIEW2 = "vibe-rpg-sidebar-view";
    var AREA_LABELS2 = {
      body: "\u0422\u0435\u043B\u043E",
      mind: "\u0420\u0430\u0437\u0443\u043C",
      craft: "\u0414\u0435\u043B\u043E",
      control: "\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044C"
    };
    var MOODS2 = {
      low: "\u041D\u0438\u0437\u043A\u0430\u044F",
      normal: "\u041D\u043E\u0440\u043C",
      high: "\u0412\u044B\u0441\u043E\u043A\u0430\u044F"
    };
    var RARITIES2 = {
      common: "\u041E\u0431\u044B\u0447\u043D\u0430\u044F",
      rare: "\u0420\u0435\u0434\u043A\u0430\u044F",
      epic: "\u042D\u043F\u0438\u0447\u0435\u0441\u043A\u0430\u044F",
      legendary: "\u041B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u0430\u044F"
    };
    var HABIT_ICONS2 = ["\u{1F3CB}\uFE0F", "\u{1F6B6}", "\u{1F9D8}", "\u{1F3C3}", "\u{1F6B4}", "\u{1F9E0}", "\u{1F6E0}\uFE0F", "\u{1F6E1}\uFE0F", "\u{1F4DA}", "\u270D\uFE0F", "\u{1F3A7}", "\u{1F4A7}", "\u{1F9F9}", "\u{1F4AC}", "\u{1F3AF}", "\u{1F525}"];
    module2.exports = {
      APP_VIEW: APP_VIEW2,
      SIDEBAR_VIEW: SIDEBAR_VIEW2,
      AREA_LABELS: AREA_LABELS2,
      MOODS: MOODS2,
      RARITIES: RARITIES2,
      HABIT_ICONS: HABIT_ICONS2
    };
  }
});

// src/utils.js
var require_utils = __commonJS({
  "src/utils.js"(exports2, module2) {
    function clone(value) {
      return JSON.parse(JSON.stringify(value));
    }
    function dateKey2(date = /* @__PURE__ */ new Date()) {
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      return `${dd}.${mm}.${date.getFullYear()}`;
    }
    function timeKey(date = /* @__PURE__ */ new Date()) {
      return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    }
    function timeParts2(date = /* @__PURE__ */ new Date()) {
      return {
        hours: String(date.getHours()).padStart(2, "0"),
        minutes: String(date.getMinutes()).padStart(2, "0")
      };
    }
    function dayPhase2(date = /* @__PURE__ */ new Date()) {
      const hour = date.getHours();
      if (hour < 6) return "\u043D\u043E\u0447\u044C";
      if (hour < 12) return "\u0443\u0442\u0440\u043E";
      if (hour < 18) return "\u0434\u0435\u043D\u044C";
      return "\u0432\u0435\u0447\u0435\u0440";
    }
    function parseMoney2(value) {
      const normalized = String(value || "").replace(/[\s.']/g, "").replace(",", ".");
      const amount = Number(normalized);
      return Number.isFinite(amount) ? amount : NaN;
    }
    function formatMoney2(value) {
      const amount = Math.round(Number(value || 0));
      return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    function monthLabel2(date = /* @__PURE__ */ new Date()) {
      return date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
    }
    function dateFromKey2(key) {
      const [day, month, year] = String(key || "").split(".").map(Number);
      return new Date(year || 1970, (month || 1) - 1, day || 1);
    }
    function walletMonthLabel2(key) {
      const date = dateFromKey2(key);
      return date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
    }
    function calendarDays2(date = /* @__PURE__ */ new Date()) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const first = new Date(year, month, 1);
      const last = new Date(year, month + 1, 0);
      const offset = (first.getDay() + 6) % 7;
      const days = [];
      for (let i = 0; i < offset; i++) days.push(null);
      for (let day = 1; day <= last.getDate(); day++) days.push(day);
      return days;
    }
    function uid(prefix) {
      return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }
    module2.exports = {
      clone,
      dateKey: dateKey2,
      timeKey,
      timeParts: timeParts2,
      dayPhase: dayPhase2,
      parseMoney: parseMoney2,
      formatMoney: formatMoney2,
      monthLabel: monthLabel2,
      dateFromKey: dateFromKey2,
      walletMonthLabel: walletMonthLabel2,
      calendarDays: calendarDays2,
      uid
    };
  }
});

// src/config/questStatsConfig.js
var require_questStatsConfig = __commonJS({
  "src/config/questStatsConfig.js"(exports2, module2) {
    var QUEST_STATS_CARDS2 = [
      { id: "dailyXp", label: "XP \u0437\u0430 \u0434\u0435\u043D\u044C", enabled: true },
      { id: "minimum", label: "\u041C\u0438\u043D\u0438\u043C\u0443\u043C \u0434\u043D\u044F", enabled: true },
      { id: "total", label: "\u041F\u0440\u0438\u0432\u044B\u0447\u043A\u0438 \u0434\u043D\u044F", enabled: true },
      { id: "strongDays", label: "\u0421\u0438\u043B\u044C\u043D\u044B\u0445 \u0434\u043D\u0435\u0439 \u0437\u0430 \u043D\u0435\u0434\u0435\u043B\u044E", enabled: true },
      { id: "streak", label: "\u0421\u0435\u0440\u0438\u044F", enabled: true }
    ];
    function createDefaultQuestStatsCards() {
      return QUEST_STATS_CARDS2.reduce((result, card) => {
        result[card.id] = {
          enabled: card.enabled !== false,
          label: card.label
        };
        return result;
      }, {});
    }
    module2.exports = {
      QUEST_STATS_CARDS: QUEST_STATS_CARDS2,
      createDefaultQuestStatsCards
    };
  }
});

// src/config/heroClassesConfig.js
var require_heroClassesConfig = __commonJS({
  "src/config/heroClassesConfig.js"(exports2, module2) {
    var DEFAULT_HERO_CLASS_ID = "habit_warrior";
    var HERO_CLASSES = [
      {
        id: "habit_warrior",
        icon: "\u2694\uFE0F",
        title: "\u0412\u043E\u0438\u043D \u043F\u0440\u0438\u0432\u044B\u0447\u0435\u043A",
        description: "\u0420\u0435\u0433\u0443\u043B\u044F\u0440\u043D\u043E\u0441\u0442\u044C, \u0435\u0436\u0435\u0434\u043D\u0435\u0432\u043D\u044B\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0438 \u0441\u0442\u0430\u0431\u0438\u043B\u044C\u043D\u044B\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441."
      },
      {
        id: "discipline_mage",
        icon: "\u{1F9D9}",
        title: "\u041C\u0430\u0433 \u0434\u0438\u0441\u0446\u0438\u043F\u043B\u0438\u043D\u044B",
        description: "\u0421\u0430\u043C\u043E\u043A\u043E\u043D\u0442\u0440\u043E\u043B\u044C, \u043A\u043E\u043D\u0446\u0435\u043D\u0442\u0440\u0430\u0446\u0438\u044F \u0438 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435 \u0446\u0435\u043B\u0435\u0439 \u043D\u0435\u0441\u043C\u043E\u0442\u0440\u044F \u043D\u0430 \u043E\u0431\u0441\u0442\u043E\u044F\u0442\u0435\u043B\u044C\u0441\u0442\u0432\u0430."
      },
      {
        id: "balance_keeper",
        icon: "\u{1F33F}",
        title: "\u0425\u0440\u0430\u043D\u0438\u0442\u0435\u043B\u044C \u0431\u0430\u043B\u0430\u043D\u0441\u0430",
        description: "\u0413\u0430\u0440\u043C\u043E\u043D\u0438\u0447\u043D\u043E\u0435 \u0440\u0430\u0437\u0432\u0438\u0442\u0438\u0435 \u0432\u0441\u0435\u0445 \u0441\u0444\u0435\u0440 \u0436\u0438\u0437\u043D\u0438."
      },
      {
        id: "change_architect",
        icon: "\u{1F525}",
        title: "\u0410\u0440\u0445\u0438\u0442\u0435\u043A\u0442\u043E\u0440 \u043F\u0435\u0440\u0435\u043C\u0435\u043D",
        description: "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u043D\u043E\u0432\u044B\u0445 \u043F\u0440\u0438\u0432\u044B\u0447\u0435\u043A \u0438 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0435 \u0441\u0432\u043E\u0435\u0439 \u0436\u0438\u0437\u043D\u0438 \u0448\u0430\u0433 \u0437\u0430 \u0448\u0430\u0433\u043E\u043C."
      }
    ];
    function getHeroClass(id) {
      return HERO_CLASSES.find((item) => item.id === id) || HERO_CLASSES.find((item) => item.id === DEFAULT_HERO_CLASS_ID);
    }
    function getHeroClassLabel(id) {
      const heroClass = getHeroClass(id);
      return `${heroClass.icon} ${heroClass.title}`;
    }
    function getHeroClassTitle2(player = {}) {
      return getHeroClassLabel(resolveHeroClassId2(player));
    }
    function getHeroClassDescription(id) {
      return getHeroClass(id).description;
    }
    function resolveHeroClassId2(player = {}) {
      if (HERO_CLASSES.some((item) => item.id === player.classId)) return player.classId;
      const raw = String(player.className || "").trim().toLowerCase();
      if (!raw) return DEFAULT_HERO_CLASS_ID;
      const matched = HERO_CLASSES.find((item) => {
        const title = item.title.toLowerCase();
        const label = `${item.icon} ${item.title}`.toLowerCase();
        return raw === title || raw === label || raw.includes(title);
      });
      return matched ? matched.id : DEFAULT_HERO_CLASS_ID;
    }
    module2.exports = {
      HERO_CLASSES,
      DEFAULT_HERO_CLASS_ID,
      getHeroClass,
      getHeroClassLabel,
      getHeroClassTitle: getHeroClassTitle2,
      getHeroClassDescription,
      resolveHeroClassId: resolveHeroClassId2
    };
  }
});

// src/config/layoutConfig.js
var require_layoutConfig = __commonJS({
  "src/config/layoutConfig.js"(exports2, module2) {
    var WIDGET_SIZES = ["small", "medium", "large", "full"];
    var APP_SIZE_PRESETS = ["compact", "comfortable", "expanded"];
    var HOME_LAYOUT_MODES = ["grid", "freeform"];
    var DEFAULT_INTERFACE_LAYOUT = {
      version: 1,
      appSize: "comfortable",
      homeLayoutMode: "grid",
      columns: 12,
      rowHeight: 96
    };
    var HOME_WIDGET_DEFINITIONS = [
      {
        id: "command",
        title: "\u041A\u043E\u043C\u0430\u043D\u0434\u043D\u044B\u0439 \u0446\u0435\u043D\u0442\u0440",
        description: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u0433\u0435\u0440\u043E\u044F, \u043E\u0431\u0449\u0438\u0439 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0438 \u043D\u0430\u0432\u0438\u0433\u0430\u0446\u0438\u044F \u043F\u043E \u0433\u043B\u0430\u0432\u043D\u043E\u0439",
        defaultEnabled: true,
        defaultSize: "large",
        allowedSizes: ["large", "full"],
        defaultGeometry: { x: 0, y: 0, w: 8, h: 3 },
        minW: 4,
        minH: 2,
        maxW: 12,
        maxH: 5,
        rendererKey: "command",
        category: "home"
      },
      {
        id: "clock",
        title: "\u0421\u0435\u0439\u0447\u0430\u0441",
        description: "\u0422\u0435\u043A\u0443\u0449\u0435\u0435 \u0432\u0440\u0435\u043C\u044F \u0438 \u0444\u0430\u0437\u0430 \u0434\u043D\u044F",
        defaultEnabled: true,
        defaultSize: "small",
        allowedSizes: ["small", "medium"],
        defaultGeometry: { x: 8, y: 0, w: 4, h: 2 },
        minW: 3,
        minH: 2,
        maxW: 4,
        maxH: 3,
        rendererKey: "clock",
        category: "home"
      },
      {
        id: "calendar",
        title: "\u041A\u0430\u043B\u0435\u043D\u0434\u0430\u0440\u044C",
        description: "\u0412\u044B\u0431\u043E\u0440 \u0434\u043D\u044F \u0438 \u043A\u0440\u0430\u0442\u043A\u0430\u044F \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u043D\u0435\u0434\u0435\u043B\u0438",
        defaultEnabled: true,
        defaultSize: "medium",
        allowedSizes: ["medium", "large"],
        defaultGeometry: { x: 8, y: 2, w: 4, h: 3 },
        minW: 3,
        minH: 2,
        maxW: 6,
        maxH: 5,
        rendererKey: "calendar",
        category: "home"
      },
      {
        id: "water",
        title: "\u0412\u043E\u0434\u0430",
        description: "\u0412\u043E\u0434\u043D\u044B\u0439 \u0431\u0430\u043B\u0430\u043D\u0441 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0433\u043E \u0434\u043D\u044F",
        defaultEnabled: true,
        defaultSize: "small",
        allowedSizes: ["small", "medium"],
        defaultGeometry: { x: 8, y: 5, w: 4, h: 3 },
        minW: 3,
        minH: 2,
        maxW: 4,
        maxH: 4,
        rendererKey: "water",
        category: "home"
      },
      {
        id: "today",
        title: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F",
        description: "\u041F\u0440\u0438\u0432\u044B\u0447\u043A\u0438, \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u0435 \u0438 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0433\u043E \u0434\u043D\u044F",
        defaultEnabled: true,
        defaultSize: "large",
        allowedSizes: ["medium", "large", "full"],
        defaultGeometry: { x: 0, y: 3, w: 8, h: 4 },
        minW: 4,
        minH: 3,
        maxW: 12,
        maxH: 8,
        rendererKey: "today",
        category: "home"
      },
      {
        id: "hero",
        title: "\u0413\u0435\u0440\u043E\u0439",
        description: "\u0423\u0440\u043E\u0432\u0435\u043D\u044C, XP, \u0440\u0430\u0434\u0430\u0440 \u0438 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0433\u0435\u0440\u043E\u044F",
        defaultEnabled: true,
        defaultSize: "large",
        allowedSizes: ["medium", "large", "full"],
        defaultGeometry: { x: 0, y: 3, w: 8, h: 5 },
        minW: 4,
        minH: 3,
        maxW: 12,
        maxH: 9,
        rendererKey: "hero",
        category: "home"
      },
      {
        id: "quests",
        title: "\u041A\u0432\u0435\u0441\u0442\u044B",
        description: "\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441\u0430 \u0438 linked-\u043A\u0432\u0435\u0441\u0442\u044B",
        defaultEnabled: true,
        defaultSize: "medium",
        allowedSizes: ["medium", "large", "full"],
        defaultGeometry: { x: 0, y: 3, w: 8, h: 4 },
        minW: 4,
        minH: 3,
        maxW: 12,
        maxH: 8,
        rendererKey: "quests",
        category: "home"
      },
      {
        id: "rewards",
        title: "\u041D\u0430\u0433\u0440\u0430\u0434\u044B",
        description: "\u041C\u0430\u0433\u0430\u0437\u0438\u043D \u043D\u0430\u0433\u0440\u0430\u0434 \u0437\u0430 XP",
        defaultEnabled: true,
        defaultSize: "medium",
        allowedSizes: ["medium", "large", "full"],
        defaultGeometry: { x: 0, y: 3, w: 8, h: 4 },
        minW: 4,
        minH: 3,
        maxW: 12,
        maxH: 8,
        rendererKey: "rewards",
        category: "home"
      },
      {
        id: "inventory",
        title: "\u0418\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C",
        description: "\u041A\u0443\u043F\u043B\u0435\u043D\u043D\u044B\u0435 \u043D\u0430\u0433\u0440\u0430\u0434\u044B \u0438 \u0441\u0442\u0430\u0442\u0443\u0441 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u044F",
        defaultEnabled: true,
        defaultSize: "medium",
        allowedSizes: ["small", "medium", "large"],
        defaultGeometry: { x: 0, y: 3, w: 8, h: 4 },
        minW: 3,
        minH: 3,
        maxW: 10,
        maxH: 7,
        rendererKey: "inventory",
        category: "home"
      },
      {
        id: "wallet",
        title: "\u0411\u0430\u043D\u043A",
        description: "\u0414\u043E\u0445\u043E\u0434\u044B, \u0440\u0430\u0441\u0445\u043E\u0434\u044B \u0438 \u0438\u0441\u0442\u043E\u0440\u0438\u044F \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0439",
        defaultEnabled: true,
        defaultSize: "medium",
        allowedSizes: ["medium", "large", "full"],
        defaultGeometry: { x: 0, y: 3, w: 8, h: 4 },
        minW: 4,
        minH: 3,
        maxW: 12,
        maxH: 8,
        rendererKey: "wallet",
        category: "home"
      }
    ];
    var DEFAULT_HOME_LAYOUT = {
      version: 1,
      widgets: HOME_WIDGET_DEFINITIONS.map((widget) => ({
        id: widget.id,
        enabled: widget.defaultEnabled,
        size: widget.defaultSize
      }))
    };
    function clone(value) {
      return JSON.parse(JSON.stringify(value));
    }
    function getHomeWidgetDefinitions() {
      return clone(HOME_WIDGET_DEFINITIONS);
    }
    function getDefaultHomeLayout() {
      return clone(DEFAULT_HOME_LAYOUT);
    }
    function getDefaultInterfaceLayout() {
      return clone(DEFAULT_INTERFACE_LAYOUT);
    }
    function normalizePositiveNumber(value, fallback, min) {
      const number = Number(value);
      if (!Number.isFinite(number) || number < min) return fallback;
      return number;
    }
    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }
    function getDefinition(idOrDefinition) {
      if (idOrDefinition && typeof idOrDefinition === "object" && idOrDefinition.id) {
        return HOME_WIDGET_DEFINITIONS.find((definition) => definition.id === idOrDefinition.id) || idOrDefinition;
      }
      return HOME_WIDGET_DEFINITIONS.find((definition) => definition.id === idOrDefinition) || null;
    }
    function normalizeInterfaceLayout2(interfaceLayout) {
      const input = interfaceLayout && typeof interfaceLayout === "object" ? interfaceLayout : {};
      const defaults = DEFAULT_INTERFACE_LAYOUT;
      const appSize = APP_SIZE_PRESETS.includes(input.appSize) ? input.appSize : defaults.appSize;
      const homeLayoutMode = HOME_LAYOUT_MODES.includes(input.homeLayoutMode) ? input.homeLayoutMode : defaults.homeLayoutMode;
      const columns = normalizePositiveNumber(input.columns, defaults.columns, 1);
      const rowHeight = normalizePositiveNumber(input.rowHeight, defaults.rowHeight, 1);
      return {
        version: 1,
        appSize,
        homeLayoutMode,
        columns,
        rowHeight
      };
    }
    function getWidgetMinGeometry(idOrDefinition) {
      const definition = getDefinition(idOrDefinition);
      return {
        w: normalizePositiveNumber(definition && definition.minW, 1, 1),
        h: normalizePositiveNumber(definition && definition.minH, 1, 1)
      };
    }
    function getWidgetMaxGeometry(idOrDefinition, options = {}) {
      const definition = getDefinition(idOrDefinition);
      const columns = normalizePositiveNumber(options.columns, DEFAULT_INTERFACE_LAYOUT.columns, 1);
      return {
        w: Math.min(normalizePositiveNumber(definition && definition.maxW, columns, 1), columns),
        h: normalizePositiveNumber(definition && definition.maxH, 12, 1)
      };
    }
    function getWidgetDefaultGeometry(idOrDefinition, options = {}) {
      const definition = getDefinition(idOrDefinition);
      const columns = normalizePositiveNumber(options.columns, DEFAULT_INTERFACE_LAYOUT.columns, 1);
      const fallback = { x: 0, y: 0, w: Math.min(4, columns), h: 2 };
      const source = definition && definition.defaultGeometry ? definition.defaultGeometry : fallback;
      return clampWidgetGeometry(definition, {
        x: source.x,
        y: source.y,
        w: source.w,
        h: source.h
      }, { columns });
    }
    function clampWidgetGeometry(idOrDefinition, geometry = {}, options = {}) {
      const definition = getDefinition(idOrDefinition);
      const columns = normalizePositiveNumber(options.columns, DEFAULT_INTERFACE_LAYOUT.columns, 1);
      const min = getWidgetMinGeometry(definition);
      const max = getWidgetMaxGeometry(definition, { columns });
      const w = clamp(normalizePositiveNumber(geometry.w, min.w, 1), min.w, Math.max(min.w, max.w));
      const h = clamp(normalizePositiveNumber(geometry.h, min.h, 1), min.h, Math.max(min.h, max.h));
      const x = clamp(normalizePositiveNumber(geometry.x, 0, 0), 0, Math.max(0, columns - w));
      const y = normalizePositiveNumber(geometry.y, 0, 0);
      return { x, y, w, h };
    }
    function normalizeGeometry(widget, definition, columns = DEFAULT_INTERFACE_LAYOUT.columns) {
      const hasGeometry = ["x", "y", "w", "h"].some((key) => Object.prototype.hasOwnProperty.call(widget, key));
      if (!hasGeometry) return {};
      const x = normalizePositiveNumber(widget.x, null, 0);
      const y = normalizePositiveNumber(widget.y, null, 0);
      const w = normalizePositiveNumber(widget.w, null, 1);
      const h = normalizePositiveNumber(widget.h, null, 1);
      if (x === null || y === null || w === null || h === null) return getWidgetDefaultGeometry(definition, { columns });
      return clampWidgetGeometry(definition, { x, y, w, h }, { columns });
    }
    function normalizeHomeLayout2(layout, options = {}) {
      const input = layout && typeof layout === "object" ? layout : {};
      const inputWidgets = Array.isArray(input.widgets) ? input.widgets : [];
      const columns = normalizePositiveNumber(options.columns, DEFAULT_INTERFACE_LAYOUT.columns, 1);
      const definitionsById = new Map(HOME_WIDGET_DEFINITIONS.map((definition) => [definition.id, definition]));
      const usedIds = /* @__PURE__ */ new Set();
      const widgets = [];
      const appendWidget = (definition, widget = {}) => {
        const enabled = typeof widget.enabled === "boolean" ? widget.enabled : definition.defaultEnabled;
        const size = definition.allowedSizes.includes(widget.size) ? widget.size : definition.defaultSize;
        widgets.push({
          id: definition.id,
          enabled,
          size,
          ...normalizeGeometry(widget, definition, columns)
        });
        usedIds.add(definition.id);
      };
      for (const widget of inputWidgets) {
        if (!widget || typeof widget !== "object") continue;
        const definition = definitionsById.get(widget.id);
        if (!definition || usedIds.has(definition.id)) continue;
        appendWidget(definition, widget);
      }
      for (const definition of HOME_WIDGET_DEFINITIONS) {
        if (!usedIds.has(definition.id)) appendWidget(definition);
      }
      return { version: 1, widgets };
    }
    module2.exports = {
      WIDGET_SIZES,
      APP_SIZE_PRESETS,
      HOME_LAYOUT_MODES,
      HOME_WIDGET_DEFINITIONS,
      DEFAULT_HOME_LAYOUT,
      DEFAULT_INTERFACE_LAYOUT,
      getHomeWidgetDefinitions,
      getDefaultHomeLayout,
      getDefaultInterfaceLayout,
      getWidgetDefaultGeometry,
      getWidgetMinGeometry,
      getWidgetMaxGeometry,
      clampWidgetGeometry,
      normalizeInterfaceLayout: normalizeInterfaceLayout2,
      normalizeHomeLayout: normalizeHomeLayout2
    };
  }
});

// src/config/themeConfig.js
var require_themeConfig = __commonJS({
  "src/config/themeConfig.js"(exports2, module2) {
    var THEME_PRESETS = [
      {
        id: "brand-dark",
        title: "Brand Dark",
        description: "\u0424\u0438\u0440\u043C\u0435\u043D\u043D\u0430\u044F \u0442\u0451\u043C\u043D\u0430\u044F purple/blue \u043F\u0430\u043B\u0438\u0442\u0440\u0430 Vibe RPG",
        className: "vrpg-theme-brand-dark"
      }
    ];
    var ACCENT_PRESETS = [
      { id: "purple", title: "Purple", className: "vrpg-accent-purple" },
      { id: "cyan", title: "Cyan", className: "vrpg-accent-cyan" },
      { id: "emerald", title: "Emerald", className: "vrpg-accent-emerald" },
      { id: "crimson", title: "Crimson", className: "vrpg-accent-crimson" },
      { id: "gold", title: "Gold", className: "vrpg-accent-gold" }
    ];
    var DEFAULT_INTERFACE_THEME = {
      version: 1,
      themeId: "brand-dark",
      accentPreset: "purple"
    };
    function clone(value) {
      return JSON.parse(JSON.stringify(value));
    }
    function getThemePresets() {
      return clone(THEME_PRESETS);
    }
    function getAccentPresets() {
      return clone(ACCENT_PRESETS);
    }
    function normalizeInterfaceTheme(theme) {
      const input = theme && typeof theme === "object" ? theme : {};
      const themeId = THEME_PRESETS.some((preset) => preset.id === input.themeId) ? input.themeId : DEFAULT_INTERFACE_THEME.themeId;
      const accentPreset = ACCENT_PRESETS.some((preset) => preset.id === input.accentPreset) ? input.accentPreset : DEFAULT_INTERFACE_THEME.accentPreset;
      return {
        version: 1,
        themeId,
        accentPreset
      };
    }
    function getThemeClasses2(theme) {
      const normalized = normalizeInterfaceTheme(theme);
      const themePreset = THEME_PRESETS.find((preset) => preset.id === normalized.themeId);
      const accentPreset = ACCENT_PRESETS.find((preset) => preset.id === normalized.accentPreset);
      return [themePreset && themePreset.className, accentPreset && accentPreset.className].filter(Boolean);
    }
    function getThemeClassList2() {
      return [
        ...THEME_PRESETS.map((preset) => preset.className),
        ...ACCENT_PRESETS.map((preset) => preset.className)
      ];
    }
    module2.exports = {
      THEME_PRESETS,
      ACCENT_PRESETS,
      DEFAULT_INTERFACE_THEME,
      getThemePresets,
      getAccentPresets,
      normalizeInterfaceTheme,
      getThemeClasses: getThemeClasses2,
      getThemeClassList: getThemeClassList2
    };
  }
});

// src/defaults.js
var require_defaults = __commonJS({
  "src/defaults.js"(exports2, module2) {
    var { createDefaultQuestStatsCards } = require_questStatsConfig();
    var { DEFAULT_HERO_CLASS_ID } = require_heroClassesConfig();
    var {
      getDefaultHomeLayout,
      getDefaultInterfaceLayout
    } = require_layoutConfig();
    var { DEFAULT_INTERFACE_THEME } = require_themeConfig();
    var DEFAULT_DATA = {
      player: {
        name: "\u0413\u0435\u0440\u043E\u0439",
        classId: DEFAULT_HERO_CLASS_ID,
        className: "\u0412\u043E\u0438\u043D \u043F\u0440\u0438\u0432\u044B\u0447\u0435\u043A",
        goal: "\u0437\u0430\u043A\u0440\u044B\u0432\u0430\u0442\u044C \u043C\u0438\u043D\u0438\u043C\u0443\u043C 3 \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0438 \u0432 \u0434\u0435\u043D\u044C",
        avatarUrl: ""
      },
      settings: {
        waterGoal: 8,
        waterGlassMl: 250,
        questStatsCards: createDefaultQuestStatsCards(),
        customQuestStatsCards: [],
        homeLayout: getDefaultHomeLayout(),
        interfaceLayout: getDefaultInterfaceLayout(),
        interfaceTheme: DEFAULT_INTERFACE_THEME
      },
      habits: [
        { id: "gym", title: "\u0417\u0430\u043B", area: "body", icon: "\u{1F3CB}\uFE0F", xp: 10, enabled: true },
        { id: "walk", title: "\u041F\u0440\u043E\u0433\u0443\u043B\u043A\u0430", area: "body", icon: "\u{1F6B6}", xp: 10, enabled: true },
        { id: "stretch", title: "\u0420\u0430\u0441\u0442\u044F\u0436\u043A\u0430", area: "body", icon: "\u{1F9D8}", xp: 10, enabled: true },
        { id: "run", title: "\u0411\u0435\u0433", area: "body", icon: "\u{1F3C3}", xp: 10, enabled: true },
        { id: "bike", title: "\u0412\u0435\u043B\u043E\u0441\u0438\u043F\u0435\u0434", area: "body", icon: "\u{1F6B4}", xp: 10, enabled: true },
        { id: "focus", title: "20 \u043C\u0438\u043D\u0443\u0442 \u0432 \u0442\u0438\u0448\u0438\u043D\u0435", area: "mind", icon: "\u{1F9E0}", xp: 10, enabled: true },
        { id: "work", title: "\u0420\u0430\u0431\u043E\u0442\u0430 / \u043F\u0440\u043E\u0435\u043A\u0442", area: "craft", icon: "\u{1F6E0}\uFE0F", xp: 10, enabled: true },
        { id: "control", title: "\u0414\u0435\u043D\u044C \u0431\u0435\u0437 \u0437\u0430\u043B\u0438\u043F\u0430\u043D\u0438\u044F", area: "control", icon: "\u{1F6E1}\uFE0F", xp: 10, enabled: true }
      ],
      rewards: [
        { id: "youtube", title: "30 \u043C\u0438\u043D\u0443\u0442 YouTube", cost: 100, icon: "\u25B6\uFE0F", rarity: "common" },
        { id: "coffee", title: "\u041A\u043E\u0444\u0435 / \u043D\u0430\u043F\u0438\u0442\u043E\u043A", cost: 100, icon: "\u2615", rarity: "common" },
        { id: "dinner", title: "\u041A\u0430\u0444\u0435 / \u0432\u043A\u0443\u0441\u043D\u044B\u0439 \u0443\u0436\u0438\u043D", cost: 250, icon: "\u{1F35C}", rarity: "rare" },
        { id: "game", title: "\u0412\u0435\u0447\u0435\u0440 \u0438\u0433\u0440\u044B", cost: 250, icon: "\u{1F3AE}", rarity: "rare" }
      ],
      days: {},
      inventory: [],
      wallet: []
    };
    module2.exports = { DEFAULT_DATA };
  }
});

// src/systems/questStatsSystem.js
var require_questStatsSystem = __commonJS({
  "src/systems/questStatsSystem.js"(exports2, module2) {
    var { QUEST_STATS_CARDS: QUEST_STATS_CARDS2 } = require_questStatsConfig();
    var { dateKey: dateKey2, uid } = require_utils();
    var CUSTOM_CARD_TYPES = ["manual", "habitCount", "habitStreak"];
    function safeGoal(value) {
      const goal = Math.round(Number(value));
      return Number.isFinite(goal) && goal >= 1 ? goal : 1;
    }
    function safeRewardXp(value) {
      const xp = Math.round(Number(value));
      return Number.isFinite(xp) && xp >= 0 ? xp : 0;
    }
    function safeType(value) {
      return CUSTOM_CARD_TYPES.includes(value) ? value : "manual";
    }
    function safeHabitIds(value, fallback = "") {
      const input = Array.isArray(value) ? value : [];
      const ids = input.map((id) => String(id || "").trim()).filter(Boolean);
      const fallbackId = String(fallback || "").trim();
      if (fallbackId && !ids.includes(fallbackId)) ids.unshift(fallbackId);
      return ids;
    }
    function normalizeQuestStatsSettings2(settings = {}, config = QUEST_STATS_CARDS2) {
      const rawCards = settings.questStatsCards && typeof settings.questStatsCards === "object" ? settings.questStatsCards : {};
      const questStatsCards = {};
      for (const card of config) {
        const raw = rawCards[card.id];
        if (typeof raw === "boolean") {
          questStatsCards[card.id] = {
            enabled: raw,
            label: card.label
          };
          continue;
        }
        if (raw && typeof raw === "object") {
          questStatsCards[card.id] = {
            enabled: Object.prototype.hasOwnProperty.call(raw, "enabled") ? raw.enabled !== false : card.enabled !== false,
            label: String(raw.label || card.label).trim() || card.label
          };
          continue;
        }
        questStatsCards[card.id] = {
          enabled: card.enabled !== false,
          label: card.label
        };
      }
      const customQuestStatsCards = Array.isArray(settings.customQuestStatsCards) ? settings.customQuestStatsCards.filter((card) => card && typeof card === "object" && card.id).map((card) => ({
        id: String(card.id),
        label: String(card.label || "\u0421\u0432\u043E\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430").trim() || "\u0421\u0432\u043E\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430",
        value: String(card.value || "").trim(),
        habitId: card.habitId ? String(card.habitId) : "",
        habitIds: safeHabitIds(card.habitIds, card.habitId),
        goal: safeGoal(card.goal || 1),
        rewardXp: safeRewardXp(card.rewardXp || 0),
        period: String(card.period || "week"),
        enabled: card.enabled !== false,
        custom: true,
        type: safeType(card.type || "manual")
      })) : [];
      return {
        questStatsCards,
        customQuestStatsCards
      };
    }
    function applyQuestStatsCardUpdate2(data, id, patch = {}) {
      const card = QUEST_STATS_CARDS2.find((item) => item.id === id);
      if (!card) return { ok: false, data, card: null, reason: "unknown-card" };
      const normalized = normalizeQuestStatsSettings2(data.settings || {});
      const current = normalized.questStatsCards[id] || { enabled: card.enabled !== false, label: card.label };
      const next = { ...current };
      if (Object.prototype.hasOwnProperty.call(patch, "enabled")) next.enabled = patch.enabled !== false;
      if (Object.prototype.hasOwnProperty.call(patch, "label")) {
        next.label = String(patch.label || card.label).trim() || card.label;
      }
      data.settings.questStatsCards = {
        ...normalized.questStatsCards,
        [id]: next
      };
      data.settings.customQuestStatsCards = normalized.customQuestStatsCards;
      return { ok: true, data, card: next };
    }
    function applyCustomQuestStatsCardAdd2(data, input = {}) {
      const normalized = normalizeQuestStatsSettings2(data.settings || {});
      const card = {
        id: uid("questCard"),
        label: String(input.label || "\u0421\u0432\u043E\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430").trim() || "\u0421\u0432\u043E\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430",
        value: String(input.value || "").trim(),
        habitId: input.habitId ? String(input.habitId) : "",
        habitIds: safeHabitIds(input.habitIds, input.habitId),
        goal: safeGoal(input.goal || 1),
        rewardXp: safeRewardXp(input.rewardXp || 0),
        period: String(input.period || "week"),
        enabled: input.enabled !== false,
        custom: true,
        type: safeType(input.type || "manual")
      };
      data.settings.questStatsCards = normalized.questStatsCards;
      data.settings.customQuestStatsCards = [...normalized.customQuestStatsCards, card];
      return { ok: true, data, card };
    }
    function applyCustomQuestStatsCardUpdate2(data, id, patch = {}) {
      const normalized = normalizeQuestStatsSettings2(data.settings || {});
      const cards = normalized.customQuestStatsCards.slice();
      const index = cards.findIndex((card) => card.id === id);
      if (index === -1) return { ok: false, data, card: null, reason: "unknown-card" };
      const next = { ...cards[index] };
      if (Object.prototype.hasOwnProperty.call(patch, "label")) {
        next.label = String(patch.label || "\u0421\u0432\u043E\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430").trim() || "\u0421\u0432\u043E\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430";
      }
      if (Object.prototype.hasOwnProperty.call(patch, "value")) {
        next.value = String(patch.value || "").trim();
      }
      if (Object.prototype.hasOwnProperty.call(patch, "type")) {
        next.type = safeType(patch.type || next.type);
      }
      if (Object.prototype.hasOwnProperty.call(patch, "habitId")) {
        next.habitId = patch.habitId ? String(patch.habitId) : "";
        next.habitIds = safeHabitIds(next.habitIds, next.habitId);
      }
      if (Object.prototype.hasOwnProperty.call(patch, "habitIds")) {
        next.habitIds = safeHabitIds(patch.habitIds, next.habitId);
      }
      if (Object.prototype.hasOwnProperty.call(patch, "goal")) {
        next.goal = safeGoal(patch.goal);
      }
      if (Object.prototype.hasOwnProperty.call(patch, "rewardXp")) {
        next.rewardXp = safeRewardXp(patch.rewardXp);
      }
      if (Object.prototype.hasOwnProperty.call(patch, "period")) {
        next.period = String(patch.period || "week");
      }
      if (Object.prototype.hasOwnProperty.call(patch, "enabled")) {
        next.enabled = patch.enabled !== false;
      }
      cards[index] = next;
      data.settings.questStatsCards = normalized.questStatsCards;
      data.settings.customQuestStatsCards = cards;
      return { ok: true, data, card: next };
    }
    function applyCustomQuestStatsCardDelete2(data, id) {
      const normalized = normalizeQuestStatsSettings2(data.settings || {});
      const before = normalized.customQuestStatsCards.length;
      const cards = normalized.customQuestStatsCards.filter((card) => card.id !== id);
      if (cards.length === before) return { ok: false, data, cardId: id, reason: "unknown-card" };
      data.settings.questStatsCards = normalized.questStatsCards;
      data.settings.customQuestStatsCards = cards;
      return { ok: true, data, cardId: id };
    }
    function parseDateKey(key = dateKey2()) {
      const [day, month, year] = String(key || "").split(".").map(Number);
      const date = new Date(year, month - 1, day);
      if (!Number.isFinite(date.getTime())) return /* @__PURE__ */ new Date();
      return date;
    }
    function shiftDateKey(key, deltaDays) {
      const date = parseDateKey(key);
      date.setDate(date.getDate() + deltaDays);
      return dateKey2(date);
    }
    function habitExists(data, habitId) {
      return !!(data.habits || []).find((habit) => habit.id === habitId);
    }
    function getQuestHabitIds(card = {}) {
      return safeHabitIds(card.habitIds, card.habitId);
    }
    function isHabitDoneOnDate(data, habitId, key) {
      if (!data || !habitId || !key || !habitExists(data, habitId)) return false;
      const day = data.days && data.days[key];
      return !!(day && day.completed && day.completed[habitId]);
    }
    function isAnyHabitDoneOnDate(data, habitIds = [], key) {
      return habitIds.some((habitId) => isHabitDoneOnDate(data, habitId, key));
    }
    function countHabitDoneInLastDays(data, habitId, selectedDateKey = dateKey2(), days = 7) {
      const totalDays = Math.max(1, Math.round(Number(days)) || 7);
      let done = 0;
      for (let index = 0; index < totalDays; index++) {
        const key = shiftDateKey(selectedDateKey, -index);
        if (isHabitDoneOnDate(data, habitId, key)) done++;
      }
      return done;
    }
    function countAnyHabitDoneInLastDays(data, habitIds = [], selectedDateKey = dateKey2(), days = 7) {
      const totalDays = Math.max(1, Math.round(Number(days)) || 7);
      let done = 0;
      for (let index = 0; index < totalDays; index++) {
        const key = shiftDateKey(selectedDateKey, -index);
        if (isAnyHabitDoneOnDate(data, habitIds, key)) done++;
      }
      return done;
    }
    function habitStreakForHabit(data, habitId, selectedDateKey = dateKey2()) {
      let value = 0;
      let offset = 0;
      while (true) {
        const key = shiftDateKey(selectedDateKey, -offset);
        if (!isHabitDoneOnDate(data, habitId, key)) break;
        value++;
        offset++;
      }
      return value;
    }
    function habitStreakForAnyHabit(data, habitIds = [], selectedDateKey = dateKey2()) {
      let value = 0;
      let offset = 0;
      while (true) {
        const key = shiftDateKey(selectedDateKey, -offset);
        if (!isAnyHabitDoneOnDate(data, habitIds, key)) break;
        value++;
        offset++;
      }
      return value;
    }
    function resolveCustomQuestCardValue(data, card, selectedDateKey = dateKey2()) {
      const goal = safeGoal(card.goal || 1);
      const habitIds = getQuestHabitIds(card);
      if (card.type === "habitCount") {
        const days = card.period === "today" ? 1 : goal;
        const done = countAnyHabitDoneInLastDays(data, habitIds, selectedDateKey, days);
        return `${done}/${goal} \u0434\u043D\u0435\u0439`;
      }
      if (card.type === "habitStreak") {
        const streak2 = habitStreakForAnyHabit(data, habitIds, selectedDateKey);
        return `${streak2}/${goal} \u0434\u043D\u0435\u0439`;
      }
      return card.value || "";
    }
    function getQuestStatsCards2(data, computedValues = {}, config = QUEST_STATS_CARDS2, selectedDateKey = dateKey2()) {
      const normalized = normalizeQuestStatsSettings2(data.settings || {}, config);
      const systemCards = [];
      for (const card of config) {
        if (card.enabled === false) continue;
        const settings = normalized.questStatsCards[card.id] || {};
        if (settings.enabled === false) continue;
        systemCards.push({
          id: card.id,
          label: settings.label || card.label,
          value: computedValues[card.id] || "",
          custom: false,
          type: "system"
        });
      }
      const customCards = normalized.customQuestStatsCards.filter((card) => card.enabled !== false).map((card) => ({
        id: card.id,
        label: card.label,
        value: resolveCustomQuestCardValue(data, card, selectedDateKey),
        note: card.rewardXp > 0 ? `\u{1F3C6} ${card.rewardXp} XP` : "",
        custom: true,
        type: card.type
      }));
      return [...systemCards, ...customCards];
    }
    module2.exports = {
      normalizeQuestStatsSettings: normalizeQuestStatsSettings2,
      applyQuestStatsCardUpdate: applyQuestStatsCardUpdate2,
      applyCustomQuestStatsCardAdd: applyCustomQuestStatsCardAdd2,
      applyCustomQuestStatsCardUpdate: applyCustomQuestStatsCardUpdate2,
      applyCustomQuestStatsCardDelete: applyCustomQuestStatsCardDelete2,
      isHabitDoneOnDate,
      countHabitDoneInLastDays,
      countAnyHabitDoneInLastDays,
      habitStreakForHabit,
      habitStreakForAnyHabit,
      resolveCustomQuestCardValue,
      getQuestStatsCards: getQuestStatsCards2
    };
  }
});

// src/storage.js
var require_storage = __commonJS({
  "src/storage.js"(exports2, module2) {
    var { DEFAULT_DATA } = require_defaults();
    var { QUEST_STATS_CARDS: QUEST_STATS_CARDS2 } = require_questStatsConfig();
    var { getHeroClass, resolveHeroClassId: resolveHeroClassId2 } = require_heroClassesConfig();
    var {
      normalizeHomeLayout: normalizeHomeLayout2,
      normalizeInterfaceLayout: normalizeInterfaceLayout2
    } = require_layoutConfig();
    var { normalizeInterfaceTheme } = require_themeConfig();
    var { normalizeQuestStatsSettings: normalizeQuestStatsSettings2 } = require_questStatsSystem();
    var { clone, dateKey: dateKey2 } = require_utils();
    function mergeData2(data) {
      const next = clone(DEFAULT_DATA);
      if (!data || typeof data !== "object") return next;
      next.player = { ...next.player, ...data.player || {} };
      const classId = resolveHeroClassId2(next.player);
      next.player.classId = classId;
      next.player.className = getHeroClass(classId).title;
      const settings = data.settings && typeof data.settings === "object" ? data.settings : {};
      const questStatsSettings = normalizeQuestStatsSettings2(settings, QUEST_STATS_CARDS2);
      next.settings = {
        ...next.settings,
        ...settings,
        questStatsCards: questStatsSettings.questStatsCards,
        customQuestStatsCards: questStatsSettings.customQuestStatsCards,
        interfaceLayout: normalizeInterfaceLayout2(settings.interfaceLayout),
        interfaceTheme: normalizeInterfaceTheme(settings.interfaceTheme),
        homeLayout: normalizeHomeLayout2(settings.homeLayout, normalizeInterfaceLayout2(settings.interfaceLayout))
      };
      next.habits = Array.isArray(data.habits) ? data.habits : next.habits;
      next.rewards = Array.isArray(data.rewards) ? data.rewards : next.rewards;
      next.days = data.days && typeof data.days === "object" ? data.days : next.days;
      next.inventory = Array.isArray(data.inventory) ? data.inventory : next.inventory;
      next.wallet = Array.isArray(data.wallet) ? data.wallet : next.wallet;
      return next;
    }
    function getDay2(data, key = dateKey2()) {
      if (!data.days[key]) data.days[key] = { completed: {}, note: "" };
      if (!data.days[key].completed) data.days[key].completed = {};
      if (!Number.isFinite(Number(data.days[key].water))) data.days[key].water = 0;
      return data.days[key];
    }
    module2.exports = {
      mergeData: mergeData2,
      getDay: getDay2
    };
  }
});

// src/ui/components/progressBar.js
var require_progressBar = __commonJS({
  "src/ui/components/progressBar.js"(exports2, module2) {
    function createProgressBar2(parent, percent, className = "") {
      const bar = parent.createDiv({ cls: `vrpg-bar ${className}`.trim() });
      bar.createDiv({ cls: "vrpg-fill", attr: { style: `width:${percent}%` } });
      return bar;
    }
    module2.exports = {
      createProgressBar: createProgressBar2
    };
  }
});

// src/ui/components/statCard.js
var require_statCard = __commonJS({
  "src/ui/components/statCard.js"(exports2, module2) {
    function createStatCard2(parent, options, value, className = "vrpg-panel") {
      const config = typeof options === "object" && options !== null ? options : { label: options, value, className };
      const card = parent.createDiv({ cls: config.className || "vrpg-panel" });
      card.createDiv({ cls: "vrpg-section", text: config.label });
      card.createDiv({ cls: "vrpg-stat-value", text: config.value });
      if (config.note) card.createDiv({ cls: "vrpg-subtitle", text: config.note });
      return card;
    }
    module2.exports = {
      createStatCard: createStatCard2
    };
  }
});

// src/ui/components/radarChart.js
var require_radarChart = __commonJS({
  "src/ui/components/radarChart.js"(exports2, module2) {
    function renderRadarChart2(parent, metrics) {
      const size = 280;
      const center = size / 2;
      const radius = 92;
      const angle = (index) => -Math.PI / 2 + index * Math.PI * 2 / metrics.length;
      const point = (index, value = 100) => {
        const r = radius * value / 100;
        const a = angle(index);
        return [center + Math.cos(a) * r, center + Math.sin(a) * r];
      };
      const polygon = metrics.map((metric, index) => point(index, metric[1]).join(",")).join(" ");
      const ns = "http://www.w3.org/2000/svg";
      const wrap = parent.createDiv({ cls: "vrpg-radar-wrap" });
      const svg = document.createElementNS(ns, "svg");
      svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
      svg.setAttribute("width", String(size));
      svg.setAttribute("height", String(size));
      svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.setAttribute("class", "vrpg-radar");
      for (const scale of [25, 50, 75, 100]) {
        const ring = document.createElementNS(ns, "polygon");
        ring.setAttribute("points", metrics.map((_, index) => point(index, scale).join(",")).join(" "));
        ring.setAttribute("class", "vrpg-radar-ring");
        svg.appendChild(ring);
      }
      metrics.forEach((metric, index) => {
        const [x, y] = point(index, 112);
        const linePoint = point(index, 100);
        const line = document.createElementNS(ns, "line");
        line.setAttribute("x1", String(center));
        line.setAttribute("y1", String(center));
        line.setAttribute("x2", String(linePoint[0]));
        line.setAttribute("y2", String(linePoint[1]));
        line.setAttribute("class", "vrpg-radar-axis");
        svg.appendChild(line);
        const label = document.createElementNS(ns, "text");
        label.setAttribute("x", String(x));
        label.setAttribute("y", String(y));
        label.setAttribute("text-anchor", "middle");
        label.setAttribute("dominant-baseline", "middle");
        label.setAttribute("class", "vrpg-radar-label");
        label.textContent = metric[0];
        svg.appendChild(label);
      });
      const shape = document.createElementNS(ns, "polygon");
      shape.setAttribute("points", polygon);
      shape.setAttribute("class", "vrpg-radar-shape");
      svg.appendChild(shape);
      wrap.appendChild(svg);
    }
    module2.exports = {
      renderRadarChart: renderRadarChart2
    };
  }
});

// src/ui/components/waterWidget.js
var require_waterWidget = __commonJS({
  "src/ui/components/waterWidget.js"(exports2, module2) {
    function renderWaterWidget2(parent, options = {}) {
      const stats = options.stats || {};
      const title = options.title || "\u0412\u043E\u0434\u0430";
      const mode = options.mode || "ring";
      const className = options.className || (mode === "panel" ? "vrpg-panel vrpg-water-panel" : "vrpg-glass-widget vrpg-water-widget");
      const root = parent.createDiv({ cls: className });
      if (mode === "ring" || mode === "compact") {
        root.createDiv({ cls: "vrpg-kicker", text: title });
        const waterRing = root.createDiv({
          cls: "vrpg-water-ring",
          attr: { style: `--water:${stats.percent}%` }
        });
        waterRing.createDiv({ cls: "vrpg-water-value", text: `${stats.value}/${stats.goal}` });
        root.createDiv({
          cls: "vrpg-subtitle",
          text: `${Math.round(stats.currentMl / 100) / 10}/${Math.round(stats.targetMl / 100) / 10} \u043B \u0441\u0435\u0433\u043E\u0434\u043D\u044F`
        });
        const controls = root.createDiv({ cls: "vrpg-water-controls" });
        const minus = controls.createEl("button", { text: "-" });
        minus.onclick = options.onDecrement;
        const plus = controls.createEl("button", { text: "+" });
        plus.onclick = options.onIncrement;
      }
      if (mode === "panel") {
        root.createDiv({ cls: "vrpg-section", text: title });
        const waterLine = root.createDiv({ cls: "vrpg-water-line" });
        waterLine.createDiv({ cls: "vrpg-card-title", text: `${stats.value}/${stats.goal} \u0441\u0442\u0430\u043A\u0430\u043D\u043E\u0432` });
        waterLine.createDiv({ cls: "vrpg-subtitle", text: `${stats.percent}% \xB7 ${stats.glassMl} \u043C\u043B \u0441\u0442\u0430\u043A\u0430\u043D` });
        const waterBar = root.createDiv({ cls: "vrpg-water-bar" });
        waterBar.createDiv({ cls: "vrpg-water-fill", attr: { style: `width:${stats.percent}%` } });
        const controls = root.createDiv({ cls: "vrpg-water-controls" });
        const minus = controls.createEl("button", { text: "-1 \u0441\u0442\u0430\u043A\u0430\u043D" });
        minus.onclick = options.onDecrement;
        const plus = controls.createEl("button", { text: "+1 \u0441\u0442\u0430\u043A\u0430\u043D" });
        plus.onclick = options.onIncrement;
      }
      return root;
    }
    module2.exports = {
      renderWaterWidget: renderWaterWidget2
    };
  }
});

// src/ui/components/walletRows.js
var require_walletRows = __commonJS({
  "src/ui/components/walletRows.js"(exports2, module2) {
    function renderWalletRow(parent, item, ctx = {}) {
      const formatMoney2 = ctx.formatMoney;
      const deleteWallet = ctx.deleteWallet || (() => {
      });
      const row = parent.createDiv({ cls: "vrpg-wallet-row" });
      row.createDiv({ cls: item.type === "income" ? "vrpg-money-positive" : "vrpg-money-negative", text: `${item.type === "income" ? "+" : "-"}${formatMoney2(item.amount)} \u20BD` });
      row.createDiv({ cls: "vrpg-subtitle", text: `${item.time || "--:--"} \xB7 ${item.note || "\u0431\u0435\u0437 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u044F"}` });
      const remove = row.createEl("button", { cls: "vrpg-danger vrpg-icon-action", text: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C" });
      remove.onclick = () => deleteWallet(item.id);
    }
    function renderWalletMonth(parent, wallet, selectedKey, ctx = {}) {
      const dateKey2 = ctx.dateKey;
      const dateFromKey2 = ctx.dateFromKey;
      const formatMoney2 = ctx.formatMoney;
      const selectedDate = dateFromKey2(selectedKey || dateKey2());
      const month = selectedDate.getMonth();
      const year = selectedDate.getFullYear();
      const days = /* @__PURE__ */ new Map();
      for (const item of wallet) {
        const itemDate = dateFromKey2(item.date);
        if (itemDate.getMonth() !== month || itemDate.getFullYear() !== year) continue;
        if (!days.has(item.date)) days.set(item.date, []);
        days.get(item.date).push(item);
      }
      if (!days.size) {
        parent.createDiv({ cls: "vrpg-subtitle", text: "\u0412 \u044D\u0442\u043E\u043C \u043C\u0435\u0441\u044F\u0446\u0435 \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442." });
        return;
      }
      const sortedDays = Array.from(days.entries()).sort((a, b) => dateFromKey2(b[0]).getTime() - dateFromKey2(a[0]).getTime());
      for (const [dayKey, items] of sortedDays) {
        const dayDetails = parent.createEl("details", { cls: "vrpg-bank-dayline" });
        dayDetails.open = dayKey === selectedKey;
        const income = items.filter((item) => item.type === "income").reduce((sum, item) => sum + Number(item.amount || 0), 0);
        const expense = items.filter((item) => item.type === "expense").reduce((sum, item) => sum + Number(item.amount || 0), 0);
        const summary = dayDetails.createEl("summary");
        summary.createSpan({ text: dayKey });
        summary.createSpan({ text: `${income - expense >= 0 ? "+" : ""}${formatMoney2(income - expense)} \u20BD \xB7 ${items.length}` });
        for (const item of items.slice().sort((a, b) => String(b.time || "").localeCompare(String(a.time || "")))) {
          renderWalletRow(dayDetails, item, ctx);
        }
      }
    }
    module2.exports = {
      renderWalletRow,
      renderWalletMonth
    };
  }
});

// src/systems/layoutSystem.js
var require_layoutSystem = __commonJS({
  "src/systems/layoutSystem.js"(exports2, module2) {
    var {
      getDefaultHomeLayout,
      getDefaultInterfaceLayout,
      getHomeWidgetDefinitions,
      normalizeInterfaceLayout: normalizeInterfaceLayout2,
      normalizeHomeLayout: normalizeHomeLayout2
    } = require_layoutConfig();
    var HOME_WIDGET_SIZE_CLASSES = {
      small: "vrpg-widget-small",
      medium: "vrpg-widget-medium",
      large: "vrpg-widget-large",
      full: "vrpg-widget-full"
    };
    function getHomeLayout(settings = {}) {
      const interfaceLayout = getInterfaceLayout(settings);
      const source = settings && typeof settings === "object" ? settings.homeLayout : null;
      return source ? normalizeHomeLayout2(source, interfaceLayout) : normalizeHomeLayout2(getDefaultHomeLayout(), interfaceLayout);
    }
    function mergeHomeLayout(layout) {
      return normalizeHomeLayout2(layout);
    }
    function clearHomeLayoutGeometry(layout) {
      const normalized = normalizeHomeLayout2(layout);
      return {
        version: normalized.version || 1,
        widgets: normalized.widgets.map(({ x, y, w, h, ...widget }) => widget)
      };
    }
    function resetHomeLayoutToDefault() {
      return normalizeHomeLayout2(getDefaultHomeLayout());
    }
    function getInterfaceLayout(settings = {}) {
      const source = settings && typeof settings === "object" ? settings.interfaceLayout : null;
      return source ? normalizeInterfaceLayout2(source) : normalizeInterfaceLayout2(getDefaultInterfaceLayout());
    }
    function getHomeLayoutMode(settings = {}) {
      return getInterfaceLayout(settings).homeLayoutMode;
    }
    function getAppSizePreset2(settings = {}) {
      return getInterfaceLayout(settings).appSize;
    }
    function getHomeLayoutColumns(settings = {}) {
      return getInterfaceLayout(settings).columns;
    }
    function getHomeLayoutRowHeight(settings = {}) {
      return getInterfaceLayout(settings).rowHeight;
    }
    function getEnabledHomeWidgets(layout) {
      const normalized = normalizeHomeLayout2(layout);
      return normalized.widgets.filter((widget) => widget.enabled !== false);
    }
    function getHomeWidgetById(id) {
      return getHomeWidgetDefinitions().find((widget) => widget.id === id) || null;
    }
    function getHomeWidgetSizeClass(size) {
      return HOME_WIDGET_SIZE_CLASSES[size] || HOME_WIDGET_SIZE_CLASSES.medium;
    }
    module2.exports = {
      getHomeLayout,
      mergeHomeLayout,
      clearHomeLayoutGeometry,
      resetHomeLayoutToDefault,
      getInterfaceLayout,
      getHomeLayoutMode,
      getAppSizePreset: getAppSizePreset2,
      getHomeLayoutColumns,
      getHomeLayoutRowHeight,
      getEnabledHomeWidgets,
      getHomeWidgetById,
      getHomeWidgetSizeClass
    };
  }
});

// src/systems/widgetSystem.js
var require_widgetSystem = __commonJS({
  "src/systems/widgetSystem.js"(exports2, module2) {
    var {
      clampWidgetGeometry,
      getDefaultHomeLayout,
      getHomeWidgetDefinitions,
      getWidgetDefaultGeometry,
      getWidgetMaxGeometry,
      getWidgetMinGeometry
    } = require_layoutConfig();
    var {
      getEnabledHomeWidgets,
      getHomeLayout,
      getHomeWidgetById,
      getHomeWidgetSizeClass,
      mergeHomeLayout
    } = require_layoutSystem();
    var WIDGET_SIZE_FALLBACK = "medium";
    function getWidgetRegistry() {
      return getHomeWidgetDefinitions().reduce((registry, widget) => {
        registry[widget.id] = widget;
        return registry;
      }, {});
    }
    function getWidgetDefinition(id) {
      return getHomeWidgetById(id);
    }
    function getDefaultWidgetLayout() {
      return getDefaultHomeLayout();
    }
    function getEnabledWidgets(settings = {}) {
      return getEnabledHomeWidgets(getHomeLayout(settings));
    }
    function getWidgetSize(widget = {}) {
      const definition = getWidgetDefinition(widget.id);
      if (definition && definition.allowedSizes.includes(widget.size)) return widget.size;
      return WIDGET_SIZE_FALLBACK;
    }
    function getWidgetCssClass(widget = {}) {
      return getHomeWidgetSizeClass(getWidgetSize(widget));
    }
    function hasWidgetGeometry(widget = {}) {
      return ["x", "y", "w", "h"].every((key) => Number.isFinite(Number(widget[key])));
    }
    function getWidgetGeometry(widget = {}) {
      if (!hasWidgetGeometry(widget)) return null;
      return {
        x: Number(widget.x),
        y: Number(widget.y),
        w: Number(widget.w),
        h: Number(widget.h)
      };
    }
    function getWidgetOrder(layout) {
      return mergeHomeLayout(layout).widgets.map((widget) => widget.id);
    }
    module2.exports = {
      getWidgetRegistry,
      getWidgetDefinition,
      getDefaultWidgetLayout,
      getEnabledWidgets,
      getWidgetSize,
      getWidgetCssClass,
      getWidgetDefaultGeometry,
      hasWidgetGeometry,
      getWidgetGeometry,
      getWidgetMinGeometry,
      getWidgetMaxGeometry,
      clampWidgetGeometry,
      getWidgetOrder
    };
  }
});

// src/ui/screens/homeScreen.js
var require_homeScreen = __commonJS({
  "src/ui/screens/homeScreen.js"(exports2, module2) {
    var {
      clampWidgetGeometry,
      getEnabledWidgets,
      getWidgetCssClass,
      getWidgetDefinition,
      getWidgetGeometry,
      getWidgetMaxGeometry,
      getWidgetMinGeometry
    } = require_widgetSystem();
    var {
      getHomeLayout,
      getHomeLayoutColumns,
      getHomeLayoutMode,
      getHomeLayoutRowHeight
    } = require_layoutSystem();
    var {
      normalizeHomeLayout: normalizeHomeLayout2
    } = require_layoutConfig();
    var HOME_PANEL_WIDGET_IDS = ["today", "hero", "quests", "rewards", "inventory", "wallet"];
    var ENABLE_HOME_FREEFORM = false;
    var ENABLE_HOME_FREEFORM_RESIZE = false;
    function isHomePanelWidget(id) {
      return HOME_PANEL_WIDGET_IDS.includes(id);
    }
    function getWidgetClass(baseClass, widget) {
      return [
        baseClass,
        "vrpg-widget",
        getWidgetCssClass(widget)
      ].filter(Boolean).join(" ");
    }
    function getWidgetAttr(widget) {
      return { "data-widget-id": widget.id };
    }
    function getEnabledLayoutWidgets(data = {}) {
      return getEnabledWidgets(data.settings || {});
    }
    function getActivePanelWidget(panelWidgets, requestedPanel) {
      if (!panelWidgets.length) return null;
      const defaultPanel = panelWidgets.find((widget) => widget.id === "hero") || panelWidgets[0];
      if (!requestedPanel || requestedPanel === "dashboard") return defaultPanel;
      return panelWidgets.find((widget) => widget.id === requestedPanel) || defaultPanel;
    }
    function getFallbackGeometry(widget, index, columns) {
      const sizeGeometry = {
        small: { w: 3, h: 2 },
        medium: { w: 6, h: 2 },
        large: { w: 8, h: 3 },
        full: { w: columns, h: 3 }
      };
      const base = sizeGeometry[widget.size] || sizeGeometry.medium;
      const w = Math.min(base.w, columns);
      const h = base.h;
      const x = index % 2 === 0 ? 0 : Math.max(0, columns - w);
      const y = Math.floor(index / 2) * 3;
      return { x, y, w, h };
    }
    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }
    function renderHomeScreen2(parent, ctx = {}) {
      const data = ctx.data;
      const totals2 = ctx.totals;
      const dateKey2 = ctx.dateKey;
      const readDayStats2 = ctx.readDayStats;
      const waterStats2 = ctx.waterStats;
      const streak2 = ctx.streak;
      const getHeroClassTitle2 = ctx.getHeroClassTitle;
      const getDay2 = ctx.getDay || (() => ({ completed: {}, mood: "normal" }));
      const activeHabits2 = ctx.activeHabits || (() => []);
      const skillStats2 = ctx.skillStats || (() => ({
        body: { done: 0, total: 0 },
        mind: { done: 0, total: 0 },
        craft: { done: 0, total: 0 },
        control: { done: 0, total: 0 }
      }));
      const heroTitle2 = ctx.heroTitle || ((level) => `Level ${level}`);
      const walletStats2 = ctx.walletStats || (() => ({ income: 0, expense: 0, balance: 0, items: [] }));
      const formatMoney2 = ctx.formatMoney || ((value) => String(value || 0));
      const createProgressBar2 = ctx.createProgressBar;
      const text = ctx.text;
      const timeParts2 = ctx.timeParts;
      const dayPhase2 = ctx.dayPhase;
      const monthLabel2 = ctx.monthLabel;
      const dateFromKey2 = ctx.dateFromKey || (() => /* @__PURE__ */ new Date());
      const calendarDays2 = ctx.calendarDays;
      const renderWaterWidget2 = ctx.renderWaterWidget;
      const renderAvatar = ctx.renderAvatar;
      const navigate = ctx.navigate;
      const toggleHomeEditMode = ctx.toggleHomeEditMode || (() => {
      });
      const updateHomeLayout = ctx.updateHomeLayout || (() => {
      });
      const changeWater = ctx.changeWater;
      const toggleHabit = ctx.toggleHabit || (() => {
      });
      const t = totals2(data);
      const now = /* @__PURE__ */ new Date();
      const selectedKey = ctx.selectedDateKey || dateKey2(now);
      const selectedDate = dateFromKey2(selectedKey);
      const selectedStats = readDayStats2(data, selectedKey);
      const selectedWater = waterStats2(data, selectedKey);
      const weekKeys = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        weekKeys.push(dateKey2(date));
      }
      const weekStats = weekKeys.map((key) => readDayStats2(data, key));
      const strongDays = weekStats.filter((day) => day.percent >= 50).length;
      const bestDay = weekStats.reduce((best, day) => day.xp > best.xp ? day : best, { xp: 0, key: "" });
      const today = selectedStats;
      const selectedDay = getDay2(data, selectedKey);
      const habits = activeHabits2(data);
      const water = selectedWater;
      const isTodaySelected = selectedKey === dateKey2(now);
      const nextReward = data.rewards.slice().sort((a, b) => Number(a.cost || 0) - Number(b.cost || 0)).find((reward) => Number(reward.cost || 0) > t.balance);
      const nextRewardText = nextReward ? `\u0414\u043E "${nextReward.title}" \u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C ${Number(nextReward.cost || 0) - t.balance} XP` : "\u0411\u0430\u0437\u043E\u0432\u044B\u0439 \u043C\u0430\u0433\u0430\u0437\u0438\u043D \u0443\u0436\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D";
      const todayPercent = today.total ? Math.round(today.done / today.total * 100) : 0;
      const layoutWidgets = getEnabledLayoutWidgets(data);
      const widgetById = new Map(layoutWidgets.map((widget) => [widget.id, widget]));
      const panelWidgets = layoutWidgets.filter((widget) => isHomePanelWidget(widget.id));
      const activePanelWidget = getActivePanelWidget(panelWidgets, ctx.homePanel);
      const activePanelId = activePanelWidget ? activePanelWidget.id : "";
      const visibleWidgetIds = /* @__PURE__ */ new Set(["command", "clock", "calendar", "water"]);
      if (activePanelWidget) visibleWidgetIds.add(activePanelWidget.id);
      const rawHomeEditMode = !!ctx.isHomeEditMode;
      const homeLayoutMode = getHomeLayoutMode(data.settings || {});
      const isFreeformMode = ENABLE_HOME_FREEFORM && homeLayoutMode === "freeform";
      const isGridMode = !isFreeformMode;
      const isHomeEditMode = isFreeformMode && rawHomeEditMode;
      const columns = getHomeLayoutColumns(data.settings || {});
      const rowHeight = getHomeLayoutRowHeight(data.settings || {});
      let fallbackGeometryIndex = 0;
      let draggedWidgetId = null;
      const widgetGeometryById = /* @__PURE__ */ new Map();
      if (isFreeformMode) {
        const editBar = parent.createDiv({ cls: "vrpg-home-edit-bar" });
        const editButton = editBar.createEl("button", {
          cls: isHomeEditMode ? "vrpg-primary is-active" : "vrpg-primary",
          text: isHomeEditMode ? "\u0413\u043E\u0442\u043E\u0432\u043E" : "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u044D\u043A\u0440\u0430\u043D"
        });
        editButton.onclick = toggleHomeEditMode;
      }
      const top = parent.createDiv({
        cls: [
          "vrpg-home-top",
          isFreeformMode ? "vrpg-freeform-canvas" : "vrpg-widget-grid",
          isGridMode ? "vrpg-home-shell" : "",
          isHomeEditMode ? "vrpg-home-edit-mode" : ""
        ].filter(Boolean).join(" ")
      });
      if (isFreeformMode) {
        top.style.setProperty("--vrpg-freeform-columns", String(columns));
        top.style.setProperty("--vrpg-freeform-row-height", `${rowHeight}px`);
        top.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
      }
      const getGridMetrics = () => {
        const canvasRect = top.getBoundingClientRect();
        const styles = window.getComputedStyle(top);
        const columnGap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
        const rowGap = Number.parseFloat(styles.rowGap || styles.gap || "0") || 0;
        const columnWidth = columns > 0 ? (canvasRect.width - columnGap * Math.max(0, columns - 1)) / columns : canvasRect.width;
        return {
          canvasRect,
          columnGap,
          rowGap,
          columnWidth,
          columnStep: Math.max(1, columnWidth + columnGap),
          rowStep: Math.max(1, rowHeight + rowGap)
        };
      };
      const isFreeformInteractionDisabled = () => {
        const rect = top.getBoundingClientRect();
        return rect.width < 720 || window.matchMedia && window.matchMedia("(max-width: 820px)").matches;
      };
      const applyFreeformGeometry = (root, geometry) => {
        root.style.setProperty("--vrpg-widget-x", String(geometry.x));
        root.style.setProperty("--vrpg-widget-y", String(geometry.y));
        root.style.setProperty("--vrpg-widget-w", String(geometry.w));
        root.style.setProperty("--vrpg-widget-h", String(geometry.h));
        root.style.gridColumn = `${geometry.x + 1} / span ${geometry.w}`;
        root.style.gridRow = `${geometry.y + 1} / span ${geometry.h}`;
      };
      const geometriesOverlap = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
      const hasGeometryCollision = (id, geometry) => {
        for (const widget of layoutWidgets) {
          if (widget.id === id || !visibleWidgetIds.has(widget.id)) continue;
          const otherGeometry = widgetGeometryById.get(widget.id);
          if (otherGeometry && geometriesOverlap(geometry, otherGeometry)) return true;
        }
        return false;
      };
      const setGeometryValidation = (root, id, geometry) => {
        const invalid = hasGeometryCollision(id, geometry);
        root.classList.toggle("is-invalid-drop", invalid);
        root.classList.toggle("is-valid-drop", !invalid);
        return !invalid;
      };
      const clearGeometryValidation = (root) => {
        root.classList.remove("is-invalid-drop", "is-valid-drop");
      };
      const returnToGeometry = (root, geometry) => {
        root.classList.add("is-returning");
        clearPixelPreview(root);
        applyFreeformGeometry(root, geometry);
        window.setTimeout(() => {
          root.classList.remove("is-returning");
          clearGeometryValidation(root);
        }, 220);
      };
      const geometryWidthToPixels = (w, metrics) => Math.max(1, w * metrics.columnWidth + Math.max(0, w - 1) * metrics.columnGap);
      const geometryHeightToPixels = (h, metrics) => Math.max(1, h * rowHeight + Math.max(0, h - 1) * metrics.rowGap);
      const clearPixelPreview = (root) => {
        root.style.transform = "";
        root.style.width = "";
        root.style.height = "";
        root.style.minHeight = "";
      };
      const pixelPositionToGeometry = (left, topValue, geometry, metrics) => ({
        x: clamp(Math.round(left / metrics.columnStep), 0, Math.max(0, columns - geometry.w)),
        y: Math.max(0, Math.round(topValue / metrics.rowStep)),
        w: geometry.w,
        h: geometry.h
      });
      const pixelSizeToGeometry = (id, width, height, geometry, metrics) => clampWidgetGeometry(id, {
        x: geometry.x,
        y: geometry.y,
        w: Math.max(1, Math.round((width + metrics.columnGap) / metrics.columnStep)),
        h: Math.max(1, Math.round((height + metrics.rowGap) / metrics.rowStep))
      }, { columns });
      const clearDragState = () => {
        top.querySelectorAll(".is-dragging, .is-drag-over, .is-drag-over-before, .is-drag-over-after").forEach((element) => {
          element.classList.remove("is-dragging", "is-drag-over", "is-drag-over-before", "is-drag-over-after");
        });
      };
      const moveHomeWidgetTo = (id, targetId, placeAfter) => {
        const current = getHomeLayout(data.settings || {});
        const widgets = current.widgets.map((widget2) => ({ ...widget2 }));
        const fromIndex = widgets.findIndex((widget2) => widget2.id === id);
        const targetIndex = widgets.findIndex((widget2) => widget2.id === targetId);
        if (fromIndex < 0 || targetIndex < 0 || id === targetId) return;
        const [widget] = widgets.splice(fromIndex, 1);
        const adjustedTargetIndex = widgets.findIndex((item) => item.id === targetId);
        widgets.splice(adjustedTargetIndex + (placeAfter ? 1 : 0), 0, widget);
        updateHomeLayout(normalizeHomeLayout2({
          version: current.version || 1,
          widgets
        }, { columns }));
      };
      const saveWidgetGeometry = (id, geometry) => {
        const current = getHomeLayout(data.settings || {});
        const widgets = current.widgets.map((widget2) => ({ ...widget2 }));
        const widget = widgets.find((item) => item.id === id);
        if (!widget) return;
        Object.assign(widget, {
          x: geometry.x,
          y: geometry.y,
          w: geometry.w,
          h: geometry.h
        });
        updateHomeLayout(normalizeHomeLayout2({
          version: current.version || 1,
          widgets
        }, { columns }));
      };
      const attachGridEditHandle = (root, widget) => {
        root.classList.add("vrpg-widget-editing");
        const handle = root.createEl("button", {
          cls: "vrpg-home-drag-handle",
          text: "\u2195",
          attr: {
            draggable: "true",
            title: "\u041F\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u044C \u0432\u0438\u0434\u0436\u0435\u0442"
          }
        });
        handle.ondragstart = (event) => {
          draggedWidgetId = widget.id;
          root.classList.add("is-dragging");
          if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", widget.id);
          }
        };
        handle.ondragend = () => {
          draggedWidgetId = null;
          clearDragState();
        };
        root.ondragover = (event) => {
          if (!draggedWidgetId || draggedWidgetId === widget.id) return;
          event.preventDefault();
          const rect = root.getBoundingClientRect();
          const placeAfter = event.clientY > rect.top + rect.height / 2;
          root.classList.add("is-drag-over");
          root.classList.toggle("is-drag-over-before", !placeAfter);
          root.classList.toggle("is-drag-over-after", placeAfter);
          if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
        };
        root.ondragleave = () => {
          root.classList.remove("is-drag-over", "is-drag-over-before", "is-drag-over-after");
        };
        root.ondrop = (event) => {
          const sourceId = draggedWidgetId || event.dataTransfer && event.dataTransfer.getData("text/plain");
          if (!sourceId || sourceId === widget.id) return;
          event.preventDefault();
          const rect = root.getBoundingClientRect();
          const placeAfter = event.clientY > rect.top + rect.height / 2;
          draggedWidgetId = null;
          clearDragState();
          moveHomeWidgetTo(sourceId, widget.id, placeAfter);
        };
      };
      const attachFreeformEditHandle = (root, widget, geometry) => {
        root.classList.add("vrpg-widget-editing");
        const definition = getWidgetDefinition(widget.id) || {};
        const header = root.createDiv({ cls: "vrpg-home-widget-header" });
        const meta = header.createDiv({ cls: "vrpg-home-widget-header-meta" });
        meta.createDiv({ cls: "vrpg-home-widget-title", text: definition.title || widget.id });
        meta.createDiv({ cls: "vrpg-home-widget-description", text: definition.description || widget.id });
        const actions = header.createDiv({ cls: "vrpg-home-widget-actions" });
        const handle = actions.createEl("button", {
          cls: "vrpg-home-drag-handle",
          text: "\u2195",
          attr: {
            title: "\u041F\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u044C \u0432\u0438\u0434\u0436\u0435\u0442"
          }
        });
        handle.onpointerdown = (event) => {
          if (isFreeformInteractionDisabled()) return;
          event.preventDefault();
          event.stopPropagation();
          const metrics = getGridMetrics();
          const widgetRect = root.getBoundingClientRect();
          const start = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            left: widgetRect.left - metrics.canvasRect.left,
            top: widgetRect.top - metrics.canvasRect.top,
            x: geometry.x,
            y: geometry.y,
            w: geometry.w,
            h: geometry.h
          };
          let nextGeometry = { ...geometry };
          let isValidGeometry = true;
          root.classList.add("is-dragging");
          top.classList.add("is-freeform-dragging");
          if (handle.setPointerCapture) handle.setPointerCapture(event.pointerId);
          const onPointerMove = (moveEvent) => {
            moveEvent.preventDefault();
            const deltaX = moveEvent.clientX - start.pointerX;
            const deltaY = moveEvent.clientY - start.pointerY;
            const finalLeft = start.left + deltaX;
            const finalTop = start.top + deltaY;
            nextGeometry = pixelPositionToGeometry(finalLeft, finalTop, geometry, metrics);
            root.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.012)`;
            isValidGeometry = setGeometryValidation(root, widget.id, nextGeometry);
          };
          const onPointerUp = (upEvent) => {
            upEvent.preventDefault();
            handle.removeEventListener("pointermove", onPointerMove);
            handle.removeEventListener("pointerup", onPointerUp);
            handle.removeEventListener("pointercancel", onPointerUp);
            if (handle.releasePointerCapture) {
              try {
                handle.releasePointerCapture(upEvent.pointerId);
              } catch (error) {
              }
            }
            root.classList.remove("is-dragging");
            top.classList.remove("is-freeform-dragging");
            if (!isValidGeometry) {
              returnToGeometry(root, geometry);
              return;
            }
            clearGeometryValidation(root);
            clearPixelPreview(root);
            applyFreeformGeometry(root, nextGeometry);
            if (nextGeometry.x !== geometry.x || nextGeometry.y !== geometry.y) {
              saveWidgetGeometry(widget.id, nextGeometry);
            }
          };
          handle.addEventListener("pointermove", onPointerMove);
          handle.addEventListener("pointerup", onPointerUp);
          handle.addEventListener("pointercancel", onPointerUp);
        };
        if (!ENABLE_HOME_FREEFORM_RESIZE) return;
        const resize = root.createEl("button", {
          cls: "vrpg-home-resize-handle",
          text: "\u2198",
          attr: {
            title: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0440\u0430\u0437\u043C\u0435\u0440 \u0432\u0438\u0434\u0436\u0435\u0442\u0430"
          }
        });
        resize.onpointerdown = (event) => {
          if (isFreeformInteractionDisabled()) return;
          event.preventDefault();
          event.stopPropagation();
          const metrics = getGridMetrics();
          const widgetRect = root.getBoundingClientRect();
          const min = getWidgetMinGeometry(widget.id);
          const max = getWidgetMaxGeometry(widget.id, { columns });
          const maxW = Math.min(max.w, Math.max(min.w, columns - geometry.x));
          const minWidth = geometryWidthToPixels(min.w, metrics);
          const minHeight = geometryHeightToPixels(min.h, metrics);
          const maxWidth = geometryWidthToPixels(maxW, metrics);
          const maxHeight = geometryHeightToPixels(max.h, metrics);
          const start = {
            pointerX: event.clientX,
            pointerY: event.clientY,
            width: widgetRect.width,
            height: widgetRect.height,
            x: geometry.x,
            y: geometry.y,
            w: geometry.w,
            h: geometry.h
          };
          let nextGeometry = { ...geometry };
          let isValidGeometry = true;
          root.classList.add("is-resizing");
          top.classList.add("is-freeform-resizing");
          if (resize.setPointerCapture) resize.setPointerCapture(event.pointerId);
          const onPointerMove = (moveEvent) => {
            moveEvent.preventDefault();
            const previewWidth = clamp(start.width + moveEvent.clientX - start.pointerX, minWidth, maxWidth);
            const previewHeight = clamp(start.height + moveEvent.clientY - start.pointerY, minHeight, maxHeight);
            nextGeometry = pixelSizeToGeometry(widget.id, previewWidth, previewHeight, geometry, metrics);
            root.style.width = `${previewWidth}px`;
            root.style.height = `${previewHeight}px`;
            root.style.minHeight = `${previewHeight}px`;
            isValidGeometry = setGeometryValidation(root, widget.id, nextGeometry);
          };
          const onPointerUp = (upEvent) => {
            upEvent.preventDefault();
            resize.removeEventListener("pointermove", onPointerMove);
            resize.removeEventListener("pointerup", onPointerUp);
            resize.removeEventListener("pointercancel", onPointerUp);
            if (resize.releasePointerCapture) {
              try {
                resize.releasePointerCapture(upEvent.pointerId);
              } catch (error) {
              }
            }
            root.classList.remove("is-resizing");
            top.classList.remove("is-freeform-resizing");
            if (!isValidGeometry) {
              returnToGeometry(root, geometry);
              return;
            }
            clearGeometryValidation(root);
            clearPixelPreview(root);
            applyFreeformGeometry(root, nextGeometry);
            if (nextGeometry.w !== geometry.w || nextGeometry.h !== geometry.h) {
              saveWidgetGeometry(widget.id, nextGeometry);
            }
          };
          resize.addEventListener("pointermove", onPointerMove);
          resize.addEventListener("pointerup", onPointerUp);
          resize.addEventListener("pointercancel", onPointerUp);
        };
      };
      const attachHomeEditHandle = (root, widget, geometry) => {
        if (!isHomeEditMode || !root || !widget) return;
        if (isFreeformMode) {
          attachFreeformEditHandle(root, widget, geometry);
          return;
        }
        if (isGridMode) attachGridEditHandle(root, widget);
      };
      const prepareWidgetRoot = (root, widget) => {
        if (!root || !widget) return root;
        let geometry = null;
        if (isFreeformMode) {
          geometry = getWidgetGeometry(widget) || getFallbackGeometry(widget, fallbackGeometryIndex, columns);
          fallbackGeometryIndex += 1;
          widgetGeometryById.set(widget.id, geometry);
          root.classList.add("vrpg-freeform-widget");
          applyFreeformGeometry(root, geometry);
        }
        attachHomeEditHandle(root, widget, geometry);
        return root;
      };
      const renderCommandWidget = (widget, parentEl = top) => {
        const card = parentEl.createDiv({
          cls: getWidgetClass("vrpg-hero-card vrpg-command-card", widget),
          attr: getWidgetAttr(widget)
        });
        prepareWidgetRoot(card, widget);
        const commandHeader = card.createDiv({ cls: "vrpg-command-header" });
        const profile = commandHeader.createDiv({ cls: "vrpg-command-profile" });
        renderAvatar(profile, data, "vrpg-command-avatar");
        const profileText = profile.createDiv({ cls: "vrpg-command-identity" });
        profileText.createDiv({ cls: "vrpg-kicker", text: isTodaySelected ? text.dayPanel : selectedKey });
        profileText.createDiv({ cls: "vrpg-title", text: data.player.name || `Level ${t.level}` });
        profileText.createDiv({ cls: "vrpg-subtitle", text: `${getHeroClassTitle2(data.player)} \xB7 Level ${t.level}` });
        const commandVitals = commandHeader.createDiv({ cls: "vrpg-command-vitals" });
        const xpVital = commandVitals.createDiv({ cls: "vrpg-command-vital" });
        xpVital.createDiv({ cls: "vrpg-section", text: "XP" });
        xpVital.createDiv({ cls: "vrpg-card-title", text: `${t.balance}` });
        xpVital.createDiv({ cls: "vrpg-subtitle", text: `${t.levelXP}/100 \u0443\u0440\u043E\u0432\u043D\u044F` });
        const streakVital = commandVitals.createDiv({ cls: "vrpg-command-vital" });
        streakVital.createDiv({ cls: "vrpg-section", text: "\u0421\u0435\u0440\u0438\u044F" });
        streakVital.createDiv({ cls: "vrpg-card-title", text: `${streak2(data)}` });
        streakVital.createDiv({ cls: "vrpg-subtitle", text: "\u0434\u043D\u0435\u0439" });
        createProgressBar2(card, todayPercent, "vrpg-command-progress");
        const commandGrid = card.createDiv({ cls: "vrpg-command-grid" });
        const commandItems = {
          today: [isTodaySelected ? "\u0421\u0435\u0433\u043E\u0434\u043D\u044F" : "\u0414\u0435\u043D\u044C", "\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0438"],
          hero: ["\u0413\u0435\u0440\u043E\u0439", `${t.levelXP}/100 XP \u0443\u0440\u043E\u0432\u043D\u044F`],
          quests: ["\u041A\u0432\u0435\u0441\u0442\u044B", `${today.done >= 3 ? "\u0434\u043D\u0435\u0432\u043D\u043E\u0439 \u043C\u0438\u043D\u0438\u043C\u0443\u043C \u0437\u0430\u043A\u0440\u044B\u0442" : `${Math.min(today.done, 3)}/3 \u0434\u043E \u043C\u0438\u043D\u0438\u043C\u0443\u043C\u0430`}`],
          rewards: ["\u041C\u0430\u0433\u0430\u0437\u0438\u043D", nextRewardText],
          inventory: ["\u0418\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C", `${data.inventory.filter((item) => !item.used).length} \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445`],
          wallet: ["\u0411\u0430\u043D\u043A", `${(data.wallet || []).length} \u0437\u0430\u043F\u0438\u0441\u0435\u0439`]
        };
        const panelWidgetById = new Map(panelWidgets.map((panelWidget) => [panelWidget.id, panelWidget]));
        HOME_PANEL_WIDGET_IDS.forEach((id) => {
          const panelWidget = panelWidgetById.get(id);
          if (!panelWidget) return;
          const [title, desc] = commandItems[panelWidget.id];
          const action = commandGrid.createEl("button", { cls: activePanelId === panelWidget.id ? "vrpg-command-action is-active" : "vrpg-command-action" });
          action.createEl("strong", { text: title });
          action.createSpan({ text: desc });
          action.onclick = () => {
            navigate({ tab: "home", homePanel: panelWidget.id });
          };
        });
      };
      const renderClockWidget = (widget, parentEl = top) => {
        const clock = parentEl.createDiv({
          cls: getWidgetClass("vrpg-glass-widget vrpg-clock-widget", widget),
          attr: getWidgetAttr(widget)
        });
        prepareWidgetRoot(clock, widget);
        clock.createDiv({ cls: "vrpg-kicker", text: "\u0421\u0435\u0439\u0447\u0430\u0441" });
        const parts = timeParts2(now);
        const clockFace = clock.createDiv({ cls: "vrpg-clock" });
        clockFace.createSpan({ text: parts.hours });
        clockFace.createSpan({ cls: "vrpg-clock-colon", text: ":" });
        clockFace.createSpan({ text: parts.minutes });
        clock.createDiv({ cls: "vrpg-phase", text: dayPhase2(now) });
        clock.createDiv({ cls: "vrpg-subtitle", text: now.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" }) });
      };
      const renderCalendarWidget = (widget, parentEl = top) => {
        const calendarDate = Number.isFinite(selectedDate.getTime()) ? selectedDate : now;
        const monthDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
        const moveMonth = (delta) => {
          const targetYear = monthDate.getFullYear();
          const targetMonth = monthDate.getMonth() + delta;
          const maxDay = new Date(targetYear, targetMonth + 1, 0).getDate();
          const targetDay = Math.min(calendarDate.getDate(), maxDay);
          navigate({ selectedDateKey: dateKey2(new Date(targetYear, targetMonth, targetDay)) });
        };
        const calendar = parentEl.createDiv({
          cls: getWidgetClass("vrpg-glass-widget", widget),
          attr: getWidgetAttr(widget)
        });
        prepareWidgetRoot(calendar, widget);
        const calendarHeader = calendar.createDiv({ cls: "vrpg-preview-header" });
        calendarHeader.createEl("button", { cls: "vrpg-icon-action", text: "\u2039" }).onclick = () => moveMonth(-1);
        calendarHeader.createDiv({ cls: "vrpg-kicker", text: monthLabel2(monthDate) });
        calendarHeader.createEl("button", { cls: "vrpg-icon-action", text: "\u203A" }).onclick = () => moveMonth(1);
        const week = calendar.createDiv({ cls: "vrpg-calendar" });
        ["\u041F", "\u0412", "\u0421", "\u0427", "\u041F", "\u0421", "\u0412"].forEach((day) => week.createSpan({ cls: "vrpg-calendar-head", text: day }));
        for (const day of calendarDays2(monthDate)) {
          const key = day ? dateKey2(new Date(monthDate.getFullYear(), monthDate.getMonth(), day)) : "";
          const dayButton = week.createEl("button", {
            cls: [
              "vrpg-calendar-day",
              key === dateKey2(now) ? "is-today" : "",
              key === selectedKey ? "is-selected" : ""
            ].filter(Boolean).join(" "),
            text: day ? String(day) : ""
          });
          if (day) {
            dayButton.onclick = () => {
              navigate({ selectedDateKey: key });
            };
          } else {
            dayButton.disabled = true;
          }
        }
        const dayDetails = calendar.createDiv({ cls: "vrpg-calendar-details" });
        dayDetails.createDiv({ cls: "vrpg-card-title", text: selectedKey });
        dayDetails.createDiv({ cls: "vrpg-subtitle", text: `\u041F\u0440\u0438\u0432\u044B\u0447\u043A\u0438: ${selectedStats.done}/${selectedStats.total} \xB7 \u0412\u043E\u0434\u0430: ${selectedWater.value}/${selectedWater.goal}` });
        dayDetails.createDiv({ cls: "vrpg-subtitle", text: isGridMode ? `\u041D\u0435\u0434\u0435\u043B\u044F: ${strongDays}/7 \xB7 \u0441\u0435\u0440\u0438\u044F ${streak2(data)}` : `\u041D\u0435\u0434\u0435\u043B\u044F: ${strongDays}/7 \u0441\u0438\u043B\u044C\u043D\u044B\u0445 \u0434\u043D\u0435\u0439 \xB7 \u043B\u0443\u0447\u0448\u0438\u0439 \u0434\u0435\u043D\u044C ${bestDay.xp} XP \xB7 \u0441\u0435\u0440\u0438\u044F ${streak2(data)}` });
      };
      const renderWaterLayoutWidget = (widget, parentEl = top) => {
        const waterRoot = renderWaterWidget2(parentEl, {
          stats: water,
          title: "\u0412\u043E\u0434\u0430",
          mode: "ring",
          className: getWidgetClass("vrpg-glass-widget vrpg-water-widget", widget),
          onDecrement: () => changeWater(-1, selectedKey),
          onIncrement: () => changeWater(1, selectedKey)
        });
        waterRoot.setAttribute("data-widget-id", widget.id);
        prepareWidgetRoot(waterRoot, widget);
      };
      const renderPreviewWidget = (widget, className, title, subtitle, renderBody, options = {}) => {
        const card = top.createDiv({
          cls: getWidgetClass(`vrpg-home-module vrpg-home-preview ${className}`, widget),
          attr: getWidgetAttr(widget)
        });
        prepareWidgetRoot(card, widget);
        const header = card.createDiv({ cls: "vrpg-preview-header" });
        const titleWrap = header.createDiv();
        titleWrap.createDiv({ cls: "vrpg-section", text: title });
        if (subtitle) titleWrap.createDiv({ cls: "vrpg-subtitle", text: subtitle });
        const body = card.createDiv({ cls: "vrpg-preview-body" });
        renderBody(body, card);
        if (options.openPanel) {
          const open = body.createEl("button", { cls: "vrpg-primary vrpg-preview-open", text: options.openLabel || "\u041E\u0442\u043A\u0440\u044B\u0442\u044C" });
          open.onclick = () => navigate({ tab: "home", homePanel: options.openPanel });
        }
        return card;
      };
      const renderTodayPreview = (widget) => {
        renderPreviewWidget(widget, "vrpg-preview-today", "\u0421\u0435\u0433\u043E\u0434\u043D\u044F", `${today.done}/${today.total} \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E \xB7 ${today.xp} XP`, (body) => {
          const topLine = body.createDiv({ cls: "vrpg-preview-progress-line" });
          topLine.createDiv({ cls: "vrpg-card-title", text: `${today.done}/${today.total}` });
          topLine.createDiv({ cls: "vrpg-subtitle", text: today.done >= 3 ? "\u043C\u0438\u043D\u0438\u043C\u0443\u043C \u0434\u043D\u044F \u0437\u0430\u043A\u0440\u044B\u0442" : `${Math.min(today.done, 3)}/3 \u0434\u043E \u043C\u0438\u043D\u0438\u043C\u0443\u043C\u0430` });
          createProgressBar2(body, todayPercent, "vrpg-preview-progress");
          const list = body.createDiv({ cls: "vrpg-preview-task-list" });
          if (!habits.length) {
            list.createDiv({ cls: "vrpg-preview-empty", text: "\u041F\u0440\u0438\u0432\u044B\u0447\u043A\u0438 \u043D\u0430 \u0441\u0435\u0433\u043E\u0434\u043D\u044F \u043D\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B" });
          } else {
            habits.slice(0, 3).forEach((habit) => {
              const done = !!(selectedDay.completed && selectedDay.completed[habit.id]);
              const button = list.createEl("button", {
                cls: done ? "vrpg-preview-task is-done" : "vrpg-preview-task"
              });
              button.createSpan({ text: `${habit.icon || "\u2022"} ${habit.title}` });
              button.createEl("strong", { text: done ? "\u2713" : `+${Number(habit.xp || 10)} XP` });
              button.onclick = () => toggleHabit(habit.id, selectedKey);
            });
          }
          if (habits.length > 3) {
            body.createDiv({ cls: "vrpg-subtitle", text: `\u0415\u0449\u0451 ${habits.length - 3} \u043F\u0440\u0438\u0432\u044B\u0447\u0435\u043A \u0432 \u0440\u0430\u0437\u0434\u0435\u043B\u0435 \u0421\u0435\u0433\u043E\u0434\u043D\u044F` });
          }
        }, { openPanel: "today", openLabel: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0434\u0435\u043D\u044C" });
      };
      const renderHeroProgressPreview = (widget) => {
        renderPreviewWidget(widget, "vrpg-preview-hero", "\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0433\u0435\u0440\u043E\u044F", `${heroTitle2(t.level)} \xB7 ${t.levelXP}/100 XP \u0443\u0440\u043E\u0432\u043D\u044F`, (body) => {
          body.createDiv({ cls: "vrpg-preview-level", text: `LEVEL ${t.level}` });
          createProgressBar2(body, t.levelXP, "vrpg-preview-progress");
          const statsGrid = body.createDiv({ cls: "vrpg-preview-stat-grid" });
          [
            ["XP", `${t.balance}`],
            ["\u0421\u0435\u0440\u0438\u044F", `${streak2(data)} \u0434\u043D\u0435\u0439`],
            ["\u041D\u0435\u0434\u0435\u043B\u044F", `${strongDays}/7`]
          ].forEach(([label, value]) => {
            const item = statsGrid.createDiv({ cls: "vrpg-preview-stat" });
            item.createSpan({ text: label });
            item.createEl("strong", { text: value });
          });
        }, { openPanel: "hero", openLabel: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0433\u0435\u0440\u043E\u044F" });
      };
      const renderQuestsPreview = (widget) => {
        renderPreviewWidget(widget, "vrpg-preview-quests", "\u041A\u0432\u0435\u0441\u0442\u044B", `${Math.min(today.done, 3)}/3 \u0434\u043E \u043C\u0438\u043D\u0438\u043C\u0443\u043C\u0430`, (body) => {
          if (!habits.length) {
            body.createDiv({ cls: "vrpg-preview-empty", text: "\u041A\u0432\u0435\u0441\u0442\u044B \u043D\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u044B" });
            return;
          }
          const rows = [
            ["\u041C\u0438\u043D\u0438\u043C\u0443\u043C \u0434\u043D\u044F", `${Math.min(today.done, 3)}/3`, today.done >= 3 ? "\u0437\u0430\u043A\u0440\u044B\u0442" : "\u0432 \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u0435"],
            ["\u0421\u0438\u043B\u044C\u043D\u0430\u044F \u043D\u0435\u0434\u0435\u043B\u044F", `${strongDays}/7`, `\u043B\u0443\u0447\u0448\u0438\u0439 \u0434\u0435\u043D\u044C ${bestDay.xp} XP`]
          ];
          rows.forEach(([label, value, note]) => {
            const row = body.createDiv({ cls: "vrpg-preview-row" });
            row.createDiv({ cls: "vrpg-card-title", text: value });
            const copy = row.createDiv();
            copy.createDiv({ cls: "vrpg-section", text: label });
            copy.createDiv({ cls: "vrpg-subtitle", text: note });
          });
        }, { openPanel: "quests", openLabel: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043A\u0432\u0435\u0441\u0442\u044B" });
      };
      const renderRewardsPreview = (widget) => {
        const rewards = (data.rewards || []).slice().sort((a, b) => Number(a.cost || 0) - Number(b.cost || 0));
        const available = rewards.filter((reward) => t.balance >= Number(reward.cost || 0));
        const previewRewards = available.length ? available.slice(0, 2) : rewards.slice(0, 2);
        renderPreviewWidget(widget, "vrpg-preview-rewards", "\u041D\u0430\u0433\u0440\u0430\u0434\u044B", available.length ? `\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u043E: ${available.length}` : nextRewardText, (body) => {
          if (!previewRewards.length) {
            body.createDiv({ cls: "vrpg-preview-empty", text: "\u041D\u0430\u0433\u0440\u0430\u0434\u044B \u043D\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u044B" });
            return;
          }
          previewRewards.forEach((reward) => {
            const row = body.createDiv({ cls: "vrpg-preview-row" });
            row.createDiv({ cls: "vrpg-card-title", text: `${reward.icon || "\u{1F381}"} ${reward.title}` });
            row.createDiv({ cls: "vrpg-subtitle", text: `${reward.cost} XP` });
          });
        }, { openPanel: "rewards", openLabel: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043C\u0430\u0433\u0430\u0437\u0438\u043D" });
      };
      const renderInventoryPreview = (widget) => {
        const items = (data.inventory || []).slice().reverse();
        const activeItems = items.filter((item) => !item.used);
        renderPreviewWidget(widget, "vrpg-preview-inventory", "\u0418\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C", `${activeItems.length} \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \xB7 ${items.length} \u0432\u0441\u0435\u0433\u043E`, (body) => {
          if (!items.length) {
            body.createDiv({ cls: "vrpg-preview-empty", text: "\u0418\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C \u043F\u0443\u0441\u0442" });
          } else {
            const loot = body.createDiv({ cls: "vrpg-preview-loot-row" });
            items.slice(0, 3).forEach((item) => {
              const chip = loot.createDiv({ cls: item.used ? "vrpg-preview-loot is-muted" : "vrpg-preview-loot" });
              chip.createDiv({ cls: "vrpg-card-title", text: item.icon || "\u{1F381}" });
              chip.createDiv({ cls: "vrpg-subtitle", text: item.title });
            });
          }
        }, { openPanel: "inventory", openLabel: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C" });
      };
      const renderWalletPreview = (widget) => {
        const all = walletStats2(data.wallet || []);
        renderPreviewWidget(widget, "vrpg-preview-wallet", "\u0411\u0430\u043D\u043A", `${(data.wallet || []).length} \u0437\u0430\u043F\u0438\u0441\u0435\u0439`, (body) => {
          const grid = body.createDiv({ cls: "vrpg-preview-stat-grid" });
          [
            ["\u0411\u0430\u043B\u0430\u043D\u0441", `${formatMoney2(all.balance)} \u20BD`],
            ["\u0414\u043E\u0445\u043E\u0434\u044B", `+${formatMoney2(all.income)} \u20BD`],
            ["\u0420\u0430\u0441\u0445\u043E\u0434\u044B", `-${formatMoney2(all.expense)} \u20BD`]
          ].forEach(([label, value]) => {
            const item = grid.createDiv({ cls: "vrpg-preview-stat" });
            item.createSpan({ text: label });
            item.createEl("strong", { text: value });
          });
          if (!(data.wallet || []).length) body.createDiv({ cls: "vrpg-preview-empty", text: "\u0417\u0430\u043F\u0438\u0441\u0435\u0439 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442" });
        }, { openPanel: "wallet", openLabel: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0431\u0430\u043D\u043A" });
      };
      const renderModuleWidget = (widget) => {
        if (!widget || !isHomePanelWidget(widget.id)) return;
        renderHomeModuleScreen2(top, { ...ctx, homePanel: widget.id, prepareWidgetRoot }, widget);
      };
      if (isGridMode) {
        const mainColumn = top.createDiv({ cls: "vrpg-home-main" });
        const sideColumn = top.createDiv({ cls: "vrpg-home-side" });
        if (widgetById.has("command")) renderCommandWidget(widgetById.get("command"), mainColumn);
        if (activePanelWidget) renderHomeModuleScreen2(mainColumn, { ...ctx, homePanel: activePanelWidget.id, prepareWidgetRoot }, activePanelWidget);
        if (widgetById.has("clock")) renderClockWidget(widgetById.get("clock"), sideColumn);
        if (widgetById.has("water")) renderWaterLayoutWidget(widgetById.get("water"), sideColumn);
        if (widgetById.has("calendar")) renderCalendarWidget(widgetById.get("calendar"), sideColumn);
        return;
      }
      for (const widget of layoutWidgets) {
        if (widget.id === "command") renderCommandWidget(widget);
        if (widget.id === "clock") renderClockWidget(widget);
        if (widget.id === "calendar") renderCalendarWidget(widget);
        if (widget.id === "water") renderWaterLayoutWidget(widget);
        if (activePanelWidget && widget.id === activePanelWidget.id) {
          renderHomeModuleScreen2(top, { ...ctx, homePanel: activePanelWidget.id, prepareWidgetRoot }, activePanelWidget);
        }
      }
    }
    function renderHomeModuleScreen2(parent, ctx = {}, widget = null) {
      const module3 = parent.createDiv({
        cls: widget ? getWidgetClass("vrpg-home-module", widget) : "vrpg-home-module",
        attr: widget ? getWidgetAttr(widget) : {}
      });
      if (widget && ctx.prepareWidgetRoot) ctx.prepareWidgetRoot(module3, widget);
      const body = module3.createDiv({ cls: "vrpg-module-body" });
      if (ctx.homePanel === "today") ctx.renderHomeToday(body);
      if (ctx.homePanel === "hero") ctx.renderHomeHero(body);
      if (ctx.homePanel === "quests") ctx.renderHomeQuests(body);
      if (ctx.homePanel === "rewards") ctx.renderHomeRewards(body);
      if (ctx.homePanel === "inventory") ctx.renderHomeInventory(body);
      if (ctx.homePanel === "wallet") ctx.renderHomeWallet(body);
    }
    module2.exports = {
      renderHomeScreen: renderHomeScreen2,
      renderHomeModuleScreen: renderHomeModuleScreen2
    };
  }
});

// src/ui/screens/homeTodayScreen.js
var require_homeTodayScreen = __commonJS({
  "src/ui/screens/homeTodayScreen.js"(exports2, module2) {
    function renderHomeTodayScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const selectedDateKey = ctx.selectedDateKey;
      const dateKey2 = ctx.dateKey;
      const getDay2 = ctx.getDay;
      const readDayStats2 = ctx.readDayStats;
      const activeHabits2 = ctx.activeHabits;
      const moods = ctx.moods || {};
      const setMood = ctx.setMood || (() => {
      });
      const toggleHabit = ctx.toggleHabit || (() => {
      });
      const key = selectedDateKey || dateKey2();
      const today = getDay2(data, key);
      const stats = readDayStats2(data, key, today);
      const habits = activeHabits2(data);
      const header = parent.createDiv({ cls: "vrpg-panel vrpg-day-focus vrpg-day-focus-compact" });
      const summary = header.createDiv({ cls: "vrpg-day-focus-summary" });
      summary.createDiv({ cls: "vrpg-card-title", text: key });
      summary.createDiv({ cls: "vrpg-subtitle", text: `${stats.done}/${stats.total} \u043F\u0440\u0438\u0432\u044B\u0447\u0435\u043A \xB7 ${stats.xp} XP` });
      const mood = header.createDiv({ cls: "vrpg-mood-row" });
      mood.createDiv({ cls: "vrpg-section", text: "\u041D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u0435 / \u044D\u043D\u0435\u0440\u0433\u0438\u044F" });
      const moodButtons = mood.createDiv({ cls: "vrpg-segmented" });
      Object.entries(moods).forEach(([id, label]) => {
        const button = moodButtons.createEl("button", { cls: today.mood === id ? "is-active" : "", text: label });
        button.onclick = () => setMood(id, key);
      });
      const list = parent.createDiv({ cls: "vrpg-card-grid vrpg-today-check-grid" });
      for (const habit of habits) {
        const done = !!today.completed[habit.id];
        const button = list.createEl("button", {
          cls: done ? "vrpg-check is-done" : "vrpg-check",
          text: `${habit.icon || "\u2022"} ${habit.title}`
        });
        button.onclick = () => toggleHabit(habit.id, key);
      }
    }
    module2.exports = {
      renderHomeTodayScreen: renderHomeTodayScreen2
    };
  }
});

// src/ui/screens/homeHeroScreen.js
var require_homeHeroScreen = __commonJS({
  "src/ui/screens/homeHeroScreen.js"(exports2, module2) {
    function renderHomeHeroScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const totals2 = ctx.totals;
      const skillStats2 = ctx.skillStats;
      const waterStats2 = ctx.waterStats;
      const streak2 = ctx.streak;
      const getHeroClassTitle2 = ctx.getHeroClassTitle;
      const heroTitle2 = ctx.heroTitle;
      const createProgressBar2 = ctx.createProgressBar;
      const renderRadar = ctx.renderRadar;
      const featureFlags = ctx.featureFlags || {};
      const achievements2 = ctx.achievements;
      const t = totals2(data);
      const stats = skillStats2(data);
      const water = waterStats2(data);
      const metrics = [
        ["\u0422\u0435\u043B\u043E", stats.body.total ? Math.round(stats.body.done / stats.body.total * 100) : 0],
        ["\u0420\u0430\u0437\u0443\u043C", stats.mind.total ? Math.round(stats.mind.done / stats.mind.total * 100) : 0],
        ["\u0414\u0435\u043B\u043E", stats.craft.total ? Math.round(stats.craft.done / stats.craft.total * 100) : 0],
        ["\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044C", stats.control.total ? Math.round(stats.control.done / stats.control.total * 100) : 0],
        ["\u0412\u043E\u0434\u0430", water.percent],
        ["\u0421\u0435\u0440\u0438\u044F", Math.min(100, Math.round(streak2(data) / 7 * 100))]
      ];
      const wrap = parent.createDiv({ cls: "vrpg-hero-preview" });
      const info = wrap.createDiv({ cls: "vrpg-hero-summary" });
      info.createDiv({ cls: "vrpg-kicker", text: getHeroClassTitle2(data.player) });
      info.createDiv({ cls: "vrpg-level", text: `LEVEL ${t.level}` });
      info.createDiv({ cls: "vrpg-hero-title", text: heroTitle2(t.level) });
      info.createDiv({ cls: "vrpg-subtitle", text: `${t.balance} XP \xB7 ${t.levelXP}/100 \u0434\u043E \u043D\u043E\u0432\u043E\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F` });
      createProgressBar2(info, t.levelXP, "vrpg-hero-xp");
      const battle = wrap.createDiv({ cls: "vrpg-hero-battle" });
      const radarPanel = battle.createDiv({ cls: "vrpg-hero-radar-panel" });
      renderRadar(radarPanel, metrics);
      const tracks = battle.createDiv({ cls: "vrpg-hero-tracks" });
      for (const [label, value] of metrics) {
        const track = tracks.createDiv({ cls: "vrpg-hero-track" });
        const row = track.createDiv({ cls: "vrpg-hero-track-top" });
        row.createSpan({ text: label });
        row.createEl("strong", { text: `${value}%` });
        track.createDiv({ cls: "vrpg-hero-track-bar" }).createDiv({
          cls: "vrpg-hero-track-fill",
          attr: { style: `width:${Math.max(0, Math.min(100, value))}%` }
        });
      }
      if (featureFlags.showAchievements) {
        const achPanel = parent.createDiv({ cls: "vrpg-panel vrpg-achievements" });
        achPanel.createDiv({ cls: "vrpg-section", text: "\u0414\u043E\u0441\u0442\u0438\u0436\u0435\u043D\u0438\u044F" });
        for (const item of achievements2(data)) {
          const row = achPanel.createDiv({ cls: item.done ? "vrpg-achievement is-done" : "vrpg-achievement" });
          row.createSpan({ text: item.done ? "\u2713" : "\u2022" });
          row.createEl("strong", { text: item.title });
        }
      }
    }
    module2.exports = {
      renderHomeHeroScreen: renderHomeHeroScreen2
    };
  }
});

// src/ui/screens/homeQuestsScreen.js
var require_homeQuestsScreen = __commonJS({
  "src/ui/screens/homeQuestsScreen.js"(exports2, module2) {
    function renderHomeQuestsScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const selectedKey = ctx.selectedDateKey;
      const dayStats2 = ctx.dayStats;
      const sortedDayKeys2 = ctx.sortedDayKeys;
      const streak2 = ctx.streak;
      const getQuestStatsCards2 = ctx.getQuestStatsCards;
      const questStatsCards = ctx.questStatsCards || [];
      const createStatCard2 = ctx.createStatCard;
      const today = dayStats2(data, selectedKey);
      const keys = sortedDayKeys2(data);
      const week = keys.slice(-7).map((key) => dayStats2(data, key));
      const doneWeek = week.filter((day) => day.percent >= 50).length;
      const values = {
        dailyXp: `${today.xp} XP`,
        minimum: `${Math.min(today.done, 3)}/3`,
        total: `${today.done}/${today.total}`,
        strongDays: `${doneWeek}/5`,
        streak: `${streak2(data)} \u0434\u043D\u0435\u0439`
      };
      const grid = parent.createDiv({ cls: "vrpg-card-grid" });
      for (const card of getQuestStatsCards2(data, values, questStatsCards, selectedKey)) {
        createStatCard2(grid, { className: "vrpg-panel", label: card.label, value: card.value, note: card.note });
      }
    }
    module2.exports = {
      renderHomeQuestsScreen: renderHomeQuestsScreen2
    };
  }
});

// src/ui/screens/rewardsScreen.js
var require_rewardsScreen = __commonJS({
  "src/ui/screens/rewardsScreen.js"(exports2, module2) {
    function renderHomeRewardsScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const t = ctx.totals || {};
      const rarities = ctx.rarities || {};
      const buyReward = ctx.buyReward || (() => {
      });
      const grid = parent.createDiv({ cls: "vrpg-card-grid" });
      for (const reward of data.rewards || []) {
        const card = grid.createDiv({ cls: "vrpg-panel" });
        card.createDiv({ cls: "vrpg-card-title", text: `${reward.icon || "\u{1F381}"} ${reward.title}` });
        card.createDiv({ cls: `vrpg-rarity vrpg-rarity-${reward.rarity || "common"}`, text: rarities[reward.rarity || "common"] || rarities.common });
        card.createDiv({ cls: "vrpg-subtitle", text: `${reward.cost} XP` });
        const button = card.createEl("button", { cls: "vrpg-primary", text: t.balance >= reward.cost ? "\u041A\u0443\u043F\u0438\u0442\u044C" : "\u041D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442 XP" });
        button.disabled = t.balance < reward.cost;
        button.onclick = () => buyReward(reward.id);
      }
    }
    module2.exports = {
      renderHomeRewardsScreen: renderHomeRewardsScreen2
    };
  }
});

// src/ui/screens/inventoryScreen.js
var require_inventoryScreen = __commonJS({
  "src/ui/screens/inventoryScreen.js"(exports2, module2) {
    function renderHomeInventoryScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const toggleInventoryItemUsed = ctx.toggleInventoryItemUsed || (() => {
      });
      const items = (data.inventory || []).slice().reverse();
      if (!items.length) {
        parent.createDiv({ cls: "vrpg-subtitle", text: "\u0418\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u044C \u043F\u0443\u0441\u0442. \u041A\u0443\u043F\u0438 \u043F\u0435\u0440\u0432\u0443\u044E \u043D\u0430\u0433\u0440\u0430\u0434\u0443 \u0432 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0435." });
        return;
      }
      const grid = parent.createDiv({ cls: "vrpg-card-grid" });
      for (const item of items) {
        const card = grid.createDiv({ cls: item.used ? "vrpg-panel is-muted" : "vrpg-panel" });
        card.createDiv({ cls: "vrpg-card-title", text: `${item.icon || "\u{1F381}"} ${item.title}` });
        card.createDiv({ cls: "vrpg-subtitle", text: `${item.cost} XP \u2022 ${item.date}` });
        const button = card.createEl("button", { cls: "vrpg-primary", text: item.used ? "\u0412\u0435\u0440\u043D\u0443\u0442\u044C" : "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C" });
        button.onclick = () => toggleInventoryItemUsed(item.id);
      }
    }
    module2.exports = {
      renderHomeInventoryScreen: renderHomeInventoryScreen2
    };
  }
});

// src/ui/screens/homeWalletScreen.js
var require_homeWalletScreen = __commonJS({
  "src/ui/screens/homeWalletScreen.js"(exports2, module2) {
    function renderHomeWalletScreen2(parent, ctx = {}) {
      const wallet = ctx.wallet || [];
      const selectedKey = ctx.selectedDateKey || ctx.dateKey();
      const walletStats2 = ctx.walletStats;
      const formatMoney2 = ctx.formatMoney;
      const bindMoneyInput2 = ctx.bindMoneyInput;
      const walletMonthLabel2 = ctx.walletMonthLabel;
      const addWallet = ctx.addWallet;
      const renderWalletRow = ctx.renderWalletRow;
      const renderWalletMonth = ctx.renderWalletMonth;
      const all = walletStats2(wallet);
      const day = walletStats2(wallet, selectedKey);
      const top = parent.createDiv({ cls: "vrpg-bank-top" });
      [
        ["\u041E\u0431\u0449\u0438\u0439 \u0431\u0430\u043B\u0430\u043D\u0441", `${formatMoney2(all.balance)} \u20BD`],
        ["\u0414\u043E\u0445\u043E\u0434\u044B", `+${formatMoney2(all.income)} \u20BD`],
        ["\u0420\u0430\u0441\u0445\u043E\u0434\u044B", `-${formatMoney2(all.expense)} \u20BD`]
      ].forEach(([label, value]) => {
        const card = top.createDiv({ cls: "vrpg-bank-metric" });
        card.createDiv({ cls: "vrpg-section", text: label });
        card.createDiv({ cls: "vrpg-stat-value", text: value });
      });
      const form = parent.createDiv({ cls: "vrpg-panel vrpg-inline-form" });
      form.createDiv({ cls: "vrpg-section", text: `\u0417\u0430\u043F\u0438\u0441\u044C \u0437\u0430 ${selectedKey}` });
      const type = form.createEl("select");
      type.createEl("option", { text: "\u0417\u0430\u0440\u0430\u0431\u043E\u0442\u0430\u043B", value: "income" });
      type.createEl("option", { text: "\u041F\u043E\u0442\u0440\u0430\u0442\u0438\u043B", value: "expense" });
      const amount = form.createEl("input", { type: "text", placeholder: "\u0421\u0443\u043C\u043C\u0430, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 25.000" });
      bindMoneyInput2(amount);
      const note = form.createEl("input", { type: "text", placeholder: "\u041D\u0430 \u0447\u0442\u043E / \u043E\u0442\u043A\u0443\u0434\u0430" });
      const add = form.createEl("button", { cls: "vrpg-primary", text: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C" });
      add.onclick = async () => {
        await addWallet(type.value, amount.value, note.value, selectedKey);
        amount.value = "";
        note.value = "";
      };
      const dayPanel = parent.createDiv({ cls: "vrpg-panel vrpg-bank-day" });
      dayPanel.createDiv({ cls: "vrpg-section", text: "\u0412\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0439 \u0434\u0435\u043D\u044C" });
      dayPanel.createDiv({ cls: "vrpg-card-title", text: `${selectedKey} \xB7 ${day.balance >= 0 ? "+" : ""}${formatMoney2(day.balance)} \u20BD` });
      dayPanel.createDiv({ cls: "vrpg-subtitle", text: `\u0414\u043E\u0445\u043E\u0434\u044B +${formatMoney2(day.income)} \u20BD \xB7 \u0440\u0430\u0441\u0445\u043E\u0434\u044B -${formatMoney2(day.expense)} \u20BD \xB7 ${day.items.length} \u043E\u043F\u0435\u0440\u0430\u0446\u0438\u0439` });
      if (!day.items.length) {
        dayPanel.createDiv({ cls: "vrpg-subtitle", text: "\u0412 \u044D\u0442\u043E\u0442 \u0434\u0435\u043D\u044C \u0437\u0430\u043F\u0438\u0441\u0435\u0439 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442." });
      }
      for (const item of day.items.slice().sort((a, b) => String(b.time || "").localeCompare(String(a.time || "")))) {
        renderWalletRow(dayPanel, item);
      }
      const month = parent.createEl("details", { cls: "vrpg-bank-month" });
      month.createEl("summary").createSpan({ text: `\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043C\u0435\u0441\u044F\u0446\u0430 \xB7 ${walletMonthLabel2(selectedKey)}` });
      renderWalletMonth(month, wallet, selectedKey);
    }
    module2.exports = {
      renderHomeWalletScreen: renderHomeWalletScreen2
    };
  }
});

// src/config/featureFlags.js
var require_featureFlags = __commonJS({
  "src/config/featureFlags.js"(exports2, module2) {
    var FEATURE_FLAGS2 = {
      showAchievements: false,
      showInterfaceSettings: true
    };
    module2.exports = {
      FEATURE_FLAGS: FEATURE_FLAGS2
    };
  }
});

// src/ui/screens/settingsScreen.js
var require_settingsScreen = __commonJS({
  "src/ui/screens/settingsScreen.js"(exports2, module2) {
    var { FEATURE_FLAGS: FEATURE_FLAGS2 } = require_featureFlags();
    function renderSettingsScreen2(parent, ctx = {}) {
      const settingsPanel = !FEATURE_FLAGS2.showInterfaceSettings && ctx.settingsPanel === "interface" ? "profile" : ctx.settingsPanel;
      const navigate = ctx.navigate;
      const shell = parent.createDiv({ cls: "vrpg-hero-card vrpg-settings-shell" });
      shell.createDiv({ cls: "vrpg-kicker", text: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438" });
      shell.createDiv({ cls: "vrpg-title", text: "\u0421\u0438\u0441\u0442\u0435\u043C\u0430" });
      shell.createDiv({ cls: "vrpg-subtitle", text: "\u041F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044F \u0433\u0435\u0440\u043E\u044F, \u0432\u043E\u0434\u044B, \u043F\u0440\u0438\u0432\u044B\u0447\u0435\u043A \u0438 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430." });
      const nav = shell.createDiv({ cls: "vrpg-command-grid vrpg-settings-nav" });
      const panels = [
        ["profile", "\u0413\u0435\u0440\u043E\u0439", "\u0438\u043C\u044F, \u043A\u043B\u0430\u0441\u0441, \u0444\u043E\u0442\u043E"],
        ["interface", "\u0418\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441", "\u0432\u0438\u0434\u0436\u0435\u0442\u044B \u0433\u043B\u0430\u0432\u043D\u043E\u0439"],
        ["resources", "\u0412\u043E\u0434\u0430", "\u0441\u0442\u0430\u043A\u0430\u043D\u044B \u0438 \u0434\u043D\u0435\u0432\u043D\u044B\u0435 \u0446\u0435\u043B\u0438"],
        ["habits", "\u041F\u0440\u0438\u0432\u044B\u0447\u043A\u0438", "\u0435\u0436\u0435\u0434\u043D\u0435\u0432\u043D\u044B\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F"],
        ["quests", "\u041A\u0432\u0435\u0441\u0442\u044B", "\u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0438"],
        ["rewards", "\u041D\u0430\u0433\u0440\u0430\u0434\u044B", "\u043C\u0430\u0433\u0430\u0437\u0438\u043D XP"]
      ].filter(([id]) => FEATURE_FLAGS2.showInterfaceSettings || id !== "interface");
      panels.forEach(([id, title, desc]) => {
        const button = nav.createEl("button", { cls: settingsPanel === id ? "vrpg-command-action is-active" : "vrpg-command-action" });
        button.createEl("strong", { text: title });
        button.createSpan({ text: desc });
        button.onclick = () => {
          navigate({ tab: "settings", settingsPanel: id });
        };
      });
      const body = shell.createDiv({ cls: "vrpg-home-module" });
      if (settingsPanel === "profile") ctx.renderSettingsProfile(body);
      if (settingsPanel === "interface") ctx.renderSettingsInterface(body);
      if (settingsPanel === "resources") ctx.renderSettingsResources(body);
      if (settingsPanel === "habits") ctx.renderSettingsHabits(body);
      if (settingsPanel === "quests") ctx.renderSettingsQuests(body);
      if (settingsPanel === "rewards") ctx.renderSettingsRewards(body);
    }
    module2.exports = {
      renderSettingsScreen: renderSettingsScreen2
    };
  }
});

// src/ui/screens/settingsProfileScreen.js
var require_settingsProfileScreen = __commonJS({
  "src/ui/screens/settingsProfileScreen.js"(exports2, module2) {
    var {
      HERO_CLASSES,
      getHeroClassDescription,
      getHeroClassTitle: getHeroClassTitle2,
      resolveHeroClassId: resolveHeroClassId2
    } = require_heroClassesConfig();
    function renderSettingsProfileScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const renderAvatar = ctx.renderAvatar;
      const attachAvatarDropZone = ctx.attachAvatarDropZone;
      const updatePlayer = ctx.updatePlayer;
      const player = data.player || {};
      const profilePanel = parent.createDiv({ cls: "vrpg-panel" });
      profilePanel.createDiv({ cls: "vrpg-section", text: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u0433\u0435\u0440\u043E\u044F" });
      const profilePreview = profilePanel.createDiv({ cls: "vrpg-settings-profile" });
      renderAvatar(profilePreview, data, "vrpg-avatar");
      const profileCopy = profilePreview.createDiv();
      profileCopy.createDiv({ cls: "vrpg-card-title", text: player.name || "\u0413\u0435\u0440\u043E\u0439" });
      profileCopy.createDiv({ cls: "vrpg-subtitle", text: getHeroClassTitle2(player) });
      const heroName = profilePanel.createEl("input", {
        type: "text",
        placeholder: "\u0418\u043C\u044F \u0433\u0435\u0440\u043E\u044F",
        value: player.name || ""
      });
      const heroClassId = resolveHeroClassId2(player);
      profilePanel.createDiv({ cls: "vrpg-card-title", text: "\u041A\u043B\u0430\u0441\u0441 \u0433\u0435\u0440\u043E\u044F" });
      const heroClass = profilePanel.createEl("select");
      for (const item of HERO_CLASSES) {
        heroClass.createEl("option", {
          text: `${item.icon} ${item.title}`,
          value: item.id
        });
      }
      heroClass.value = heroClassId;
      const heroClassDescription = profilePanel.createDiv({
        cls: "vrpg-subtitle",
        text: getHeroClassDescription(heroClass.value)
      });
      heroClass.onchange = () => {
        heroClassDescription.textContent = getHeroClassDescription(heroClass.value);
      };
      const heroAvatar = profilePanel.createEl("input", {
        type: "hidden",
        value: player.avatarUrl || ""
      });
      const dropZone = profilePanel.createDiv({ cls: "vrpg-avatar-drop" });
      dropZone.createDiv({ cls: "vrpg-card-title", text: "\u0424\u043E\u0442\u043E \u0433\u0435\u0440\u043E\u044F" });
      dropZone.createDiv({ cls: "vrpg-subtitle", text: "\u041F\u0435\u0440\u0435\u0442\u0430\u0449\u0438 \u043A\u0430\u0440\u0442\u0438\u043D\u043A\u0443 \u0441\u044E\u0434\u0430 \u0438\u043B\u0438 \u0432\u044B\u0431\u0435\u0440\u0438 \u0444\u0430\u0439\u043B. \u0422\u0435\u0445\u043D\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043F\u0443\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u043C." });
      const getProfile = () => ({
        name: heroName.value,
        classId: heroClass.value
      });
      const fileInput = profilePanel.createEl("input", {
        type: "file",
        attr: { accept: "image/*" }
      });
      fileInput.addClass("vrpg-file-input");
      fileInput.onchange = () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async () => {
          heroAvatar.value = String(reader.result || "");
          await updatePlayer({ ...getProfile(), avatarUrl: heroAvatar.value });
        };
        reader.readAsDataURL(file);
      };
      attachAvatarDropZone(dropZone, heroAvatar, getProfile);
      const clearAvatar = profilePanel.createEl("button", { cls: "vrpg-danger", text: "\u0423\u0431\u0440\u0430\u0442\u044C \u0444\u043E\u0442\u043E" });
      clearAvatar.onclick = () => {
        heroAvatar.value = "";
        updatePlayer({ ...getProfile(), avatarUrl: "" });
      };
      const saveHero = profilePanel.createEl("button", { cls: "vrpg-primary", text: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0433\u0435\u0440\u043E\u044F" });
      saveHero.onclick = () => updatePlayer({
        name: heroName.value,
        classId: heroClass.value,
        avatarUrl: heroAvatar.value
      });
    }
    module2.exports = {
      renderSettingsProfileScreen: renderSettingsProfileScreen2
    };
  }
});

// src/ui/screens/settingsInterfaceScreen.js
var require_settingsInterfaceScreen = __commonJS({
  "src/ui/screens/settingsInterfaceScreen.js"(exports2, module2) {
    var { normalizeInterfaceLayout: normalizeInterfaceLayout2 } = require_layoutConfig();
    var { getInterfaceLayout } = require_layoutSystem();
    var APP_SIZE_LABELS = {
      compact: "\u041A\u043E\u043C\u043F\u0430\u043A\u0442\u043D\u044B\u0439",
      comfortable: "\u0423\u0434\u043E\u0431\u043D\u044B\u0439",
      expanded: "\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0439"
    };
    function renderSettingsInterfaceScreen2(parent, ctx = {}) {
      const settings = ctx.settings || {};
      const updateInterfaceLayout = ctx.updateInterfaceLayout || (() => {
      });
      const interfaceLayout = getInterfaceLayout(settings);
      const panel = parent.createDiv({ cls: "vrpg-panel vrpg-interface-panel" });
      panel.createDiv({ cls: "vrpg-section", text: "\u0418\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441" });
      const presetPanel = panel.createDiv({ cls: "vrpg-interface-presets" });
      const presetMeta = presetPanel.createDiv({ cls: "vrpg-interface-row-meta" });
      presetMeta.createDiv({ cls: "vrpg-card-title", text: "\u0420\u0430\u0437\u043C\u0435\u0440 \u043F\u0430\u043D\u0435\u043B\u0438" });
      presetMeta.createDiv({ cls: "vrpg-subtitle", text: "\u0428\u0438\u0440\u0438\u043D\u0430 \u0440\u0430\u0431\u043E\u0447\u0435\u0439 \u043E\u0431\u043B\u0430\u0441\u0442\u0438 Vibe RPG" });
      const presetControl = presetPanel.createDiv({ cls: "vrpg-size-control vrpg-app-size-control" });
      Object.entries(APP_SIZE_LABELS).forEach(([value, label]) => {
        const button = presetControl.createEl("button", {
          cls: interfaceLayout.appSize === value ? "vrpg-size-option is-active" : "vrpg-size-option",
          text: label
        });
        button.onclick = () => updateInterfaceLayout(normalizeInterfaceLayout2({
          ...interfaceLayout,
          appSize: value
        }));
      });
    }
    module2.exports = {
      renderSettingsInterfaceScreen: renderSettingsInterfaceScreen2
    };
  }
});

// src/ui/screens/settingsResourcesScreen.js
var require_settingsResourcesScreen = __commonJS({
  "src/ui/screens/settingsResourcesScreen.js"(exports2, module2) {
    function renderSettingsResourcesScreen2(parent, ctx = {}) {
      const settings = ctx.settings || {};
      const setWaterGoal = ctx.setWaterGoal;
      const setWaterGlassMl = ctx.setWaterGlassMl;
      const settingsPanel = parent.createDiv({ cls: "vrpg-panel" });
      settingsPanel.createDiv({ cls: "vrpg-section", text: "\u0412\u043E\u0434\u0430" });
      const waterGoal = settingsPanel.createEl("input", {
        type: "number",
        placeholder: "\u0426\u0435\u043B\u044C \u0432\u043E\u0434\u044B \u0432 \u0441\u0442\u0430\u043A\u0430\u043D\u0430\u0445",
        value: String(settings.waterGoal || 8)
      });
      const waterMl = settingsPanel.createEl("input", {
        type: "number",
        placeholder: "\u041E\u0431\u044A\u0451\u043C \u0441\u0442\u0430\u043A\u0430\u043D\u0430 \u0432 \u043C\u043B",
        value: String(settings.waterGlassMl || 250)
      });
      const saveWater = settingsPanel.createEl("button", { cls: "vrpg-primary", text: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0446\u0435\u043B\u044C \u0432\u043E\u0434\u044B" });
      saveWater.onclick = async () => {
        await setWaterGoal(waterGoal.value);
        await setWaterGlassMl(waterMl.value);
      };
    }
    module2.exports = {
      renderSettingsResourcesScreen: renderSettingsResourcesScreen2
    };
  }
});

// src/ui/screens/settingsRewardsScreen.js
var require_settingsRewardsScreen = __commonJS({
  "src/ui/screens/settingsRewardsScreen.js"(exports2, module2) {
    function renderSettingsRewardsScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const rarities = ctx.rarities || {};
      const addReward = ctx.addReward;
      const deleteReward = ctx.deleteReward;
      const confirm2 = ctx.confirm;
      const rewardPanel = parent.createDiv({ cls: "vrpg-panel" });
      rewardPanel.createDiv({ cls: "vrpg-section", text: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u0430\u0433\u0440\u0430\u0434\u0443" });
      const rewardTitle = rewardPanel.createEl("input", { type: "text", placeholder: "\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: \u043A\u0438\u043D\u043E, \u043C\u0430\u0441\u0441\u0430\u0436, \u0432\u043A\u0443\u0441\u043D\u044B\u0439 \u0443\u0436\u0438\u043D" });
      const rewardCost = rewardPanel.createEl("input", { type: "number", placeholder: "\u0426\u0435\u043D\u0430 \u0432 XP, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 150" });
      const rewardRarity = rewardPanel.createEl("select");
      Object.entries(rarities).forEach(([value, label]) => {
        rewardRarity.createEl("option", { text: label, value });
      });
      const rewardButton = rewardPanel.createEl("button", { cls: "vrpg-primary", text: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043D\u0430\u0433\u0440\u0430\u0434\u0443" });
      rewardButton.onclick = () => {
        addReward(rewardTitle.value, rewardCost.value, rewardRarity.value);
        rewardTitle.value = "";
        rewardCost.value = "";
      };
      const rewardList = parent.createDiv({ cls: "vrpg-panel" });
      rewardList.createDiv({ cls: "vrpg-section", text: "\u041C\u043E\u0438 \u043D\u0430\u0433\u0440\u0430\u0434\u044B" });
      for (const reward of data.rewards) {
        const row = rewardList.createDiv({ cls: "vrpg-setting-row" });
        row.createDiv({ cls: "vrpg-card-title", text: `${reward.icon || "\u{1F381}"} ${reward.title}` });
        row.createDiv({ cls: "vrpg-subtitle", text: `${reward.cost} XP \xB7 ${rarities[reward.rarity || "common"] || rarities.common}` });
        const remove = row.createEl("button", { cls: "vrpg-danger", text: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C" });
        remove.onclick = () => {
          if (confirm2(`\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043D\u0430\u0433\u0440\u0430\u0434\u0443 "${reward.title}" \u0438\u0437 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430? \u0423\u0436\u0435 \u043A\u0443\u043F\u043B\u0435\u043D\u043D\u044B\u0435 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u044B \u0432 \u0438\u043D\u0432\u0435\u043D\u0442\u0430\u0440\u0435 \u043E\u0441\u0442\u0430\u043D\u0443\u0442\u0441\u044F.`)) {
            deleteReward(reward.id);
          }
        };
      }
    }
    module2.exports = {
      renderSettingsRewardsScreen: renderSettingsRewardsScreen2
    };
  }
});

// src/ui/screens/settingsHabitsScreen.js
var require_settingsHabitsScreen = __commonJS({
  "src/ui/screens/settingsHabitsScreen.js"(exports2, module2) {
    function renderSettingsHabitsScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const habitIcons = ctx.habitIcons || [];
      const areaLabels = ctx.areaLabels || {};
      const addHabit = ctx.addHabit;
      const setHabitEnabled = ctx.setHabitEnabled;
      const updateHabit = ctx.updateHabit;
      const deleteHabit = ctx.deleteHabit;
      const confirm2 = ctx.confirm;
      const areas = [["body", "\u0422\u0435\u043B\u043E"], ["mind", "\u0420\u0430\u0437\u0443\u043C"], ["craft", "\u0414\u0435\u043B\u043E"], ["control", "\u041A\u043E\u043D\u0442\u0440\u043E\u043B\u044C"]];
      const panel = parent.createDiv({ cls: "vrpg-panel" });
      panel.createDiv({ cls: "vrpg-section", text: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0443" });
      const input = panel.createEl("input", { type: "text", placeholder: "\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: \u043F\u043B\u0430\u0432\u0430\u043D\u0438\u0435, \u0430\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438\u0439, \u0434\u043D\u0435\u0432\u043D\u0438\u043A" });
      const icon = panel.createEl("input", { type: "text", placeholder: "\u0418\u043A\u043E\u043D\u043A\u0430, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 \u{1F3C3}" });
      const iconPicker = panel.createDiv({ cls: "vrpg-icon-picker" });
      habitIcons.forEach((value) => {
        const pick = iconPicker.createEl("button", { text: value });
        pick.onclick = () => {
          icon.value = value;
        };
      });
      const xp = panel.createEl("input", { type: "number", placeholder: "XP \u0437\u0430 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u0435, \u043E\u0431\u044B\u0447\u043D\u043E 10" });
      const select = panel.createEl("select");
      areas.forEach(([value, label]) => {
        select.createEl("option", { text: label, value });
      });
      const button = panel.createEl("button", { cls: "vrpg-primary", text: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C" });
      button.onclick = () => {
        addHabit(input.value, select.value, xp.value || 10, icon.value || "\u2728");
        input.value = "";
        icon.value = "";
        xp.value = "";
      };
      const list = parent.createDiv({ cls: "vrpg-panel" });
      list.createDiv({ cls: "vrpg-section", text: "\u041C\u043E\u0438 \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0438" });
      for (const habit of data.habits) {
        const row = list.createDiv({ cls: "vrpg-setting-row" });
        row.createDiv({ cls: "vrpg-card-title", text: `${habit.icon || "\u2022"} ${habit.title}` });
        row.createDiv({ cls: "vrpg-subtitle", text: `${areaLabels[habit.area] || habit.area} \u2022 ${habit.xp} XP` });
        const toggle = row.createEl("button", { cls: "vrpg-primary", text: habit.enabled === false ? "\u0412\u043A\u043B\u044E\u0447\u0438\u0442\u044C" : "\u0421\u043A\u0440\u044B\u0442\u044C" });
        toggle.onclick = () => setHabitEnabled(habit.id, habit.enabled === false);
        const edit = row.createEl("button", { cls: "vrpg-primary", text: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C" });
        let editForm = null;
        edit.onclick = () => {
          if (editForm) {
            editForm.remove();
            editForm = null;
            return;
          }
          editForm = row.createDiv({ cls: "vrpg-setting-edit" });
          const titleInput = editForm.createEl("input", { type: "text" });
          titleInput.value = habit.title || "";
          const iconInput = editForm.createEl("input", { type: "text" });
          iconInput.value = habit.icon || "\u2728";
          const xpInput = editForm.createEl("input", { type: "number" });
          xpInput.value = String(habit.xp || 10);
          const areaSelect = editForm.createEl("select");
          areas.forEach(([value, label]) => {
            areaSelect.createEl("option", { text: label, value });
          });
          areaSelect.value = habit.area || "body";
          const save = editForm.createEl("button", { cls: "vrpg-primary", text: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" });
          save.onclick = () => updateHabit(habit.id, {
            title: titleInput.value,
            icon: iconInput.value,
            xp: xpInput.value,
            area: areaSelect.value
          });
          const cancel = editForm.createEl("button", { cls: "vrpg-primary", text: "\u041E\u0442\u043C\u0435\u043D\u0430" });
          cancel.onclick = () => {
            editForm.remove();
            editForm = null;
          };
        };
        const remove = row.createEl("button", { cls: "vrpg-danger", text: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C" });
        remove.onclick = () => {
          if (confirm2(`\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0443 "${habit.title}"? \u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043F\u043E \u043D\u0435\u0439 \u0442\u043E\u0436\u0435 \u0443\u0431\u0435\u0440\u0451\u0442\u0441\u044F \u0438\u0437 \u0440\u0430\u0441\u0447\u0451\u0442\u0430.`)) {
            deleteHabit(habit.id);
          }
        };
      }
    }
    module2.exports = {
      renderSettingsHabitsScreen: renderSettingsHabitsScreen2
    };
  }
});

// src/systems/habitSystem.js
var require_habitSystem = __commonJS({
  "src/systems/habitSystem.js"(exports2, module2) {
    var { dateKey: dateKey2, uid } = require_utils();
    var { getDay: getDay2 } = require_storage();
    function activeHabits2(data) {
      return data.habits.filter((habit) => habit.enabled !== false);
    }
    function dayStats2(data, key = dateKey2()) {
      const day = getDay2(data, key);
      return readDayStats2(data, key, day);
    }
    function readDayStats2(data, key = dateKey2(), day = data.days[key]) {
      const habits = activeHabits2(data);
      let done = 0;
      let xp = 0;
      const areaDone = { body: 0, mind: 0, craft: 0, control: 0 };
      const areaTotal = { body: 0, mind: 0, craft: 0, control: 0 };
      for (const habit of habits) {
        if (areaTotal[habit.area] !== void 0) areaTotal[habit.area]++;
        if (!day || !day.completed || !day.completed[habit.id]) continue;
        done++;
        xp += Number(habit.xp || 0);
        if (areaDone[habit.area] !== void 0) areaDone[habit.area]++;
      }
      const total = habits.length;
      return {
        key,
        done,
        total,
        xp,
        percent: total ? Math.round(done / total * 100) : 0,
        areaDone,
        areaTotal
      };
    }
    function sortedDayKeys2(data) {
      return Object.keys(data.days || {}).sort((a, b) => {
        const pa = a.split(".").reverse().join("-");
        const pb = b.split(".").reverse().join("-");
        return pa.localeCompare(pb);
      });
    }
    function streak2(data) {
      let value = 0;
      const keys = sortedDayKeys2(data);
      for (let i = keys.length - 1; i >= 0; i--) {
        const stats = dayStats2(data, keys[i]);
        if (stats.percent < 50) break;
        value++;
      }
      return value;
    }
    function skillStats2(data) {
      const keys = sortedDayKeys2(data);
      const result = {
        body: { done: 0, total: 0 },
        mind: { done: 0, total: 0 },
        craft: { done: 0, total: 0 },
        control: { done: 0, total: 0 }
      };
      for (const key of keys) {
        const stats = dayStats2(data, key);
        for (const area of Object.keys(result)) {
          if (stats.areaTotal[area] > 0) result[area].total++;
          if (stats.areaDone[area] > 0) result[area].done++;
        }
      }
      return result;
    }
    function applyHabitToggle2(data, key, habitId) {
      const day = getDay2(data, key);
      day.completed[habitId] = !day.completed[habitId];
      return { data, key, day, habitId, completed: day.completed[habitId] };
    }
    function applyHabitAdd2(data, habitInput) {
      const value = Number(habitInput.xp);
      const habit = {
        id: uid("habit"),
        title: habitInput.title,
        area: habitInput.area,
        icon: String(habitInput.icon || "\u2728").trim() || "\u2728",
        xp: Number.isFinite(value) && value > 0 ? value : 10,
        enabled: true
      };
      data.habits.push(habit);
      return { data, habit };
    }
    function applyHabitUpdate2(data, habitId, patch) {
      const habit = data.habits.find((item) => item.id === habitId);
      if (!habit) return { data, habit };
      const allowed = ["title", "area", "icon", "xp", "enabled"];
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(patch, key)) habit[key] = patch[key];
      }
      return { data, habit };
    }
    function applyHabitDelete2(data, habitId) {
      data.habits = data.habits.filter((habit) => habit.id !== habitId);
      for (const day of Object.values(data.days)) {
        if (day && day.completed) delete day.completed[habitId];
      }
      return { data, habitId };
    }
    module2.exports = {
      activeHabits: activeHabits2,
      dayStats: dayStats2,
      readDayStats: readDayStats2,
      sortedDayKeys: sortedDayKeys2,
      streak: streak2,
      skillStats: skillStats2,
      applyHabitToggle: applyHabitToggle2,
      applyHabitAdd: applyHabitAdd2,
      applyHabitUpdate: applyHabitUpdate2,
      applyHabitDelete: applyHabitDelete2
    };
  }
});

// src/ui/screens/settingsQuestsScreen.js
var require_settingsQuestsScreen = __commonJS({
  "src/ui/screens/settingsQuestsScreen.js"(exports2, module2) {
    var { Notice: Notice2 } = require("obsidian");
    var { activeHabits: activeHabits2 } = require_habitSystem();
    var { normalizeQuestStatsSettings: normalizeQuestStatsSettings2 } = require_questStatsSystem();
    var { QUEST_STATS_CARDS: QUEST_STATS_CARDS2 } = require_questStatsConfig();
    function renderSettingsQuestsScreen2(parent, ctx = {}) {
      const data = ctx.data || {};
      const addCustomQuestStatsCard = ctx.addCustomQuestStatsCard;
      const setQuestStatsCardEnabled = ctx.setQuestStatsCardEnabled;
      const updateQuestStatsCard = ctx.updateQuestStatsCard;
      const updateCustomQuestStatsCard = ctx.updateCustomQuestStatsCard;
      const deleteCustomQuestStatsCard = ctx.deleteCustomQuestStatsCard;
      const confirm2 = ctx.confirm;
      const addPanel = parent.createDiv({ cls: "vrpg-panel" });
      addPanel.createDiv({ cls: "vrpg-section", text: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443" });
      addPanel.createDiv({ cls: "vrpg-card-title", text: "\u0422\u0438\u043F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438" });
      addPanel.createDiv({ cls: "vrpg-subtitle", text: "\u0427\u0442\u043E \u0431\u0443\u0434\u0435\u0442 \u0441\u0447\u0438\u0442\u0430\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430." });
      const typeSelect = addPanel.createEl("select");
      [
        ["manual", "\u0420\u0443\u0447\u043D\u0430\u044F \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430"],
        ["habitCount", "\u041F\u0440\u0438\u0432\u044B\u0447\u043A\u0430: \u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E"],
        ["habitStreak", "\u041F\u0440\u0438\u0432\u044B\u0447\u043A\u0430: \u0441\u0435\u0440\u0438\u044F"]
      ].forEach(([value, label]) => typeSelect.createEl("option", { text: label, value }));
      const addForm = addPanel.createDiv({ cls: "vrpg-setting-edit" });
      const renderAddForm = () => {
        addForm.empty();
        const type = typeSelect.value;
        addForm.createDiv({ cls: "vrpg-card-title", text: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438" });
        addForm.createDiv({ cls: "vrpg-subtitle", text: "\u041A\u0430\u043A \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u0431\u0443\u0434\u0435\u0442 \u043D\u0430\u0437\u044B\u0432\u0430\u0442\u044C\u0441\u044F \u0432 \u043F\u0430\u043D\u0435\u043B\u0438 \u041A\u0432\u0435\u0441\u0442\u044B." });
        const customLabel = addForm.createEl("input", { type: "text", placeholder: "\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: \u041D\u0435 \u043F\u0440\u043E\u043F\u0443\u0441\u043A\u0430\u0442\u044C \u0442\u0440\u0435\u043D\u0438\u0440\u043E\u0432\u043A\u0438" });
        if (type === "manual") {
          addForm.createDiv({ cls: "vrpg-card-title", text: "\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 / \u043F\u043E\u0434\u043F\u0438\u0441\u044C" });
          addForm.createDiv({ cls: "vrpg-subtitle", text: "\u0422\u0435\u043A\u0441\u0442, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0431\u0443\u0434\u0435\u0442 \u043F\u043E\u043A\u0430\u0437\u0430\u043D \u0432\u043D\u0443\u0442\u0440\u0438 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0438." });
          const customValue = addForm.createEl("input", { type: "text", placeholder: "\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: 3 \u0432\u0430\u0436\u043D\u044B\u0445 \u0434\u0435\u043B\u0430" });
          const add2 = addForm.createEl("button", { cls: "vrpg-primary", text: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C" });
          add2.onclick = async () => {
            await addCustomQuestStatsCard({
              type: "manual",
              label: customLabel.value,
              value: customValue.value,
              enabled: true
            });
            customLabel.value = "";
            customValue.value = "";
          };
          return;
        }
        addForm.createDiv({ cls: "vrpg-subtitle", text: "\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 linked-\u043A\u0432\u0435\u0441\u0442\u0430 \u0441\u0447\u0438\u0442\u0430\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u043F\u043E \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u043C \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0430\u043C. \u0414\u0435\u043D\u044C \u0437\u0430\u0441\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F, \u0435\u0441\u043B\u0438 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0430 \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u0430 \u0438\u0437 \u043D\u0438\u0445." });
        const habits = activeHabits2(data);
        if (!habits.length) {
          addForm.createDiv({ cls: "vrpg-subtitle", text: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u0434\u043E\u0431\u0430\u0432\u044C \u0438\u043B\u0438 \u0432\u043A\u043B\u044E\u0447\u0438 \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u0443 \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0443." });
          return;
        }
        addForm.createDiv({ cls: "vrpg-card-title", text: "\u0421\u0432\u044F\u0437\u0430\u043D\u043D\u044B\u0435 \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0438" });
        addForm.createDiv({ cls: "vrpg-subtitle", text: "\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: \u0431\u0435\u0433, \u0432\u0435\u043B\u043E\u0441\u0438\u043F\u0435\u0434 \u0438 \u0437\u0430\u043B \u0434\u043B\u044F \u043E\u0431\u0449\u0435\u0433\u043E \u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u043E\u0433\u043E \u0441\u0442\u0440\u0438\u043A\u0430." });
        const habitChoices = addForm.createDiv({ cls: "vrpg-habit-choice-list" });
        const habitInputs = [];
        for (const habit of habits) {
          const label = habitChoices.createEl("label", { cls: "vrpg-habit-choice" });
          const checkbox = label.createEl("input", { type: "checkbox" });
          checkbox.value = habit.id;
          label.createSpan({ text: `${habit.icon || "\u2022"} ${habit.title}` });
          habitInputs.push(checkbox);
        }
        addForm.createDiv({ cls: "vrpg-card-title", text: "\u0426\u0435\u043B\u044C \u0432 \u0434\u043D\u044F\u0445" });
        addForm.createDiv({ cls: "vrpg-subtitle", text: "\u0421\u043A\u043E\u043B\u044C\u043A\u043E \u0434\u043D\u0435\u0439 \u043D\u0443\u0436\u043D\u043E \u0432\u044B\u043F\u043E\u043B\u043D\u0438\u0442\u044C \u0434\u043B\u044F \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0438\u044F \u043A\u0432\u0435\u0441\u0442\u0430." });
        const goalInput = addForm.createEl("input", { type: "number", placeholder: "\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: 7 \u0434\u043D\u0435\u0439" });
        goalInput.value = "7";
        addForm.createDiv({ cls: "vrpg-card-title", text: "\u041D\u0430\u0433\u0440\u0430\u0434\u0430 XP" });
        addForm.createDiv({ cls: "vrpg-subtitle", text: "\u041F\u043E\u043A\u0430 \u0442\u043E\u043B\u044C\u043A\u043E \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0430\u0435\u0442\u0441\u044F. XP \u043D\u0435 \u043D\u0430\u0447\u0438\u0441\u043B\u044F\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438." });
        const rewardXpInput = addForm.createEl("input", { type: "number", placeholder: "\u041D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: 100" });
        rewardXpInput.value = "0";
        const add = addForm.createEl("button", { cls: "vrpg-primary", text: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C" });
        add.onclick = async () => {
          const habitIds = habitInputs.filter((input) => input.checked).map((input) => input.value);
          if (!habitIds.length) {
            new Notice2("\u0412\u044B\u0431\u0435\u0440\u0438 \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u0443 \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0443");
            return;
          }
          await addCustomQuestStatsCard({
            type,
            label: customLabel.value,
            habitId: habitIds[0],
            habitIds,
            goal: goalInput.value,
            rewardXp: rewardXpInput.value,
            period: "lastDays",
            enabled: true
          });
          customLabel.value = "";
          goalInput.value = "7";
          rewardXpInput.value = "0";
        };
      };
      typeSelect.onchange = renderAddForm;
      renderAddForm();
      const panel = parent.createDiv({ cls: "vrpg-panel" });
      panel.createDiv({ cls: "vrpg-section", text: "\u041F\u0430\u043D\u0435\u043B\u044C \u041A\u0432\u0435\u0441\u0442\u043E\u0432" });
      panel.createDiv({ cls: "vrpg-subtitle", text: "\u0423\u043F\u0440\u0430\u0432\u043B\u044F\u0439 \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0430\u043C\u0438 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0438 \u0432 \u043F\u0430\u043D\u0435\u043B\u0438 \u041A\u0432\u0435\u0441\u0442\u044B." });
      const normalized = normalizeQuestStatsSettings2(data.settings || {}, QUEST_STATS_CARDS2);
      const settings = normalized.questStatsCards;
      for (const card of QUEST_STATS_CARDS2) {
        const cardSettings = settings[card.id] || {};
        const enabled = card.enabled !== false && cardSettings.enabled !== false;
        const row = panel.createDiv({ cls: "vrpg-setting-row" });
        const title = cardSettings.label || card.label;
        row.createDiv({ cls: "vrpg-card-title", text: title });
        row.createDiv({ cls: "vrpg-subtitle", text: enabled ? "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u0432 \u043F\u0430\u043D\u0435\u043B\u0438 \u041A\u0432\u0435\u0441\u0442\u044B" : "\u0421\u043A\u0440\u044B\u0442\u0430 \u0438\u0437 \u043F\u0430\u043D\u0435\u043B\u0438 \u041A\u0432\u0435\u0441\u0442\u044B" });
        const toggle = row.createEl("button", { cls: "vrpg-primary", text: enabled ? "\u0421\u043A\u0440\u044B\u0442\u044C" : "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C" });
        toggle.onclick = () => setQuestStatsCardEnabled(card.id, !enabled);
        const edit = row.createEl("button", { cls: "vrpg-primary", text: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C" });
        let editForm = null;
        edit.onclick = () => {
          if (editForm) {
            editForm.remove();
            editForm = null;
            return;
          }
          editForm = row.createDiv({ cls: "vrpg-setting-edit" });
          const labelInput = editForm.createEl("input", { type: "text", placeholder: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435" });
          labelInput.value = title;
          const save = editForm.createEl("button", { cls: "vrpg-primary", text: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" });
          save.onclick = () => updateQuestStatsCard(card.id, { label: labelInput.value });
          const cancel = editForm.createEl("button", { cls: "vrpg-primary", text: "\u041E\u0442\u043C\u0435\u043D\u0430" });
          cancel.onclick = () => {
            editForm.remove();
            editForm = null;
          };
        };
      }
      for (const card of normalized.customQuestStatsCards) {
        const enabled = card.enabled !== false;
        const row = panel.createDiv({ cls: "vrpg-setting-row" });
        const linkedCount = Array.isArray(card.habitIds) && card.habitIds.length ? card.habitIds.length : card.habitId ? 1 : 0;
        const linkedText = card.type === "manual" ? card.value || "\u0411\u0435\u0437 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u044F" : `${linkedCount} \u043F\u0440\u0438\u0432\u044B\u0447\u0435\u043A \u2022 ${card.value || "\u0430\u0432\u0442\u043E-\u043F\u0440\u043E\u0433\u0440\u0435\u0441\u0441"}`;
        row.createDiv({ cls: "vrpg-card-title", text: card.label });
        row.createDiv({ cls: "vrpg-subtitle", text: `${linkedText} \u2022 ${enabled ? "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442\u0441\u044F" : "\u0421\u043A\u0440\u044B\u0442\u0430"}` });
        const toggle = row.createEl("button", { cls: "vrpg-primary", text: enabled ? "\u0421\u043A\u0440\u044B\u0442\u044C" : "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C" });
        toggle.onclick = () => updateCustomQuestStatsCard(card.id, { enabled: !enabled });
        if (card.type === "manual") {
          const edit = row.createEl("button", { cls: "vrpg-primary", text: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C" });
          let editForm = null;
          edit.onclick = () => {
            if (editForm) {
              editForm.remove();
              editForm = null;
              return;
            }
            editForm = row.createDiv({ cls: "vrpg-setting-edit" });
            const labelInput = editForm.createEl("input", { type: "text", placeholder: "\u041D\u0430\u0437\u0432\u0430\u043D\u0438\u0435" });
            labelInput.value = card.label;
            const valueInput = editForm.createEl("input", { type: "text", placeholder: "\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 / \u043F\u043E\u0434\u043F\u0438\u0441\u044C" });
            valueInput.value = card.value || "";
            const save = editForm.createEl("button", { cls: "vrpg-primary", text: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" });
            save.onclick = () => updateCustomQuestStatsCard(card.id, {
              label: labelInput.value,
              value: valueInput.value
            });
            const cancel = editForm.createEl("button", { cls: "vrpg-primary", text: "\u041E\u0442\u043C\u0435\u043D\u0430" });
            cancel.onclick = () => {
              editForm.remove();
              editForm = null;
            };
          };
        }
        const remove = row.createEl("button", { cls: "vrpg-danger", text: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C" });
        remove.onclick = () => {
          if (confirm2(`\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 "${card.label}"?`)) {
            deleteCustomQuestStatsCard(card.id);
          }
        };
      }
    }
    module2.exports = {
      renderSettingsQuestsScreen: renderSettingsQuestsScreen2
    };
  }
});

// src/systems/xpSystem.js
var require_xpSystem = __commonJS({
  "src/systems/xpSystem.js"(exports2, module2) {
    function heroTitle2(level) {
      if (level >= 20) return "\u041C\u0430\u0441\u0442\u0435\u0440 \u0440\u0438\u0442\u043C\u0430";
      if (level >= 10) return "\u0421\u0442\u0440\u0430\u0442\u0435\u0433";
      if (level >= 5) return "\u0418\u0441\u043A\u0430\u0442\u0435\u043B\u044C";
      return "\u041D\u043E\u0432\u0438\u0447\u043E\u043A";
    }
    function totals2(data) {
      let earned = 0;
      for (const [key, day] of Object.entries(data.days)) {
        if (!day || !day.completed) continue;
        for (const habit of data.habits) {
          if (habit.enabled !== false && day.completed[habit.id]) earned += Number(habit.xp || 0);
        }
      }
      let spent = 0;
      for (const item of data.inventory) spent += Number(item.cost || 0);
      return {
        earned,
        spent,
        balance: Math.max(0, earned - spent),
        level: Math.floor(earned / 100) + 1,
        levelXP: earned % 100
      };
    }
    module2.exports = {
      heroTitle: heroTitle2,
      totals: totals2
    };
  }
});

// src/systems/achievementSystem.js
var require_achievementSystem = __commonJS({
  "src/systems/achievementSystem.js"(exports2, module2) {
    var {
      dayStats: dayStats2,
      skillStats: skillStats2,
      sortedDayKeys: sortedDayKeys2,
      streak: streak2
    } = require_habitSystem();
    var { totals: totals2 } = require_xpSystem();
    function coreAttributes2(data) {
      const stats = skillStats2(data);
      return [
        ["\u0422\u0435\u043B\u043E", stats.body.total ? Math.round(stats.body.done / stats.body.total * 100) : 0],
        ["\u0420\u0430\u0437\u0443\u043C", stats.mind.total ? Math.round(stats.mind.done / stats.mind.total * 100) : 0],
        ["\u0414\u0435\u043B\u043E", stats.craft.total ? Math.round(stats.craft.done / stats.craft.total * 100) : 0]
      ];
    }
    function achievements2(data) {
      const t = totals2(data);
      const keys = sortedDayKeys2(data);
      const hasCompleteDay = keys.some((key) => {
        const stats = dayStats2(data, key);
        return stats.total > 0 && stats.done === stats.total;
      });
      const bought = (data.inventory || []).length > 0;
      return [
        { id: "first-day", title: "\u041F\u0435\u0440\u0432\u044B\u0439 \u0434\u0435\u043D\u044C \u0437\u0430\u043A\u0440\u044B\u0442", done: hasCompleteDay },
        { id: "three-streak", title: "3 \u0434\u043D\u044F \u043F\u043E\u0434\u0440\u044F\u0434", done: streak2(data) >= 3 },
        { id: "week", title: "\u041D\u0435\u0434\u0435\u043B\u044F \u0431\u0435\u0437 \u043F\u0440\u043E\u0432\u0430\u043B\u0430", done: streak2(data) >= 7 },
        { id: "xp100", title: "100 XP \u0437\u0430\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u043E", done: t.earned >= 100 },
        { id: "first-buy", title: "\u041F\u0435\u0440\u0432\u0430\u044F \u043F\u043E\u043A\u0443\u043F\u043A\u0430", done: bought }
      ];
    }
    module2.exports = {
      coreAttributes: coreAttributes2,
      achievements: achievements2
    };
  }
});

// src/systems/daySystem.js
var require_daySystem = __commonJS({
  "src/systems/daySystem.js"(exports2, module2) {
    var { dateKey: dateKey2 } = require_utils();
    var { getDay: getDay2 } = require_storage();
    function applyWaterChange2(data, selectedDate, delta) {
      const key = selectedDate || dateKey2();
      const day = getDay2(data, key);
      const goal = Math.max(1, Number(data.settings.waterGoal) || 8);
      day.water = Math.max(0, Math.min(goal + 4, Number(day.water || 0) + delta));
      return { data, key, day };
    }
    function applyMoodChange2(data, selectedDate, mood) {
      const key = selectedDate || dateKey2();
      const day = getDay2(data, key);
      day.mood = mood;
      return { data, key, day };
    }
    module2.exports = {
      applyWaterChange: applyWaterChange2,
      applyMoodChange: applyMoodChange2
    };
  }
});

// src/systems/inventorySystem.js
var require_inventorySystem = __commonJS({
  "src/systems/inventorySystem.js"(exports2, module2) {
    function applyInventoryToggleUsed2(data, itemId) {
      const item = data.inventory.find((entry) => entry.id === itemId);
      if (!item) return { ok: false, data, item, reason: "not-found" };
      item.used = !item.used;
      return { ok: true, data, item, reason: void 0 };
    }
    module2.exports = {
      applyInventoryToggleUsed: applyInventoryToggleUsed2
    };
  }
});

// src/systems/rewardSystem.js
var require_rewardSystem = __commonJS({
  "src/systems/rewardSystem.js"(exports2, module2) {
    var { RARITIES: RARITIES2 } = require_constants();
    var { dateKey: dateKey2, uid } = require_utils();
    var { totals: totals2 } = require_xpSystem();
    function applyRewardPurchase2(data, rewardId) {
      const reward = data.rewards.find((item2) => item2.id === rewardId);
      if (!reward) return { ok: false, data, reward, item: void 0, reason: "not-found" };
      const t = totals2(data);
      if (t.balance < reward.cost) {
        return { ok: false, data, reward, item: void 0, reason: "not-enough-xp" };
      }
      const item = {
        id: uid("item"),
        rewardId,
        title: reward.title,
        cost: reward.cost,
        icon: reward.icon,
        date: dateKey2(),
        used: false
      };
      data.inventory.push(item);
      return { ok: true, data, reward, item, reason: void 0 };
    }
    function applyRewardAdd2(data, rewardInput) {
      const reward = {
        id: uid("reward"),
        title: rewardInput.title,
        cost: rewardInput.cost,
        icon: "\u{1F381}",
        rarity: RARITIES2[rewardInput.rarity] ? rewardInput.rarity : "common"
      };
      data.rewards.push(reward);
      return { data, reward };
    }
    function applyRewardDelete2(data, rewardId) {
      data.rewards = data.rewards.filter((reward) => reward.id !== rewardId);
      return { data, rewardId };
    }
    module2.exports = {
      applyRewardPurchase: applyRewardPurchase2,
      applyRewardAdd: applyRewardAdd2,
      applyRewardDelete: applyRewardDelete2
    };
  }
});

// src/systems/playerSystem.js
var require_playerSystem = __commonJS({
  "src/systems/playerSystem.js"(exports2, module2) {
    var { getHeroClass, resolveHeroClassId: resolveHeroClassId2 } = require_heroClassesConfig();
    function applyPlayerUpdate2(data, patch) {
      const allowed = ["name", "goal", "avatarUrl"];
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(patch, key)) data.player[key] = patch[key];
      }
      if (Object.prototype.hasOwnProperty.call(patch, "classId") || Object.prototype.hasOwnProperty.call(patch, "className")) {
        const classId = resolveHeroClassId2({
          classId: patch.classId,
          className: patch.className || data.player.className
        });
        data.player.classId = classId;
        data.player.className = getHeroClass(classId).title;
      }
      return { data, player: data.player };
    }
    function applySettingsUpdate2(data, patch) {
      const allowed = ["waterGoal", "waterGlassMl", "questStatsCards"];
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(patch, key)) data.settings[key] = patch[key];
      }
      return { data, settings: data.settings };
    }
    module2.exports = {
      applyPlayerUpdate: applyPlayerUpdate2,
      applySettingsUpdate: applySettingsUpdate2
    };
  }
});

// src/systems/waterSystem.js
var require_waterSystem = __commonJS({
  "src/systems/waterSystem.js"(exports2, module2) {
    function dateKey2(date = /* @__PURE__ */ new Date()) {
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      return `${dd}.${mm}.${date.getFullYear()}`;
    }
    function waterStats2(data, key = dateKey2()) {
      const day = data.days[key] || {};
      const goal = Math.max(1, Number(data.settings && data.settings.waterGoal) || 8);
      const glassMl = Math.max(50, Number(data.settings && data.settings.waterGlassMl) || 250);
      const value = Math.max(0, Number(day.water || 0));
      return {
        value,
        goal,
        glassMl,
        currentMl: value * glassMl,
        targetMl: goal * glassMl,
        percent: Math.min(100, Math.round(value / goal * 100))
      };
    }
    module2.exports = { waterStats: waterStats2 };
  }
});

// src/systems/walletSystem.js
var require_walletSystem = __commonJS({
  "src/systems/walletSystem.js"(exports2, module2) {
    var { timeKey, uid } = require_utils();
    function walletStats2(wallet, key = null) {
      let income = 0;
      let expense = 0;
      const items = key ? wallet.filter((item) => item.date === key) : wallet;
      for (const item of items) {
        if (item.type === "income") income += Number(item.amount || 0);
        if (item.type === "expense") expense += Number(item.amount || 0);
      }
      return {
        items,
        income,
        expense,
        balance: income - expense
      };
    }
    function applyWalletAdd2(data, walletInput) {
      const item = {
        id: uid("money"),
        type: walletInput.type,
        amount: walletInput.amount,
        note: walletInput.note || "",
        date: walletInput.date,
        time: timeKey()
      };
      data.wallet.push(item);
      return { data, item };
    }
    function applyWalletDelete2(data, walletId) {
      data.wallet = data.wallet.filter((item) => item.id !== walletId);
      return { data, walletId };
    }
    function applyWalletUpdate(data, walletId, patch) {
      const item = data.wallet.find((entry) => entry.id === walletId);
      if (!item) return { data, item };
      const allowed = ["type", "amount", "note", "date", "time"];
      for (const key of allowed) {
        if (Object.prototype.hasOwnProperty.call(patch, key)) item[key] = patch[key];
      }
      return { data, item };
    }
    module2.exports = {
      walletStats: walletStats2,
      applyWalletAdd: applyWalletAdd2,
      applyWalletDelete: applyWalletDelete2,
      applyWalletUpdate
    };
  }
});

// src/config/textConfig.js
var require_textConfig = __commonJS({
  "src/config/textConfig.js"(exports2, module2) {
    var TEXT2 = {
      dayPanel: "\u041F\u0430\u043D\u0435\u043B\u044C \u0434\u043D\u044F"
    };
    module2.exports = {
      TEXT: TEXT2
    };
  }
});

// src/main-entry.js
var { ItemView, Notice, Plugin } = require("obsidian");
var {
  APP_VIEW,
  SIDEBAR_VIEW,
  AREA_LABELS,
  MOODS,
  RARITIES,
  HABIT_ICONS
} = require_constants();
var {
  dateKey,
  timeParts,
  dayPhase,
  parseMoney,
  formatMoney,
  monthLabel,
  dateFromKey,
  walletMonthLabel,
  calendarDays
} = require_utils();
var { mergeData, getDay } = require_storage();
var { createProgressBar } = require_progressBar();
var { createStatCard } = require_statCard();
var { renderRadarChart } = require_radarChart();
var { renderWaterWidget } = require_waterWidget();
var {
  renderWalletRow: renderWalletRowComponent,
  renderWalletMonth: renderWalletMonthComponent
} = require_walletRows();
var { renderHomeScreen, renderHomeModuleScreen } = require_homeScreen();
var { renderHomeTodayScreen } = require_homeTodayScreen();
var { renderHomeHeroScreen } = require_homeHeroScreen();
var { renderHomeQuestsScreen } = require_homeQuestsScreen();
var { renderHomeRewardsScreen } = require_rewardsScreen();
var { renderHomeInventoryScreen } = require_inventoryScreen();
var { renderHomeWalletScreen } = require_homeWalletScreen();
var { renderSettingsScreen } = require_settingsScreen();
var { renderSettingsProfileScreen } = require_settingsProfileScreen();
var { renderSettingsInterfaceScreen } = require_settingsInterfaceScreen();
var { renderSettingsResourcesScreen } = require_settingsResourcesScreen();
var { renderSettingsRewardsScreen } = require_settingsRewardsScreen();
var { renderSettingsHabitsScreen } = require_settingsHabitsScreen();
var { renderSettingsQuestsScreen } = require_settingsQuestsScreen();
var {
  activeHabits,
  applyHabitAdd,
  applyHabitDelete,
  applyHabitToggle,
  applyHabitUpdate,
  dayStats,
  readDayStats,
  sortedDayKeys,
  streak,
  skillStats
} = require_habitSystem();
var { coreAttributes, achievements } = require_achievementSystem();
var { applyWaterChange, applyMoodChange } = require_daySystem();
var { applyInventoryToggleUsed } = require_inventorySystem();
var {
  applyRewardAdd,
  applyRewardDelete,
  applyRewardPurchase
} = require_rewardSystem();
var { applyPlayerUpdate, applySettingsUpdate } = require_playerSystem();
var { waterStats } = require_waterSystem();
var {
  applyWalletAdd,
  applyWalletDelete,
  walletStats
} = require_walletSystem();
var { heroTitle, totals } = require_xpSystem();
var {
  applyCustomQuestStatsCardAdd,
  applyCustomQuestStatsCardDelete,
  applyCustomQuestStatsCardUpdate,
  applyQuestStatsCardUpdate,
  getQuestStatsCards,
  normalizeQuestStatsSettings
} = require_questStatsSystem();
var { TEXT } = require_textConfig();
var { QUEST_STATS_CARDS } = require_questStatsConfig();
var { FEATURE_FLAGS } = require_featureFlags();
var {
  normalizeHomeLayout,
  normalizeInterfaceLayout
} = require_layoutConfig();
var {
  getThemeClasses,
  getThemeClassList
} = require_themeConfig();
var { getAppSizePreset } = require_layoutSystem();
var {
  getHeroClassTitle,
  resolveHeroClassId
} = require_heroClassesConfig();
function bindMoneyInput(input) {
  input.inputMode = "numeric";
  input.oninput = () => {
    const value = parseMoney(input.value);
    input.value = Number.isFinite(value) && value > 0 ? formatMoney(value) : "";
  };
}
function getScrollContainer(view) {
  if (!view || !view.containerEl) return null;
  return view.containerEl.querySelector(".vrpg-app");
}
function captureScroll(view) {
  const el = getScrollContainer(view);
  if (!el) return null;
  return {
    top: el.scrollTop || 0,
    left: el.scrollLeft || 0
  };
}
function restoreScroll(view, state) {
  if (!state) return;
  const el = getScrollContainer(view);
  if (!el) return;
  el.scrollTop = state.top;
  el.scrollLeft = state.left;
}
function renderViewPreservingScroll(view) {
  if (!view || typeof view.render !== "function") return;
  const state = captureScroll(view);
  view.render();
  restoreScroll(view, state);
  setTimeout(() => {
    restoreScroll(view, state);
  }, 0);
}
var VibeRpgPlugin = class extends Plugin {
  async onload() {
    this.data = mergeData(await this.loadData());
    await this.save();
    this.registerView(APP_VIEW, (leaf) => new VibeRpgAppView(leaf, this));
    this.registerView(SIDEBAR_VIEW, (leaf) => new VibeRpgSidebarView(leaf, this));
    this.addRibbonIcon("sparkles", "\u041E\u0442\u043A\u0440\u044B\u0442\u044C Vibe RPG", () => this.openApp());
    this.addCommand({ id: "open-vibe-rpg", name: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C Vibe RPG", callback: () => this.openApp() });
    this.addCommand({ id: "open-vibe-rpg-sidebar", name: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0432\u0438\u0434\u0436\u0435\u0442 Vibe RPG", callback: () => this.openSidebar() });
    this.app.workspace.onLayoutReady(() => this.openSidebar());
  }
  async save() {
    await this.saveData(this.data);
    this.refreshViews();
  }
  refreshViews() {
    for (const leaf of this.app.workspace.getLeavesOfType(APP_VIEW)) {
      renderViewPreservingScroll(leaf.view);
    }
    for (const leaf of this.app.workspace.getLeavesOfType(SIDEBAR_VIEW)) {
      if (leaf.view && typeof leaf.view.render === "function") leaf.view.render();
    }
  }
  async openApp() {
    let leaf = this.app.workspace.getLeavesOfType(APP_VIEW)[0];
    if (!leaf) leaf = this.app.workspace.getLeaf(true);
    await leaf.setViewState({ type: APP_VIEW, active: true });
    this.app.workspace.revealLeaf(leaf);
  }
  async openSidebar() {
    let leaf = this.app.workspace.getLeavesOfType(SIDEBAR_VIEW)[0];
    if (!leaf) leaf = this.app.workspace.getRightLeaf(false);
    await leaf.setViewState({ type: SIDEBAR_VIEW, active: false });
  }
  async toggleHabit(id, key = dateKey()) {
    applyHabitToggle(this.data, key, id);
    await this.save();
  }
  async changeWater(delta, key = dateKey()) {
    applyWaterChange(this.data, key, delta);
    await this.save();
  }
  async setMood(value, key = dateKey()) {
    if (!MOODS[value]) return;
    applyMoodChange(this.data, key, value);
    await this.save();
  }
  async buyReward(rewardId) {
    const result = applyRewardPurchase(this.data, rewardId);
    if (!result.ok && result.reason === "not-enough-xp") {
      new Notice("XP \u043D\u0435 \u0445\u0432\u0430\u0442\u0430\u0435\u0442");
      return;
    }
    if (!result.ok) return;
    await this.save();
    new Notice(`\u041A\u0443\u043F\u043B\u0435\u043D\u043E: ${result.reward.title}`);
  }
  async addHabit(title, area, xp = 10, icon = "\u2728") {
    const clean = String(title || "").trim();
    const value = Number(String(xp || 10).replace(/\s/g, "").replace(",", "."));
    if (!clean) return;
    applyHabitAdd(this.data, { title: clean, area, xp: value, icon });
    await this.save();
  }
  async deleteHabit(id) {
    const habit = this.data.habits.find((h) => h.id === id);
    if (!habit) return;
    applyHabitDelete(this.data, id);
    await this.save();
    new Notice(`\u0423\u0434\u0430\u043B\u0435\u043D\u043E: ${habit.title}`);
  }
  async setHabitEnabled(id, enabled) {
    const habit = this.data.habits.find((h) => h.id === id);
    if (!habit) return;
    applyHabitUpdate(this.data, id, { enabled });
    await this.save();
  }
  async updateHabit(id, patch) {
    const habit = this.data.habits.find((h) => h.id === id);
    if (!habit) return;
    const next = {};
    if (Object.prototype.hasOwnProperty.call(patch, "title")) {
      const title = String(patch.title || "").trim();
      if (title) next.title = title;
    }
    if (Object.prototype.hasOwnProperty.call(patch, "icon")) {
      next.icon = String(patch.icon || "").trim() || "\u2728";
    }
    if (Object.prototype.hasOwnProperty.call(patch, "xp")) {
      const xp = Number(String(patch.xp || "").replace(/\s/g, "").replace(",", "."));
      if (Number.isFinite(xp) && xp > 0) next.xp = xp;
    }
    if (Object.prototype.hasOwnProperty.call(patch, "area") && AREA_LABELS[patch.area]) {
      next.area = patch.area;
    }
    if (Object.prototype.hasOwnProperty.call(patch, "enabled")) {
      next.enabled = !!patch.enabled;
    }
    applyHabitUpdate(this.data, id, next);
    await this.save();
  }
  async addReward(title, cost, rarity = "common") {
    const clean = String(title || "").trim();
    const value = Number(String(cost || "").replace(/\s/g, "").replace(",", "."));
    if (!clean || !Number.isFinite(value) || value <= 0) {
      new Notice("\u041D\u0443\u0436\u043D\u044B \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u0438 \u0446\u0435\u043D\u0430 \u0447\u0438\u0441\u043B\u043E\u043C");
      return;
    }
    applyRewardAdd(this.data, { title: clean, cost: value, rarity });
    await this.save();
  }
  async deleteReward(id) {
    const reward = this.data.rewards.find((r) => r.id === id);
    if (!reward) return;
    applyRewardDelete(this.data, id);
    await this.save();
    new Notice(`\u041D\u0430\u0433\u0440\u0430\u0434\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0430 \u0438\u0437 \u043C\u0430\u0433\u0430\u0437\u0438\u043D\u0430: ${reward.title}`);
  }
  async toggleInventoryItemUsed(itemId) {
    const result = applyInventoryToggleUsed(this.data, itemId);
    if (!result.ok) return;
    await this.save();
  }
  async addWallet(type, amount, note, key = dateKey()) {
    const value = parseMoney(amount);
    if (!Number.isFinite(value) || value <= 0) {
      new Notice("\u041D\u0443\u0436\u043D\u0430 \u0441\u0443\u043C\u043C\u0430 \u0447\u0438\u0441\u043B\u043E\u043C");
      return;
    }
    applyWalletAdd(this.data, { type, amount: value, note, date: key });
    await this.save();
  }
  async setWaterGoal(value) {
    const goal = Number(String(value || "").replace(/\s/g, "").replace(",", "."));
    if (!Number.isFinite(goal) || goal < 1) {
      new Notice("\u041D\u0443\u0436\u043D\u0430 \u0446\u0435\u043B\u044C \u043E\u0442 1 \u0441\u0442\u0430\u043A\u0430\u043D\u0430");
      return;
    }
    applySettingsUpdate(this.data, { waterGoal: Math.round(goal) });
    await this.save();
  }
  async setWaterGlassMl(value) {
    const ml = Number(String(value || "").replace(/\s/g, "").replace(",", "."));
    if (!Number.isFinite(ml) || ml < 50) {
      new Notice("\u041D\u0443\u0436\u0435\u043D \u043E\u0431\u044A\u0451\u043C \u0441\u0442\u0430\u043A\u0430\u043D\u0430 \u043E\u0442 50 \u043C\u043B");
      return;
    }
    applySettingsUpdate(this.data, { waterGlassMl: Math.round(ml) });
    await this.save();
  }
  async updateHomeLayout(layout) {
    this.data.settings = this.data.settings || {};
    const interfaceLayout = normalizeInterfaceLayout(this.data.settings.interfaceLayout);
    this.data.settings.homeLayout = normalizeHomeLayout(layout, interfaceLayout);
    await this.save();
  }
  async updateInterfaceLayout(layout) {
    this.data.settings = this.data.settings || {};
    this.data.settings.interfaceLayout = normalizeInterfaceLayout(layout);
    await this.save();
  }
  async setQuestStatsCardEnabled(id, enabled) {
    const result = applyQuestStatsCardUpdate(this.data, id, { enabled });
    if (!result.ok) return;
    await this.save();
  }
  async updateQuestStatsCard(id, patch) {
    const result = applyQuestStatsCardUpdate(this.data, id, patch);
    if (!result.ok) {
      new Notice("\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430");
      return;
    }
    await this.save();
  }
  async addCustomQuestStatsCard(input) {
    const result = applyCustomQuestStatsCardAdd(this.data, input);
    if (!result.ok) {
      new Notice("\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0443 \u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C");
      return;
    }
    await this.save();
  }
  async updateCustomQuestStatsCard(id, patch) {
    const result = applyCustomQuestStatsCardUpdate(this.data, id, patch);
    if (!result.ok) {
      new Notice("\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430");
      return;
    }
    await this.save();
  }
  async deleteCustomQuestStatsCard(id) {
    const result = applyCustomQuestStatsCardDelete(this.data, id);
    if (!result.ok) {
      new Notice("\u041A\u0430\u0440\u0442\u043E\u0447\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430");
      return;
    }
    await this.save();
  }
  async updatePlayer(profile) {
    const name = String(profile.name || "").trim();
    const classId = resolveHeroClassId({ classId: profile.classId, className: profile.className });
    const goal = String(profile.goal || "").trim();
    const avatarUrl = String(profile.avatarUrl || "").trim();
    applyPlayerUpdate(this.data, {
      ...name ? { name } : {},
      classId,
      ...goal ? { goal } : {},
      avatarUrl
    });
    await this.save();
    new Notice("\u041F\u0440\u043E\u0444\u0438\u043B\u044C \u0433\u0435\u0440\u043E\u044F \u043E\u0431\u043D\u043E\u0432\u043B\u0451\u043D");
  }
  async deleteWallet(id) {
    applyWalletDelete(this.data, id);
    await this.save();
  }
  onunload() {
    this.app.workspace.detachLeavesOfType(APP_VIEW);
    this.app.workspace.detachLeavesOfType(SIDEBAR_VIEW);
  }
};
var VibeRpgAppView = class extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.tab = "home";
    this.selectedDateKey = dateKey();
    this.homePanel = "hero";
    this.settingsPanel = "profile";
    this.isHomeEditMode = false;
  }
  getViewType() {
    return APP_VIEW;
  }
  getDisplayText() {
    return "Vibe RPG";
  }
  getIcon() {
    return "sparkles";
  }
  getState() {
    return {
      tab: this.tab,
      selectedDateKey: this.selectedDateKey,
      homePanel: this.homePanel,
      settingsPanel: this.settingsPanel
    };
  }
  async setState(state) {
    this.isRestoringState = true;
    this.applyState(state || {});
    this.render();
    this.isRestoringState = false;
  }
  applyState(state) {
    if (["home", "settings"].includes(state.tab)) this.tab = state.tab;
    if (state.selectedDateKey) this.selectedDateKey = state.selectedDateKey;
    if (state.homePanel === "dashboard") this.homePanel = "hero";
    if (["today", "hero", "quests", "rewards", "inventory", "wallet"].includes(state.homePanel)) this.homePanel = state.homePanel;
    if (["profile", "interface", "resources", "habits", "quests", "rewards"].includes(state.settingsPanel)) this.settingsPanel = state.settingsPanel;
  }
  navigate(state) {
    const previousHomePanel = this.homePanel;
    this.applyState(state);
    const shouldResetHomeScroll = this.tab === "home" && state && Object.prototype.hasOwnProperty.call(state, "homePanel") && previousHomePanel !== this.homePanel;
    const scrollState = shouldResetHomeScroll ? { top: 0, left: 0 } : captureScroll(this);
    this.render();
    restoreScroll(this, scrollState);
    setTimeout(() => restoreScroll(this, scrollState), 0);
    this.saveNavigationState();
  }
  async saveNavigationState() {
    if (this.isRestoringState || !this.leaf || !this.leaf.setViewState) return;
    try {
      await this.leaf.setViewState({ type: APP_VIEW, active: true, state: this.getState() });
    } catch (error) {
      console.warn("Vibe RPG: navigation state was not saved", error);
    }
  }
  async onOpen() {
    this.render();
    this.clock = window.setInterval(() => {
      if (this.tab === "home") this.render();
    }, 6e4);
  }
  async onClose() {
    if (this.clock) window.clearInterval(this.clock);
  }
  render() {
    const root = this.contentEl;
    root.empty();
    root.addClass("vibe-rpg-plugin");
    for (const cls of getThemeClassList()) root.removeClass(cls);
    for (const cls of getThemeClasses(this.plugin.data && this.plugin.data.settings && this.plugin.data.settings.interfaceTheme)) {
      root.addClass(cls);
    }
    root.style.position = "relative";
    root.style.width = "100%";
    root.style.height = "100%";
    root.style.overflow = "hidden";
    const appSize = getAppSizePreset(this.plugin.data && this.plugin.data.settings);
    const app = root.createDiv({ cls: `vrpg-app vrpg-app-size-${appSize}` });
    if (!["home", "settings"].includes(this.tab)) this.tab = "home";
    if (this.tab === "home") this.renderHome(app);
    if (this.tab === "settings") this.renderSettings(app);
    this.renderTabs(app);
  }
  renderTabs(parent) {
    const tabs = parent.createDiv({ cls: "vrpg-tabs" });
    [
      ["home", "\u0413\u043B\u0430\u0432\u043D\u0430\u044F"],
      ["settings", "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438"]
    ].forEach(([id, label]) => {
      const button = tabs.createEl("button", { text: label, cls: id === this.tab ? "is-active" : "" });
      button.onclick = () => {
        this.navigate({ tab: id });
      };
    });
  }
  renderAvatar(parent, data, cls = "vrpg-avatar") {
    const player = data.player || {};
    const avatar = parent.createDiv({ cls });
    const src = String(player.avatarUrl || "").trim();
    if (src) {
      avatar.createEl("img", { attr: { src, alt: player.name || "\u0413\u0435\u0440\u043E\u0439" } });
      return avatar;
    }
    const letter = String(player.name || "P").trim().slice(0, 1).toUpperCase() || "P";
    avatar.createSpan({ text: letter });
    return avatar;
  }
  attachAvatarDropZone(zone, input, getProfile) {
    zone.ondragover = (event) => {
      event.preventDefault();
      zone.addClass("is-dragging");
    };
    zone.ondragleave = () => zone.removeClass("is-dragging");
    zone.ondrop = (event) => {
      event.preventDefault();
      zone.removeClass("is-dragging");
      const file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
      const text = event.dataTransfer && event.dataTransfer.getData("text/plain");
      if (file && file.type && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = async () => {
          input.value = String(reader.result || "");
          await this.plugin.updatePlayer({ ...getProfile(), avatarUrl: input.value });
        };
        reader.readAsDataURL(file);
        return;
      }
      if (text) {
        input.value = text.trim();
        this.plugin.updatePlayer({ ...getProfile(), avatarUrl: input.value });
      }
    };
  }
  renderHome(parent) {
    return renderHomeScreen(parent, this.getHomeScreenContext());
  }
  renderHomeModule(parent) {
    return renderHomeModuleScreen(parent, this.getHomeScreenContext());
  }
  toggleHomeEditMode() {
    this.isHomeEditMode = !this.isHomeEditMode;
    this.render();
  }
  getHomeScreenContext() {
    return {
      data: this.plugin.data,
      homePanel: this.homePanel,
      isHomeEditMode: this.isHomeEditMode,
      selectedDateKey: this.selectedDateKey,
      totals,
      dateKey,
      readDayStats,
      waterStats,
      streak,
      getHeroClassTitle,
      createProgressBar,
      text: TEXT,
      timeParts,
      dayPhase,
      monthLabel,
      dateFromKey,
      calendarDays,
      renderWaterWidget,
      renderAvatar: (avatarParent, data, cls) => this.renderAvatar(avatarParent, data, cls),
      navigate: (state) => this.navigate(state),
      toggleHomeEditMode: () => this.toggleHomeEditMode(),
      updateHomeLayout: (layout) => this.plugin.updateHomeLayout(layout),
      changeWater: (delta, key) => this.plugin.changeWater(delta, key),
      getDay,
      activeHabits,
      skillStats,
      heroTitle,
      walletStats,
      formatMoney,
      toggleHabit: (habitId, key) => this.plugin.toggleHabit(habitId, key),
      renderHomeToday: (body) => this.renderHomeToday(body),
      renderHomeHero: (body) => this.renderHomeHero(body),
      renderHomeQuests: (body) => this.renderHomeQuests(body),
      renderHomeRewards: (body) => this.renderHomeRewards(body),
      renderHomeInventory: (body) => this.renderHomeInventory(body),
      renderHomeWallet: (body) => this.renderHomeWallet(body)
    };
  }
  renderHomeToday(parent) {
    return renderHomeTodayScreen(parent, {
      data: this.plugin.data,
      selectedDateKey: this.selectedDateKey,
      dateKey,
      getDay,
      readDayStats,
      activeHabits,
      moods: MOODS,
      setMood: (id, key) => this.plugin.setMood(id, key),
      toggleHabit: (habitId, key) => this.plugin.toggleHabit(habitId, key)
    });
  }
  renderHomeHero(parent) {
    const data = this.plugin.data;
    return renderHomeHeroScreen(parent, {
      data,
      totals,
      skillStats,
      waterStats,
      streak,
      getHeroClassTitle,
      heroTitle,
      createProgressBar,
      renderRadar: (radarParent, metrics) => this.renderRadar(radarParent, metrics),
      featureFlags: FEATURE_FLAGS,
      achievements
    });
  }
  renderHomeQuests(parent) {
    const data = this.plugin.data;
    const selectedKey = this.selectedDateKey || dateKey();
    return renderHomeQuestsScreen(parent, {
      data,
      selectedDateKey: selectedKey,
      dayStats,
      sortedDayKeys,
      streak,
      getQuestStatsCards,
      questStatsCards: QUEST_STATS_CARDS,
      createStatCard
    });
  }
  renderHomeRewards(parent) {
    const data = this.plugin.data;
    return renderHomeRewardsScreen(parent, {
      data,
      totals: totals(data),
      rarities: RARITIES,
      buyReward: (rewardId) => this.plugin.buyReward(rewardId)
    });
  }
  renderHomeInventory(parent) {
    return renderHomeInventoryScreen(parent, {
      data: this.plugin.data,
      toggleInventoryItemUsed: (itemId) => this.plugin.toggleInventoryItemUsed(itemId)
    });
  }
  renderHomeWallet(parent) {
    const wallet = this.plugin.data.wallet || [];
    return renderHomeWalletScreen(parent, {
      wallet,
      selectedDateKey: this.selectedDateKey,
      dateKey,
      walletStats,
      formatMoney,
      bindMoneyInput,
      walletMonthLabel,
      addWallet: (type, amount, note, key) => this.plugin.addWallet(type, amount, note, key),
      renderWalletRow: (walletParent, item) => this.renderWalletRow(walletParent, item),
      renderWalletMonth: (walletParent, walletItems, selectedKey) => this.renderWalletMonth(walletParent, walletItems, selectedKey)
    });
  }
  renderWalletRow(parent, item) {
    return renderWalletRowComponent(parent, item, {
      formatMoney,
      deleteWallet: (itemId) => this.plugin.deleteWallet(itemId)
    });
  }
  renderWalletMonth(parent, wallet, selectedKey = dateKey()) {
    return renderWalletMonthComponent(parent, wallet, selectedKey, {
      dateKey,
      dateFromKey,
      formatMoney,
      deleteWallet: (itemId) => this.plugin.deleteWallet(itemId)
    });
  }
  renderRadar(parent, metrics) {
    return renderRadarChart(parent, metrics);
  }
  renderSettings(parent) {
    return renderSettingsScreen(parent, {
      settingsPanel: this.settingsPanel,
      navigate: (state) => this.navigate(state),
      renderSettingsProfile: (body) => this.renderSettingsProfile(body),
      renderSettingsInterface: (body) => this.renderSettingsInterface(body),
      renderSettingsResources: (body) => this.renderSettingsResources(body),
      renderSettingsHabits: (body) => this.renderSettingsHabits(body),
      renderSettingsQuests: (body) => this.renderSettingsQuests(body),
      renderSettingsRewards: (body) => this.renderSettingsRewards(body)
    });
  }
  renderSettingsProfile(parent) {
    return renderSettingsProfileScreen(parent, {
      data: this.plugin.data,
      renderAvatar: (avatarParent, data, cls) => this.renderAvatar(avatarParent, data, cls),
      attachAvatarDropZone: (zone, input, getProfile) => this.attachAvatarDropZone(zone, input, getProfile),
      updatePlayer: (profile) => this.plugin.updatePlayer(profile)
    });
  }
  renderSettingsInterface(parent) {
    return renderSettingsInterfaceScreen(parent, {
      settings: this.plugin.data.settings,
      updateHomeLayout: (layout) => this.plugin.updateHomeLayout(layout),
      updateInterfaceLayout: (layout) => this.plugin.updateInterfaceLayout(layout)
    });
  }
  renderSettingsResources(parent) {
    return renderSettingsResourcesScreen(parent, {
      settings: this.plugin.data.settings,
      setWaterGoal: (value) => this.plugin.setWaterGoal(value),
      setWaterGlassMl: (value) => this.plugin.setWaterGlassMl(value)
    });
  }
  renderSettingsHabits(parent) {
    return renderSettingsHabitsScreen(parent, {
      data: this.plugin.data,
      habitIcons: HABIT_ICONS,
      areaLabels: AREA_LABELS,
      addHabit: (title, area, xp, icon) => this.plugin.addHabit(title, area, xp, icon),
      setHabitEnabled: (habitId, enabled) => this.plugin.setHabitEnabled(habitId, enabled),
      updateHabit: (habitId, patch) => this.plugin.updateHabit(habitId, patch),
      deleteHabit: (habitId) => this.plugin.deleteHabit(habitId),
      confirm
    });
  }
  renderSettingsQuests(parent) {
    return renderSettingsQuestsScreen(parent, {
      data: this.plugin.data,
      addCustomQuestStatsCard: (card) => this.plugin.addCustomQuestStatsCard(card),
      setQuestStatsCardEnabled: (cardId, enabled) => this.plugin.setQuestStatsCardEnabled(cardId, enabled),
      updateQuestStatsCard: (cardId, patch) => this.plugin.updateQuestStatsCard(cardId, patch),
      updateCustomQuestStatsCard: (cardId, patch) => this.plugin.updateCustomQuestStatsCard(cardId, patch),
      deleteCustomQuestStatsCard: (cardId) => this.plugin.deleteCustomQuestStatsCard(cardId),
      confirm
    });
  }
  renderSettingsRewards(parent) {
    return renderSettingsRewardsScreen(parent, {
      data: this.plugin.data,
      rarities: RARITIES,
      addReward: (title, cost, rarity) => this.plugin.addReward(title, cost, rarity),
      deleteReward: (rewardId) => this.plugin.deleteReward(rewardId),
      confirm
    });
  }
};
var VibeRpgSidebarView = class extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return SIDEBAR_VIEW;
  }
  getDisplayText() {
    return "Vibe RPG";
  }
  getIcon() {
    return "sparkles";
  }
  async onOpen() {
    this.render();
  }
  render() {
    const root = this.contentEl;
    root.empty();
    root.addClass("vibe-rpg-plugin");
    const data = this.plugin.data;
    const today = getDay(data);
    const active = data.habits.filter((h) => h.enabled !== false);
    const done = active.filter((h) => today.completed[h.id]).length;
    const t = totals(data);
    const box = root.createDiv({ cls: "vrpg-sidebar" });
    box.createDiv({ cls: "vrpg-section", text: "\u0421\u0435\u0433\u043E\u0434\u043D\u044F" });
    box.createDiv({ cls: "vrpg-side-number", text: `${done}/${active.length}` });
    createProgressBar(box, active.length ? Math.round(done / active.length * 100) : 0);
    box.createDiv({ cls: "vrpg-side-note", text: `\u0411\u0430\u043B\u0430\u043D\u0441: ${t.balance} XP` });
    const open = box.createEl("button", { cls: "vrpg-primary", text: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435" });
    open.onclick = () => this.plugin.openApp();
  }
};
module.exports = VibeRpgPlugin;

/* nosourcemap */