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

export {FrechetDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRHTML, setRPlusHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * Frechet distribution
 */
class FrechetDistribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.frechet.name);

    this.support=setRHTML;
    this.infoText=language.distributions.frechet.info;
    this.wikipediaURL=language.distributions.frechet.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("delta","&delta;",language.distributions.frechet.parameterInfoDelta+" (<i>&delta;</i>"+isin+setRHTML+")",null,false,null,false,1);
    this._addContinuousParameter("beta","&beta;",language.distributions.frechet.parameterInfoBeta+" (<i>&beta;</i>"+isin+setRPlusHTML+")",0,false,null,false,5);
    this._addContinuousParameter("alpha","&alpha;",language.distributions.frechet.parameterInfoAlpha+" (<i>&alpha;</i>"+isin+setRPlusHTML+")",0,false,null,false,3);

    this._setCalcParameter("x",10);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const delta=variable("&delta;");
    const beta=variable("&beta;");
    const alpha=variable("&alpha;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    let z=frac(x+minus+delta,beta);
    z="<mrow><mo>(</mo>"+z+"<mo>)</mo></mrow>";
    pdf+=frac(alpha+mul+defF("exp","<msup>"+z+"<mrow>"+minus+alpha+"</mrow></msup>",false),beta+mul+"<msup>"+z+"<mrow>"+alpha+plus+"<mn>1</mn></mrow></msup>");
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&gt;</mo>"+delta;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const delta=variable("&delta;");
    const beta=variable("&beta;");
    const alpha=variable("&alpha;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    let z=frac(x+minus+delta,beta);
    z="<mrow><mo>(</mo>"+z+"<mo>)</mo></mrow>";
    cdf+=defF("exp",minus+frac("<mn>1</mn>","<msup>"+z+alpha+"</msup>"),false);
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&gt;</mo>"+delta;
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    if (x<=values.delta) return 0;

    const z=(x-values.delta)/values.beta;
    return values.alpha*Math.exp(-Math.pow(z,-values.alpha))/(values.beta*Math.pow(z,values.alpha+1));
  }

  #getCDF(values, x) {
    if (x<=values.delta) return 0;

    const z=(x-values.delta)/values.beta;
    return Math.exp(-1/Math.pow(z,values.alpha));
  }

  _calcDistribution(values) {
    /* Characteristics */

    const delta=variable("&delta;");
    const beta=variable("&beta;");
    const alpha=variable("&alpha;");
    const Gamma=variable("&Gamma;");

    const meanFormula=beginMathML+delta+plus+beta+mul+defF(Gamma,"<mn>1</mn>"+minus+frac("<mn>1</mn>",alpha),false)+endMathML;
    const varianceFormula=beginMathML+"<msup>"+beta+"<mn>2</mn></msup><mo>(</mo>"+defF(Gamma,"<mn>1</mn>"+minus+frac("<mn>2</mn>",alpha),false)+minus+defF(Gamma,"<mn>1</mn>"+minus+frac("<mn>1</mn>",alpha),false)+"<mo>)</mo>"+endMathML;

    const meanValue=(values.alpha<=1)?Infinity:values.delta+values.beta*jStat.gammafn(1-1/values.alpha);
    const varianceValue=(values.alpha<=2)?Infinity:values.beta**2*(jStat.gammafn(1-2/values.alpha)-jStat.gammafn(1-1/values.alpha)**2);

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,values.delta-3);
    const maxX=Math.max(20,Math.round((isFinite(meanValue)?meanValue:20)+Math.sqrt(isFinite(varianceValue)?varianceValue:20)*3));
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    const u=Math.random();
    return Math.pow(-Math.log(u),-1/values.alpha)*values.beta+values.delta;
  }
}
