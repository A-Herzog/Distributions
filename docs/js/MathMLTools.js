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

export {beginMathML, endMathML, variable, plus, minus, mul, equals, isin, setN, setN0, setZ, setR, setRPlus, setRPlus0, setNHTML, setZHTML, setRHTML, setN0HTML, setRPlusHTML, setRPlus0HTML, beginFrac, middleFrac, endFrac, frac, beginBinom, middleBinom, endBinom, binom, defE, defF, defP};

import {language} from './Language.js';

const beginMathML="<math style='font-size: 107%; font-family: sans-serif;'><mrow>";
const endMathML="</mrow></math>";

/**
 * Generates MathML code for a variable.
 * @param {string} x Name of the variable
 * @returns MathML code for the variable
 */
function variable(x) {
  return "<mi>"+x+"</mi>";
}

const plus="<mo>+</mo>";
const minus="<mo>-</mo>";
const mul="<mo>&middot;</mo>";

const equals="<mo>=</mo>";
const isin="<mo>&isin;</mo>";

const setNHTML="<abbr title='"+language.numbers.N+" &#x2115;=1,2,3,...'>&#x2115;</abbr>";
const setZHTML="<abbr title='"+language.numbers.Z+" &#x2124;=...,-3,-2,-1,0,1,2,3,...'>&#x2124;</abbr>";
const setRHTML="<abbr title='"+language.numbers.R+"'>&#x211D;</abbr>";

const setN0HTML="<abbr title='"+language.numbers.N0+": 0,1,2,3,...'>&#x2115;<sub>0</sub></abbr>";
const setRPlusHTML="<abbr title='"+language.numbers.RPlus+", x&gt;0'>&#x211D;<sup>+</sup></abbr>";
const setRPlus0HTML="<abbr title='"+language.numbers.RPlus0+", x&ge;0'>&#x211D;<sup>+</sup><sub>0</sub></abbr>";

const setN="<mi mathvariant='normal'>"+setNHTML+"</mi>";
const setN0="<msub><mi mathvariant='normal'><abbr title='"+language.numbers.N0+": 0,1,2,3,...'>&#x2115;</abbr></mi><mn>0</mn></msub>";
const setZ="<mi mathvariant='normal'>"+setZHTML+"</mi>";
const setR="<mi mathvariant='normal'>"+setRHTML+"</mi>";
const setRPlus="<msup><mi mathvariant='normal'><abbr title='"+language.numbers.RPlus+", x&gt;0'>&#x211D;</abbr></mi>"+plus+"</msup>";
const setRPlus0="<msubsup><mi mathvariant='normal'><abbr title='"+language.numbers.RPlus0+", x&ge;0'>&#x211D;</abbr></mi><mn>0</mn>"+plus+"</msubsup>";

const beginFrac="<mfrac><mrow>";
const middleFrac="</mrow><mrow>";
const endFrac="</mrow></mfrac>";

/**
 * Generates MathML code for a fraction.
 * @param {string} a Numerator
 * @param {string} b Denominator
 * @returns MathML code for the fraction
 */
function frac(a,b) {
  return beginFrac+a+middleFrac+b+endFrac;
}

const beginBinom="<mo>(</mo><mfrac linethickness='0'><mrow>";
const middleBinom="</mrow><mrow>";
const endBinom="</mrow></mfrac><mo>)</mo>";

/**
 * Generates MathML code for a binomial coefficient.
 * @param {string} n n in n over k
 * @param {string} k k in n over k
 * @returns MathML code for the binomial coefficient
 */
function binom(n,k) {
  return beginBinom+n+middleBinom+k+endBinom;
}

/**
 * Generates a function definition in the Form E[x] (with a non-italic "E")
 * @param {string} e Function name
 * @param {string} x Parameter
 * @param {boolean} withEqual Add an "="?
 * @returns MathML code for the function definition
 */
function defE(e, x, withEqual=true) {
  return "<mi mathvariant='normal'>"+e+"</mi><ms>[</ms>"+x+"<ms>]</ms>"+(withEqual?"<mo>=</mo>":"");
}

/**
 * Generates a function definition in the Form f(x) (with an italic "f")
 * @param {string} f Function name
 * @param {string} x Parameter
 * @param {boolean} withEqual Add an "="?
 * @returns MathML code for the function definition
 */
function defF(f, x, withEqual=true) {
  const mode=(x=='x' || x=='<mi>x</mi>')?"ms":"mo";
  return "<mi>"+f+"</mi><"+mode+">(</"+mode+">"+x+"<"+mode+">)</"+mode+">"+(withEqual?"<mo>=</mo>":"");
}

/**
 * Generates a function definition in the Form P(x) (with a non-italic "P")
 * @param {string} x Parameter
 * @param {boolean} withEqual Add an "="?
 * @returns MathML code for the function definition
 */
function defP(x, withEqual=true) {
  return "<mi mathvariant='normal'>P</mi><ms>(</ms>"+x+"<ms>)</ms>"+(withEqual?"<mo>=</mo>":"");
}