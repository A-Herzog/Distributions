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

export {HalfCauchyDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setR, setRHTML, setRPlusHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * Half Cauchy distribution
 */
class HalfCauchyDistribution extends ContinuousProbabilityDistribution {
	#densityFactor;
	#cumulativeFactor=2/Math.PI;
	#inverseSigmaSqr;
	#randomFactor=Math.PI/2;

  constructor() {
    super(language.distributions.halfCauchy.name);

    this.support=setRHTML;
    this.infoText=language.distributions.halfCauchy.info;
    this.wikipediaURL=language.distributions.halfCauchy.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("mu","&mu;",language.distributions.halfCauchy.parameterInfoMu+" (<i>&mu;</i>"+isin+setRHTML+")",null,false,null,false,0);
    this._addContinuousParameter("sigma","&sigma;",language.distributions.halfCauchy.parameterInfoSigma+" (<i>&sigma;</i>"+isin+setRPlusHTML+")",0,false,null,false,3);

    this._setCalcParameter("x",5);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const mu=variable("&mu;");
    const sigma=variable("&sigma;");
    const pi="<mi mathvariant='normal'>&pi;</mi>";

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<mn>2</mn>",pi+sigma)+mul;
    pdf+=frac("<mn>1</mn>","<mn>1</mn>"+plus+"<msup><mrow><mo>(</mo>"+x+minus+mu+"<mo>)</mo></mrow><mn>2</mn></msup><mo>/</mo><msup>"+sigma+"<mn>2</mn></msup>");
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&ge;</mo>"+mu;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const mu=variable("&mu;");
    const sigma=variable("&sigma;");
    const pi="<mi mathvariant='normal'>&pi;</mi>";

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<mn>2</mn>",pi)+mul;
    cdf+=defF(variable("arctan"),frac(x+minus+mu,sigma),false);
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&ge;</mo>"+mu;
    cdf+=endMathML;
    return cdf;
  }

  #getScipyText() {
    return `
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameters mu and sigma here

      # Parameters for scipy.stats.halfcauchy
      loc = mu
      scale = sigma

      # Characteristics of the Cauchy distribution
      print("mean =", np.round(stats.halfcauchy.mean(loc=loc, scale=scale), 3))
      print("variance =", np.round(stats.halfcauchy.var(loc=loc, scale=scale), 3))
      print("standard deviation =", stats.halfcauchy.std(loc=loc, scale=scale))
      print("skewness =", np.round(stats.halfcauchy.stats(loc=loc, scale=scale, moments='s'), 3))
      print("kurtosis =", np.round(stats.halfcauchy.stats(loc=loc, scale=scale, moments='k'), 3))
      print("entropy =", np.round(stats.halfcauchy.entropy(loc=loc, scale=scale), 3))

      # Plots of pdf and cdf
      x = np.linspace(mu - 2, mu + 5 * sigma, 500)
      pdf = stats.halfcauchy.pdf(x, loc=loc, scale=scale)
      plt.plot(x, pdf)`;
  }

  #getPDF(values, x) {
    if (x<values.mu) return 0;
	  return this.#densityFactor/(1+(x-values.mu)**2*this.#inverseSigmaSqr);
  }

  #getCDF(values, x) {
    if (x<values.mu) return 0;
	  return this.#cumulativeFactor*Math.atan((x-values.mu)/values.sigma);
  }

  _calcDistribution(values) {
	this.#densityFactor=2/Math.PI/values.sigma;
	this.#inverseSigmaSqr=1/(values.sigma**2);

    /* Characteristics */

    const muFormula=beginMathML+variable("&mu;")+endMathML;
    this._setContinuousCharacteristics(null,null,null,null,null,null,muFormula,values.mu);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,values.mu-2);
    const maxX=Math.max(0,values.mu+Math.max(15,values.sigma*5));
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    const u=Math.random();
    return values.sigma*Math.tan(this.#randomFactor*u)+values.mu;
  }
}