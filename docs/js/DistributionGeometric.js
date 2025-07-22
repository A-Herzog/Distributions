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

export {GeometricDistribution};

import {DiscreteProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, variable, plus, minus, equals, isin, defP, frac, setN0HTML} from './MathMLTools.js';



/**
 * Geometric distribution
 */
class GeometricDistribution extends DiscreteProbabilityDistribution {

  constructor() {
    super(language.distributions.geometric.name);

    this.support=setN0HTML;
    this.infoText=language.distributions.geometric.info;
    this.wikipediaURL=language.distributions.geometric.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("p","p",language.distributions.geometric.parameterInfop+" (<i>p</i>"+isin+"[0;1]"+")",0,true,1,true,0.25);

    this._setCalcParameter("k",5);
  }

  #getPDFText() {
    const k=variable("k");
    const p=variable("p");
    const X=variable("X");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defP(X+equals+k);
    pdf+=p+"<msup><mrow><mo>(</mo><mn>1</mn>"+minus+p+"<mo>)</mo></mrow>"+k+"</msup>";
    pdf+=endMathML;
    pdf+=",&nbsp;&nbsp;&nbsp;"+k+isin+setN0HTML;
    return pdf;
  }

  #getCDFText() {
    const k=variable("k");
    const p=variable("p");
    const X=variable("X");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defP(X+"<mo>&le;</mo>"+k);
    cdf+="<mn>1</mn>"+minus+"<msup><mrow><mo>(</mo><mn>1</mn>"+minus+p+"<mo>)</mo></mrow><mrow>"+k+plus+"<mn>1</mn></mrow></msup>";
    cdf+=endMathML;
    cdf+=",&nbsp;&nbsp;&nbsp;"+k+isin+setN0HTML;
    return cdf;
  }

  #getScipyText() {
    return `
      from math import sqrt
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameter p here

      # Translate to scipy parameters
      loc = -1  # location parameter (default is 0, but we use -1 for the first success at k=1)

      # Characterstics (via scipy)
      print("mean =", np.round(stats.geom.mean(p, loc=loc), 3))
      print("variance =", np.round(stats.geom.var(p, loc=loc), 3))
      print("standard deviation =", np.round(stats.geom.std(p, loc=loc), 3))

      # Characterstics (direct calculation)
      print("mean =", np.round((1 - p) / p, 3))
      print("variance =", np.round((1 - p) / p**2, 3))
      print("standard deviation =", np.round(sqrt((1 - p) / p**2), 3))

      # Probability mass function
      k = np.arange(-1, 20)
      pmf = stats.geom.pmf(k, p, loc=loc)
      plt.bar(k, pmf)`;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const p=variable("p");

    const meanFormula=beginMathML+frac("<mn>1</mn>"+minus+p,p)+endMathML;
    const varianceFormula=beginMathML+frac("<mn>1</mn>"+minus+p,"<msup>"+p+"<mn>2</mn></msup>")+endMathML;
    const medianFormula=beginMathML+"<mo>&#x2308;</mo>"+frac(minus+"<mn>1</mn>","<msub><mi>log</mi><mn>2</mn></msub><mo>(</mo><mn>1</mn>"+minus+p+"<mo>)</mo>")+"<mo>&#x2309;</mo>"+minus+"<mn>1</mn>"+endMathML;
    const modeFormula=beginMathML+"<mn>0</mn>"+endMathML;

    const meanValue=(1-values.p)/values.p;
    const varianceValue=(1-values.p)/(values.p**2);
    const medianValue=Math.ceil(-1/Math.log2(1-values.p))-1;
    const modeValue=0;

    this._setDiscreteCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,medianFormula,medianValue,modeFormula,modeValue);

    /* Count density */

    this._updateDiscreteDiagram();
  }

  getDiscreteSupport(values, forHistogram) {
    const mean=(1-values.p)/values.p;
    const sd=Math.sqrt((1-values.p)/(values.p**2));
    return [0,Math.max(20,Math.round(mean+3*sd))];
  }

  calcProbability(values, k) {
    return values.p*(1-values.p)**k;
  }

  fitParameters(data) {
    /* (1-p)/p=mean <=> 1/(1+mean)=p */
		return {p: 1/(1+Math.max(0,data.mean))};
  }

  get canFit() {
    return true;
  }
}
