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

export {TrapezoidDistribution};

import {ContinuousProbabilityDistribution} from "./Distribution.js";
import {language} from "./Language.js";
import {beginMathML, endMathML, isin, setRHTML, variable, frac, defF, defE, plus, minus, mul} from './MathMLTools.js';



/**
 * Trapezoid distribution
 */
class TrapezoidDistribution extends ContinuousProbabilityDistribution {
  #h;
  #pdfB;
  #pdfC;

  constructor() {
    super(language.distributions.trapezoid.name);

    this.support=setRHTML;
    this.infoText=language.distributions.trapezoid.info;
    this.wikipediaURL=language.distributions.trapezoid.wikipedia;
    this.pdfText=this.#getPDFText();
    this.cdfText=this.#getCDFText();
    this.scipyText=this.#getScipyText();

    this._addContinuousParameter("a","a",language.distributions.trapezoid.parameterInfoa+" (<i>a</i>"+isin+setRHTML+")",null,false,null,false,3);
    this._addContinuousParameter("b","b",language.distributions.trapezoid.parameterInfob+" (<i>b</i>"+isin+setRHTML+")",null,false,null,false,5);
    this._addContinuousParameter("c","c",language.distributions.trapezoid.parameterInfoc+" (<i>c</i>"+isin+setRHTML+")",null,false,null,false,10);
    this._addContinuousParameter("d","d",language.distributions.trapezoid.parameterInfod+" (<i>d</i>"+isin+setRHTML+")",null,false,null,false,14);

    this._setCalcParameter("x",8);
  }

  #getPDFText() {
    const f=variable("f");
    const x=variable("x");
    const a=variable("a");
    const b=variable("b");
    const c=variable("c");
    const d=variable("d");
    const h=variable("h");

    let pdf="";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=h+mul+frac(x+minus+a,b+minus+a);
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=a+"<mo>&le;</mo>"+x+"<mo>&lt;</mo>"+b;
    pdf+=endMathML;
    pdf+=", ";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=h;
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=b+"<mo>&le;</mo>"+x+"<mo>&lt;</mo>"+c;
    pdf+=endMathML;
    pdf+=", ";
    pdf+=beginMathML;
    pdf+=defF(f,x);
    pdf+=h+mul+frac(d+minus+x,d+minus+c);
    pdf+=endMathML;
    pdf+=" "+language.distributions.for+" ";
    pdf+=beginMathML;
    pdf+=c+"<mo>&le;</mo>"+x+"<mo>&lt;</mo>"+d;
    pdf+=endMathML;
    pdf+=" "+language.distributions.with+" ";
    pdf+=beginMathML;
    pdf+=h+"<mo>=</mo>"+frac("<mn>2</mn>",c+plus+d+minus+a+minus+b);
    pdf+=endMathML;

    return pdf;
  }

  #getCDFText() {
    const F=variable("F");
    const x=variable("x");
    const a=variable("a");
    const b=variable("b");
    const c=variable("c");
    const d=variable("d");
    const h=variable("h");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=h+mul+frac("<mo>(</mo>"+x+minus+a+"<mo>)</mo><sup><mn>2</mn></sup>","<mn>2</mn><mo>(</mo>"+b+minus+a+"<mo>)</mo>");
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=a+"<mo>&le;</mo>"+x+"<mo>&lt;</mo>"+b;
    cdf+=endMathML;
    cdf+=", ";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+=h+mul+frac("<mn>2</mn>"+x+minus+a+minus+b,"<mn>2</mn>");
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=b+"<mo>&le;</mo>"+x+"<mo>&lt;</mo>"+c;
    cdf+=endMathML;
    cdf+=", ";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+="<mn>1</mn>"+minus+h+mul+frac("<mo>(</mo>"+d+minus+x+"<mo>)</mo><sup><mn>2</mn></sup>","<mn>2</mn><mo>(</mo>"+d+minus+c+"<mo>)</mo>");
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=c+"<mo>&le;</mo>"+x+"<mo>&lt;</mo>"+d;
    cdf+=endMathML;
    cdf+=" "+language.distributions.with+" ";
    cdf+=beginMathML;
    cdf+=h+"<mo>=</mo>"+frac("<mn>2</mn>",c+plus+d+minus+a+minus+b);
    cdf+=endMathML;

    return cdf;
  }

  #getScipyText() {
    return `
      from math import sqrt
      import numpy as np
      import matplotlib.pyplot as plt
      import scipy.stats as stats

      # Set parameters a, b, c and d here

      # Translate to scipy parameters
      c_shape = (b - a) / (d - a)
      d_shape = (c - a) / (d - a)
      loc = a
      scale = d - a

      # Characterstics (via scipy)
      print("mean =", np.round(stats.trapezoid.mean(c_shape, d_shape, loc=loc, scale=scale), 3))
      print("variance =", np.round(stats.trapezoid.var(c_shape, d_shape, loc=loc, scale=scale), 3))
      print("standard deviation =", np.round(stats.trapezoid.std(c_shape, d_shape, loc=loc, scale=scale), 3))

      # Characterstics (direct calculation)
      mean = np.round((a + b + c + d) / 4, 3)
      variance = np.round(((d - a)**2 + (c - b)**2 + (d - c)**2 + (b - a)**2) / 24, 3)
      std = np.round(sqrt(variance), 3)
      print("mean =", mean)
      print("variance =", variance)
      print("standard deviation =", std)

      # Probability density function
      x = np.linspace(a - 2, d + 2, 500)
      pdf = stats.trapezoid.pdf(x, c_shape, d_shape, loc=loc, scale=scale)
      plt.plot(x, pdf)`;
  }

  _checkParameters(values) {
    if (values.b<values.a) {
      this._setErrorMarker("b",language.distributions.trapezoid.parameterInfobError);
      this._clearAllOutput();
      return false;
    }

    if (values.c<values.b) {
      this._setErrorMarker("c",language.distributions.trapezoid.parameterInfocError);
      this._clearAllOutput();
      return false;
    }

    if (values.d<values.c) {
      this._setErrorMarker("d",language.distributions.trapezoid.parameterInfodError);
      this._clearAllOutput();
      return false;
    }

    return true;
  }

  #getPDF(values, x) {
    if (x<=values.a || x>=values.d) return 0;
    if (values.a==values.d) return (x==values.a)?Infinity:0;

    if (x>values.a && x<values.b) return this.#h*(x-values.a)/(values.b-values.a);
		if (x>values.c && x<values.d) return this.#h*(values.d-x)/(values.d-values.c);
    return this.#h;
  }

  #getCDF(values, x) {
    if (x<=values.a) return 0;
    if (x>=values.d) return 1;
    if (values.a==values.d) return 1;

		if (x>values.a && x<values.b) return this.#h*(x-values.a)**2/(values.b-values.a)/2;
		if (x>values.c && x<values.d) return 1-this.#h*(values.d-x)**2/(values.d-values.c)/2;
		return this.#h*(2*x-values.a-values.b)/2;
  }

  _calcDistribution(values) {
      let meanValue, varianceValue;

      if (values.d>values.a) {
        this.#h=2.0/(values.c+values.d-values.a-values.b);
		    let part1, part2;
		    if (values.c==values.d) part1=3*values.c**2; else part1=(values.d**3-values.c**3)/(values.d-values.c);
		    if (values.a==values.b) part2=3*values.a**2; else part2=(values.b**3-values.a**3)/(values.b-values.a);
		    meanValue=1.0/3.0/(values.c+values.d-values.a-values.b)*(part1-part2);
		    if (values.c==values.d) part1=4*values.c**3; else part1=(values.d**4-values.c**4)/(values.d-values.c);
		    if (values.a==values.b) part2=4*values.a**3; else part2=(values.b**4-values.a**4)/(values.b-values.a);
		    varianceValue=1.0/6.0/(values.c+values.d-values.a-values.b)*(part1-part2)-meanValue**2;
			  this.#pdfB=(values.b-values.a)*this.#h/2.0;
			  this.#pdfC=1-(values.d-values.c)*this.#h/2.0;
      } else {
        this.#h=10E10;
        meanValue=values.d;
        varianceValue=0;
        this.#pdfB=1;
        this.#pdfC=1;
      }

    /* Characteristics */

    const a=variable("a");
    const b=variable("b");
    const c=variable("c");
    const d=variable("d");

    const pow2="<sup><mn>2</mn></sup>";
    const pow3="<sup><mn>3</mn></sup>";
    const pow4="<sup><mn>4</mn></sup>";

    const meanFormula=beginMathML+frac("<mn>1</mn>","<mn>3</mn><mo>(</mo>"+c+plus+d+minus+a+minus+b+"<mo>)</mo>")+"<mo>(</mo>"+frac(d+pow3+minus+c+pow3,d+minus+c)+minus+frac(b+pow3+minus+a+pow3,b+minus+a)+"<mo>)</mo>"+endMathML;
    const varianceFormula=beginMathML+frac("<mn>1</mn>","<mn>6</mn><mo>(</mo>"+c+plus+d+minus+a+minus+b+"<mo>)</mo>")+"<mo>(</mo>"+frac(d+pow4+minus+c+pow4,d+minus+c)+minus+frac(b+pow4+minus+a+pow4,b+minus+a)+"<mo>)</mo>"+minus+defE("E","X",false)+pow2+endMathML;

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

  getRandomNumber(values) {
    const u=Math.random();

    if (values.a==values.d) return values.d;

		if (u<this.#pdfB) {
			if (values.a==values.b) return values.a;
			return Math.sqrt(u*2*(values.b-values.a)/this.#h)+values.a;
		}

		if (u>this.#pdfC) {
			if (values.c==values.d) return values.c;
			return values.d-Math.sqrt((1-u)*2*(values.d-values.c)/this.#h);
		}

		if (values.b==values.c) return values.b;
		const relativePosition=(u-this.#pdfB)/(this.#pdfC-this.#pdfB);
		return values.b+(values.c-values.b)*relativePosition;
  }

  #calcVariance(values) {
    if (values.d>values.a) {
      let part1, part2;
      if (values.c==values.d) part1=3*values.c**2; else part1=(values.d**3-values.c**3)/(values.d-values.c);
      if (values.a==values.b) part2=3*values.a**2; else part2=(values.b**3-values.a**3)/(values.b-values.a);
      const meanValue=1.0/3.0/(values.c+values.d-values.a-values.b)*(part1-part2);
      if (values.c==values.d) part1=4*values.c**3; else part1=(values.d**4-values.c**4)/(values.d-values.c);
      if (values.a==values.b) part2=4*values.a**3; else part2=(values.b**4-values.a**4)/(values.b-values.a);
      return 1.0/6.0/(values.c+values.d-values.a-values.b)*(part1-part2)-meanValue**2;
    } else {
      return 0;
    }
  }

  fitParameters(data) {
    if (data.std<=0) return null;

		const a=data.min;
		const d=data.max;

		/* Standard deviation is at least as big as at the triangular distribution */
		let sd=Math.max(data.std,(d-a)/Math.sqrt(24.0));

		/* Standard deviation is maximum as big as at the uniform distribution */
		sd=Math.min(sd,(d-a)/Math.sqrt(12.0));

		let fMin=0;
		let fMax=(d-a)/2;

		while ((fMax-fMin)>(d-a)/1000) {
			const fMiddle=(fMax+fMin)/2;
      const sdMiddle=Math.sqrt(this.#calcVariance({a: a, b: a+fMiddle, c: d-fMiddle, d: d}));
			if (sdMiddle>sd) {
				fMin=fMiddle;
			} else {
				fMax=fMiddle;
			}
		}

		const f=(fMax+fMin)/2;
    return {a: a, b: a+f, c: d-f, d: d};
  }

  get canFit() {
    return true;
  }
}
