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

export {LogLogisticDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRPlus0, setRPlus0HTML, setRPlusHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * Log-logistic distribution
 */
class LogLogisticDistribution extends ContinuousProbabilityDistribution {
  #inverseBeta;

  constructor() {
    super(language.distributions.logLogistic.name);

    this.support=setRPlus0HTML;
    this.infoText=language.distributions.logLogistic.info;
    this.wikipediaURL=language.distributions.logLogistic.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("alpha","&alpha;",language.distributions.logLogistic.parameterInfoAlpha+" (<i>&alpha;</i>"+isin+setRPlusHTML+")",0,false,null,false,1);
    this._addContinuousParameter("beta","&beta;",language.distributions.logLogistic.parameterInfoBeta+" (<i>&beta;</i>"+isin+setRPlusHTML+")",0,false,null,false,3);

    this._setCalcParameter("x",10);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const alpha=variable("&alpha;");
    const beta=variable("&beta;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac(beta,alpha)+mul;
    pdf+=frac("<msup><mrow><mo>(</mo>"+frac(x,alpha)+"<mo>)</mo></mrow><mrow>"+beta+minus+"<mn>1</mn></mrow></msup>","<msup><mrow><mo>(</mo><mn>1</mn>"+plus+"<msup><mrow><mo>(</mo>"+frac(x,alpha)+"<mo>)</mo></mrow>"+beta+"</msup><mo>)</mo></mrow><mn>2</mn></msup>");
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
    const alpha=variable("&alpha;");
    const beta=variable("&beta;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<mn>1</mn>","<mn>1</mn>"+plus+"<msup><mrow><mo>(</mo>"+frac(x,alpha)+"<mo>)</mo></mrow><mrow>"+minus+beta+"</mrow>");
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+isin+setRPlus0;
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
		const xalpha=x/values.alpha;
		const denominator=1+xalpha**values.beta;
		return (values.beta/values.alpha)*xalpha**(values.beta-1)/(denominator**2);
  }

  #getCDF(values, x) {
    return 1/(1+(x/values.alpha)**(-values.beta));
  }

  _calcDistribution(values) {
  this.#inverseBeta=1/values.beta;

    /* Characteristics */

    const mu=variable("&mu;");
    const alpha=variable("&alpha;");
    const beta=variable("&beta;");
    const pi=variable("&pi;");

    const meanFormula=beginMathML+frac(alpha+pi,beta+defF("sin",frac(pi,beta),false))+endMathML;
    const b=frac(pi,beta);
    const sinb=defF("sin",b,false);
    const varianceFormula=beginMathML+"<msup>"+alpha+"<mn>2</mn></msup>"+mul+"<mo>(</mo>"+frac("<mn>2</mn>"+b,defF("sin","<mn>2</mn>"+b,false))+minus+frac("<msup><mrow><mo>(</mo>"+b+"<mo>)</mo></mrow><mn>2</mn></msup>","<msup><mrow><mo>(</mo>"+sinb+"<mo>)</mo></mrow><mn>2</mn></msup>")+"<mo>)</mo>"+endMathML;

    const meanValue=values.alpha*Math.PI/values.beta/Math.sin(Math.PI/values.beta);
    let varianceValue=0;
    if (values.beta>2) {
		  const b=Math.PI/values.beta;
		  const sinb=Math.sin(b);
		  varianceValue=values.alpha**2*(2*b/Math.sin(2*b)-b**2/(sinb**2));
    }

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Diagram */

    const that=this;
    const maxX=meanValue+2*Math.sqrt(varianceValue);
    this._setContinuousDiagram(0,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    const u=Math.random();
    return values.alpha*(u/(1-u))**this.#inverseBeta;
  }

  fitParameters(data) {
    /*
    factor=mean/(std**2+mean**2)
    beta=pi/acos(alpha*factor)
    */
   const factor=data.mean/(data.std**2+data.mean**2);
   let alpha;
   if (factor<1) {
     alpha=Math.floor(1/factor);
     if (alpha>1) alpha--;
   } else {
     alpha=1/factor;
   }
   const beta=Math.PI/Math.acos(Math.min(1,alpha*factor));

   return {alpha: alpha, beta: beta};
  }
}
