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

export {CosineDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * Cosine distribution
 */
class CosineDistribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.cosine.name);

    this.support=setRHTML;
    this.infoText=language.distributions.cosine.info;
    this.wikipediaURL=language.distributions.cosine.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("a","a",language.distributions.cosine.parameterInfoa+" (<i>a</i>"+isin+setRHTML+")",null,false,null,false,5);
    this._addContinuousParameter("b","b",language.distributions.cosine.parameterInfob+" (<i>b</i>"+isin+setRHTML+")",null,false,null,false,10);

    this._setCalcParameter("x",7);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const a=variable("a");
    const b=variable("b");
    const pi=variable("&pi;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+="<mo>(</mo>"+b+minus+a+"<mo>)</mo>"+mul;
    pdf+="<mo>(</mo><mn>1</mn>"+plus+defF("cos","<mn>2</mn>"+pi+mul+frac(x+minus+a,b+minus+a)+minus+pi,false)+"<mo>)</mo>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&isin;</mo><ms>[</ms>"+a+"<mo>;</mo>"+b+"<ms>]</ms>";
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const a=variable("a");
    const b=variable("b");
    const pi=variable("&pi;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<mn>1</mn>","<mn>2</mn>"+pi+mul+"<mo>(</mo>"+b+minus+a+"<mo>)</mo>")+mul;
    cdf+="<mo>(</mo><mn>2</mn>"+pi+"<mo>(</mo>"+x+minus+a+"<mo>)</mo>"+minus+"<mo>(</mo>"+b+minus+a+"<mo>)</mo>"+defF("sin","<mn>2</mn>"+pi+mul+frac(x+minus+a,b+minus+a),false)+"<mo>)</mo>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo><ms>[</ms>"+a+"<mo>;</mo>"+b+"<ms>]</ms>";
    cdf+=endMathML;
    return cdf;
  }

  _checkParameters(values) {
    if (values.a>values.b) {
      this._setErrorMarker("b",language.distributions.cosine.parameterInfobError);
      this._clearAllOutput();
      return false;
    }

    return true;
  }

  #getPDF(values, x) {
    if (values.a==values.b) return (x==values.a)?Infinity:0;
    if (x<values.a || x>values.b) return 0;
		return 1/(values.b-values.a)*(1+Math.cos(2*Math.PI*(x-values.a)/(values.b-values.a)-Math.PI));
  }

  #getCDF(values, x) {
    if (values.a==values.b) return (x>=values.a)?1:0;
    if (x<values.a) return 0;
    if (x>values.b) return 1;
    return 1/(2*Math.PI*(values.b-values.a))*(2*Math.PI*(x-values.a)-(values.b-values.a)*Math.sin(2*Math.PI*(x-values.a)/(values.b-values.a)));
  }

  _calcDistribution(values) {
    /* Characteristics */

    const a=variable("a");
    const b=variable("b");
    const pi=variable("&pi;");

    const meanFormula=beginMathML+frac(a+plus+b,"<mn>2</mn>")+endMathML;
    const varianceFormula=beginMathML+frac("<mo>(</mo><msup>"+pi+"<mn>2</mn></msup>"+minus+"<mn>6</mn><mo>)</mo><msup><mrow><mo>(</mo>"+a+minus+b+"<mo>)</mo></mrow><mn>2</mn></msup>","<mn>12</mn><msup>"+pi+"<mn>2</mn></msup>")+endMathML;

    const meanValue=(values.a+values.b)/2;
    const varianceValue=(Math.PI**2-6)*(values.a-values.b)**2/(12*Math.PI**2);

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,meanFormula,meanValue);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,values.a-3);
    const maxX=Math.max(20,values.b+3);
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  fitParameters(data) {
    return {a: data.min, b: data.max};
  }

  get canFit() {
    return true;
  }
}