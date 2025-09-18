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

export {initApp, selectDistribution};

import {language} from "./Language.js";
import {getDistributionNames, getDistributionsByName} from "./DistributionSetup.js";
import {isDesktopApp} from "./AppTools.js";


/**
 * Fills in the language strings to the GUI elements.
 */
function initGUILanguage() {
  /* Header */
  appName1.innerHTML=language.GUI.appName;
  languageButton.title=language.GUI.switchLanguageHint;
  languageButton.querySelector('.menuButtonTitleShort').innerHTML=language.GUI.switchLanguageShort;
  languageButton.querySelector('.menuButtonTitleLong').innerHTML=language.GUI.switchLanguage;
  languageButton.onclick=()=>{
    localStorage.setItem('selectedLanguage',language.GUI.switchLanguageMode);
    let url=PermaLink.href;
    url=url.substr(url.indexOf("?"));
    document.location.href=language.GUI.switchLanguageFile+url;
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

/**
 * Initializes the distribution selector dropdown list
 * @param {Object} distSelect HTML select element
 * @param {Object} distributionArea HTML area for showing the data for the selected distribution
 */
function initDistributionsSelector(distSelect, distributionArea) {
  let optgroup;
  let first=true;

  let countDiscrete=0;
  let countContinuous=0;

  distSelect.appendChild(optgroup=document.createElement("optgroup"));
  optgroup.label=language.distributions.typeDiscreteFull;
  for (let name of getDistributionNames(true)) {
    countDiscrete++;
    const option=document.createElement("option");
    option.innerHTML=name;
    if (first) {option.selected="selected"; first=false;}
    optgroup.appendChild(option);
  }

  distSelect.appendChild(optgroup=document.createElement("optgroup"));
  optgroup.label=language.distributions.typeContinuousFull;
  for (let name of getDistributionNames(false)) {
    countContinuous++;
    const option=document.createElement("option");
    option.innerHTML=name;
    if (first) {option.selected="selected"; first=false;}
    optgroup.appendChild(option);
  }

  distSelect.title=countDiscrete+" "+language.distributions.countDiscrete+" + "+countContinuous+" "+language.distributions.countContinuous+" = "+(countDiscrete+countContinuous)+" "+language.distributions.countSum;

  distSelect.onchange=()=>{
    getDistributionsByName(distSelect.value).then(dist=>{
      if (dist!=null) selectDistribution(dist,distributionArea);
    });
  }

  getDistributionsByName(distSelect.value).then(dist=>{
    selectDistribution(dist,distributionArea);
  });
}

/**
 * Shows the data for the selected distribution
 * @param {Object} distribution Selected distribution
 * @param {Object} area HTML area for showing the data for the selected distribution
 */
function selectDistribution(distribution, area) {
  area.innerHTML="";
  area.appendChild(distribution.panel);
  distribution.updatePermaLink();
}

/**
 * Prepares the layout switcher which will remove the "loading..." text
 * and replace it with the app content.
 */
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

/**
 * Initializes the complete web app.
 */
function initApp() {
  initGUILanguage();
  initDistributionsSelector(distSelect,distributionArea);
  startApp();
}