/*
Copyright 2024 Alexander Herzog

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

export {RayleighDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRPlus0, setRPlus0HTML, setRPlusHTML, variable, frac, defF, minus, mul} from './MathMLTools.js';
import {formatNumber} from './NumberTools.js';



/**
 * Rayleigh distribution
 */
class RayleighDistribution extends ContinuousProbabilityDistribution {
  #sigma;
  #sigma2;

  constructor() {
    super(language.distributions.rayleigh.name);

    this.support=setRPlus0HTML;
    this.infoText=language.distributions.rayleigh.info;
    this.wikipediaURL=language.distributions.rayleigh.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("m","m",language.distributions.rayleigh.parameterInfom+" (<i>m</i>"+isin+setRPlusHTML+")",0,false,null,false,3);

    this._setCalcParameter("x",10);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const m=variable("m");
    const sigma=variable("&sigma;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac(x,"<msup>"+sigma+"<mn>2</mn></msup>")+mul;
    pdf+=defF("exp",minus+frac("<msup>"+x+"<mn>2</mn></msup>","<mn>2</mn><msup>"+sigma+"<mn>2</mn></msup>"),false);
    pdf+=endMathML;
    pdf+=" "+language.distributions.with+" ";
    pdf+=beginMathML;
    pdf+=sigma+"<mo>=</mo>"+m+mul+"<msqrt>"+frac("<mn>2</mn>","<mi>&pi;</mi>")+"</msqrt>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+isin+setRPlus0;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const m=variable("m");
    const sigma=variable("&sigma;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+="<mn>1</mn>"+minus;
    cdf+=defF("exp",minus+frac("<msup>"+x+"<mn>2</mn></msup>","<mn>2</mn><msup>"+sigma+"<mn>2</mn></msup>"),false);
    cdf+=endMathML;
    cdf+=" "+language.distributions.with+" ";
    cdf+=beginMathML;
    cdf+=sigma+"<mo>=</mo>"+m+mul+"<msqrt>"+frac("<mn>2</mn>","<mi>&pi;</mi>")+"</msqrt>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+isin+setRPlus0;
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    if (x<0) return 0;
    return x/this.#sigma2*Math.exp(-(x**2)/2/this.#sigma2);
  }

  #getCDF(values, x) {
    if (x<0) return 0;
    return 1-Math.exp(-(x**2)/2/this.#sigma2);
  }

  _calcDistribution(values) {
    this.#sigma=Math.sqrt(2/Math.PI)*values.m;
    this.#sigma2=this.#sigma**2;

    /* Characteristics */

    const a=variable("a");
    const pi=variable("&pi;");

    const sigma=variable("&sigma;");
    const m=variable("m");
    const info=[];
    info.push(["",beginMathML+sigma+endMathML,"=",beginMathML+m+mul+"<msqrt><mn>2</mn><mo>/</mo>"+pi+"</msqrt>"+endMathML,"&approx;",formatNumber(this.#sigma)]);
    const meanFormula=beginMathML+m+"<mo>=</mo>"+sigma+mul+"<msqrt>"+pi+"<mo>/</mo><mn>2</mn></msqrt>"+endMathML;
    const varianceFormula=beginMathML+frac("<mn>4</mn>"+minus+pi,"<mn>2</mn>")+mul+"<msup>"+sigma+"<mn>2</mn></msup>"+endMathML;
    const medianFormula=beginMathML+"<msqrt><mn>2</mn>"+defF("log","<mn>2</mn>",false)+"</msqrt>"+mul+sigma+endMathML;
    const modeFormula=beginMathML+sigma+endMathML;

    const meanValue=values.m;
    const varianceValue=(4-Math.PI)/2*this.#sigma**2;
    const medianValue=this.#sigma*Math.sqrt(2*Math.LOG2E);
    const modeValue=this.#sigma;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,medianFormula,medianValue,modeFormula,modeValue,info);

    /* Diagram */

    const that=this;
    const maxX=Math.max(20,meanValue+3*Math.sqrt(varianceValue));
    this._setContinuousDiagram(0,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  fitParameters(data) {
    if (data.mean<=0) return null;
    return {m: data.mean};
  }

  get canFit() {
    return true;
  }
}
