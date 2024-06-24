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

/* Select language */
import {selectLanguage} from './js/LanguageTools.js';
selectLanguage([{name: "default", file: "index.html"}, {name: "de", file: "index_de.html"}]);

/* Select color mode */
let selectedColorMode=localStorage.getItem('selectedColorMode');
if (selectedColorMode==null) selectedColorMode=(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)?"dark":"light";
document.documentElement.dataset.bsTheme=selectedColorMode;

/* Init app */
import {language} from "./js/Language.js";
import {initApp, isDesktopApp, selectDistribution} from './js/Main.js';
initApp();

/* Process permalink parameters */
import {loadSearchStringParameters} from "./js/StringTools.js";
import {getDistributionByClassName, getAllDistributionParameterIds, getDistributionsByName} from "./js/DistributionSetup.js";
import {getFloat} from "./js/NumberTools.js";
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
}

/* More tools & download buttons */
let bottomInfo="<p class='mt-3'>"+language.GUI.toolsLabel+"</p><p><button id=\"openFitterButton\" class=\"btn btn-primary my-1 bi-fingerprint\"> "+language.fitter.title+"</button></p>";
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
  const downloadA='<a id="downloadApp" target="_blank" href="https://github.com/A-Herzog/Distributions/releases/latest/download/Distributions.exe" style="display: none;"></a>';
  const downloadButton='<button class="btn btn-primary my-1 bi-windows" onclick="document.getElementById(\'downloadApp\').click();"> '+language.GUI.downloadButton+'</button>';
  bottomInfo+="<p class='mt-3'>"+language.GUI.downloadLabel+"</p><p>"+downloadA+downloadButton+"</p>";
}
bottomInfoArea.innerHTML=bottomInfo;
openFitterButton.onclick=()=>{
  const file="fitter"+((document.documentElement.lang=='de')?"_de":"")+".html";
  window.open(file,"_blank");
};
