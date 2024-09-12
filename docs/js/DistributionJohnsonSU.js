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

export {JohnsonSUDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setR, setRPlusHTML, setRHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';
import {gaussianRandomPolar} from './MathTools.js';



/**
 * Johnson SU distribution
 */
class JohnsonSUDistribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.johnson.name,language.distributions.johnson.nameFormat);

    this.support=setRHTML;
    this.infoText=language.distributions.johnson.info;
    this.wikipediaURL=language.distributions.johnson.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("gamma","&gamma;",language.distributions.johnson.parameterInfoGamma+" (<i>&gamma;</i>"+isin+setRPlusHTML+")",0,false,null,false,2);
    this._addContinuousParameter("xi","&xi;",language.distributions.johnson.parameterInfoXi+" (<i>&xi;</i>"+isin+setRPlusHTML+")",0,false,null,false,100);
    this._addContinuousParameter("delta","&delta;",language.distributions.johnson.parameterInfoDelta+" (<i>&delta;</i>"+isin+setRPlusHTML+")",0,false,null,false,1);
    this._addContinuousParameter("lambda","&lambda;",language.distributions.johnson.parameterInfoLambda+" (<i>&lambda;</i>"+isin+setRPlusHTML+")",0,false,null,false,10);

    this._setCalcParameter("x",10);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const pi=variable("&pi;");
    const gamma=variable("&gamma;");
    const xi=variable("&xi;");
    const delta=variable("&delta;");
    const lambda=variable("&lambda;");

    const fr=frac(x+minus+xi,lambda);
    const ex=gamma+plus+delta+mul+defF("asinh",fr,false);

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac(delta,lambda+"<msqrt><mn>2</mn>"+pi+"</msqrt>")+mul;
    pdf+=frac("<mn>1</mn>","<msqrt><mn>1</mn>"+plus+"<msup><mrow><mo>(</mo>"+fr+"<mo>)</mo></mrow><mn>2</mn></msup></msqrt>")+mul;
    pdf+=defF("exp",minus+frac("<mn>1</mn>","<mn>2</mn>")+"<msup><mrow><mo>(</mo>"+ex+"<mo>)</mo></mrow><mn>2</mn></msup>",false);
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
    const gamma=variable("&gamma;");
    const xi=variable("&xi;");
    const delta=variable("&delta;");
    const lambda=variable("&lambda;");
    const Phi=variable("&Phi;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=defF(Phi,gamma+plus+delta+mul+defF("asinh",frac(x+minus+xi,lambda),false));
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo>"+setR;
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    const frac=(x-values.xi)/values.lambda;
	  const exponentPart=values.gamma+values.delta*Math.asinh(frac);
	  return values.delta/(values.lambda*Math.sqrt(2*Math.PI))*1/Math.sqrt(1+frac**2)*Math.exp(-0.5*exponentPart**2);
  }

  #getStdNormCDF(x) {
    return 0.5*(1+jStat.erf(1/Math.sqrt(2)*x));
  }

  #getStdNormRandom() {
    return gaussianRandomPolar(0,1);
  }

  #getCDF(values, x) {
    return this.#getStdNormCDF(values.gamma+values.delta*Math.asinh((x-values.xi)/values.lambda));
  }

  _calcDistribution(values) {
    /* Characteristics */

    const gamma=variable("&gamma;");
    const xi=variable("&xi;");
    const delta=variable("&delta;");
    const lambda=variable("&lambda;");

    const meanFormula=beginMathML+xi+minus+lambda+mul+defF("exp",frac("<mn>1</mn>","<mn>2</mn>"+mul+"<msup>"+delta+"<mn>2</mn></msup>"),false)+mul+defF("sinh",frac(gamma,delta),false)+endMathML;
    const exML=defF("exp",frac("<mn>1</mn>","<msup>"+delta+"<mn>2</mn></msup>"),false);
    const varianceFormula=beginMathML+frac("<msup>"+lambda+"<mn>2</mn></msup>","<mn>2</mn>")+mul+"<mo>(</mo>"+exML+minus+"<mn>1</mn><mo>)</mo>"+mul+"<mo>(</mo>"+exML+mul+defF("coth","<mn>2</mn>"+gamma+delta,false)+plus+"<mn>1</mn><mo>)</mo>"+endMathML;

    const meanValue=values.xi-values.lambda*Math.exp(1/(2*values.delta**2))*Math.sinh(values.gamma/values.delta);
    const ex=Math.exp(1/(values.delta**2));
    const varianceValue=values.lambda**2/2*(ex-1)*(ex*Math.cosh(2*values.gamma*values.delta)+1);

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,meanValue-2*Math.sqrt(varianceValue));
    const maxX=Math.max(10,meanValue+2*Math.sqrt(varianceValue));
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    return values.lambda*Math.sinh((this.#getStdNormRandom()-values.gamma)/values.delta)+values.xi;
  }
}
