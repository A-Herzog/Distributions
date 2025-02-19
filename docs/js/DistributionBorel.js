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

export {BorelDistribution};

import {DiscreteProbabilityDistribution, getDiscreteDefaultCDF} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, variable, minus, equals, isin, defP, frac, setNHTML} from './MathMLTools.js';



/**
 * Borel distribution
 */
class BorelDistribution extends DiscreteProbabilityDistribution {
  constructor() {
    super(language.distributions.borel.name);

    this.support=setNHTML;
    this.infoText=language.distributions.borel.info;
    this.wikipediaURL=language.distributions.borel.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=getDiscreteDefaultCDF();

    this._addContinuousParameter("mu","&mu;",language.distributions.borel.parameterInfoMu+" (<i>&mu;</i>"+isin+"[0;1])",0,false,1,false,0.9);

    this._setCalcParameter("k",5);
  }

  #getPDFText() {
    const k=variable("k");
    const e=variable("e");
    const mu=variable("&mu;");
    const X=variable("X");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defP(X+equals+k);
    pdf+=frac("<msup>"+e+"<mrow>"+minus+mu+k+"</mrow></msup><msup><mrow><mo>(</mo>"+mu+k+"<mo>)</mo></mrow><mrow>"+k+minus+"<mn>1</mn></mrow></msup>",k+"<mo>!</mo>");
    pdf+=endMathML;
    pdf+=",&nbsp;&nbsp;&nbsp;"+k+isin+setNHTML;
    return pdf;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const mu=variable("&mu;");

    const meanFormula=beginMathML+frac("<mn>1</mn>","<mn>1</mn>"+minus+mu)+endMathML;
    const varianceFormula=beginMathML+frac(mu,"<msup><mrow><mo>(</mo><mn>1</mn>"+minus+mu+"<mo>)</mo></mrow><mn>3</mn></msup>")+endMathML;

    const meanValue=1/(1-values.mu);
    const varianceValue=values.mu/((1-values.mu)**3);

    this._setDiscreteCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Count density */

    this._updateDiscreteDiagram();
  }

  getDiscreteSupport(values, forHistogram) {
    const meanValue=1/(1-values.mu);
    const varianceValue=values.mu/((1-values.mu)**3);
    return [0,Math.max(20,meanValue+Math.round(Math.sqrt(varianceValue)*(forHistogram?20:2)))];
  }

  calcProbability(values, k) {
    if (k<=0) return 0;

    const mu=values.mu;
    let fraction=Math.exp(-mu*k)/k;
    for (let i=1;i<=k-1;i++) {
      fraction*=(mu*k)/i;
    }
    return fraction;
  }

  fitParameters(data) {
    if (data.mean<=1) return null;
    /* mean=1/(1-mu) <=> 1-(1/mean)=mu */
    return {mu: 1-1/data.mean};
  }
}
