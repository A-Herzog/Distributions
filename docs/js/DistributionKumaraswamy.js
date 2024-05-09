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

export {KumaraswamyDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRPlusHTML, variable, frac, defF, plus, minus} from './MathMLTools.js';



/**
 * Kumaraswamy distribution
 */
class KumaraswamyDistribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.kumaraswamy.name);

    this.support="(0,1)";
    this.infoText=language.distributions.kumaraswamy.info;
    this.wikipediaURL=language.distributions.kumaraswamy.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("a","a",language.distributions.kumaraswamy.parameterInfoA+" (<i>a</i>"+isin+setRPlusHTML+")",0,false,null,false,4);
    this._addContinuousParameter("b","b",language.distributions.kumaraswamy.parameterInfoB+" (<i>b</i>"+isin+setRPlusHTML+")",0,false,null,false,2.5);

    this._setCalcParameter("x",10);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const a=variable("a");
    const b=variable("b");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=a+b+"<msup>"+x+"<mrow>"+a+minus+"<mn>1</mn></mrow></msup><msup><mrow><mo>(</mo><mn>1</mn>"+minus+"<msup>"+x+a+"</msup><mo>)</mo></mrow><mrow>"+b+minus+"<mn>1</mn></mrow></msup>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&isin;</mo><mo>(</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>)</mo>";
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const a=variable("a");
    const b=variable("b");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+="<mn>1</mn>"+minus+"<msup><mrow><mo>(</mo><mn>1</mn>"+minus+"<msup>"+x+a+"</msup><mo>)</mo></mrow>"+b+"</msup>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo><mo>(</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>)</mo>";
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    if (x<=0 || x>=1) return 0;
    const a=values.a;
    const b=values.b;
    return a*b*x**(a-1)*(1-x**a)**(b-1);
  }

  #getCDF(values, x) {
    if (x<=0) return 0;
    if (x>=1) return 1;
    return 1-(1-x**values.a)**values.b;
  }

  #getM(n) {
    const a=variable("a");
    const b=variable("b");
    const Gamma="<mi mathvariant='normal'><abbr title='"+language.functions.Gamma+"'>&Gamma;</abbr></mi>";

    return frac(b+Gamma+"<mo>(</mo><mn>1</mn>"+plus+frac("<mn>"+n+"</mn>",a)+"<mo>)</mo>"+Gamma+"<mo>(</mo>"+b+"<mo>)</mo>",Gamma+"<mo>(</mo><mn>1</mn>"+plus+frac("<mn>"+n+"</mn>",a)+plus+b+"<mo>)</mo>");
  }

  _calcDistribution(values) {
    /* Characteristics */

    const meanFormula=beginMathML+this.#getM(1)+endMathML;
    const varianceFormula=beginMathML+this.#getM(2)+minus+"<msup><mrow><mo>(</mo>"+this.#getM(1)+"<mo>)</mo></mrow><mn>2</mn></msup>"+endMathML;

    const m1=(values.b*jStat.gammafn(1+1/values.a)*jStat.gammafn(values.b))/jStat.gammafn(1+values.b+1/values.a);
    const m2=(values.b*jStat.gammafn(1+2/values.a)*jStat.gammafn(values.b))/jStat.gammafn(1+values.b+2/values.a);
    const meanValue=m1;
    const varianceValue=m2-m1**2;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Diagram */

    const that=this;
    const minX=0;
    const maxX=1.5;
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }
}