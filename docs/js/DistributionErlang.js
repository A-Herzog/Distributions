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

export {ErlangDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, setNHTML, isin, setRPlus0, setRPlusHTML, variable, frac, defF, minus, mul} from './MathMLTools.js';



/**
 * Erlang distribution
 */
class ErlangDistribution extends ContinuousProbabilityDistribution {
  #pdfFactor;
  #cdfFactor;

  constructor() {
    super(language.distributions.erlang.name);

    this.support=setRPlusHTML;
    this.infoText=language.distributions.erlang.info;
    this.wikipediaURL=language.distributions.erlang.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addDiscreteParameter("n","n",language.distributions.erlang.parameterInfon+" (<i>n</i>"+isin+setNHTML+")",1,4);
    this._addContinuousParameter("lambda","&lambda;",language.distributions.erlang.parameterInfoLambda+" (<i>&lambda;</i>"+isin+setRPlusHTML+")",0,false,null,false,2.5);

    this._setCalcParameter("x",10);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const n=variable("n");
    const lambda=variable("&lambda;");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=frac("<msup>"+x+"<mrow>"+n+minus+"<mn>1</mn></mrow></msup><msup><mi mathvariant='normal'>e</mi><mrow>"+minus+frac(x,lambda)+"</mrow></msup>","<msup>"+lambda+n+"</msup><ms>(</ms>"+n+minus+"<mn>1</mn><ms>)</ms><mo>!</mo>");
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
    const n=variable("n");
    const lambda=variable("&lambda;");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=frac("<mi mathvariant='normal'>&gamma;</mi><mo>(</mo>"+n+","+frac(x,lambda)+"<mo>)</mo>","<mo>(</mo>"+n+minus+"<mn>1</mn><mo>)</mo><mo>!</mo>");
    cdf+="<mo>=</mo>";
    cdf+="<mn>1</mn>"+minus+"<msubsup><mo>&sum;</mo><mrow>"+k+"<mo>=</mo><mn>0</mn></mrow><mrow>"+n+minus+"<mn>1</mn></mrow></msubsup>";
    cdf+=frac("<mn>1</mn>",k+"<mo>!</mo>");
    cdf+="<msup><mi mathvariant='normal'>e</mi><mrow>"+minus+frac(x,lambda)+"</mrow></msup>";
    cdf+="<msup><mrow><mo>(</mo>"+frac(x,lambda)+"<mo>)</mo></mrow><mn>"+k+"</mn></msup>";
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

      # Set parameters n and lmbda here

      # Translate to scipy parameters
      a = n
      scale = lmbda

      # Characterstics (via scipy)
      print("mean =", np.round(stats.erlang.mean(a, scale=scale), 3))
      print("variance =", np.round(stats.erlang.var(a, scale=scale), 3))
      print("standard deviation =", np.round(stats.erlang.std(a, scale=scale), 3))

      # Characterstics (direct calculation)
      print("mean =", np.round(n * lmbda, 3))
      print("variance =", np.round(n * (lmbda ** 2), 3))
      print("standard deviation =", np.round(sqrt(n) * lmbda, 3))

      # Probability density function
      x = np.linspace(0, 50, 500)
      pdf = stats.erlang.pdf(x, a, scale=scale)
      plt.plot(x, pdf)`;
  }

  #getPDF(values, x) {
    if (x<=0) return 0;
    return x**(values.n-1)*Math.exp(-x/values.lambda)*this.#pdfFactor;
  }

  #getCDF(values, x) {
    if (x<=0) return 0;
    return this.#cdfFactor*jStat.gammap(values.n,x/values.lambda);
  }

  _calcDistribution(values) {
    this.#pdfFactor=1/(values.lambda**values.n*jStat.gammafn(values.n));
    this.#cdfFactor=1/jStat.gammafn(values.n);

    /* Characteristics */

    const n=variable("n");
    const lambda=variable("&lambda;");

    const meanFormula=beginMathML+n+mul+lambda+endMathML;
    const varianceFormula=beginMathML+n+mul+"<msup>"+lambda+"<mn>2</mn></msup>"+endMathML;
    const modeFormula=beginMathML+frac(n+minus+"<mn>1</mn>",lambda)+endMathML;

    const meanValue=values.n*values.lambda;
    const varianceValue=values.n*values.lambda**2;
    const modeValue=(values.n-1)/values.lambda;

    this._setContinuousCharacteristics(meanFormula,meanValue,varianceFormula,varianceValue,null,null,modeFormula,modeValue);

    /* Diagram */

    const that=this;
    const minX=0;
    const maxX=Math.max(50,meanValue+3*Math.sqrt(varianceValue));
    this._setContinuousDiagram(minX,maxX,x=>that.#getPDF(values,x),x=>that.#getCDF(values,x));
  }

  calcProbability(values, x) {
    return [this.#getPDF(values,x),this.#getCDF(values,x)];
  }

  fitParameters(data) {
    if (data.mean<=0 || data.std<=0) return null;
   /* E=n*l, Var=n*l² => Var=E*l => l=Var/E */
   const lambda=data.std**2/data.mean;
   const n=Math.max(1,Math.round(data.mean/lambda));
   if (n==1) return null; /* This would be equivalent to exponential distribution */
    return {n: n, lambda: lambda};
  }

  get canFit() {
    return true;
  }
}
