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

export {IrwinHallDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, setNHTML, isin, setRPlus0HTML, variable, frac, defF, minus, equals, binom} from './MathMLTools.js';
import {binom as binomCalc} from './MathTools.js';



/**
 * Irwin-Hall distribution
 */
class IrwinHallDistribution extends ContinuousProbabilityDistribution {
  #pdfFactor;
  #cdfFactor;

  constructor() {
    super(language.distributions.irwinhall.name);

    this.support=setRPlus0HTML;
    this.infoText=language.distributions.irwinhall.info;
    this.wikipediaURL=language.distributions.irwinhall.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addDiscreteParameterMinMax("n","n",language.distributions.irwinhall.parameterInfon+" (<i>n</i>"+isin+setNHTML+")",1,25,8);

    this._setCalcParameter("x",5);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const n=variable("n");
    const k=variable("k");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<mn>1</mn>","<mo>(</mo>"+n+minus+"<mn>1</mn><mo>)</mo><mo>!</mo>");
    pdf+="<munderover>";
    pdf+="<mo>&sum;</mo>";
    pdf+="<mrow>"+k+equals+"<mn>0</mn></mrow>";
    pdf+="<mrow><mo>&lfloor;</mo>"+x+"<mo>&rfloor;</mo></mrow>";
    pdf+="</munderover>";
    pdf+="<msup><mrow><mo>(</mo><mn>-1</mn><mo>)</mo></mrow>"+k+"</msup>";
    pdf+=binom(n,k);
    pdf+="<msup><mrow><mo>(</mo>"+n+minus+k+"<mo>)</mo></mrow><mrow>"+n+minus+"<mn>1</mn></mrow></msup>"
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&isin;</mo><mo>[</mo><mn>0</mn><mo>;</mo>"+n+"<mo>]</mo>";
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const n=variable("n");
    const k=variable("k");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<mn>1</mn>",n+"<mo>!</mo>");
    cdf+="<munderover>";
    cdf+="<mo>&sum;</mo>";
    cdf+="<mrow>"+k+equals+"<mn>0</mn></mrow>";
    cdf+="<mrow><mo>&lfloor;</mo>"+x+"<mo>&rfloor;</mo></mrow>";
    cdf+="</munderover>";
    cdf+="<msup><mrow><mo>(</mo><mn>-1</mn><mo>)</mo></mrow>"+k+"</msup>";
    cdf+=binom(n,k);
    cdf+="<msup><mrow><mo>(</mo>"+n+minus+k+"<mo>)</mo></mrow>"+n+"</msup>"
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo><mo>[</mo><mn>0</mn><mo>;</mo>"+n+"<mo>]</mo>";
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    if (x<0 || x>values.n) return 0;

    let sum=0;
    for (let k=0;k<=Math.floor(x);k++) {
      sum+=(-1)**k*binomCalc(values.n,k)*(x-k)**(values.n-1);
    }

    return this.#pdfFactor*sum;
  }

  #getCDF(values, x) {
    if (x<0) return 0;
    if (x>values.n) return 1;

    let sum=0;
    for (let k=0;k<=Math.floor(x);k++) {
      sum+=(-1)**k*binomCalc(values.n,k)*(x-k)**(values.n);
    }

    return this.#cdfFactor*sum;
  }

  _calcDistribution(values) {
    this.#pdfFactor=1/jStat.factorial(values.n-1);
    this.#cdfFactor=this.#pdfFactor/values.n;

    /* Characteristics */

    const n=variable("n");

    const meanFormula=beginMathML+frac(n,"<mn>2</mn>")+endMathML;
    const varianceFormula=beginMathML+frac(n,"<mn>12</mn>")+endMathML;
    const modeFormula=(values.n==1)?null:meanFormula;


    const meanValue=values.n/2;
    const varianceValue=values.n/12;
    const modeValue=(values.n==1)?null:meanValue;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,meanFormula,meanValue,modeFormula,modeValue);

    /* Diagram */

    const that=this;
    const minX=0;
    const maxX=Math.max(5,values.n*1.25);
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  fitParameters(data) {
    if (data.mean<0.25) return null;
    return {n: Math.round(data.mean*2)};
  }

  get canFit() {
    return true;
  }
}