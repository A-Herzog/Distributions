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

export {initSim}

import {language} from "./Language.js";
import {getDistributionByClassName, getAllDistributionParameterIds} from "./DistributionSetup.js";
import {isDesktopApp} from './Main.js';
import {getFloat} from "./NumberTools.js";

/**
 * Fills in the language strings to the GUI elements.
 */
function initGUILanguage(distribution, title1, title2) {
  /* Header */
  appName1.innerHTML=distribution.name;
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

  /* Upper info area */
  const info=document.createElement("div");
  info.innerHTML=language.GUI.selectDistribution+": <b>"+distribution.nameWithParameters+"</b>";
  infoArea.appendChild(info);
  infoAreaMath.innerHTML=language.distributions.infoDiagramLawOfLargeNumbersInfo;

  /* Charts */
  chart1header.innerHTML=title1;
  chart1info.innerHTML=language.distributions.infoDiagramZoomInfo;
  chart1defaultZoomButton.innerHTML=" "+language.distributions.infoDiagramResetZoom;
  chart2header.innerHTML=title2;
  chart2info.innerHTML=language.distributions.infoDiagramZoomInfo;
  chart2defaultZoomButton.innerHTML=" "+language.distributions.infoDiagramResetZoom;

  /* Control area */
  resetButton.innerHTML=" "+language.distributions.infoDiagramLawOfLargeNumbersControlReset;
  stepButton.innerHTML=" "+language.distributions.infoDiagramLawOfLargeNumbersControlStep;
  playPauseButton.innerHTML=" "+language.distributions.infoDiagramLawOfLargeNumbersControlStart;
}

/**
 * Loads data from the url search string into an object
 * @param {Array} validKeys List of the search string parameters to be loaded
 * @returns Object containing the names of the parameters and the values from the url search string as values
 */
function loadSearchStringParameters(validKeys) {
  const search=window.location.search;
  if (!search.startsWith("?")) return {};
  const data={};
  for (let record of search.substring(1).split("&")) {
    const arr=record.split("=");
    if (arr.length==2 && validKeys.indexOf(arr[0])>=0) data[arr[0]]=arr[1];
  }
  return data;
}

/**
 * Returns data on the information to be displayed based on the url search string values
 * @returns Array containing: Distribution object, object of distribution parameter values, generate pseudo-random numbers (true) or show pdf/cdf (false), number of pseudo-random numbers to be generated
 */
function getDistributionFromSearchString() {
  const validKeys=["distribution"];
  getAllDistributionParameterIds().forEach(entry=>validKeys.push(entry));

  const data=loadSearchStringParameters(validKeys);

  if (typeof(data.distribution)!='string') return null;
  const distribution=getDistributionByClassName(data.distribution+"Distribution");
  if (distribution==null) return null;

  const values={};
  for (let key in data) if (key!="distribution" && key!="random" && key!="count") values[key]=getFloat(data[key]);

  distribution.setParmeterExtern(values);

  return [distribution, values];
}

/**
 * Prepares the layout switcher which will remove the "loading..." text
 * and replace it with the app content.
 */
function startSim() {
  document.addEventListener('readystatechange',event=>{if (event.target.readyState=="complete") {
    mainContent.style.display="";
    infoLoading.style.display="none";
  }});
}

/**
 * Generates an options object for Chart.js with basic settings.
 * @returns Basic chart options object
 */
function getDefaultChartOptions() {
  return {
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
  };
}

/**
 * Generates a pseudo random number
 * @param {Object} distribution Distribution
 * @param {Object} values Distribution parameters
 * @returns Pseudo random number
 */
function generateRandomNumber(distribution, values) {
  if (distribution.discrete) {
    const support=distribution.getDiscreteSupport(values);
    if (typeof(distribution.calculatedCdf)=='undefined') {
      const cdf=[];
      let s=0;
      const cdfDelta=Math.min(0,support[0]);
      for (let k=cdfDelta;k<=support[1];k++) if (k<support[0]) cdf.push(0); else {
        s+=distribution.calcProbability(values,k);
        cdf.push(s);
      }
      distribution.calculatedCdf=cdf;
    }
    const len=distribution.calculatedCdf.length;
    const u=Math.random();
    let m=len-1;
    const cdfDelta=Math.min(0,support[0]);
    for (let i=0;i<len;i++) if (distribution.calculatedCdf[i]>=u) {m=i+cdfDelta; break;}
    return m;
  } else {
    return distribution.getRandomNumber(values);
  }
}

let chart1, chart2;
let count=0;
let lastMeanValues=[];
let histogram=[];
let running=false;
let runTimeout=null;
const continuousHistogramSteps=20;

function doStep(distribution, values) {
  const rnd=generateRandomNumber(distribution,values);
  count++;

  if (count==1) {
    lastMeanValues.push(rnd);
  } else {
    const lastMean=lastMeanValues[lastMeanValues.length-1];
    lastMeanValues.push((lastMean*(count-1)+rnd)/count);
    while (lastMeanValues.length>100) lastMeanValues.shift();
  }
  chart1.data.datasets[chart1.data.datasets.length-1].data=lastMeanValues;
  chart1.update();

  if (distribution.discrete) {
    const support=distribution.getDiscreteSupport(values);
    histogram[rnd-Math.min(0,support[0])]++;
  } else {
    const support=distribution.getDiagramSupport(values);
    let done=false;
    for (let i=0;i<continuousHistogramSteps;i++) {
      const left=support[0]+(support[1]-support[0])*i/continuousHistogramSteps;
      const right=support[0]+(support[1]-support[0])*(i+1)/continuousHistogramSteps;
      if (rnd>=left && rnd<right) {histogram[i]++; done=true; break;}
    }
    if (!done) histogram[histogram.length-1]++;
  }
  chart2.data.datasets[1].data=histogram.map(v=>v/count);
  chart2.update();

  const mean=lastMeanValues[lastMeanValues.length-1];
  const info=[];
  info.push(language.distributions.infoDiagramLawOfLargeNumbersInfoNewestRandomNumber+"="+rnd.toLocaleString());
  info.push(language.distributions.infoDiagramLawOfLargeNumbersInfoSampleValues+"="+count);
  if (distribution.mean!=null) {
    info.push(language.distributions.infoDiagramLawOfLargeNumbersInfoExpectedValueOfDistribution+"="+distribution.mean.toLocaleString());
    info.push(language.distributions.infoDiagramLawOfLargeNumbersInfoArithmeticMeanOfTheSampleValues+"="+mean.toLocaleString());
    if (distribution.mean!=0) {
      info.push(language.distributions.infoDiagramLawOfLargeNumbersInfoRelativeDeviationMeanExpectedValue+"="+((mean-distribution.mean)/distribution.mean*100).toLocaleString()+"%");
    }
  }
  infoLine.innerHTML=info.join("<br>");
}

function initStepTimeout(distribution, values) {
  runTimeout=setTimeout(()=>{
    doStep(distribution,values);
    initStepTimeout(distribution,values);
  },75);
}

function doStartStop(distribution, values) {
  if (running) {
    /* Stopp */
    if (runTimeout!=null) {
      clearTimeout(runTimeout);
      runTimeout=null;
    }
    playPauseButton.innerHTML=" "+language.distributions.infoDiagramLawOfLargeNumbersControlStart;
    playPauseButton.classList.remove("bi-pause");
    playPauseButton.classList.add("bi-play");
    stepButton.disabled=false;
  } else {
    /* Start */
    initStepTimeout(distribution,values);
    playPauseButton.innerHTML=" "+language.distributions.infoDiagramLawOfLargeNumbersControlStop;
    playPauseButton.classList.remove("bi-play");
    playPauseButton.classList.add("bi-pause");
    stepButton.disabled=true;
  }
  running=!running;
}

/**
 * Initializes the complete web app.
 */
function initSim() {
  let distribution, values;
  [distribution, values]=getDistributionFromSearchString();
  if (distribution==null) return;

  /* Select color mode */
  let selectedColorMode=localStorage.getItem('selectedColorMode');
  if (selectedColorMode==null) selectedColorMode=(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)?"dark":"light";
  document.documentElement.dataset.bsTheme=selectedColorMode;

  /* Init language */
  initGUILanguage(distribution,language.distributions.infoDiagramLawOfLargeNumbersHeadingMeanExpectedValue,language.distributions.infoDiagramLawOfLargeNumbersHeadingDensitySample);

  /* Init chart 1 data */
  const chart1options=getDefaultChartOptions();
  chart1options.scales={x: {display: false}, y: {title: {display: true, text: language.distributions.infoDiagramLawOfLargeNumbersScaleExpectedValueMean}}};
  const datasets=[];
  if (distribution.mean!=null) {
    const mean=distribution.mean;
    if (distribution.discrete) {
      const support=distribution.getDiscreteSupport(values);
      chart1options.scales.y.min=Math.max(mean*0.5,support[0]);
      chart1options.scales.y.max=Math.min(mean*1.5,support[1]);
    } else {
      const support=distribution.getDiagramSupport();
      chart1options.scales.y.min=Math.max(mean*0.5,support[0]);
      chart1options.scales.y.max=Math.min(mean*1.5,support[1]);
    }
    datasets.push({label: language.distributions.infoDiagramLawOfLargeNumbersDatasetExpectedValue, data: Array.from({length: 100},()=>mean), type: "line", pointRadius: 0, hitRadius: 25, borderColor: "green"});
  }
  datasets.push({label: language.distributions.infoDiagramLawOfLargeNumbersDatasetMean, type: "line", pointRadius: 0, hitRadius: 25, borderColor: "red"});
  const chart1data={
    labels: Array.from({length: 100},(_,i)=>i),
    datasets: datasets
  };

  /* Init chart 2 data */
  const chart2options=getDefaultChartOptions();
  chart2options.scales={x: {stacked: true, title: {display: true, text: "x"},}, y: {min: 0, title: {display: true, text: language.distributions.infoDiagramLawOfLargeNumbersScalePercentage}}};
  const chart2data={};

  if (distribution.discrete) {
    const support=distribution.getDiscreteSupport(values);
    const labels=[];
    const pdf=[];
    histogram=[];
    for (let i=Math.min(0,support[0]);i<=support[1];i++) {
      labels.push(i);
      if (i<support[0]) pdf.push(0); else pdf.push(distribution.calcProbability(values,i));
      histogram.push(0);
    }
    const maxPdf=pdf.reduce((a,b)=>Math.max(a,b));
    chart2options.scales.y.max=maxPdf*1.5;
    chart2data.labels=labels;
    chart2data.datasets=[
      {label: language.distributions.infoDiagramLawOfLargeNumbersDatasetDiscreteDensity, data: pdf, type: "bar", hitRadius: 25, borderColor: "green", borderWidth: 2, backgroundColor: "rgba(0,127,0,0.25)"},
      {label: language.distributions.infoDiagramLawOfLargeNumbersDatasetDiscreteSample, data: histogram, type: "bar", hitRadius: 25, borderColor: "red", backgroundColor: "red", barThickness: 15}
    ];
  } else {
    const support=distribution.getDiagramSupport(values);
    const labels=[];
    const pdf=[];
    histogram=[];
    let lastCDF=0;
    for (let i=0;i<continuousHistogramSteps;i++) {
      const left=support[0]+(support[1]-support[0])*i/continuousHistogramSteps;
      const right=support[0]+(support[1]-support[0])*(i+1)/continuousHistogramSteps;
      const p=distribution.calcProbability(values,right);
      labels.push(((left+right)/2).toLocaleString());
      pdf.push(p[1]-lastCDF);
      histogram.push(0);
      lastCDF=p[1];
    }
    const maxPdf=pdf.reduce((a,b)=>Math.max(a,b));
    chart2options.scales.y.max=maxPdf*1.5;
    chart2data.labels=labels;
        chart2data.datasets=[
      {label: language.distributions.infoDiagramLawOfLargeNumbersDatasetContinuousDensity+" ("+language.distributions.infoDiagramLawOfLargeNumbersDatasetContinuousDensityHistogramBarWidth+":"+((support[1]-support[0])/continuousHistogramSteps).toLocaleString()+")", data: pdf, type: "bar", hitRadius: 25, borderColor: "green", borderWidth: 2, backgroundColor: "rgba(0,127,0,0.25)"},
      {label: language.distributions.infoDiagramLawOfLargeNumbersDatasetContinuousSample, data: histogram, type: "bar", hitRadius: 25, borderColor: "red", backgroundColor: "red", barThickness: 7}
    ];
  }

  /* Init charts */
  chart1=new Chart(chart1canvas,{data: chart1data, options: chart1options});
  chart2=new Chart(chart2canvas,{data: chart2data, options: chart2options});
  chart1defaultZoomButton.onclick=()=>chart1.resetZoom();
  chart2defaultZoomButton.onclick=()=>chart2.resetZoom();

  /* Init control area */
  resetButton.onclick=()=>{
    if (running) doStartStop(distribution,values);
    count=0;
    lastMeanValues=[];
    histogram=histogram.map(v=>0);
    chart1.data.datasets[chart1.data.datasets.length-1].data=[];
    chart1.update();
    chart2.data.datasets[1].data=[];
    chart2.update();
    infoLine.innerHTML="";
  };
  stepButton.onclick=()=>{
    if (!running) doStep(distribution,values);
  };
  playPauseButton.onclick=()=>{
    doStartStop(distribution,values);
  };

  /* Start */
  startSim();
}