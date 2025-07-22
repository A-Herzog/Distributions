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

export {StudentTDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setR, setRHTML, setRPlusHTML, variable, frac, defF, plus, minus} from './MathMLTools.js';



/**
 * Student-t distribution
 */
class StudentTDistribution extends ContinuousProbabilityDistribution {
  #pdfFactor;

  constructor() {
    super(language.distributions.studentT.name);

    this.support=setRHTML;
    this.infoText=language.distributions.studentT.info;
    this.wikipediaURL=language.distributions.studentT.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("nu","&nu;",language.distributions.studentT.parameterInfoNu+" (<i>&nu;</i>"+isin+setRPlusHTML+")",0,false,null,false,5);
    this._addContinuousParameter("mu","&mu;",language.distributions.studentT.parameterInfoMu+" (<i>&mu;</i>"+isin+setRHTML+")",null,false,null,false,0);

    this._setCalcParameter("x",3);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const nu=variable("&nu;");
    const mu=variable("&mu;");
    const Gamma="<mi mathvariant='normal'><abbr title='"+language.functions.Gamma+"'>&Gamma;</abbr></mi>";

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac(Gamma+"<mo>(</mo>"+frac(nu+plus+"<mn>1</mn>","<mn>2</mn>")+"<mo>)</mo>","<msqrt>"+nu+"<mi mathvariant='normal'>&pi;</mi></msqrt>"+Gamma+"<mo>(</mo>"+frac(nu,"<mn>2</mn>")+"<mo>)</mo>");
    pdf+="<msup><mrow><mo>(</mo><mn>1</mn>"+plus+frac("<msup><mrow><ms>(</ms>"+x+minus+mu+"<ms>)</ms></mrow><mn>2</mn>",nu)+"<mo>)</mo></mrow><mrow>"+minus+frac(nu+plus+"<mn>1</mn>","<mn>2</mn>")+"</mrow></msup>";
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=x+"<mo>&isin;</mo>"+setR;
    pdf+=endMathML;
    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const nu=variable("&nu;");
    const mu=variable("&mu;");
    const I="<mi mathvariant='normal'><abbr title='"+language.functions.I+"'>I</abbr></mi>";

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<mn>1</mn>","<mn>2</mn>");
    cdf+="<msub>"+I+frac(nu,"<msup>"+x+"<mn>2</mn></msup>"+plus+nu)+"</mrow></msub>";
    cdf+="<mo>(</mo>"+frac(nu,"<mn>2</mn>")+"<mo>,</mo>"+frac("<mn>1</mn>","<mn>2</mn>")+"<mo>)</mo>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&le;</mo><mn>0</mn>";
    cdf+=endMathML;
    cdf+=endMathML;
    return cdf;
  }

  #getScipyText() {
    return `
      from math import sqrt
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameters nu and mu here

      # Translate to scipy parameters
      df = nu
      loc = mu

      # Characterstics (via scipy)
      print("mean =", np.round(stats.t.mean(df, loc=loc), 3) if df > 1 else "undefined")
      print("variance =", np.round(stats.t.var(df, loc=loc), 3) if df > 2 else "undefined")
      print("standard deviation =", np.round(stats.t.std(df, loc=loc), 3) if df > 2 else "undefined")

      # Characterstics (direct calculation)
      print("mean =", np.round(mu, 3) if nu > 1 else "undefined")
      print("variance =", np.round(nu / (nu - 2), 3) if nu > 2 else "undefined")
      print("standard deviation =", np.round(sqrt(nu / (nu - 2)), 3) if nu > 2 else "undefined")

      # Probability density function
      x = np.linspace(mu - 5 * sqrt(nu / (nu - 2)), mu + 5 * sqrt(nu / (nu - 2)), 500)
      pdf = stats.t.pdf(x, df, loc=loc)
      plt.plot(x, pdf)`;
  }

  #getPDF(values, x) {
    x=x-values.mu;
    return this.#pdfFactor*(1+x**2/values.nu)**(-(values.nu+1)/2);
  }

  #getCDF(values, x) {
    x=x-values.mu;
    if (x>=0) {
      x=values.nu/(x**2+values.nu);
      return 1-0.5*jStat.ibeta(x,values.nu/2,0.5);
    } else {
      x=values.nu/(x**2+values.nu);
      return 0.5*jStat.ibeta(x,values.nu/2,0.5);
    }
  }

  _calcDistribution(values) {
    this.#pdfFactor=jStat.gammafn((values.nu+1)/2)/(Math.sqrt(values.nu*Math.PI)*jStat.gammafn(values.nu/2));

    /* Characteristics */

    const nu=variable("&nu;");
    const mu=variable("&mu;");

    const meanFormula=beginMathML+mu+endMathML;
    const varianceFormula=beginMathML+frac(nu,nu+minus+"<mn>2</mn>")+endMathML;

    const meanValue=values.mu;
    const varianceValue=(values.nu>2)?(values.nu/(values.nu-2)):Infinity;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,meanFormula,meanValue,meanFormula,meanValue);

    /* Diagram */

    const that=this;
    const minX=Math.min(0,(values.nu>2)?(meanValue-4*Math.max(2,Math.sqrt(varianceValue))):(meanValue-10));
    const maxX=Math.max(0,(values.nu>2)?(meanValue+4*Math.max(2,Math.sqrt(varianceValue))):(meanValue+10));
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  fitParameters(data) {
    let nu;
		if (data.std>1) {
			const variance=data.std**2;
			nu=2*variance/(variance-1);
		} else {
			nu=5;
		}
    return {mu: data.mean, nu: nu};
  }

  get canFit() {
    return true;
  }
}
