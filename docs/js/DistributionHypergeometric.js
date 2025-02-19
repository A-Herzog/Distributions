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

export {HypergeometricDistribution};

import {DiscreteProbabilityDistribution, getDiscreteDefaultCDF} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, variable, minus, mul, equals, isin, defP, frac, binom, setNHTML, setN0HTML} from './MathMLTools.js';
import {binom as mathBinom} from './MathTools.js';



/**
 * Hypergeometric distribution
 */
class HypergeometricDistribution extends DiscreteProbabilityDistribution {
  #denumerator;

  constructor() {
    super(language.distributions.hypergeometric.name);

    this.support=setN0HTML;
    this.infoText=language.distributions.hypergeometric.info;
    const dark=(localStorage.getItem('selectedColorMode')=='dark' || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches))?'_dark':'';
    this.infoImage="Urne"+dark+".webp";
    this.infoImageWidth=109;
    this.infoImageHeight=126;
    this.wikipediaURL=language.distributions.hypergeometric.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=getDiscreteDefaultCDF();

    this._addDiscreteParameter("N","N",language.distributions.hypergeometric.parameterInfoN+" (<i>N</i>"+isin+setNHTML+")",1,50);
    this._addDiscreteParameter("R","R",language.distributions.hypergeometric.parameterInfoR+" (<i>R</i>"+isin+setN0HTML+")",0,20);
    this._addDiscreteParameter("n","n",language.distributions.hypergeometric.parameterInfon+"  (<i>n</i>"+isin+setNHTML+")",1,8);

    this._setCalcParameter("k",5);
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
    pdf+=frac(binom(R,k)+mul+binom(N+minus+R,n+minus+k),binom(N,n));
    pdf+=endMathML;
    pdf+=",&nbsp;&nbsp;&nbsp;"+k+isin+setN0HTML;
    return pdf;
  }

  _checkParameters(values) {
    if (values.R>values.N) {
      this._setErrorMarker("R",language.distributions.hypergeometric.parameterInfoRError);
      this._clearAllOutput();
      return false;
    }

    if (values.n>values.N) {
      this._setErrorMarker("n",language.distributions.hypergeometric.parameterInfonError);
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

    const meanFormula=beginMathML+n+mul+frac(R,N)+endMathML;
    const varianceFormula=beginMathML+n+mul+frac(R,N)+"<mo>(</mo><mn>1</mn>"+minus+frac(R,N)+"<mo>)</mo>"+endMathML;

    const meanValue=values.n*values.R/values.N;
    const varianceValue=values.n*values.R/values.N*(1-values.R/values.N);

    this._setDiscreteCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Count density */

    this.#denumerator=mathBinom(values.N,values.n);

    this._updateDiscreteDiagram();
  }

  getDiscreteSupport(values, forHistogram) {
    return [0,Math.min(values.R,values.n)];
  }

  calcProbability(values, k) {
    const result=Math.max(0,mathBinom(values.R,k)*mathBinom(values.N-values.R,values.n-k)/this.#denumerator);
    return result;
  }
}
