const correctPattern = [1,2,3,5,7];

const dots = document.querySelectorAll(".dot");
const phone = document.querySelector(".phone");

let selected = [];
let drawing = false;

function updateClock(){

const now = new Date();

let h = now.getHours().toString().padStart(2,"0");
let m = now.getMinutes().toString().padStart(2,"0");

document.getElementById("clock").innerHTML =
`${h}:${m}`;

document.getElementById("bigClock").innerHTML =
`${h}:${m}`;

const months=[
"فروردین","اردیبهشت","خرداد",
"تیر","مرداد","شهریور",
"مهر","آبان","آذر",
"دی","بهمن","اسفند"
];

document.getElementById("date").innerHTML =
`${now.getDate()} ${months[now.getMonth()]}`;

}

updateClock();
setInterval(updateClock,1000);

dots.forEach(dot=>{

dot.addEventListener("touchstart",startPattern);
dot.addEventListener("mousedown",startPattern);

});

document.addEventListener("touchmove",movePattern);
document.addEventListener("mousemove",movePattern);

document.addEventListener("touchend",finishPattern);
document.addEventListener("mouseup",finishPattern);

function startPattern(e){

drawing=true;

selectDot(e.target);

}

function movePattern(e){

if(!drawing) return;

let x,y;

if(e.touches){

x=e.touches[0].clientX;
y=e.touches[0].clientY;

}else{

x=e.clientX;
y=e.clientY;

}

dots.forEach(dot=>{

const r=dot.getBoundingClientRect();

if(
x>=r.left &&
x<=r.right &&
y>=r.top &&
y<=r.bottom
){

selectDot(dot);

}

});

}

function selectDot(dot){

const id=Number(dot.dataset.id);

if(selected.includes(id)) return;

selected.push(id);

dot.classList.add("active");

}

function finishPattern(){

if(!drawing) return;

drawing=false;

if(
JSON.stringify(selected)
==
JSON.stringify(correctPattern)
){

phone.classList.add("unlock");

setTimeout(()=>{

location.href="home.html";

},700);

}else{

phone.classList.add("shake");

setTimeout(()=>{

phone.classList.remove("shake");

dots.forEach(dot=>{

dot.classList.remove("active");

});

selected=[];

},400);

}

}
