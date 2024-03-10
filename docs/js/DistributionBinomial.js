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

export {BinomialDistribution};

import {DiscreteProbabilityDistribution, getDiscreteDefaultCDF} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, variable, minus, mul, equals, isin, defP, frac, binom, setNHTML, setN0HTML} from './MathMLTools.js';
import {binom as mathBinom} from './MathTools.js';



/**
 * Binomial distribution
 */
class BinomialDistribution extends DiscreteProbabilityDistribution {

  constructor() {
    super(language.distributions.binomial.name);

    this.support=setN0HTML;
    this.infoText=language.distributions.binomial.info;
    const dark=(localStorage.getItem('selectedColorMode')=='dark' || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches))?'_dark':'';
    this.infoImage="Urne"+dark+".webp";
    this.infoImageWidth=109;
    this.infoImageHeight=126;
    this.wikipediaURL=language.distributions.binomial.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=getDiscreteDefaultCDF();

    this._addDiscreteParameter("n","n",language.distributions.binomial.parameterInfon+"  (<i>n</i>"+isin+setNHTML+")",1,8);
    this._addContinuousParameter("p","p",language.distributions.binomial.parameterInfop+" (<i>p</i>"+isin+"[0;1]"+")",0,true,1,true,0.25);

    this._setCalcParameter("k",5);
  }

  #getPDFText() {
    const k=variable("k");
    const n=variable("n");
    const p=variable("p");
    const X=variable("X");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defP(X+equals+k);
    pdf+=binom(n,k)+mul;
    pdf+="<msup>"+p+k+"</msup>"+mul;
    pdf+="<msup><mrow>(<mn>1</mn>"+minus+p+")</mrow><mrow>"+n+minus+k+"</mrow></msup>";
    pdf+=endMathML;
    pdf+=",&nbsp;&nbsp;&nbsp;"+k+isin+setN0HTML;
    return pdf;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const n=variable("n");
    const p=variable("p");

    const meanFormula=beginMathML+n+mul+p+endMathML;
    const varianceFormula=beginMathML+n+mul+p+mul+"<mo>(</mo><mn>1</mn>"+minus+p+"<mo>)</mo>"+endMathML;

    const meanValue=values.n*values.p;
    const varianceValue=values.n*values.p*(1-values.p);

    this._setDiscreteCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Count density */

    this._updateDiscreteDiagram();
  }

  getDiscreteSupport(values) {
    return [0,values.n];
  }
  calcProbability(values, k) {
    return mathBinom(values.n,k)*values.p**k*(1-values.p)**(values.n-k);
  }
}