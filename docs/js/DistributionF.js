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

export {FDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRPlusHTML, setRPlus0, setRPlus0HTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * F distribution
 */
class FDistribution extends ContinuousProbabilityDistribution {
  #pdfFactor;

  constructor() {
    super(language.distributions.f.name);

    this.support=setRPlus0HTML;
    this.infoText=language.distributions.f.info;
    this.wikipediaURL=language.distributions.f.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();

    this._addContinuousParameter("m","m",language.distributions.f.parameterInfom+" (<i>m</i>"+isin+setRPlusHTML+")",0,false,null,false,10);
    this._addContinuousParameter("n","n",language.distributions.f.parameterInfon+" (<i>n</i>"+isin+setRPlusHTML+")",0,false,null,false,5);

    this._setCalcParameter("x",3);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const m=variable("m");
    const n=variable("n");
    const Gamma="<mi mathvariant='normal'><abbr title='"+language.functions.Gamma+"'>&Gamma;</abbr></mi>";

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+="<msup>"+m+frac(m,"<mn>2</mn>")+"</msup><msup>"+n+frac(n,"<mn>2</mn>")+"</msup>"+mul;
    pdf+=frac(Gamma+"<mo>(</mo>"+frac(m+plus+n,"<mn>2</mn>")+"<mo>)</mo>",Gamma+"<mo>(</mo>"+frac(m,"<mn>2</mn>")+"<mo>)</mo>"+Gamma+"<mo>(</mo>"+frac(n,"<mn>2</mn>")+"<mo>)</mo>")+mul;
    pdf+=frac("<msup>"+x+"<mrow>"+frac(m,"<mn>2</mn>")+minus+"<mn>1</mn></mrow>","<msup><mrow><mo>(</mo>"+m+x+plus+n+"<mo>)</mo></mrow>"+frac(m+plus+n,"<mn>2</mn>")+"</msup>");
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
    const m=variable("m");
    const n=variable("n");
    const I="<mi mathvariant='normal'><abbr title='"+language.functions.I+"'>I</abbr></mi>";

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+="<msub>"+I+frac(m+mul+x,m+mul+x+plus+n)+"</msub><mo>(</mo>"+frac(m,"<mn>2</mn>")+"<mo>,</mo>"+frac(n,"<mn>2</mn>")+"<mo>)</mo>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo>"+setRPlus0;
    cdf+=endMathML;
    return cdf;
  }

  #getPDF(values, x) {
    if (x<=0) return 0;
    return this.#pdfFactor*x**(values.m/2-1)/((values.m*x+values.n)**((values.m+values.n)/2));
  }

  #getCDF(values, x) {
    if (x<=0) return 0;
    return jStat.ibeta(values.m*x/(values.m*x+values.n),values.m/2,values.n/2);
  }

  _calcDistribution(values) {
    this.#pdfFactor=values.m**(values.m/2)*values.n**(values.n/2)*jStat.gammafn((values.m+values.n)/2)/jStat.gammafn(values.m/2)/jStat.gammafn(values.n/2);

    /* Characteristics */

    const m=variable("m");
    const n=variable("n");

    const meanFormula=beginMathML+frac(n,n+minus+"<mn>2</mn>")+endMathML;
    const varianceFormula=beginMathML+frac("<mn>2</mn><msup>"+n+"<mn>2</mn></msup><ms>(</ms>"+m+plus+n+minus+"<mn>2</mn><ms>)</ms>",m+"<msup><mrow><ms>(</ms>"+n+minus+"<mn>2</mn><ms><ms>)</ms></mrow><mn>2</mn></msup><ms>(</ms>"+n+minus+"<mn>4</mn><ms>)</ms>")+endMathML;

    const meanValue=(values.n>2)?(values.n/(values.n-2)):NaN;
    const varianceValue=(values.n>4)?(2*values.n**2*(values.m+values.n-2)/(values.m*(values.n-2)**2*(values.n-4))):NaN;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue);

    /* Diagram */

    const that=this;
    const maxX=Math.max(20,meanValue+3*Math.sqrt(varianceValue));
    this._setContinuousDiagram(0,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }
}