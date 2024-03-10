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

export {DiscreteUniformDistribution};

import {DiscreteProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, variable, plus, minus, equals, isin, defP, frac, setN0HTML, setZHTML} from './MathMLTools.js';



/**
 * Discrete uniform distribution
 */
class DiscreteUniformDistribution extends DiscreteProbabilityDistribution {
  constructor() {
    super(language.distributions.discreteUniform.name);

    this.support=setZHTML;
    this.infoText=language.distributions.discreteUniform.info;
    this.wikipediaURL=language.distributions.discreteUniform.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addDiscreteParameter("a","a",language.distributions.discreteUniform.parameterInfoa+" (<i>a</i>"+isin+setZHTML+")",null,5);
    this._addDiscreteParameter("b","b",language.distributions.discreteUniform.parameterInfob+" (<i>b</i>"+isin+setZHTML+")",null,10);

    this._setCalcParameter("k",7);
  }

  #getPDFText() {
    const a=variable("a");
    const b=variable("b");
    const k=variable("k");
    const X=variable("X");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defP(X+equals+k);
    pdf+=frac("<mn>1</mn>",b+minus+a+plus+"<mn>1</mn>")
    pdf+=endMathML;
    pdf+=",&nbsp;&nbsp;&nbsp;"+k+isin+setN0HTML+",&nbsp;&nbsp;&nbsp;"+a+"<mo>&le;</mo>"+k+"<mo>&le;</mo>"+b;
    return pdf;
  }

    #getCDFText() {
    const a=variable("a");
    const b=variable("b");
    const k=variable("k");
    const X=variable("X");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defP(X+"<mo>&le;</mo>"+k);
    cdf+=frac(k+minus+a+plus+"<mn>1</mn>",b+minus+a+plus+"<mn>1</mn>")
    cdf+=endMathML;
    cdf+=",&nbsp;&nbsp;&nbsp;"+k+isin+setN0HTML+",&nbsp;&nbsp;&nbsp;"+a+"<mo>&le;</mo>"+k+"<mo>&le;</mo>"+b;
    return cdf;
  }

  _checkParameters(values) {
    if (values.a>values.b) {
      this._setErrorMarker("b",language.distributions.discreteUniform.parameterInfobError);
      this._clearAllOutput();
      return false;
    }

    return true;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const a=variable("a");
    const b=variable("b");

    const meanFormula=beginMathML+frac(a+plus+b,"<mn>2</mn>")+endMathML;
    const varianceFormula=beginMathML+frac("<msup><mrow><mo>(</mo>"+b+minus+a+plus+"<mn>1</mn><mo>)</mo></mrow><mn>2</mn></msup>"+minus+"<mn>1</mn>","<mn>12</mn>")+endMathML;

    const meanValue=(values.a+values.b)/2;
    const varianceValue=((values.b-values.a+1)**2-1)/12;

    this._setDiscreteCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Count density */

    this._updateDiscreteDiagram();
  }

  getDiscreteSupport(values) {
    return [values.a,values.b];
  }
  calcProbability(values, k) {
    if (k<values.a || k>values.b) return 0;
    return 1/(values.b-values.a+1);
  }
}