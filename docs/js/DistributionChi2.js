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

export {Chi2Distribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setNHTML, setRPlus0HTML, setRPlus0, variable, frac, defF, minus} from './MathMLTools.js';



/**
 * Chi^2 distribution
 */
class Chi2Distribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.chi2.name);

    this.support=setRPlus0HTML;
    this.infoText=language.distributions.chi2.info;
    this.wikipediaURL=language.distributions.chi2.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addDiscreteParameter("k","k",language.distributions.chi2.parameterInfok+" (<i>k</i>"+isin+setNHTML+")",1,3);

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
    pdf+=frac("<mn>1</mn>","<msup><mn>2</mn>"+frac(k,"<mn>2</mn>")+"</msup>"+Gamma+"<mo>(</mo>"+frac(k,"<mn>2</mn>")+"<mo>)</mo>");
    pdf+="<msup>"+x+"<mrow>"+frac(k,"<mn>2</mn>")+minus+"<mn>1</mn></mrow></msup>";
    pdf+="<msup><mi mathvariant='normal'>e</mi><mrow>"+minus+frac(x,"<mn>2</mn>")+"</mrow></msup>";
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
    const Gamma="<mi mathvariant='normal'><abbr title='"+language.functions.Gamma+"'>&Gamma;</abbr></mi>";
    const gamma="<mi mathvariant='normal'><abbr title='"+language.functions.gamma+"'>&gamma;</abbr></mi>";

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<mn>1</mn>",Gamma+"<mo>(</mo>"+frac(k,"<mn>2</mn>")+"<mo>)</mo>");
    cdf+=gamma+"<mo>(</mo>"+frac(k,"<mn>2</mn>")+"<mo>,</mo>"+frac(x,"<mn>2</mn>")+"<mo>)</mo>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo>"+setRPlus0;
    cdf+=endMathML;
    return cdf;
  }

  #getScipyText() {
    return `
      from math import sqrt
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameter k here

      # Translate to scipy parameters
      df = k

      # Characterstics (via scipy)
      print("mean =", np.round(stats.chi2.mean(df), 3))
      print("variance =", np.round(stats.chi2.var(df), 3))
      print("standard deviation =", np.round(stats.chi2.std(df), 3))

      # Characterstics (direct calculation)
      print("mean =", np.round(k, 3))
      print("variance =", np.round(2 * k, 3))
      print("standard deviation =", np.round(sqrt(2 * k), 3))

      # Probability density function
      x = np.linspace(0, 15, 500)
      pdf = stats.chi2.pdf(x, df)
      plt.plot(x, pdf)`;
  }

  #getPDF(values, x) {
    if (x<=0) return 0;
    const kHalf=values.k/2;
    return 1/(2**kHalf*jStat.gammafn(kHalf))*x**(kHalf-1)*Math.exp(-x/2);
  }

  #getCDF(values, x) {
    if (x<=0) return 0;
    const kHalf=values.k/2;
    return jStat.lowRegGamma(kHalf,x/2);
  }

  _calcDistribution(values) {
    /* Characteristics */

    const k=variable("k");

    const meanFormula=beginMathML+k+endMathML;
    const varianceFormula=beginMathML+"<mn>2</mn>"+k+endMathML;
    const medianFormula=beginMathML+k+"<msup><mrow><mo>(</mo><mn>1</mn>"+minus+frac("<mn>2</mn>","<mn>9</mn>"+k)+"<mo>)</mo></mrow><mn>3</mn></msup>"+endMathML;
    const modeFormula=beginMathML+defF("max",k+minus+"<mn>2</mn><mo>,</mo><mn>0</mn>",false)+endMathML;

    const meanValue=values.k;
    const varianceValue=2*values.k;
    const medianValue=values.k*(1-2/9/values.k)**3;
    const modeValue=Math.max(values.k-2,0);

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
    if (data.mean<0.5) return null;
    return {k: Math.round(data.mean)};
  }

  get canFit() {
    return true;
  }
}