const cat = document.getElementById("popcat");
const shopbtn = document.getElementById("shop");
const shopOverlay = document.getElementById("shopOverlay");
const closeShop = document.getElementById("closeShop");
const music = document.getElementById("bgMusic");
const playBtn = document.getElementById("playBtn");
const volumeSlider = document.getElementById("volume");
const rebirthBtn = document.getElementById("rebirthBtn");
const rebirthPriceValue = document.getElementById("rebirthPriceValue");
const popCatSound = document.getElementById("PopCatSound");
const scoreDisplay = document.getElementById("score");
const shopBuyButtons = document.querySelectorAll(".buy:not(#rebirthBtn)");

let score = 0;
let multiplier = 1;
let rebirthMultiplier = 1;
let rebirthCount = 0;
let rebirthBasePrice = 1000;
let currentRebirthPrice = rebirthBasePrice;
let closedCatImage = "Img/PopCat.png";
let closedCatSize = "min(900px, 90vw)";
let openCatImage = "Img/PopCatPop.png";
let openCatSize = "min(500px, 80vw)";
let isClosedCat = true;

function updateScore() {
  scoreDisplay.textContent = score;
}

function updateRebirthPrice() {
  currentRebirthPrice = rebirthBasePrice * Math.pow(2, rebirthCount);
  rebirthPriceValue.textContent = currentRebirthPrice;
}

function setCat(image, width) {
  cat.src = image;
  cat.style.width = width;
}

function resetShopItems() {
  shopBuyButtons.forEach((button) => {
    button.disabled = false;
    button.textContent = "Купить";
  });
}

updateRebirthPrice();

volumeSlider.addEventListener("input", () => {
  music.volume = volumeSlider.value;
  popCatSound.volume = volumeSlider.value;
});

playBtn.addEventListener("click", () => {
  if (music.paused) {
    music.play();
    playBtn.textContent = "🔈 Выключить музыку";
  } else {
    music.pause();
    playBtn.textContent = "🔊 Включить музыку";
  }
});

cat.addEventListener("click", () => {
  popCatSound.currentTime = 0;
  popCatSound.play();

  if (isClosedCat) {
    setCat(openCatImage, openCatSize);
  } else {
    setCat(closedCatImage, closedCatSize);
  }
  isClosedCat = !isClosedCat;

  score += 1 * multiplier * rebirthMultiplier;
  updateScore();
});

rebirthBtn.addEventListener("click", () => {
  if (score >= currentRebirthPrice) {
    score = 0;
    multiplier = 1;
    rebirthCount++;
    rebirthMultiplier += 1;
    closedCatImage = "Img/PopCat.png";
    openCatImage = "Img/PopCatPop.png";
    isClosedCat = true;

    setCat(closedCatImage, closedCatSize);
    updateRebirthPrice();
    updateScore();
    resetShopItems();

    alert("Вы совершили перерождение! 😺");
  } else {
    alert("У вас недостаточно Pop Cat Coin 😿");
  }
});

shopbtn.addEventListener("click", () => {
  shopOverlay.style.display = "flex";
});

closeShop.addEventListener("click", () => {
  shopOverlay.style.display = "none";
});

shopBuyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.id === "x2") {
      if (button.disabled && button.textContent === "Куплено") {
        return;
      }
      if (score >= 500) {
        score -= 500;
        updateScore();
        button.disabled = true;
        button.textContent = "Куплено";
        multiplier = 2;
        alert("x2 множитель куплен");
      } else {
        alert("У вас недостаточно Pop Cat Coin 😿");
      }
    }

    if (button.id === "skin1") {
      if (score >= 1000) {
        score -= 1000;
        updateScore();
        button.disabled = true;
        button.textContent = "Куплено";

        closedCatImage = "Img/ChristmasPopCat.png";
        setCat(closedCatImage, closedCatSize);
        isClosedCat = true;

        alert("Скин куплен 😸");
      } else {
        alert("У вас недостаточно Pop Cat Coin 😿");
      }
    }

    if (button.id === "skin2") {
      if (score >= 2000) {
        score -= 2000;
        updateScore();
        button.disabled = true;
        button.textContent = "Куплено";

        openCatImage = "Img/PopCornPopCat.png";
        setCat(openCatImage, openCatSize);
        isClosedCat = false;

        alert("Скин куплен 😸");
      } else {
        alert("У вас недостаточно Pop Cat Coin 😿");
      }
    }
  });
});
