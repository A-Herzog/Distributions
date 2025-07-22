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

export {ParetoDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRPlusHTML, setRPlus0HTML, variable, frac, defF, plus, minus} from './MathMLTools.js';



/**
 * Pareto distribution
 */
class ParetoDistribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.pareto.name);

    this.support=setRPlus0HTML;
    this.infoText=language.distributions.pareto.info;
    this.wikipediaURL=language.distributions.pareto.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("xm","x<sub>m</sub>",language.distributions.pareto.parameterInfoxm+" (<i>x<sub>m</sub></i>"+isin+setRPlusHTML+")",0,false,null,false,1);
    this._addContinuousParameter("alpha","&alpha;",language.distributions.pareto.parameterInfoAlpha+" (<i>&alpha;</i>"+isin+setRPlusHTML+")",0,false,null,false,5);

    this._setCalcParameter("x",1.5);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const xm="<msub>"+variable("x")+variable("m")+"</msub>";
    const alpha=variable("&alpha;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac(alpha+"<msup>"+xm+alpha+"</msup>","<msup>"+x+"<mrow>"+alpha+plus+"<mn>1</mn></mrow></msup>");
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&ge;</mo>"+xm;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const xm="<msub>"+variable("x")+variable("m")+"</msub>";
    const alpha=variable("&alpha;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+="<mn>1</mn>"+minus+"<msup><mrow><mo>(</mo>"+frac(xm,x)+"<mo>)</mo></mrow>"+alpha+"</msup>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&ge;</mo>"+xm;
    cdf+=endMathML;
    return cdf;
  }

#getScipyText() {
    return `
      from math import sqrt
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameters xm and alpha here

      # Translate to scipy parameters
      b = alpha
      scale = xm

      # Characterstics (via scipy)
      print("mean =", np.round(stats.pareto.mean(b, scale=scale), 3) if alpha > 1 else "undefined")
      print("variance =", np.round(stats.pareto.var(b, scale=scale), 3) if alpha > 2 else "undefined")
      print("standard deviation =", np.round(stats.pareto.std(b, scale=scale), 3) if alpha > 2 else "undefined")

      # Characterstics (direct calculation)
      print("mean =", np.round(alpha * xm / (alpha - 1), 3) if alpha > 1 else "undefined")
      print("variance =", np.round((xm**2 * alpha) / ((alpha - 1)**2 * (alpha - 2)), 3) if alpha > 2 else "undefined")
      print("standard deviation =", np.round(sqrt((xm**2 * alpha) / ((alpha - 1)**2 * (alpha - 2))), 3) if alpha > 2 else "undefined")

      # Probability density function
      x = np.linspace(xm - 1, xm + 10, 500)
      pdf = stats.pareto.pdf(x, b, scale=scale)
      plt.plot(x, pdf)`;
  }

  #getPDF(values, x) {
    if (x<values.xm) return 0;
    return values.alpha*values.xm**values.alpha/(x**(values.alpha+1));
  }

  #getCDF(values, x) {
    if (x<values.xm) return 0;
    return 1-(values.xm/x)**values.alpha;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const xm="<msub>"+variable("x")+variable("m")+"</msub>";
    const alpha=variable("&alpha;");

    const meanFormula=beginMathML+frac(alpha+xm,alpha+minus+"<mn>1</mn>")+endMathML;
    const varianceFormula=beginMathML+"<msup><mrow><mo>(</mo>"+frac(xm,alpha+minus+"<mn>1</mn>")+"<mo>)</mo></mrow><mn>2</mn></msup>"+frac(alpha,alpha+minus+"<mn>2</mn>")+endMathML;
    const medianFormula=beginMathML+xm+"<mroot><mn>2</mn>"+alpha+"</mroot>"+endMathML;
    const modeFormula=beginMathML+xm+endMathML;

    const meanValue=(values.alpha<=1)?Infinity:(values.alpha*values.xm)/(values.alpha-1);
    const varianceValue=(values.alpha<=2)?Infinity:(values.xm/(values.alpha-1))**2*values.alpha/(values.alpha-2);
    const medianValue=values.xm*Math.pow(2,1/values.alpha);
    const modeValue=values.xm;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,medianFormula,medianValue,modeFormula,modeValue);

    /* Diagram */

    const that=this;
    const minX=values.xm-5;
    const maxX=values.xm+100;
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    const u=Math.random();
    /* y=1-(xm/x)^alpha <=> x=xm/(1-y)^(1/alpha)  */
    return values.xm/((1-u)**(1/values.alpha));
  }

  fitParameters(data) {
    if (data.std>0) {
      const alpha=1+Math.sqrt(1+data.mean**2/(data.std**2));
      if (alpha<2) alpha=2.01; /* for alpha<=2 we have var=infty */
      return {xm: data.mean*(alpha-1)/alpha, alpha: alpha};
    } else {
      return null;
    }
  }

  get canFit() {
    return true;
  }
}
