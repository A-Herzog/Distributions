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
import {isDesktopApp} from "./AppTools.js";
import {getFloat, getInt, getPositiveInt, formatNumber, formatPercent} from "./NumberTools.js";
import {loadSearchStringParameters} from "./StringTools.js";

let tableData="";

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
  addPermaLink(infoArea);
  infoAreaMath.innerHTML=infoText+"<br><a href=\""+infoWikipedia+"\" target=\"_blank\">"+language.distributions.infoPropertiesWikipediaLink+"</a>";

  /* Charts */
  chart1header.innerHTML=title1;
  chart1info.innerHTML=language.distributions.infoDiagramZoomInfo;
  chart1defaultZoomButton.innerHTML=" "+language.distributions.infoDiagramResetZoom;
  chart1export.innerHTML=" "+language.distributions.infoDiagramExport;
  chart1copy.innerHTML=" "+language.distributions.infoDiagramExportCopy;
  chart1save.innerHTML=" "+language.distributions.infoDiagramExportSave;
  chart2header.innerHTML=title2;
  chart2info.innerHTML=language.distributions.infoDiagramZoomInfo;
  chart2defaultZoomButton.innerHTML=" "+language.distributions.infoDiagramResetZoom;
  chart2export.innerHTML=" "+language.distributions.infoDiagramExport;
  chart2copy.innerHTML=" "+language.distributions.infoDiagramExportCopy;
  chart2save.innerHTML=" "+language.distributions.infoDiagramExportSave;

  chart1copy.onclick=()=>{
    if (typeof(ClipboardItem)!="undefined") {
      chart1canvas.toBlob(blob=>navigator.clipboard.write([new ClipboardItem({"image/png": blob})]));
    } else {
      alert(language.distributions.infoDiagramExportCopyError);
    }
  };

  chart1save.onclick=()=>{
    const element=document.createElement("a");
    element.href=chart1canvas.toDataURL("image/png");
    element.download="diagram.png";
    element.click();
  };

  chart2copy.onclick=()=>{
    if (typeof(ClipboardItem)!="undefined") {
      chart2canvas.toBlob(blob=>navigator.clipboard.write([new ClipboardItem({"image/png": blob})]));
    } else {
      alert(language.distributions.infoDiagramExportCopyError);
    }
  };

  chart2save.onclick=()=>{
    const element=document.createElement("a");
    element.href=chart2canvas.toDataURL("image/png");
    element.download="diagram.png";
    element.click();
  };

  /* Control area */
  resetButton.innerHTML=" "+language.distributions.infoDiagramLawOfLargeNumbersControlReset;
  stepButton.innerHTML=" "+language.distributions.infoDiagramLawOfLargeNumbersControlStep;
  playPauseButton.innerHTML=" "+language.distributions.infoDiagramLawOfLargeNumbersControlStart;
  playStepsButton.innerHTML=" "+language.distributions.infoDiagramLawOfLargeNumbersControlSteps;
  playStepsInput.title=language.distributions.infoDiagramLawOfLargeNumbersControlStepsInput;
  playStepsInputLabel.innerHTML=language.distributions.infoDiagramLawOfLargeNumbersControlSteps;

  /* Export buttons */
  tableExport.innerHTML=" "+language.distributions.infoExportTabelle;
  tableCopy.innerHTML=" "+language.distributions.infoDiagramCopyValues;
  tableSave.innerHTML=" "+language.distributions.infoDiagramSaveValues;
  tableCopy.onclick=()=>navigator.clipboard.writeText(tableData);
  tableSave.onclick=()=>{
    if (isDesktopApp) {
      Neutralino.os.showSaveDialog(language.distributions.infoDiagramSaveValues, {defaultPath: 'table.txt', filters: [
        {name: language.distributions.infoDiagramSaveValuesTextFiles+' (*.txt)', extensions: ['txt']}
      ]}).then(file=>{
        file=file.trim();
        if (file=='') return;
        if (!file.toLocaleLowerCase().endsWith(".txt")) file+=".txt";
        Neutralino.filesystem.writeFile(file,tableData);
      });
    } else {
      const element=document.createElement('a');
      element.setAttribute('href','data:text/plain;charset=utf-8,'+encodeURIComponent(tableData));
      element.setAttribute('download','table.txt');
      element.style.display='none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };
}

/**
 * Returns data on the information to be displayed based on the url search string values
 * @returns Array containing: Distribution object, object of distribution parameter values, generate pseudo-random numbers (true) or show pdf/cdf (false), number of pseudo-random numbers to be generated
 */
async function getDistributionFromSearchString() {
  const globalValidKeys=["distribution","mode"];
  const validKeys=[...globalValidKeys];
  getAllDistributionParameterIds().forEach(entry=>validKeys.push(entry));

  const data=loadSearchStringParameters(validKeys);

  if (typeof(data.distribution)!='string') return [null, null, 0];
  const distribution=await getDistributionByClassName(data.distribution+"Distribution");
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

startSim();

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
      },
      tooltip: {
        callbacks: {
            label: function(context) {
                let label=context.dataset.label || '';
                if (label) label+=': ';
                if (context.parsed.y!==null) label+=formatNumber(context.parsed.y,5);
                return label;
            }
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
    const support=distribution.getDiscreteSupport(values,true);
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

function drawCircle(ctx, x, y, radius) {
  ctx.strokeStyle='black';
  ctx.fillStyle='rgb(0,140,79)';

  ctx.beginPath();
  ctx.arc(x,y,radius,0,2*Math.PI,false);
  ctx.fill();
  ctx.stroke();
}

/**
 * Draws a dice to the dice canvas element
 * @param {Number} nr Dice role value (number from 1 to 6)
 * @see doStepLawOfLargeNumbers
 */
function drawDice(nr) {
  if (!dice_canvas.getContext) return;
  const ctx=dice_canvas.getContext('2d');

  const w=dice_canvas.width;
  const h=dice_canvas.height;
  const r=Math.min(w,h)/8;
  ctx.clearRect(0,0,w,dice_canvas.height);
  switch (nr) {
    case 1: drawCircle(ctx,w/2,h/2,r); break;
    case 2: drawCircle(ctx,w/5,h/5,r); drawCircle(ctx,4*w/5,4*h/5,r); break;
    case 3: drawCircle(ctx,w/5,h/5,r); drawCircle(ctx,w/2,h/2,r); drawCircle(ctx,4*w/5,4*h/5,r); break;
    case 4: drawCircle(ctx,w/5,h/5,r); drawCircle(ctx,4*w/5,h/5,r); drawCircle(ctx,w/5,4*h/5,r); drawCircle(ctx,4*w/5,4*h/5,r); break;
    case 5: drawCircle(ctx,w/5,h/5,r); drawCircle(ctx,4*w/5,h/5,r); drawCircle(ctx,w/2,h/2,r); drawCircle(ctx,w/5,4*h/5,r); drawCircle(ctx,4*w/5,4*h/5,r); break;
    case 6: drawCircle(ctx,w/5,h/5,r); drawCircle(ctx,4*w/5,h/5,r); drawCircle(ctx,w/5,h/2,r); drawCircle(ctx,4*w/5,h/2,r); drawCircle(ctx,w/5,4*h/5,r); drawCircle(ctx,4*w/5,4*h/5,r); break;
  }
}

/**
 * Formats a number as a percent value with one digit.
 * @param {Number} number Number to be formatted as percent
 * @returns Number as string
 */
function formatPercentFixed(number) {
  return formatPercent(Math.round(number*1000)/1000);
}

/**
 * Formats a number a a percent value and outputs it as a HTML table cell.
 * @param {Number} value Number to be formatted as percent
 * @returns Number as string in a table cell
 */
function getPercentTD(value) {
  return "<td title='"+formatPercent(value,5)+"'>"+formatPercentFixed(value)+"</td>";
}

/**
 * Does a law of large numbers simulation step.
 * @param {Object} distribution Distribution to be used
 * @param {Object} values Distribution parameters
 */
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
    const support=distribution.getDiscreteSupport(values,true);
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

  if (values.dice) {
    dice_canvas.style.display="";
    drawDice(rnd);
  }

  const mean=lastMeanValues[lastMeanValues.length-1];
  const info=[];
  info.push(language.distributions.infoDiagramLawOfLargeNumbersInfoNewestRandomNumber+"="+(distribution.discrete?formatNumber(rnd):formatNumber(rnd,5)));
  info.push(language.distributions.infoDiagramLawOfLargeNumbersInfoSampleValues+"="+count);
  if (distribution.mean!=null) {
    info.push(language.distributions.infoDiagramLawOfLargeNumbersInfoExpectedValueOfDistribution+"="+formatNumber(distribution.mean));
    info.push(language.distributions.infoDiagramLawOfLargeNumbersInfoArithmeticMeanOfTheSampleValues+"="+formatNumber(mean,5));
    if (distribution.mean!=0) {
      info.push(language.distributions.infoDiagramLawOfLargeNumbersInfoRelativeDeviationMeanExpectedValue+"="+formatPercent((mean-distribution.mean)/distribution.mean));
    }
  }
  if (values.dice) {
    /* Display table */
    info.push("");
    const infoTable=[];
    infoTable.push("<div style='overflow-x: scroll;'>");
    infoTable.push("<table class='table table-striped border table-sm'>");
    infoTable.push("<thead>");
    infoTable.push("<tr><th>"+language.distributions.infoDiagramNumberOfDots+"</th>"+histogram.filter((_,index)=>(index>0)).map((_,index)=>"<th style='width: 60px;'>"+(index+1)+"</th>").join("")+"<th>"+language.distributions.infoDiagramLawOfLargeNumbersInfoSum+"</th></tr>");
    infoTable.push("</thead>");
    infoTable.push("<tbody>");
    infoTable.push("<tr><th scope='row'>"+language.distributions.infoDiagramAbsoluteFrequency+"</th>"+histogram.filter((_,index)=>(index>0)).map(value=>"<td>"+value+"</td>").join("")+"<td>"+count+"</td></tr>");
    infoTable.push("<tr><th scope='row'>"+language.distributions.infoDiagramRelativeFrequency+"</th>"+histogram.filter((_,index)=>(index>0)).map(value=>getPercentTD(value/count)).join("")+"<td>100%</td></tr>");
    infoTable.push("<tr><th scope='row'>"+language.distributions.infoDiagramProbability+"</th>"+histogram.filter((_,index)=>(index>0)).map(_=>getPercentTD(1/6)).join("")+"<td>100%</td></tr>");
    infoTable.push("</tbody>");
    infoTable.push("</table>");
    infoTable.push("</div>");
    info.push(infoTable.join(""));
    /* Clipboard/Export data */
    const lines=[];
    lines.push(language.distributions.infoDiagramNumberOfDots+"\t"+histogram.filter((_,index)=>(index>0)).map((_,index)=>""+(index+1)).join("\t")+"\t"+language.distributions.infoDiagramLawOfLargeNumbersInfoSum);
    lines.push(language.distributions.infoDiagramAbsoluteFrequency+"\t"+histogram.filter((_,index)=>(index>0)).map(value=>""+value).join("\t")+"\t"+count);
    lines.push(language.distributions.infoDiagramRelativeFrequency+"\t"+histogram.filter((_,index)=>(index>0)).map(value=>formatPercent(value/count,5)).join("\t")+"\t100%");
    lines.push(language.distributions.infoDiagramProbability+"\t"+histogram.filter((_,index)=>(index>0)).map(_=>formatPercent(1/6,5)).join("\t")+"\t100%");
    tableData=lines.join("\n");
  } else if (distribution.discrete) {
    /* Display table */
    const MAX_HISTOGRAM_VALUE=15;
    info.push("");
    const infoTable=[];
    infoTable.push("<div style='overflow-x: scroll;'>");
    infoTable.push("<table class='table table-striped border table-sm'>");
    infoTable.push("<thead>");
    infoTable.push("<tr><th>"+language.distributions.infoCharacteristicValue+"</th>");
    infoTable.push(histogram.filter((_,index)=>(index<=MAX_HISTOGRAM_VALUE)).map((_,index)=>"<th style='width: 60px;'>"+index+"</th>").join(""));
    if (histogram.length>MAX_HISTOGRAM_VALUE) infoTable.push("<th style='width: 60px;'>&ge;"+(MAX_HISTOGRAM_VALUE+1)+"</th>");
    infoTable.push("<th>"+language.distributions.infoDiagramLawOfLargeNumbersInfoSum+"</th></tr>");
    infoTable.push("</thead>");
    infoTable.push("<tbody>");
    infoTable.push("<tr><th scope='row'>"+language.distributions.infoDiagramAbsoluteFrequency+"</th>");
    infoTable.push(histogram.filter((_,index)=>(index<=MAX_HISTOGRAM_VALUE)).map(value=>"<td>"+value+"</td>").join(""));
    if (histogram.length>MAX_HISTOGRAM_VALUE) infoTable.push("<td>"+histogram.filter((_,index)=>(index>MAX_HISTOGRAM_VALUE)).reduce((a,b)=>a+b)+"</td>");
    infoTable.push("<td>"+count+"</td></tr>");
    infoTable.push("<tr><th scope='row'>"+language.distributions.infoDiagramRelativeFrequency+"</th>");
    infoTable.push(histogram.filter((_,index)=>(index<=MAX_HISTOGRAM_VALUE)).map(value=>getPercentTD(value/count)).join(""));
    if (histogram.length>MAX_HISTOGRAM_VALUE) infoTable.push(getPercentTD(histogram.filter((_,index)=>(index>MAX_HISTOGRAM_VALUE)).reduce((a,b)=>a+b)/count));
    infoTable.push("<td>100%</td></tr>");
    infoTable.push("<tr><th scope='row'>"+language.distributions.infoDiagramProbability+"</th>");
    infoTable.push(histogram.filter((_,index)=>(index<=MAX_HISTOGRAM_VALUE)).map((_,index)=>getPercentTD(distribution.calcProbability(values,index))).join(""));
    if (histogram.length>MAX_HISTOGRAM_VALUE) infoTable.push(getPercentTD(1-histogram.filter((_,index)=>(index<=MAX_HISTOGRAM_VALUE)).map((_,index)=>distribution.calcProbability(values,index)).reduce((a,b)=>a+b)));
    infoTable.push("<td>100%</td></tr>");
    infoTable.push("</tbody>");
    infoTable.push("</table>");
    infoTable.push("</div>");
    info.push(infoTable.join(""));
    /* Clipboard/Export data */
    const lines=[];
    let s="";
    if (histogram.length>MAX_HISTOGRAM_VALUE) s="\t>="+(MAX_HISTOGRAM_VALUE+1);
    lines.push(language.distributions.infoCharacteristicValue+"\t"+histogram.filter((_,index)=>(index<=MAX_HISTOGRAM_VALUE)).map((_,index)=>""+index).join("\t")+s+"\t"+language.distributions.infoDiagramLawOfLargeNumbersInfoSum);
    if (histogram.length>MAX_HISTOGRAM_VALUE) s="\t"+histogram.filter((_,index)=>(index>MAX_HISTOGRAM_VALUE)).reduce((a,b)=>a+b);
    lines.push(language.distributions.infoDiagramAbsoluteFrequency+"\t"+histogram.filter((_,index)=>(index<=MAX_HISTOGRAM_VALUE)).map(value=>""+value).join("\t")+s+"\t"+count);
    if (histogram.length>MAX_HISTOGRAM_VALUE) s="\t"+formatPercent(histogram.filter((_,index)=>(index>MAX_HISTOGRAM_VALUE)).reduce((a,b)=>a+b)/count,5);
    lines.push(language.distributions.infoDiagramRelativeFrequency+"\t"+histogram.filter((_,index)=>(index<=MAX_HISTOGRAM_VALUE)).map(value=>formatPercent(value/count,5)).join("\t")+s+"\t100%");
    if (histogram.length>MAX_HISTOGRAM_VALUE) s="\t"+formatPercent(1-histogram.filter((_,index)=>(index<=MAX_HISTOGRAM_VALUE)).map((_,index)=>distribution.calcProbability(values,index)).reduce((a,b)=>a+b),5);
    lines.push(language.distributions.infoDiagramProbability+"\t"+histogram.filter((_,index)=>(index<=MAX_HISTOGRAM_VALUE)).map((_,index)=>formatPercent(distribution.calcProbability(values,index),5)).join("\t")+s+"\t100%");
    tableData=lines.join("\n");
  }
  return info.join("<br>");
}

/**
 * Does a central limit theorem simulation step.
 * @param {Object} distribution Distribution to be used
 * @param {Object} values Distribution parameters
 */
function doStepCentralLimitTheorem(distribution, values) {
  const support=(distribution.discrete)?distribution.getDiscreteSupport(values,true):distribution.getDiagramSupport(values);

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
  info.push(language.distributions.infoDiagramCentralLimitTheoremNewestParialSum+"="+formatNumber(rnd,5));
  info.push(language.distributions.infoDiagramLawOfLargeNumbersInfoSampleValues+"="+count);
  info.push(language.distributions.infoDiagramCentralLimitTheoremValuesPerPartialSum+"="+n);
  info.push(language.distributions.infoDiagramCentralLimitTheoremNumberOfPartialSums+"="+(count/n));
  info.push(language.distributions.infoDiagramCentralLimitTheoremMeanOfSample+"="+formatNumber(sum/count,5));
  const EX=(scaledSum/count*n);
  const EX2=(scaledSum2/count*n);
  info.push(language.distributions.infoDiagramCentralLimitTheoremMeanOfPartialSums+"="+formatNumber(EX,5));
  info.push(language.distributions.infoDiagramCentralLimitTheoremVarianceOfPartialSums+"="+formatNumber(EX2-EX**2,5));

  return info.join("<br>");
}

/**
 * Does a simulation step.
 * @param {Object} distribution Distribution to be used
 * @param {Object} values Distribution parameters
 * @param {Number} mode Simulation mode (0: law of large numbers, 1: central limit theorem)
 */
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
  if (distribution.discrete) tableExportLine.style.display="block";
}

/**
 * Number of steps to be performend in run mode.
 * (If set to a value lower than 0, no auto stop will be performed.)
 * @see runSteps
 */
let autoStop=-1;

/**
 * Sets up a timeout for the next simulation step.
 * @param {Object} distribution Distribution to be used
 * @param {Object} values Distribution parameters
 * @param {Number} mode Simulation mode (0: law of large numbers, 1: central limit theorem)
 */
function initStepTimeout(distribution, values, mode) {
  let delay;
  if (autoStop>=0) {
    delay=5;
  } else {
    delay=(mode==0)?75:10;
  }
  runTimeout=setTimeout(()=>{
    doStep(distribution,values,mode);
    if (autoStop>=0) {
      autoStop--;
      if (autoStop<=0) {
        doStartStop(distribution,values,mode);
        return;
      }
    }
    initStepTimeout(distribution,values,mode);
  },delay);
}

/**
 * Starts or stops the simulation.
 * @param {Object} distribution Distribution to be used
 * @param {Object} values Distribution parameters
 * @param {Number} mode Simulation mode (0: law of large numbers, 1: central limit theorem)
 */
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
    playStepsButton.disabled=false;
    playStepsInput.disabled=false;
  } else {
    /* Start */
    initStepTimeout(distribution,values,mode);
    playPauseButton.innerHTML=" "+language.distributions.infoDiagramLawOfLargeNumbersControlStop;
    playPauseButton.classList.remove("bi-play");
    playPauseButton.classList.add("bi-pause");
    stepButton.disabled=true;
    playStepsButton.disabled=true;
    playStepsInput.disabled=true;

  }
  running=!running;
}

/**
 * Initializes the charts for the simulation.
 * @param {Object} distribution Distribution to be used for simulation
 * @param {Object} values Distribution parameters
 * @param {Number} mode Simulation mode (0: law of large numbers, 1: central limit theorem)
 * @param {Object} chart1data Datasets for left chart
 * @param {Object} chart1options Options for left chart
 * @param {Object} chart2data Datasets for right chart
 * @param {Object} chart2options Options for right chart
 * @param {Function} resetCallback Function which is called when the user clicks the reset data button
 */
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
    tableExportLine.style.display="none";
  };
  stepButton.onclick=()=>{
    if (!running) doStep(distribution,values,mode);
  };
  playPauseButton.onclick=()=>{
    autoStop=-1;
    doStartStop(distribution,values,mode);
  };
  playStepsButton.onclick=()=>{
    runSteps(distribution,values,mode);
  }
  playStepsInput.oninput=checkStepsInput;
}

/**
 * Checks the entered auto stop value.
 */
function checkStepsInput() {
  if (getPositiveInt(playStepsInput.value)==null) {
    playStepsButton.classList.add("disabled");
    playStepsInput.classList.add("is-invalid");
  } else {
    playStepsButton.classList.remove("disabled");
    playStepsInput.classList.remove("is-invalid");
  }
}

/**
 * Starts an auto stop simulation.
 * @param {Object} distribution Distribution to be used
 * @param {Object} values Distribution parameters
 * @param {Number} mode Simulation mode (0: law of large numbers, 1: central limit theorem)
 */
function runSteps(distribution, values, mode) {
  const stepCount=getPositiveInt(playStepsInput.value);
  if (stepCount==null) return;
  autoStop=stepCount;
  doStartStop(distribution,values,mode);
}

/**
 * Initializes law of large numbers simulation.
 * @param {Object} distribution Distribution to be used
 * @param {Object} values Distribution parameters
 */
function initLawOfLargeNumbers(distribution, values) {
  /* Init language */
  const title=(values.dice)?(language.distributions.infoDiagramDiceRollSimulation+" - "+language.distributions.infoDiagramLawOfLargeNumbers):language.distributions.infoDiagramLawOfLargeNumbers;
  initGUILanguage(distribution,title,language.distributions.infoDiagramLawOfLargeNumbersInfo,language.distributions.infoDiagramLawOfLargeNumbersWikipedia,language.distributions.infoDiagramLawOfLargeNumbersHeadingMeanExpectedValue,language.distributions.infoDiagramLawOfLargeNumbersHeadingDensitySample);

  /* Init chart 1 data */
  const chart1options=getDefaultChartOptions();
  chart1options.scales={x: {display: false}, y: {title: {display: true, text: language.distributions.infoDiagramLawOfLargeNumbersScaleExpectedValueMean}}};
  const datasets=[];
  if (distribution.mean!=null) {
    const mean=distribution.mean;
    if (distribution.discrete) {
      const support=distribution.getDiscreteSupport(values,true);
      chart1options.scales.y.min=Math.max(Math.min(mean-1,mean*0.5),support[0]);
      chart1options.scales.y.max=Math.min(Math.max(mean+1,mean*1.5),support[1]);
    } else {
      const support=distribution.getDiagramSupport();
      chart1options.scales.y.min=Math.max(Math.min(mean-1,mean*0.5),support[0]);
      chart1options.scales.y.max=Math.min(Math.max(mean+1,mean*1.5),support[1]);
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
  chart2options.scales={x: {stacked: true, title: {display: true, text: "x"},}, y: {min: 0, title: {display: true, text: language.distributions.infoDiagramLawOfLargeNumbersScalePercentage}, ticks: {callback: value=>formatPercent(value)}}};
  const chart2data={};

  if (distribution.discrete) {
    const support=distribution.getDiscreteSupport(values,true);
    const labels=[];
    const pdf=[];
    histogram=[];
    for (let i=Math.min(0,support[0]);i<=support[1];i++) {
      labels.push(i);
      if (i<support[0]) pdf.push(0); else pdf.push(distribution.calcProbability(values,i));
      histogram.push(0);
    }
    const maxPdf=pdf.reduce((a,b)=>Math.max(a,b));
    let maxY=maxPdf*1.25;
    maxY=Math.ceil(maxY*20)/20;
    chart2options.scales.y.max=maxY;
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
      labels.push(formatNumber((left+right)/2));
      pdf.push(p[1]-lastCDF);
      histogram.push(0);
      lastCDF=p[1];
    }
    const maxPdf=pdf.reduce((a,b)=>Math.max(a,b));
    chart2options.scales.y.max=maxPdf*1.5;
    chart2data.labels=labels;
        chart2data.datasets=[
      {label: language.distributions.infoDiagramLawOfLargeNumbersDatasetContinuousDensity+" ("+language.distributions.infoDiagramLawOfLargeNumbersDatasetContinuousDensityHistogramBarWidth+":"+formatNumber((support[1]-support[0])/continuousHistogramSteps)+")", data: pdf, type: "bar", hitRadius: 25, borderColor: "green", borderWidth: 2, backgroundColor: "rgba(0,127,0,0.25)"},
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

/**
 * Initializes central limit theorem simulation.
 * @param {Object} distribution Distribution to be used
 * @param {Object} values Distribution parameters
 */
function initCentralLimitTheorem(distribution, values) {
  /* Init language */
  initGUILanguage(distribution,language.distributions.infoDiagramCentralLimitTheorem,language.distributions.infoDiagramCentralLimitTheoremInfo,language.distributions.infoDiagramCentralLimitTheoremWikipedia,language.distributions.infoDiagramCentralLimitTheoremHeadingSample,language.distributions.infoDiagramCentralLimitTheoremHeadingStandardNormalDistribution);

  /* Init chart 1 data */
  const chart1options=getDefaultChartOptions();
  chart1options.scales={x: {title: {display: true, text: "x"},}, y: {min: 0, title: {display: true, text: language.distributions.infoDiagramLawOfLargeNumbersScalePercentage}, ticks: {callback: value=>formatPercent(value)}}};
  const chart1data={};

  if (distribution.discrete) {
    const support=distribution.getDiscreteSupport(values,true);
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
      labels.push(formatNumber((left+right)/2));
      histogram.push(0);
    }
    chart1data.labels=labels;
    chart1data.datasets=[
      {label: language.distributions.infoDiagramLawOfLargeNumbersDatasetContinuousSample+" ("+language.distributions.infoDiagramLawOfLargeNumbersDatasetContinuousDensityHistogramBarWidth+":"+formatNumber((support[1]-support[0])/continuousHistogramSteps)+")", data: histogram, type: "bar", hitRadius: 25, borderColor: "green", borderWidth: 2, backgroundColor: "rgba(0,127,0,0.25)"},
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
    labels.push(formatNumber(x));
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
async function initSim() {
  let distribution, values;
  let mode=-1;

  /* Special modes */
  const special=loadSearchStringParameters(["dice"]);
  if (typeof(special.dice)!='undefined') {
    mode=0;
    distribution=await getDistributionByClassName("DiscreteUniformDistribution");
    values={a: 1, b: 6, dice: true};
    distribution.setParmeterExtern(values);
  }

  /* Distribution depending default modes */
  if (mode==-1) {
    [distribution, values, mode]=await getDistributionFromSearchString();
    if (distribution==null) {
      mainContent.innerHTML="No simulation parameters specified.";
      return;
    }
  }

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
}