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

export {isDesktopApp, initApp};

import {language} from "./Language.js";
import {listDistributions, getDistributionsByName} from "./DistributionSetup.js";

const isDesktopApp=(typeof(NL_OS)!='undefined'); if (isDesktopApp) Neutralino.init();

function initGUILanguage() {
  /* Header */
  appName1.innerHTML=language.GUI.appName;
  languageButton.title=language.GUI.switchLanguageHint;
  languageButton.querySelector('.menuButtonTitleShort').innerHTML=language.GUI.switchLanguageShort;
  languageButton.querySelector('.menuButtonTitleLong').innerHTML=language.GUI.switchLanguage;
  languageButton.onclick=()=>{
    localStorage.setItem('selectedLanguage',language.GUI.switchLanguageMode);
    document.location.href=language.GUI.switchLanguageFile;
  }

  menuColorMode.title=language.GUI.tabColorMode;
  menuColorModeLight.innerHTML=language.GUI.tabColorModeLight;
  menuColorModeDark.innerHTML=language.GUI.tabColorModeDark;
  menuColorModeSystemDefault.innerHTML=language.GUI.tabColorModeSystemDefault;

  let selectedColorMode=localStorage.getItem('selectedColorMode');
  if (selectedColorMode==null) {
    menuColorModeSystemDefault.classList.add("bi-check");
    const mode=(document.documentElement.dataset.bsTheme=='dark')?language.GUI.tabColorModeDark:language.GUI.tabColorModeLight;
    menuColorModeSystemDefault.innerHTML=menuColorModeSystemDefault.innerHTML+" ("+mode+")";
  } else {
    if (document.documentElement.dataset.bsTheme=='dark') menuColorModeDark.classList.add("bi-check"); else menuColorModeLight.classList.add("bi-check");
  }

  /* Content */
  distSelectLabel.innerHTML=language.GUI.selectDistribution;

  /* Footer */
  appName2.innerHTML=language.GUI.appName;
  linkImprint.innerHTML=language.GUI.imprint;
  linkPrivacy.innerHTML=language.GUI.privacy;
  linkMainHome.innerHTML=language.GUI.homeURL;
  linkMainHome.href="https://"+language.GUI.homeURL;
  infoLocalDataOnly2.querySelector("h3").innerHTML=language.GUI.privacyInfo1;
  infoLocalDataOnly2.querySelector("div").innerHTML=language.GUI.privacyInfo2;
  infoSimulators.innerHTML=language.GUI.simulators;
}

function initDistributionsSelector(distSelect, distributionArea) {
  let optgroup;
  let first=true;

  distSelect.appendChild(optgroup=document.createElement("optgroup"));
  optgroup.label=language.distributions.typeDiscreteFull;
  for (let name of listDistributions.filter(dist=>dist.discrete).map(dist=>dist.name).sort()) {
    const option=document.createElement("option");
    option.innerHTML=name;
    if (first) {option.selected="selected"; first=false;}
    optgroup.appendChild(option);
  }

  distSelect.appendChild(optgroup=document.createElement("optgroup"));
  optgroup.label=language.distributions.typeContinuousFull;
  for (let name of listDistributions.filter(dist=>!dist.discrete).map(dist=>dist.name).sort()) {
    const option=document.createElement("option");
    option.innerHTML=name;
    if (first) {option.selected="selected"; first=false;}
    optgroup.appendChild(option);
  }

  distSelect.onchange=()=>{
    const dist=getDistributionsByName(distSelect.value);
    if (dist!=null) selectDistribution(dist,distributionArea);
  }

  selectDistribution(getDistributionsByName(distSelect.value),distributionArea);
}

function selectDistribution(distribution, area) {
  area.innerHTML="";
  area.appendChild(distribution.panel);
}

function startApp() {
  document.addEventListener('readystatechange',event=>{if (event.target.readyState=="complete") {
    if (isDesktopApp) {
      infoLocalDataOnly1.style.display="none";
      infoLocalDataOnly2.style.display="none";
    }
    mainContent.style.display="";
    infoLoading.style.display="none";
  }});
}

function initApp() {
  initGUILanguage();
  initDistributionsSelector(distSelect,distributionArea);
  startApp();
}