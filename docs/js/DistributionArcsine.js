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

export {ArcsineDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, setRHTML, isin,  variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * Arcsine distribution
 */
class ArcsineDistribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.arcsine.name);

    this.support=setRHTML;
    this.infoText=language.distributions.arcsine.info;
    this.wikipediaURL=language.distributions.arcsine.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("a","a",language.distributions.uniform.parameterInfoa+" (<i>a</i>"+isin+setRHTML+")",null,false,null,false,5);
    this._addContinuousParameter("b","b",language.distributions.uniform.parameterInfob+" (<i>b</i>"+isin+setRHTML+")",null,false,null,false,10);

    this._setCalcParameter("x",7.5);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const pi=variable("&pi;");
    const a=variable("a");
    const b=variable("b");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<mn>1</mn>",pi+"<mo>(</mo>"+b+minus+a+"<mo>)</mo><msqrt>"+frac(x+minus+a,b+minus+a)+mul+"<mo>(</mo><mn>1</mn>"+minus+frac(x+minus+a,b+minus+a)+"<mo>)</mo></msqrt>")
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+isin+"<ms>(</ms>"+a+";"+b+"<ms>)</ms>";
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const pi=variable("&pi;");
    const arcsin=variable("arcsin");
    const a=variable("a");
    const b=variable("b");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<mn>2</mn>",pi+mul+arcsin+"<mo>(</mo><msqrt>"+frac(x+minus+a,b+minus+a)+"</msqrt><mo>)</mo>");
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+isin+"<ms>(</ms>"+a+";"+b+"<ms>)</ms>";
    cdf+=endMathML;
    return cdf;
  }

  _checkParameters(values) {
    if (values.a>values.b) {
      this._setErrorMarker("b",language.distributions.uniform.parameterInfobError);
      this._clearAllOutput();
      return false;
    }

    return true;
  }

  #getPDF(values, x) {
    if (values.a==values.b) return (x==values.a)?Infinity:0;
    x=(x-values.a)/(values.b-values.a);
    if (x<=0.01 || x>=0.99) return 0;
     return 1/(Math.PI*Math.sqrt(x*(1-x)))/(values.b-values.a);
  }

  #getCDF(values, x) {
    if (values.a==values.b) return (x<values.a)?0:1;
    x=(x-values.a)/(values.b-values.a);
    if (x<=0) return 0;
    if (x>=1) return 1;
    return 2/Math.PI*Math.asin(Math.sqrt(x));
  }

  _calcDistribution(values) {
    /* Characteristics */

    const a=variable("a");
    const b=variable("b");

    const meanFormula=beginMathML+frac(a+plus+b,"<mn>2</mn>")+endMathML;
    const varianceFormula=beginMathML+frac("<mn>1</mn>","<mn>8</mn>")+"<msup><mrow><mo>(</mo>"+b+minus+a+"<mo>)</mo></mrow><mn>2</mn></msup>"+endMathML;
    const medianFormula=beginMathML+frac(a+plus+b,"<mn>2</mn>")+endMathML;

    const meanValue=(values.a+values.b)/2;
    const varianceValue=1/8*(values.b-values.a)**2;
    const medianValue=(values.a+values.b)/2;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,medianFormula,meanValue);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,values.a-3);
    const maxX=Math.max(20,values.b+3);
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    /* p=2/pi*arcsin(sqrt(x)) => (sin(pi*p/2))^2=x */
    const u=Math.random();
    const x=(Math.sin(Math.PI*u/2))**2;
    return x*(values.b-values.a)+values.a;
  }

  fitParameters(data) {
    return {a: data.min, b: data.max};
  }

  get canFit() {
    return true;
  }
}
