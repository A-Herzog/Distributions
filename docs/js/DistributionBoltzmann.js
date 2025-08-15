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

export {BoltzmannDistribution};

import {DiscreteProbabilityDistribution, getDiscreteDefaultCDF} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, variable, minus, mul, equals, isin, defP, frac, setNHTML, setRPlusHTML, defF} from './MathMLTools.js';



/**
 * Boltzmann distribution
 */
class BoltzmannDistribution extends DiscreteProbabilityDistribution {
  #densityFactor;

  constructor() {
    super(language.distributions.boltzmann.name);

    this.support="[0;N]";
    this.infoText=language.distributions.boltzmann.info;
    this.wikipediaURL=language.distributions.boltzmann.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=getDiscreteDefaultCDF();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("lambda","&lambda;",language.distributions.boltzmann.parameterInfoLambda+" (<i>&lambda;</i>"+isin+setRPlusHTML+")",0,false,null,false,0.25);
    this._addDiscreteParameter("N","N",language.distributions.boltzmann.parameterInfoN+" (<i>N</i>"+isin+setNHTML+")",1,20);

    this._setCalcParameter("k",5);
  }

  #getPDFText() {
    const k=variable("k");
    const lambda=variable("&lambda;");
    const N=variable("N");
    const X=variable("X");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defP(X+equals+k);
    pdf+=frac("<mn>1</mn>"+minus+defF("exp",minus+lambda,false),"<mn>1</mn>"+minus+defF("exp",minus+lambda+mul+N,false));
    pdf+=mul+defF("exp",minus+lambda+mul+k,false);
    pdf+=endMathML;
    pdf+=",&nbsp;&nbsp;&nbsp;"+k+isin+"[0;N]";
    return pdf;
  }

  #getScipyText() {
    return `
      from math import sqrt
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameters lmbda and N here

      # Characterstics (via scipy)
      print("mean =", np.round(stats.boltzmann.mean(lmbda, N), 3))
      print("variance =", np.round(stats.boltzmann.var(lmbda, N), 3))
      print("standard deviation =", np.round(stats.boltzmann.std(lmbda, N), 3))

      # Characterstics (direct calculation)
      z = exp(-lmbda)
      zN = exp(-lmbda * N)
      mu = z / (1.0 - z) - N * zN / (1 - zN)
      var = z / (1.0 - z)**2 - N * N * zN / (1 - zN)**2
      print("mean =", np.round(mu, 3))
      print("variance =", np.round(var, 3))
      print("standard deviation =", np.round(sqrt(var), 3))

      # Probability mass function
      k = np.arange(0, N)
      pmf = stats.binom.pmf(k, n, p)
      plt.bar(k, pmf)`;
  }

  _calcDistribution(values) {
    this.#densityFactor=(1-Math.exp(-values.lambda))/(1-Math.exp(-values.lambda*values.N));

    /* Characteristics */

    const lambda=variable("&lambda;");
    const N=variable("N");

    const zF=defF("exp",minus+lambda,false);
    const zNF=defF("exp",minus+lambda+mul+N,false);
    const meanFormula=beginMathML+frac(zF,"<mn>1</mn>"+minus+zF)+minus+frac(N+mul+zNF,"<mn>1</mn>"+minus+zNF)+endMathML;
    const varianceFormula=beginMathML+frac(zF,"<msup><mrow><mo>(</mo><mn>1</mn>"+minus+zF+"<mo>)</mo></mrow><mn>2</mn></msup>")+minus+frac("<msup>"+N+"<mn>2</mn></msup>"+mul+zNF,"<msup><mrow><mo>(</mo><mn>1</mn>"+minus+zNF+"<mo>)</mo></mrow><mn>2</mn></msup>")+endMathML;

		const z=Math.exp(-values.lambda);
		const zN=Math.exp(-values.lambda*values.N);
		const meanValue=z/(1.0-z)-values.N*zN/(1.0-zN);
		const varianceValue=z/((1.0-z)**2)-values.N**2*zN/((1.0-zN)**2);

    this._setDiscreteCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Count density */

    this._updateDiscreteDiagram();
  }

  getDiscreteSupport(values, forHistogram) {
    return [0,values.N-1];
  }

  calcProbability(values, k) {
    if (k<0 || k>=values.N) return 0;
		return this.#densityFactor*Math.exp(-values.lambda*k);
  }
}
