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

export {BernoulliDistribution};

import {DiscreteProbabilityDistribution, getDiscreteDefaultCDF} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, variable, minus, mul, equals, isin, defP, setN0HTML} from './MathMLTools.js';



/**
 * Bernoulli distribution
 */
class BernoulliDistribution extends DiscreteProbabilityDistribution {
  constructor() {
    super(language.distributions.bernoulli.name);

    this.support=setN0HTML;
    this.infoText=language.distributions.bernoulli.info;
    this.wikipediaURL=language.distributions.bernoulli.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=getDiscreteDefaultCDF();

    this._addContinuousParameter("p","p",language.distributions.bernoulli.parameterInfoP+" (<i>p</i>"+isin+"(0;1)])",0,false,1,false,0.25);

    this._setCalcParameter("k",1);
  }

  #getPDFText() {
    const p=variable("p");
    const X=variable("X");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defP(X+equals+"<mn>0</mn>");
    pdf+="<mn>1</mn>"+minus+p;
    pdf+=endMathML;
    pdf+=" "+language.distributions.and+" ";
    pdf+=beginMathML;
    pdf+=defP(X+equals+"<mn>1</mn>");
    pdf+=p;
    pdf+=endMathML;
    return pdf;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const p=variable("p");

    const meanFormula=beginMathML+p+endMathML;
    const varianceFormula=beginMathML+p+mul+"<mo>(</mo><mn>1</mn>"+minus+p+"<mo>)</mo>"+endMathML;

    const meanValue=values.p;
    const varianceValue=values.p*(1-values.p);

    this._setDiscreteCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Count density */

    this._updateDiscreteDiagram();
  }

  getDiscreteSupport(values, forHistogram) {
    return [0,1];
  }

  calcProbability(values, k) {
    if (k==0) return 1-values.p;
    if (k==1) return values.p;
    return 0;
  }

  fitParameters(data) {
    if (data.mean<=0 || data.mean>=1) return null;
    return {p: data.mean};
  }
}
