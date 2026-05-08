"use strict";

const SAVE_KEY = "popcat-clicker-2-save";
const SAVE_VERSION = 2;
const INTERSTITIAL_COOLDOWN = 180000;
const CLOUD_SAVE_DELAY = 5000;
const RUSH_MAX_CHARGE = 1000;
const RUSH_DURATION = 15000;

const SHOP_ITEMS = [
  {
    id: "clickPower",
    title: "+1 клик",
    description: "Каждый тап приносит больше монет.",
    icon: "Img/PopCatCoin.png",
    basePrice: 25,
    growth: 1.45,
    maxLevel: 80,
  },
  {
    id: "autoClicker",
    title: "Авто-кликер",
    description: "Сам добывает монеты, пока игра открыта.",
    icon: "Img/2Xicon.png",
    basePrice: 120,
    growth: 1.55,
    maxLevel: 50,
  },
  {
    id: "multiplier",
    title: "Множитель кликов",
    description: "Усиливает ручные клики и автокликер.",
    icon: "Img/PopCatBackground.png",
    basePrice: 450,
    growth: 1.9,
    maxLevel: 25,
  },
  {
    id: "boost",
    title: "Буст x2 на 60 сек",
    description: "Временный ускоритель для рывка.",
    icon: "Img/2Xicon.png",
    basePrice: 850,
    growth: 1.7,
    maxLevel: 99,
  },
  {
    id: "skinChristmas",
    title: "Новогодний кот",
    description: "Скин: +15% к силе клика.",
    icon: "Img/ChristmasPopCat.png",
    basePrice: 1400,
    growth: 1,
    maxLevel: 1,
    skin: "christmas",
    bonus: "Клики +15%",
  },
  {
    id: "skinPopcorn",
    title: "Попкорн-кот",
    description: "Скин: +20% к автокликеру.",
    icon: "Img/PopCornPopCat.png",
    basePrice: 2600,
    growth: 1,
    maxLevel: 1,
    skin: "popcorn",
    bonus: "Автоклик +20%",
  },
  {
    id: "skinNeon",
    title: "Неоновый кот",
    description: "Скин: POP RUSH заряжается быстрее.",
    icon: "Img/PopCatCoin.png",
    basePrice: 5200,
    growth: 1,
    maxLevel: 1,
    skin: "neon",
    bonus: "Rush x2 заряд",
  },
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
  music: document.getElementById("bgMusic"),
  popSound: document.getElementById("PopCatSound"),
  knockSound: document.getElementById("Knock"),
};

let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
let ysdk = null;
let player = null;
let isPaused = false;
let isAdOpen = false;
let shopOpen = false;
let cloudSaveTimer = null;
let messageTimer = null;
let catMouthOpen = false;
let pendingInterstitialReason = null;

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function normalizeSave(rawSave) {
  const clean = cloneDefaultState();
  if (!rawSave || typeof rawSave !== "object") {
    return clean;
  }

  clean.score = safeNumber(rawSave.score, 0);
  clean.totalClicks = safeNumber(rawSave.totalClicks, 0);
  clean.totalPurchases = safeNumber(rawSave.totalPurchases, 0);
  clean.totalEarned = safeNumber(rawSave.totalEarned, clean.score);
  clean.rebirthCount = safeNumber(rawSave.rebirthCount, 0);
  clean.musicEnabled = Boolean(rawSave.musicEnabled);
  clean.volume = clamp(safeNumber(rawSave.volume, 0.7), 0, 1);
  clean.selectedSkin = typeof rawSave.selectedSkin === "string" ? rawSave.selectedSkin : "default";
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
  return Math.floor(value).toLocaleString("ru-RU");
}

function getItemConfig(id) {
  return SHOP_ITEMS.find((item) => item.id === id);
}

function getUpgradeLevel(id) {
  return state.upgrades[id] || 0;
}

function getPrice(item) {
  const level = getUpgradeLevel(item.id);
  if (level >= item.maxLevel) {
    return Infinity;
  }
  return Math.floor(item.basePrice * Math.pow(item.growth, level));
}

function getClickValue() {
  const clickPower = 1 + getUpgradeLevel("clickPower");
  const multiplier = 1 + getUpgradeLevel("multiplier") * 0.35;
  const rebirthBonus = 1 + state.rebirthCount * 0.5;
  return Math.max(1, Math.floor(clickPower * multiplier * rebirthBonus * getBoostMultiplier() * getActiveSkinBonus().click));
}

function getAutoClickPerSecond() {
  const autoLevel = getUpgradeLevel("autoClicker");
  if (!autoLevel) {
    return 0;
  }
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

function getActiveSkinBonus() {
  if (state.selectedSkin === "christmas" && getUpgradeLevel("skinChristmas") > 0) {
    return { click: 1.15, auto: 1, rushCharge: 1 };
  }

  if (state.selectedSkin === "popcorn" && getUpgradeLevel("skinPopcorn") > 0) {
    return { click: 1, auto: 1.2, rushCharge: 1 };
  }

  if (state.selectedSkin === "neon" && getUpgradeLevel("skinNeon") > 0) {
    return { click: 1, auto: 1, rushCharge: 2 };
  }

  return { click: 1, auto: 1, rushCharge: 1 };
}

function getQuests() {
  const round = state.questRound;
  return [
    {
      id: `clicks-${round}`,
      title: "Клик-марафон",
      description: "Накликай по коту.",
      progress: state.totalClicks,
      target: 200 + round * 150,
      reward: 250 + round * 180,
    },
    {
      id: `earn-${round}`,
      title: "Копилка POP CAT",
      description: "Заработай монеты за всё время.",
      progress: state.totalEarned,
      target: Math.floor(3000 * Math.pow(1.55, round)),
      reward: 600 + round * 420,
    },
    {
      id: `buy-${round}`,
      title: "Шопоголик",
      description: "Купи улучшения в магазине.",
      progress: state.totalPurchases,
      target: 4 + round * 2,
      reward: 450 + round * 320,
    },
  ];
}

function isQuestClaimed(questId) {
  return state.claimedQuests.includes(questId);
}

function claimQuest(questId) {
  const quest = getQuests().find((item) => item.id === questId);
  if (!quest || isQuestClaimed(quest.id)) {
    return;
  }

  if (quest.progress < quest.target) {
    showMessage("Задание ещё не выполнено.");
    return;
  }

  state.claimedQuests.push(quest.id);
  state.score += quest.reward;
  showMessage(`Задание выполнено! +${formatNumber(quest.reward)} монет.`);

  if (getQuests().every((item) => state.claimedQuests.includes(item.id))) {
    state.questRound += 1;
    state.claimedQuests = [];
    showMessage("Новый набор заданий открыт!");
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
    showMessage(`Нужно ещё ${formatNumber(price - state.score)} монет.`);
    return false;
  }
  state.score -= price;
  return true;
}

function handleCatClick() {
  if (isPaused || isAdOpen) {
    return;
  }

  const amount = getClickValue();
  catMouthOpen = !catMouthOpen;
  applyCatImage();
  playClickSound();
  chargeRush();
  addScore(amount);
  state.totalClicks += 1;
  showFloatingText(`+${formatNumber(amount)}`);
}

function chargeRush() {
  if (Date.now() < state.rushEndsAt) {
    return;
  }

  state.rushCharge = clamp(state.rushCharge + getActiveSkinBonus().rushCharge, 0, RUSH_MAX_CHARGE);
  if (state.rushCharge >= RUSH_MAX_CHARGE) {
    state.rushCharge = 0;
    state.rushEndsAt = Date.now() + RUSH_DURATION;
    showMessage("POP RUSH! x3 ко всем монетам на 15 секунд!");
  }
}

function buyUpgrade(itemId) {
  const item = getItemConfig(itemId);
  if (!item) {
    return;
  }

  const level = getUpgradeLevel(item.id);
  if (item.skin && level >= item.maxLevel) {
    state.selectedSkin = item.skin;
    catMouthOpen = false;
    showMessage(`${item.title} надет!`);
    updateUi();
    scheduleSave(true);
    return;
  }

  if (level >= item.maxLevel) {
    showMessage("Уже куплено по максимуму.");
    return;
  }

  const price = getPrice(item);
  if (!spendScore(price)) {
    return;
  }

  state.upgrades[item.id] = level + 1;
  state.totalPurchases += 1;
  if (item.skin) {
    state.selectedSkin = item.skin;
  }
  if (item.id === "boost") {
    activateBoost(60000);
  }

  playKnockSound();
  showMessage(`${item.title} куплено!`);
  updateUi();
  scheduleSave(true);
}

function activateBoost(durationMs) {
  state.boostEndsAt = Math.max(Date.now(), state.boostEndsAt) + durationMs;
}

function rebirth() {
  const price = getRebirthPrice();
  if (!spendScore(price)) {
    return;
  }

  state.score = 0;
  state.rebirthCount += 1;
  state.boostEndsAt = 0;
  Object.keys(state.upgrades).forEach((key) => {
    if (!key.startsWith("skin")) {
      state.upgrades[key] = 0;
    }
  });
  catMouthOpen = false;

  showMessage("Перерождение готово! Все клики стали сильнее.");
  updateUi();
  scheduleSave(true);
}

function renderShop() {
  elements.shopItems.innerHTML = "";
  SHOP_ITEMS.forEach((item) => {
    const level = getUpgradeLevel(item.id);
    const price = getPrice(item);
    const isMaxed = level >= item.maxLevel;
    const isSelectedSkin = item.skin && state.selectedSkin === item.skin;
    const buttonText = isSelectedSkin
      ? "Надето"
      : isMaxed && item.skin
        ? "Надеть"
        : isMaxed
          ? "Куплено"
          : `Купить за ${formatNumber(price)}`;
    const card = document.createElement("article");
    card.className = "shop-item";
    card.innerHTML = `
      <img src="${item.icon}" alt="">
      <div class="shop-copy">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        ${item.bonus ? `<em>${item.bonus}</em>` : ""}
        <span>Уровень: ${level}${item.maxLevel < 90 ? `/${item.maxLevel}` : ""}</span>
      </div>
      <button class="buy" data-buy="${item.id}" ${isSelectedSkin || (isMaxed && !item.skin) ? "disabled" : ""}>
        ${buttonText}
      </button>
    `;
    elements.shopItems.appendChild(card);
  });
}

function renderQuests() {
  if (!elements.quests) {
    return;
  }

  elements.quests.innerHTML = "";
  getQuests().forEach((quest) => {
    const progress = Math.min(quest.progress, quest.target);
    const percent = Math.min(100, (progress / quest.target) * 100);
    const claimed = isQuestClaimed(quest.id);
    const complete = quest.progress >= quest.target;
    const card = document.createElement("article");
    card.className = "quest-card";
    card.innerHTML = `
      <div class="quest-copy">
        <h3>${quest.title}</h3>
        <p>${quest.description}</p>
        <span>${formatNumber(progress)} / ${formatNumber(quest.target)}</span>
      </div>
      <div class="quest-bar"><div style="width: ${percent}%"></div></div>
      <button class="quest-claim" data-quest="${quest.id}" ${claimed || !complete ? "disabled" : ""}>
        ${claimed ? "Забрано" : complete ? `Забрать +${formatNumber(quest.reward)}` : `Награда +${formatNumber(quest.reward)}`}
      </button>
    `;
    elements.quests.appendChild(card);
  });
}

function updateUi() {
  elements.score.textContent = formatNumber(state.score);
  elements.clickPower.textContent = formatNumber(getClickValue());
  elements.autoClick.textContent = `${formatNumber(getAutoClickPerSecond())}/с`;
  elements.volume.value = String(state.volume);
  elements.music.volume = state.volume;
  elements.popSound.volume = state.volume;
  elements.knockSound.volume = state.volume;
  elements.playButton.textContent = state.musicEnabled ? "Выключить музыку" : "Включить музыку";
  elements.rebirthPrice.textContent = formatNumber(getRebirthPrice());

  const boostLeft = Math.max(0, state.boostEndsAt - Date.now());
  const rushLeft = Math.max(0, state.rushEndsAt - Date.now());
  const activeBoosts = [];
  if (boostLeft > 0) {
    activeBoosts.push(`x2 ${Math.ceil(boostLeft / 1000)}с`);
  }
  if (rushLeft > 0) {
    activeBoosts.push(`RUSH x3 ${Math.ceil(rushLeft / 1000)}с`);
  }
  elements.boost.textContent = activeBoosts.length ? activeBoosts.join(" + ") : "нет";
  elements.rush.textContent = rushLeft > 0 ? "активен" : `${Math.floor(state.rushCharge)}/${RUSH_MAX_CHARGE}`;
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

  if (state.selectedSkin === "neon" && getUpgradeLevel("skinNeon") > 0) {
    closedImage = "Img/PopCat.png";
    openImage = "Img/PopCatPop.png";
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
  messageTimer = setTimeout(() => {
    elements.message.classList.remove("visible");
  }, 2400);
}

function playClickSound() {
  try {
    elements.popSound.currentTime = 0;
    elements.popSound.play().catch(() => {});
  } catch (error) {
    // Audio playback may be blocked before the first user gesture.
  }
}

function playKnockSound() {
  try {
    elements.knockSound.currentTime = 0;
    elements.knockSound.play().catch(() => {});
  } catch (error) {
    // Non-critical effect sound.
  }
}

function toggleMusic() {
  state.musicEnabled = !state.musicEnabled;
  updateMusic();
  updateUi();
  scheduleSave(true);
}

function updateMusic() {
  elements.music.volume = state.volume;
  if (state.musicEnabled && !isPaused && !isAdOpen && !document.hidden) {
    elements.music.play().catch(() => {
      state.musicEnabled = false;
      updateUi();
    });
  } else {
    elements.music.pause();
  }
}

function setPaused(paused, reason = "manual") {
  isPaused = paused;
  elements.pauseOverlay.classList.toggle("visible", paused && reason !== "ad");
  elements.pauseOverlay.setAttribute("aria-hidden", paused ? "false" : "true");

  if (paused) {
    callGameplayStop();
    elements.music.pause();
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
  if (!window.YaGames || typeof window.YaGames.init !== "function") {
    return;
  }

  try {
    ysdk = await window.YaGames.init();
    try {
      player = await ysdk.getPlayer();
      const cloudData = await player.getData([SAVE_KEY]);
      if (cloudData && cloudData[SAVE_KEY]) {
        state = normalizeSave(cloudData[SAVE_KEY]);
      }
    } catch (error) {
      player = null;
    }
  } catch (error) {
    ysdk = null;
  }
}

function callLoadingReady() {
  try {
    ysdk?.features?.LoadingAPI?.ready();
  } catch (error) {
    // SDK calls must never break local or offline gameplay.
  }
}

function callGameplayStart() {
  try {
    ysdk?.features?.GameplayAPI?.start();
  } catch (error) {
    // Ignore SDK transport errors.
  }
}

function callGameplayStop() {
  try {
    ysdk?.features?.GameplayAPI?.stop();
  } catch (error) {
    // Ignore SDK transport errors.
  }
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
  if (!canShowInterstitial()) {
    return;
  }

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
          if (!shopOpen && !document.hidden) {
            setPaused(false, reason);
          }
        },
        onError: () => {
          isAdOpen = false;
          if (!shopOpen && !document.hidden) {
            setPaused(false, reason);
          }
        },
      },
    });
  } catch (error) {
    isAdOpen = false;
    if (!shopOpen && !document.hidden) {
      setPaused(false, reason);
    }
  }
}

function showRewardedVideo() {
  if (!ysdk?.adv?.showRewardedVideo) {
    showMessage("Видео-реклама доступна только на Яндекс Играх.");
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
          showMessage("Награда получена: x2 клики на 60 секунд!");
          updateUi();
          scheduleSave(true);
        },
        onClose: () => {
          isAdOpen = false;
          if (!rewarded) {
            showMessage("Видео не досмотрено, награда не выдана.");
          }
          if (!shopOpen && !document.hidden) {
            setPaused(false, "rewarded");
          }
        },
        onError: () => {
          isAdOpen = false;
          showMessage("Реклама сейчас недоступна. Попробуй позже.");
          if (!shopOpen && !document.hidden) {
            setPaused(false, "rewarded");
          }
        },
      },
    });
  } catch (error) {
    isAdOpen = false;
    showMessage("Реклама сейчас недоступна. Попробуй позже.");
    if (!shopOpen && !document.hidden) {
      setPaused(false, "rewarded");
    }
  }
}

function loadLocalSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    state = normalizeSave(raw ? JSON.parse(raw) : null);
  } catch (error) {
    state = cloneDefaultState();
  }
}

function saveLocal() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (error) {
    // Some browsers may block storage. The game should continue anyway.
  }
}

function saveCloud(flush = false) {
  if (!player?.setData) {
    return;
  }

  try {
    player.setData({ [SAVE_KEY]: state }, flush).catch(() => {});
  } catch (error) {
    // Cloud save is optional; localStorage remains the fallback.
  }
}

function scheduleSave(flush = false) {
  saveLocal();
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(() => saveCloud(flush), flush ? 0 : CLOUD_SAVE_DELAY);
}

function startAutoClicker() {
  setInterval(() => {
    if (isPaused || isAdOpen) {
      return;
    }
    const perSecond = getAutoClickPerSecond();
    if (perSecond > 0) {
      addScore(perSecond);
    }
  }, 1000);
}

function startBoostTicker() {
  setInterval(() => {
    updateUi();
  }, 1000);
}

function waitForPageLoad() {
  if (document.readyState === "complete") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    window.addEventListener("load", resolve, { once: true });
  });
}

function bindEvents() {
  elements.catButton.addEventListener("click", handleCatClick);
  elements.shopButton.addEventListener("click", openShop);
  elements.closeShop.addEventListener("click", closeShop);
  elements.rebirthButton.addEventListener("click", rebirth);
  elements.playButton.addEventListener("click", toggleMusic);
  elements.rewardButton.addEventListener("click", showRewardedVideo);

  elements.volume.addEventListener("input", () => {
    state.volume = clamp(Number(elements.volume.value), 0, 1);
    updateMusic();
    updateUi();
    scheduleSave();
  });

  elements.shopItems.addEventListener("click", (event) => {
    const button = event.target.closest("[data-buy]");
    if (button) {
      buyUpgrade(button.dataset.buy);
    }
  });

  elements.quests?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-quest]");
    if (button) {
      claimQuest(button.dataset.quest);
    }
  });

  elements.shopOverlay.addEventListener("click", (event) => {
    if (event.target === elements.shopOverlay) {
      closeShop();
    }
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
    if (!shopOpen && !isAdOpen && !document.hidden) {
      setPaused(false, "focus");
    }
  });

  window.addEventListener("pagehide", () => scheduleSave(true));
}

async function startGame() {
  loadLocalSave();
  bindEvents();
  updateUi();
  startAutoClicker();
  startBoostTicker();
  await initYandexSdk();
  await waitForPageLoad();
  updateUi();
  callLoadingReady();
  callGameplayStart();
  showMessage("Готово! Кликай по коту и собирай монеты.");
}

startGame();
