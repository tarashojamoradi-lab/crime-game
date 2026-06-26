const correctPattern = [1, 4, 7, 5, 3, 6, 9];
let userPattern = [];

const dots = document.querySelectorAll(".dot");
const canvas = document.getElementById("patternCanvas");
const ctx = canvas.getContext("2d");

let isDrawing = false;

// اندازه canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// شروع لمس
dots.forEach(dot => {
  dot.addEventListener("mousedown", () => start(dot));
  dot.addEventListener("touchstart", () => start(dot));
});

function start(dot) {
  reset();
  isDrawing = true;
  addDot(dot);
}

// اضافه کردن نقطه
function addDot(dot) {
  const id = Number(dot.dataset.id);

  if (!userPattern.includes(id)) {
    userPattern.push(id);
    dot.classList.add("active");
  }
}

// حرکت موس / انگشت
document.addEventListener("mousemove", e => {
  if (!isDrawing) return;
  handleMove(e);
});

document.addEventListener("touchmove", e => {
  if (!isDrawing) return;
  handleMove(e.touches[0]);
});

function handleMove(e) {
  const element = document.elementFromPoint(e.clientX, e.clientY);

  if (element && element.classList.contains("dot")) {
    addDot(element);
    drawLines();
  }
}

// پایان لمس
document.addEventListener("mouseup", finish);
document.addEventListener("touchend", finish);

function finish() {
  if (!isDrawing) return;
  isDrawing = false;

  if (arraysEqual(userPattern, correctPattern)) {
    // موفقیت
    window.location.href = "home.html";
  } else {
    vibrate();
    shake();
  }

  setTimeout(reset, 500);
}

// رسم خط بین نقاط
function drawLines() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (userPattern.length < 2) return;

  ctx.beginPath();
  ctx.strokeStyle = "#00ffd5";
  ctx.lineWidth = 4;
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#00ffd5";

  for (let i = 0; i < userPattern.length; i++) {
    const dot = document.querySelector(`.dot[data-id="${userPattern[i]}"]`);
    const rect = dot.getBoundingClientRect();

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  ctx.stroke();
}

// ویبره خطا
function vibrate() {
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200]);
  }
}

// لرزش صفحه
function shake() {
  const screen = document.querySelector(".screen");
  screen.classList.add("shake");

  setTimeout(() => {
    screen.classList.remove("shake");
  }, 400);
}

// ریست
function reset() {
  userPattern = [];
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  dots.forEach(d => d.classList.remove("active"));
}

// مقایسه آرایه‌ها
function arraysEqual(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i]);
}
