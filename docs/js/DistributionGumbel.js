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

export {GumbelDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setR, setRHTML, setRPlusHTML, variable, frac, defF, minus, mul} from './MathMLTools.js';
import {formatNumber} from './NumberTools.js';



/**
 * Gumbel distribution
 */
class GumbelDistribution extends ContinuousProbabilityDistribution {
  /**
   * Approximation of Euler's constant
   * see https://mathworld.wolfram.com/Euler-MascheroniConstantApproximations.html
   */
  #euler;

  #betaFactor;

  constructor() {
    super(language.distributions.gumbel.name);

    this.#euler=Math.PI/(2*Math.E);
    this.#betaFactor=Math.sqrt(6)/Math.PI;

    this.support=setRHTML;
    this.infoText=language.distributions.gumbel.info;
    this.wikipediaURL=language.distributions.gumbel.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("mean","mean",language.distributions.gumbel.parameterInfoMean+" (<i>mean</i>"+isin+setRPlusHTML+")",null,false,null,false,5);
    this._addContinuousParameter("std","std",language.distributions.gumbel.parameterInfoStd+" (<i>std</i>"+isin+setRPlusHTML+")",0,false,null,false,3);

    this._setCalcParameter("x",1);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const exp=variable("exp");
    const mu=variable("&mu;");
    const beta=variable("&beta;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac(defF(exp,minus+frac(x+minus+mu,beta)+minus+defF(exp,minus+frac(x+minus+mu,beta),false),false),beta);
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&isin;</mo>"+setR;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const exp=variable("exp");
    const mu=variable("&mu;");
    const beta=variable("&beta;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=defF(exp,minus+defF(exp,minus+frac(x+minus+mu,beta),false),false);
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo>"+setR;
    cdf+=endMathML;
    return cdf;
  }

  #getScipyText() {
    return `
      from math import sqrt, exp
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameters mean and std here

      # Translate to scipy parameters
      scale = std * sqrt(6) / np.pi  # beta
      loc = mean - scale * pi / 2 / exp(1)  # mu (pi/2/e is a approximation of the Euler-Mascheroni constant)

      # Characterstics (via scipy)
      print("mean =", np.round(stats.gumbel_r.mean(loc=loc, scale=scale), 3))
      print("variance =", np.round(stats.gumbel_r.var(loc=loc, scale=scale), 3))
      print("standard deviation =", np.round(stats.gumbel_r.std(loc=loc, scale=scale), 3))

      # Probability density function
      x = np.linspace(mean - 4 * std, mean + 4 * std, 500)
      pdf = stats.gumbel_r.pdf(x, loc=loc, scale=scale)
      plt.plot(x, pdf)`;
  }

  #getPDF(values, x) {
    if (values.std==0) return (x==values.mean)?Infinity:0;

    const beta=values.std*this.#betaFactor;
		const mu=values.mean-beta*this.#euler;

    const z=(x-mu)/beta;
    const t=Math.exp(-z);
    return Math.exp(-z-t)/beta;
  }

  #getCDF(values, x) {
    if (values.std==0) return (x<values.mean)?0:1;

    const beta=values.std*this.#betaFactor;
		const mu=values.mean-beta*this.#euler;

    const z=(x-mu)/beta;
    return Math.exp(-Math.exp(-z));
  }

  _calcDistribution(values) {
    const beta=values.std*this.#betaFactor;
		const mu=values.mean-beta*this.#euler;

    /* Characteristics */

    const betaFormula=variable("&beta;");
    const muFormula=variable("&mu;");

    const info=[];
    info.push(["",beginMathML+betaFormula+endMathML,"=",beginMathML+"<mi>std</mi>"+mul+frac("<msqrt><mn>6</mn></msqrt>","<mi>&pi;</mi>")+endMathML,"&approx;",formatNumber(beta)]);
    info.push(["",beginMathML+muFormula+endMathML,"=",beginMathML+"<mi>mean</mi>"+minus+"<mi>beta</mi>"+mul+"<abbr title='"+language.distributions.EulerMascheroni+"'>"+frac("<mi>&pi;</mi>","<mn>2</mn><mi>e</mi>")+"</abbr>"+endMathML,"&approx;",formatNumber(mu)]);
    const meanFormula=beginMathML+"<mo>mean</mo>"+endMathML;
    const varianceFormula=beginMathML+"<msup><mo>std</mo><mn>2</mn></msup>"+endMathML;
    const medianFormula=beginMathML+muFormula+minus+betaFormula+mul+defF("log",defF("log","<mn>2</mn>",false),false)+endMathML;
    const modeFormula=beginMathML+muFormula+endMathML;

    const meanValue=values.mean;
    const varianceValue=values.std**2;
    const medianValue=mu-beta*Math.log(Math.log(2));
    const modeValue=mu;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,medianFormula,medianValue,modeFormula,modeValue,info);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,values.mean-3*values.std);
    const maxX=Math.max(20,values.mean+3*values.std);
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    const beta=values.std*this.#betaFactor;
		const mu=values.mean-beta*this.#euler;

    /* p=exp(-exp(-z)) <=> -log(-log(p))=z */
    const p=Math.random();
    const z=-Math.log(-Math.log(p));

    /* z=(x-mu)/beta <=> z*beta+mu */
    return z*beta+mu;
  }

  fitParameters(data) {
    if (data.std<=0) return null;
    return {mean: data.mean, std: data.std};
  }

  get canFit() {
    return true;
  }
}
