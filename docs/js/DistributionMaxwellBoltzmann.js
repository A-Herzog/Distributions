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

export {MaxwellBoltzmannDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRPlus0, setRPlus0HTML, setRPlusHTML, variable, frac, defF} from './MathMLTools.js';
import {erf} from './MathTools.js';



/**
 * Maxwell-Boltzmann distribution
 */
class MaxwellBoltzmannDistribution extends ContinuousProbabilityDistribution {
  #densityFactor;
  #cumulativeProbabilityFactor;
  #erfFactor;

  constructor() {
    super(language.distributions.maxwellBoltzmann.name);

    this.support=setRPlus0HTML;
    this.infoText=language.distributions.maxwellBoltzmann.info;
    this.wikipediaURL=language.distributions.maxwellBoltzmann.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("a","a",language.distributions.maxwellBoltzmann.parameterInfoA+" (<i>a</i>"+isin+setRPlusHTML+")",0,false,null,false,3);

    this._setCalcParameter("x",10);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const a=variable("a");
    const pi=variable("&pi;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+="<msqrt>"+frac("<mn>2</mn>",pi)+"</msqrt>";
    pdf+=frac("<msup>"+x+"<mn>2</mn></msup>"+defF("exp","<mo>-</mo>"+frac("<msup>"+x+"<mn>2</mn></msup>","<mn>2</mn><msup>"+a+"<mn>2</mn></msup>"),false),"<msup>"+a+"<mn>3</mn></msup>");
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
    const a=variable("a");
    const pi=variable("&pi;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+="<mi mathvariant='normal'>erf</mi>";
    cdf+="<mo>(</mo>";
    cdf+=frac(x,"<msqrt><mn>2</mn></msqrt>"+a);
    cdf+="<mo>)</mo>";
    cdf+"<mo>-</mo>";
    cdf+="<msqrt>"+frac("<mn>2</mn>",pi)+"</msqrt>";
    cdf+=frac(x+defF("exp","<mo>-</mo>"+frac("<msup>"+x+"<mn>2</mn></msup>","<mn>2</mn><msup>"+a+"<mn>2</mn></msup>"),false),a)
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+isin+setRPlus0;
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    const x2=x**2;
    return this.#densityFactor*x2*Math.exp(-x2/2/values.a**2);
  }

  #getCDF(values, x) {
    return erf(x*this.#erfFactor)-this.#cumulativeProbabilityFactor*x*Math.exp(-(x**2)/2/values.a**2);
  }

  _calcDistribution(values) {
  this.#densityFactor=Math.sqrt(2/Math.PI)/(values.a**3);
  this.#cumulativeProbabilityFactor=Math.sqrt(2/Math.PI)/values.a;
  this.#erfFactor=1/Math.sqrt(2)/values.a;

    /* Characteristics */

    const a=variable("a");
    const pi=variable("&pi;");

    const meanFormula=beginMathML+"<mn>2</mn>"+a+"<msqrt>"+frac("<mn>2</mn>",pi)+"</msqrt>"+endMathML;
    const varianceFormula=beginMathML+frac("<msup>"+a+"<mn>2</mn></msup><mo>(</mo><mn>3</mn>"+pi+"<mo>-</mo><mn>8</mn><mo>)</mo>",pi)+endMathML;

    const meanValue=values.a*2*Math.sqrt(2/Math.PI);
    const varianceValue=values.a**2*(3*Math.PI-8)/Math.PI;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Diagram */

    const that=this;
    const maxX=meanValue+2*Math.sqrt(varianceValue);
    this._setContinuousDiagram(0,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  fitParameters(data) {
    /*
    E=a*2*Math.sqrt(2/Math.PI);
    a=E/2/Math.sqrt(2/Math.PI);
    */
   if (data.mean<=0) return null;

   return {a: data.mean/2/Math.sqrt(2/Math.PI)};
  }
}
