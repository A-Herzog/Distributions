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

export {LogGammaDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRPlusHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * Logarithmic gamma distribution
 */
class LogGammaDistribution extends ContinuousProbabilityDistribution {
  #pdfFactor;
  #cdfFactor;

  constructor() {
    super(language.distributions.logGamma.name);

    this.support=setRPlusHTML;
    this.infoText=language.distributions.logGamma.info;
    this.wikipediaURL=language.distributions.logGamma.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("a","a",language.distributions.logGamma.parameterInfoa+" (<i>a</i>"+isin+setRPlusHTML+")",0,false,null,false,5);
    this._addContinuousParameter("b","b",language.distributions.logGamma.parameterInfob+" (<i>b</i>"+isin+setRPlusHTML+")",0,false,null,false,4);

    this._setCalcParameter("x",10);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const a=variable("a");
    const b=variable("b");
    const Gamma="<mi mathvariant='normal'><abbr title='"+language.functions.Gamma+"'>&Gamma;</abbr></mi>";

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<msup>"+b+a+"</msup>",defF(Gamma,a,false))+mul;
    pdf+="<msup>"+x+"<mrow>"+minus+"<mo>(</mo>"+b+plus+"<mn>1</mn><mo>)</mo></mrow></msup>"+mul;
    pdf+="<msup><mrow><mo>(</mo>"+defF("log",x,false)+"<mo>)</mo></mrow><mrow>"+a+minus+"<mn>1</mn></mrow></msub>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&ge;</mo><mn>1</mn>";
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const a=variable("a");
    const b=variable("b");
    const Gamma="<mi mathvariant='normal'><abbr title='"+language.functions.Gamma+"'>&Gamma;</abbr></mi>";
    const gamma="<mi mathvariant='normal'><abbr title='"+language.functions.gamma+"'>&gamma;</abbr></mi>";

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac(gamma+"<mo>(</mo>"+a+"<mo>,</mo>"+b+defF("log",x,false)+"<mo>)</mo>",Gamma+"<mo>(</mo>"+a+"<mo>)</mo>");
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&ge;</mo><mn>1</mn>";
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    if (x<1) return 0;
    return this.#pdfFactor*Math.pow(x,-(values.b+1))*Math.pow(Math.log(x),values.a-1);
  }

  #getCDF(values, x) {
    if (x<1) return 0;
    return this.#cdfFactor*jStat.gammap(values.a,values.b*Math.log(x));
  }

  _calcDistribution(values) {
    this.#pdfFactor=(values.b**values.a)/jStat.gammafn(values.a);
    this.#cdfFactor=1/jStat.gammafn(values.a);

    /* Characteristics */

    const a=variable("a");
    const b=variable("b");

    const meanFormula=beginMathML+"<msup><mrow><mo>(</mo><mn>1</mn>"+minus+frac("<mn>1</mn>",b)+"<mo>)</mo></mrow><mrow>"+minus+a+"</mrow></msup>"+endMathML;
    let varianceFormula=null;
    if (values.b>2) varianceFormula=beginMathML+"<msup><mrow><mo>(</mo><mn>1</mn>"+minus+frac("<mn>2</mn>",b)+"<mo>)</mo></mrow><mrow>"+minus+a+"</mrow></msup>"+minus+"<msup><mrow><mo>(</mo><mn>1</mn>"+minus+frac("<mn>1</mn>",b)+"<mo>)</mo></mrow><mrow>"+minus+"<mn>2</mn>"+a+"</mrow></msup>"+endMathML;


    const meanValue=Math.pow(1-1/values.b,-values.a);
    let varianceValue=null;
    if (values.b>2) varianceValue=Math.pow(1-2/values.b,-values.a)-Math.pow(1-1/values.b,-2*values.a);

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,null,null,null,null);

    /* Diagram */

    const that=this;
    const minX=0;
    const maxX=Math.max(50,meanValue+3*(varianceValue===null)?10:Math.sqrt(varianceValue));
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }
}
