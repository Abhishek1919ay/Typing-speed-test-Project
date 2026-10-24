const passages = [
  "Practice every day to improve your typing speed and accuracy. Stay calm, focus on the words, and let your fingers move naturally.",
  "Learning a new skill takes patience and steady effort. Small improvements each day can lead to excellent results over time.",
  "Technology helps people share ideas, solve problems, and learn new things. Clear communication is important in every part of life.",
  "A good typist focuses on accuracy before trying to type faster. With regular practice, confidence and speed will grow together."
];

const passage = document.getElementById("passage");
const typingInput = document.getElementById("typingInput");
const timeDisplay = document.getElementById("time");
const wpmDisplay = document.getElementById("wpm");
const accuracyDisplay = document.getElementById("accuracy");
const durationSelect = document.getElementById("duration");
const restartButton = document.getElementById("restart");
const result = document.getElementById("result");
const message = document.getElementById("message");

let targetText = "";
let timeLeft = 30;
let timer = null;
let started = false;
let finished = false;
let correctCharacters = 0;
let totalTyped = 0;

function choosePassage() {
  return passages[Math.floor(Math.random() * passages.length)];
}

function showPassage(typedText = "") {
  passage.innerHTML = "";
  for (let i = 0; i < targetText.length; i++) {
    const letter = document.createElement("span");
    letter.textContent = targetText[i];
    if (i < typedText.length) {
      letter.className = typedText[i] === targetText[i] ? "correct" : "incorrect";
    } else if (i === typedText.length) {
      letter.className = "current";
    }
    passage.appendChild(letter);
  }
}

function startTest() {
  clearInterval(timer);
  timeLeft = Number(durationSelect.value);
  started = false;
  finished = false;
  correctCharacters = 0;
  totalTyped = 0;
  targetText = choosePassage();
  typingInput.value = "";
  typingInput.disabled = false;
  typingInput.maxLength = targetText.length;
  timeDisplay.textContent = timeLeft;
  wpmDisplay.textContent = "0";
  accuracyDisplay.textContent = "100%";
  message.textContent = "Click the box above and start typing.";
  result.hidden = true;
  showPassage();
  typingInput.focus();
}

function updateStats() {
  const typedText = typingInput.value;
  totalTyped = typedText.length;
  correctCharacters = 0;

  for (let i = 0; i < typedText.length; i++) {
    if (typedText[i] === targetText[i]) correctCharacters++;
  }

  const elapsed = Number(durationSelect.value) - timeLeft;
  const minutes = Math.max(elapsed / 60, 1 / 60);
  const wpm = Math.round((correctCharacters / 5) / minutes);
  const accuracy = totalTyped === 0 ? 100 : Math.round((correctCharacters / totalTyped) * 100);

  wpmDisplay.textContent = wpm;
  accuracyDisplay.textContent = accuracy + "%";
  showPassage(typedText);

  if (typedText.length === targetText.length) endTest();
}

function beginTimer() {
  started = true;
  message.textContent = "Keep going — focus on accuracy!";
  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    updateStats();
    if (timeLeft <= 0) endTest();
  }, 1000);
}

function endTest() {
  if (finished) return;
  finished = true;
  clearInterval(timer);
  typingInput.disabled = true;
  const finalWpm = wpmDisplay.textContent;
  const finalAccuracy = accuracyDisplay.textContent;
  document.getElementById("finalWpm").textContent = finalWpm + " WPM";
  document.getElementById("finalAccuracy").textContent = finalAccuracy + " accuracy";
  result.hidden = false;
  message.textContent = "Test finished. Great effort!";
}

typingInput.addEventListener("input", () => {
  if (finished) return;
  if (!started && typingInput.value.length > 0) beginTimer();
  updateStats();
});

restartButton.addEventListener("click", startTest);
document.getElementById("tryAgain").addEventListener("click", startTest);
durationSelect.addEventListener("change", startTest);

startTest();
