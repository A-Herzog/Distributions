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

export {TriangularDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRHTML, variable, frac, defF, plus, minus} from './MathMLTools.js';



/**
 * Triangular distribution
 */
class TriangularDistribution extends ContinuousProbabilityDistribution {
  #factor1;
  #factor2;
  #factorRndSelect;
  #factorRnd1;
  #factorRnd2;

  constructor() {
    super(language.distributions.triangular.name);

    this.support=setRHTML;
    this.infoText=language.distributions.triangular.info;
    this.wikipediaURL=language.distributions.triangular.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("a","a",language.distributions.triangular.parameterInfoa+" (<i>a</i>"+isin+setRHTML+")",null,false,null,false,5);
    this._addContinuousParameter("c","c",language.distributions.triangular.parameterInfoc+" (<i>c</i>"+isin+setRHTML+")",null,false,null,false,7);
    this._addContinuousParameter("b","b",language.distributions.triangular.parameterInfob+" (<i>b</i>"+isin+setRHTML+")",null,false,null,false,10);

    this._setCalcParameter("x",8);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const a=variable("a");
    const b=variable("b");
    const c=variable("c");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<mn>2</mn><mo>(</mo>"+x+minus+a+"<mo>)</mo>","<mo>(</mo>"+b+minus+a+"<mo>)</mo><mo>(</mo>"+c+minus+a+"<mo>)</mo>");
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=a+"<mo>&le;</mo>"+x+"<mo>&le;</mo>"+c;
    pdf+=endMathML;
    pdf+=",&nbsp;&nbsp;&nbsp;";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<mn>2</mn><mo>(</mo>"+b+minus+x+"<mo>)</mo>","<mo>(</mo>"+b+minus+a+"<mo>)</mo><mo>(</mo>"+b+minus+c+"<mo>)</mo>");
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=c+"<mo>&lt;</mo>"+x+"<mo>&le;</mo>"+b;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const a=variable("a");
    const b=variable("b");
    const c=variable("c");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<msup><mrow><mo>(</mo>"+x+minus+a+"<mo>)</mo></mrow><mn>2</mn>","<mo>(</mo>"+b+minus+a+"<mo>)</mo><mo>(</mo>"+c+minus+a+"<mo>)</mo>");
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=a+"<mo>&le;</mo>"+x+"<mo>&le;</mo>"+c;
    cdf+=endMathML;
    cdf+=",&nbsp;&nbsp;&nbsp;";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+="<mn>1</mn>"+minus;
    cdf+=frac("<msup><mrow><mo>(</mo>"+b+minus+x+"<mo>)</mo></mrow><mn>2</mn>","<mo>(</mo>"+b+minus+a+"<mo>)</mo><mo>(</mo>"+b+minus+c+"<mo>)</mo>");
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=c+"<mo>&lt;</mo>"+x+"<mo>&le;</mo>"+b;
    cdf+=endMathML;
    return cdf;
  }

  _checkParameters(values) {
    if (values.c<values.a) {
      this._setErrorMarker("c",language.distributions.triangular.parameterInfocError);
      this._clearAllOutput();
      return false;
    }

    if (values.b<values.c) {
      this._setErrorMarker("b",language.distributions.triangular.parameterInfobError);
      this._clearAllOutput();
      return false;
    }

    return true;
  }

  #getPDF(values, x) {
    if (x<values.a || x>values.b) return 0;
    if (values.a==values.b) return (x==values.a)?Infinity:0;

    if (x<=values.c) {
      return 2*(x-values.a)*this.#factor1;
    } else {
      return 2*(values.b-x)*this.#factor2;
    }
  }

  #getCDF(values, x) {
    if (x<values.a) return 0;
    if (x>values.b) return 1;
    if (values.a==values.b) return (x>=values.a)?1:0;

    if (x<=values.c) {
      return (x-values.a)**2*this.#factor1;
    } else {
      return 1-(values.b-x)**2*this.#factor2;
    }
  }

  _calcDistribution(values) {
    this.#factor1=1/(values.b-values.a)/(values.c-values.a);
    this.#factor2=1/(values.b-values.a)/(values.b-values.c);
    this.#factorRndSelect=(values.c-values.a)/(values.b-values.a);
    this.#factorRnd1=Math.sqrt((values.b-values.a)*(values.c-values.a));
    this.#factorRnd2=Math.sqrt((values.b-values.a)*(values.b-values.c));

    /* Characteristics */

    const a=variable("a");
    const b=variable("b");
    const c=variable("c");

    const meanFormula=beginMathML+frac(a+plus+b+plus+c,"<mn>3</mn>")+endMathML;
    const varianceFormula=beginMathML+frac("<msup><mrow><mo>(</mo>"+a+minus+b+"<mo>)</mo></mrow><mn>2</mn></msup>"+plus+"<msup><mrow><mo>(</mo>"+b+minus+c+"<mo>)</mo></mrow><mn>2</mn></msup>"+plus+"<msup><mrow><mo>(</mo>"+a+minus+c+"<mo>)</mo></mrow><mn>2</mn></msup>","<mn>36</mn>")+endMathML;
    let medianFormula;
    if (values.c>=(values.a+values.b)/2) {
      medianFormula=beginMathML+a+plus+"<msqrt>"+frac("<mo>(</mo>"+b+minus+a+"<mo>)</mo><mo>(</mo>"+c+minus+a+"<mo>)</mo>","<mn>2</mn>")+"</msqrt>"+endMathML;
    } else {
      medianFormula=beginMathML+b+minus+"<msqrt>"+frac("<mo>(</mo>"+b+minus+a+"<mo>)</mo><mo>(</mo>"+b+minus+c+"<mo>)</mo>","<mn>2</mn>")+"</msqrt>"+endMathML;
    }
    const modeFormula=beginMathML+c+endMathML;

    const meanValue=(values.a+values.b+values.c)/3;
    const varianceValue=((values.a-values.b)**2+(values.b-values.c)**2+(values.a-values.c)**2)/36;
    let medianValue;
    if (values.c>=(values.a+values.b)/2) {
      medianValue=values.a+Math.sqrt((values.b-values.a)*(values.c-values.a)/2);
    } else {
      medianValue=values.b-Math.sqrt((values.b-values.a)*(values.b-values.c)/2);
    }
    const modeValue=values.c;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,medianFormula,medianValue,modeFormula,modeValue);

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
    const u=Math.random();

    if (values.a==values.b) return values.a;

    if (u<=this.#factorRndSelect) {
      return values.a+Math.sqrt(u)*this.#factorRnd1;
    } else {
      return values.b-Math.sqrt(1-u)*this.#factorRnd2;
    }
  }

  fitParameters(data) {
    return {a: data.mean-Math.sqrt(6)*data.std, c: data.mean, b: data.mean+Math.sqrt(6)*data.std};
  }

  get canFit() {
    return true;
  }
}