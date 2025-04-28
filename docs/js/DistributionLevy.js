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

export {LevyDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setR, setRPlusHTML, setRHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * Levy distribution
 */
class LevyDistribution extends ContinuousProbabilityDistribution {
  #pdfFactor;

  constructor() {
    super(language.distributions.levy.name);

    this.support=setRHTML;
    this.infoText=language.distributions.levy.info;
    this.wikipediaURL=language.distributions.levy.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("mu","&mu;",language.distributions.levy.parameterInfoMu+" (<i>&mu;</i>"+isin+setRHTML+")",null,false,null,false,5);
    this._addContinuousParameter("gamma","&gamma;",language.distributions.levy.parameterInfoGamma+" (<i>&gamma;</i>"+isin+setRPlusHTML+")",0,false,null,false,3);

    this._setCalcParameter("x",10);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const pi=variable("&pi;");
    const mu=variable("&mu;");
    const gamma=variable("&gamma;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+="<msqrt>"+frac(gamma,"<mn>2</mn>"+pi)+"</msqrt>"+mul;
    pdf+=frac("<mn>1</mn>","<msup><mrow><mo>(</mo>"+x+minus+mu+"<mo>)</mo></mrow><mrow><mn>3</mn><mo>/</mo><mn>2</mn></mrow></msup>")+mul;
    pdf+=defF("exp",frac(gamma,"<mn>2</mn><mo>(</mo>"+x+minus+mu+"<mo>)</mo>"),false);
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&gt;</mo>"+mu;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const mu=variable("&mu;");
    const gamma=variable("&gamma;");
    const Phi=variable("&Phi;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+="<mn>2</mn>"+minus+"<mn>2</mn>"+defF(Phi,"<msqrt>"+frac(gamma,x+minus+mu)+"</msqrt>",false);
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&gt;</mo>"+mu;
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    if (x<=values.mu) return 0;
    return this.#pdfFactor*Math.exp(-values.gamma/2/(x-values.mu))/Math.pow(x-values.mu,1.5);
  }

  #getStdNormCDF(x) {
    return 0.5*(1+jStat.erf(1/Math.sqrt(2)*x));
  }

  #getCDF(values, x) {
    if (x<=values.mu) return 0;
    return 2-2*this.#getStdNormCDF(Math.sqrt(values.gamma/(x-values.mu)));
  }

  _calcDistribution(values) {
    this.#pdfFactor=Math.sqrt(values.gamma/2/Math.PI);

    /* Characteristics */

    const mu=variable("&mu;");
    const gamma=variable("&gamma;");

    const meanFormula=beginMathML+"<mn>&infin;</mn>"+endMathML;
    const varianceFormula=beginMathML+"<mn>&infin;</mn>"+endMathML;
    const modeFormula=beginMathML+mu+plus+frac(gamma,"<mn>3</mn>")+endMathML;

    const meanValue=Infinity;
    const varianceValue=Infinity;
    const modeValue=values.mu+values.gamma/3;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,null,null,modeFormula,modeValue);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,values.mu);
    const maxX=values.mu+Math.max(1,values.gamma)*7;
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }
}
