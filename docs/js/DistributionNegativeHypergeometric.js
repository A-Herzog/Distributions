/*
Copyright 2024 Alexander Herzog

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

export {NegativeHypergeometricDistribution};

import {DiscreteProbabilityDistribution, getDiscreteDefaultCDF} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, variable, plus, minus, mul, equals, isin, defP, frac, binom, setNHTML, setN0HTML} from './MathMLTools.js';
import {binom as mathBinom} from './MathTools.js';



/**
 * Negative hypergeometric distribution
 */
class NegativeHypergeometricDistribution extends DiscreteProbabilityDistribution {
  #denumerator;

  constructor() {
    super(language.distributions.negativeHypergeometric.name);

    this.support=setN0HTML;
    this.infoText=language.distributions.negativeHypergeometric.info;
    const dark=(localStorage.getItem('selectedColorMode')=='dark' || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches))?'_dark':'';
    this.infoImage="Urne"+dark+".webp";
    this.infoImageWidth=109;
    this.infoImageHeight=126;
    this.wikipediaURL=language.distributions.negativeHypergeometric.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=getDiscreteDefaultCDF();

    this._addDiscreteParameter("N","N",language.distributions.negativeHypergeometric.parameterInfoN+" (<i>N</i>"+isin+setNHTML+")",1,50);
    this._addDiscreteParameter("R","R",language.distributions.negativeHypergeometric.parameterInfoR+" (<i>R</i>"+isin+setNHTML+")",1,20);
    this._addDiscreteParameter("n","n",language.distributions.negativeHypergeometric.parameterInfon+"  (<i>n</i>"+isin+setNHTML+")",1,5);

    this._setCalcParameter("k",8);
  }

  #getPDFText() {
    const k=variable("k");
    const n=variable("n");
    const N=variable("N");
    const R=variable("R");
    const X=variable("X");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defP(X+equals+k);
    pdf+=frac(binom(k+minus+"<mn>1</mn>",n+minus+"<mn>1</mn>")+mul+binom(N+minus+k,R+minus+n),binom(N,R));
    pdf+=endMathML;
    pdf+=",&nbsp;&nbsp;&nbsp;"+k+isin+setN0HTML;
    return pdf;
  }

  _checkParameters(values) {
    if (values.R>values.N) {
      this._setErrorMarker("R",language.distributions.negativeHypergeometric.parameterInfoRError);
      this._clearAllOutput();
      return false;
    }

    if (values.n>values.R) {
      this._setErrorMarker("n",language.distributions.negativeHypergeometric.parameterInfonError);
      this._clearAllOutput();
      return false;
    }

    return true;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const n=variable("n");
    const N=variable("N");
    const R=variable("R");

    const meanFormula=beginMathML+n+mul+frac(N+plus+"<mn>1</mn>",R+plus+"<mn>1</mn>")+endMathML;
    const varianceFormula=beginMathML+n+mul+frac("<mo>(</mo>"+R+plus+"<mn>1</mn>"+minus+n+"<mo>)</mo><mo>(</mo>"+N+minus+R+"<mo>)</mo><mo>(</mo>"+N+plus+"<mn>1</mn><mo>)</mo>","<msup><mrow><mo>(</mo>"+R+plus+"<mn>1</mn><mo>)</mo></mrow><mn>2</mn></msup><mo>(</mo>"+R+plus+"<mn>2</mn><mo>)</mo>")+endMathML;

    const meanValue=values.n*(values.N+1)/(values.R+1);
    const varianceValue=values.n*(values.R+1-values.n)*(values.N-values.R)*(values.N+1)/(values.R+1)**2/(values.R+2);

    this._setDiscreteCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Count density */

    this.#denumerator=mathBinom(values.N,values.R);

    this._updateDiscreteDiagram();
  }

  getDiscreteSupport(values) {
    return [1,values.N];
  }

  calcProbability(values, k) {
    if (k<values.n) return 0;
    if (k>values.N) return 0;
    const result=mathBinom(k-1,values.n-1)*mathBinom(values.N-k,values.R-values.n)/this.#denumerator;
    return result;
  }
}
