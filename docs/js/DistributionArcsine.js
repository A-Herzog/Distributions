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

export {ArcsineDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML,  setRHTML, isin,  variable, frac, defF, minus} from './MathMLTools.js';



/**
 * Arcsine distribution
 */
class ArcsineDistribution extends ContinuousProbabilityDistribution {
  #pdfFactor;

  constructor() {
    super(language.distributions.arcsine.name);

    this.support="(0;1)";
    this.infoText=language.distributions.arcsine.info;
    this.wikipediaURL=language.distributions.arcsine.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._setCalcParameter("x",0.5);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const pi=variable("&pi;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    /*
    pdf+=frac(pi,"<mn>2</mn>");
    pdf+=defF("<mi>sin</mi>",pi+x,false);
    */
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+isin+"<ms>(</ms><mn>0</mn>;<mn>1</mn><ms>)</ms>";
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const pi=variable("&pi;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    /*
    cdf+=frac("<mn>1</mn>","<mn>2</mn>");
    cdf+="<mo>(</mo><mn>1</mn>"+minus+defF("<mi>cos</mi>",pi+x,false)+"<mo>)</mo>";
    */
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+isin+"<ms>(</ms><mn>0</mn>;<mn>1</mn><ms>)</ms>";
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    if (x<=0 || x>=1) return 0;
     return 1/(Math.PI*Math.sqrt(x*(1-x)));
  }

  #getCDF(values, x) {
    if (x<=0) return 0;
    if (x>=1) return 1;
    return 2/Math.PI*Math.asin(Math.sqrt(x));
  }

  _calcDistribution(values) {
    /* Characteristics */

    const pi=variable("&pi;");

    const meanFormula=beginMathML+frac("<mn>1</mn>","<mn>2</mn>")+endMathML;
    const varianceFormula=beginMathML+frac("<mn>1</mn>","<mn>8</mn>")+endMathML;

    const meanValue=1/2;
    const varianceValue=1/8;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Diagram */

    const that=this;
    const minX=0;
    const maxX=2;
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  getRandomNumber(values) {
    /* p=2/pi*arcsin(sqrt(x)) => (sin(pi*p/2))^2=x */
    const u=Math.random();
    return (Math.sin(Math.PI*u/2))**2;
  }
}
