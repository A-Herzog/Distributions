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

export {GammaDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRPlus, setRPlusHTML, variable, frac, defF, minus, mul} from './MathMLTools.js';



/**
 * Gamma distribution
 */
class GammaDistribution extends ContinuousProbabilityDistribution {
  #pdfFactor;
  #cdfFactor;

  constructor() {
    super(language.distributions.gamma.name);

    this.support=setRPlusHTML;
    this.infoText=language.distributions.gamma.info;
    this.wikipediaURL=language.distributions.gamma.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("alpha","&alpha;",language.distributions.gamma.parameterInfoAlpha+" (<i>&alpha;</i>"+isin+setRPlusHTML+")",0,false,null,false,4);
    this._addContinuousParameter("beta","&beta;",language.distributions.gamma.parameterInfoBeta+" (<i>&beta;</i>"+isin+setRPlusHTML+")",0,false,null,false,2.5);

    this._setCalcParameter("x",10);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const alpha=variable("&alpha;");
    const beta=variable("&beta;");
    const Gamma="<mi mathvariant='normal'><abbr title='"+language.functions.Gamma+"'>&Gamma;</abbr></mi>";

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<msup>"+x+"<mrow>"+alpha+minus+"<mn>1</mn></mrow></msup><msup><mi mathvariant='normal'>e</mi><mrow>"+minus+frac(x,beta)+"</mrow></msup>","<msup>"+beta+alpha+"</msup>"+Gamma+"<ms>(</ms>"+alpha+"<ms>)</ms>");
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&isin;</mo>"+setRPlus;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const alpha=variable("&alpha;");
    const beta=variable("&beta;");
    const Gamma="<mi mathvariant='normal'><abbr title='"+language.functions.Gamma+"'>&Gamma;</abbr></mi>";
    const gamma="<mi mathvariant='normal'><abbr title='"+language.functions.gamma+"'>&gamma;</abbr></mi>";

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac(gamma+"<mo>(</mo>"+alpha+"<mo>,</mo>"+frac(x,beta)+"<mo>)</mo>",Gamma+"<mo>(</mo>"+alpha+"<mo>)</mo>");
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo>"+setRPlus;
    cdf+=endMathML;
    return cdf;
  }

  #getScipyText() {
    return `
      from math import sqrt
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameters alpha and beta here

      # Translate to scipy parameters
      a = alpha
      scale = beta

      # Characterstics (via scipy)
      print("mean =", np.round(stats.gamma.mean(a, scale=scale), 3))
      print("variance =", np.round(stats.gamma.var(a, scale=scale), 3))
      print("standard deviation =", np.round(stats.gamma.std(a, scale=scale), 3))

      # Characterstics (direct calculation)
      print("mean =", np.round(alpha * beta, 3))
      print("variance =", np.round(alpha * (beta ** 2), 3))
      print("standard deviation =", np.round(sqrt(alpha) * beta, 3))

      # Probability density function
      x = np.linspace(0, 50, 500)
      pdf = stats.gamma.pdf(x, a, scale=scale)
      plt.plot(x, pdf)`;
  }


  #getPDF(values, x) {
    if (x<=0) return 0;
    return x**(values.alpha-1)*Math.exp(-x/values.beta)*this.#pdfFactor;
  }

  #getCDF(values, x) {
    if (x<=0) return 0;
    return this.#cdfFactor*jStat.gammap(values.alpha,x/values.beta);
  }

  _calcDistribution(values) {
    this.#pdfFactor=1/(values.beta**values.alpha*jStat.gammafn(values.alpha));
    this.#cdfFactor=1/jStat.gammafn(values.alpha);

    /* Characteristics */

    const alpha=variable("&alpha;");
    const beta=variable("&beta;");

    const meanFormula=beginMathML+alpha+mul+beta+endMathML;
    const varianceFormula=beginMathML+alpha+mul+"<msup>"+beta+"<mn>2</mn></msup>"+endMathML;
    const modeFormula=(values.alpha>=1)?(beginMathML+"<mo>(</mo>"+alpha+minus+"<mn>1</mn><mo>)</mo>"+beta+endMathML):(beginMathML+"<mn>0</mn>"+endMathML);

    const meanValue=values.alpha*values.beta;
    const varianceValue=values.alpha*values.beta**2;
    const modeValue=(values.alpha>=1)?((values.alpha-1)*values.beta):0;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,null,null,modeFormula,modeValue);

    /* Diagram */

    const that=this;
    const minX=0;
    const maxX=Math.max(50,meanValue+3*Math.sqrt(varianceValue));
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  fitParameters(data) {
    if (data.mean<=0 || data.std<=0) return null;
   /* E=a*b, Var=a*b² => Var=E*b => b=Var/E */
   const beta=data.std**2/data.mean;
   const alpha=data.mean/beta;
    return {alpha: alpha, beta: beta};
  }

  get canFit() {
    return true;
  }
}