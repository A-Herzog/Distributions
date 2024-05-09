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

export {format, loadSearchStringParameters};

/**
 * Javascript variant of the usual format / printf function.
 * @param {String} str String in which {0}, {1} etc. are to be replaced
 * @param  {...String} args Replace values for the placeholders
 * @returns String with values inserted at the placeholder positions
 */
function format(str, ...args) {
  return str.replace(/{(\d+)}/g,(match,number)=>(typeof(args[number])!='undefined')?args[number]:match);
};

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