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

export {LogNormalDistribution};

import {ContinuousProbabilityDistribution, getContinousDefaultCDF} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRPlus, setRPlusHTML, setRPlus0HTML, variable, frac, defF, plus, minus} from './MathMLTools.js';
import {formatNumber} from './NumberTools.js';



/**
 * Log-normal distribution
 */
class LogNormalDistribution extends ContinuousProbabilityDistribution {
  #mu;
  #sigma;
  #sigma2;
  #densityFactor1;
  #densityFactor2;

  constructor() {
    super(language.distributions.logNormal.name);

    this.support=setRPlusHTML;
    this.infoText=language.distributions.logNormal.info;
    this.wikipediaURL=language.distributions.logNormal.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=getContinousDefaultCDF();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("mean","&mu;<sub>norm</sub>",language.distributions.logNormal.parameterInfoMu+" (<i>&mu;<sub>norm</sub></i>"+isin+setRPlusHTML+")",0,false,null,false,5);
    this._addContinuousParameter("std","&sigma;<sub>norm</sub>",language.distributions.logNormal.parameterInfoSigma+" (<i>&sigma;<sub>norm</sub></i>"+isin+setRPlus0HTML+")",0,true,null,false,3);

    this._setCalcParameter("x",1);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const mu=variable("&mu;");
    const sigma=variable("&sigma;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<mn>1</mn>","<msqrt><mn>2</mn><mi>&pi;</mi><msup>"+sigma+"<mn>2</mn></msup><msup>"+x+"<mn>2</mn></msup></msqrt>");
    pdf+="<mi mathvariant='normal'>exp</mi>";
    pdf+="<mo>(</mo>";
    pdf+=minus+frac("<mn>1</mn>","<mn>2</mn><msup>"+sigma+"<mn>2</mn></msup>");
    pdf+="<msup><mrow><mo>(</mo><mi mathvariant='normal'>log</mi><ms>(</ms>"+x+"<ms>)</ms>"+minus+mu+"<mo>)</mo></mrow><mn>2</mn></msup>";
    pdf+="<mo>)</mo>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&isin;</mo>"+setRPlus;
    pdf+=endMathML;
    return pdf;
  }

  #getScipyText() {
    return `
      from math import sqrt, exp, log
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameters mean and std here

      # Translate to scipy parameters
      sigma = sqrt(log(std**2 / mean**2 + 1))
      mu = log(mean) - sigma**2 / 2
      s = sigma
      scale = exp(mu)

      # Characterstics (via scipy)
      print("mean =", np.round(stats.lognorm.mean(s, scale=scale), 3))
      print("variance =", np.round(stats.lognorm.var(s, scale=scale), 3))
      print("standard deviation =", np.round(stats.lognorm.std(s, scale=scale), 3))

      # Probability density function
      x = np.linspace(0, 20, 500)
      pdf = stats.lognorm.pdf(x, s, scale=scale)
      plt.plot(x, pdf)`;
  }

  #getPDF(values, x) {
    if (x<=0) return 0;
    if (values.std==0) return (x==values.mean)?Infinity:0;
    return this.#densityFactor1/x*Math.exp(-Math.pow((Math.log(x)-this.#mu),2)*this.#densityFactor2);
  }

  #getCDF(values, x) {
    if (x<=0) return 0;
    if (values.std==0) return (x<values.mean)?0:1;
    const stdNormX=(Math.log(x)-this.#mu)/this.#sigma;
    if (Math.abs(stdNormX)>40) return (stdNormX<0)?0:1;
    return 0.5*jStat.erfc(-stdNormX/Math.SQRT2);
  }

  _calcDistribution(values) {
    this.#sigma2=Math.log((values.std/values.mean)**2+1);
	  this.#mu=Math.log(values.mean)-this.#sigma2/2;
	  this.#sigma=Math.sqrt(this.#sigma2);

    this.#densityFactor1=1/(this.#sigma*Math.sqrt(2*Math.PI));
	  this.#densityFactor2=1/(2*this.#sigma2);

    /* Characteristics */

    const mu=variable("&mu;");
    const muNorm="<msub>"+mu+"<mi mathvariant='normal'>norm</mi></msub>";
    const sigma=variable("&sigma;");
    const sigmaNorm="<msub>"+sigma+"<mi mathvariant='normal'>norm</mi></msub>";

    const muFormula="<mi mathvariant='normal'>log</mi><mo>(</mo>"+muNorm+"<mo>)</mo>"+minus+frac("<msup>"+sigma+"<mn>2</mn></msup>","<mn>2</mn>");
    const sigma2Formula="<mi mathvariant='normal'>log</mi><mo>(</mo><msup><mrow><mo>(</mo>"+frac(sigmaNorm,muNorm)+"<mo>)</mo></mrow><mn>2</mn></msup>"+plus+"<mn>1</mn><mo>)</mo>";

    const info=[];
    info.push(["",beginMathML+mu+endMathML,"=",beginMathML+muFormula+endMathML,"&approx;",formatNumber(this.#mu)]);
    info.push(["",beginMathML+"<msup>"+sigma+"<mn>2</mn></msub>"+endMathML,"=",beginMathML+sigma2Formula+endMathML,"&approx;",formatNumber(this.#sigma2)]);
    const meanFormula=beginMathML+muNorm+endMathML;
    const varianceFormula=beginMathML+"<msubsup>"+sigma+"<mi mathvariant='normal'>norm</mi><mn>2</mn></msubsup>"+endMathML;
    const medianFormula=beginMathML+"<msup>"+variable("e")+mu+"</msup>"+endMathML;
    const modeFormula=beginMathML+"<msup>"+variable("e")+"<mrow>"+mu+minus+"<msup>"+sigma+"<mn>2</mn></msup></mrow></msup>"+endMathML;

    const meanValue=values.mean;
    const varianceValue=values.std**2;
    const medianValue=Math.exp(this.#mu);
    const modeValue=Math.exp(this.#mu-this.#sigma2);

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,medianFormula,medianValue,modeFormula,modeValue,info);

    /* Diagram */

    const that=this;
    const minX=0;
    const maxX=Math.max(20,values.mean+3*values.std);
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  #nextRandom;
  #randomAvailable=false;

  getRandomNumber(values) {
    if (!this.#randomAvailable) {
      let q=10, u=0, v=0;
      while (q==0 || q>=1) {
        u=2*Math.random()-1;
        v=2*Math.random()-1;
        q=u*u+v*v;
      }
      const p=Math.sqrt(-2*Math.log(q)/q);
      this.#randomAvailable=true;
      const product=p*this.#sigma;
      this.#nextRandom=Math.exp(v*product+this.#mu);
      return Math.exp(u*product+this.#mu);
    } else {
      this.#randomAvailable=false;
      return this.#nextRandom;
    }
  }

  fitParameters(data) {
    if (data.mean<=0 || data.std<=0) return null;
    return {mean: data.mean, std: data.std};
  }

  get canFit() {
    return true;
  }
}