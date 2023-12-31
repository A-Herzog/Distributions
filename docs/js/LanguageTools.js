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

export {selectLanguage};

/**
 * Switches to a specific language dependent file, if this file is not already to current location
 * @param {string} file Name of the language file to be used
 */
function selectLanguageFile(file) {
  if (window.location.href.endsWith(file)) return;
  window.location.href='./'+file;
}

/**
 * Initializes the language system.
 * @param {array} languages Array of language objects; each object has to have the properties "name" and "file". One fallback "default" named object has to be in the array.
 */
function selectLanguage(languages) {
  let selectedLanguage=localStorage.getItem('selectedLanguage');

  if (selectedLanguage==null) {
    const userLang=(navigator.language || navigator.userLanguage).toLocaleLowerCase();
    let preferredFile=languages.find(language=>language.name=='default').file;
    for (let language of languages) if (userLang.startsWith(language.name)) {preferredFile=language.file; break;}
    selectLanguageFile(preferredFile);
  } else {
    selectLanguageFile(languages.find(language=>language.name==selectedLanguage).file);
  }
}