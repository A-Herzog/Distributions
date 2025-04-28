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

export {WignerSemicircleDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setR, setRPlus, setRHTML, setRPlusHTML, variable, frac, defF, plus, minus} from './MathMLTools.js';

/**
 * Wigner semicircle distribution
 */
class WignerSemicircleDistribution extends ContinuousProbabilityDistribution {
  #pdfFactor;
  #cdfFactor;

  constructor() {
    super(language.distributions.wignerSemicircle.name);

    this.support=beginMathML+"<mo>[</mo><mi>m</mi>"+minus+"<mi>R</mi><mo>,</mo><mi>m</mi>"+plus+"<mi>R</mi><mo>]</mo>"+endMathML+", "+beginMathML+"<mi>m</mi>"+isin+setR+endMathML+", "+beginMathML+"<mi>R</mi>"+isin+setRPlus+endMathML;
    this.infoText=language.distributions.wignerSemicircle.info;
    this.wikipediaURL=language.distributions.wignerSemicircle.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("m","m",language.distributions.wignerSemicircle.parameterInfoM+" (<i>m</i>"+isin+setRHTML+")",null,false,null,false,0);
    this._addContinuousParameter("R","R",language.distributions.wignerSemicircle.parameterInfoR+" (<i>R</i>"+isin+setRPlusHTML+")",0,false,null,false,3);

    this._setCalcParameter("x",2);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const R=variable("R");
    const m=variable("m");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<mn>2</mn>","<mo>&pi;</mo><msup>"+R+"<mn>2</mn></msup>");
    pdf+="<msqrt><msup>"+R+"<mn>2</mn></msup>"+minus+"<msup><mrow><mo>(</mo>"+x+minus+m+"<mo>)</mo></mrow><mn>2</mn></msup></msqrt>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&isin;</mo><mo>[</mo><mo>-</mo>"+R+plus+m+"<mo>;</mo>"+R+plus+m+"<mo>]</mo>";
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const R=variable("R");
    const m=variable("m");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<mn>1</mn>","<mn>2</mn>");
    cdf+=plus;
    cdf+=frac("<mo>(</mo>"+x+minus+m+"<mo>)</mo><msqrt><msup>"+R+"<mn>2</mn></msup>"+minus+"<msup><mrow><mo>(</mo>"+x+minus+m+"<mo>)</mo></mrow><mn>2</mn></msup></msqrt>","<mo>&pi;</mo><msup>"+R+"<mn>2</mn></msup>");
    cdf+=plus;
    cdf+=frac("<mo>arcsin</mo><mo>(</mo>"+frac(x+minus+m,R)+"<mo>)</mo>","<mo>&pi;</mo>");
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo><mo>[</mo><mo>-</mo>"+R+plus+m+"<mo>;</mo>"+R+plus+m+"<mo>]</mo>";
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    x=x-values.m;
    if (x<=-values.R || x>=values.R) return 0;

    return this.#pdfFactor*Math.sqrt(values.R**2-x**2);
  }

  #getCDF(values, x) {
    x=x-values.m;
    if (x<=-values.R) return 0;
    if (x>=values.R) return 1;

    const R=values.R;

    return 0.5+x*Math.sqrt(R**2-x**2)/this.#cdfFactor+Math.asin(x/R)/Math.PI;
  }

  _calcDistribution(values) {
    this.#pdfFactor=2/Math.PI/(values.R**2);
    this.#cdfFactor=Math.PI*values.R**2;

    /* Characteristics */

    const R=variable("R");
    const m=variable("m");

    const meanFormula=beginMathML+m+endMathML;
    const varianceFormula=beginMathML+frac("<msup>"+R+"<mn>2</mn></msup>","<mn>4</mn>")+endMathML;

    const meanValue=values.m;
    const varianceValue=values.R**2/4;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,meanFormula,meanValue,meanFormula,meanValue);

    /* Diagram */

    const that=this;
    const minX=values.m-Math.ceil(values.R*1.25);
    const maxX=values.m+Math.ceil(values.R*1.25);
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  fitParameters(data) {
    if (data.std<=0) return null;
    return {m: data.mean, R: data.std*2};
  }

  get canFit() {
    return true;
  }
}
