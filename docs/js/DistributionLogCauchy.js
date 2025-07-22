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

export {LogCauchyDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRHTML, setRPlus, setRPlusHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * Log-Cauchy distribution
 */
class LogCauchyDistribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.logCauchy.name);

    this.support=setRHTML;
    this.infoText=language.distributions.logCauchy.info;
    this.wikipediaURL=language.distributions.logCauchy.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    /* not implemented in SciPy - this.scipyText=this.#getScipyText(); */

    this._addContinuousParameter("mu","&mu;",language.distributions.logCauchy.parameterInfoMu+" (<i>t</i>"+isin+setRHTML+")",null,false,null,false,4);
    this._addContinuousParameter("sigma","&sigma;",language.distributions.logCauchy.parameterInfoSigma+" (<i>s</i>"+isin+setRPlusHTML+")",0,false,null,false,0.5);

    this._setCalcParameter("x",5);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const mu=variable("&mu;");
    const sigma=variable("&sigma;");
    const pi="<mi mathvariant='normal'>&pi;</mi>";

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac(sigma,pi+mul+x+mul+"<mo>(</mo><msup><mrow><mo>(</mo>"+defF("log",x,false)+"<mo>)</mo></mrow><mn>2</mn></msup>"+plus+"<msup>"+sigma+"<mn>2</mn></msup><mo>)</mo>");
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
    const mu=variable("&mu;");
    const sigma=variable("&sigma;");
    const pi="<mi mathvariant='normal'>&pi;</mi>";

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<mn>1</mn>",pi)+mul+defF("arctan",frac(defF("log",x)+minus+mu,sigma),false)+plus+frac("<mn>1</mn>","<mn>2</mn>");
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo>"+setRPlus;
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    if (x<=0) return 0;
    const invPi=1/Math.PI;
    return invPi/x*values.sigma/((Math.log(x)-values.mu)**2+values.sigma**2);
  }

  #getCDF(values, x) {
    if (x<=0) return 0;
    const invPi=1/Math.PI;
    return invPi*Math.atan((Math.log(x)-values.mu)/values.sigma)+0.5;
  }

  _calcDistribution(values) {
    /* Characteristics */

    const inftyFormula=beginMathML+"<mi>&infin;</mi>"+endMathML;
    const medianFormula=beginMathML+"<msup>"+variable("e")+variable("&mu;")+"</msup>"+endMathML;

    this._setContinuousCharacteristics(inftyFormula,Number.POSITIVE_INFINITY,inftyFormula,Number.POSITIVE_INFINITY,medianFormula,Math.exp(values.mu));

    /* Diagram */

    const that=this;
    this._setContinuousDiagram(0,250,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    const u=Math.random();
	  /*
	  p=1/pi*arctan((log(x)-mu)/sigma)+0.5
	  <=> tan((p-0.5)*pi)=(log(x)-mu)/sigma
	  <=> exp(tan((p-0.5)*pi)*sigma+mu)=x
	   */
	  return Math.exp(Math.tan((u-0.5)*Math.PI)*values.sigma+values.mu);
  }
}
