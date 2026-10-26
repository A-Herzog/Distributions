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

export {binom, zeta, gaussianRandomBoxMueller, gaussianRandomPolar, erf, meanConfidenceInterval};

/**
 * Calculates the binomial coefficient
 * @param {Number} n Number n of the binomial coefficient
 * @param {Number} k Number k of the binomial coefficient
 * @returns Returns binom(n,k)
 */
function binom(n,k) {
  let coeff=1;
  for (let i=1;i<=k;i++) coeff*=(n+1-i)/i;
  return coeff;
}

/**
 * Calculates the value of the Zeta function for an real, positive argument.
 * @param {Number} s Argument of the Zeta function (has to be &gt;0)
 * @returns Zeta(s)
 */
function zeta(s) {
  let z=0;
  let n=1;
  const minusS=-s;
  if (s<1.8) {
    while (n<5_000_000) {
      z+=Math.pow(n,minusS);
      n++;
    }
  } else {
    while (n<5_000_000) {
		  const add=Math.pow(n,minusS);
      z+=add;
      if (add<1E-12) break;
      n++;
    }
  }
  return z;
}

/**
 * Generates a gaussian distributed pseudo random number via Box-Muller transformation
 * @param {Number} mean Mean (defaults to 0)
 * @param {Number} std Standard deviation (defaults to 1)
 * @returns Gaussian distributed pseudo random number
 */
function gaussianRandomBoxMueller(mean=0, std=1) {
  const u=1-Math.random();
  const v=Math.random();
  const z=Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
  return z*std+mean;
}

let polarSpare;
let polarHasSpare=false;

/**
 * Generates a gaussian distributed pseudo random number via the polar method
 * @param {Number} mean Mean (defaults to 0)
 * @param {Number} std Standard deviation (defaults to 1)
 * @returns Gaussian distributed pseudo random number
 */
function gaussianRandomPolar(mean=0, std=1) {
  if (polarHasSpare) {polarHasSpare=false; return polarSpare*std+mean;}

  let u, v, s;
  do {
    u=Math.random()*2-1;
    v=Math.random()*2-1;
    s=u**2+v**2;
  } while (s>= 1 || s==0);
  s=Math.sqrt(-2*Math.log(s)/s);
  polarSpare=v*s;
  polarHasSpare=true;
  return mean+std*u*s;
}

/**
 * Helper function for erf
 * @param {Number} y Parameter
 */
function erf1(y) {
  const ysq=y*y;
  let xnum=P[0][4]*ysq;
  let xden=ysq;

  for (let i=0;i<3;i++) {
    xnum=(xnum+P[0][i])*ysq;
    xden=(xden+Q[0][i])*ysq;
  }
  return y*(xnum+P[0][3])/(xden+Q[0][3]);
}

/**
 * Approximates the complement of the error function erfc() for
 * 0.46875 <= x <= 4.0 using this function:
 *                       n
 * erfc(x) = e^(-x^2) * sum (p_j * x^j) / (q_j * x^j)
 *                      j=0
 */
function erfc2(y) {
  let xnum=P[1][8]*y;
  let xden=y;

  for (let i=0;i<7;i++) {
    xnum=(xnum+P[1][i])*y;
    xden=(xden+Q[1][i])*y;
  }
  const result=(xnum+P[1][7])/(xden+Q[1][7]);
  const ysq=parseInt(y*16)/16;
  const del=(y-ysq)*(y+ysq);

  return Math.exp(-ysq*ysq)*Math.exp(-del)*result;
}

/**
 * Approximates the complement of the error function erfc() for x > 4.0 using
 * this function:
 *
 * erfc(x) = (e^(-x^2) / x) * [ 1/sqrt(pi) +
 *               n
 *    1/(x^2) * sum (p_j * x^(-2j)) / (q_j * x^(-2j)) ]
 *              j=0
 */
function erfc3(y) {
  let ysq=1/(y**2);
  let xnum=P[2][5]*ysq;
  let xden=ysq;

  for (let i=0;i<4;i++) {
    xnum=(xnum+P[2][i])*ysq;
    xden=(xden+Q[2][i])*ysq;
  }
  let result=ysq*(xnum+P[2][4])/(xden+Q[2][4]);
  result=(SQRPI-result)/y;
  ysq=parseInt(y*16)/16;
  const del=(y-ysq)*(y+ysq);

  return Math.exp(-ysq*ysq)*Math.exp(-del)*result;
}

/**
* Upper bound for the first approximation interval, 0 <= x <= THRESH
* @constant
*/
const THRESH = 0.46875

/**
* Constant used by W. J. Cody's Fortran77 implementation to denote sqrt(pi)
* @constant
*/
const SQRPI = 5.6418958354775628695e-1

/**
* Coefficients for each term of the numerator sum (p_j) for each approximation
* interval (see W. J. Cody's paper for more details)
* @constant
*/
const P = [[
3.16112374387056560e00, 1.13864154151050156e02,
3.77485237685302021e02, 3.20937758913846947e03,
1.85777706184603153e-1
], [
5.64188496988670089e-1, 8.88314979438837594e00,
6.61191906371416295e01, 2.98635138197400131e02,
8.81952221241769090e02, 1.71204761263407058e03,
2.05107837782607147e03, 1.23033935479799725e03,
2.15311535474403846e-8
], [
3.05326634961232344e-1, 3.60344899949804439e-1,
1.25781726111229246e-1, 1.60837851487422766e-2,
6.58749161529837803e-4, 1.63153871373020978e-2
]]

/**
* Coefficients for each term of the denominator sum (q_j) for each approximation
* interval (see W. J. Cody's paper for more details)
* @constant
*/
const Q = [[
2.36012909523441209e01, 2.44024637934444173e02,
1.28261652607737228e03, 2.84423683343917062e03
], [
1.57449261107098347e01, 1.17693950891312499e02,
5.37181101862009858e02, 1.62138957456669019e03,
3.29079923573345963e03, 4.36261909014324716e03,
3.43936767414372164e03, 1.23033935480374942e03
], [
2.56852019228982242e00, 1.87295284992346047e00,
5.27905102951428412e-1, 6.05183413124413191e-2,
2.33520497626869185e-3
]]

/**
* Maximum/minimum safe numbers to input to erf() (in ES6+, this number is
* Number.[MAX|MIN]_SAFE_INTEGER). erf() for all numbers beyond this limit will
* return 1
*/
const MAX_NUM=Math.pow(2,53);

/**
 * erf Function
 * @param {Number} x Parameter
 * @returns erf(x)
 * @see https://en.wikipedia.org/wiki/Error_function
 */
function erf(x) {
  const y=Math.abs(x);
  if (y>=MAX_NUM) return Math.sign(x);

  if (y<=THRESH) return Math.sign(x)*erf1(y);
  if (y <= 4.0) return Math.sign(x)*(1-erfc2(y));
  return Math.sign(x)*(1-erfc3(y));
}




// ------------------------------------------------------------
// Konfidenzintervall für den Mittelwert (t-Intervall)
// ohne externe Bibliotheken
// ------------------------------------------------------------

/**
 *
 * @param {Number} n Number of samples
 * @param {Number} mean Mean of the sample values
 * @param {Number} stdDev Standard deviation of the sample values
 * @param {Number} confidence Confidence level; optional, defaults to 0.95
 * @returns Confidence interval object (relevant properties: "margin" for half-wide, "lower" and "upper" for interval borders)
 */
function meanConfidenceInterval(n, mean, stdDev, confidence = 0.95) {
  if (n < 2) {
    throw new Error("At least n = 2 samples needed.");
  }
  if (stdDev < 0) {
    throw new Error("Standard deviation has to be >=0.");
  }
  if (!(confidence > 0 && confidence < 1)) {
    throw new Error("Confidence lavel has to be in (0,1).");
  }

  const df = n - 1;
  const alpha = 1 - confidence;
  const tCrit = tQuantile(1 - alpha / 2, df);
  const margin = tCrit * stdDev / Math.sqrt(n);

  return {
    n,
    mean,
    stdDev,
    confidence,
    df,
    tCrit,
    margin,
    lower: mean - margin,
    upper: mean + margin
  };
}

/**
 * Approximation of the quantils of the standard normal distribution
 * (method from Peter J. Acklam)
 * @param {Number} p Probability
 * @returns Quantile
 */
function normalQuantile(p) {
  if (p <= 0 || p >= 1) {
    throw new Error("p has to be in [0,1].");
  }

  const a = [
    -3.969683028665376e+01,
     2.209460984245205e+02,
    -2.759285104469687e+02,
     1.383577518672690e+02,
    -3.066479806614716e+01,
     2.506628277459239e+00
  ];

  const b = [
    -5.447609879822406e+01,
     1.615858368580409e+02,
    -1.556989798598866e+02,
     6.680131188771972e+01,
    -1.328068155288572e+01
  ];

  const c = [
    -7.784894002430293e-03,
    -3.223964580411365e-01,
    -2.400758277161838e+00,
    -2.549732539343734e+00,
     4.374664141464968e+00,
     2.938163982698783e+00
  ];

  const d = [
     7.784695709041462e-03,
     3.224671290700398e-01,
     2.445134137142996e+00,
     3.754408661907416e+00
  ];

  const plow = 0.02425;
  const phigh = 1 - plow;
  let q, r;

  if (p < plow) {
    q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
           ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }

  if (p > phigh) {
    q = Math.sqrt(-2 * Math.log(1 - p));
    return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
             ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }

  q = p - 0.5;
  r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
         (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

/**
 * Approximation of the t quantil of the normal distribution
 * (Cornish-Fisher expansion)
 * @param {Number} p Probability
 * @param {Number} df Degrees of freedom
 * @returns Quantile
 */
function tQuantile(p, df) {
  if (!(p > 0 && p < 1)) {
    throw new Error("p has to be in [0,1].");
  }
  if (df <= 0) {
    throw new Error("df has to be >0.");
  }

  /* For large degrees of freedom, t approaches the normal distribution. */
  const z = normalQuantile(p);
  const v = df;

  /* Cornish-Fisher expansion */
  const z2 = z * z;
  const z3 = z2 * z;
  const z5 = z3 * z2;
  const z7 = z5 * z2;

  return z
    + (z3 + z) / (4 * v)
    + (5 * z5 + 16 * z3 + 3 * z) / (96 * v * v)
    + (3 * z7 + 19 * z5 + 17 * z3 - 15 * z) / (384 * v * v * v);
}
