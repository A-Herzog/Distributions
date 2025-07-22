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

export {NormalDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, setR, setRHTML, isin, setRPlus0HTML, variable, frac, defF, minus} from './MathMLTools.js';
import {gaussianRandomPolar} from './MathTools.js';



/**
 * Normal distribution
 */
class NormalDistribution extends ContinuousProbabilityDistribution {
  #pdfPreFactor;
  #cdfFactor;

  constructor() {
    super(language.distributions.normal.name);

    this.support=setRHTML;
    this.infoText=language.distributions.normal.info;
    this.wikipediaURL=language.distributions.normal.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("mu","&mu;",language.distributions.normal.parameterInfoMu+" (<i>&mu;</i>"+isin+setRHTML+")",null,false,null,false,0);
    this._addContinuousParameter("sigma","&sigma;",language.distributions.normal.parameterInfoSigma+" (<i>&sigma;</i>"+isin+setRPlus0HTML+")",0,true,null,false,1);

    this._setCalcParameter("x",1);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const mu=variable("&mu;");
    const sigma=variable("&sigma;");
    const phi=variable("&phi;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=defF(phi,x);
    pdf+=frac("<mn>1</mn>","<msqrt><mn>2</mn><mi>&pi;</mi><msup>"+sigma+"<mn>2</mn></msup></msqrt>");
    pdf+="<mi mathvariant='normal'>exp</mi>";
    pdf+="<mo>(</mo>";
    pdf+=minus+frac("<mn>1</mn>","<mn>2</mn>");
    pdf+="<msup><mrow><mo>(</mo>"+frac(x+minus+mu,sigma)+"<mo>)</mo></mrow><mn>2</mn></msup>";
    pdf+="<mo>)</mo>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&isin;</mo>"+setR;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const t=variable("t");
    const x=variable("x");
    const phi=variable("&phi;");
    const Phi=variable("&Phi;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=defF(Phi,x);
    cdf+="<msubsup><mo>&int;</mo><mrow>"+minus+"<mi>&infin;</mi></mrow>"+x+"</msubsup>";
    cdf+=defF(phi,t,false)+"<mo>dt</mo>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo>"+setR;
    cdf+=endMathML;
    return cdf;
  }

#getScipyText() {
    return `
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameters mu and sigma here

      # Translate to scipy parameters
      loc = mu
      scale = sigma

      # Characterstics (via scipy)
      print("mean =", np.round(stats.norm.mean(loc=loc, scale=scale), 3))
      print("variance =", np.round(stats.norm.var(loc=loc, scale=scale), 3))
      print("standard deviation =", np.round(stats.norm.std(loc=loc, scale=scale), 3))

      # Characterstics (direct calculation)
      mean = np.round(mu, 3)
      variance = np.round(sigma**2, 3)
      std = np.round(sigma, 3)
      print("mean =", mean)
      print("variance =", variance)
      print("standard deviation =", std)

      # Probability density function
      x = np.linspace(mu - 5 * sigma, mu + 5 * sigma, 500)
      pdf = stats.norm.pdf(x, loc=loc, scale=scale)
      plt.plot(x, pdf)`;
  }

  #getPDF(values, x) {
    if (values.sigma==0) return (x==values.mu)?Infinity:0;
    return this.#pdfPreFactor*Math.exp(-(((x-values.mu)/values.sigma)**2)/2);
  }

  #getCDF(values, x) {
    if (values.sigma==0) return (x<values.mu)?0:1;
    return 0.5*(1+jStat.erf(this.#cdfFactor*(x-values.mu)));
  }

  _calcDistribution(values) {
    this.#pdfPreFactor=1/Math.sqrt(2*Math.PI*values.sigma**2);
    this.#cdfFactor=1/Math.sqrt(2*values.sigma**2);

    /* Characteristics */

    const mu=variable("&mu;");
    const sigma=variable("&sigma;");

    const meanFormula=beginMathML+mu+endMathML;
    const varianceFormula=beginMathML+"<msup>"+sigma+"<mn>2</mn></msup>"+endMathML;
    const medianFormula=beginMathML+mu+endMathML;
    const modeFormula=beginMathML+mu+endMathML;

    const meanValue=values.mu;
    const varianceValue=values.sigma**2;
    const medianValue=values.mu;
    const modeValue=values.mu;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,medianFormula,medianValue,modeFormula,modeValue);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,values.mu-3*values.sigma);
    const maxX=Math.max(10,values.mu+3*values.sigma);
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    return gaussianRandomPolar(values.mu,values.sigma);
  }

  fitParameters(data) {
    if (data.std<=0) return null;
    return {mu: data.mean, sigma: data.std};
  }

  get canFit() {
    return true;
  }
}