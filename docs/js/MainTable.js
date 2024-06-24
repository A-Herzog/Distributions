/*
Copyright 2023 Alexander Herzog

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

export {initTable}

import {language} from "./Language.js";
import {getDistributionByClassName, getAllDistributionParameterIds} from "./DistributionSetup.js";
import {isDesktopApp} from './Main.js';
import {getFloat, getPositiveInt, formatNumber} from "./NumberTools.js";
import {loadSearchStringParameters} from "./StringTools.js";

/**
 * Fills in the language strings to the GUI elements.
 */
function initGUILanguage(distName, mainTitle) {
  /* Header */
  appName1.innerHTML=distName;
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
  document.getElementsByTagName("h1")[0].innerHTML=mainTitle;

  /* Range editor */
  rangeStepLabel.innerHTML=language.distributions.infoDiagramShowValuesStep+":=";

  /* Table */
  copyButton.innerHTML=" "+language.distributions.infoDiagramCopyValues;
  copyButton.onclick=copyTable;
  saveButton.innerHTML=" "+language.distributions.infoDiagramSaveValues;
  saveButton.onclick=saveTable;
}

let clipboardData="";

/**
 * Copies the table content to clipboard.
 */
function copyTable() {
  navigator.clipboard.writeText(clipboardData);
}

/**
 * Saves the table content to a file.
 */
function saveTable() {
  if (isDesktopApp) {
    Neutralino.os.showSaveDialog(language.distributions.infoDiagramSaveValues, {defaultPath: 'table.txt', filters: [
      {name: language.distributions.infoDiagramSaveValuesTextFiles+' (*.txt)', extensions: ['txt']}
    ]}).then(file=>{
      file=file.trim();
      if (file=='') return;
      if (!file.toLocaleLowerCase().endsWith(".txt")) file+=".txt";
      Neutralino.filesystem.writeFile(file,clipboardData);
    });
  } else {
    const element=document.createElement('a');
    element.setAttribute('href','data:text/plain;charset=utf-8,'+encodeURIComponent(clipboardData));
    element.setAttribute('download','table.txt');
    element.style.display='none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
}

/**
 * Returns data on the information to be displayed based on the url search string values
 * @returns Array containing: Distribution object, object of distribution parameter values, generate pseudo-random numbers (true) or show pdf/cdf (false), number of pseudo-random numbers to be generated
 */
function getDistributionFromSearchString() {
  const validKeys=["distribution","random","count"];
  getAllDistributionParameterIds().forEach(entry=>validKeys.push(entry));

  const data=loadSearchStringParameters(validKeys);

  if (typeof(data.distribution)!='string') return null;
  const distribution=getDistributionByClassName(data.distribution+"Distribution");
  if (distribution==null) return null;

  const values={};
  for (let key in data) if (key!="distribution" && key!="random" && key!="count") values[key]=getFloat(data[key]);

  distribution.setParmeterExtern(values);

  let count=0;
  if (typeof(data.count)!='undefined') count=getPositiveInt(data.count);
  if (count==null || count<100 || count>1_000_000) count=10_000;
  return [distribution, values, typeof(data.random)!='undefined', count];
}

/**
 * Generated a html table element
 * @param {Object} parent Parent html element
 * @param {Array} cols List of the column titles for the table (entries can be strings or arrays; in case of an array the first entry of the array is used as display title and the second as export title)
 * @param {Boolean} longTable Add "table-sm" to css class list?
 * @returns Array of already to parent added html table element und tbody element
 */
function buildTableElement(parent, cols, longTable=false, exportTitle=true) {
  const table=document.createElement("table");
  table.className="table table-striped border mt-3"+(longTable?" table-sm":"");

  let tr, th;

  const thead=document.createElement("thead");
  table.appendChild(thead);

  thead.appendChild(tr=document.createElement("tr"));

  for (let cell of cols) {
    tr.appendChild(th=document.createElement("th"));
    if (typeof(cell)=='string') th.innerHTML=cell; else th.innerHTML=cell[0];
  }

  if (exportTitle) {
    clipboardData=cols.map(cell=>(typeof(cell)=='string')?cell:cell[1]).join("\t")+"\n";
  } else {
    clipboardData="";
  }

  const tbody=document.createElement("tbody");
  table.appendChild(tbody);

  if (parent!=null) parent.appendChild(table);

  return [table, tbody];
}

/**
 * Adds a pdf/cdf row to a table
 * @param {Object} tbody Table body element
 * @param {Number} x Parameter x
 * @param {Number} f f(x) value
 * @param {Number} F F(x) value
 */
function addRow(tbody, x, f, F) {
  let tr, td;

  const xStr=formatNumber(x);
  const fStr=formatNumber(f,8);
  const FStr=formatNumber(F,8);
  tbody.appendChild(tr=document.createElement("tr"));
  tr.appendChild(td=document.createElement("td"));
  td.innerHTML=xStr;
  tr.appendChild(td=document.createElement("td"));
  td.innerHTML=fStr;
  tr.appendChild(td=document.createElement("td"));
  td.innerHTML=FStr;
  clipboardData+=xStr+"\t"+fStr+"\t"+FStr+"\n";
}

/**
 * Adds a simple row containing only one column to a table
 * @param {Object} tbody Table body element
 * @param {Number} value Value to be added in a new row
 * @param {Boolean} discrete Is the value to be converted to a string in the simple way (true) or by using at least 8 digits (false)
 */
function addSimpleRow(tbody, value, discrete) {
  let tr, td;

  let valueStr;
  if (discrete) valueStr=formatNumber(value); else valueStr=formatNumber(value,8);
  tbody.appendChild(tr=document.createElement("tr"));
  tr.appendChild(td=document.createElement("td"));
  td.innerHTML=valueStr;
  clipboardData+=valueStr+"\n";
}

/**
 * Generates a pdf/cdf table for a discrete probability distribution
 * @param {DiscreteProbabilityDistribution} distribution Probability distribution to be used
 * @param {Object} values Parameter values
 * @param {Object} parent Html parent element for the table
 */
function initDiscreteTable(distribution, values, parent) {
  let table, tbody;
  [table, tbody]=buildTableElement(parent,["k","P(X=k)",["P(X&le;k)","P(X<=k)"]]);

  const support=distribution.getDiscreteSupport(values);

  let sum=0;
  for (let k=support[0];k<=support[1];k++) {
    const p=distribution.calcProbability(values,k);
    sum+=p;
    addRow(tbody,k,p,sum);
  }
}

/**
 * Generates a pdf/cdf table for a continuous probability distribution
 * @param {ContinuousProbabilityDistribution} distribution Probability distribution to be used
 * @param {Object} values Parameter values
 * @param {Object} parent Html parent element for the table
 */
function initContinuousTable(distribution, values, min, max, step, parent) {
  let table, tbody;
  [table, tbody]=buildTableElement(parent,["x","f(x)","F(x)"]);

  for (let x=min;x<=max;x+=step) {
    const p=distribution.calcProbability(values,x);
    addRow(tbody,x,p[0],p[1]);
  }
}

/**
 * Updates the continuous probability distribution pdf/cdf table after a range update
 * @param {Distribution} distribution Probability distribution to be used
 * @param {Object} values Parameter values
 * @param {Object} parent Html parent element for the table
 */
function rangeChanged(distribution, values, parent) {
  const min=getFloat(rangeMin.value);
  const max=getFloat(rangeMax.value);
  const step=getFloat(rangeStep.value);

  let ok=true;

  if (min==null) {
    rangeMin.classList.add("is-invalid");
    ok=false;
  } else {
    rangeMin.classList.remove("is-invalid");
  }

  if (max==null || (min!=null && max<=min)) {
    rangeMax.classList.add("is-invalid");
    ok=false;
  } else {
    rangeMax.classList.remove("is-invalid");
  }

  if (step==null || step<=0) {
    rangeStep.classList.add("is-invalid");
    ok=false;
  } else {
    rangeStep.classList.remove("is-invalid");
  }

  parent.innerHTML="";

  if (!ok) return;

  initContinuousTable(distribution,values,min,max,step,parent);
}

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
  const permaLink=document.createElement("a");
  permaLinkDiv.appendChild(permaLink);
  permaLink.innerHTML=language.GUI.permaLink;
  permaLink.href=document.location;
}

/**
 * Generates the info / setup area for the pseudo-random numbers viewer
 * @param {Object} parent Parent html element
 * @param {Array} info Info lines to be output
 * @param {Number} currentCount Current number of generated pseudo-random numbers
 */
function buildRandomNumbersInfoArea(parent, info, currentCount) {
  let span;

  /* Reload button */

  const buttonGroup=document.createElement("div");
  buttonGroup.className="btn-group";
  buttonGroup.style.float="right";
  parent.appendChild(buttonGroup);

  const button=document.createElement("button");
  button.className="btn btn-warning btn-sm bi-arrow-clockwise";
  button.type="button";
  button.title=" "+language.distributions.infoDiagramGenerateRandomNumbersGenerateNew;
  button.onclick=()=>randomNumbersReload(currentCount);
  buttonGroup.appendChild(button);

  const spanOuter=document.createElement("span");
  button.appendChild(spanOuter);
  spanOuter.className="menuButtonTitle";

  spanOuter.appendChild(span=document.createElement("span"));
  span.className="menuButtonTitleShort";
  span.innerHTML=language.distributions.infoDiagramGenerateRandomNumbersGenerateNewShort;

  spanOuter.appendChild(span=document.createElement("span"));
  span.className="menuButtonTitleLong";
  span.innerHTML=language.distributions.infoDiagramGenerateRandomNumbersGenerateNew;

  const dropdown=document.createElement("button");
  dropdown.className="btn btn-warning btn-sm dropdown-toggle dropdown-toggle-split";
  dropdown.type="button";
  dropdown.dataset.bsToggle="dropdown";
  buttonGroup.appendChild(dropdown);

  const ul=document.createElement("ul");
  ul.className="dropdown-menu";
  buttonGroup.appendChild(ul);

  let options=[100,1000,10_000,100_000,200_000];

  for (let option of options) {
    const li=document.createElement("li");
    ul.appendChild(li);
    const a=document.createElement("a");
    li.appendChild(a);
    a.className="dropdown-item";
    a.innerHTML=((option==currentCount)?"<b>":"")+formatNumber(option)+((option==currentCount)?"</b>":"");
    a.style.cursor="pointer";
    a.onclick=()=>randomNumbersReload(option);
  }

  /* Info text */

  const infoText=info.map(line=>{
    const info=(line.length<3 || typeof(line[2])=='undefined' || line[2]==null || isNaN(line[2]))?"":(" <small class='text-secondary'>("+language.distributions.infoDiagramGenerateRandomNumbersByDistribution+": "+formatNumber(line[2])+")</small>");
    return line[0]+": <b>"+formatNumber(line[1],5)+"</b>"+info;
  }).join("<br>");

  const infoTextDiv=document.createElement("div");
  infoTextDiv.innerHTML=infoText;
  parent.appendChild(infoTextDiv);

  addPermaLink(parent);
}

/**
 * Generates new pseudo-random numbers.
 * @param {Number} newCount New number of pseudo-random numbers to be generated
  */
function randomNumbersReload(newCount) {
  const search=document.location.search;
  if (!search.startsWith("?")) return;
  const data=search.substring(1).split("&").map(entry=>entry.split("=")).filter(entry=>entry.length==2).filter(entry=>entry[0]!='count');
  data.push(["count",""+newCount]);
  const newSearch="?"+data.map(entry=>entry[0]+"="+entry[1]).join("&");
  document.location.search=newSearch;
}

/**
 * Generates the pseudo-random numbers html output for a discrete probability distribution.
 * @param {DiscreteProbabilityDistribution} distribution Probability distribution for which pseudo-random numbers are to be generated
 * @param {Object} values Parameters of the probability distribution
 * @param {Number} count Number of pseudo-random numbers to be generated
 * @param {Object} infoArea Parent html element for the info/setup area
 * @param {Object} tableArea Parent html element for the results table
 */
function generateDiscreteRandomNumbers(distribution, values, count, infoArea, tableArea) {
  const support=distribution.getDiscreteSupport(values);
  const cdf=[];
  let s=0;
  const cdfDelta=Math.min(0,support[0]);
  for (let k=cdfDelta;k<=support[1];k++) if (k<support[0]) cdf.push(0); else {
    s+=distribution.calcProbability(values,k);
    cdf.push(s);
  }

  let table, tbody;
  [table, tbody]=buildTableElement(null,[language.distributions.infoDiagramGenerateRandomNumbersTitle],true,false);

  let min=Number.MAX_VALUE;
  let max=-Number.MAX_VALUE;
  let sum=0;
  let sum2=0;
  const len=cdf.length;
  for (let i=0;i<count;i++) {
    const u=Math.random();
    let m=len-1;
    for (let i=0;i<len;i++) if (cdf[i]>=u) {m=i+cdfDelta; break;}
    if (m<min) min=m;
    if (m>max) max=m;
    addSimpleRow(tbody,m,true);
    sum+=m;
    sum2+=m**2;
  }

  const distMean=(distribution.mean==null)?null:distribution.mean;
  const distStd=(distribution.variance==null)?null:Math.sqrt(distribution.variance);
  const info=[];
  info.push([language.GUI.selectDistribution,distribution.nameWithParameters]);
  info.push([language.distributions.infoDiagramGenerateRandomNumbersCount,count]);
  info.push([language.distributions.infoDiagramGenerateRandomNumbersMean,sum/count,distMean]);
  info.push([language.distributions.infoDiagramGenerateRandomNumbersStd,Math.sqrt(sum2/(count-1)-(sum**2)/count/(count-1)),distStd]);
  info.push([language.distributions.infoDiagramGenerateRandomNumbersMin,min]);
  info.push([language.distributions.infoDiagramGenerateRandomNumbersMax,max]);
  buildRandomNumbersInfoArea(infoArea,info,count);

  tableArea.appendChild(table);
}

/**
 * Generates the pseudo-random numbers html output for a continuous probability distribution.
 * @param {ContinuousProbabilityDistribution} distribution Probability distribution for which pseudo-random numbers are to be generated
 * @param {Object} values Parameters of the probability distribution
 * @param {Number} count Number of pseudo-random numbers to be generated
 * @param {Object} infoArea Parent html element for the info/setup area
 * @param {Object} tableArea Parent html element for the results table
 */
function generateContinuousRandomNumbers(distribution, values, count, infoArea, tableArea) {
  let table, tbody;
  [table, tbody]=buildTableElement(null,[language.distributions.infoDiagramGenerateRandomNumbersTitle],true,false);

  let min=Number.MAX_VALUE;
  let max=-Number.MAX_VALUE;
  let sum=0;
  let sum2=0;
  for (let i=0;i<count;i++) {
    const rnd=distribution.getRandomNumber(values);
    if (rnd<min) min=rnd;
    if (rnd>max) max=rnd;
    addSimpleRow(tbody,rnd,true);
    sum+=rnd;
    sum2+=rnd**2;
  }

  const distMean=(distribution.mean==null)?null:distribution.mean;
  const distStd=(distribution.variance==null)?null:Math.sqrt(distribution.variance);
  const info=[];
  info.push([language.GUI.selectDistribution,distribution.nameWithParameters]);
  info.push([language.distributions.infoDiagramGenerateRandomNumbersCount,count]);
  info.push([language.distributions.infoDiagramGenerateRandomNumbersMean,sum/count,distMean]);
  info.push([language.distributions.infoDiagramGenerateRandomNumbersStd,Math.sqrt(sum2/(count-1)-(sum**2)/count/(count-1)),distStd]);
  info.push([language.distributions.infoDiagramGenerateRandomNumbersMin,min]);
  info.push([language.distributions.infoDiagramGenerateRandomNumbersMax,max]);
  buildRandomNumbersInfoArea(infoArea,info,count);

  tableArea.appendChild(table);
}

/**
 * Prepares the layout switcher which will remove the "loading..." text
 * and replace it with the app content.
 */
function startTable() {
  document.addEventListener('readystatechange',event=>{if (event.target.readyState=="complete") {
    mainContent.style.display="";
    infoLoading.style.display="none";
  }});
}

/**
 * Initializes the complete web app.
 */
function initTable() {
  let distribution, values, rndMode, rndCount;
  [distribution,values,rndMode,rndCount]=getDistributionFromSearchString();
  if (distribution==null) return;

  /* Select color mode */
  let selectedColorMode=localStorage.getItem('selectedColorMode');
  if (selectedColorMode==null) selectedColorMode=(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)?"dark":"light";
  document.documentElement.dataset.bsTheme=selectedColorMode;

  if (rndMode) {
    /* Generate random numbers */
    initGUILanguage(distribution.name,language.distributions.infoDiagramGenerateRandomNumbersTitle);
    if (distribution.discrete) {
      generateDiscreteRandomNumbers(distribution,values,rndCount,infoArea,tableArea);
    } else {
      generateContinuousRandomNumbers(distribution,values,rndCount,infoArea,tableArea);
    }
  } else {
    /* Show PDF and CDF table */
    initGUILanguage(distribution.name,language.distributions.infoDiagramTable);
    const info=document.createElement("div");
    info.innerHTML=language.GUI.selectDistribution+": <b>"+distribution.nameWithParameters+"</b>";
    infoArea.appendChild(info);
    addPermaLink(infoArea);
    if (distribution.discrete) {
      initDiscreteTable(distribution,values,tableArea);
    } else {
      rangeEdit.style.display="";
      rangeMin.onkeyup=()=>rangeChanged(distribution,values,tableArea);
      rangeMin.change=()=>rangeChanged(distribution,values,tableArea);
      rangeMax.onkeyup=()=>rangeChanged(distribution,values,tableArea);
      rangeMax.change=()=>rangeChanged(distribution,values,tableArea);
      rangeStep.onkeyup=()=>rangeChanged(distribution,values,tableArea);
      rangeStep.change=()=>rangeChanged(distribution,values,tableArea);
      rangeChanged(distribution,values,tableArea);
    }
  }
  startTable();
}