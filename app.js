"use strict";

const works = [
  {id:"Y71QbZmNe64",title:"時薪 36 元到飾品品牌老闆｜WhyNot 壞吶",duration:"16:12",seconds:972,category:"portrait"},
  {id:"L7CN-1bPIUE",title:"放棄百萬年薪，用 30 萬存款創業｜麥莉 MILEY",duration:"15:49",seconds:949,category:"portrait"},
  {id:"0zMqt_d5U4M",title:"仁海宮夜市走訪與新手擺攤成本",duration:"11:01",seconds:661,category:"location"},
  {id:"VDGBtWc5AEE",title:"月入十萬櫃姐轉戰市場擺攤",duration:"11:28",seconds:688,category:"portrait"},
  {id:"MGFB5cNGmoM",title:"從一般市集轉戰大學校園",duration:"14:47",seconds:887,category:"location"},
  {id:"eGK_drtKlaE",title:"黃昏市場擺攤半年慘痛心得",duration:"9:03",seconds:543,category:"portrait"},
  {id:"TksFiuOXHWQ",title:"銘傳文藝季市集走訪",duration:"8:30",seconds:510,category:"location"},
  {id:"UUeeQRIo69w",title:"松菸 168 幸福市集走訪",duration:"9:20",seconds:560,category:"location"},
  {id:"pRbyfoGFLBo",title:"北醫聖誕市集與新手擺攤風險",duration:"9:43",seconds:583,category:"location"},
  {id:"cVKmrJggShc",title:"艋舺夜市走訪與攤商訪談",duration:"8:40",seconds:520,category:"location"},
  {id:"2j6Q1CUDtow",title:"水源市場走訪與攤位租金",duration:"9:29",seconds:569,category:"location"}
];
const featured = [
  {id:"Y71QbZmNe64",title:"從時薪 36 元，<br>到飾品品牌老闆。",subtitle:"WhyNot 壞吶・荷蘭"},
  {id:"L7CN-1bPIUE",title:"放下百萬年薪，<br>走上創業的路。",subtitle:"麥莉 MILEY・創業故事"},
  {id:"0zMqt_d5U4M",title:"走進夜市，<br>聽見攤商的日常。",subtitle:"中壢仁海宮夜市・現場走訪"}
];
const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
const grid = document.querySelector("#work-grid");
const categoryName = c => c === "portrait" ? "人物故事" : "市場與市集";

function makeCard(work,index){
  const article=document.createElement("article");article.className="work-card";article.style.setProperty("--delay",`${Math.min(index,5)*45}ms`);
  article.innerHTML=`<button class="work-image video-trigger" data-video="${work.id}" aria-label="播放：${work.title}"><img src="assets/${work.id}.jpg" alt="${work.title}作品縮圖" width="1280" height="720" loading="lazy"><span class="work-play" aria-hidden="true">▶</span><span class="work-duration">${work.duration}</span></button><div class="work-meta"><span>${categoryName(work.category)}</span><span>拍攝・剪輯</span></div><h3><button class="video-trigger" data-video="${work.id}">${work.title}</button></h3>`;
  return article;
}
function renderWorks(filter="all"){
  const filtered=works.filter(w=>filter==="all" || (filter==="long" ? w.seconds>=600 : w.category===filter));
  grid.replaceChildren(...filtered.map(makeCard));
  document.querySelector("#result-count").textContent=`${filtered.length} 支作品`;
}
renderWorks();
document.querySelectorAll("[data-filter]").forEach(button=>button.addEventListener("click",()=>{
  document.querySelectorAll("[data-filter]").forEach(b=>{const selected=b===button;b.classList.toggle("active",selected);b.setAttribute("aria-pressed",selected)});
  renderWorks(button.dataset.filter);
}));

let featureIndex=0,featureTimer;
const tabs=[...document.querySelectorAll("[data-feature]")];
function setFeature(index,focus=false){
  featureIndex=(index+featured.length)%featured.length;
  const feature=featured[featureIndex],work=works.find(w=>w.id===feature.id),screen=document.querySelector(".feature-screen");
  tabs.forEach((tab,i)=>{tab.classList.toggle("active",i===featureIndex);tab.setAttribute("aria-selected",i===featureIndex);tab.tabIndex=i===featureIndex?0:-1});
  if(focus)tabs[featureIndex].focus();
  document.querySelector(".feature-play").dataset.video=work.id;
  document.querySelector(".feature-play").setAttribute("aria-label",`播放：${work.title}`);
  screen.setAttribute("aria-labelledby",`feature-tab-${featureIndex}`);
  clearTimeout(featureTimer);screen.classList.add("switching");
  featureTimer=setTimeout(()=>{
    const image=document.querySelector("#feature-image");image.src=`assets/${work.id}.jpg`;image.alt=`${work.title}作品縮圖`;
    document.querySelector("#feature-title").innerHTML=feature.title;
    document.querySelector("#feature-subtitle").textContent=feature.subtitle;
    document.querySelector("#feature-duration").textContent=work.duration;
    document.querySelector("#feature-category").textContent=categoryName(work.category);
    document.querySelector("#feature-number").textContent=`0${featureIndex+1} / 03`;
    screen.classList.remove("switching");
  },motionQuery.matches?0:180);
}
tabs.forEach((tab,index)=>{
  tab.addEventListener("click",()=>setFeature(index));
  tab.addEventListener("keydown",event=>{let next;if(event.key==="ArrowRight")next=featureIndex+1;if(event.key==="ArrowLeft")next=featureIndex-1;if(event.key==="Home")next=0;if(event.key==="End")next=featured.length-1;if(next!==undefined){event.preventDefault();setFeature(next,true)}});
});
document.querySelectorAll("[data-step]").forEach(b=>b.addEventListener("click",()=>setFeature(featureIndex+Number(b.dataset.step))));
// Intentional manual controls keep the viewer in charge of the reading pace.

const modal=document.querySelector(".video-modal"),container=document.querySelector(".video-container");
let lastTrigger=null;
function openVideo(id,trigger){
  const work=works.find(w=>w.id===id);if(!work)return;
  lastTrigger=trigger;
  document.querySelector("#video-title").textContent=work.title;
  document.querySelector("#youtube-link").href=`https://www.youtube.com/watch?v=${work.id}`;
  const frame=document.createElement("iframe");
  frame.src=`https://www.youtube-nocookie.com/embed/${work.id}?autoplay=1&rel=0`;
  frame.title=work.title;frame.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";frame.allowFullscreen=true;frame.referrerPolicy="strict-origin-when-cross-origin";
  container.replaceChildren(frame);modal.showModal();document.body.classList.add("modal-open");document.querySelector(".modal-close").focus();
}
function closeVideo(){modal.close()}
document.addEventListener("click",event=>{const target=event.target.closest(".video-trigger");if(target)openVideo(target.dataset.video,target)});
document.querySelector(".modal-close").addEventListener("click",closeVideo);
modal.addEventListener("click",event=>{if(event.target===modal){const r=modal.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeVideo()}});
modal.addEventListener("close",()=>{container.replaceChildren();document.body.classList.remove("modal-open");lastTrigger?.focus({preventScroll:true})});

const processWords=["先理解。","再編排。","磨細節。","回頭看。"];
const processTimes=["01: UNDERSTAND","02: STRUCTURE","03: REFINE","04: REVIEW"];
const processCaptions=["讓素材有脈絡。","讓故事往前走。","讓畫面與聲音到位。","讓交片更有把握。"];
document.querySelectorAll("[data-process]").forEach(button=>button.addEventListener("click",()=>{
  const index=Number(button.dataset.process);
  document.querySelectorAll(".process-step").forEach((step,i)=>{const active=i===index;step.classList.toggle("active",active);step.querySelector("button").setAttribute("aria-expanded",active);step.querySelector(".process-body").hidden=!active;step.querySelector(".step-symbol").textContent=active?"−":"+"});
  document.querySelector("#process-word").textContent=processWords[index];document.querySelector("#process-time").textContent=processTimes[index];document.querySelector("#process-caption").textContent=processCaptions[index];document.querySelector(".playhead").style.left=`${[25,45,66,90][index]}%`;
}));

let toastTimer;
function toast(message){const el=document.querySelector(".toast");el.textContent=message;el.classList.add("visible");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("visible"),2800)}
document.querySelector(".copy-email").addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText("s89615@gmail.com");toast("已複製 Email：s89615@gmail.com")}
  catch{toast("Email：s89615@gmail.com");const range=document.createRange();range.selectNodeContents(document.querySelector(".contact-info a"));const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range)}
});

if("IntersectionObserver" in window){
  document.documentElement.classList.add("js-ready");
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:"0px 0px -20px 0px"});
  document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));
  const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll(".nav-links a").forEach(a=>a.classList.toggle("current",a.hash===`#${entry.target.id}`))}}),{rootMargin:"-15% 0px -60% 0px"});
  document.querySelectorAll("#selected,#approach,#about").forEach(el=>navObserver.observe(el));
}
let framePending=false;
function updateScroll(){
  const max=document.documentElement.scrollHeight-innerHeight,progress=max>0?scrollY/max:0;
  document.querySelector(".scroll-progress").style.transform=`scaleX(${progress})`;
  if(!motionQuery.matches){const ratio=Math.min(scrollY/850,1);document.querySelector(".hero-stage").style.transform=`translate3d(0,${-ratio*28}px,0)`;document.querySelector(".hero-side.left").style.transform=`translate3d(${-ratio*40}px,${ratio*22}px,0) rotate(${-7-ratio*3}deg)`;document.querySelector(".hero-side.right").style.transform=`translate3d(${ratio*40}px,${ratio*22}px,0) rotate(${7+ratio*3}deg)`}
  framePending=false;
}
addEventListener("scroll",()=>{if(!framePending){framePending=true;requestAnimationFrame(updateScroll)}},{passive:true});
addEventListener("resize",updateScroll);updateScroll();
