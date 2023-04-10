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

export {UniformDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRHTML, variable, frac, defF, plus, minus} from './MathMLTools.js';



/**
 * Continuous uniform distribution
 */
class UniformDistribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.uniform.name);

    this.support=setRHTML;
    this.infoText=language.distributions.uniform.info;
    this.wikipediaURL=language.distributions.uniform.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("a","a",language.distributions.uniform.parameterInfoa+" (<i>a</i>"+isin+setRHTML+")",null,false,null,false,5);
    this._addContinuousParameter("b","b",language.distributions.uniform.parameterInfob+" (<i>b</i>"+isin+setRHTML+")",null,false,null,false,10);

    this._setCalcParameter("x",7);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const a=variable("a");
    const b=variable("b");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<mn>1</mn>",b+minus+a);
    pdf+=endMathML;
    pdf+=" für ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&isin;</mo><ms>[</ms>"+a+"<mo>;</mo>"+b+"<ms>]</ms>";
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const a=variable("a");
    const b=variable("b");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac(x+minus+a,b+minus+a);
    cdf+=endMathML;
    cdf+=" für ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo><ms>[</ms>"+a+"<mo>;</mo>"+b+"<ms>]</ms>";
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
    return (x<values.a || x>values.b)?0:(1/(values.b-values.a));
  }

  #getCDF(values, x) {
    if (values.a==values.b) return (x>=values.a)?1:0;
    if (x<values.a) return 0;
    if (x>values.b) return 1;
    return (x-values.a)/(values.b-values.a);
  }

  _calcDistribution(values) {
    /* Characteristics */

    const a=variable("a");
    const b=variable("b");

    const meanFormula=beginMathML+frac(a+plus+b,"<mn>2</mn>")+endMathML;
    const varianceFormula=beginMathML+frac("<msup><mrow><ms>(</ms>"+b+minus+a+"<ms>)</ms></mrow><mn>2</mn></msup>","<mn>12</mn>")+endMathML;

    const meanValue=(values.a+values.b)/2;
    const varianceValue=(values.b-values.a)**2/12;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

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
    const u=Math.random();
    return values.a+(values.b-values.a)*u;
  }
}