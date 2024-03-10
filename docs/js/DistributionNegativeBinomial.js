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

export {NegativeBinomialDistribution};

import {DiscreteProbabilityDistribution, getDiscreteDefaultCDF} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, variable, plus, minus, mul, equals, isin, defP, frac, binom, setNHTML, setN0HTML} from './MathMLTools.js';
import {binom as mathBinom} from './MathTools.js';



/**
 * Negative binomial distribution
 */
class NegativeBinomialDistribution extends DiscreteProbabilityDistribution {

  constructor() {
    super(language.distributions.negativeBinomial.name);

    this.support=setN0HTML;
    this.infoText=language.distributions.negativeBinomial.info;
    this.wikipediaURL=language.distributions.negativeBinomial.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=getDiscreteDefaultCDF();

    this._addDiscreteParameter("r","r",language.distributions.negativeBinomial.parameterInfor+"  (<i>r</i>"+isin+setNHTML+")",1,8);
    this._addContinuousParameter("p","p",language.distributions.negativeBinomial.parameterInfop+" (<i>p</i>"+isin+"[0;1]"+")",0,true,1,true,0.25);

    this._setCalcParameter("k",5);
  }

  #getPDFText() {
    const k=variable("k");
    const r=variable("r");
    const p=variable("p");
    const X=variable("X");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defP(X+equals+k);
    pdf+=binom(k+plus+r+minus+"<mn>1</mn>",k)+mul;
    pdf+="<msup>"+p+r+"</msup>"+mul;
    pdf+="<msup><mrow><mo>(</mo><mn>1</mn>"+minus+p+"<mo>)</mo></mrow>"+k+"</msup>";
    pdf+=endMathML;
    pdf+=",&nbsp;&nbsp;&nbsp;"+k+isin+setN0HTML;
    return pdf;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const r=variable("r");
    const p=variable("p");

    const meanFormula=beginMathML+frac(r+"<mo>(</mo><mn>1</mn>"+minus+p+"<mo>)</mo>",p)+endMathML;
    const varianceFormula=beginMathML+frac(r+"<mo>(</mo><mn>1</mn>"+minus+p+"<mo>)</mo>","<msup>"+p+"<mn>2</mn></msup>")+endMathML;

    const meanValue=(values.r*(1-values.p))/values.p;
    const varianceValue=(values.r*(1-values.p))/(values.p**2);

    this._setDiscreteCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Count density */

    this._updateDiscreteDiagram();
  }

  getDiscreteSupport(values) {
    const mean=(values.r*(1-values.p))/values.p;
    const sd=Math.sqrt((values.r*(1-values.p))/(values.p**2));
    return [0,Math.max(50,Math.round(mean+3*sd))];
  }
  calcProbability(values, k) {
    return mathBinom(k+values.r-1,k)*values.p**values.r*(1-values.p)**k;
  }
}