/*
Copyright 2024 Alexander Herzog

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export {initLCG}

import {language} from "./Language.js";
import {isDesktopApp} from './Main.js';
import {formatNumber, getNotNegativeInt, getPositiveInt} from "./NumberTools.js";
import {loadSearchStringParameters} from "./StringTools.js";


/**
 * Permalink html element
 * @see addPermaLink
 */
let permaLink;

/**
 * Chart object
 */
let chart;

/**
 * Chart data
 */
let chartData;

/**
 * Generates and adds a permalink.
 * @param {Object} parent Parent HTML node
 */
 function addPermaLink(parent) {
  if (isDesktopApp) return;
  const permaLinkDiv=document.createElement("div");
  permaLinkDiv.classList.add("mt-3");
  permaLinkDiv.classList.add("small");
  parent.appendChild(permaLinkDiv);
  permaLinkDiv.appendChild(permaLink=document.createElement("a"));
  permaLink.innerHTML=language.GUI.permaLink;
  permaLink.href=document.location;
}

/**
 * Fills in the language strings to the GUI elements.
 */
function initGUILanguage() {
  /* Header */
  appName1.innerHTML=language.lcg.title;
  closeButton.title=language.distributions.infoDiagramCloseWindow;
  closeButton.querySelector('.menuButtonTitleShort').innerHTML=language.distributions.infoDiagramCloseWindowShort;
  closeButton.querySelector('.menuButtonTitleLong').innerHTML=language.distributions.infoDiagramCloseWindow;
  closeButton.onclick=()=>{
    if (isDesktopApp) {
      /* Since we open this window in Neutralino.js via window.open, too, we have to use window.close() */
      /* Neutralino.window.hide(); */
      window.close();
    } else {
      window.close();
    }
  }

  /* Title */
  document.getElementsByTagName("h1")[0].innerHTML=language.lcg.title;

  /* Upper info area */
  const info=document.createElement("div");
  info.innerHTML="<p>"+language.lcg.info+"</p><p><a href=\""+language.lcg.wikipedia+"\" target=\"_blank\">"+language.distributions.infoPropertiesWikipediaLink+"</a></p>";
  infoArea.appendChild(info);

  /* Input area */
  addPermaLink(inputArea);
  inputAN1.oninput=()=>update();
  inputAN.oninput=()=>update();
  inputMOD.oninput=()=>update();
  inputA0.oninput=()=>update();

  /* Output area */
  tableHeader.innerHTML=language.lcg.pseudoRandomNumbers;
  buttonShowAll.innerHTML=" "+language.lcg.showCompleteTable;
  buttonShowAll.onclick=()=>{
    buttonShowAll.style.display="none";
    for (let element of document.getElementsByClassName("optional")) element.style.display="";
  }
  gridHeader.innerHTML=language.lcg.gridStructure;
}

function update() {
  /* Load and check input */
  let mul=getNotNegativeInt(inputAN1);
  let add=getNotNegativeInt(inputAN);
  let mod=getPositiveInt(inputMOD);
  let a0=getNotNegativeInt(inputA0);
  if (mod!=null && mod==1) mod=null;
  if (mod>200_000) mod=null;
  if (mod!=null && mul>mod-1) mul=null;
  if (mod!=null && add>mod-1) add=null;
  if (mod!=null && a0>mod-1) a0=null;
  inputAN1.classList.toggle("is-invalid",mul==null);
  inputAN.classList.toggle("is-invalid",add==null);
  inputMOD.classList.toggle("is-invalid",mod==null);
  inputA0.classList.toggle("is-invalid",a0==null);
  if (mul==null || add==null || mod==null || a0==null) return;

  /* Update permalink */
  const url=document.location.protocol+"//"+document.location.host+document.location.pathname+"?mul="+mul+"&add="+add+"&mod="+mod+"&a0="+a0;
  permaLink.href=url;

  /* Start processing */
  outputAreaTable.innerHTML=language.lcg.processing;
  outputAreaText.innerHTML="";

  /* Generate table */
  let table="";

  table+="<p>";
  table+=language.lcg.tableHeading;
  table+=" <strong>a<sub>n+1</sub>:="+mul+"&middot;a<sub>n</sub>+"+add+" mod "+mod+"</strong> ";
  table+=language.lcg.tableHeadingWithInitialValue;
  table+=" <strong>a<sub>0</sub>:="+a0+"</strong> ";
  table+=language.lcg.tableHeadingAnd;
  table+=" <strong>u<sub>n</sub>:=a<sub>n</sub>/"+mod+"</strong>:";
  table+="</p>";

  table+="<table class='borders'>";
  table+="<tr><td><strong>n</strong></td><td><strong>a<sub>n</sub></strong></td><td><strong>u<sub>n</sub></strong></td></tr>";
  let n=0;
  let a=a0;
  let len=0;
  const rndNumbers=[];
  const rndNumbersSet=new Set();
  let hasOptional=false;
  while (true) {
    if (n>100) {
      table+="<tr class='optional' style='display: none;'>";
      hasOptional=true;
    } else {
      table+="<tr>";
    }
    table+="<td>"+n+"</td><td>"+a+"</td><td>"+formatNumber(a/mod,5)+"</td></tr>";
    if (rndNumbersSet.has(a)) {
      const index=rndNumbers.indexOf(a);
      len=n-index;
      break;
    }
    rndNumbersSet.add(a);
    rndNumbers.push(a);
    if (n>=200_000) break;
    a=(mul*a+add)%mod;
    n++;
  }
  table+="</table>";
  outputAreaTable.innerHTML=table;

  buttonShowAll.style.display=hasOptional?"":"none";

  /* Generate text */
  let text="";

  text+="<p>";
  if (len==0) {
    text+=language.lcg.resultA;
    text+=" "+n+".";
  } else {
    text+=language.lcg.resultB;
    text+=" "+len;
    text+=language.lcg.resultC;
    text+=" "+len+" ";
    text+=language.lcg.resultD;
  }
  text+="</p>";

  text+="<p>";
  text+=language.lcg.resultInfoA;
  text+=" "+mod+" ";
  text+=language.lcg.resultInfoB;
  text+=" "+mod;
  text+=".";
  if (len>0) {
    text+=" ";
    if (len==mod) {
      text+=language.lcg.resultInfoC;
    } else {
      text+=language.lcg.resultInfoD;
    }
  }
  text+="</p>";
  outputAreaText.innerHTML=text;

  /* Generate chart */
  const arr=[];
  for (let i=0;i<rndNumbers.length-2;i++) arr.push({x: rndNumbers[i]/mod, y: rndNumbers[i+1]/mod});
  chartData.datasets=[{data: arr, backgroundColor: 'red'}];
  chart.update();
}

/**
 * Prepares the layout switcher which will remove the "loading..." text
 * and replace it with the app content.
 */
function startLCG() {
    document.addEventListener('readystatechange',event=>{if (event.target.readyState=="complete") {
      mainContent.style.display="";
      infoLoading.style.display="none";
    }});
  }

/**
 * Initializes the complete web app.
 */
function initLCG() {
  /* Init language */
  initGUILanguage();

  /* Init chart */
  chartData={};
  chartData.datasets=[];
  chart=new Chart(gridCanvas, {
    type: 'scatter',
    data: chartData,
    options: {
      scales: {
        x: {position: 'bottom', min: 0, max: 1, title: {text: "u(n)", display: true}},
        y: {min: 0, max: 1, title: {text: "u(n+1)", display: true}},
      },
      plugins: {legend: {display: false}}
    }
  });

	/* Select color mode */
	let selectedColorMode=localStorage.getItem('selectedColorMode');
	if (selectedColorMode==null) selectedColorMode=(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)?"dark":"light";
	document.documentElement.dataset.bsTheme=selectedColorMode;

  /* Load settings */
  const params=loadSearchStringParameters(["mul","add","mod","a0"]);
  if (params.mul) inputAN1.value=params.mul;
  if (params.add) inputAN.value=params.add;
  if (params.mod) inputMOD.value=params.mod;
  if (params.a0) inputA0.value=params.a0;

	/* Init app  */
  update();

	/* Start */
	startLCG();
}
