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
import {beginMathML, endMathML, variable, minus, mul, equals, isin, defP, frac, setRPlusHTML, setN0HTML} from './MathMLTools.js';



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

  _calcDistribution(values) {
    /* Characteristics */

    const lambda=variable("&lambda;");

    const meanFormula=beginMathML+lambda+endMathML;
    const varianceFormula=beginMathML+lambda+endMathML;

    const meanValue=values.lambda;
    const varianceValue=values.lambda;

    this._setDiscreteCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Count density */

    this.#expMinusLambda=Math.exp(-values.lambda);

    this._updateDiscreteDiagram();
  }

  getDiscretePositiveSupport(values) {
    return [0,Math.max(20,Math.round(values.lambda+Math.sqrt(values.lambda)*3))];
  }
  calcProbability(values, k) {
    const lambda=values.lambda;
    let frac=1;
    for (let i=1;i<=k;i++) frac*=lambda/i;
    return frac*this.#expMinusLambda;
  }
}