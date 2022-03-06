const S=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))l(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const u of o.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&l(u)}).observe(document,{childList:!0,subtree:!0});function c(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerpolicy&&(o.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?o.credentials="include":n.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function l(n){if(n.ep)return;n.ep=!0;const o=c(n);fetch(n.href,o)}};S();var C="/todo-app/assets/bg-desktop-light.c99caf89.jpg",I="/todo-app/assets/icon-moon.dadf6d0a.svg",_="/todo-app/assets/icon-sun.fc80f87a.svg",A="/todo-app/assets/icon-check.bcf055e6.svg";const a=document.querySelector.bind(document),b=document.querySelectorAll.bind(document);HTMLElement.prototype.on=function(e,t,c){this.addEventListener(e,t,c)};const f=a("#listEl"),E=a("#inputEl"),m=a("#checkboxEl"),y=a("#filtersEl"),v=a("#toggleDarkEl"),O=a("#itemsLeftEl"),$="linear-gradient(to bottom right, hsl(192, 100%, 67%), hsl(280, 87%, 65%))";Array.from(b(".mark input[type=checkbox]")).forEach(F);document.body.style.backgroundImage=`url("${C}")`;const L=[`url("${I}")`,`url("${_}")`];let h=!1;v.style.backgroundImage=L[0];v.on("click",D);class q{constructor(t,c=!1){this.value=t,this.checked=c}}let r=[];function D(e){h=!h,e.target.style.backgroundImage=L[Number(h)]}function i(e){const t=e.checked,c=e.parentElement.querySelector(".checkmark");c.style.backgroundImage=t?`url("${A}"), ${$}`:""}function F(e){e.addEventListener("input",t=>i(t.target))}function p(){O.textContent=r.filter(e=>!e.checked).length}function x(e){const t=e.parentElement.parentElement,c=Array.from(f.children).indexOf(t);return t.parentElement.children[c].classList.toggle("completed"),r[c].checked=!r[c].checked,i(e),p(),d(),!1}function w(e){const t=document.createElement("div");t.className="mark";const c=document.createElement("input");c.type="checkbox",c.checked=e,c.on("click",n=>x(n.target)),t.appendChild(c);const l=document.createElement("div");return l.className="checkmark",t.appendChild(l),i(c),t}function M(e){const t=document.createElement("li");t.appendChild(w(e.checked));const c=document.createElement("span");return c.textContent=e.value,c.on("click",l=>{const n=l.target.parentElement.querySelector("input[type=checkbox]");x(n),n.checked=!n.checked}),t.appendChild(c),t.className=e.checked?"completed":"",t.draggable=!0,t}function k(e){f.innerHTML="",d(),e.forEach(t=>f.appendChild(M(t)))}function T(e){r.push(e),k(r)}function H(e){e.preventDefault();const t=new q(E.value,m.checked);E.value="",m.checked=!1,i(m),p(),T(t),g()}a("#form").on("submit",H);let s="All";function g(){k(r.filter(N[s]))}function P(e){y.innerHTML="",Object.keys(e).forEach(t=>{const c=document.createElement("span");c.textContent=t,c.className=t===s?"active":"",c.on("click",l=>(s=t,d(),l.target.parentElement.querySelector(".active").classList.remove("active"),l.target.classList.add("active"),g(),!1)),y.appendChild(c)})}const N={All:()=>!0,Active:e=>!e.checked,Completed:e=>e.checked};a("#clearEl").on("click",()=>{r=r.filter(e=>!e.checked),k(r),d()});window.addEventListener("load",()=>{var e,t;r=JSON.parse((e=localStorage.getItem("notes"))!=null?e:"[]"),s=(t=localStorage.getItem("chosenFilter"))!=null?t:"All",b(".mark input[type=checkbox]").forEach(i),p(),P(N),g()});function d(){localStorage.setItem("notes",JSON.stringify(r)),localStorage.setItem("chosenFilter",s)}