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

export {UQuadraticDistribution}

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRHTML, defF, variable, frac, plus, minus, mul} from './MathMLTools.js';

/**
 * U-quadratic distribution
 */
class UQuadraticDistribution extends ContinuousProbabilityDistribution {

  constructor() {
    super(language.distributions.uQuadratic.name);

    this.support=setRHTML;
    this.infoText=language.distributions.uQuadratic.info;
    this.wikipediaURL=language.distributions.uQuadratic.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("a","a",language.distributions.uQuadratic.parameterInfoa+" (<i>a</i>"+isin+setRHTML+")",null,false,null,false,2);
    this._addContinuousParameter("b","b",language.distributions.uQuadratic.parameterInfob+" (<i>b</i>"+isin+setRHTML+")",null,false,null,false,10);

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
    pdf+=frac("<mn>12</mn>","<msup><mrow><mo>(</mo>"+b+minus+a+"<mo>)</mo></mrow><mn>3</mn></msup>");
    pdf+="<msup><mrow><mo>(</mo>"+x+minus+frac(a+plus+b,"<mn>2</mn>")+"<mo>)</mo></mrow><mn>2</mn></msup>";
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
    cdf+=frac("<mn>4</mn>","<msup><mrow><mo>(</mo>"+b+minus+a+"<mo>)</mo></mrow><mn>3</mn></msup>");
    cdf+="<mo>(</mo><mrow>";
    cdf+="<msup><mrow><mo>(</mo>"+x+minus+frac(a+plus+b,"<mn>2</mn>")+"<mo>)</mo></mrow><mn>3</mn></msup>";
    cdf+=plus;
    cdf+="<msup><mrow><mo>(</mo>"+frac(a+plus+b,"<mn>2</mn>")+minus+a+"<mo>)</mo></mrow><mn>3</mn></msup>";
    cdf+="</mrow><mo>)</mo>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo><ms>[</ms>"+a+"<mo>;</mo>"+b+"<ms>]</ms>";
    cdf+=endMathML;
    return cdf;
  }

  _checkParameters(values) {
    if (values.a>values.b) {
      this._setErrorMarker("b",language.distributions.uQuadratic.parameterInfobError);
      this._clearAllOutput();
      return false;
    }

    return true;
  }

  #getPDF(values, x) {
    if (values.a==values.b) return (x==values.a)?Infinity:0;
    if (x<values.a || x>values.b) return 0;

    const alpha=12/((values.b-values.a)**3);
    const beta=(values.a+values.b)/2;

    return alpha*(x-beta)**2;
  }

  #getCDF(values, x) {
    if (values.a==values.b) return (x>=values.a)?1:0;
    if (x<values.a) return 0;
    if (x>values.b) return 1;

    const alpha=12/((values.b-values.a)**3);
    const beta=(values.a+values.b)/2;

    return alpha/3*((x-beta)**3+(beta-values.a)**3);
  }

  _calcDistribution(values) {
    /* Characteristics */

    const a=variable("a");
    const b=variable("b");

    const meanFormula=beginMathML+frac(a+plus+b,"<mn>2</mn>")+endMathML;
    const varianceFormula=beginMathML+frac("<mn>3</mn>","<mn>20</mn>")+mul+"<msup><mrow><ms>(</ms>"+b+minus+a+"<ms>)</ms></mrow><mn>2</mn></msup>"+endMathML;

    const meanValue=(values.a+values.b)/2;
    const varianceValue=3/20*(values.b-values.a)**2;

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

    const alpha=12/((values.b-values.a)**3);
    const beta=(values.a+values.b)/2;
    /*
    u=alpha/3*((x-beta)**3+(beta-values.a)**3)
    3/alpha*u=(x-beta)**3+(beta-values.a)**3
    3/alpha*u-(beta-values.a)**3=(x-beta)**3
    (3/alpha*u-(beta-values.a)**3)**(1/3)=x-beta
    */
    const v=3/alpha*u-(beta-values.a)**3;
    const w=(Math.abs(v))**(1/3);
    return ((v<0)?(-w):w)+beta;
  }
}
