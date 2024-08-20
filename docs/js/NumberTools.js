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

export {getFloat, getPositiveFloat, getNotNegativeFloat, getInt, getPositiveInt, getNotNegativeInt, formatNumber, formatNumberMax, formatNumberWithTitle, formatPercent, getDecimalSeparatorCharacter}

/**
 * Parses a string to a floating point number
 * @param {string} str String to be parsed to a floating point number (decimal separator has to be ".")
 * @returns Floating point number or NaN, if the string could not be parsed to a floating point number
 */
function parseFloatStrict(str) {
  if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(str)) return Number(str);
  return NaN;
}

/**
 * Parses a string to an integer number
 * @param {string} str String to be parsed to an integer number
 * @returns Integer number or NaN, if the string could not be parsed to an integer number
 */
function parseIntStrict(str) {
  if(/^(\-|\+)?([0-9]+|Infinity)$/.test(str)) return Number(str);
  return NaN;
}

/**
 * If the parameter is an object and has a "value" property, the content of this property is returned. Otherwise the parameter itself is returned.
 * @param {any} elementOrString Object with "value" property or String
 * @returns Content of the "value" property of (for example in case of a string) the parameter itself
 */
function getString(elementOrString) {
  if (typeof(elementOrString)=='object' && typeof(elementOrString.value)=='string') return elementOrString.value;
  return elementOrString;
}

/**
 * Parses a string or the content of a value attribute of a HTML element to a floating point number
 * @param {an} elementOrString HTML element with value property or a string
 * @returns Content as floating point number or null, if the content could not be parsed to a floating point number
 */
function getFloat(elementOrString) {
  let str=getString(elementOrString);
  if (typeof(str.replaceAll)=='function') str=str.replaceAll(",",".");
  const num=parseFloatStrict(str);
  if (isNaN(num)) return null;
  return num;
}

/**
 * Parses a string or the content of a value attribute of a HTML element to a floating point number
 * @param {an} elementOrString HTML element with value property or a string
 * @returns Content as floating point number or null, if the content could not be parsed to a positive floating point number
 */
function getPositiveFloat(elementOrString) {
  let result=getFloat(elementOrString);
  if (result==null || result<=0) return null;
  return result;
}

/**
 * Parses a string or the content of a value attribute of a HTML element to a floating point number
 * @param {an} elementOrString HTML element with value property or a string
 * @returns Content as floating point number or null, if the content could not be parsed to a non-negative floating point number
 */
function getNotNegativeFloat(elementOrString) {
  let result=getFloat(elementOrString);
  if (result==null || result<0) return null;
  return result;
}

/**
 * Parses a string or the content of a value attribute of a HTML element to an integer number
 * @param {an} elementOrString HTML element with value property or a string
 * @returns Content as integer number or null, if the content could not be parsed to an integer number
 */
function getInt(elementOrString) {
const str=getString(elementOrString);
const num=parseIntStrict(str);
if (isNaN(num)) return null;
return num;
}

/**
 * Parses a string or the content of a value attribute of a HTML element to an integer number
 * @param {an} elementOrString HTML element with value property or a string
 * @returns Content as integer number or null, if the content could not be parsed to a positive integer number
 */
function getPositiveInt(elementOrString) {
  let result=getInt(elementOrString);
  if (result==null || result<=0) return null;
  return result;
}

/**
 * Parses a string or the content of a value attribute of a HTML element to an integer number
 * @param {an} elementOrString HTML element with value property or a string
 * @returns Content as integer number or null, if the content could not be parsed to a non-negative integer number
 */
function getNotNegativeInt(elementOrString) {
  let result=getInt(elementOrString);
  if (result==null || result<0) return null;
  return result;
}

/**
 * Formats a number as a local string.
 * @param {Number} number Number to be formatted
 * @param {Number} digits Maximum number of decimal digits to use (if missing: use locale default value)
 * @returns Formatted number
 */
function formatNumber(number, digits) {
  if (typeof(digits)=='undefined') return number.toLocaleString();

  let usedDigits=0;
  let x=number%1;
  while (x!=0 && usedDigits<digits) {
    x*=10;
    x=x%1;
    usedDigits++;
  }

  let str=number.toLocaleString(undefined, {minimumFractionDigits: usedDigits});
  const index=str.indexOf(getDecimalSeparatorCharacter());
  if (index>=0) {
    while (str[str.length-1]=='0') str=str.substring(0,str.length-1);
    if (str[str.length-1]=='.' || str[str.length-1]==',') str=str.substring(0,str.length-1);
  }
  return str;
}

/**
 * Formats a number as a local string with maximum number of digits.
 * @param {Number} number Number to be formatted
 * @returns Formatted number
 */
function formatNumberMax(number) {
  return formatNumber(number,14);
}

/**
 * Formats a number as a local string and returns a string containing a HTML span
 * containing the number and a title attribute with more digits.
 * @param {Number} number Number to be formatted
 * @param {Number} digits Maximum number of decimal digits to use (if missing: use locale default value)
 * @returns Formatted number
 */
function formatNumberWithTitle(number, digits) {
  return "<span title='"+formatNumber(number,8)+"'>"+formatNumber(number,digits)+"</span>";
}

/**
 * Formats a number as a local string percent value.
 * @param {Number} number Number to be formatted
 * @param {Number} digits Maximum number of decimal digits to use (if missing: use locale default value)
 * @returns Formatted number
 */
function formatPercent(number, digits) {
  return formatNumber(number*100,digits)+"%";
}

/**
 * Returns the language default decimal separator character
 * @returns Language default decimal separator character
 */
function getDecimalSeparatorCharacter() {
  const n=1.1;
  return n.toLocaleString().substring(1,2);
}