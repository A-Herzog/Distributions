/*
Copyright 2025 Alexander Herzog

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

export {SawtoothRightDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * Right sawtooth distribution
 */
class SawtoothRightDistribution extends ContinuousProbabilityDistribution {
  #oneDivBMinusASquare;
  #twoDivBMinusASquare;

  constructor() {
    super(language.distributions.sawtoothRight.name);

    this.support=setRHTML;
    this.infoText=language.distributions.sawtoothRight.info;
    this.wikipediaURL=language.distributions.sawtoothRight.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("a","a",language.distributions.sawtoothRight.parameterInfoa+" (<i>a</i>"+isin+setRHTML+")",null,false,null,false,5);
    this._addContinuousParameter("b","b",language.distributions.sawtoothRight.parameterInfob+" (<i>b</i>"+isin+setRHTML+")",null,false,null,false,10);

    this._setCalcParameter("x",8);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const a=variable("a");
    const b=variable("b");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac(x+minus+a,"<msup><mrow><mo>(</mo>"+b+minus+a+"<mo>)</mo></mrow><mn>2</mn></msup>");
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=a+"<mo>&le;</mo>"+x+"<mo>&le;</mo>"+b;
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
    cdf+=frac("<mn>2</mn>"+mul+"<msup><mrow><mo>(</mo>"+x+minus+a+"<mo>)</mo></mrow><mn>2</mn></msup>","<msup><mrow><mo>(</mo>"+b+minus+a+"<mo>)</mo></mrow><mn>2</mn></msup>");
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=a+"<mo>&le;</mo>"+x+"<mo>&le;</mo>"+b;
    cdf+=endMathML;
    return cdf;
  }

  _checkParameters(values) {
    if (values.b<values.a) {
      this._setErrorMarker("b",language.distributions.sawtoothRight.parameterInfobError);
      this._clearAllOutput();
      return false;
    }

    return true;
  }

  #getPDF(values, x) {
    if (x<values.a || x>values.b) return 0;
    if (values.a==values.b) return (x==values.a)?Infinity:0;

    return this.#twoDivBMinusASquare*(x-values.a);
  }

  #getCDF(values, x) {
    if (x<values.a) return 0;
    if (x>values.b) return 1;
    if (values.a==values.b) return (x>=values.a)?1:0;

    return (x-values.a)**2*this.#oneDivBMinusASquare;
  }

  _calcDistribution(values) {
    this.#oneDivBMinusASquare=1/((values.b-values.a)**2);
    this.#twoDivBMinusASquare=2/((values.b-values.a)**2);

    /* Characteristics */

    const a=variable("a");
    const b=variable("b");

    const meanFormula=beginMathML+frac(a+plus+"<mn>2</mn>"+b,"<mn>3</mn>")+endMathML;
    const varianceFormula=beginMathML+frac("<msup><mrow><mo>(</mo>"+a+minus+b+"<mo>)</mo></mrow><mn>2</mn></msup>","<mn>18</mn>")+endMathML;

    const meanValue=(values.a+2*values.b)/3;
    const varianceValue=(values.a-values.b)**2/18;

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

    if (values.a==values.b) return values.a;

    return values.a+(values.b-values.a)*Math.sqrt(u);
  }

  fitParameters(data) {
    if (data.std<=0) return null;
    return {a: data.mean-2*Math.sqrt(2)*data.std, b: data.mean+Math.sqrt(2)*data.std};
  }

  get canFit() {
    return true;
  }
}