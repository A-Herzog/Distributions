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

export {PertDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRHTML, variable, frac, defF, plus, minus} from './MathMLTools.js';



/**
 * Pert distribution
 */
class PertDistribution extends ContinuousProbabilityDistribution {
  #alpha;
  #beta;
  #factorPDF;
  #factorCDF;

  constructor() {
    super(language.distributions.pert.name);

    this.support=setRHTML;
    this.infoText=language.distributions.pert.info;
    this.wikipediaURL=language.distributions.pert.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("a","a",language.distributions.pert.parameterInfoa+" (<i>a</i>"+isin+setRHTML+")",null,false,null,false,5);
    this._addContinuousParameter("b","b",language.distributions.pert.parameterInfob+" (<i>b</i>"+isin+setRHTML+")",null,false,null,false,7);
    this._addContinuousParameter("c","c",language.distributions.pert.parameterInfoc+" (<i>c</i>"+isin+setRHTML+")",null,false,null,false,10);

    this._setCalcParameter("x",8);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const a=variable("a");
    const b=variable("b");
    const c=variable("c");
    const alpha=variable("&alpha;");
    const beta=variable("&beta;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);

    pdf+=frac(
        "<msup><mrow><mo>(</mo>"+x+minus+a+"<mo>)</mo></mrow><mrow>"+alpha+minus+"<mn>1</mn></mrow></msup>"+
        "<msup><mrow><mo>(</mo>"+c+minus+x+"<mo>)</mo></mrow><mrow>"+beta+minus+"<mn>1</mn></mrow></msup>",
        "<mi mathvariant='normal'>B</mi><mo>(</mo>"+alpha+"<mo>,</mo>"+beta+"<mo>)</mo>"+
        "<msup><mrow><mo>(</mo>"+c+minus+a+"<mo>)</mo></mrow><mrow>"+alpha+plus+beta+minus+"<mn>1</mn></mrow></msup>",
    );
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=a+"<mo>&lt;</mo>"+x+"<mo>&le;</mo>"+c;
    pdf+=endMathML;
    pdf+=" "+language.distributions.with+" ";
    pdf+=beginMathML;
    pdf+=alpha+"<mo>=</mo><mn>1</mn>"+plus+"<mn>4</mn>"+frac(b+minus+a,c+minus+a);
    pdf+=endMathML;
    pdf+=" "+language.distributions.and+" ";
    pdf+=beginMathML;
    pdf+=beta+"<mo>=</mo><mn>1</mn>"+plus+"<mn>4</mn>"+frac(c+minus+b,c+minus+a);
    pdf+=endMathML;

    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const a=variable("a");
    const b=variable("b");
    const c=variable("c");
    const z=variable("z");
    const alpha=variable("&alpha;");
    const beta=variable("&beta;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+="<msub><mi>I</mi>"+z+"</msub><mo>(</mo>"+alpha+"<mo>,</mo>"+beta+"<mo>)</mo>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.with+" ";
    cdf+=beginMathML;
    cdf+=z+"<mo>=</mo>"+frac(x+minus+a,c+minus+a);
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=a+"<mo>&lt;</mo>"+x+"<mo>&le;</mo>"+c;
    cdf+=endMathML;
    return cdf;
  }

  _checkParameters(values) {
    if (values.b<values.a) {
      this._setErrorMarker("b",language.distributions.pert.parameterInfobError);
      this._clearAllOutput();
      return false;
    }

    if (values.c<values.b) {
      this._setErrorMarker("x",language.distributions.pert.parameterInfocError);
      this._clearAllOutput();
      return false;
    }

    return true;
  }

  #getPDF(values, x) {
    if (x<values.a || x>values.c) return 0;
    if (values.a==values.c) return (x==values.a)?Infinity:0;

    return this.#factorPDF*Math.pow(x-values.a,this.#alpha-1)*Math.pow(values.c-x,this.#beta-1);
  }

  #getCDF(values, x) {
    if (x<values.a) return 0;
    if (x>values.c) return 1;
    if (values.a==values.c) return (x>=values.a)?1:0;

    const z=(x-values.a)*this.#factorCDF;
	return jStat.ibeta(z,this.#alpha,this.#beta);
  }

  _calcDistribution(values) {
    if (values.c>values.a) {
      this.#alpha=1+4*(values.b-values.a)/(values.c-values.a);
		  this.#beta=1+4*(values.c-values.b)/(values.c-values.a);
		  this.#factorPDF=1/Math.exp(jStat.betaln(this.#alpha,this.#beta))/Math.pow(values.c-values.a,this.#alpha+this.#beta-1);
		  this.#factorCDF=1/(values.c-values.a);
    }

    /* Characteristics */

    const a=variable("a");
    const b=variable("b");
    const c=variable("c");

    const meanFormula=beginMathML+frac(a+plus+"<mn>4</mn>"+b+plus+c,"<mn>6</mn>")+endMathML;
    const mu="<mi mathvariant='normal'>E</mi><mo>[</mo><mi>X</mi><mo>]</mo>";
    const varianceFormula=beginMathML+frac("<mo>(</mo>"+mu+minus+a+"<mo>)</mo><mo>(</mo>"+c+minus+mu+"<mo>)</mo>","<mn>7</mn>")+endMathML;

    const meanValue=(values.a+4*values.b+values.c)/6;
    const varianceValue=(meanValue-values.a)*(values.c-meanValue)/7;

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

  fitParameters(data) {
    if (data.std<=0) return null;
    return {a: data.mean-Math.sqrt(7)*data.std,b: data.mean,c: data.mean+Math.sqrt(7)*data.std};
  }

  get canFit() {
    return true;
  }
}
