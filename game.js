// ИГРОВАЯ ЛОГИКА
let score = 0;
let hasWonPrize = false;

const scoreElement = document.getElementById("score");
const clickBtn = document.getElementById("clickBtn");
const resetBtn = document.getElementById("resetBtn");
const messageElement = document.getElementById("message");

// Функция обновления счёта
function updateScore() {
  scoreElement.textContent = score;

  // Если набрали 10 очков и ещё не выиграли приз
  if (score >= 10 && !hasWonPrize) {
    hasWonPrize = true;
    showWinMessage();
    sendWinEventToPlatform();
  }
}

function showWinMessage() {
  messageElement.innerHTML =
    '<div class="prize">🎉 ПОЗДРАВЛЯЕМ! Вы выиграли промокод: WELCOME20 🎉</div>';
}

// Отправка события в платформу AdBooster
function sendWinEventToPlatform() {
  // Способ 1: Если есть SDK от AdBooster
  if (window.AdBooster && window.AdBooster.sendEvent) {
    window.AdBooster.sendEvent({
      event: "gameWin",
      score: score,
      prize: "WELCOME20",
      userId: getUserId(),
    });
    console.log("Событие отправлено через SDK");
  }
  // Способ 2: Чистый postMessage (работает всегда)
  else {
    const message = {
      type: "GAME_WIN",
      data: {
        score: score,
        prize: "WELCOME20",
        timestamp: Date.now(),
      },
    };
    window.parent.postMessage(message, "*");
    console.log("Событие отправлено через postMessage");
  }
}

// Получение ID пользователя из URL (если платформа передаёт)
function getUserId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("user_id") || "anonymous";
}

// Сообщаем платформе, что игра загружена и готова
function notifyGameReady() {
  if (window.AdBooster && window.AdBooster.ready) {
    window.AdBooster.ready();
  } else {
    window.parent.postMessage({ type: "GAME_READY" }, "*");
  }
  console.log("Игра сообщила о готовности");
}

// Слушаем команды от платформы (если они нужны)
window.addEventListener("message", function (event) {
  console.log("Получено сообщение от платформы:", event.data);

  // Здесь можно обрабатывать команды типа 'close', 'pause' и т.д.
  if (event.data && event.data.action === "close") {
    console.log("Платформа просит закрыть игру");
    // Останавливаем игру, если нужно
  }
});

// Обработчики кнопок
clickBtn.addEventListener("click", () => {
  score++;
  updateScore();
});

resetBtn.addEventListener("click", () => {
  score = 0;
  hasWonPrize = false;
  updateScore();
  messageElement.innerHTML = "";
});

// Запуск игры
notifyGameReady();
