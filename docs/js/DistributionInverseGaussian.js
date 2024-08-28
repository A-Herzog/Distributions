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

export {InverseGaussianDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRPlus, setRPlusHTML, variable, frac, defF, plus, minus} from './MathMLTools.js';



/**
 * Inverse Gaussian distribution
 */
class InverseGaussianDistribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.inverseGaussian.name);

    this.support=setRPlusHTML;
    this.infoText=language.distributions.inverseGaussian.info;
    this.wikipediaURL=language.distributions.inverseGaussian.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("lambda","&lambda;",language.distributions.inverseGaussian.parameterInfoLambda+" (<i>&lambda;</i>"+isin+setRPlusHTML+")",0,false,null,false,4);
    this._addContinuousParameter("mu","&mu;",language.distributions.inverseGaussian.parameterInfoMu+" (<i>&mu;</i>"+isin+setRPlusHTML+")",0,false,null,false,5);

    this._setCalcParameter("x",10);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const pi=variable("&pi;");
    const lambda=variable("&lambda;");
    const mu=variable("&mu;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+="<msqrt>"+frac(lambda,"<mn>2</mn>"+pi+"<msup>"+x+"<mn>3</mn></msup>")+"</msqrt>";
    pdf+=defF("exp",minus+frac(lambda+"<msup><mrow><mo>(</mo>"+x+minus+mu+"<mo>)</mo></mrow><mn>2</mn></msup>","<mn>2</mn><msup>"+mu+"<mn>2</mn></msup>"+x),false);
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&isin;</mo>"+setRPlus;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const lambda=variable("&lambda;");
    const mu=variable("&mu;");
    const Phi=variable("&Phi;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=defF(Phi,"<msqrt>"+frac(lambda,x)+"</msqrt><mo>(</mo>"+frac(x,mu)+minus+"<mn>1</mn><mo>)</mo>",false);
    cdf+=plus+defF("exp",frac("<mn>2</mn>"+lambda,mu),false);
    cdf+=defF(Phi,minus+"<msqrt>"+frac(lambda,x)+"</msqrt><mo>(</mo>"+frac(x,mu)+plus+"<mn>1</mn><mo>)</mo>",false);
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo>"+setRPlus;
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    if (x<=0) return 0;
    return Math.sqrt(values.lambda/2/Math.PI/(x**3))*Math.exp(-values.lambda*(x-values.mu)**2/2/(values.mu**2)/x);
  }

  #getStdNormCDF(x) {
    return 0.5*(1+jStat.erf(1/Math.sqrt(2)*x));
  }

  #getCDF(values, x) {
    if (x<=0) return 0;
    return this.#getStdNormCDF(Math.sqrt(values.lambda/x)*(x/values.mu-1))+Math.exp(2*values.lambda/values.mu)*this.#getStdNormCDF(-Math.sqrt(values.lambda/x)*(x/values.mu+1));
  }

  _calcDistribution(values) {
    /* Characteristics */

    const lambda=variable("&lambda;");
    const mu=variable("&mu;");

    const meanFormula=beginMathML+mu+endMathML;
    const varianceFormula=beginMathML+frac("<msup>"+mu+"<mn>3</mn></msup>",lambda)+endMathML;

    const meanValue=values.mu;
    const varianceValue=values.mu**3/values.lambda;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Diagram */

    const that=this;
    const minX=0;
    const maxX=Math.max(10,meanValue+2*Math.sqrt(varianceValue));
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  fitParameters(data) {
    if (data.mean<=0 || data.std<=0) return null;
   /* mu=E, lambda=E**3/Var  */
   const mu=data.mean;
   const lambda=data.mean**3/data.std**2;
    return {lambda: lambda, mu: mu};
  }
}
