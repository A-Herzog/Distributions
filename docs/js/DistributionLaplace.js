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

export {LaplaceDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, setR, setRHTML, isin, setRPlusHTML, variable, frac, defF, plus, minus} from './MathMLTools.js';



/**
 * Laplace distribution
 */
class LaplaceDistribution extends ContinuousProbabilityDistribution {
  #pdfFactor;

  constructor() {
    super(language.distributions.laplace.name);

    this.support=setRHTML;
    this.infoText=language.distributions.laplace.info;
    this.wikipediaURL=language.distributions.laplace.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("mu","&mu;",language.distributions.laplace.parameterInfoMu+" (<i>&mu;</i>"+isin+setRHTML+")",null,false,null,false,0);
    this._addContinuousParameter("sigma","&sigma;",language.distributions.laplace.parameterInfoSigma+" (<i>&sigma;</i>"+isin+setRPlusHTML+")",0,false,null,false,1);

    this._setCalcParameter("x",1);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const mu=variable("&mu;");
    const sigma=variable("&sigma;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<mn>1</mn>","<mn>2</mn>"+sigma);
    pdf+"<msup><mi mathvariant='normal'>e</mi><mrow>"+minus+frac("|"+x+minus+mu+"|",sigma)+"</mrow></msup>";
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
    const mu=variable("&mu;");
    const sigma=variable("&sigma;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<mn>1</mn>","<mn>2</mn>")+plus+frac("<mn>1</mn>","<mn>2</mn>")+"<mi mathvariant='normal'>sgn</mi><ms>(</ms>"+x+minus+mu+"<ms>)</ms>";
    cdf+="<mo>(</mo><mn>1</mn>"+minus+"<msup><mi mathvariant='normal'>e</mi><mrow>"+minus+frac("<mo>|</mo>"+x+minus+mu+"<mo>|</mo>",sigma)+"</mrow></msup><mo>)</mo>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo>"+setR;
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    return this.#pdfFactor*Math.exp(-Math.abs(x-values.mu)/values.sigma);
  }

  #getCDF(values, x) {
    return 0.5+0.5*Math.sign(x-values.mu)*(1-Math.exp(-Math.abs(x-values.mu)/values.sigma));
  }

  _calcDistribution(values) {
    this.#pdfFactor=1/(2*values.sigma);

    /* Characteristics */

    const mu=variable("&mu;");
    const sigma=variable("&sigma;");

    const meanFormula=beginMathML+mu+endMathML;
    const varianceFormula=beginMathML+"<mn>2</mn><msup>"+sigma+"<mn>2</mn></msup>"+endMathML;

    const meanValue=values.mu;
    const varianceValue=2*values.sigma**2;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,meanValue-3*Math.max(6,Math.sqrt(varianceValue)));
    const maxX=Math.max(1,meanValue+3*Math.max(6,Math.sqrt(varianceValue)));
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    const u=Math.random();
    return values.mu-values.sigma*Math.sign(u-0.5)*Math.log(1-2*Math.abs(u-0.5));
  }

  fitParameters(data) {
    if (data.std<=0) return null;
    return {mu: data.mean, sigma: data.std/Math.sqrt(2)};
  }

  get canFit() {
    return true;
  }
}