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

export {LogarithmicDistribution};

import {DiscreteProbabilityDistribution, getDiscreteDefaultCDF} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, variable, plus, minus, mul, equals, isin, defP, defF, frac, setNHTML} from './MathMLTools.js';



/**
 * Logarithmic distribution
 */
class LogarithmicDistribution extends DiscreteProbabilityDistribution {
  #densityFactor;

  constructor() {
    super(language.distributions.logarithmic.name);

    this.support=setNHTML;
    this.infoText=language.distributions.logarithmic.info;
    this.wikipediaURL=language.distributions.logarithmic.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=getDiscreteDefaultCDF();

    this._addContinuousParameter("p","p",language.distributions.logarithmic.parameterInfoP+" (<i>p</i>"+isin+"[0;1])",0,false,1,false,0.8);

    this._setCalcParameter("k",5);
  }

  #getPDFText() {
    const k=variable("k");
    const p=variable("p");
    const X=variable("X");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defP(X+equals+k);
    pdf+=minus+frac("<msup>"+p+k+"</msup>",k)+mul+frac("<mn>1</mn>",defF("log","<mn>1</mn>"+minus+p,false));
    pdf+=endMathML;
    pdf+=",&nbsp;&nbsp;&nbsp;"+k+isin+setNHTML;
    return pdf;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const p=variable("p");

    const meanFormula=beginMathML+frac(p,"<mo>(</mo><mn>1</mn>"+minus+p+"<mo>)</mo>"+defF("log","<mn>1</mn>"+minus+p,false))+endMathML;
    const varianceFormula=beginMathML+minus+frac(p+mul+"<mo>(</mo>"+defF("log","<mn>1</mn>"+minus+p,false)+plus+p+"<mo>)</mo>","<msup><mrow><mo>(</mo><mn>1</mn>"+minus+p+"<mo>)</mo></mrow><mn>2</mn></msup><msup><mrow><mo>(</mo>"+defF("log","<mn>1</mn>"+minus+p,false)+"<mo>)</mo></mrow><mn>2</mn></msup>")+endMathML;

    const ln1p=Math.log(1-values.p);
    const meanValue=-values.p/(1-values.p)/ln1p;
    const varianceValue=-values.p*(ln1p+values.p)/((1-values.p)**2*ln1p**2);

    this._setDiscreteCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Count density */

    this.#densityFactor=-1/Math.log(1-values.p);

    this._updateDiscreteDiagram();
  }

  getDiscreteSupport(values) {
    const ln1p=Math.log(1-values.p);
    const varianceValue=-values.p*(ln1p+values.p)/((1-values.p)**2*ln1p**2);
    return [0,Math.max(20,Math.round(Math.sqrt(varianceValue)*10))];
  }

  calcProbability(values, k) {
    if (k<=0) return 0;
    return this.#densityFactor*Math.pow(values.p,k)/k;
  }

  fitParameters(data) {
    const mean=data.mean;
    if (mean<=1.00006) return 0.0001;
	if (mean>1085) return 0.9999;

	let minP=0.001;
	let maxP=0.999;
	while (maxP-minP>0.0001) {
	  const p=(minP+maxP)/2;
	  const calcMean=-p/(1-p)/Math.log(1-p);
      if (calcMean>mean) {
        maxP=p;
      } else {
        minP=p;
      }
    }
    return {p: (minP+maxP)/2};
  }
}
