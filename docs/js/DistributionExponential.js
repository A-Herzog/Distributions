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

export {ExponentialDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, setRPlus0HTML, isin, setRPlusHTML, variable, frac, defF, minus} from './MathMLTools.js';



/**
 * Exponential distribution
 */
class ExponentialDistribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.exponential.name);

    this.support=setRPlus0HTML;
    this.infoText=language.distributions.exponential.info;
    this.wikipediaURL=language.distributions.exponential.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("lambda","&lambda;",language.distributions.exponential.parameterInfoLambda+" (<i>&lambda;</i>"+isin+setRPlusHTML+")",0,false,null,false,2);

    this._setCalcParameter("x",1);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const lambda=variable("&lambda;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=lambda+"<msup><mi mathvariant='normal'>e</mi><mrow>"+minus+lambda+x+"</mrow></msup>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&ge;</mo><mn>0</mn>";
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const lambda=variable("&lambda;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+="<mn>1</mn>"+minus;
    cdf+="<msup><mi mathvariant='normal'>e</mi><mrow>"+minus+lambda+x+"</mrow></msup>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&ge;</mo><mn>0</mn>";
    cdf+=endMathML;
    return cdf;
  }

  #getScipyText() {
    return `
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameter lmbda here

      # Translate to scipy parameters
      scale = 1 / lmbda

      # Characterstics (via scipy)
      print("mean =", np.round(stats.expon.mean(scale=scale), 3))
      print("variance =", np.round(stats.expon.var(scale=scale), 3))
      print("standard deviation =", np.round(stats.expon.std(scale=scale), 3))

      # Characterstics (direct calculation)
      print("mean =", np.round(1 / lmbda, 3))
      print("variance =", np.round(1 / (lmbda ** 2), 3))
      print("standard deviation =", np.round(1 / lmbda, 3))

      # Probability density function
      x = np.linspace(0, 10, 500)
      pdf = stats.expon.pdf(x, scale=scale)
      plt.plot(x, pdf)`;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const lambda=variable("&lambda;");

    const meanFormula=beginMathML+frac("<mn>1</mn>",lambda)+endMathML;
    const varianceFormula=beginMathML+frac("<mn>1</mn>","<msup>"+lambda+"<mn>2</mn></msup>")+endMathML;
    const medianFormula=beginMathML+frac(defF("log","<mn>2</mn>",false),lambda)+endMathML;
    const modeFormula=beginMathML+"<mn>0</mn>"+endMathML;

    const meanValue=1/values.lambda;
    const varianceValue=1/(values.lambda**2);
    const medianValue=Math.log(2)/values.lambda;
    const modeValue=0;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,medianFormula,medianValue,modeFormula,modeValue);

    /* Diagram */

    this._setContinuousDiagram(0,Math.max(10,meanValue*5),x=>(x<0)?0:(values.lambda*Math.exp(-values.lambda*x)),x=>(x<0)?0:(1-Math.exp(-values.lambda*x)));
  }

  calcProbability(values, x) {
    return [(x<0)?0:(values.lambda*Math.exp(-values.lambda*x)),(x<0)?0:(1-Math.exp(-values.lambda*x))];
  }

  getRandomNumber(values) {
    const u=Math.random();
    /* F=1-exp(-lambda*x) <=> x=-log(1-F)/lambda */
    return -Math.log(1-u)/values.lambda;
  }

  fitParameters(data) {
    if (data.mean<=0) return null;
    return {lambda: 1/data.mean};
  }

  get canFit() {
    return true;
  }
}