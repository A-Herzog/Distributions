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

export {CauchyDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setR, setRHTML, setRPlusHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';
import {formatNumber} from './NumberTools.js';



/**
 * Cauchy distribution
 */
class CauchyDistribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.cauchy.name);

    this.support=setRHTML;
    this.infoText=language.distributions.cauchy.info;
    this.wikipediaURL=language.distributions.cauchy.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("t","t",language.distributions.cauchy.parameterInfot+" (<i>t</i>"+isin+setRHTML+")",null,false,null,false,0);
    this._addContinuousParameter("s","s",language.distributions.cauchy.parameterInfos+" (<i>s</i>"+isin+setRPlusHTML+")",0,false,null,false,3);

    this._setCalcParameter("x",5);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const s=variable("s");
    const t=variable("t");
    const pi="<mi mathvariant='normal'>&pi;</mi>";

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<mn>1</mn>",pi)+mul;
    pdf+=frac(s,"<msup>s<mn>2</mn></msup>"+plus+"<msup><mrow><mo>(</mo>"+x+minus+t+"<mo>)</mo></mrow><mn>2</mn></msup>");
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&isin;</mo>"+setR;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const s=variable("s");
    const t=variable("t");
    const pi="<mi mathvariant='normal'>&pi;</mi>";

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<mn>1</mn>","<mn>2</mn>")+plus+frac("<mn>1</mn>",pi)+mul;
    cdf+="<mi mathvariant='normal'>arctan</mi><mo>(</mo>"+frac(x+minus+t,s)+"<mo>)</mo>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo>"+setR;
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    return 1/Math.PI*values.s/(values.s**2+(x-values.t)**2);
  }

  #getCDF(values, x) {
    return 0.5+1/Math.PI*Math.atan((x-values.t)/values.s);
  }

  _calcDistribution(values) {
    /* Characteristics */

    const tFormula=beginMathML+variable("t")+endMathML;
    this._setContinuousCharacteristics(null,null,null,null,tFormula,values.t,tFormula,values.t);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,values.t-Math.max(15,values.s*3));
    const maxX=Math.max(0,values.t+Math.max(15,values.s*3));
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    const u=Math.random();
    if (u==0) return -Infinity;
    return values.t+values.s*Math.tan(Math.PI*(u-0.5));
  }
}