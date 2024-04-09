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
import {getFloat, getInt} from "./NumberTools.js";

/**
 * Fills in the language strings to the GUI elements.
 */
function initGUILanguage(distribution, mainTitle, infoText, infoWikipedia, title1, title2) {
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

  /* Title */
  document.getElementsByTagName("h1")[0].innerHTML=mainTitle;

  /* Upper info area */
  const info=document.createElement("div");
  info.innerHTML=language.GUI.selectDistribution+": <b>"+distribution.nameWithParameters+"</b>";
  infoArea.appendChild(info);
  infoAreaMath.innerHTML=infoText+"<br><a href=\""+infoWikipedia+"\" target=\"_blank\">"+language.distributions.infoPropertiesWikipediaLink+"</a>";

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
  const globalValidKeys=["distribution","mode"];
  const validKeys=[...globalValidKeys];
  getAllDistributionParameterIds().forEach(entry=>validKeys.push(entry));

  const data=loadSearchStringParameters(validKeys);

  if (typeof(data.distribution)!='string') return [null, null, 0];
  const distribution=getDistributionByClassName(data.distribution+"Distribution");
  if (distribution==null) return [null, null, 0];

  let mode=0;
  if (typeof(data.mode)=='string') {
    mode=getInt(data.mode);
    if (mode==null) mode=0;
  }

  const values={};
  for (let key in data) if (globalValidKeys.indexOf(key)<0) values[key]=getFloat(data[key]);
  distribution.setParmeterExtern(values);

  return [distribution, values, mode];
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
let sum=0;
let scaledSum=0;
let scaledSum2=0;
let lastMeanValues=[];
let histogram=[];
let histogram2=[];
let running=false;
let runTimeout=null;
const continuousHistogramSteps=20;

function doStepLawOfLargeNumbers(distribution, values) {
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
  return info.join("<br>");
}

function doStepCentralLimitTheorem(distribution, values) {
  const support=(distribution.discrete)?distribution.getDiscreteSupport(values):distribution.getDiagramSupport(values);

  const n=1000;
  let s=0;
  const mean=distribution.mean;
  const sd=Math.sqrt(distribution.variance);
  if (sd>0) for (let i=0;i<n;i++) {
    const r=generateRandomNumber(distribution,values);
    count++;
    sum+=r;
    if (distribution.discrete) {
      histogram[r-Math.min(0,support[0])]++;
    } else {
      let done=false;
      for (let i=0;i<continuousHistogramSteps;i++) {
        const left=support[0]+(support[1]-support[0])*i/continuousHistogramSteps;
        const right=support[0]+(support[1]-support[0])*(i+1)/continuousHistogramSteps;
        if (r>=left && r<right) {histogram[i]++; done=true; break;}
      }
      if (!done) histogram[histogram.length-1]++;
    }
    s+=(r-mean)/sd;
  }
  const rnd=s/Math.sqrt(n);
  scaledSum+=rnd;
  scaledSum2+=(rnd*rnd);

  chart1.data.datasets[0].data=histogram.map(v=>v/count);
  chart1.update();

  if (sd>0) {
    let scaled=rnd;
    if (scaled<-3) scaled=-3;
    if (scaled>3) scaled=3;
    histogram2[Math.round((scaled+3)*5)]++;
    const maxValue=histogram2.reduce((x,y)=>Math.max(x,y));
    const factor=1/Math.sqrt(2*Math.PI)*0.95; /* 0.95: Do not use full available hight, since each bar covers some x range and therefore an exact hight comparison with max(f(x)) is not valid. */
    chart2.data.datasets[1].data=histogram2.map(v=>v/maxValue*factor);
    chart2.update();
  }

  const info=[];
  info.push(language.distributions.infoDiagramCentralLimitTheoremNewestParialSum+"="+rnd.toLocaleString());
  info.push(language.distributions.infoDiagramLawOfLargeNumbersInfoSampleValues+"="+count);
  info.push(language.distributions.infoDiagramCentralLimitTheoremValuesPerPartialSum+"="+n);
  info.push(language.distributions.infoDiagramCentralLimitTheoremNumberOfPartialSums+"="+(count/n));
  info.push(language.distributions.infoDiagramCentralLimitTheoremMeanOfSample+"="+(sum/count).toLocaleString());
  const EX=(scaledSum/count*n);
  const EX2=(scaledSum2/count*n);
  info.push(language.distributions.infoDiagramCentralLimitTheoremMeanOfPartialSums+"="+EX.toLocaleString());
  info.push(language.distributions.infoDiagramCentralLimitTheoremVarianceOfPartialSums+"="+(EX2-EX**2).toLocaleString());

  return info.join("<br>");
}

function doStep(distribution, values, mode) {
  let info;
  switch (mode) {
    case 0:
      info=doStepLawOfLargeNumbers(distribution,values);
      break;
    case 1:
    info=doStepCentralLimitTheorem(distribution,values);
      break;
  }

  infoLine.innerHTML=info;
}

function initStepTimeout(distribution, values, mode) {
  const delay=(mode==0)?75:10;
  runTimeout=setTimeout(()=>{
    doStep(distribution,values,mode);
    initStepTimeout(distribution,values,mode);
  },delay);
}

function doStartStop(distribution, values, mode) {
  if (running) {
    /* Stop */
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
    initStepTimeout(distribution,values,mode);
    playPauseButton.innerHTML=" "+language.distributions.infoDiagramLawOfLargeNumbersControlStop;
    playPauseButton.classList.remove("bi-play");
    playPauseButton.classList.add("bi-pause");
    stepButton.disabled=true;
  }
  running=!running;
}

function initCharts(distribution, values, mode, chart1data, chart1options, chart2data, chart2options, resetCallback)  {
  /* Init charts */
  chart1=new Chart(chart1canvas,{data: chart1data, options: chart1options});
  chart2=new Chart(chart2canvas,{data: chart2data, options: chart2options});
  chart1defaultZoomButton.onclick=()=>chart1.resetZoom();
  chart2defaultZoomButton.onclick=()=>chart2.resetZoom();

  /* Init control area */
  resetButton.onclick=()=>{
    if (running) doStartStop(distribution,values,mode);
    resetCallback();
    infoLine.innerHTML="";
  };
  stepButton.onclick=()=>{
    if (!running) doStep(distribution,values,mode);
  };
  playPauseButton.onclick=()=>{
    doStartStop(distribution,values,mode);
  };

}

function initLawOfLargeNumbers(distribution, values) {
  /* Init language */
  initGUILanguage(distribution,language.distributions.infoDiagramLawOfLargeNumbers,language.distributions.infoDiagramLawOfLargeNumbersInfo,language.distributions.infoDiagramLawOfLargeNumbersWikipedia,language.distributions.infoDiagramLawOfLargeNumbersHeadingMeanExpectedValue,language.distributions.infoDiagramLawOfLargeNumbersHeadingDensitySample);

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

  initCharts(distribution,values,0,chart1data,chart1options,chart2data,chart2options,()=>{
    count=0;
    lastMeanValues=[];
    histogram=histogram.map(v=>0);
    chart1.data.datasets[chart1.data.datasets.length-1].data=[];
    chart1.update();
    chart2.data.datasets[1].data=[];
    chart2.update();
  });
}

function initCentralLimitTheorem(distribution, values) {
  /* Init language */
  initGUILanguage(distribution,language.distributions.infoDiagramCentralLimitTheorem,language.distributions.infoDiagramCentralLimitTheoremInfo,language.distributions.infoDiagramCentralLimitTheoremWikipedia,language.distributions.infoDiagramCentralLimitTheoremHeadingSample,language.distributions.infoDiagramCentralLimitTheoremHeadingStandardNormalDistribution);

  /* Init chart 1 data */
  const chart1options=getDefaultChartOptions();
  chart1options.scales={x: {title: {display: true, text: "x"},}, y: {min: 0, title: {display: true, text: language.distributions.infoDiagramLawOfLargeNumbersScalePercentage}}};
  const chart1data={};

  if (distribution.discrete) {
    const support=distribution.getDiscreteSupport(values);
    const labels=[];
    histogram=[];
    for (let i=Math.min(0,support[0]);i<=support[1];i++) {
      labels.push(i);
      histogram.push(0);
    }
    chart1data.labels=labels;
    chart1data.datasets=[
      {label: language.distributions.infoDiagramLawOfLargeNumbersDatasetDiscreteSample, data: histogram, type: "bar", hitRadius: 25, borderColor: "green", borderWidth: 2, backgroundColor: "rgba(0,127,0,0.25)"},
    ];
  } else {
    const support=distribution.getDiagramSupport(values);
    const labels=[];
    histogram=[];
    for (let i=0;i<continuousHistogramSteps;i++) {
      const left=support[0]+(support[1]-support[0])*i/continuousHistogramSteps;
      const right=support[0]+(support[1]-support[0])*(i+1)/continuousHistogramSteps;
      labels.push(((left+right)/2).toLocaleString());
      histogram.push(0);
    }
    chart1data.labels=labels;
    chart1data.datasets=[
      {label: language.distributions.infoDiagramLawOfLargeNumbersDatasetContinuousSample+" ("+language.distributions.infoDiagramLawOfLargeNumbersDatasetContinuousDensityHistogramBarWidth+":"+((support[1]-support[0])/continuousHistogramSteps).toLocaleString()+")", data: histogram, type: "bar", hitRadius: 25, borderColor: "green", borderWidth: 2, backgroundColor: "rgba(0,127,0,0.25)"},
    ];
  }

  /* Init chart 2 data */
  const chart2options=getDefaultChartOptions();
  chart2options.scales={x: {title: {display: true, text: "x"},}, y: {min: 0, title: {display: true, text: "phi(x)"}}};
  const chart2data={};
  const labels=[];
  const phi=[];
  histogram2=[];
  const factor=1/Math.sqrt(2*Math.PI);
  for (let i=0;i<=30;i++) {
    const x=(i/5)-3;
    const y=factor*Math.exp(-(x**2));
    labels.push(x.toLocaleString());
    phi.push(y);
    histogram2.push(0);
  }
  chart2data.labels=labels;
  chart2data.datasets=[
    {label: language.distributions.infoDiagramCentralLimitTheoremDatasetDensityPhi+" phi(x)", data: phi, type: "line", borderColor: "blue", backgroundColor: "rgba(0,0,127,0.25)", pointRadius: 0, hitRadius: 25},
    {label: language.distributions.infoDiagramCentralLimitTheoremDatasetPartialSumSample+" Yn", data: histogram2, type: "bar", hitRadius: 25, borderColor: "green", borderWidth: 2, backgroundColor: "rgba(0,127,0,0.25)"}
  ];

  initCharts(distribution,values,1,chart1data,chart1options,chart2data,chart2options,()=>{
    count=0;
    sum=0;
    scaledSum=0;
    scaledSum2=0;
    histogram=histogram.map(v=>0);
    histogram2=histogram2.map(v=>0);
    chart1.data.datasets[0].data=[];
    chart1.update();
    chart2.data.datasets[1].data=[];
    chart2.update();
  });
}

/**
 * Initializes the complete web app.
 */
function initSim() {
  let distribution, values, mode;
  [distribution, values, mode]=getDistributionFromSearchString();
  if (distribution==null) return;

  /* Select color mode */
  let selectedColorMode=localStorage.getItem('selectedColorMode');
  if (selectedColorMode==null) selectedColorMode=(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)?"dark":"light";
  document.documentElement.dataset.bsTheme=selectedColorMode;

  /* Init app in different modes */
  switch (mode) {
    case 0:
      initLawOfLargeNumbers(distribution,values);
      break;
    case 1:
      initCentralLimitTheorem(distribution,values);
      break;
  }

  /* Start */
  startSim();
}