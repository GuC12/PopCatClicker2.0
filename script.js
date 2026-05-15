"use strict";

const SAVE_KEY = "popcat-clicker-2-save";
const SAVE_VERSION = 3;
const INTERSTITIAL_COOLDOWN = 180000;
const CLOUD_SAVE_DELAY = 5000;
const RUSH_MAX_CHARGE = 1000;
const RUSH_DURATION = 15000;

const I18N = {
  ru: {
    gameTitle: "PopCat Clicker",
    tagline: "Кликай по коту, копи монеты и прокачивай мемную машину.",
    perClick: "За клик",
    autoClick: "Автоклик",
    boost: "Буст",
    none: "нет",
    active: "активен",
    questsTitle: "Задания",
    shopButton: "Магазин POP CAT",
    rewardButton: "Смотреть рекламу: x2 клики на 60 сек",
    musicOn: "Включить музыку",
    musicOff: "Выключить музыку",
    volume: "Громкость",
    shopTitle: "Магазин POP CAT",
    price: "Цена",
    level: "Уровень",
    buyFor: "Купить за",
    bought: "Куплено",
    wear: "Надеть",
    worn: "Надето",
    rebirthTitle: "Перерождение",
    rebirthDescription: "Сбросит монеты и обычные прокачки, но навсегда усилит все клики.",
    rebirthButton: "Переродиться",
    pause: "Пауза",
    ready: "Готово! Кликай по коту и собирай монеты.",
    needMore: "Нужно ещё {amount} монет.",
    maxed: "Уже куплено по максимуму.",
    equipped: "{name} надет!",
    boughtMessage: "{name} куплено!",
    rebirthDone: "Перерождение готово! Все клики стали сильнее.",
    rush: "POP RUSH! x3 ко всем монетам на 15 секунд!",
    questNotReady: "Задание ещё не выполнено.",
    questDone: "Задание выполнено! +{amount} монет.",
    questsNext: "Новый набор заданий открыт!",
    rewardUnavailable: "Видео-реклама доступна только на Яндекс Играх.",
    rewarded: "Награда получена: x2 клики на 60 секунд!",
    rewardNotWatched: "Видео не досмотрено, награда не выдана.",
    adUnavailable: "Реклама сейчас недоступна. Попробуй позже.",
    rewardPrefix: "Награда",
    claimPrefix: "Забрать",
    claimed: "Забрано",
    items: {
      clickPower: ["+1 клик", "Каждый тап приносит больше монет.", ""],
      autoClicker: ["Авто-кликер", "Сам добывает монеты, пока игра открыта.", ""],
      multiplier: ["Множитель кликов", "Усиливает ручные клики и автокликер.", ""],
      boost: ["Буст x2 на 60 сек", "Временный ускоритель для рывка.", ""],
      skinChristmas: ["Новогодний кот", "Скин: +15% к силе клика.", "Клики +15%"],
      skinPopcorn: ["Попкорн-кот", "Скин: +20% к автокликеру.", "Автоклик +20%"],
      skinNeon: ["Неоновый кот", "Скин: POP RUSH заряжается быстрее.", "Rush x2 заряд"],
    },
    quests: {
      clicks: ["Клик-марафон", "Накликай по коту."],
      earn: ["Копилка POP CAT", "Заработай монеты за всё время."],
      buy: ["Шопоголик", "Купи улучшения в магазине."],
    },
  },
  en: {
    gameTitle: "PopCat Clicker",
    tagline: "Click the cat, collect coins, and upgrade the meme machine.",
    perClick: "Per click",
    autoClick: "Auto click",
    boost: "Boost",
    none: "none",
    active: "active",
    questsTitle: "Quests",
    shopButton: "POP CAT Shop",
    rewardButton: "Watch ad: x2 clicks for 60 sec",
    musicOn: "Turn music on",
    musicOff: "Turn music off",
    volume: "Volume",
    shopTitle: "POP CAT Shop",
    price: "Price",
    level: "Level",
    buyFor: "Buy for",
    bought: "Bought",
    wear: "Equip",
    worn: "Equipped",
    rebirthTitle: "Rebirth",
    rebirthDescription: "Resets coins and regular upgrades, but permanently strengthens all clicks.",
    rebirthButton: "Rebirth",
    pause: "Paused",
    ready: "Ready! Click the cat and collect coins.",
    needMore: "Need {amount} more coins.",
    maxed: "Already maxed out.",
    equipped: "{name} equipped!",
    boughtMessage: "{name} bought!",
    rebirthDone: "Rebirth complete! All clicks are stronger.",
    rush: "POP RUSH! x3 coins for 15 seconds!",
    questNotReady: "Quest is not complete yet.",
    questDone: "Quest complete! +{amount} coins.",
    questsNext: "New quest set unlocked!",
    rewardUnavailable: "Rewarded video is available only on Yandex Games.",
    rewarded: "Reward received: x2 clicks for 60 seconds!",
    rewardNotWatched: "Video was not completed, no reward granted.",
    adUnavailable: "Ads are unavailable right now. Try again later.",
    rewardPrefix: "Reward",
    claimPrefix: "Claim",
    claimed: "Claimed",
    items: {
      clickPower: ["+1 click", "Each tap gives more coins.", ""],
      autoClicker: ["Auto-clicker", "Earns coins while the game is open.", ""],
      multiplier: ["Click multiplier", "Boosts manual clicks and the auto-clicker.", ""],
      boost: ["x2 boost for 60 sec", "A temporary speed-up for a good run.", ""],
      skinChristmas: ["Holiday cat", "Skin: +15% click power.", "Clicks +15%"],
      skinPopcorn: ["Popcorn cat", "Skin: +20% auto-clicker.", "Auto-click +20%"],
      skinNeon: ["Neon cat", "Skin: POP RUSH charges faster.", "Rush x2 charge"],
    },
    quests: {
      clicks: ["Click marathon", "Click the cat."],
      earn: ["POP CAT bank", "Earn lifetime coins."],
      buy: ["Shop fan", "Buy upgrades in the shop."],
    },
  },
};

const SHOP_ITEMS = [
  { id: "clickPower", icon: "Img/PopCatCoin.png", basePrice: 25, growth: 1.45, maxLevel: 80 },
  { id: "autoClicker", icon: "Img/2Xicon.png", basePrice: 120, growth: 1.55, maxLevel: 50 },
  { id: "multiplier", icon: "Img/PopCatBackground.png", basePrice: 450, growth: 1.9, maxLevel: 25 },
  { id: "boost", icon: "Img/2Xicon.png", basePrice: 850, growth: 1.7, maxLevel: 99 },
  { id: "skinChristmas", icon: "Img/ChristmasPopCat.png", basePrice: 1400, growth: 1, maxLevel: 1, skin: "christmas" },
  { id: "skinPopcorn", icon: "Img/PopCornPopCat.png", basePrice: 2600, growth: 1, maxLevel: 1, skin: "popcorn" },
  { id: "skinNeon", icon: "Img/PopCatCoin.png", basePrice: 5200, growth: 1, maxLevel: 1, skin: "neon" },
];

const DEFAULT_STATE = {
  version: SAVE_VERSION,
  score: 0,
  totalClicks: 0,
  totalPurchases: 0,
  totalEarned: 0,
  rebirthCount: 0,
  musicEnabled: false,
  volume: 0.7,
  selectedSkin: "default",
  selectedLanguage: null,
  manualLanguage: false,
  lastAdAt: 0,
  lastScoreAdStep: 0,
  boostEndsAt: 0,
  rushCharge: 0,
  rushEndsAt: 0,
  questRound: 0,
  claimedQuests: [],
  upgrades: {
    clickPower: 0,
    autoClicker: 0,
    multiplier: 0,
    boost: 0,
    skinChristmas: 0,
    skinPopcorn: 0,
    skinNeon: 0,
  },
};

const elements = {
  game: document.getElementById("game"),
  score: document.getElementById("score"),
  clickPower: document.getElementById("clickPowerDisplay"),
  autoClick: document.getElementById("autoClickDisplay"),
  boost: document.getElementById("boostDisplay"),
  rush: document.getElementById("rushDisplay"),
  rushFill: document.getElementById("rushFill"),
  catButton: document.getElementById("catButton"),
  cat: document.getElementById("popcat"),
  floatingText: document.getElementById("floatingText"),
  shopButton: document.getElementById("shop"),
  rewardButton: document.getElementById("rewardBtn"),
  playButton: document.getElementById("playBtn"),
  volume: document.getElementById("volume"),
  message: document.getElementById("message"),
  quests: document.getElementById("quests"),
  shopOverlay: document.getElementById("shopOverlay"),
  shopItems: document.getElementById("shopItems"),
  closeShop: document.getElementById("closeShop"),
  rebirthButton: document.getElementById("rebirthBtn"),
  rebirthPrice: document.getElementById("rebirthPriceValue"),
  pauseOverlay: document.getElementById("pauseOverlay"),
};

let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
let ysdk = null;
let player = null;
let currentLanguage = "ru";
let isPaused = false;
let isAdOpen = false;
let shopOpen = false;
let cloudSaveTimer = null;
let messageTimer = null;
let catMouthOpen = false;
let pendingInterstitialReason = null;

const audio = createAudioManager();

function t(key, vars = {}) {
  const value = key.split(".").reduce((obj, part) => obj?.[part], I18N[currentLanguage]) ??
    key.split(".").reduce((obj, part) => obj?.[part], I18N.ru) ??
    key;
  return String(value).replace(/\{(\w+)}/g, (_, name) => vars[name] ?? "");
}

function normalizeLanguage(lang) {
  return String(lang || "").toLowerCase().startsWith("ru") ? "ru" : "en";
}

function applyTranslations() {
  document.documentElement.lang = currentLanguage;
  document.title = "PopCat Clicker";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  elements.volume.setAttribute("aria-label", t("volume"));
}

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function normalizeSave(rawSave) {
  const clean = cloneDefaultState();
  if (!rawSave || typeof rawSave !== "object") return clean;

  clean.score = safeNumber(rawSave.score, 0);
  clean.totalClicks = safeNumber(rawSave.totalClicks, 0);
  clean.totalPurchases = safeNumber(rawSave.totalPurchases, 0);
  clean.totalEarned = safeNumber(rawSave.totalEarned, clean.score);
  clean.rebirthCount = safeNumber(rawSave.rebirthCount, 0);
  clean.musicEnabled = Boolean(rawSave.musicEnabled);
  clean.volume = clamp(safeNumber(rawSave.volume, 0.7), 0, 1);
  clean.selectedSkin = typeof rawSave.selectedSkin === "string" ? rawSave.selectedSkin : "default";
  clean.selectedLanguage = typeof rawSave.selectedLanguage === "string" ? rawSave.selectedLanguage : null;
  clean.manualLanguage = Boolean(rawSave.manualLanguage);
  clean.lastAdAt = safeNumber(rawSave.lastAdAt, 0);
  clean.lastScoreAdStep = safeNumber(rawSave.lastScoreAdStep, 0);
  clean.boostEndsAt = safeNumber(rawSave.boostEndsAt, 0);
  clean.rushCharge = clamp(safeNumber(rawSave.rushCharge, 0), 0, RUSH_MAX_CHARGE);
  clean.rushEndsAt = safeNumber(rawSave.rushEndsAt, 0);
  clean.questRound = Math.max(0, Math.floor(safeNumber(rawSave.questRound, 0)));
  clean.claimedQuests = Array.isArray(rawSave.claimedQuests) ? rawSave.claimedQuests.filter((id) => typeof id === "string") : [];

  if (rawSave.upgrades && typeof rawSave.upgrades === "object") {
    Object.keys(clean.upgrades).forEach((key) => {
      clean.upgrades[key] = Math.max(0, Math.floor(safeNumber(rawSave.upgrades[key], 0)));
    });
  }

  return clean;
}

function safeNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatNumber(value) {
  return Math.floor(value).toLocaleString(currentLanguage === "ru" ? "ru-RU" : "en-US");
}

function getItemConfig(id) {
  return SHOP_ITEMS.find((item) => item.id === id);
}

function getUpgradeLevel(id) {
  return state.upgrades[id] || 0;
}

function getPrice(item) {
  const level = getUpgradeLevel(item.id);
  if (level >= item.maxLevel) return Infinity;
  return Math.floor(item.basePrice * Math.pow(item.growth, level));
}

function getActiveSkinBonus() {
  if (state.selectedSkin === "christmas" && getUpgradeLevel("skinChristmas") > 0) return { click: 1.15, auto: 1, rushCharge: 1 };
  if (state.selectedSkin === "popcorn" && getUpgradeLevel("skinPopcorn") > 0) return { click: 1, auto: 1.2, rushCharge: 1 };
  if (state.selectedSkin === "neon" && getUpgradeLevel("skinNeon") > 0) return { click: 1, auto: 1, rushCharge: 2 };
  return { click: 1, auto: 1, rushCharge: 1 };
}

function getClickValue() {
  const clickPower = 1 + getUpgradeLevel("clickPower");
  const multiplier = 1 + getUpgradeLevel("multiplier") * 0.35;
  const rebirthBonus = 1 + state.rebirthCount * 0.5;
  return Math.max(1, Math.floor(clickPower * multiplier * rebirthBonus * getBoostMultiplier() * getActiveSkinBonus().click));
}

function getAutoClickPerSecond() {
  const autoLevel = getUpgradeLevel("autoClicker");
  if (!autoLevel) return 0;
  const multiplier = 1 + getUpgradeLevel("multiplier") * 0.2;
  const rebirthBonus = 1 + state.rebirthCount * 0.3;
  return Math.floor(autoLevel * multiplier * rebirthBonus * getBoostMultiplier() * getActiveSkinBonus().auto);
}

function getBoostMultiplier() {
  const adBoost = Date.now() < state.boostEndsAt ? 2 : 1;
  const rushBoost = Date.now() < state.rushEndsAt ? 3 : 1;
  return adBoost * rushBoost;
}

function getRebirthPrice() {
  return Math.floor(25000 * Math.pow(2.25, state.rebirthCount));
}

function getQuests() {
  const round = state.questRound;
  return [
    { id: `clicks-${round}`, type: "clicks", progress: state.totalClicks, target: 200 + round * 150, reward: 250 + round * 180 },
    { id: `earn-${round}`, type: "earn", progress: state.totalEarned, target: Math.floor(3000 * Math.pow(1.55, round)), reward: 600 + round * 420 },
    { id: `buy-${round}`, type: "buy", progress: state.totalPurchases, target: 4 + round * 2, reward: 450 + round * 320 },
  ];
}

function isQuestClaimed(questId) {
  return state.claimedQuests.includes(questId);
}

function claimQuest(questId) {
  const quest = getQuests().find((item) => item.id === questId);
  if (!quest || isQuestClaimed(quest.id)) return;

  if (quest.progress < quest.target) {
    showMessage(t("questNotReady"));
    return;
  }

  state.claimedQuests.push(quest.id);
  state.score += quest.reward;
  showMessage(t("questDone", { amount: formatNumber(quest.reward) }));

  if (getQuests().every((item) => state.claimedQuests.includes(item.id))) {
    state.questRound += 1;
    state.claimedQuests = [];
    showMessage(t("questsNext"));
  }

  updateUi();
  scheduleSave(true);
}

function addScore(amount) {
  const earned = Math.max(0, Math.floor(amount));
  state.score += earned;
  state.totalEarned += earned;
  updateUi();
  scheduleSave();
  maybeShowScoreAd();
}

function spendScore(price) {
  if (state.score < price) {
    showMessage(t("needMore", { amount: formatNumber(price - state.score) }));
    return false;
  }
  state.score -= price;
  return true;
}

function handleCatClick() {
  if (isPaused || isAdOpen) return;

  audio.unlock();
  const amount = getClickValue();
  catMouthOpen = !catMouthOpen;
  applyCatImage();
  audio.play("pop");
  chargeRush();
  addScore(amount);
  state.totalClicks += 1;
  showFloatingText(`+${formatNumber(amount)}`);
}

function chargeRush() {
  if (Date.now() < state.rushEndsAt) return;

  state.rushCharge = clamp(state.rushCharge + getActiveSkinBonus().rushCharge, 0, RUSH_MAX_CHARGE);
  if (state.rushCharge >= RUSH_MAX_CHARGE) {
    state.rushCharge = 0;
    state.rushEndsAt = Date.now() + RUSH_DURATION;
    showMessage(t("rush"));
  }
}

function buyUpgrade(itemId) {
  const item = getItemConfig(itemId);
  if (!item) return;

  const level = getUpgradeLevel(item.id);
  const text = getShopText(item.id);
  if (item.skin && level >= item.maxLevel) {
    state.selectedSkin = item.skin;
    catMouthOpen = false;
    showMessage(t("equipped", { name: text.title }));
    updateUi();
    scheduleSave(true);
    return;
  }

  if (level >= item.maxLevel) {
    showMessage(t("maxed"));
    return;
  }

  const price = getPrice(item);
  if (!spendScore(price)) return;

  state.upgrades[item.id] = level + 1;
  state.totalPurchases += 1;
  if (item.skin) state.selectedSkin = item.skin;
  if (item.id === "boost") activateBoost(60000);

  audio.play("knock");
  showMessage(t("boughtMessage", { name: text.title }));
  updateUi();
  scheduleSave(true);
}

function activateBoost(durationMs) {
  state.boostEndsAt = Math.max(Date.now(), state.boostEndsAt) + durationMs;
}

function rebirth() {
  const price = getRebirthPrice();
  if (!spendScore(price)) return;

  state.score = 0;
  state.rebirthCount += 1;
  state.boostEndsAt = 0;
  Object.keys(state.upgrades).forEach((key) => {
    if (!key.startsWith("skin")) state.upgrades[key] = 0;
  });
  catMouthOpen = false;

  showMessage(t("rebirthDone"));
  updateUi();
  scheduleSave(true);
}

function getShopText(id) {
  const value = I18N[currentLanguage].items[id] || I18N.ru.items[id];
  return { title: value[0], description: value[1], bonus: value[2] };
}

function renderShop() {
  elements.shopItems.innerHTML = "";
  SHOP_ITEMS.forEach((item) => {
    const level = getUpgradeLevel(item.id);
    const price = getPrice(item);
    const isMaxed = level >= item.maxLevel;
    const isSelectedSkin = item.skin && state.selectedSkin === item.skin;
    const text = getShopText(item.id);
    const buttonText = isSelectedSkin
      ? t("worn")
      : isMaxed && item.skin
        ? t("wear")
        : isMaxed
          ? t("bought")
          : `${t("buyFor")} ${formatNumber(price)}`;
    const card = document.createElement("article");
    card.className = "shop-item";
    card.innerHTML = `
      <img src="${item.icon}" alt="" draggable="false">
      <div class="shop-copy">
        <h3>${text.title}</h3>
        <p>${text.description}</p>
        ${text.bonus ? `<em>${text.bonus}</em>` : ""}
        <span>${t("level")}: ${level}${item.maxLevel < 90 ? `/${item.maxLevel}` : ""}</span>
      </div>
      <button class="buy" data-buy="${item.id}" ${isSelectedSkin || (isMaxed && !item.skin) ? "disabled" : ""}>
        ${buttonText}
      </button>
    `;
    elements.shopItems.appendChild(card);
  });
}

function renderQuests() {
  elements.quests.innerHTML = "";
  getQuests().forEach((quest) => {
    const progress = Math.min(quest.progress, quest.target);
    const percent = Math.min(100, (progress / quest.target) * 100);
    const claimed = isQuestClaimed(quest.id);
    const complete = quest.progress >= quest.target;
    const [title, description] = I18N[currentLanguage].quests[quest.type] || I18N.ru.quests[quest.type];
    const card = document.createElement("article");
    card.className = "quest-card";
    card.innerHTML = `
      <div class="quest-copy">
        <h3>${title}</h3>
        <p>${description}</p>
        <span>${formatNumber(progress)} / ${formatNumber(quest.target)}</span>
      </div>
      <div class="quest-bar"><div style="width: ${percent}%"></div></div>
      <button class="quest-claim" data-quest="${quest.id}" ${claimed || !complete ? "disabled" : ""}>
        ${claimed ? t("claimed") : complete ? `${t("claimPrefix")} +${formatNumber(quest.reward)}` : `${t("rewardPrefix")} +${formatNumber(quest.reward)}`}
      </button>
    `;
    elements.quests.appendChild(card);
  });
}

function updateUi() {
  elements.score.textContent = formatNumber(state.score);
  elements.clickPower.textContent = formatNumber(getClickValue());
  elements.autoClick.textContent = `${formatNumber(getAutoClickPerSecond())}/${currentLanguage === "ru" ? "с" : "s"}`;
  elements.volume.value = String(state.volume);
  elements.playButton.textContent = state.musicEnabled ? t("musicOff") : t("musicOn");
  elements.rebirthPrice.textContent = formatNumber(getRebirthPrice());
  audio.setVolume(state.volume);

  const boostLeft = Math.max(0, state.boostEndsAt - Date.now());
  const rushLeft = Math.max(0, state.rushEndsAt - Date.now());
  const activeBoosts = [];
  if (boostLeft > 0) activeBoosts.push(`x2 ${Math.ceil(boostLeft / 1000)}${currentLanguage === "ru" ? "с" : "s"}`);
  if (rushLeft > 0) activeBoosts.push(`RUSH x3 ${Math.ceil(rushLeft / 1000)}${currentLanguage === "ru" ? "с" : "s"}`);
  elements.boost.textContent = activeBoosts.length ? activeBoosts.join(" + ") : t("none");
  elements.rush.textContent = rushLeft > 0 ? t("active") : `${Math.floor(state.rushCharge)}/${RUSH_MAX_CHARGE}`;
  elements.rushFill.style.width = rushLeft > 0 ? "100%" : `${(state.rushCharge / RUSH_MAX_CHARGE) * 100}%`;

  applyCatImage();
  renderShop();
  renderQuests();
}

function applyCatImage() {
  let closedImage = "Img/PopCat.png";
  let openImage = "Img/PopCatPop.png";
  elements.catButton.dataset.skin = state.selectedSkin;

  if (state.selectedSkin === "christmas" && getUpgradeLevel("skinChristmas") > 0) {
    closedImage = "Img/ChristmasPopCat.png";
    openImage = "Img/PopCatPop.png";
  }
  if (state.selectedSkin === "popcorn" && getUpgradeLevel("skinPopcorn") > 0) {
    closedImage = "Img/PopCat.png";
    openImage = "Img/PopCornPopCat.png";
  }

  elements.cat.src = catMouthOpen ? openImage : closedImage;
}

function showFloatingText(text) {
  elements.floatingText.textContent = text;
  elements.floatingText.classList.remove("pop");
  void elements.floatingText.offsetWidth;
  elements.floatingText.classList.add("pop");
}

function showMessage(text) {
  clearTimeout(messageTimer);
  elements.message.textContent = text;
  elements.message.classList.add("visible");
  messageTimer = setTimeout(() => elements.message.classList.remove("visible"), 2400);
}

function toggleMusic() {
  audio.unlock();
  state.musicEnabled = !state.musicEnabled;
  updateMusic();
  updateUi();
  scheduleSave(true);
}

function updateMusic() {
  if (state.musicEnabled && !isPaused && !isAdOpen && !document.hidden) {
    audio.startMusic();
  } else {
    audio.stopMusic();
  }
}

function setPaused(paused, reason = "manual") {
  isPaused = paused;
  elements.pauseOverlay.classList.toggle("visible", paused && reason !== "ad");
  elements.pauseOverlay.setAttribute("aria-hidden", paused ? "false" : "true");

  if (paused) {
    callGameplayStop();
    audio.stopMusic();
  } else {
    callGameplayStart();
    updateMusic();
  }
}

function openShop() {
  shopOpen = true;
  elements.shopOverlay.classList.add("visible");
  elements.shopOverlay.setAttribute("aria-hidden", "false");
  renderShop();
  setPaused(true, "menu");
  maybeShowInterstitial(pendingInterstitialReason || "shop");
  pendingInterstitialReason = null;
}

function closeShop() {
  shopOpen = false;
  elements.shopOverlay.classList.remove("visible");
  elements.shopOverlay.setAttribute("aria-hidden", "true");
  setPaused(false, "menu");
}

async function initYandexSdk() {
  await loadYandexSdkScript();
  if (!window.YaGames || typeof window.YaGames.init !== "function") return;

  try {
    ysdk = await window.YaGames.init();

    // Language is selected from SDK on first launch, but a saved manual choice would win.
    const sdkLanguage = normalizeLanguage(ysdk?.environment?.i18n?.lang);
    if (!state.manualLanguage) {
      currentLanguage = sdkLanguage;
      state.selectedLanguage = sdkLanguage;
    }

    try {
      player = await ysdk.getPlayer();
      const cloudData = await player.getData([SAVE_KEY]);
      if (cloudData && cloudData[SAVE_KEY]) {
        state = normalizeSave(cloudData[SAVE_KEY]);
        currentLanguage = state.manualLanguage && state.selectedLanguage ? normalizeLanguage(state.selectedLanguage) : sdkLanguage;
        state.selectedLanguage = currentLanguage;
      }
    } catch (error) {
      player = null;
    }
  } catch (error) {
    ysdk = null;
  }
}

function loadYandexSdkScript() {
  if (window.YaGames || location.protocol === "file:") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "/sdk.js";
    script.async = true;
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script);
  });
}

function callLoadingReady() {
  try {
    ysdk?.features?.LoadingAPI?.ready();
  } catch (error) {}
}

function callGameplayStart() {
  try {
    ysdk?.features?.GameplayAPI?.start();
  } catch (error) {}
}

function callGameplayStop() {
  try {
    ysdk?.features?.GameplayAPI?.stop();
  } catch (error) {}
}

function canShowInterstitial() {
  return Boolean(ysdk?.adv?.showFullscreenAdv) && Date.now() - state.lastAdAt >= INTERSTITIAL_COOLDOWN;
}

function maybeShowScoreAd() {
  const step = Math.floor(state.totalEarned / 7500);
  if (step > state.lastScoreAdStep) {
    state.lastScoreAdStep = step;
    pendingInterstitialReason = "score";
  }
}

function maybeShowInterstitial(reason) {
  if (!canShowInterstitial()) return;

  isAdOpen = true;
  state.lastAdAt = Date.now();
  setPaused(true, "ad");
  scheduleSave(true);

  try {
    ysdk.adv.showFullscreenAdv({
      callbacks: {
        onOpen: () => {
          isAdOpen = true;
          setPaused(true, "ad");
        },
        onClose: () => {
          isAdOpen = false;
          if (!shopOpen && !document.hidden) setPaused(false, reason);
        },
        onError: () => {
          isAdOpen = false;
          if (!shopOpen && !document.hidden) setPaused(false, reason);
        },
      },
    });
  } catch (error) {
    isAdOpen = false;
    if (!shopOpen && !document.hidden) setPaused(false, reason);
  }
}

function showRewardedVideo() {
  if (!ysdk?.adv?.showRewardedVideo) {
    showMessage(t("rewardUnavailable"));
    return;
  }

  let rewarded = false;
  isAdOpen = true;
  setPaused(true, "ad");

  try {
    ysdk.adv.showRewardedVideo({
      callbacks: {
        onOpen: () => {
          isAdOpen = true;
          setPaused(true, "ad");
        },
        onRewarded: () => {
          rewarded = true;
          activateBoost(60000);
          showMessage(t("rewarded"));
          updateUi();
          scheduleSave(true);
        },
        onClose: () => {
          isAdOpen = false;
          if (!rewarded) showMessage(t("rewardNotWatched"));
          if (!shopOpen && !document.hidden) setPaused(false, "rewarded");
        },
        onError: () => {
          isAdOpen = false;
          showMessage(t("adUnavailable"));
          if (!shopOpen && !document.hidden) setPaused(false, "rewarded");
        },
      },
    });
  } catch (error) {
    isAdOpen = false;
    showMessage(t("adUnavailable"));
    if (!shopOpen && !document.hidden) setPaused(false, "rewarded");
  }
}

function loadLocalSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    state = normalizeSave(raw ? JSON.parse(raw) : null);
  } catch (error) {
    state = cloneDefaultState();
  }
  currentLanguage = normalizeLanguage(state.selectedLanguage || "ru");
}

function saveLocal() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (error) {}
}

function saveCloud(flush = false) {
  if (!player?.setData) return;
  try {
    player.setData({ [SAVE_KEY]: state }, flush).catch(() => {});
  } catch (error) {}
}

function scheduleSave(flush = false) {
  state.selectedLanguage = currentLanguage;
  saveLocal();
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(() => saveCloud(flush), flush ? 0 : CLOUD_SAVE_DELAY);
}

function startAutoClicker() {
  setInterval(() => {
    if (isPaused || isAdOpen) return;
    const perSecond = getAutoClickPerSecond();
    if (perSecond > 0) addScore(perSecond);
  }, 1000);
}

function startBoostTicker() {
  setInterval(() => updateUi(), 1000);
}

function waitForPageLoad() {
  if (document.readyState === "complete") return Promise.resolve();
  return new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));
}

function bindEvents() {
  elements.catButton.addEventListener("click", handleCatClick);
  elements.shopButton.addEventListener("click", openShop);
  elements.closeShop.addEventListener("click", closeShop);
  elements.rebirthButton.addEventListener("click", rebirth);
  elements.playButton.addEventListener("click", toggleMusic);
  elements.rewardButton.addEventListener("click", showRewardedVideo);

  elements.volume.addEventListener("input", () => {
    audio.unlock();
    state.volume = clamp(Number(elements.volume.value), 0, 1);
    audio.setVolume(state.volume);
    updateUi();
    scheduleSave();
  });

  elements.shopItems.addEventListener("click", (event) => {
    const button = event.target.closest("[data-buy]");
    if (button) buyUpgrade(button.dataset.buy);
  });

  elements.quests.addEventListener("click", (event) => {
    const button = event.target.closest("[data-quest]");
    if (button) claimQuest(button.dataset.quest);
  });

  elements.shopOverlay.addEventListener("click", (event) => {
    if (event.target === elements.shopOverlay) closeShop();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      setPaused(true, "hidden");
      scheduleSave(true);
    } else if (!shopOpen && !isAdOpen) {
      setPaused(false, "hidden");
    }
  });
  window.addEventListener("blur", () => {
    setPaused(true, "blur");
    scheduleSave(true);
  });
  window.addEventListener("focus", () => {
    if (!shopOpen && !isAdOpen && !document.hidden) setPaused(false, "focus");
  });
  window.addEventListener("pagehide", () => scheduleSave(true));
}

function lockBrowserGestures() {
  const prevent = (event) => event.preventDefault();
  document.addEventListener("contextmenu", prevent);
  document.addEventListener("selectstart", prevent);
  document.addEventListener("dragstart", prevent);
  document.addEventListener("wheel", prevent, { passive: false });

  // Keep the page fixed in the iframe and still allow dragging the volume range.
  document.addEventListener("touchmove", (event) => {
    if (event.target.closest("input[type='range']")) return;
    if (event.target.closest(".hud, .modal-panel")) return;
    event.preventDefault();
  }, { passive: false });
}

function createAudioManager() {
  let context = null;
  let masterGain = null;
  let musicGain = null;
  let musicSource = null;
  let currentVolume = 0.7;
  const buffers = {};
  const urls = {
    music: "Sound/Music.mp3",
    pop: "Sound/PopCatSound.mp3",
    knock: "Sound/Knock.mp3",
  };

  function ensureContext() {
    if (!context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      context = new AudioContext();
      masterGain = context.createGain();
      musicGain = context.createGain();
      masterGain.gain.value = currentVolume;
      musicGain.gain.value = 0.55;
      musicGain.connect(masterGain);
      masterGain.connect(context.destination);
      loadBuffers();
    }
    if (context.state === "suspended") context.resume().catch(() => {});
    return context;
  }

  // Web Audio buffers keep game sound inside the canvas-like app experience.
  async function loadBuffers() {
    await Promise.all(Object.entries(urls).map(async ([name, url]) => {
      try {
        const response = await fetch(url);
        const bytes = await response.arrayBuffer();
        buffers[name] = await context.decodeAudioData(bytes);
      } catch (error) {
        buffers[name] = null;
      }
    }));
    if (state.musicEnabled && !isPaused && !isAdOpen && !document.hidden) {
      startMusic();
    }
  }

  function play(name) {
    const ctx = ensureContext();
    const buffer = buffers[name];
    if (!ctx || !buffer) return;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(masterGain);
    source.start(0);
  }

  function startMusic() {
    const ctx = ensureContext();
    if (!ctx || musicSource || !buffers.music) return;
    musicSource = ctx.createBufferSource();
    musicSource.buffer = buffers.music;
    musicSource.loop = true;
    musicSource.connect(musicGain);
    musicSource.onended = () => {
      musicSource = null;
    };
    musicSource.start(0);
  }

  function stopMusic() {
    if (!musicSource) return;
    try {
      musicSource.stop();
    } catch (error) {}
    musicSource.disconnect();
    musicSource = null;
  }

  return {
    unlock: ensureContext,
    play,
    startMusic,
    stopMusic,
    setVolume(value) {
      currentVolume = clamp(value, 0, 1);
      if (masterGain) masterGain.gain.value = currentVolume;
    },
  };
}

async function startGame() {
  lockBrowserGestures();
  loadLocalSave();
  bindEvents();
  applyTranslations();
  updateUi();
  startAutoClicker();
  startBoostTicker();
  await initYandexSdk();
  await waitForPageLoad();
  applyTranslations();
  updateUi();
  callLoadingReady();
  callGameplayStart();
  showMessage(t("ready"));
}

startGame();
