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

export {NegativeBinomialDistribution};

import {DiscreteProbabilityDistribution, getDiscreteDefaultCDF} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, variable, plus, minus, mul, equals, isin, defP, frac, binom, setNHTML, setN0HTML} from './MathMLTools.js';
import {binom as mathBinom} from './MathTools.js';



/**
 * Negative binomial distribution
 */
class NegativeBinomialDistribution extends DiscreteProbabilityDistribution {

  constructor() {
    super(language.distributions.negativeBinomial.name);

    this.support=setN0HTML;
    this.infoText=language.distributions.negativeBinomial.info;
    this.wikipediaURL=language.distributions.negativeBinomial.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=getDiscreteDefaultCDF();
    this.scipyText=this.#getScipyText();

    this._addDiscreteParameter("r","r",language.distributions.negativeBinomial.parameterInfor+"  (<i>r</i>"+isin+setNHTML+")",1,8);
    this._addContinuousParameter("p","p",language.distributions.negativeBinomial.parameterInfop+" (<i>p</i>"+isin+"[0;1]"+")",0,true,1,true,0.25);

    this._setCalcParameter("k",5);
  }

  #getPDFText() {
    const k=variable("k");
    const r=variable("r");
    const p=variable("p");
    const X=variable("X");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defP(X+equals+k);
    pdf+=binom(k+plus+r+minus+"<mn>1</mn>",k)+mul;
    pdf+="<msup>"+p+r+"</msup>"+mul;
    pdf+="<msup><mrow><mo>(</mo><mn>1</mn>"+minus+p+"<mo>)</mo></mrow>"+k+"</msup>";
    pdf+=endMathML;
    pdf+=",&nbsp;&nbsp;&nbsp;"+k+isin+setN0HTML;
    return pdf;
  }

  #getScipyText() {
    return `
      from math import sqrt
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameters r and p here

      # Characterstics (via scipy)
      print("mean =", np.round(stats.nbinom.mean(n, p), 3))
      print("variance =", np.round(stats.nbinom.var(n, p), 3))
      print("standard deviation =", np.round(stats.nbinom.std(n, p), 3))

      # Characterstics (direct calculation)
      mean = n * (1 - p) / p
      var = n * (1 - p) / (p ** 2)
      std = sqrt(var)
      print("mean =", np.round(mean, 3))
      print("variance =", np.round(var, 3))
      print("standard deviation =", np.round(std, 3))

      # Probability mass function
      k = np.arange(0, mean + 4 * std)
      pmf = stats.nbinom.pmf(k, n, p)
      plt.bar(k, pmf)`;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const r=variable("r");
    const p=variable("p");

    const meanFormula=beginMathML+frac(r+"<mo>(</mo><mn>1</mn>"+minus+p+"<mo>)</mo>",p)+endMathML;
    const varianceFormula=beginMathML+frac(r+"<mo>(</mo><mn>1</mn>"+minus+p+"<mo>)</mo>","<msup>"+p+"<mn>2</mn></msup>")+endMathML;

    const meanValue=(values.r*(1-values.p))/values.p;
    const varianceValue=(values.r*(1-values.p))/(values.p**2);

    this._setDiscreteCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Count density */

    this._updateDiscreteDiagram();
  }

  getDiscreteSupport(values, forHistogram) {
    const mean=(values.r*(1-values.p))/values.p;
    const sd=Math.sqrt((values.r*(1-values.p))/(values.p**2));
    return [0,Math.max(50,Math.round(mean+3*sd))];
  }

  calcProbability(values, k) {
    return mathBinom(k+values.r-1,k)*values.p**values.r*(1-values.p)**k;
  }

  fitParameters(data) {
    if (data.mean<=0 || data.std<=0) return null;
    /* E=r(1-p)/p, Var=r(1-p)/p^2 => p=E/Var, r=E*p/(1-p) */
    const p=data.mean/(data.std**2);
    if (p<=0 || p>1) return null;
    const r=Math.round(data.mean*p/(1-p));
    return {r: r, p: p};
  }

  get canFit() {
    return true;
  }
}
