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

export {PlanckDistribution};

import {DiscreteProbabilityDistribution, getDiscreteDefaultCDF} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, variable, plus, minus, mul, equals, isin, defP, frac, setRPlusHTML, setN0HTML, defF} from './MathMLTools.js';



/**
 * Planck distribution
 */
class PlanckDistribution extends DiscreteProbabilityDistribution {
  #densityFactor;

  constructor() {
    super(language.distributions.planck.name);

    this.support=setN0HTML;
    this.infoText=language.distributions.planck.info;
    this.wikipediaURL=language.distributions.planck.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=getDiscreteDefaultCDF();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("lambda","&lambda;",language.distributions.planck.parameterInfolambda+" (<i>&lambda;</i>"+isin+setRPlusHTML+")",0,false,null,false,0.5);

    this._setCalcParameter("k",5);
  }

  #getPDFText() {
    const k=variable("k");
    const lambda=variable("&lambda;");
    const X=variable("X");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defP(X+equals+k);
    pdf+="<mo>(</mo><mn>1</mn>"+minus+defF("exp",minus+lambda,false)+"<mo>)</mo>";
    pdf+=defF("exp",minus+lambda+k,false);
    pdf+=endMathML;
    pdf+=",&nbsp;&nbsp;&nbsp;"+k+isin+setN0HTML;
    return pdf;
  }

  #getScipyText() {
    return `
      from math import sqrt, exp
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameter lmbda here

      # Parameter for scipy.stats.planck
      lmbda = lmbda

      # Characterstics (via scipy)
      print("mean =", np.round(stats.planck.mean(lmbda), 3))
      print("variance =", np.round(stats.planck.var(lmbda), 3))
      print("standard deviation =", np.round(stats.planck.std(lmbda), 3))

      # Characterstics (direct calculation)
      print("mean =", np.round(1/(exp(lmbda)-1), 3))
      print("variance =", np.round(exp(-lmbda)/(exp(-lmbda)-1)**2, 3))
      print("standard deviation =", np.round(sqrt(exp(-lmbda))/(1-exp(-lmbda)), 3))

      # Probability mass function
      k = np.arange(0, lmbda + 5 * round(sqrt(lmbda)))
      pmf = stats.planck.pmf(k, lmbda)
      plt.bar(k, pmf)`;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const lambda=variable("&lambda;");

    const meanFormula=beginMathML+frac("<mn>1</mn>",defF("exp",lambda,false)+minus+"<mn>1</mn>")+endMathML;
    const varianceFormula=beginMathML+frac(defF("exp",minus+lambda,false),"<msup><mrow>"+defF("exp",minus+lambda,false)+minus+"<mn>1</mn></mrow><mn<2</mn></msup>")+endMathML;

    const meanValue=1/(Math.exp(values.lambda)-1);
    const varianceValue=Math.exp(-values.lambda)/(Math.exp(-values.lambda)-1)**2;

    this._setDiscreteCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Count density */

    this.#densityFactor=1-Math.exp(-values.lambda);

    this._updateDiscreteDiagram();
  }

  getDiscreteSupport(values, forHistogram) {
    const meanValue=1/(Math.exp(values.lambda)-1);
    const varianceValue=Math.exp(-values.lambda)/(Math.exp(-values.lambda)-1)**2;
    return [0,Math.max(20,Math.round(meanValue+20*Math.sqrt(varianceValue)))];
  }

  calcProbability(values, k) {
    return this.#densityFactor*Math.exp(-values.lambda*k);
  }

  fitParameters(data) {
    if (data.mean<=0) return null;
    return {lambda: Math.log(1/data.mean+1)};
  }

  get canFit() {
    return true;
  }
}
