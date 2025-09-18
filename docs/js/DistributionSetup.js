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
export {getDistributionNames, getDistributionsByName, getDistributionByClassName, getAllDistributionParameterIds, getFitableDistributionCount, getFitableDistributions};

import {language} from "./Language.js";

/*
Old imports, kept for reference.
Now we are loading the distributions dynamically.

import {HypergeometricDistribution} from './DistributionHypergeometric.js';
import {BinomialDistribution} from './DistributionBinomial.js';
import {PoissonDistribution} from './DistributionPoisson.js';
import {GeometricDistribution} from './DistributionGeometric.js';
import {DiscreteUniformDistribution} from './DistributionDiscreteUniform.js';
import {NegativeHypergeometricDistribution} from './DistributionNegativeHypergeometric.js';
import {NegativeBinomialDistribution} from './DistributionNegativeBinomial.js';
import {ZetaDistribution} from './DistributionZeta.js';
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
import {RademacherDistribution} from './DistributionRademacher.js';
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
import {CosineDistribution} from './DistributionCosine.js';
import {LogGammaDistribution} from './DistributionLogGamma.js';
import {InverseGammaDistribution} from './DistributionInverseGamma.js';
import {ContinuousBernoulliDistribution} from './DistributionContinuousBernoulli.js';
import {HalfCauchyDistribution} from './DistributionHalfCauchy.js';
import {PlanckDistribution} from './DistributionPlanck.js';
import {LogLaplaceDistribution} from './DistributionLogLaplace.js';
import {BoltzmannDistribution} from './DistributionBoltzmann.js';
*/


/**
 * Base class for distribution data.
 * Contains the name, whether the distribution is discrete, whether it can be fitted to data,
 * the class name of the distribution, and the parameter ids.
 */
class DistributionData {
  #name;
  #discrete;
  #canFit;
  #distributionClassName;
  #parameterIds;

  /**
   * Constructor
   * @param {String} name Name of the distribution
   * @param {Boolean} discrete Whether the distribution is discrete
   * @param {Boolean} canFit Whether the distribution can be fitted to data
   * @param {String} distributionClassName Class name of the distribution
   * @param {Array} parameterIds Array of parameter ids for the distribution
   */
  constructor(name, discrete, canFit, distributionClassName, parameterIds) {
    this.#name=name;
    this.#discrete=discrete;
    this.#canFit=canFit;
    this.#distributionClassName=distributionClassName;
    this.#parameterIds=parameterIds;
  }

  /**
   * Returns whether the distribution is discrete.
   */
  get discrete() {
    return this.#discrete;
  }

  /**
   * Returns the name of the distribution.
   */
  get name() {
    return this.#name;
  }

  /**
   * Returns the class name of the distribution.
   */
  get distributionClassName() {
    return this.#distributionClassName;
  }

  /**
   * Returns the parameter ids of the distribution.
   */
  get parameterIds() {
    return this.#parameterIds;
  }

  /**
   * Returns whether the distribution can be fitted to data.
   */
  get canFit() {
    return this.#canFit;
  }
}

/**
 * Class for distribution data that directly contains a distribution object.
 * This class is used for distributions that are already loaded and do not need to be loaded dynamically
 */
class DistributionDataDirect extends DistributionData {
  _distribution;

  /**
   * Constructor
   * @param {ProbabilityDistribution} distribution Instance of the probability distribution
   */
  constructor(distribution) {
    super(distribution.name, distribution.discrete, distribution.canFit, distribution.constructor.name, distribution.parameterIds);
    this._distribution=distribution;
  }

  /**
   * Returns the distribution object.
   * This method is synchronous because the distribution object is already available.
   * It does not need to load anything dynamically.
   * @returns {Promise<ProbabilityDistribution>} Returns the distribution object.
   * Since this class directly contains the distribution object, it returns it immediately.
   */
  async getDistribution() {
    return this._distribution;
  }
}

/**
 * Class for distribution data that loads the distribution object dynamically from a file.
 * This class is used for distributions that are not loaded yet and need to be imported dynamically.
 */
class DistributionDataLoader extends DistributionData {
  #file;
  #distribution;

  /**
   * Constructor
   * @param {*} file File path to the distribution module
   * This file should export the distribution class with the name given in distributionClassName.
   * @param {String} name Name of the distribution
   * @param {Boolean} discrete Whether the distribution is discrete
   * @param {Boolean} canFit Whether the distribution can be fitted to data
   * @param {String} distributionClassName Class name of the distribution
   * @param {Array} parameterIds Array of parameter ids for the distribution
   */
  constructor(file, name, discrete, canFit, distributionClassName, parameterIds) {
    super(name, discrete, canFit, distributionClassName, parameterIds);
    this.#file=file;
  }

  /**
   * Returns the distribution object.
   * This method loads the distribution object dynamically from the file specified in the constructor.
   * It is asynchronous because it needs to import the module and create an instance of the distribution class.
   * @returns {Promise<ProbabilityDistribution>} Returns a promise that resolves to the distribution object.
   * This method loads the distribution object dynamically from the file specified in the constructor.
   */
  async getDistribution() {
    if (this.#distribution==null) {
      const data=await import(this.#file);
      this.#distribution = new data[this.distributionClassName]();
    }
    return this.#distribution;
  }
}

/**
 * List of an instance of each supported probability distribution function
 */
const listDistributions=[];

/*
listDistributions.push(new DistributionDataDirect(new HypergeometricDistribution()));
listDistributions.push(new DistributionDataDirect(new BinomialDistribution()));
listDistributions.push(new DistributionDataDirect(new PoissonDistribution()));
listDistributions.push(new DistributionDataDirect(new GeometricDistribution()));
listDistributions.push(new DistributionDataDirect(new DiscreteUniformDistribution()));
listDistributions.push(new DistributionDataDirect(new NegativeHypergeometricDistribution()));
listDistributions.push(new DistributionDataDirect(new NegativeBinomialDistribution()));
listDistributions.push(new DistributionDataDirect(new ZetaDistribution()));
listDistributions.push(new DistributionDataDirect(new UniformDistribution()));
listDistributions.push(new DistributionDataDirect(new ExponentialDistribution()));
listDistributions.push(new DistributionDataDirect(new NormalDistribution()));
listDistributions.push(new DistributionDataDirect(new LogNormalDistribution()));
listDistributions.push(new DistributionDataDirect(new GammaDistribution()));
listDistributions.push(new DistributionDataDirect(new ErlangDistribution()));
listDistributions.push(new DistributionDataDirect(new BetaDistribution()));
listDistributions.push(new DistributionDataDirect(new TriangularDistribution()));
listDistributions.push(new DistributionDataDirect(new TrapezoidDistribution()));
listDistributions.push(new DistributionDataDirect(new WeibullDistribution()));
listDistributions.push(new DistributionDataDirect(new StudentTDistribution()));
listDistributions.push(new DistributionDataDirect(new CauchyDistribution()));
listDistributions.push(new DistributionDataDirect(new FDistribution()));
listDistributions.push(new DistributionDataDirect(new LaplaceDistribution()));
listDistributions.push(new DistributionDataDirect(new ParetoDistribution()));
listDistributions.push(new DistributionDataDirect(new Chi2Distribution()));
listDistributions.push(new DistributionDataDirect(new ChiDistribution()));
listDistributions.push(new DistributionDataDirect(new HalfNormalDistribution()));
listDistributions.push(new DistributionDataDirect(new RademacherDistribution()));
listDistributions.push(new DistributionDataDirect(new IrwinHallDistribution()));
listDistributions.push(new DistributionDataDirect(new WignerSemicircleDistribution()));
listDistributions.push(new DistributionDataDirect(new UQuadraticDistribution()));
listDistributions.push(new DistributionDataDirect(new ReciprocalDistribution()));
listDistributions.push(new DistributionDataDirect(new KumaraswamyDistribution()));
listDistributions.push(new DistributionDataDirect(new SineDistribution()));
listDistributions.push(new DistributionDataDirect(new ArcsineDistribution()));
listDistributions.push(new DistributionDataDirect(new GumbelDistribution()));
listDistributions.push(new DistributionDataDirect(new HyperbolicSecantDistribution()));
listDistributions.push(new DistributionDataDirect(new InverseGaussianDistribution()));
listDistributions.push(new DistributionDataDirect(new JohnsonSUDistribution()));
listDistributions.push(new DistributionDataDirect(new LevyDistribution()));
listDistributions.push(new DistributionDataDirect(new LogisticDistribution()));
listDistributions.push(new DistributionDataDirect(new LogLogisticDistribution()));
listDistributions.push(new DistributionDataDirect(new MaxwellBoltzmannDistribution()));
listDistributions.push(new DistributionDataDirect(new PertDistribution()));
listDistributions.push(new DistributionDataDirect(new PowerDistribution()));
listDistributions.push(new DistributionDataDirect(new RayleighDistribution()));
listDistributions.push(new DistributionDataDirect(new FatigueLifeDistribution()));
listDistributions.push(new DistributionDataDirect(new FrechetDistribution()));
listDistributions.push(new DistributionDataDirect(new LogarithmicDistribution()));
listDistributions.push(new DistributionDataDirect(new LogCauchyDistribution()));
listDistributions.push(new DistributionDataDirect(new BorelDistribution()));
listDistributions.push(new DistributionDataDirect(new BernoulliDistribution()));
listDistributions.push(new DistributionDataDirect(new GaussKuzminDistribution()));
listDistributions.push(new DistributionDataDirect(new SawtoothLeftDistribution()));
listDistributions.push(new DistributionDataDirect(new SawtoothRightDistribution()));
listDistributions.push(new DistributionDataDirect(new CosineDistribution()));
listDistributions.push(new DistributionDataDirect(new LogGammaDistribution()));
listDistributions.push(new DistributionDataDirect(new InverseGammaDistribution()));
listDistributions.push(new DistributionDataDirect(new ContinuousBernoulliDistribution()));
listDistributions.push(new DistributionDataDirect(new HalfCauchyDistribution()));
listDistributions.push(new DistributionDataDirect(new PlanckDistribution()));
listDistributions.push(new DistributionDataDirect(new LogLaplaceDistribution()));
listDistributions.push(new DistributionDataDirect(new BoltzmannDistribution()));
*/
listDistributions.push(new DistributionDataLoader("./DistributionHypergeometric.js",language.distributions.hypergeometric.name,true,false,"HypergeometricDistribution",["N","R","n"]));
listDistributions.push(new DistributionDataLoader("./DistributionBinomial.js",language.distributions.binomial.name,true,true,"BinomialDistribution",["n","p"]));
listDistributions.push(new DistributionDataLoader("./DistributionPoisson.js",language.distributions.poisson.name,true,true,"PoissonDistribution",["lambda"]));
listDistributions.push(new DistributionDataLoader("./DistributionGeometric.js",language.distributions.geometric.name,true,true,"GeometricDistribution",["p"]));
listDistributions.push(new DistributionDataLoader("./DistributionDiscreteUniform.js",language.distributions.discreteUniform.name,true,true,"DiscreteUniformDistribution",["a","b"]));
listDistributions.push(new DistributionDataLoader("./DistributionNegativeHypergeometric.js",language.distributions.negativeHypergeometric.name,true,false,"NegativeHypergeometricDistribution",["N","R","n"]));
listDistributions.push(new DistributionDataLoader("./DistributionNegativeBinomial.js",language.distributions.negativeBinomial.name,true,true,"NegativeBinomialDistribution",["r","p"]));
listDistributions.push(new DistributionDataLoader("./DistributionZeta.js",language.distributions.zeta.name,true,true,"ZetaDistribution",["s"]));
listDistributions.push(new DistributionDataLoader("./DistributionUniform.js",language.distributions.uniform.name,false,true,"UniformDistribution",["a","b"]));
listDistributions.push(new DistributionDataLoader("./DistributionExponential.js",language.distributions.exponential.name,false,true,"ExponentialDistribution",["lambda"]));
listDistributions.push(new DistributionDataLoader("./DistributionNormal.js",language.distributions.normal.name,false,true,"NormalDistribution",["mu","sigma"]));
listDistributions.push(new DistributionDataLoader("./DistributionLogNormal.js",language.distributions.logNormal.name,false,true,"LogNormalDistribution",["mean","std"]));
listDistributions.push(new DistributionDataLoader("./DistributionGamma.js",language.distributions.gamma.name,false,true,"GammaDistribution",["alpha","beta"]));
listDistributions.push(new DistributionDataLoader("./DistributionErlang.js",language.distributions.erlang.name,false,true,"ErlangDistribution",["n","lambda"]));
listDistributions.push(new DistributionDataLoader("./DistributionBeta.js",language.distributions.beta.name,false,true,"BetaDistribution",["alpha","beta","a","b"]));
listDistributions.push(new DistributionDataLoader("./DistributionTriangular.js",language.distributions.triangular.name,false,true,"TriangularDistribution",["a","c","b"]));
listDistributions.push(new DistributionDataLoader("./DistributionTrapezoid.js",language.distributions.trapezoid.name,false,true,"TrapezoidDistribution",["a","b","c","d"]));
listDistributions.push(new DistributionDataLoader("./DistributionWeibull.js",language.distributions.weibull.name,false,true,"WeibullDistribution",["beta","lambda"]));
listDistributions.push(new DistributionDataLoader("./DistributionStudentT.js",language.distributions.studentT.name,false,true,"StudentTDistribution",["nu","mu"]));
listDistributions.push(new DistributionDataLoader("./DistributionCauchy.js",language.distributions.cauchy.name,false,false,"CauchyDistribution",["t","s"]));
listDistributions.push(new DistributionDataLoader("./DistributionF.js",language.distributions.f.name,false,true,"FDistribution",["m","n"]));
listDistributions.push(new DistributionDataLoader("./DistributionLaplace.js",language.distributions.laplace.name,false,true,"LaplaceDistribution",["mu","sigma"]));
listDistributions.push(new DistributionDataLoader("./DistributionPareto.js",language.distributions.pareto.name,false,true,"ParetoDistribution",["xm","alpha"]));
listDistributions.push(new DistributionDataLoader("./DistributionChi2.js",language.distributions.chi2.name,false,true,"Chi2Distribution",["k"]));
listDistributions.push(new DistributionDataLoader("./DistributionChi.js",language.distributions.chi.name,false,true,"ChiDistribution",["k"]));
listDistributions.push(new DistributionDataLoader("./DistributionHalfNormal.js",language.distributions.halfNormal.name,false,true,"HalfNormalDistribution",["s","mu"]));
listDistributions.push(new DistributionDataLoader("./DistributionRademacher.js",language.distributions.rademacher.name,true,true,"RademacherDistribution",[]));
listDistributions.push(new DistributionDataLoader("./DistributionIrwinHall.js",language.distributions.irwinhall.name,false,true,"IrwinHallDistribution",["n"]));
listDistributions.push(new DistributionDataLoader("./DistributionWignerSemicircle.js",language.distributions.wignerSemicircle.name,false,true,"WignerSemicircleDistribution",["m","R"]));
listDistributions.push(new DistributionDataLoader("./DistributionUQuadratic.js",language.distributions.uQuadratic.name,false,true,"UQuadraticDistribution",["a","b"]));
listDistributions.push(new DistributionDataLoader("./DistributionReciprocal.js",language.distributions.reciprocal.name,false,true,"ReciprocalDistribution",["a","b"]));
listDistributions.push(new DistributionDataLoader("./DistributionKumaraswamy.js",language.distributions.kumaraswamy.name,false,false,"KumaraswamyDistribution",["a","b"]));
listDistributions.push(new DistributionDataLoader("./DistributionSine.js",language.distributions.sine.name,false,true,"SineDistribution",["a","b"]));
listDistributions.push(new DistributionDataLoader("./DistributionArcsine.js",language.distributions.arcsine.name,false,true,"ArcsineDistribution",["a","b"]));
listDistributions.push(new DistributionDataLoader("./DistributionGumbel.js",language.distributions.gumbel.name,false,true,"GumbelDistribution",["mean","std"]));
listDistributions.push(new DistributionDataLoader("./DistributionHyperbolicSecant.js",language.distributions.hyperbolicSecant.name,false,true,"HyperbolicSecantDistribution",["mu","sigma"]));
listDistributions.push(new DistributionDataLoader("./DistributionInverseGaussian.js",language.distributions.inverseGaussian.name,false,true,"InverseGaussianDistribution",["lambda","mu"]));
listDistributions.push(new DistributionDataLoader("./DistributionJohnsonSU.js",language.distributions.johnson.name,false,false,"JohnsonSUDistribution",["gamma","xi","delta","lambda"]));
listDistributions.push(new DistributionDataLoader("./DistributionLevy.js",language.distributions.levy.name,false,false,"LevyDistribution",["mu","gamma"]));
listDistributions.push(new DistributionDataLoader("./DistributionLogistic.js",language.distributions.logistic.name,false,true,"LogisticDistribution",["mu","s"]));
listDistributions.push(new DistributionDataLoader("./DistributionLogLogistic.js",language.distributions.logLogistic.name,false,true,"LogLogisticDistribution",["alpha","beta"]));
listDistributions.push(new DistributionDataLoader("./DistributionMaxwellBoltzmann.js",language.distributions.maxwellBoltzmann.name,false,true,"MaxwellBoltzmannDistribution",["a"]));
listDistributions.push(new DistributionDataLoader("./DistributionPert.js",language.distributions.pert.name,false,true,"PertDistribution",["a","b","c"]));
listDistributions.push(new DistributionDataLoader("./DistributionPower.js",language.distributions.power.name,false,true,"PowerDistribution",["a","b","c"]));
listDistributions.push(new DistributionDataLoader("./DistributionRayleigh.js",language.distributions.rayleigh.name,false,true,"RayleighDistribution",["m"]));
listDistributions.push(new DistributionDataLoader("./DistributionFatigueLife.js",language.distributions.fatigueLife.name,false,false,"FatigueLifeDistribution",["mu","beta","gamma"]));
listDistributions.push(new DistributionDataLoader("./DistributionFrechet.js",language.distributions.frechet.name,false,false,"FrechetDistribution",["delta","beta","alpha"]));
listDistributions.push(new DistributionDataLoader("./DistributionLogarithmic.js",language.distributions.logarithmic.name,true,true,"LogarithmicDistribution",["p"]));
listDistributions.push(new DistributionDataLoader("./DistributionLogCauchy.js",language.distributions.logCauchy.name,false,false,"LogCauchyDistribution",["mu","sigma"]));
listDistributions.push(new DistributionDataLoader("./DistributionBorel.js",language.distributions.borel.name,true,true,"BorelDistribution",["mu"]));
listDistributions.push(new DistributionDataLoader("./DistributionBernoulli.js",language.distributions.bernoulli.name,true,true,"BernoulliDistribution",["p"]));
listDistributions.push(new DistributionDataLoader("./DistributionGaussKuzmin.js",language.distributions.gaussKuzmin.name,true,false,"GaussKuzminDistribution",[]));
listDistributions.push(new DistributionDataLoader("./DistributionSawtoothLeft.js",language.distributions.sawtoothLeft.name,false,true,"SawtoothLeftDistribution",["a","b"]));
listDistributions.push(new DistributionDataLoader("./DistributionSawtoothRight.js",language.distributions.sawtoothRight.name,false,true,"SawtoothRightDistribution",["a","b"]));
listDistributions.push(new DistributionDataLoader("./DistributionCosine.js",language.distributions.cosine.name,false,true,"CosineDistribution",["a","b"]));
listDistributions.push(new DistributionDataLoader("./DistributionLogGamma.js",language.distributions.logGamma.name,false,false,"LogGammaDistribution",["a","b"]));
listDistributions.push(new DistributionDataLoader("./DistributionInverseGamma.js",language.distributions.inverseGamma.name,false,true,"InverseGammaDistribution",["alpha","beta"]));
listDistributions.push(new DistributionDataLoader("./DistributionContinuousBernoulli.js",language.distributions.continuousBernoulli.name,false,false,"ContinuousBernoulliDistribution",["a","b","lambda"]));
listDistributions.push(new DistributionDataLoader("./DistributionHalfCauchy.js",language.distributions.halfCauchy.name,false,false,"HalfCauchyDistribution",["mu","sigma"]));
listDistributions.push(new DistributionDataLoader("./DistributionPlanck.js",language.distributions.planck.name,true,true,"PlanckDistribution",["lambda"]));
listDistributions.push(new DistributionDataLoader("./DistributionLogLaplace.js",language.distributions.logLaplace.name,false,true,"LogLaplaceDistribution",["c","s"]));
listDistributions.push(new DistributionDataLoader("./DistributionBoltzmann.js",language.distributions.boltzmann.name,true,false,"BoltzmannDistribution",["lambda","N"]));

/**
 * Returns a sorted list of all distribution names.
 * @param {Boolean} discrete Return only discrete distributions if true, continuous distributions if false
 * @returns Sorted list of distribution names
 */
function getDistributionNames(discrete) {
  return listDistributions.filter(dist=>dist.discrete===discrete).map(dist=>dist.name).sort();
}

/**
 * Returns the probability distribution object for a probability distribution name
 * @param {string} name Name of the probability distribution
 * @returns Promise that resolves to an instance of the probability distribution matching the given name (or null if no matching probability distribution object was found)
 */
async function getDistributionsByName(name) {
  const result=listDistributions.filter(dist=>dist.name==name);
  return (result.length!=1)?null:result[0].getDistribution();
}

/**
 * Returns the probability distribution object for a probability distribution class name
 * @param {string} name Name of the probability distribution class
 * @returns Promise that resolves to an instance of the probability distribution matching the given class name (or null if no matching probability distribution object was found)
 */
async function getDistributionByClassName(name) {
  const result=listDistributions.filter(dist=>dist.distributionClassName.toLowerCase()==name.toLowerCase());
  return (result.length!=1)?null:result[0].getDistribution();
}

/**
 * Returns a set containing all parameter ids from all registered distributions
 * @returns Set of all parameter ids from all distributions
 */
function getAllDistributionParameterIds() {
  const set=new Set();
  listDistributions.map(dist=>dist.parameterIds).forEach(list=>list.forEach(entry=>set.add(entry)));
  return set;
}

/**
 * Returns the number of distributions that can be fitted to data.
 * @returns Number of distributions that can be fitted to data
 */
function getFitableDistributionCount() {
  return listDistributions.filter(dist=>dist.canFit).length;
}

/**
 * Returns a list of distributions that can be fitted to data.
 * @returns Promise that resolves to a list of distributions that can be fitted to data
 */
async function getFitableDistributions() {
  const result=[];
  for (let dist of listDistributions.filter(dist=>dist.canFit)) {
    result.push(await dist.getDistribution());
  }
  return result
}

async function getTestAsyncLoader() {
  console.log("Checking consistency of distribution data...");
  for (let record of listDistributions) {
    const dist=await record.getDistribution();
    if (record.discrete!=dist.discrete) console.warn(`Inconsistency in distribution ${record.name}: discrete=${record.discrete} but distribution is ${dist.discrete}`);
    if (record.name!=dist.name) console.warn(`Inconsistency in distribution ${record.name}: name=${record.name} but distribution is ${dist.name}`);
    if (record.distributionClassName!=dist.constructor.name) console.warn(`Inconsistency in distribution ${record.name}: className=${record.distributionClassName} but distribution is ${dist.constructor.name}`);
    if (record.parameterIds.length!=dist.parameterIds.length) console.warn(`Inconsistency in distribution ${record.name}: parameterIds.length=${record.parameterIds.length} but distribution is ${dist.parameterIds.length}`);
    for (let i=0; i<record.parameterIds.length; i++) if (record.parameterIds[i]!=dist.parameterIds[i]) {
      console.warn(`Inconsistency in distribution ${record.name}: parameterIds[${i}]=${record.parameterIds[i]} but distribution is ${dist.parameterIds[i]}`);
    }
    if (record.canFit!=dist.canFit) console.warn(`Inconsistency in distribution ${record.name}: canFit=${record.canFit} but distribution is ${dist.canFit}`);
  }
  console.log("Distribution data is consistent.");
}

/* Test: await getTestAsyncLoader(); */