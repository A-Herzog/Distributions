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
export {listDistributions, getDistributionsByName, getDistributionByClassName, getAllDistributionParameterIds};

import {HypergeometricDistribution} from './DistributionHypergeometric.js';
import {BinomialDistribution} from './DistributionBinomial.js';
import {PoissonDistribution} from './DistributionPoisson.js';
import {GeometricDistribution} from './DistributionGeometric.js';
import {DiscreteUniformDistribution} from './DistributionDiscreteUniform.js';
import {NegativeHypergeometricDistribution} from './DistributionNegativeHypergeometric.js';
import {NegativeBinomialDistribution} from './DistributionNegativeBinomial.js';
import {ZetaDistribution} from './DistributionZeta.js';
import {RademacherDistribution} from './DistributionRademacher.js';
import {UniformDistribution} from './DistributionUniform.js';
import {ExponentialDistribution} from './DistributionExponential.js';
import {NormalDistribution} from './DistributionNormal.js';
import {LogNormalDistribution} from './DistributionLogNormal.js';
import {GammaDistribution} from './DistributionGamma.js';
import {ErlangDistribution} from './DistributionErlang.js';
import {BetaDistribution} from './DistributionBeta.js';
import {TriangularDistribution} from './DistributionTriangular.js';
import {TrapezoidDistribution} from './DistributionTrapezoid.js';
import {WeibullDistribution} from './DistributionWeibull.js';
import {StudentTDistribution} from './DistributionStudentT.js';
import {CauchyDistribution} from './DistributionCauchy.js';
import {FDistribution} from './DistributionF.js';
import {LaplaceDistribution} from './DistributionLaplace.js';
import {ParetoDistribution} from './DistributionPareto.js';
import {Chi2Distribution} from './DistributionChi2.js';
import {ChiDistribution} from './DistributionChi.js';
import {HalfNormalDistribution} from './DistributionHalfNormal.js';
import {IrwinHallDistribution} from './DistributionIrwinHall.js';
import {WignerSemicircleDistribution} from './DistributionWignerSemicircle.js';
import {UQuadraticDistribution} from './DistributionUQuadratic.js';
import {ReciprocalDistribution} from './DistributionReciprocal.js';
import {KumaraswamyDistribution} from './DistributionKumaraswamy.js';
import {SineDistribution} from './DistributionSine.js';
import {ArcsineDistribution} from './DistributionArcsine.js';
import {GumbelDistribution} from './DistributionGumbel.js';
import {HyperbolicSecantDistribution} from './DistributionHyperbolicSecant.js';
import {InverseGaussianDistribution} from './DistributionInverseGaussian.js';
import {JohnsonSUDistribution} from './DistributionJohnsonSU.js';
import {LevyDistribution} from './DistributionLevy.js';
import {LogisticDistribution} from './DistributionLogistic.js';
import {LogLogisticDistribution} from './DistributionLogLogistic.js';
import {MaxwellBoltzmannDistribution} from './DistributionMaxwellBoltzmann.js';
import {PertDistribution} from './DistributionPert.js';
import {PowerDistribution} from './DistributionPower.js';
import {RayleighDistribution} from './DistributionRayleigh.js';
import {FatigueLifeDistribution} from './DistributionFatigueLife.js';
import {FrechetDistribution} from './DistributionFrechet.js';
import {LogarithmicDistribution} from './DistributionLogarithmic.js';
import {LogCauchyDistribution} from './DistributionLogCauchy.js';
import {BorelDistribution} from './DistributionBorel.js';
import {BernoulliDistribution} from './DistributionBernoulli.js';
import {GaussKuzminDistribution} from './DistributionGaussKuzmin.js';
import {SawtoothLeftDistribution} from './DistributionSawtoothLeft.js';
import {SawtoothRightDistribution} from './DistributionSawtoothRight.js';

/**
 * List of an instance of each supported probability distribution function
 */
const listDistributions=[];

listDistributions.push(new HypergeometricDistribution());
listDistributions.push(new BinomialDistribution());
listDistributions.push(new PoissonDistribution());
listDistributions.push(new GeometricDistribution());
listDistributions.push(new DiscreteUniformDistribution());
listDistributions.push(new NegativeHypergeometricDistribution());
listDistributions.push(new NegativeBinomialDistribution());
listDistributions.push(new ZetaDistribution());
listDistributions.push(new UniformDistribution());
listDistributions.push(new ExponentialDistribution());
listDistributions.push(new NormalDistribution());
listDistributions.push(new LogNormalDistribution());
listDistributions.push(new GammaDistribution());
listDistributions.push(new ErlangDistribution());
listDistributions.push(new BetaDistribution());
listDistributions.push(new TriangularDistribution());
listDistributions.push(new TrapezoidDistribution());
listDistributions.push(new WeibullDistribution());
listDistributions.push(new StudentTDistribution());
listDistributions.push(new CauchyDistribution());
listDistributions.push(new FDistribution());
listDistributions.push(new LaplaceDistribution());
listDistributions.push(new ParetoDistribution());
listDistributions.push(new Chi2Distribution());
listDistributions.push(new ChiDistribution());
listDistributions.push(new HalfNormalDistribution());
listDistributions.push(new RademacherDistribution());
listDistributions.push(new IrwinHallDistribution());
listDistributions.push(new WignerSemicircleDistribution());
listDistributions.push(new UQuadraticDistribution());
listDistributions.push(new ReciprocalDistribution());
listDistributions.push(new KumaraswamyDistribution());
listDistributions.push(new SineDistribution());
listDistributions.push(new ArcsineDistribution());
listDistributions.push(new GumbelDistribution());
listDistributions.push(new HyperbolicSecantDistribution());
listDistributions.push(new InverseGaussianDistribution());
listDistributions.push(new JohnsonSUDistribution());
listDistributions.push(new LevyDistribution());
listDistributions.push(new LogisticDistribution());
listDistributions.push(new LogLogisticDistribution());
listDistributions.push(new MaxwellBoltzmannDistribution());
listDistributions.push(new PertDistribution());
listDistributions.push(new PowerDistribution());
listDistributions.push(new RayleighDistribution());
listDistributions.push(new FatigueLifeDistribution());
listDistributions.push(new FrechetDistribution());
listDistributions.push(new LogarithmicDistribution());
listDistributions.push(new LogCauchyDistribution());
listDistributions.push(new BorelDistribution());
listDistributions.push(new BernoulliDistribution());
listDistributions.push(new GaussKuzminDistribution());
listDistributions.push(new SawtoothLeftDistribution());
listDistributions.push(new SawtoothRightDistribution());

/**
 * Returns the probability distribution object for a probability distribution name
 * @param {string} name Name of the probability distribution
 * @returns Instance of the probability distribution matching the given name (or null if no matching probability distribution object was found)
 */
function getDistributionsByName(name) {
  const result=listDistributions.filter(dist=>dist.name==name);
  return (result.length!=1)?null:result[0];
}

/**
 * Returns the probability distribution object for a probability distribution class name
 * @param {string} name Name of the probability distribution class
 * @returns Instance of the probability distribution matching the given class name (or null if no matching probability distribution object was found)
 */
function getDistributionByClassName(name) {
  const result=listDistributions.filter(dist=>dist.constructor.name.toLowerCase()==name.toLowerCase());
  return (result.length!=1)?null:result[0];
}

/**
 * Returns a set containing all parameter ids from all registered distributions
 * @returns Set of all parameter ids from all distributions
 */
function getAllDistributionParameterIds() {
  const set=new Set();
  listDistributions.map(distribution=>distribution.parameterIds).forEach(list=>list.forEach(entry=>set.add(entry)));
  return set;
}