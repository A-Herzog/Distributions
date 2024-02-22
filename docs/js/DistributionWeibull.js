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

export {WeibullDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRPlus0, setRPlus0HTML, setRPlusHTML, variable, frac, defF, plus, minus} from './MathMLTools.js';



/**
 * Weibull distribution
 */
class WeibullDistribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.weibull.name);

    this.support=setRPlus0HTML;
    this.infoText=language.distributions.weibull.info;
    this.wikipediaURL=language.distributions.weibull.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("beta","&beta;",language.distributions.weibull.parameterInfoBeta+" (<i>a</i>"+isin+setRPlusHTML+")",0,false,null,false,2);
    this._addContinuousParameter("lambda","&lambda;",language.distributions.weibull.parameterInfoLambda+" (<i>b</i>"+isin+setRPlusHTML+")",0,false,null,false,0.2);

    this._setCalcParameter("x",5);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const beta=variable("&beta;");
    const lambda=variable("&lambda;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=lambda+beta+"<msup><mrow><ms>(</ms>"+lambda+x+"<ms>)</ms></mrow><mrow>"+beta+minus+"<mn>1</mn></mrow></msup><msup><mi mathvariant='normal'>e</mi><mrow>"+minus+"<msup><mrow><ms>(</ms>"+lambda+x+"<ms>)</ms></mrow>"+beta+"</msup></mrow></msup>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&isin;</mo>"+setRPlus0;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const beta=variable("&beta;");
    const lambda=variable("&lambda;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+="<mn>1</mn>"+minus+"<msup><mi mathvariant='normal'>e</mi><mrow>"+minus+"<msup><mrow><ms>(</ms>"+lambda+x+"<ms>)</ms></mrow>"+beta+"</msup></mrow></msup>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo>"+setRPlus0;
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    if (x<0) return 0;
    return values.lambda*values.beta*(values.lambda*x)**(values.beta-1)*Math.exp(-((values.lambda*x)**values.beta));
  }

  #getCDF(values, x) {
    if (x<0) return 0;
    return 1-Math.exp(-((values.lambda*x)**values.beta));
  }

  _calcDistribution(values) {
    /* Characteristics */

    const beta=variable("&beta;");
    const lambda=variable("&lambda;");
    const Gamma="<mi mathvariant='normal'><abbr title='"+language.functions.Gamma+"'>&Gamma;</abbr></mi>";

    const meanFormula=beginMathML+frac(Gamma+"<mo>(</mo><mn>1</mn>"+plus+frac("<mn>1</mn>",beta)+"<mo>)</mo>",lambda)+endMathML;
    const varianceFormula=beginMathML+frac(Gamma+"<mo>(</mo><mn>1</mn>"+plus+frac("<mn>2</mn>",beta)+"<mo>)</mo>"+minus+"<msup>"+Gamma+"<mn>2</mn></msup><mo>(</mo><mn>1</mn>"+plus+frac("<mn>1</mn>",beta)+"<mo>)</mo>","<msup>"+lambda+"<mn>2</mn></msup>")+endMathML;

    const meanValue=jStat.gammafn(1+1/values.beta)/values.lambda;
    const varianceValue=(jStat.gammafn(1+2/values.beta)-jStat.gammafn(1+1/values.beta)**2)/(values.lambda**2);

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Diagram */

    const that=this;
    this._setContinuousDiagram(0,meanValue+4*Math.sqrt(varianceValue),x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    const u=Math.random();
    /* y=1-exp(-(lambda*x)^beta) <=> x=(-log(1-y))^(1/beta)/lambda */
    return (-Math.log(1-u))**(1/values.beta)/values.lambda;
  }
}