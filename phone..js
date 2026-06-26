const correctPattern = [1, 4, 7, 5, 3, 6, 9];

let pattern = [];
let isDrawing = false;
let lastDot = null;

const dots = document.querySelectorAll(".dot");
const canvas = document.getElementById("patternCanvas");
const ctx = canvas.getContext("2d");

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// تنظیم canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// شروع فقط روی دات
dots.forEach(dot => {
  dot.addEventListener("mousedown", start);
  dot.addEventListener("touchstart", start);
});

function start(e) {
  const dot = e.target;
  reset();

  isDrawing = true;
  addDot(dot);
}

// فقط اضافه کردن دات معتبر
function addDot(dot) {
  const id = Number(dot.dataset.id);

  if (pattern.includes(id)) return;

  pattern.push(id);
  dot.classList.add("active");

  if (lastDot) {
    drawLine(lastDot, dot);
  }

  lastDot = dot;
}

// حرکت فقط بررسی نزدیک‌ترین دات (نه elementFromPoint)
document.addEventListener("mousemove", onMove);
document.addEventListener("touchmove", e => onMove(e.touches[0]));

function onMove(e) {
  if (!isDrawing) return;

  const x = e.clientX;
  const y = e.clientY;

  dots.forEach(dot => {
    const rect = dot.getBoundingClientRect();

    const dx = rect.left + rect.width / 2;
    const dy = rect.top + rect.height / 2;

    const distance = Math.hypot(dx - x, dy - y);

    // اگر خیلی نزدیک شد، انتخاب کن
    if (distance < 25) {
      addDot(dot);
    }
  });
}

// پایان
document.addEventListener("mouseup", end);
document.addEventListener("touchend", end);

function end() {
  if (!isDrawing) return;
  isDrawing = false;

  if (isCorrect()) {
    window.location.href = "home.html";
  } else {
    vibrate();
    shake();
  }

  setTimeout(reset, 400);
}

// رسم خط دقیق بین دو نقطه
function drawLine(dot1, dot2) {
  const r1 = dot1.getBoundingClientRect();
  const r2 = dot2.getBoundingClientRect();

  const x1 = r1.left + r1.width / 2;
  const y1 = r1.top + r1.height / 2;

  const x2 = r2.left + r2.width / 2;
  const y2 = r2.top + r2.height / 2;

  ctx.beginPath();
  ctx.strokeStyle = "#00ffd5";
  ctx.lineWidth = 4;
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#00ffd5";

  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// ویبره
function vibrate() {
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200]);
  }
}

// لرزش
function shake() {
  const screen = document.querySelector(".screen");
  screen.classList.add("shake");

  setTimeout(() => {
    screen.classList.remove("shake");
  }, 400);
}

// چک رمز
function isCorrect() {
  return pattern.length === correctPattern.length &&
    pattern.every((v, i) => v === correctPattern[i]);
}

// ریست کامل
function reset() {
  pattern = [];
  lastDot = null;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dots.forEach(d => d.classList.remove("active"));
}
