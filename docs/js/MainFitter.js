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

export {initFitter}

import {language} from "./Language.js";
import {isDesktopApp} from './Main.js';
import {getFloat} from './NumberTools.js';
import {ContinuousProbabilityDistribution} from './Distribution.js';
import {listDistributions} from './DistributionSetup.js';
import {loadSearchStringParameters} from "./StringTools.js";
import {Chi2Distribution} from "./DistributionChi2.js";

/**
 * Fills in the language strings to the GUI elements.
 */
function initGUILanguage() {
  /* Header */
  appName1.innerHTML=language.fitter.title;
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
  document.getElementsByTagName("h1")[0].innerHTML=language.fitter.title;

  /* Content */
  inputHeader.innerHTML=language.fitter.inputValues;
  inputBodyLoadInfo.innerHTML=language.fitter.inputValuesLoadInfo;
  inputBodyFitInfo.innerHTML=language.fitter.info;
  outputHeader.innerHTML="<b>"+language.fitter.outputHeader+"</b> <small>("+listDistributions.filter(distribution=>distribution.canFit).length+" "+language.fitter.outputHeaderInfo+")</small>";
}

let dragEnterCount=0;

/**
 * Handles drag and drop events for loading input values.
 * @param {Object} ev Drag and drop events
 */
function inputValuesDrag(ev) {
  if (ev.type=='dragenter') {
    inputCard.style.border="3px dashed green";
    dragEnterCount++;
    return;
  }

  if (ev.type=='dragleave') {
    if (dragEnterCount>0) dragEnterCount--;
    if (dragEnterCount>0) return;
    inputCard.style.border="";
    return;
  }

  if (ev.type=='dragover') {
    ev.preventDefault();
    return;
  }

  if (ev.type=='drop') {
    ev.preventDefault();
    dragEnterCount=0;
    inputCard.style.border="";
    if (typeof(ev.dataTransfer)=='undefined' || ev.dataTransfer==null) return;
    if (typeof(ev.dataTransfer.files)=='undefined' || ev.dataTransfer.files.length!=1) return;
    ev.dataTransfer.files[0].text().then(response=>loadInputValues(response));
    return;
  }
}

/**
 * Add histogram information to the fitter input data object.
 * @param {Object} data Fitter input data object
 */
function calcHistogram(data) {
  /* Calculate limits and step wide */
  let x1=Math.floor(data.min);
  if (x1>0 && x1<5 && x2>10) x1=0;
  const x2=Math.ceil(data.max)+1;
  /* const step=(x2-x1<=100)?1:((x2-x1)/100); - makes nicer x-axis values but generates worse fits for small ranges */
  const step=(x2-x1)/99;

  /* Prepare histogram object */
  data.histogram=[];
  let i=0;
  while (true) {
    const x=x1+step*i;
    if (x>x2) break;
    data.histogram.push({x1: x, x2: x+step, n: 0});
    i++;
  }

  let isDiscrete=true;

  /* Calculate histogram */
  for (let value of data.values) {
    if (isDiscrete && value%1!=0) isDiscrete=false;
    const index=Math.floor((value-x1)/step);
    data.histogram[index].n++;
  }

  /* Calculate probabilities */
  for (let i=0;i<data.histogram.length;i++) data.histogram[i].p=data.histogram[i].n/data.count;

  /* Build histogram for discrete values */
  if (isDiscrete) {
    data.histogramDiscrete=Array.from({length: data.max-data.min+1},_=>0);
    for (let value of data.values) data.histogramDiscrete[value-data.min]++;
    for (let i=0;i<data.histogramDiscrete.length;i++) data.histogramDiscrete[i]/=data.count;
  }
}

/**
 * Performs a Kolmogorov-Smirnov adjustment test for sample values which are discrete values.
 * @param {Object} distribution Distribution object to fit the sample values to
 * @param {Object} parameters Parameters object for the parameters for the distribution
 * @param {Array} histogram Histogram of the sample values
 * @returns p-value
 */
function calcKCDiscrete(distribution, parameters, histogram) {
let maxDiff=0;
  let pdf=0;
  for (let i=0;i<histogram.length;i++) {
    pdf+=histogram[i];
    const distPDF=distribution.calcProbability(parameters,i);
    if (pdf>0.9999) break;
    maxDiff=Math.max(maxDiff,Math.abs(pdf-distPDF));
  }
  return Math.min(1,2*Math.exp(-2*maxDiff**2));
}

/**
 * Performs a Chi-squared adjustment test for sample values which are discrete values.
 * @param {Object} distribution Distribution object to fit the sample values to
 * @param {Object} parameters Parameters object for the parameters for the distribution
 * @param {Array} histogram Histogram of the sample values
 * @returns p-value
 */
function calcChiSqrDiscrete(distribution, parameters, histogram) {
  let sumRelDif=0;
	let steps=0;

  for (let i=0;i<histogram.length;i++) {
    const delta=distribution.calcProbability(parameters,i);
		if (delta<=0) continue;
		steps++;
		sumRelDif+=histogram.length*(histogram[i]-delta)**2/delta;
  }

  const chiSquaredDistribution=new Chi2Distribution();
  return 1-chiSquaredDistribution.calcProbability({k: Math.max(steps-1,1)},sumRelDif)[1];
}

/**
 * Performs a Kolmogorov-Smirnov adjustment test for sample values.
 * @param {Object} distribution Distribution object to fit the sample values to
 * @param {Object} parameters Parameters object for the parameters for the distribution
 * @param {Array} histogram Histogram of the sample values
 * @returns p-value
 */
function calcKCContinuous(distribution, parameters, histogram) {
  let maxDiff=0;
  let cdf=0;
  for (let step of histogram) {
    cdf+=step.p;
    const distCDF=distribution.calcProbability(parameters,step.x2)[1];
    if (cdf>0.9999) break;
    maxDiff=Math.max(maxDiff,Math.abs(cdf-distCDF));
  }

  return Math.min(1,2*Math.exp(-2*maxDiff**2));
}

/**
 * Performs a Chi-squared adjustment test for sample values.
 * @param {Object} distribution Distribution object to fit the sample values to
 * @param {Object} parameters Parameters object for the parameters for the distribution
 * @param {Array} histogram Histogram of the sample values
 * @returns p-value
 */
function calcChiSqrContinuous(distribution, parameters, histogram) {
  let sumRelDif=0;
	let steps=0;

  let d1=distribution.calcProbability(parameters,histogram[0].x1)[1];
  const count=histogram.map(step=>step.n).reduce((a,b)=>a+b);
  for (let step of histogram) {
    const d2=distribution.calcProbability(parameters,step.x2)[1];
    const delta=d2-d1;
    if (d2>0.9999) break;
		if (delta<=0) continue;
		steps++;
		sumRelDif+=count*(step.p-delta)**2/delta;
    d1=d2;
  }

  const chiSquaredDistribution=new Chi2Distribution();
  return 1-chiSquaredDistribution.calcProbability({k: Math.max(steps-1,1)},sumRelDif)[1];
}

/**
 * Loads input values into the fitter.
 * @param {String} values Input values as a string (loaded file)
 */
function loadInputValues(values) {
  /* Remove old results */
  outputCard.style.display="none";
  outputBody.innerHTML="";

  setTimeout(()=>{
    /* Preprocess input values */
    values=values.replaceAll("\r\n","\n");
    values=values.replaceAll("\r","\n");
    values=values.split("\n").map(v=>getFloat(v)).filter(v=>v!=null);
    const count=values.length;
    if (count==0) {inputBodyValuesInfo.innerHTML=language.fitter.inputValuesLoadError; return;}

    /* Calculate characteristics */
    const min=values.reduce((a,b)=>Math.min(a,b));
    const max=values.reduce((a,b)=>Math.max(a,b));
    const sum=values.reduce((a,b)=>a+b);
    const sum2=values.reduce((a,b)=>a+b**2);
    const mean=sum/count;
    const std=(count==1)?0:(Math.sqrt(sum2/(count-1)-(sum**2)/count/(count-1)));

    /* Display characteristics */
    const info=[];
    info.push("<strong>"+language.fitter.loadedValues+"</strong>");
    info.push(language.fitter.loadedValuesCount+"="+values.length);
    info.push(language.fitter.loadedValuesMinimum+"="+min.toLocaleString());
    info.push(language.fitter.loadedValuesMaximum+"="+max.toLocaleString());
    info.push(language.fitter.loadedValuesMean+"="+mean.toLocaleString());
    info.push(language.fitter.loadedValuesStandardDeviation+"="+std.toLocaleString());
    inputBodyValuesInfo.innerHTML=info.join("<br>");

    /* Build fitter input object */
    const fitterInput={count: count, min: min, max: max, mean: mean, std: std, values: values};
    calcHistogram(fitterInput);

    /* Calc fit */
    let fits=[];
    let fitsNotTheseValues=[];
    for (let distribution of listDistributions) {
      if (!distribution.canFit) continue;
      const fitterResult=distribution.fitParameters(fitterInput);
      if (fitterResult!=null) {
        fits.push({distribution: distribution, parameters: fitterResult});
      } else {
        fitsNotTheseValues.push(distribution);
      }
    }
    for (let fit of fits) {
      /* Calculate delta */
      fit.distribution.setParameters(fit.parameters);
      let delta=0;
      for (let step of fitterInput.histogram) {
        if (fit.distribution instanceof ContinuousProbabilityDistribution) {
          /* Continuous */
          const cdf1=fit.distribution.calcProbability(fit.parameters,step.x1)[1];
          const cdf2=fit.distribution.calcProbability(fit.parameters,step.x2)[1];
          delta+=((cdf2-cdf1)-step.p)**2;
        } else {
          /* Discrete */
          if (typeof(fitterInput.histogramDiscrete)!='undefined') {
            /* Fit discrete values */
            fitterInput.histogramDiscrete.forEach((y,i)=>{
              const yDist=fit.distribution.calcProbability(fit.parameters,i-fitterInput.min);
              delta+=(y-yDist)**2;
            });
          } else {
            /* Fit general values to discrete distribution */
            let cdf=0;
            for (let i=Math.floor(step.x1);i<=Math.floor(step.x2);i++) {
              let fraction=1;
              if (i<step.x1) fraction=(i+1)-step.x1;
              if (i+1>step.x2) fraction=step.x2-i;
              cdf+=fit.distribution.calcProbability(fit.parameters,i)*fraction;
            }
            delta+=(cdf-step.p)**2;
          }
        }
      }
      fit.delta=delta;
      /* Calculate p value */
      if (fit.distribution instanceof ContinuousProbabilityDistribution || typeof(fitterInput.histogramDiscrete)=='undefined') {
        fit.pKS=calcKCContinuous(fit.distribution,fit.parameters,fitterInput.histogram);
        fit.pChiSqr=calcChiSqrContinuous(fit.distribution,fit.parameters,fitterInput.histogram);
      } else {
        fit.pKS=calcKCDiscrete(fit.distribution,fit.parameters,fitterInput.histogramDiscrete);
        fit.pChiSqr=calcChiSqrDiscrete(fit.distribution,fit.parameters,fitterInput.histogramDiscrete);
      }
    }
    fitsNotTheseValues.push(...fits.filter(f=>isNaN(f.delta) || f.delta>=1_000_000).map(fit=>fit.distribution));
    fits=fits.filter(f=>!isNaN(f.delta) && f.delta<1_000_000);
    fits.sort((f1,f2)=>f1.delta-f2.delta);
    fitsNotTheseValues.sort((d1,d2)=>d1.name>d2.name);

    /* Show results */
    outputCard.style.display="";
    for (let i=0;i<fits.length;i++) addFitOutput(fitterInput, fits[i],i+1);
    for (let i=0;i<fitsNotTheseValues.length;i++) addNoFitOutput(fitsNotTheseValues[i],i+1+fits.length);
  },10);
}

let accordionItemCounter=0;

/**
 * Shows the fitting results for one distribution.
 * @param {Object} input Input data for the fitter
 * @param {Object} fit Fitted distribution
 * @param {Object} nr 1-based number of the fitted distribution
 */
function addFitOutput(input, fit, nr) {
  let info, button;

  const show=(nr==1);
  accordionItemCounter++;

  const item=document.createElement("div");
  item.className="accordion-item";
  outputBody.appendChild(item);

  const header=document.createElement("h2");
  header.className="accordion-header";
  item.appendChild(header);

  button=document.createElement("button");
  button.className="accordion-button"+(show?"":" collapsed");
  button.type="button";
  button.dataset.bsToggle="collapse";
  button.dataset.bsTarget="#accordionItem"+accordionItemCounter;
  button.setAttribute("aria-expanded",show?"true":"false");
  button.setAttribute("aria-controls","accordionItem"+accordionItemCounter);
  button.innerHTML=nr+".&ensp;"+getFitInfo(fit);
  header.appendChild(button);

  const content=document.createElement("div");
  content.id="accordionItem"+accordionItemCounter;
  content.className="accordion-collapse collapse"+(show?" show":"");
  content.dataset.bsParent="#outputBody";
  item.appendChild(content);

  const contentBody=document.createElement("div");
  contentBody.className="accordion-body";
  content.appendChild(contentBody);

  const canvas=document.createElement("canvas");
  contentBody.appendChild(canvas);

  const barData=input.histogram.map(function (record){return {x: (record.x1+record.x2)/2, y: record.p};});

  fit.distribution.setParameters(fit.parameters);
  let lineData;
  if (fit.distribution instanceof ContinuousProbabilityDistribution) {
    lineData=barData.map(function(p) {return {x: p.x, y: fit.distribution.calcProbability(fit.parameters,p.x)[0]};});
  } else {
    lineData=barData.map(function(p) {return {x: p.x, y: fit.distribution.calcProbability(fit.parameters,Math.round(p.x))};});
  }

  const chart=new Chart(canvas,{
    data: {
      labels: barData.map(p=>p.x.toLocaleString()),
      datasets: [{
        type: "bar",
        label: language.fitter.histogram,
        data: barData,
        borderWidth: 2,
        hitRadius: 25,
        borderColor: 'rgb(0,140,79)',
        backgroundColor: 'rgba(0,140,79,0.25)',
        yAxisID: 'y'
      },
      {
        type: "line",
        label: language.fitter.fittedDistribution,
        data: lineData,
        borderWidth: 2,
        hitRadius: 25,
        borderColor: 'rgb(140,28,0)',
        pointRadius: 0,
        yAxisID: 'y2'
      }
    ]
    },
    options: {
      scales: {
        y : {
          title: {display: true, text: language.distributions.infoDiagramProbability+" "+language.fitter.histogram, color: "rgb(0,140,79)"},
          min: 0
        },
        y2 : {
          position: 'right',
          title: {display: true, text: language.distributions.infoDiagramRate+" f(x)", color: "rgb(140,28,0)"},
          min: 0
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
              modifierKey: "ctrl",
            },
            pinch: {
              enabled: true
            },
            drag: {
              enabled: true,
              modifierKey: "ctrl",
            },
            mode: 'xy',
          }
        }
      },
      animation: {duration: 0}
    }
  });

  contentBody.appendChild(info=document.createElement("div"));
  info.className="mt-3";
  info.innerHTML=language.distributions.infoDiagramZoomInfo;

  contentBody.appendChild(info=document.createElement("div"));
  info.className="mt-3";

  /* Reset zoom button */
  info.appendChild(button=document.createElement("button"));
  button.type="button";
  button.className="btn btn-warning btn-sm bi-zoom-out mt-1 me-2 mb-2";
  button.innerHTML=" "+language.distributions.infoDiagramResetZoom;
  button.onclick=()=>chart.resetZoom();

  /* Load to editor button */
  if (!isDesktopApp) {
    info.appendChild(button=document.createElement("button"));
    button.type="button";
    button.className="btn btn-primary btn-sm bi-graph-up mt-1 me-2 mb-2";
    button.innerHTML=" "+language.fitter.openInEditor;
    button.onclick=()=>{
      let distShortName=fit.distribution.constructor.name;
      distShortName=distShortName.substring(0,distShortName.length-"Distribution".length);
      const params=[];
      for (let key in fit.parameters) params.push(key+"="+fit.parameters[key]);
      let mainFile=document.location.pathname;
      mainFile=mainFile.substring(0,mainFile.lastIndexOf("/")+1);
      const url=document.location.protocol+"//"+document.location.host+mainFile+"?distribution="+distShortName+"&"+params.join("&");
      window.open(url,"_blank");
    };
  }

  /* Export diagram */
  const div=document.createElement("div");
  div.className="dropdown";
  div.style.display="inline-block";
  info.appendChild(div);
  div.appendChild(button=document.createElement("button"));
  button.type="button";
  button.className="btn btn-primary btn-sm bi-graph-up mt-1 me-2 mb-2 dropdown-toggle";
  button.dataset.bsToggle="dropdown";
  button.innerHTML=" "+language.distributions.infoDiagramExport;
  const ul=document.createElement("ul");
  ul.className="dropdown-menu";
  div.appendChild(ul);
  let li;
  ul.appendChild(li=document.createElement("li"));
  li.appendChild(button=document.createElement("button"));
  button.type="button";
  button.className="bi-clipboard dropdown-item";
  button.innerHTML=" "+language.distributions.infoDiagramExportCopy;
  button.onclick=()=>{
    if (typeof(ClipboardItem)!="undefined") {
      canvas.toBlob(blob=>navigator.clipboard.write([new ClipboardItem({"image/png": blob})]));
    } else {
      alert(language.distributions.infoDiagramExportCopyError);
    }
  };
  ul.appendChild(li=document.createElement("li"));
  li.appendChild(button=document.createElement("button"));
  button.type="button";
  button.className="bi-download dropdown-item";
  button.innerHTML=" "+language.distributions.infoDiagramExportSave;
  button.onclick=()=>{
    const element=document.createElement("a");
    element.href=canvas.toDataURL("image/png");
    element.download="diagram.png";
    element.click();
  };
}

/**
 * Shows the results for one distribution with no match for the data.
 * @param {Object} distribution Tested distribution
 * @param {Object} nr 1-based number of the distribution
 */
function addNoFitOutput(distribution, nr) {
  let button;

  accordionItemCounter++;

  const item=document.createElement("div");
  item.className="accordion-item";
  outputBody.appendChild(item);

  const header=document.createElement("h2");
  header.className="accordion-header";
  item.appendChild(header);

  button=document.createElement("button");
  button.className="accordion-button collapsed";
  button.type="button";
  button.dataset.bsToggle="collapse";
  button.dataset.bsTarget="#accordionItem"+accordionItemCounter;
  button.setAttribute("aria-expanded","false");
  button.setAttribute("aria-controls","accordionItem"+accordionItemCounter);
  button.innerHTML=nr+".&ensp;"+getFitInfo({distribution: distribution},false);
  header.appendChild(button);
}

/**
 * Generates an information string for the fit.
 * @param {String} Fit result record
 * @param {Boolean} hasFit Is this a fitted distribution?
 * @return Information string
 */
function getFitInfo(fit, hasFit=true) {
  let result="<strong>"+fit.distribution.name+"</strong>";
  if (hasFit) {
    result+="&thinsp;<small>(";
    let firstParameter=true;
    for (let parameter in fit.parameters) {
      if (firstParameter) firstParameter=false; else result+=", ";
      result+=parameter+"="+fit.parameters[parameter].toLocaleString();
    }
    result+=")</small>: &nbsp;<strong><abbr title='"+language.fitter.infoDelta+"'>&Delta;</abbr>="+fit.delta.toLocaleString(undefined, {minimumFractionDigits: 5})+"</strong>";
    if ((typeof(fit.pKS)!='undefined' && fit.pKS>=0) || (typeof(fit.pChiSqr)!='undefined' && fit.pChiSqr>=0)) {
      result+="<small>";
      if (typeof(fit.pKS)!='undefined' && fit.pKS>=0) {
        result+=", &nbsp;";
        if (fit.pKS>=0.99) result+="<span style='color: green'>";
        if (fit.pKS<=0.0) result+="<span style='color: red'>";
        result+="<abbr title='"+language.fitter.infoPValueKS+"'>p(KS)</abbr>="+(fit.pKS*100).toLocaleString(undefined, {maximumFractionDigits: 1})+"%";
        if (fit.pKS>=0.99 || fit.pKS<=0.0) result+="</span>";
      }
      if (typeof(fit.pChiSqr)!='undefined' && fit.pChiSqr>=0) {
        result+=", &nbsp;";
        if (fit.pChiSqr>=0.99) result+="<span style='color: green'>";
        if (fit.pChiSqr<=0.0) result+="<span style='color: red'>";
        result+="<abbr title='"+language.fitter.infoPValueChiSqr+"'>p(&chi;<sup>2</sup>)</abbr>="+(fit.pChiSqr*100).toLocaleString(undefined, {maximumFractionDigits: 1})+"%";
        if (fit.pChiSqr>=0.99 || fit.pChiSqr<=0.0) result+="</span>";
      }
      result+="</small>";
    }
  } else {
    result+="&thinsp;<small>("+language.fitter.outputNoFit+")</small>";
  }
  return result;
}

/**
 * Prepares the layout switcher which will remove the "loading..." text
 * and replace it with the app content.
 */
function startFitter() {
  document.addEventListener('readystatechange',event=>{if (event.target.readyState=="complete") {
    mainContent.style.display="";
    infoLoading.style.display="none";
  }});
}

/**
 * Initializes the complete web app.
 */
function initFitter() {
  /* Select color mode */
  let selectedColorMode=localStorage.getItem('selectedColorMode');
  if (selectedColorMode==null) selectedColorMode=(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)?"dark":"light";
  document.documentElement.dataset.bsTheme=selectedColorMode;

  /* Initializes the GUI language */
  initGUILanguage();

  const params=loadSearchStringParameters(["fromPseudoRandomNumbers"]);
  if (params.fromPseudoRandomNumbers) {
    const data=localStorage.getItem('randomNumbers');
    localStorage.removeItem('randomNumbers');
    if (data!=null) loadInputValues(data);
  }

  /* Input values system */
  inputCard.ondragenter=e=>inputValuesDrag(e);
  inputCard.ondragleave=e=>inputValuesDrag(e);
  inputCard.ondragover=e=>inputValuesDrag(e);
  inputCard.ondrop=e=>inputValuesDrag(e);

  /* Start */
  startFitter();
}
