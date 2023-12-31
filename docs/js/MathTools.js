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

export {binom, zeta, gaussianRandomBoxMueller, gaussianRandomPolar};

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