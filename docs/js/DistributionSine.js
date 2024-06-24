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

export {SineDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, setRHTML, isin, variable, frac, defF, plus, minus} from './MathMLTools.js';



/**
 * Sine distribution
 */
class SineDistribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.sine.name);

    this.support=setRHTML;
    this.infoText=language.distributions.sine.info;
    this.wikipediaURL=language.distributions.sine.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("a","a",language.distributions.uniform.parameterInfoa+" (<i>a</i>"+isin+setRHTML+")",null,false,null,false,5);
    this._addContinuousParameter("b","b",language.distributions.uniform.parameterInfob+" (<i>b</i>"+isin+setRHTML+")",null,false,null,false,10);

    this._setCalcParameter("x",7.5);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const pi=variable("&pi;");
    const a=variable("a");
    const b=variable("b");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac(pi,"<mn>2</mn>");
    pdf+=defF("<mi>sin</mi>",pi+frac(x+minus+a,b+minus+a),false);
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+isin+"<ms>[</ms>"+a+";"+b+"<ms>]</ms>";
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const pi=variable("&pi;");
    const a=variable("a");
    const b=variable("b");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<mn>1</mn>","<mn>2</mn>");
    cdf+="<mo>(</mo><mn>1</mn>"+minus+defF("<mi>cos</mi>",pi+frac(x+minus+a,b+minus+a),false)+"<mo>)</mo>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+isin+"<ms>[</ms>"+a+";"+b+"<ms>]</ms>";
    cdf+=endMathML;
    return cdf;
  }

  _checkParameters(values) {
    if (values.a>values.b) {
      this._setErrorMarker("b",language.distributions.uniform.parameterInfobError);
      this._clearAllOutput();
      return false;
    }

    return true;
  }

  #getPDF(values, x) {
    x=(x-values.a)/(values.b-values.a);
    if (x<=0 || x>=1) return 0;
    return Math.PI/2*Math.sin(Math.PI*x);
  }

  #getCDF(values, x) {
    x=(x-values.a)/(values.b-values.a);
    if (x<=0) return 0;
    if (x>=1) return 1;
    return 0.5*(1-Math.cos(Math.PI*x));
  }

  _calcDistribution(values) {
    /* Characteristics */

    const pi=variable("&pi;");
    const a=variable("a");
    const b=variable("b");

    const meanFormula=beginMathML+frac(a+plus+b,"<mn>2</mn>")+endMathML;
    const varianceFormula=beginMathML+"<mo>(</mo>"+frac("<mn>1</mn>","<mn>4</mn>")+minus+frac("<mn>2</mn>","<msup>"+pi+"<mn>2</mn></msup>")+"<mo>)</mo><msup><mrow><mo>(</mo>"+b+minus+a+"<mo>)</mo></mrow><mn>2</mn></msup>"+endMathML;

    const meanValue=(values.a+values.b)/2;
    const varianceValue=(0.25-2/(Math.PI**2))*(values.b-values.a)**2;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,values.a-3);
    const maxX=Math.max(20,values.b+3);
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    /* p=0.5*(1-cos(pi*x)) => arccos(1-2p)/pi=x */
    const u=Math.random();
    const x=Math.acos(1-2*u)/Math.PI;
    return x*(values.b-values.a)+values.a;
  }

  fitParameters(data) {
    return {a: data.min, b: data.max};
  }
}
