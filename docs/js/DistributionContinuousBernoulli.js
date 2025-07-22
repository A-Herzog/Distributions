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

export {ContinuousBernoulliDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRHTML, variable, frac, defF, plus, minus} from './MathMLTools.js';



/**
 * Continuous Bernoulli distribution
 */
class ContinuousBernoulliDistribution extends ContinuousProbabilityDistribution {
  #cdfFactor;
  #Clambda;

  constructor() {
    super(language.distributions.continuousBernoulli.name);

    this.support=setRHTML;
    this.infoText=language.distributions.continuousBernoulli.info;
    this.wikipediaURL=language.distributions.continuousBernoulli.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    /* not implemented in SciPy - this.scipyText=this.#getScipyText(); */

    this._addContinuousParameter("a","a",language.distributions.continuousBernoulli.parameterInfoa+" (<i>a</i>"+isin+setRHTML+")",null,false,null,false,5);
    this._addContinuousParameter("b","b",language.distributions.continuousBernoulli.parameterInfob+" (<i>b</i>"+isin+setRHTML+")",null,false,null,false,10);
    this._addContinuousParameter("lambda","&lambda;",language.distributions.continuousBernoulli.parameterInfoLambda+" (<i>&lambda;</i>"+isin+"(0;1))",0,false,1,false,0.3);

    this._setCalcParameter("x",7);
  }

  #getPDFText() {
    const f=variable("f");
    const a=variable("a");
    const b=variable("b");
    const x=frac(variable("x")+minus+a,b+minus+a);
    const lambda=variable("&lambda;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,variable("x"));
    pdf+=frac(defF("C",lambda,false)+"<msup>"+lambda+x+"</msup><msup><mrow><mo>(</mo><mn>1</mn>"+minus+lambda+"<mo>)</mo></mrow><mrow><mn>1</mn>"+minus+x+"</mrow></msup>",b+minus+a);
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=variable("x")+"<mo>&isin;</mo><ms>[</ms>"+a+"<mo>;</mo>"+b+"<ms>]</ms>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.with+" ";
    pdf+=beginMathML;
    pdf+=defF("C",lambda)+"<mn>2</mn>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=lambda+"<mo>=</mo>"+frac("<mn>1</mn>","<mn>2</mn>");
    pdf+=endMathML;
    pdf+=" "+language.distributions.else+" ";
    pdf+=beginMathML;
    pdf+=defF("C",lambda);
    pdf+=frac("<mn>2</mn><msup><mi>tanh</mi><mrow>"+minus+"<mn>1</mn></mrow></msup><mo>(</mo><mn>1</mn>"+minus+"<mn>2</mn>"+lambda+"<mo>)</mo>","<mn>1</mn>"+minus+"<mn>2</mn>"+lambda);
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const a=variable("a");
    const b=variable("b");
    const x=frac(variable("x")+minus+a,b+minus+a);
    const lambda=variable("&lambda;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,variable("x"));
    cdf+=x;
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=lambda+"<mo>=</mo>"+frac("<mn>1</mn>","<mn>2</mn>");
    cdf+=endMathML;
    cdf+=" "+language.distributions.else+" ";
    cdf+=beginMathML;
    cdf+=defF(F,variable("x"));
    cdf+=frac("<msup>"+lambda+x+"</msup><msup><mrow><mo>(</mo><mn>1</mn>"+minus+lambda+"<mo>)</mo></mrow><mrow><mn>1</mn>"+minus+x+"</mrow></msup>"+plus+lambda+minus+"<mn>1</mn>","<mn>2</mn>"+lambda+minus+"<mn>1</mn>");
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=variable("x")+"<mo>&isin;</mo><ms>[</ms>"+a+"<mo>;</mo>"+b+"<ms>]</ms>";
    cdf+=endMathML;
    return cdf;
  }

  _checkParameters(values) {
    if (values.a>values.b) {
      this._setErrorMarker("b",language.distributions.continuousBernoulli.parameterInfobError);
      this._clearAllOutput();
      return false;
    }

    return true;
  }

  #getPDF(values, x) {
    if (values.a==values.b) return (x==values.a)?Infinity:0;
    if (x<values.a || x>values.b) return 0;

    x=(x-values.a)/(values.b-values.a);
		return (this.#Clambda*Math.pow(values.lambda,x)*Math.pow(1-values.lambda,1-x))/(values.b-values.a);
  }

  #getCDF(values, x) {
    if (values.a==values.b) return (x>=values.a)?1:0;
    if (x<values.a) return 0;
    if (x>values.b) return 1;

    x=(x-values.a)/(values.b-values.a);
    if (values.lambda==0.5) return x;
		return this.#cdfFactor*(Math.pow(values.lambda,x)*Math.pow(1-values.lambda,1-x)+values.lambda-1);
  }

  _calcDistribution(values) {
    this.#cdfFactor=(values.lambda==0.5)?1:(1/(2*values.lambda-1));
    if (values.lambda==0.5) this.#Clambda=2; else this.#Clambda=2*Math.atanh(1-2*values.lambda)/(1-2*values.lambda);

    /* Characteristics */

    const a=variable("a");
    const b=variable("b");
    const lambda=variable("&lambda;");

    let meanFormula;
    let varianceFormula;
    if (values.lambda==0.5) {
      meanFormula=beginMathML+frac("<mn>1</mn>","<mn>2</mn>")+endMathML;
      varianceFormula=beginMathML+frac("<mn>1</mn>","<mn>12</mn>")+endMathML;
    } else {
      meanFormula=beginMathML;
      meanFormula+=frac(lambda,"<mn>2</mn>"+lambda+minus+"<mn>1</mn>");
      meanFormula+=plus;
      meanFormula+=frac("<mn>1</mn>","<mn>2</mn><msup><mi>tanh</mi><mrow>"+minus+"<mn>1</mn></mrow></msup><mo>(</mo><mn>1</mn>"+minus+"<mn>2</mn>"+lambda+"<mo>)</mo>");
      meanFormula+=endMathML;
      varianceFormula=beginMathML;
      varianceFormula+=minus+frac("<mo>(</mo><mn>1</mn>"+minus+lambda+"<mo>)</mo>"+lambda,"<msup><mrow><mo>(</mo><mn>1</mn>"+minus+"<mn>2</mn>"+lambda+"<mo>)</mo></mrow><mn>2</mn></msup>");
      varianceFormula+=plus;
      varianceFormula+=frac("<mn>1</mn>","<msup><mrow><mo>(</mo><mn>2</mn><msup><mi>tanh</mi><mrow>"+minus+"<mn>1</mn></mrow></msup><mo>(</mo><mn>1</mn>"+minus+"<mn>2</mn>"+lambda+"<mo>)</mo><mo>)</mo></mrow><mn>2</mn></msup>");
      varianceFormula+=endMathML;
    }

    const meanValueUnscaled=(values.lambda==0.5)?0.5:(values.lambda/(2*values.lambda-1)+1/(2*Math.atanh(1-2*values.lambda)));
    const varianceValueUnscaled=(values.lambda==0.5)?(1/12):(-((1-values.lambda)*values.lambda)/((1-2*values.lambda)**2)+1/((2*Math.atanh(1-2*values.lambda))**2));

    const meanValue=meanValueUnscaled*(values.b-values.a)+values.a;
    const varianceValue=varianceValueUnscaled*(values.b-values.a)**2;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,values.a-3);
    const maxX=Math.max(10,values.b+3);
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }
}
