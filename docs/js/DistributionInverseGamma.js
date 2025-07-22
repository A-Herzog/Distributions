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

export {InverseGammaDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRPlus, setRPlusHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * Inverse gamma distribution
 */
class InverseGammaDistribution extends ContinuousProbabilityDistribution {
  #pdfFactor;

  constructor() {
    super(language.distributions.inverseGamma.name);

    this.support=setRPlusHTML;
    this.infoText=language.distributions.inverseGamma.info;
    this.wikipediaURL=language.distributions.inverseGamma.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("alpha","&alpha;",language.distributions.inverseGamma.parameterInfoAlpha+" (<i>&alpha;</i>"+isin+setRPlusHTML+")",0,false,null,false,3);
    this._addContinuousParameter("beta","&beta;",language.distributions.inverseGamma.parameterInfoBeta+" (<i>&beta;</i>"+isin+setRPlusHTML+")",0,false,null,false,200);

    this._setCalcParameter("x",2);
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
    pdf+=frac("<msup>"+beta+alpha+"</msup>",Gamma+"<ms>(</ms>"+alpha+"<ms>)</ms>")+mul+"<msup>"+x+"<mrow>"+minus+alpha+minus+"<mn>1</mn></mrow></msup>"+mul+defF("exp",minus+frac(beta,x),false);
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
    const inGamma="<mi mathvariant='normal'><abbr title='"+language.functions.inGamma+"'>&Gamma;</abbr></mi>";

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac(inGamma+"<mo>(</mo>"+alpha+"<mo>,</mo>"+frac(beta,x)+"<mo>)</mo>",Gamma+"<mo>(</mo>"+alpha+"<mo>)</mo>");
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
      print("mean =", np.round(stats.invgamma.mean(a, scale=scale), 3))
      print("variance =", np.round(stats.invgamma.var(a, scale=scale), 3))
      print("standard deviation =", np.round(stats.invgamma.std(a, scale=scale), 3))

      # Characterstics (direct calculation)
      print("mean =", np.round(beta / (alpha - 1), 3) if alpha > 1 else "undefined")
      print("variance =", np.round(beta**2 / ((alpha - 1)**2 * (alpha - 2)), 3) if alpha > 2 else "undefined")
      print("standard deviation =", np.round(beta / (alpha - 1) / sqrt(alpha - 2), 3) if alpha > 2 else "undefined")

      # Probability density function
      x = np.linspace(0, 300, 500)
      pdf = stats.invgamma.pdf(x, a, scale=scale)
      plt.plot(x, pdf)`;
  }

  #getPDF(values, x) {
    if (x<=0) return 0;
    return this.#pdfFactor*Math.pow(x,-values.alpha-1)*Math.exp(-values.beta/x);
  }

  #getCDF(values, x) {
    if (x<=0) return 0;

    const lowerIncompleteGamma=jStat.gammap(values.alpha,values.beta/x);
    const gamma=jStat.gammafn(values.alpha);
    const upperIncompleteGamma=gamma-lowerIncompleteGamma;
    return upperIncompleteGamma/gamma;
  }

  _calcDistribution(values) {
    this.#pdfFactor=Math.pow(values.beta,values.alpha)/jStat.gammafn(values.alpha);

    /* Characteristics */

    const alpha=variable("&alpha;");
    const beta=variable("&beta;");

    const meanFormula=(values.alpha>1)?(beginMathML+frac(beta,alpha+minus+"<mn>1</mn>")+endMathML):null;
    const varianceFormula=(values.alpha>2)?(beginMathML+frac("<msup>"+beta+"<mn>2</mn></msup>","<msup><mrow><mo>(</mo>"+alpha+minus+"<mn>1</mn><mo>)</mo></mrow><mn>2</mn></msup><mo>(</mo>"+alpha+minus+"<mn>2</mn><mo>)</mo>")+endMathML):null;
    const modeFormula=beginMathML+frac(beta,alpha+plus+"<mn>1</mn>")+endMathML;

    const meanValue=(values.alpha>1)?(values.beta/(values.alpha-1)):null;
    const varianceValue=(values.alpha>2)?(values.beta**2/((values.alpha-1)**2*(values.alpha-2))):null;
    const modeValue=values.beta/(values.alpha+1);

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,null,null,modeFormula,modeValue);

    /* Diagram */

    const that=this;
    const minX=0;
    let maxX=3;
    if (meanValue!=null) {
      if (varianceValue!=null) {
        maxX=Math.max(3,meanValue+3*Math.sqrt(varianceValue));
      } else {
        Math.max(3,meanValue+3);
      }
    }
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  fitParameters(data) {
    if (data.mean<=0 || data.std<=0) return null;
		const alpha=(data.mean**2/data.std**2)+2;
		const beta=Math.max((data.mean**3/data.std**2)+data.mean,0.0001);
    return {alpha: alpha, beta: beta};
  }

  get canFit() {
    return true;
  }
}