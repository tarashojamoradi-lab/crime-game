/* =========================================
   CLOWN PHONE
   phone.js
   Part 1 / 3
========================================= */

const phone = document.querySelector(".phone");
const dots = document.querySelectorAll(".dot");
const svg = document.getElementById("patternLines");
const flash = document.getElementById("unlockFlash");
const message = document.getElementById("message");
const clock = document.getElementById("clock");
const dateBox = document.getElementById("date");

/* ---------------------------
   ساعت و تاریخ
---------------------------- */

function updateClock(){

const now = new Date();

let h = now.getHours().toString().padStart(2,"0");
let m = now.getMinutes().toString().padStart(2,"0");

clock.innerHTML = h + ":" + m;

const months = [
"فروردین",
"اردیبهشت",
"خرداد",
"تیر",
"مرداد",
"شهریور",
"مهر",
"آبان",
"آذر",
"دی",
"بهمن",
"اسفند"
];

const days = [
"یکشنبه",
"دوشنبه",
"سه‌شنبه",
"چهارشنبه",
"پنجشنبه",
"جمعه",
"شنبه"
];

dateBox.innerHTML =
days[now.getDay()] +
" " +
now.getDate() +
" " +
months[now.getMonth()];

}

updateClock();

setInterval(updateClock,1000);

/* ---------------------------
   الگوی صحیح
---------------------------- */

const correctPattern = [
1,
4,
7,
5,
3,
6,
9
];

/* ---------------------------
   متغیرها
---------------------------- */

let pattern = [];

let isDrawing = false;

let lines = [];

let currentLine = null;

/* ---------------------------
   SVG
---------------------------- */

svg.setAttribute(
"viewBox",
"0 0 320 320"
);

/* ---------------------------
   گرفتن مرکز هر نقطه
---------------------------- */

function getCenter(dot){

const rect =
dot.getBoundingClientRect();

const parent =
svg.getBoundingClientRect();

return{

x:
rect.left -
parent.left +
rect.width/2,

y:
rect.top -
parent.top +
rect.height/2

};

}

/* ---------------------------
   ساخت خط
---------------------------- */

function createLine(x1,y1,x2,y2){

const line =
document.createElementNS(
"http://www.w3.org/2000/svg",
"line"
);

line.setAttribute("x1",x1);

line.setAttribute("y1",y1);

line.setAttribute("x2",x2);

line.setAttribute("y2",y2);

line.setAttribute(
"stroke",
"white"
);

line.setAttribute(
"stroke-width",
"6"
);

line.setAttribute(
"stroke-linecap",
"round"
);

svg.appendChild(line);

return line;

}

/* ---------------------------
   پاک کردن خطوط
---------------------------- */

function clearPattern(){

pattern=[];

dots.forEach(dot=>{

dot.classList.remove(
"active"
);

});

svg.innerHTML="";

currentLine=null;

lines=[];

}

/* ---------------------------
   فعال کردن نقطه
---------------------------- */

function activateDot(dot){

const id =
Number(dot.dataset.id);

if(pattern.includes(id))
return;

dot.classList.add("active");

pattern.push(id);

const pos =
getCenter(dot);

if(pattern.length===1){

currentLine=pos;

return;

}

const prev =
dots[
pattern.length-2
];

const prevPos =
getCenter(prev);

const line =
createLine(
prevPos.x,
prevPos.y,
pos.x,
pos.y
);

lines.push(line);

currentLine=pos;

}
/* =========================================
   CLOWN PHONE
   phone.js
   Part 2 / 3
========================================= */

/* ---------------------------
   پیدا کردن نقطه لمس شده
---------------------------- */

function findDot(x,y){

for(const dot of dots){

const rect = dot.getBoundingClientRect();

if(

x >= rect.left &&
x <= rect.right &&
y >= rect.top &&
y <= rect.bottom

){

return dot;

}

}

return null;

}

/* ---------------------------
   شروع رسم الگو
---------------------------- */

function startDraw(e){

clearPattern();

isDrawing = true;

const touch = e.touches ?
e.touches[0] :
e;

const dot = findDot(

touch.clientX,
touch.clientY

);

if(dot){

activateDot(dot);

}

}

/* ---------------------------
   ادامه رسم
---------------------------- */

function moveDraw(e){

if(!isDrawing) return;

const touch = e.touches ?
e.touches[0] :
e;

const dot = findDot(

touch.clientX,
touch.clientY

);

if(dot){

activateDot(dot);

}

}

/* ---------------------------
   پایان رسم
---------------------------- */

function endDraw(){

if(!isDrawing) return;

isDrawing = false;

checkPattern();

}

/* ---------------------------
   رویدادهای لمسی
---------------------------- */

phone.addEventListener(

"touchstart",

startDraw,

{passive:false}

);

phone.addEventListener(

"touchmove",

function(e){

e.preventDefault();

moveDraw(e);

},

{passive:false}

);

phone.addEventListener(

"touchend",

endDraw

);

/* ---------------------------
   رویدادهای موس
---------------------------- */

phone.addEventListener(

"mousedown",

startDraw

);

phone.addEventListener(

"mousemove",

moveDraw

);

phone.addEventListener(

"mouseup",

endDraw

);

phone.addEventListener(

"mouseleave",

endDraw

);

/* ---------------------------
   بررسی الگو
---------------------------- */

function arraysEqual(a,b){

if(a.length!==b.length)
return false;

for(

let i=0;

i<a.length;

i++

){

if(a[i]!==b[i])
return false;

}

return true;

}
/* =========================================
   CLOWN PHONE
   phone.js
   Part 3 / 3
========================================= */

function checkPattern(){

if(arraysEqual(pattern,correctPattern)){

message.style.color="#67ff67";
message.innerHTML="";

lines.forEach(line=>{

line.setAttribute("stroke","#67ff67");

});

flash.style.transition=".35s";
flash.style.opacity="1";

setTimeout(()=>{

flash.style.opacity="0";

window.location.href="home.html";

},800);

}else{

message.style.color="#ff4d4d";
message.innerHTML="الگوی وارد شده اشتباه است";

phone.classList.add("shake");

if(navigator.vibrate){

navigator.vibrate([120,80,120]);

}

lines.forEach(line=>{

line.setAttribute("stroke","#ff3b3b");

});

setTimeout(()=>{

phone.classList.remove("shake");

clearPattern();

message.innerHTML="";

},1000);

}

}

/* جلوگیری از انتخاب متن */

document.addEventListener("selectstart",e=>{

e.preventDefault();

});

/* جلوگیری از منوی لمس */

document.addEventListener("contextmenu",e=>{

e.preventDefault();

});

/* جلوگیری از درگ تصاویر */

document.querySelectorAll("img").forEach(img=>{

img.draggable=false;

});

/* جلوگیری از زوم دو ضرب */

let lastTouchEnd=0;

document.addEventListener("touchend",function(e){

const now=(new Date()).getTime();

if(now-lastTouchEnd<=300){

e.preventDefault();

}

lastTouchEnd=now;

},false);

/* آماده شدن صفحه */

window.onload=function(){

updateClock();

clearPattern();

};
