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

import {selectLanguage} from './js/LanguageTools.js';
import {language} from "./js/Language.js";
import {isDesktopApp} from "./js/AppTools.js";
import {initApp, selectDistribution} from './js/Main.js';
import {loadSearchStringParameters} from "./js/StringTools.js";
import {getDistributionByClassName, getAllDistributionParameterIds, getDistributionsByName} from "./js/DistributionSetup.js";
import {getFloat} from "./js/NumberTools.js";

function start() {
  /* Select language */
  if (selectLanguage([{name: "default", file: "index.html"}, {name: "de", file: "index_de.html"}])) return;

  /* Select color mode */
  let selectedColorMode=localStorage.getItem('selectedColorMode');
  if (selectedColorMode==null) selectedColorMode=(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)?"dark":"light";
  document.documentElement.dataset.bsTheme=selectedColorMode;

  /* Init app */
  initApp();

  /* Process permalink parameters */
  const validKeys=["distribution"];
  getAllDistributionParameterIds().forEach(entry=>validKeys.push(entry));
  const data=loadSearchStringParameters(validKeys);
  if (typeof(data.distribution)=='string') {
    const distribution=getDistributionByClassName(data.distribution+"Distribution");
    if (distribution!=null) {
      const values={};
      for (let key in data) if (key!="distribution") values[key]=getFloat(data[key]);
      distribution.setParmeterExtern(values);
      for (let group of distSelect.childNodes) for (let item of group.childNodes) if (item.label==distribution.name) {
        item.selected=true;
        const dist=getDistributionsByName(distSelect.value);
        if (dist!=null) selectDistribution(dist,distributionArea);
      }
    }
  } else {
    /* Select binomial distribution if no parameters are specified */
    distSelect.value=language.distributions.binomial.name;
    const dist=getDistributionsByName(distSelect.value);
    if (dist!=null) selectDistribution(dist,distributionArea);
  }

  /* More tools & download buttons */
  let bottomInfo="";

  bottomInfo+="<p class='mt-3'>"+language.GUI.toolsLabel+"</p><p>";
  bottomInfo+="<button id=\"openFitterButton\" class=\"btn btn-primary me-2 my-1 bi-fingerprint\"> "+language.fitter.title+"</button>";
  bottomInfo+="<button id=\"openLCGButton\" class=\"btn btn-primary me-2 my-1 bi-123\"> "+language.lcg.title+"</button>";
  bottomInfo+="<button id=\"openDiceSimulationButton\" class=\"btn btn-primary me-2 my-1 bi-dice-6\"> "+language.distributions.infoDiagramDiceRollSimulation+"</button>";
  bottomInfo+="</p>";
  if (isDesktopApp) {
    const footer=document.querySelector('footer');
    for (let link of footer.querySelectorAll("a")) if (link.href!='') {
      const href=link.href;
      link.onclick=()=>Neutralino.os.open(href);
      link.removeAttribute("href");
      link.style.cursor="pointer";
      link.classList.add("link-primary");
    }
    PermaLink.style.display="none";
  } else {
    PermaLink.innerHTML=language.GUI.permaLink;
    const downloadButton="<button class='btn btn-primary dropdown-toggle my-1 bi-download' type='button' data-bs-toggle='dropdown' aria-expanded='false'>&nbsp;"+language.GUI.downloadButton+"</button>";
    const downloadOptions=[
      "<a class='dropdown-item bi bi-windows' href='https://github.com/A-Herzog/Distributions/releases/latest/download/Distributions.exe'>&nbsp;"+language.GUI.downloadButtonExe+"</a>",
      "<a class='dropdown-item bi bi-file-zip' href='https://github.com/A-Herzog/Distributions/releases/latest/download/Distributions_Linux_MacOS.zip'>&nbsp;"+language.GUI.downloadButtonZip+"</a>"
    ];
    bottomInfo+="<p class='mt-3'>"+language.GUI.downloadLabel+"</p><p><div class='dropdown'>"+downloadButton+"<ul class='dropdown-menu'><li>"+downloadOptions.join("</li><li>")+"</li></ul>"+"</div></p>";
  }
  bottomInfoArea.innerHTML=bottomInfo;
  openFitterButton.onclick=()=>{
    const file="fitter"+((document.documentElement.lang=='de')?"_de":"")+".html";
    window.open(file,"_blank");
  };
  openLCGButton.onclick=()=>{
    const file="lcg"+((document.documentElement.lang=='de')?"_de":"")+".html";
    window.open(file,"_blank");
  };
  openDiceSimulationButton.onclick=()=>{
    const file="sim"+((document.documentElement.lang=='de')?"_de":"")+".html?dice=1";
    window.open(file,"_blank");
  };
}

start();
