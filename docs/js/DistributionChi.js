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

export {ChiDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setNHTML, setRPlus0HTML, setRPlus0, variable, frac, defF, plus, minus} from './MathMLTools.js';



/**
 * Chi distribution
 */
class ChiDistribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.chi.name);

    this.support=setRPlus0HTML;
    this.infoText=language.distributions.chi.info;
    this.wikipediaURL=language.distributions.chi.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addDiscreteParameter("k","k",language.distributions.chi.parameterInfok+" (<i>k</i>"+isin+setNHTML+")",1,3);

    this._setCalcParameter("x",5);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const k=variable("k");
    const Gamma="<mi mathvariant='normal'><abbr title='"+language.functions.Gamma+"'>&Gamma;</abbr></mi>";

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<mn>1</mn>","<msup><mn>2</mn><mrow>"+frac(k,"<mn>2</mn>")+minus+"<mn>1</mn><mrow></msup>"+Gamma+"<mo>(</mo>"+frac(k,"<mn>2</mn>")+"<mo>)</mo>");
    pdf+="<msup>"+x+"<mrow>"+k+minus+"<mn>1</mn></mrow></msup>";
    pdf+="<msup><mi mathvariant='normal'>e</mi><mrow>"+minus+frac("<msup>"+x+"<mn>2</mn></msup>","<mn>2</mn>")+"</mrow></msup>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&isin;</mo>"+setRPlus0;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const k=variable("k");
    const P="<mi mathvariant='normal'><abbr title='"+language.functions.P+"'>P</abbr></mi>";

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=P+"<mo>(</mo>"+frac(k,"<mn>2</mn>")+"<mo>,</mo>"+frac("<msup>"+x+"<mn>2</mn></msup>","<mn>2</mn>")+"<mo>)</mo>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo>"+setRPlus0;
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    if (x<=0) return 0;
    const kHalf=values.k/2;
    return 1/(2**(kHalf-1)*jStat.gammafn(kHalf))*x**(values.k-1)*Math.exp(-(x**2)/2);
  }

  #getCDF(values, x) {
    if (x<=0) return 0;
    const kHalf=values.k/2;
    return jStat.lowRegGamma(kHalf,x**2/2);
  }

  _calcDistribution(values) {
    /* Characteristics */

    const k=variable("k");
    const Gamma="<mi mathvariant='normal'><abbr title='"+language.functions.Gamma+"'>&Gamma;</abbr></mi>";

    const meanFormula=beginMathML+"<msqrt><mn>2</mn></msqrt>"+frac(Gamma+"<mo>(</mo>"+frac(k+plus+"<mn>1</mn>","<mn>2</mn>")+"<mo>)</mo>",Gamma+"<mo>(</mo>"+frac(k,"<mn>2</mn>")+"<mo>)</mo>")+endMathML;
    const varianceFormula=beginMathML+k+minus+"<mn>2</mn><msup><mrow><mo>(</mo>"+frac(Gamma+"<mo>(</mo>"+frac(k+plus+"<mn>1</mn>","<mn>2</mn>")+"<mo>)</mo>",Gamma+"<mo>(</mo>"+frac(k,"<mn>2</mn>")+"<mo>)</mo>")+"<mo>)</mo></mrow><mn>2</mn></msup>"+endMathML;
    const medianFormula=beginMathML+"<msqrt>"+k+"<msup><mrow><mo>(</mo><mn>1</mn>"+minus+frac("<mn>2</mn>","<mn>9</mn>"+k)+"<mo>)</mo></mrow><mn>3</mn></msup></msqrt>"+endMathML;
    let  modeFormula=null;
    if (values.k>=1) modeFormula=beginMathML+"<msqrt>"+k+minus+"<mn>1</mn></msqrt>"+endMathML;


    const meanValue=Math.sqrt(2)*jStat.gammafn((values.k+1)/2)/jStat.gammafn(values.k/2);
    const varianceValue=values.k-meanValue**2;
    const medianValue=Math.sqrt(values.k*(1-2/9/values.k)**3);
    let modeValue=null;
    if (values.k>=1) modeValue=Math.sqrt(values.k-1);

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,medianFormula,medianValue,modeFormula,modeValue);

    /* Diagram */

    const that=this;
    const maxX=Math.max(0,meanValue+Math.max(15,Math.sqrt(varianceValue)*3));
    this._setContinuousDiagram(0,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  fitParameters(data) {
    if (data.mean>18.45) return null;
		const factor=Math.sqrt(2);
		let k=0;
		let gammaK=jStat.gammafn(1.0/2.0);
		let last=0;
		while (k<341) {
			k++;
			const gammaKPlus1=jStat.gammafn((k+1)/2.0);
			const y=factor*gammaKPlus1/gammaK;
			if (y>=data.mean) {
				if (last>0 && (data.mean-last)/(y-last)<0.5) {
          return {k: k-1};
				} else {
					return {k: k};
				}
			}
			gammaK=gammaKPlus1;
			last=y;
		}
		return null;
  }

  get canFit() {
    return true;
  }
}
