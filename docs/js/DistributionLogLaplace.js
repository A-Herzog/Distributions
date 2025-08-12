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

export {LogLaplaceDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, setR, setRHTML, isin, setRPlusHTML, variable, frac, defF, plus, minus, mul} from './MathMLTools.js';



/**
 * Log-Laplace distribution
 */
class LogLaplaceDistribution extends ContinuousProbabilityDistribution {
  constructor() {
    super(language.distributions.logLaplace.name);

    this.support=setRHTML;
    this.infoText=language.distributions.logLaplace.info;
    this.wikipediaURL=language.distributions.logLaplace.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("c","c",language.distributions.logLaplace.parameterInfoC+" (<i>c</i>"+isin+setRPlusHTML+")",0,false,null,false,2.5);
    this._addContinuousParameter("s","s",language.distributions.logLaplace.parameterInfoS+" (<i>s</i>"+isin+setRHTML+")",null,false,null,false,5);


    this._setCalcParameter("x",1);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const c=variable("c");
    const s=variable("s");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac(c,"<mn>2</mn>")+mul+"<msup><mrow><mo>(</mo>"+x+minus+s+"<mo>)</mo></mrow><mrow>"+c+minus+"<mn>1</mn></mrow></msup>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=s+"<mo>&lt;</mo>"+x+"<mo>&lt;</mo>"+s+plus+"<mn>1</mn>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.and+" ";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac(c,"<mn>2</mn>")+mul+"<msup><mrow><mo>(</mo>"+x+minus+s+"<mo>)</mo></mrow><mrow>"+minus+c+minus+"<mn>1</mn></mrow></msup>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&gt;</mo>"+s+plus+"<mn>1</mn>";
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const c=variable("c");
    const s=variable("s");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<mn>1</mn>","<mn>2</mn>")+mul+"<msup><mrow><mo>(</mo>"+x+minus+s+"<mo>)</mo></mrow><mrow>"+c+"</mrow></msup>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=s+"<mo>&lt;</mo>"+x+"<mo>&lt;</mo>"+s+plus+"<mn>1</mn>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.and+" ";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+="<mn>1</mn>"+minus+frac("<mn>1</mn>","<mn>2</mn>")+mul+"<msup><mrow><mo>(</mo>"+x+minus+s+"<mo>)</mo></mrow><mrow>"+minus+c+"</mrow></msup>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&gt;</mo>"+s+plus+"<mn>1</mn>";
    cdf+=endMathML;
    return cdf;
  }

  #getScipyText() {
    return `
      from math import sqrt
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameters mu and sigma here

      # Translate to scipy parameters
      c = c
      loc = s

      # Characterstics (via scipy)
      print("mean =", np.round(stats.loglaplace.mean(c, loc=loc), 3))
      print("variance =", np.round(stats.loglaplace.var(c, loc=loc), 3))
      print("standard deviation =", np.round(stats.loglaplace.std(c, loc=loc), 3))

      # Characterstics (direct calculation)
      print("mean =", np.round(s + c**2 / (c - 1) / (c + 1), 3) if c > 1 else "undefined")
      print("variance =", np.round(c**2 / (c - 2) / (c + 2) - c**4 / (c - 1)**2 / (c + 1)**2, 3) if c > 2 else "undefined")
      print("standard deviation =", np.round(sqrt(c**2 / (c - 2) / (c + 2) - c**4 / (c - 1)**2 / (c + 1)**2), 3) if c > 2 else "undefined")

      # Probability density function
      x = np.linspace(s - 5, s + c * 10, 500)
      pdf = stats.loglaplace.pdf(x, c, loc=loc)
      plt.plot(x, pdf)`;
  }

  #getPDF(values, x) {
		x=x-values.s;
		if (x<=0) return 0;
		if (x<1) return values.c/2*Math.pow(x,values.c-1);
		return values.c/2*Math.pow(x,-values.c-1);
  }

  #getCDF(values, x) {
		x=x-values.s;
		if (x<=0) return 0;
		if (x<1) return 0.5*Math.pow(x,values.c);
		return 1-0.5*Math.pow(x,-values.c);
  }

  _calcDistribution(values) {
    /* Characteristics */

    const c=variable("c");
    const s=variable("s");

    const meanFormula=beginMathML+((values.c>1)?(s+plus+frac("<msup>"+c+"<mn>2</mn></msup>","<mo>(</mo>"+c+minus+"<mn>1</mn><mo>)</mo><mo>(</mo>"+c+plus+"<mn>1</mn><mo>)</mo>")):"<mi>&infin;</mi>")+endMathML;
    const varianceFormula=beginMathML+((values.c>1)?(frac("<msup>"+c+"<mn>2</mn></msup>","<mo>(</mo>"+c+minus+"<mn>2</mn><mo>)</mo><mo>(</mo>"+c+plus+"<mn>2</mn><mo>)</mo>")+minus+frac("<msup>"+c+"<mn>4</mn></msup>","<msup><mrow><mo>(</mo>"+c+minus+"<mn>1</mn><mo>)</mo></mrow><mn>2</mn></msup><msup><mrow><mo>(</mo>"+c+plus+"<mn>1</mn><mo>)</mo></mrow><mn>2</mn></msup>")):"<mi>&infin;</mi>")+endMathML;

    const c2=values.c**2;
		const c4=c2**2;
    const meanValue=(values.c>1)?(values.s+c2/(values.c-1)/(values.c+1)):Number.POSITIVE_INFINITY;
    const varianceValue=(values.c>2)?(c2/(values.c-2)/(values.c+2)-c4/((values.c-1)**2*(values.c+1)**2)):Number.POSITIVE_INFINITY;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,null,null,null,null);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,values.s-3);
    let maxX=values.s+10;
    if (values.c>1) {
      maxX=meanValue+10;
      if (values.c>2) maxX=Math.max(1,meanValue+3*Math.max(6,Math.sqrt(varianceValue)));
    }
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  fitParameters(data) {
    if (data.std<=0) return null;

    /* Find c by binary search */
		const variance=data.std**2;
		let cMin=2.000001;
		let cMax=1E4;
		while (cMax-cMin>0.0001) {
			const c=(cMin+cMax)/2;
			const testVariance=c*c/(c-2)/(c+2)-c**4/((c-1)**2*(c+1)**2);
			if (testVariance>variance) cMin=c; else cMax=c;
		}
		const c=(cMin+cMax)/2;

    /* Calculate s by the formula for the mean */
		const s=data.mean-c*c/(c-1)/(c+1);

    return {c: c, s: s};
  }

  get canFit() {
    return true;
  }
}
