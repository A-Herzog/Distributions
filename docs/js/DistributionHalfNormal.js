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

export {HalfNormalDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, setRPlus0, isin, setRHTML, setRPlusHTML, setRPlus0HTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';
import {erf} from './MathTools.js';
import {formatNumber} from './NumberTools.js';

/**
 * Half normal distribution
 */
class HalfNormalDistribution extends ContinuousProbabilityDistribution {
  #theta;
  #pdfFactor1;
  #pdfFactor2;
  #cdfFactor;
  #medianFactor;

  constructor() {
    super(language.distributions.halfNormal.name);

    this.#medianFactor=0.674490; /* sqrt(pi)*erf^{-1}(1/2) */

    this.support=setRPlus0HTML;
    this.infoText=language.distributions.halfNormal.info;
    this.wikipediaURL=language.distributions.halfNormal.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("s","s",language.distributions.halfNormal.parameterInfoS+" (<i>s</i>"+isin+setRHTML+")",null,false,null,false,0);
    this._addContinuousParameter("mu","&mu;",language.distributions.halfNormal.parameterInfoMu+" (<i>&mu;</i>"+isin+setRPlusHTML+")",0,false,null,false,10);

    this._setCalcParameter("x",1);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const s=variable("s");
    const theta=variable("&theta;");
    const pi=variable("&pi;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<mn>2</mn>"+theta,pi);
    pdf+="<mi mathvariant='normal'>exp</mi>";
    pdf+="<mo>(</mo>";
    pdf+=minus+"<msup><mrow><mo>(</mo>"+x+minus+s+"<mo>)</mo></mrow><mn>2</mn></msup>"+frac("<msup>"+theta+"<mn>2</mn></msup>",pi);
    pdf+="<mo>)</mo>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&isin;</mo>"+setRPlus0;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const s=variable("s");
    const theta=variable("&theta;");
    const pi=variable("&pi;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+="<mi mathvariant='normal'>erf</mi>";
    cdf+="<mo>(</mo>";
    cdf+=frac(theta+"<mo>(</mo>"+x+minus+s+"<mo>)</mo>","<msqrt>"+pi+"</msqrt>")
    cdf+="<mo>)</mo>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo>"+setRPlus0;
    cdf+=endMathML;
    return cdf;
  }

  #getScipyText() {
    return `
      from math import sqrt, pi
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameters s and mu here

      # Translate to scipy parameters
      loc = s
      scale = mu * sqrt(pi / 2)

      # Characterstics (via scipy)
      print("mean =", np.round(stats.halfnorm.mean(loc=loc, scale=scale), 3))
      print("variance =", np.round(stats.halfnorm.var(loc=loc, scale=scale), 3))
      print("standard deviation =", np.round(stats.halfnorm.std(loc=loc, scale=scale), 3))

      # Characterstics (direct calculation)
      print("mean =", np.round(s + mu, 3))
      print("variance =", np.round(mu**2 * (pi - 2) / 2, 3))
      print("standard deviation =", np.round(mu * sqrt((pi - 2) / 2), 3))

      # Probability density function
      x = np.linspace(s - 2, 4 * mu, 500)
      pdf = stats.halfnorm.pdf(x, loc=loc, scale=scale)
      plt.plot(x, pdf)`;
  }

  #getPDF(values, x) {
    if (values.mu==0) return (x==values.s)?Infinity:0;
    if (x<values.s) return 0;
    x=x-values.s;
    return this.#pdfFactor1*Math.exp(-(x**2)*this.#pdfFactor2);
  }

  #getCDF(values, x) {
    if (values.mu==0) return (x<values.s)?0:1;
    if (x<values.s) return 0;
    x=x-values.s;
    return erf(x*this.#cdfFactor);
  }

  _calcDistribution(values) {
    this.#theta=1/values.mu;
    this.#pdfFactor1=2*this.#theta/Math.PI;
    this.#pdfFactor2=this.#theta**2/Math.PI;
    this.#cdfFactor=this.#theta/Math.sqrt(Math.PI);

    /* Characteristics */

    const s=variable("s");
    const pi=variable("&pi;");
    const mu=variable("&mu;");
    const theta=variable("&theta;");

    const info=[];
    info.push(["",beginMathML+theta+endMathML,"=",beginMathML+frac("<mn>1</mn>",mu)+endMathML,"&approx;",formatNumber(1/values.mu)]);

    const meanFormula=beginMathML+frac("<mn>1</mn>",theta)+plus+s+endMathML;
    const varianceFormula=beginMathML+frac(pi+minus+"<mn>2</mn>","<mn>2</mn><msup>"+theta+"<mn>2</mn></msup>")+endMathML;
    const medianFormula=beginMathML+frac("<msqrt>"+pi+"</msqrt>",theta)+mul+"<msup><mi mathvariant='normal'>erf</mi><mrow>"+minus+"<mn>1</mn></mrow></msup><mo>(</mo>"+frac("<mn>1</mn>","<mn>2</mn>")+"<mo>)</mo>"+plus+s;
    const modeFormula=beginMathML+s+endMathML;

    const meanValue=values.mu+values.s;
    const varianceValue=(Math.PI-2)/(2*this.#theta**2);
    const modeValue=values.s;
    const medianValue=values.mu*this.#medianFactor+values.s;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,medianFormula,medianValue,modeFormula,modeValue,info);

    /* Diagram */

    const that=this;
    const maxX=Math.max(10,values.mu+5*Math.sqrt(varianceValue));
    this._setContinuousDiagram(0,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  fitParameters(data) {
    return {mu: data.mean, s: 0};
  }

  get canFit() {
    return true;
  }
}