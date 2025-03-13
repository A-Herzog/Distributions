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

export {GaussKuzminDistribution};

import {DiscreteProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, variable, plus, minus, mul, equals, isin, defP, frac, setNHTML} from './MathMLTools.js';



/**
 * Gauss-Kuzmin distribution
 */
class GaussKuzminDistribution extends DiscreteProbabilityDistribution {
  constructor() {
    super(language.distributions.gaussKuzmin.name);

    this.support=setNHTML;
    this.infoText=language.distributions.gaussKuzmin.info;
    this.wikipediaURL=language.distributions.gaussKuzmin.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._setCalcParameter("k",3);
  }

  #getPDFText() {
    const k=variable("k");
    const X=variable("X");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defP(X+equals+k);
    pdf+=minus+"<msub><mo>log</mo><mn>2</mn></msub><mo>(</mo><mn>1</mn>"+minus+frac("<mn>1</mn>","<msup><mrow><mo>(</mo>"+k+plus+"<mn>1</mn><mo>)</mo></mrow><mn>2</mn>")+"<mo>)</mo>";
    pdf+=endMathML;
    pdf+=",&nbsp;&nbsp;&nbsp;"+k+isin+setNHTML;
    return pdf;
  }

  #getCDFText() {
    const k=variable("k");
    const X=variable("X");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defP(X+equals+k);
    cdf+="<mn>1</mn>"+minus+"<msub><mo>log</mo><mn>2</mn></msub><mo>(</mo>"+frac(k+plus+"<mn>2</mn>",k+plus+"<mn>1</mn>")+"<mo>)</mo>";
    cdf+=endMathML;
    cdf+=",&nbsp;&nbsp;&nbsp;"+k+isin+setNHTML;
    return cdf;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const meanFormula=beginMathML+"&infin;"+endMathML;
    const varianceFormula=beginMathML+"&infin;"+endMathML;

    this._setDiscreteCharacteristics(meanFormula,Number.POSITIVE_INFINITY,varianceFormula,Number.POSITIVE_INFINITY);

    /* Count density */

    this._updateDiscreteDiagram();
  }

  getDiscreteSupport(values, forHistogram) {
    if (forHistogram) return [1,100];
    return [1,20];
  }

  getRandomNumbersSupport(values) {
    return [1,100_000];
  }

  calcProbability(values, k) {
    if (k<=0) return 0;
    return -Math.log2(1-1/((k+1)**2));
  }
}
