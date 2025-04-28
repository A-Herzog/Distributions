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

export {PowerDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRHTML, setRPlusHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * Power distribution
 */
class PowerDistribution extends ContinuousProbabilityDistribution {
  #denominator;
  #inverseC;

  constructor() {
    super(language.distributions.power.name);

    this.support=setRHTML;
    this.infoText=language.distributions.power.info;
    this.wikipediaURL=language.distributions.power.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("a","a",language.distributions.power.parameterInfoa+" (<i>a</i>"+isin+setRHTML+")",null,false,null,false,5);
    this._addContinuousParameter("b","b",language.distributions.power.parameterInfob+" (<i>b</i>"+isin+setRHTML+")",null,false,null,false,10);
    this._addContinuousParameter("c","c",language.distributions.power.parameterInfoc+" (<i>c</i>"+isin+setRPlusHTML+")",0,false,null,false,2);

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
    pdf+=frac(c+mul+"<msup><mrow><mo>(</mo>"+x+minus+a+"<mo>)</mo></mrow><mrow>"+c+minus+"<mn>1</mn></mrow></msup>","<msup><mrow><mo>(</mo>"+b+minus+a+"<mo>)</mo></mrow>"+c+"</msup>");
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=a+"<mo>&le;</mo>"+x+"<mo>&le;</mo>"+b;
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
    cdf+=frac("<msup><mrow><mo>(</mo>"+x+minus+a+"<mo>)</mo></mrow>"+c+"</msup>","<msup><mrow><mo>(</mo>"+b+minus+a+"<mo>)</mo></mrow>"+c+"</msup>");
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=a+"<mo>&le;</mo>"+x+"<mo>&le;</mo>"+b;
    cdf+=endMathML;
    return cdf;
  }

  _checkParameters(values) {
    if (values.b<values.a) {
      this._setErrorMarker("b",language.distributions.power.parameterInfobError);
      this._clearAllOutput();
      return false;
    }

    return true;
  }

  #getPDF(values, x) {
    if (x<values.a || x>values.b) return 0;
    if (values.a==values.b) return (x==values.a)?Infinity:0;

    return values.c*Math.pow(x-values.a,values.c-1)/this.#denominator;
  }

  #getCDF(values, x) {
    if (x<values.a) return 0;
    if (x>values.b) return 1;
    if (values.a==values.b) return (x>=values.a)?1:0;

    return Math.pow(x-values.a,values.c)/this.#denominator;
  }

  _calcDistribution(values) {
    this.#denominator=Math.pow(values.b-values.a,values.c);
    this.#inverseC=1/values.c;

    /* Characteristics */

    const a=variable("a");
    const b=variable("b");
    const c=variable("c");

    const meanFormula=beginMathML+a+plus+frac("<mo>(</mo>"+b+minus+a+"<mo>)</mo>"+mul+c,c+plus+"<mn>1</mn>")+endMathML;
    const varianceFormula=beginMathML+frac("<msup><mrow><mo>(</mo>"+b+minus+a+"<mo>)</mo></mrow><mn>2</mn></msup>"+mul+c,"<msup><mrow><mo>(</mo>"+c+plus+"<mn>1</mn><mo>)</mo></mrow><mn>2</mn></msup>"+mul+"<mo>(</mo>"+c+plus+"<mn>2</mn><mo>)</mo>")+ endMathML;
    const modeFormula=(values.c>1)?(beginMathML+b+endMathML):null;

    const meanValue=values.a+(values.b-values.a)*values.c/(values.c+1);
    const varianceValue=(values.b-values.a)*(values.b-values.a)*values.c/((values.c+1)*(values.c+1)*(values.c+2));
    const modeValue=(values.c>1)?values.b:null;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,null,null,modeFormula,modeValue);

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

    return Math.pow(u*this.#denominator,this.#inverseC)+values.a;
  }

  fitParameters(data) {
    if (Math.abs(data.max-data.min)<0.00001) return null;
	/*
	E = a+(b-a)*c/(c+1) = a+(b-a)*(c+1-1)/(c+1) = a+(b-a)*[1-1/(c+1)]
	1-(E-a)/(b-a) = 1/(c+1)
	c = 1/[1-(E-a)/(b-a)] - 1
	*/
	const c=1/(1-(data.mean-data.min)/(data.max-data.min))-1;
    return {a: data.min, b: data.max, c: c};
  }

  get canFit() {
    return true;
  }
}
