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

export {ZetaDistribution};

import {DiscreteProbabilityDistribution, getDiscreteDefaultCDF} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, variable, minus, equals, isin, defP, defF, frac, setNHTML} from './MathMLTools.js';
import {zeta as zetaFunction} from './MathTools.js';



/**
 * Zeta distribution
 */
class ZetaDistribution extends DiscreteProbabilityDistribution {
  #zetaS;

  constructor() {
    super(language.distributions.zeta.name);

    this.support=setNHTML;
    this.infoText=language.distributions.zeta.info;
    this.wikipediaURL=language.distributions.zeta.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=getDiscreteDefaultCDF();

    this._addContinuousParameter("s","s",language.distributions.zeta.parameterInfos+" (<i>s</i>&gt;1)",1,false,null,false,3);

    this._setCalcParameter("k",5);
  }

  #getPDFText() {
    const k=variable("k");
    const s=variable("s");
    const X=variable("X");
    const zeta=variable("&zeta;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defP(X+equals+k);
    pdf+=frac("<msup>"+k+"<mrow>"+minus+s+"</mrow></msup>",defF(zeta,s,false));
    pdf+=endMathML;
    pdf+=",&nbsp;&nbsp;&nbsp;"+k+isin+setNHTML;
    return pdf;
  }

  _calcDistribution(values) {
    this.#zetaS=zetaFunction(values.s);
    const zetaSMinus1=(values.s>2)?zetaFunction(values.s-1):NaN;
    const zetaSMinus2=(values.s>3)?zetaFunction(values.s-2):NaN;

    /* Characteristics */

    const zeta=variable("&zeta;");
    const s=variable("s");

    const meanFormula=beginMathML+frac(defF(zeta,s+minus+"<mn>1</mn>",false),defF(zeta,s,false))+endMathML;
    const varianceFormula=beginMathML+frac(defF(zeta,s,false)+defF(zeta,s+minus+"<mn>2</mn>",false)+minus+"<msup><mrow>"+defF(zeta,s+minus+"<mn>1</mn>",false)+"</mrow><mn>2</mn></msup>","<msup><mrow>"+defF(zeta,s,false)+"</mrow><mn>2</mn></msup>")+endMathML;
    const modeFormula=beginMathML+"<mn>1</mn>"+endMathML;

    const meanValue=(values.s>2)?(zetaSMinus1/this.#zetaS):NaN;
    const varianceValue=(values.s>3)?((this.#zetaS*zetaSMinus2-zetaSMinus1**2)/(this.#zetaS**2)):NaN;
    const modeValue=1;

    this._setDiscreteCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,null,null,modeFormula,modeValue);

    /* Count density */

    this._updateDiscreteDiagram();
  }

  getDiscreteSupport(values, forHistogram) {
    return (values.s==1)?[1,100]:[1,20];
  }

  calcProbability(values, k) {
    return 1/(k**values.s)/this.#zetaS;
  }

  fitParameters(data) {
    if (data.mean<=1 || data.mean>=2.24) return null;

    let sMin=2.4; /* For smaller values calculating the zeta function becomes very inaccurate */
    let sMax=50;

    while (sMax-sMin>0.01) {
      const sMiddle=(sMin+sMax)/2;
      const sMiddleMean=zetaFunction(sMiddle-1)/zetaFunction(sMiddle);
      if (sMiddleMean>data.mean) {
        sMin=sMiddle;
      } else {
        sMax=sMiddle;
      }
    }

    return {s: (sMin+sMax)/2};
  }

  get canFit() {
    return true;
  }
}
