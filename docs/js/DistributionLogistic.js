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

export {LogisticDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setR, setRPlusHTML, setRHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * Logistic distribution
 */
class LogisticDistribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.logistic.name);

    this.support=setRHTML;
    this.infoText=language.distributions.logistic.info;
    this.wikipediaURL=language.distributions.logistic.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("mu","&mu;",language.distributions.logistic.parameterInfoMu+" (<i>&mu;</i>"+isin+setRHTML+")",null,false,null,false,5);
    this._addContinuousParameter("s","s",language.distributions.logistic.parameterInfoS+" (<i>s</i>"+isin+setRPlusHTML+")",0,false,null,false,3);

    this._setCalcParameter("x",10);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const mu=variable("&mu;");
    const s=variable("s");

    const part=defF("exp",minus+frac(x+minus+mu,s),false);
    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac(part,s+"<msup><mrow><mo>(</mo><mn>1</mn>"+plus+part+"<mo>)</mo></mrow><mn>2</mn></msup>")
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+isin+setR;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const mu=variable("&mu;");
    const s=variable("s");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<mn>1</mn>","<mn>1</mn>"+plus+defF("exp",minus+frac(x+minus+mu,s),false))
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+isin+setR;
    cdf+=endMathML;
    return cdf;
  }

  #getScipyText() {
    return `
      from math import sqrt
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameters mu and s here

      # Translate to scipy parameters
      loc = mu
      scale = s

      # Characterstics (via scipy)
      print("mean =", np.round(stats.logistic.mean(loc=loc, scale=scale), 3))
      print("variance =", np.round(stats.logistic.var(loc=loc, scale=scale), 3))
      print("standard deviation =", np.round(stats.logistic.std(loc=loc, scale=scale), 3))

      # Characterstics (direct calculation)
      print("mean =", np.round(mu, 3))
      print("variance =", np.round((s**2 * pi**2) / 3, 3))
      print("standard deviation =", np.round(s * pi / sqrt(3), 3))

      # Probability density function
      x = np.linspace(mu - 5 * s, mu + 5 * s, 500)
      pdf = stats.logistic.pdf(x, loc=loc, scale=scale)
      plt.plot(x, pdf)`;
  }

  #getPDF(values, x) {
    const part=Math.exp(-(x-values.mu)/values.s);
	  return part/(values.s*(1+part)*(1+part));
  }

  #getCDF(values, x) {
    return 1/(1+Math.exp(-(x-values.mu)/values.s));
  }

  _calcDistribution(values) {
    /* Characteristics */

    const mu=variable("&mu;");
    const s=variable("s");
    const pi=variable("&pi;");

    const meanFormula=beginMathML+mu+endMathML;
    const varianceFormula=beginMathML+frac("<msup>"+pi+"<mn>2</mn></msup>","<mn>3</mn>")+"<msup>"+s+"<mn>2</mn></msup>"+endMathML;

    const meanValue=values.mu;
    const varianceValue=values.s**2*Math.PI**2/3;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,meanFormula,meanValue,meanFormula,meanValue);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,values.mu-3*Math.sqrt(varianceValue));
    const maxX=values.mu+3*Math.sqrt(varianceValue);
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    const u=Math.random();
    /*
    u=1/(1+Math.exp(-(x-values.mu)/values.s))
    -(x-values.mu)/values.s=Math.log(1/u-1)
    x=-Math.log(1/u-1)*values.s+values.mu
    */
   return -Math.log(1/u-1)*values.s+values.mu;
  }

  fitParameters(data) {
    if (data.std<=0) return null;

    /* var=s^2*PI^2/3 <=> std=s*pi/sqrt(3) <=> std*sqrt(3)/pi=s */
    return {mu: data.mean, s: data.std*Math.sqrt(3)/Math.PI};
  }

  get canFit() {
    return true;
  }
}
