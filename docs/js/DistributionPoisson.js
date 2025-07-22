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

export {PoissonDistribution};

import {DiscreteProbabilityDistribution, getDiscreteDefaultCDF} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, variable, plus, minus, mul, equals, isin, defP, frac, setRPlusHTML, setN0HTML} from './MathMLTools.js';



/**
 * Poisson distribution
 */
class PoissonDistribution extends DiscreteProbabilityDistribution {
  #expMinusLambda;

  constructor() {
    super(language.distributions.poisson.name);

    this.support=setN0HTML;
    this.infoText=language.distributions.poisson.info;
    this.wikipediaURL=language.distributions.poisson.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=getDiscreteDefaultCDF();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("lambda","&lambda;",language.distributions.poisson.parameterInfolambda+" (<i>&lambda;</i>"+isin+setRPlusHTML+")",0,false,null,false,5);

    this._setCalcParameter("k",5);
  }

  #getPDFText() {
    const k=variable("k");
    const lambda=variable("&lambda;");
    const X=variable("X");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defP(X+equals+k);
    pdf+=frac("<msup>"+lambda+k+"</msup>",k+"<mo>!</mo>")+mul;
    pdf+="<msup><mi mathvariant='normal'>e</mi><mrow>"+minus+lambda+"</mrow></msup>";
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

      # Set parameter lmbda here

      # Translate to scipy parameters
      mu = lmbda

      # Characterstics (via scipy)
      print("mean =", np.round(stats.poisson.mean(mu), 3))
      print("variance =", np.round(stats.poisson.var(mu), 3))
      print("standard deviation =", np.round(stats.poisson.std(mu), 3))

      # Characterstics (direct calculation)
      print("mean =", np.round(lmbda, 3))
      print("variance =", np.round(lmbda, 3))
      print("standard deviation =", np.round(sqrt(lmbda), 3))

      # Probability mass function
      k = np.arange(0, lmbda + 5 * round(sqrt(lmbda)))
      pmf = stats.poisson.pmf(k, mu)
      plt.bar(k, pmf)`;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const lambda=variable("&lambda;");

    const meanFormula=beginMathML+lambda+endMathML;
    const varianceFormula=beginMathML+lambda+endMathML;
    const medianFormula=beginMathML+"<mo>&lfloor;</mo>"+lambda+plus+frac("<mn>1</mn>","<mn>3</mn>")+minus+frac("<mn>1</mn>","<mn>50</mn>"+lambda)+"<mo>&rfloor;</mo>"+endMathML;

    const meanValue=values.lambda;
    const varianceValue=values.lambda;
    const medianValue=Math.floor(values.lambda+1/3-1/(50*values.lambda));

    this._setDiscreteCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,medianFormula,medianValue);

    /* Count density */

    this.#expMinusLambda=Math.exp(-values.lambda);

    this._updateDiscreteDiagram();
  }

  getDiscreteSupport(values, forHistogram) {
    return [0,Math.max(20,Math.round(values.lambda+Math.sqrt(values.lambda)*3))];
  }

  calcProbability(values, k) {
    const lambda=values.lambda;
    let frac=1;
    for (let i=1;i<=k;i++) frac*=lambda/i;
    return frac*this.#expMinusLambda;
  }

  fitParameters(data) {
    if (data.mean<=0) return null;
    return {lambda: data.mean};
  }

  get canFit() {
    return true;
  }
}
