/*
Copyright 2024 Alexander Herzog

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

export {ReciprocalDistribution}

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRPlus, setRHTML, defF, variable, frac, plus, minus, mul} from './MathMLTools.js';

/**
 * Reciprocal distribution
 */
class ReciprocalDistribution extends ContinuousProbabilityDistribution {

  constructor() {
    super(language.distributions.reciprocal.name);

    this.support=beginMathML+"<mo>[</mo><mo>-</mo><mi>R</mi><mo>,</mo><mi>R</mi><mo>]</mo>"+endMathML+", "+beginMathML+"<mo>R</mo>"+isin+setRPlus+endMathML;
    this.infoText=language.distributions.reciprocal.info;
    this.wikipediaURL=language.distributions.reciprocal.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("a","a",language.distributions.reciprocal.parameterInfoa+" (<i>a</i>"+isin+setRHTML+")",null,false,null,false,2);
    this._addContinuousParameter("b","b",language.distributions.reciprocal.parameterInfob+" (<i>b</i>"+isin+setRHTML+")",null,false,null,false,10);

    this._setCalcParameter("x",3);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const a=variable("a");
    const b=variable("b");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<mn>1</mn>",x+"<mo>log</mo>"+frac(b,a));
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
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
    cdf+=frac("<mo>log</mo>"+frac(x,a),"<mo>log</mo>"+frac(b,a))
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo><ms>[</ms>"+a+"<mo>;</mo>"+b+"<ms>]</ms>";
    cdf+=endMathML;
    return cdf;
  }

  _checkParameters(values) {
    if (values.a>values.b) {
      this._setErrorMarker("b",language.distributions.reciprocal.parameterInfobError);
      this._clearAllOutput();
      return false;
    }

    return true;
  }

  #getPDF(values, x) {
    if (values.a==values.b) return (x==values.a)?Infinity:0;
    if (x<values.a || x>values.b) return 0;

    return 1/(x*Math.log(values.b/values.a));
  }

  #getCDF(values, x) {
    if (values.a==values.b) return (x>=values.a)?1:0;
    if (x<values.a) return 0;
    if (x>values.b) return 1;

    return Math.log(x/values.a)/Math.log(values.b/values.a);
  }

  _calcDistribution(values) {
    /* Characteristics */

    const a=variable("a");
    const b=variable("b");

    const meanFormula=beginMathML+frac(b+minus+a,"<mo>log</mo><mo>(</mo>"+frac(b,a)+"<mo>)</mo>")+endMathML;
    const varianceFormula=beginMathML+frac("<msup>"+b+"<mn>2</mn></msup>"+minus+"<msup>"+a+"<mn>2</mn></msup>","<mo>log</mo>"+frac(b,a))+minus+"<msup><mrow><mo>(</mo>"+frac(b+minus+a,"<mo>log</mo>"+frac(b,a))+"<mo>)</mo></mrow><mn>2</mn></msup>"+endMathML;

    const meanValue=(values.b-values.a)/Math.log(values.b/values.a);
    const varianceValue=(values.b**2-values.a**2)/(2*Math.log(values.b/values.a))-((values.b-values.a)/Math.log(values.b/values.a))**2;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,values.a-3);
    const maxX=Math.max(10,values.b+3);
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    const u=Math.random();
    /*
    u=log(x/a)/log(b/a)
    u*log(b/a)=log(x/a)
    a*exp(u*log(b/a))=x
    */
    return values.a*Math.exp(u*Math.log(values.b/values.a));
  }
}
