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

export {BetaDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRHTML, setRPlusHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * Beta distribution
 */
class BetaDistribution extends ContinuousProbabilityDistribution {
  #pdfFactor;

  constructor() {
    super(language.distributions.beta.name);

    this.support="[a;b]";
    this.infoText=language.distributions.beta.info;
    this.wikipediaURL=language.distributions.beta.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("alpha","&alpha;",language.distributions.beta.parameterInfoAlpha+" (<i>&alpha;</i>"+isin+setRPlusHTML+")",0,false,null,false,1.5);
    this._addContinuousParameter("beta","&beta;",language.distributions.beta.parameterInfoBeta+" (<i>&beta;</i>"+isin+setRPlusHTML+")",0,false,null,false,1.5);
    this._addContinuousParameter("a","a",language.distributions.beta.parameterInfoa+" (<i>a</i>"+isin+setRHTML+")",null,false,null,false,0);
    this._addContinuousParameter("b","b",language.distributions.beta.parameterInfob+" (<i>b</i>"+isin+setRHTML+")",null,false,null,false,1);

    this._setCalcParameter("x",0.5);
  }

    _checkParameters(values) {
    if (values.a>values.b) {
      this._setErrorMarker("b",language.distributions.beta.parameterInfobError);
      this._clearAllOutput();
      return false;
    }

    return true;
  }

  #getPDFText() {
    const f=variable("f");
    const x="<msub>"+variable("x")+"<mi mathvariant='normal'>scaled</mi></msub>";
    const alpha=variable("&alpha;");
    const beta=variable("&beta;");
    const Beta="<mi mathvariant='normal'><abbr title='"+language.functions.Beta+"'>B</abbr></mi>";

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<msup>"+x+"<mrow>"+alpha+minus+"<mn>1</mn></mrow></msup><msup><mrow><mo>(</mo><mn>1</mn>"+minus+x+"<mo>)</mo></mrow><mrow>"+beta+minus+"<mn>1</mn></mrow></msup>",Beta+"<mo>(</mo>"+alpha+plus+beta+"<mo>)</mo>");
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&isin;</mo><ms>[</ms><mn>0</mn>;<mn>1</mn><ms>]</ms>";
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x="<msub>"+variable("x")+"<mi mathvariant='normal'>scaled</mi></msub>";
    const alpha=variable("&alpha;");
    const beta=variable("&beta;");
    const I="<mi mathvariant='normal'><abbr title='"+language.functions.I+"'>I</abbr></mi>";

    let cdf="";
    cdf+=beginMathML;
    cdf+="<msub>"+I+x+"</msub><ms>(</ms>"+alpha+"<mo>,</mo>"+beta+"<ms>)</ms>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo><ms>[</ms><mn>0</mn>;<mn>1</mn><ms>]</ms>";
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    if (x<values.a || x>values.b) return 0;
    if (values.a==values.b) return (x==values.a)?Infinity:0;
    x=(x-values.a)/(values.b-values.a);
    return x**(values.alpha-1)*(1-x)**(values.beta-1)*this.#pdfFactor;
  }

  #getCDF(values, x) {
    if (x<values.a) return 0;
    if (x>values.b) return 1;
    if (values.a==values.b) return (x<values.a)?0:1;
    x=(x-values.a)/(values.b-values.a);
    return jStat.ibeta(x,values.alpha,values.beta);
  }

  _calcDistribution(values) {
    this.#pdfFactor=1/jStat.betafn(values.alpha,values.beta);

    /* Characteristics */

    const alpha=variable("&alpha;");
    const beta=variable("&beta;");
    const a=variable("a");
    const b=variable("b");

    const meanFormula=beginMathML+frac(alpha,alpha+plus+beta)+mul+"<ms>(</ms>"+b+minus+a+"<ms>)</ms>"+plus+a+endMathML;
    const varianceFormula=beginMathML+frac(alpha+beta,"<msup><mrow><mo>(</mo>"+alpha+plus+beta+"<mo>)</mo></mrow><mn>2</mn></msup><mo>(</mo>"+alpha+plus+beta+plus+"<mn>1</mn><mo>)</mo>")+mul+"<ms>(</ms>"+b+minus+a+"<ms>)</ms>"+endMathML;

    let meanValue;
    let varianceValue;
    if (values.a==values.b) {
      meanValue=values.a;
      varianceValue=0;
    } else {
      meanValue=values.alpha/(values.alpha+values.beta)*(values.b-values.a)+values.a;
      varianceValue=values.alpha*values.beta/((values.alpha+values.beta)**2*(values.alpha+values.beta+1))*(values.b-values.a);
    }

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,values.a);
    const maxX=Math.max(2,meanValue+3*Math.sqrt(varianceValue));
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  fitParameters(data) {
    if (data.std<=0) return null;
		if (data.min>=data.max) return null;
		if (data.mean<data.min || data.mean>data.max) return null;

		const mean2=(data.mean-data.min)/(data.max-data.min);
		const std2=data.std/(data.max-data.min);
		if (mean2<=0) return null;

		const v=std2**2;
		const alpha=mean2*mean2/v-mean2*mean2*mean2/v-mean2;
		const beta=alpha*(1/mean2-1);

		return {a: data.min, b: data.max, alpha: alpha, beta: beta};
  }

  get canFit() {
    return true;
  }
}