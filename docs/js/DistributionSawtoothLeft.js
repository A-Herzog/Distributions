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

export {SawtoothLeftDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * Left sawtooth distribution
 */
class SawtoothLeftDistribution extends ContinuousProbabilityDistribution {
  #oneDivBMinusASquare;
  #twoDivBMinusASquare;

  constructor() {
    super(language.distributions.sawtoothLeft.name);

    this.support=setRHTML;
    this.infoText=language.distributions.sawtoothLeft.info;
    this.wikipediaURL=language.distributions.sawtoothLeft.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("a","a",language.distributions.sawtoothLeft.parameterInfoa+" (<i>a</i>"+isin+setRHTML+")",null,false,null,false,5);
    this._addContinuousParameter("b","b",language.distributions.sawtoothLeft.parameterInfob+" (<i>b</i>"+isin+setRHTML+")",null,false,null,false,10);

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
    pdf+=frac(b+minus+x,"<msup><mrow><mo>(</mo>"+b+minus+a+"<mo>)</mo></mrow><mn>2</mn></msup>");
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
    cdf+="<mn>1</mn>"+minus+frac("<mn>2</mn>"+mul+"<msup><mrow><mo>(</mo>"+b+minus+x+"<mo>)</mo></mrow><mn>2</mn></msup>","<msup><mrow><mo>(</mo>"+b+minus+a+"<mo>)</mo></mrow><mn>2</mn></msup>");
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=a+"<mo>&le;</mo>"+x+"<mo>&le;</mo>"+b;
    cdf+=endMathML;
    return cdf;
  }

  #getScipyText() {
    return `
      from math import sqrt
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameters a and b here

      # Translate to scipy parameters
      c = 0
      loc = a
      scale = b - a

      # Characterstics (via scipy)
      print("mean =", np.round(stats.triang.mean(c, loc=loc, scale=scale), 3))
      print("variance =", np.round(stats.triang.var(c, loc=loc, scale=scale), 3))
      print("standard deviation =", np.round(stats.triang.std(c, loc=loc, scale=scale), 3))

      # Characterstics (direct calculation)
      print("mean =", np.round((a + b + c) / 3, 3))
      print("variance =", np.round((a**2 + b**2 + c**2 - a * b - a * c - b * c) / 18, 3))
      print("standard deviation =", np.round(sqrt((a**2 + b**2 + c**2 - a * b - a * c - b * c) / 18), 3))

      # Probability density function
      x = np.linspace(a - 2, b + 2, 500)
      pdf = stats.triang.pdf(x, c, loc=loc, scale=scale)
      plt.plot(x, pdf)`;
  }

  _checkParameters(values) {
    if (values.b<values.a) {
      this._setErrorMarker("b",language.distributions.sawtoothLeft.parameterInfobError);
      this._clearAllOutput();
      return false;
    }

    return true;
  }

  #getPDF(values, x) {
    if (x<values.a || x>values.b) return 0;
    if (values.a==values.b) return (x==values.a)?Infinity:0;

    return this.#twoDivBMinusASquare*(values.b-x);
  }

  #getCDF(values, x) {
    if (x<values.a) return 0;
    if (x>values.b) return 1;
    if (values.a==values.b) return (x>=values.a)?1:0;

    return 1-(values.b-x)**2*this.#oneDivBMinusASquare;
  }

  _calcDistribution(values) {
    this.#oneDivBMinusASquare=1/((values.b-values.a)**2);
    this.#twoDivBMinusASquare=2/((values.b-values.a)**2);

    /* Characteristics */

    const a=variable("a");
    const b=variable("b");

    const meanFormula=beginMathML+frac("<mn>2</mn>"+a+plus+b,"<mn>3</mn>")+endMathML;
    const varianceFormula=beginMathML+frac("<msup><mrow><mo>(</mo>"+a+minus+b+"<mo>)</mo></mrow><mn>2</mn></msup>","<mn>18</mn>")+endMathML;
    const medianFormula=beginMathML+b+minus+frac(b+minus+a,"<msqrt><mn>2</mn></msqrt>")+endMathML;
    const modeFormula=beginMathML+a+endMathML;

    const meanValue=(2*values.a+values.b)/3;
    const varianceValue=(values.a-values.b)**2/18;
    const medianValue=values.b-(values.b-values.a)/Math.sqrt(2);
    const modeValue=values.a;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,medianFormula,medianValue,modeFormula,modeValue);

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

    return values.b-(values.b-values.a)*Math.sqrt(1-u);
  }

  fitParameters(data) {
    if (data.std<=0) return null;
    return {a: data.mean-Math.sqrt(2)*data.std, b: data.mean+2*Math.sqrt(2)*data.std};
  }

  get canFit() {
    return true;
  }
}