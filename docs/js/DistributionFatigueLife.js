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

export {FatigueLifeDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRHTML, setRPlusHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * Fatigue-Life distribution
 */
class FatigueLifeDistribution extends ContinuousProbabilityDistribution {
  #inverseBeta;
  #inverseGamma;

  constructor() {
    super(language.distributions.fatigueLife.name);

    this.support=setRHTML;
    this.infoText=language.distributions.fatigueLife.info;
    this.wikipediaURL=language.distributions.fatigueLife.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("mu","&mu;",language.distributions.fatigueLife.parameterInfoMu+" (<i>&mu;</i>"+isin+setRHTML+")",null,false,null,false,3);
    this._addContinuousParameter("beta","&beta;",language.distributions.fatigueLife.parameterInfoBeta+" (<i>&beta;</i>"+isin+setRPlusHTML+")",0,false,null,false,5);
    this._addContinuousParameter("gamma","&gamma;",language.distributions.fatigueLife.parameterInfoGamma+" (<i>&gamma;</i>"+isin+setRPlusHTML+")",0,false,null,false,1);

    this._setCalcParameter("x",10);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const mu=variable("&mu;");
    const beta=variable("&beta;");
    const gamma=variable("&gamma;");
    const phi=variable("&phi;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    const param=frac(x+minus+mu,beta);
    const part1="<msqrt>"+param+"</msqrt>";
    const part2="<msqrt>"+frac(beta,x+minus+mu)+"</msqrt>";
    const numerator1=part1+plus+part2;
		const numerator2=part1+minus+part2;
    pdf+=frac(numerator1,"<mn>2</mn>"+gamma+"<mo>(</mo>"+x+minus+mu+"<mo>)</mo>")+mul+defF(phi,frac(numerator2,gamma),false);
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&ge;</mo>"+mu;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const mu=variable("&mu;");
    const beta=variable("&beta;");
    const gamma=variable("&gamma;");
    const Phi=variable("&Phi;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    const param=frac(x+minus+mu,beta);
		const numerator="<msqrt>"+param+"</msqrt>"+minus+"<msqrt>"+frac(beta,x+minus+mu)+"</msqrt>";
		cdf+=defF(Phi,frac(numerator,gamma),false);
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&ge;</mo>"+mu;
    cdf+=endMathML;
    return cdf;
  }

  #stdNormPDFFactor=1/Math.sqrt(2*Math.PI);

  #getStdNormPDF(x) {
    return this.#stdNormPDFFactor*Math.exp(-0.5*x**2);
  }

  #getStdNormCDF(x) {
    return 0.5*(1+jStat.erf(1/Math.sqrt(2)*x));
  }

  #getPDF(values, x) {
    if (x<=values.mu) return 0;

    const param=(x-values.mu)*this.#inverseBeta;
		const part1=Math.sqrt(param);
		const part2=Math.sqrt(1/param);
		const numerator1=part1+part2;
		const numerator2=part1-part2;
		return numerator1/(2*values.gamma*(x-values.mu))*this.#getStdNormPDF(numerator2*this.#inverseGamma);
  }

  #getCDF(values, x) {
    if (x<=values.mu) return 0;

    const param=(x-values.mu)*this.#inverseBeta;
		const numerator=Math.sqrt(param)-Math.sqrt(1/param);
		return this.#getStdNormCDF(numerator*this.#inverseGamma);
  }

  _calcDistribution(values) {
    this.#inverseBeta=1/values.beta;
    this.#inverseGamma=1/values.gamma;

    /* Characteristics */

    const mu=variable("&mu;");
    const beta=variable("&beta;");
    const gamma=variable("&gamma;");

    const meanFormula=beginMathML+mu+plus+beta+mul+"<mo>(</mo><mn>1</mn>"+plus+frac("<msup>"+gamma+"<mn>2</mn></msup>","<mn>2</mn>")+"<mo>)</mo>"+endMathML;
    const varianceFormula=beginMathML+"<msup>"+beta+"<mn>2</mn></msup>"+mul+"<msup>"+gamma+"<mn>2</mn></msup>"+mul+"<mo>(</mo><mn>1</mn>"+plus+frac("<mn>5</mn><msup>"+gamma+"<mn>2</mn></msup>","<mn>4</mn>")+"<mo>)</mo>"+endMathML;

    const meanValue=values.mu+values.beta*(1+values.gamma**2/2);
    const varianceValue=values.beta**2*values.gamma**2*(1+5*values.gamma**2/4);

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,values.mu-3);
    const maxX=Math.max(20,Math.round(meanValue+Math.sqrt(varianceValue)*3));
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }
}
