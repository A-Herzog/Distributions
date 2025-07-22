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

export {HyperbolicSecantDistribution}

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setR, setRHTML, setRPlusHTML, defF, variable, frac, minus, mul} from './MathMLTools.js';

/**
 * Hyperbolic secant distribution
 */
class HyperbolicSecantDistribution extends ContinuousProbabilityDistribution {

  constructor() {
    super(language.distributions.hyperbolicSecant.name);

    this.support=setRHTML;
    this.infoText=language.distributions.hyperbolicSecant.info;
    this.wikipediaURL=language.distributions.hyperbolicSecant.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("mu","&mu;",language.distributions.hyperbolicSecant.parameterInfoMu+" (<i>&mu;</i>"+isin+setRHTML+")",null,false,null,false,5);
    this._addContinuousParameter("sigma","&sigma;",language.distributions.hyperbolicSecant.parameterInfoSigma+" (<i>&sigma;</i>"+isin+setRPlusHTML+")",0,false,null,false,3);

    this._setCalcParameter("x",8);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const mu=variable("&mu;");
    const sigma=variable("&sigma;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<mn>1</mn>",defF("cosh","<mn>&pi;</mn>"+frac(x+minus+mu,"<mn>2</mn>"+sigma),false)+mul+"<mn>2</mn>"+sigma);
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
    const mu=variable("&mu;");
    const sigma=variable("&sigma;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<mn>2</mn>","<mn>&pi;</mn>")+defF("atan",defF("exp","<mn>&pi;</mn>"+frac(x+minus+mu,"<mn>2</mn>"+sigma),false),false);
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo>"+setR;
    cdf+=endMathML;
    return cdf;
  }

  #getScipyText() {
    return `
      from math import sqrt
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameters mu and sigma here

      # Translate to scipy parameters
      loc = mu
      scale = sigma / sqrt(pi**2 / 4)

      # Characterstics (via scipy)
      print("mean =", np.round(stats.hypsecant.mean(loc=loc, scale=scale), 3))
      print("variance =", np.round(stats.hypsecant.var(loc=loc, scale=scale), 3))
      print("standard deviation =", np.round(stats.hypsecant.std(loc=loc, scale=scale), 3))

      # Characterstics (direct calculation)
      print("mean =", np.round(mu, 3))
      print("variance =", np.round(sigma**2, 3))
      print("standard deviation =", np.round(sigma, 3))

      # Probability density function
      x = np.linspace(mu - 4 * sigma, mu + 4 * sigma, 500)
      pdf = stats.hypsecant.pdf(x, loc=loc, scale=scale)
      plt.plot(x, pdf)`;
  }

  #getPDF(values, x) {
    if (values.sigma==0) return (x==values.mu)?Infinity:0;

    const z=(x-values.mu)/values.sigma;
	return (1/(Math.cosh(Math.PI*z/2)*2*values.sigma));
  }

  #getCDF(values, x) {
    if (values.sigma==0) return (x==values.mu)?Infinity:0;

    const z=(x-values.mu)/values.sigma;
    const arg=Math.PI*z*0.5;
	if (arg>=750) return 1;
	return (2*Math.atan(Math.exp(arg)))/Math.PI;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const mu=variable("&mu;");
    const sigma=variable("&sigma;");

    const meanFormula=beginMathML+mu+endMathML;
    const varianceFormula=beginMathML+sigma+endMathML;

    const meanValue=values.mu;
    const varianceValue=values.sigma**2;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,meanFormula,meanValue,meanFormula,meanValue);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,values.mu-2*values.sigma);
    const maxX=Math.max(10,values.mu+2*values.sigma);
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    const u=Math.random();

    /*
    y=2/pi*atan(exp(pi*(x-mu)/(2*sigma)))
    log(tan(y*pi/2))=pi*(x-mu)/(2*sigma)
    log(tan(y*pi/2))/pi*2*sigma+mu=x
    */
    return Math.log(Math.tan(u*Math.PI/2))/Math.PI*2*values.sigma+values.mu;
  }

  fitParameters(data) {
    if (data.std<=0) return null;
    return {mu: data.mean, sigma: data.std};
  }

  get canFit() {
    return true;
  }
}
