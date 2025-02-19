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

export {RademacherDistribution};

import {DiscreteProbabilityDistribution, getDiscreteDefaultCDF} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, variable,   equals,  defP, frac, setZHTML} from './MathMLTools.js';



/**
 * Rademacher distribution
 */
class RademacherDistribution extends DiscreteProbabilityDistribution {

  constructor() {
    super(language.distributions.rademacher.name);

    this.support="{-1,1}";
    this.infoText=language.distributions.rademacher.info;
    this.wikipediaURL=language.distributions.rademacher.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._setCalcParameter("k",0);
  }

  #getPDFText() {
    let pdf="";

    const X=variable("X");
    const k=variable("k");

    pdf+=beginMathML;
    pdf+=defP(X+equals+"<mn>-1</mn>");
    pdf+=defP(X+equals+"<mn>1</mn>");
    pdf+=frac("<mn>1</mn>","<mn>2</mn>");
    pdf+=endMathML;
    pdf+=" "+language.distributions.and+" ";
    pdf+=beginMathML;
    pdf+=defP(X+equals+k);
    pdf+="<mn>0</mn>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.else;

    return pdf;
  }

  #getCDFText() {
    let cdf="";

    const X=variable("X");
    const k=variable("k");

    cdf+=beginMathML;
    cdf+=defP(X+"<mo>&lt;</mo><mn>-1</mn>");
    cdf+="<mn>0</mn>";
    cdf+=endMathML;
    cdf+=", ";
    cdf+=beginMathML;
    cdf+=defP("<mn>-1</mn><mo>&le;</mo>"+X+"<mo>&lt;</mo><mn>1</mn>");
    cdf+=frac("<mn>1</mn>","<mn>2</mn>");
    cdf+=endMathML;
    cdf+=", ";
    cdf+=beginMathML;
    cdf+=defP("<mn>1</mn><mo>&le;</mo>"+X);
    cdf+="<mn>1</mn>";
    cdf+=endMathML;

    return cdf;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const meanFormula=beginMathML+"<mn>0</mn>"+endMathML;
    const varianceFormula=beginMathML+"<mn>1</mn>"+endMathML;

    this._setDiscreteCharacteristics(meanFormula,0,varianceFormula,1);

    /* Count density */

    this._updateDiscreteDiagram();
  }

  getDiscreteSupport(values, forHistogram) {
    return [-1,1];
  }

  calcProbability(values, k) {
    return (k==-1 || k==1)?0.5:0;
  }

  getRandomNumber(values) {
    return (Math.random()>=0.5)?1:-1;
  }

  fitParameters(data) {
    if (Math.abs(data.mean)>0.1) return null;
    if (data.std<0.9 || data.std>1.1) return null;
    return {};
  }
}