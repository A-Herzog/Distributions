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

export {DiscreteProbabilityDistribution, ContinuousProbabilityDistribution, getDiscreteDefaultCDF, getContinousDefaultCDF};

import {language} from "./Language.js";
import {getInt, getFloat, formatNumber, formatNumberWithTitle, formatPercent} from './NumberTools.js';
import {format} from './StringTools.js';
import {beginMathML, endMathML, defE, frac, variable, equals, minus, setR, defF, defP} from "./MathMLTools.js";
import {isDesktopApp} from "./Main.js";



/**
 * Abstract base class for all probability distribution classes
 */
class ProbabilityDistribution {
  #name;
  #nameWithFormat;
  #continuous;
  #support=null;
  #infoText=null;
  #infoImage=null;
  #infoImageWidth=null;
  #infoImageHeight=null;
  #wikipediaURL=null;
  #pdfText=null;
  #cdfText=null;
  #scipyText=null;
  #scipyBlock;
  #parameters=[];
  #allParameterOk;
  _currentParameterValues;
  #panel;
  #cardCharacteristics;
  #canvas;
  #canvasInfo;
  #chart=null;
  #calcParameterShortName;
  #calcParameterDefaultValue;
  #calcInput;
  #calcError;
  #calcResults;
  #isSmallMode;
  _checkBoxMean;
  _checkBoxStd;
  _checkBoxMedian;
  _inputMinX;
  _inputMaxX;
  _checkAutoRange;

  /**
   * Constructor
   * @param {string} name Name of the probability distribution
   * @param {boolean} continuous Discrete (false) or continuous probability distribution (true)
   * @param {string} nameWithFormat Name with optional html formating (optional; normal name will be used if missing)
   */
  constructor(name, continuous, nameWithFormat=null) {
    this.#name=name;
    if (nameWithFormat==null) this.#nameWithFormat=name; else this.#nameWithFormat=nameWithFormat;
    this.#continuous=continuous;
    this.#panel=null;
  }

  /**
   * Name of the probability distribution
   */
  get name() {
    return this.#name;
  }

  /**
   * Name of the probability distribution with html formating
   */
  get nameWithFormat() {
    return this.#nameWithFormat;
  }

  /**
   * Name and parameters of the probability distribution
   */
  get nameWithParameters() {
    const param=[];
    for (let key in this._currentParameterValues) {
      const name=this.#parameters.filter(parameter=>parameter.id==key)[0].shortName;
      param.push(name+"="+formatNumber(this._currentParameterValues[key]));
    }
    if (param.length==0) return this.#name;
    return this.#name+"("+param.join(";")+")";
  }

  /**
   * Discrete probability distribution?
   */
  get discrete() {
    return !this.#continuous;
  }

  /**
   * Continuous probability distribution?
   */
  get continuous() {
    return this.#continuous;
  }

  /**
   * List of all parameter id values
   */
  get parameterIds() {
    return this.#parameters.map(parameter=>parameter.id);
  }

  #addCard(parent, title, button) {
    const card=document.createElement("div");
    card.className="card mt-3";

    const header=document.createElement("div");
    card.appendChild(header);
    header.className="card-header";

    if (typeof(button)=='undefined') {
      header.innerHTML=title;
    } else {
      const span=document.createElement("span");
      header.appendChild(span);
      span.innerHTML=title;
      header.appendChild(button);
      button.type="button";
      button.classList.add("btn","btn-outline-secondary","btn-sm");
      button.style="float: right;";
    }

    const body=document.createElement("div");
    body.className="card-body";
    card.appendChild(body);

    parent.appendChild(card);
    return body;
  }

  /**
   * Returns an array of strings containing information about the general properties of the probability distribution
   * @returns Array of strings of the general properties of the probability distribution
   */
  _getGeneralProperties() {
    let properties=[];
    properties.push(language.distributions.infoPropertiesName+": <strong>"+this.#nameWithFormat+"</strong>");
    properties.push(language.distributions.infoPropertiesType+": <strong>"+((this.#continuous)?language.distributions.typeContinuous:language.distributions.typeDiscrete)+"</strong>");
    if (this.#support!=null) properties.push(language.distributions.infoPropertiesSupport+": <strong>"+this.#support+"</strong>");
    return properties;
  }

  #addInputToPanel(parent, id, shortName, fullName, defaultValue) {
    const clsName=this.constructor.name;

    if (fullName!=null) {
      const label=document.createElement("label");
      parent.appendChild(label);
      label.htmlFor=clsName+"-"+id;
      label.className="form-label";
      label.innerHTML=fullName;
    }

    const group=document.createElement("div");
    parent.appendChild(group);
    group.className="input-group mb-3";

    const name=document.createElement("span");
    group.appendChild(name);
    name.className="input-group-text has-validation";
    name.innerHTML=shortName+":=";

    const input=document.createElement("input");
    group.appendChild(input);
    input.type="text";
    input.className="form-control";
    input.id=clsName+"-"+id;
    input.value=formatNumber(defaultValue);

    const buttonDown=document.createElement("button");
    group.appendChild(buttonDown);
    buttonDown.className="btn btn-outline-secondary bi-caret-down-fill";
    buttonDown.type="button";
    buttonDown.title=language.distributions.parameterValueDown;

    const buttonUp=document.createElement("button");
    group.appendChild(buttonUp);
    buttonUp.className="btn btn-outline-secondary bi-caret-up-fill";
    buttonUp.type="button";
    buttonUp.title=language.distributions.parameterValueUp;

    const error=document.createElement("div");
    group.appendChild(error);
    error.className="invalid-feedback";

    return [input, error, buttonUp, buttonDown];
  }

  #addParameterToPanel(parent, parameter) {
    let input, error, buttonUp, buttonDown;
    [input, error, buttonUp, buttonDown]=this.#addInputToPanel(parent,parameter.id,parameter.shortName,parameter.fullName,parameter.defaultValue);

    input.onkeyup=()=>this._fireParameterUpdated();
    input.onchange=()=>this._fireParameterUpdated();

    parameter.inputElement=input;
    parameter.errorElement=error;

    if (parameter.discrete) {
      buttonUp.onclick=()=>{
        const current=(parameter.currentValue==null)?parameter.defaultValue:parameter.currentValue;
        const newValue=(parameter.hasMaxValue)?Math.min(parameter.maxValue,current+1):(current+1);
        input.value=formatNumber(newValue);
        this._fireParameterUpdated();
      };
      buttonDown.onclick=()=>{
        const current=(parameter.currentValue==null)?parameter.defaultValue:parameter.currentValue;
        const newValue=(parameter.hasMinValue)?Math.max(parameter.minValue,current-1):(current-1);
        input.value=formatNumber(newValue);
        this._fireParameterUpdated();
      };
    } else {
      const step=(parameter.hasMinValue && parameter.hasMaxValue)?((parameter.maxValue-parameter.minValue)/20):1;
      buttonUp.onclick=()=>{
        const current=(parameter.currentValue==null)?parameter.defaultValue:parameter.currentValue;
        let newValue;
        if (parameter.hasMaxValue) {
          if (parameter.maxValueInclusive) {
            newValue=Math.min(parameter.maxValue,current+step);
          } else {
            newValue=Math.min(parameter.maxValue-step,current+step);
          }
        } else {
          newValue=current+step;
        }
        input.value=formatNumber(newValue);
        this._fireParameterUpdated();
      };
      buttonDown.onclick=()=>{
        const current=(parameter.currentValue==null)?parameter.defaultValue:parameter.currentValue;
        let newValue;
        if (parameter.hasMinValue) {
          if (parameter.minValueInclusive) {
            newValue=Math.max(parameter.minValue,current-step);
          } else {
            newValue=Math.max(parameter.minValue+step,current-step);
          }
        } else {
          newValue=current-step;
        }
        input.value=formatNumber(newValue);
        this._fireParameterUpdated();
      };
    }
  }

  #buildPanel() {
    const span=document.createElement("span");

    let row, col;
    let card;
    let text;
    let generalCard;
    let infoLine;
    let diagramZoomInfo
    const that=this;

    /* Row */
    span.appendChild(row=document.createElement("div"));
    row.className="row";

    /* General info */
    row.appendChild(col=document.createElement("div"));
    col.className="col-lg-6";
    card=this.#addCard(col,language.distributions.infoProperties);
    text="";
    text+="<p>"+this._getGeneralProperties().join("<br>")+"</p>";
    if (this.#infoImage!=null) {
      const w=(this.#infoImageWidth==null)?"":(" width='"+this.#infoImageWidth+"'");
      const h=(this.#infoImageHeight==null)?"":(" height='"+this.#infoImageHeight+"'");
      text+="<img src='./images/"+this.#infoImage+"' style='float: right;' alt='"+this.#name+"'"+w+h+">";
    }
    if (this.#infoText!=null) text+=this.#infoText;
    if (this.#wikipediaURL!=null) {
      text+="<p>";
      if (isDesktopApp) {
        text+="<a onclick=\"Neutralino.os.open('"+this.#wikipediaURL+"')\" class='link-primary' style='cursor: pointer;'>"+language.distributions.infoPropertiesWikipediaLink+"</a>";

      } else {
        text+="<a href='"+this.#wikipediaURL+"' target='_blank'>"+language.distributions.infoPropertiesWikipediaLink+"</a>";
      }
      text+="</p>";
    }
    card.innerHTML=text;
    if (isDesktopApp) for (let link of card.querySelectorAll("a")) if (link.href!='') {
      const href=link.href;
      link.onclick=()=>Neutralino.os.open(href);
      link.removeAttribute("href");
      link.style.cursor="pointer";
      link.classList.add("link-primary");
    }
    generalCard=card;

    /* Input parameters */
    row.appendChild(col=document.createElement("div"));
    col.className="col-lg-6";
    card=this.#addCard(col,language.distributions.infoParameters);
    if (this.#parameters.length==0) {
      const p=document.createElement("p");
      p.innerHTML=language.distributions.infoNoParameters;
      card.appendChild(p);
    } else {
      for (let parameter of this.#parameters) this.#addParameterToPanel(card,parameter);
    }

    /* Visualization */
    const button=document.createElement("button");
    button.type="button";
    button.className="bi bi-arrows-collapse";
    button.style="float: right;";
    button.title=language.GUI.size.collapse;
    button.onclick=()=>{
      if (!infoLine) return;
      const show=(infoLine.style.display=='none');
      this.#isSmallMode=!show;
      generalCard.classList.toggle("small",!show);
      infoLine.style.display=(show)?'':'none';
      diagramZoomInfo.style.display=(show)?'':'none';
      that.#canvasInfo.style.display=(show)?'':'none';
      if (this.#scipyBlock && !show) this.#scipyBlock.style.display="none";
      button.title=(show)?language.GUI.size.collapse:language.GUI.size.expand;
      button.classList.toggle("bi-arrows-collapse",show);
      button.classList.toggle("bi-arrows-expand",!show);

      let height=that.#canvas.style.height;
      height=parseInt(height.substring(0,height.length-2));
      if (show) {
        that.#canvas.style.height=(height*2)+'px';
        that.#canvas.height=that.#canvas.height*2;
      } else {
        that.#canvas.style.height=Math.round(height/2)+'px';
        that.#canvas.height=Math.round(that.#canvas.height/2);
      }
    };

    card=this.#addCard(span,this.#continuous?language.distributions.infoVisualizationContinuous:language.distributions.infoVisualizationDiscrete,button);
    if (this.#pdfText!=null || this.#cdfText!=null) {
      infoLine=document.createElement("p");
      if (this.#pdfText!=null) {
        infoLine.innerHTML+=(this.#continuous?language.distributions.PDFContinuous:language.distributions.PDFDiscrete)+": "+this.#pdfText;
      }
      if (this.#pdfText!=null && this.#cdfText!=null) infoLine.innerHTML+=", ";
      if (this.#cdfText!=null) {
        infoLine.innerHTML+=language.distributions.CDF+": "+this.#cdfText;
      }
      if (this.#scipyText!=null) {
        const scipyButton=document.createElement("button");
        scipyButton.type="button";
        scipyButton.className="btn btn-outline-secondary btn-sm bi bi-code-slash ms-3";
        scipyButton.title=language.distributions.scipyTooltip;
        scipyButton.onclick=()=>{
          this.#scipyBlock.style.display=(this.#scipyBlock.style.display=='none')?'':'none';
        }
        infoLine.appendChild(scipyButton);
      }
      card.appendChild(infoLine);
      if (this.#scipyText!=null) {
        this.#scipyBlock=document.createElement("div");
        this.#scipyBlock.style.display='none';
        this.#scipyBlock.className="mt-2 mb-3 border border-success rounded p-2";
        this.#scipyBlock.innerHTML="<pre style='margin-bottom: 0;'>"+this.#scipyText.split("\n").map(line=>(line.length>6)?line.substring(6):line).join("\n")+"</pre>";
        card.appendChild(this.#scipyBlock);
      }
    }
    this.#canvas=document.createElement("canvas");
    card.appendChild(this.#canvas);

    diagramZoomInfo=document.createElement("div");
    card.appendChild(diagramZoomInfo);
    diagramZoomInfo.className="mt-3 small";
    diagramZoomInfo.innerHTML=language.distributions.infoDiagramZoomInfo;

    this.#canvasInfo=document.createElement("div");
    card.appendChild(this.#canvasInfo);
    this.#canvasInfo.className="mt-3";
    this.#canvasInfo.style.display="none";

    /* Row */
    span.appendChild(row=document.createElement("div"));
    row.className="row";

    /* Characteristics */
    row.appendChild(col=document.createElement("div"));
    col.className="col-lg-8";
    card=this.#addCard(col,language.distributions.infoCharacteristics);
    this.#cardCharacteristics=card;

    /* Calculate values */
    let buttonUp, buttonDown;
    row.appendChild(col=document.createElement("div"));
    col.className="col-lg-4";
    card=this.#addCard(col,language.distributions.infoCalcValues);
    [this.#calcInput, this.#calcError, buttonUp, buttonDown]=this.#addInputToPanel(card,"calc",this.#calcParameterShortName,language.distributions.infoCalcParameter,this.#calcParameterDefaultValue);
    this.#calcInput.onkeyup=()=>this.#fireCalcParameterUpdated();
    this.#calcInput.change=()=>this.#fireCalcParameterUpdated();
    card.appendChild(this.#calcResults=document.createElement("div"));

    buttonUp.onclick=()=>{
      const value=(this.#continuous)?getFloat(this.#calcInput):getInt(this.#calcInput);
      if (value==null) return;
      this.#calcInput.value=formatNumber(value+1);
      this.#fireCalcParameterUpdated();
    };
    buttonDown.onclick=()=>{
      const value=(this.#continuous)?getFloat(this.#calcInput):getInt(this.#calcInput);
      if (value==null) return;
      this.#calcInput.value=formatNumber(value-1);
      this.#fireCalcParameterUpdated();
    };

    this._fireParameterUpdated();

    return span;
  }

  _fireParameterUpdated() {
    const values={};
    let allOk=true;

    /* Get and check values */

    for (let parameter of this.#parameters) {
      if (parameter.discrete) {
        parameter.currentValue=getInt(parameter.inputElement);
        parameter.ok=(parameter.currentValue!==null);
        if (parameter.ok && parameter.hasMinValue && parameter.currentValue<parameter.minValue) parameter.ok=false;
        if (parameter.ok && parameter.hasMaxValue && parameter.currentValue>parameter.maxValue) parameter.ok=false;
      } else {
        parameter.currentValue=getFloat(parameter.inputElement);
        parameter.ok=(parameter.currentValue!==null);
        if (parameter.ok && parameter.hasMinValue) {
          if (parameter.minValueInclusive) {
            if (parameter.currentValue<parameter.minValue) parameter.ok=false;
          } else {
            if (parameter.currentValue<=parameter.minValue) parameter.ok=false;
          }
        }
        if (parameter.ok && parameter.hasMaxValue) {
          if (parameter.maxValueInclusive) {
            if (parameter.currentValue>parameter.maxValue) parameter.ok=false;
          } else {
            if (parameter.currentValue>=parameter.maxValue) parameter.ok=false;
          }
        }
      }
      if (!parameter.ok) allOk=false;
      values[parameter.id]=parameter.currentValue;
    }

    /* Start processing (or show error message) */

    this.#allParameterOk=allOk;
    this._currentParameterValues=values;
    if (!allOk) {
      for (let parameter of this.#parameters) if (parameter.ok) this.#removeErrorMarker(parameter.id); else this._setErrorMarker(parameter.id);
      this._clearAllOutput();
      return;
    }

    for (let parameter of this.#parameters) this.#removeErrorMarker(parameter.id);
    if (!this._checkParameters(values)) {
      this._clearAllOutput();
      this.#allParameterOk=false;
      return;
    }

    this._calcDistribution(values);
    this.#fireCalcParameterUpdated();
    this.updatePermaLink();
  }

  /**
   * Updates the distribution parameters.<br>
   * (Is only needed if calcProbability is call outside the GUI context.)
   */
  setParameters(values) {
    this._currentParameterValues=values;
    this._calcDistribution(values);
  }

  /**
   * Updates the permalink outside the distribution panel area
   */
  updatePermaLink() {
    if (typeof(PermaLink)=='undefined') return;
    let distShortName=this.constructor.name;
    distShortName=distShortName.substring(0,distShortName.length-"Distribution".length);
    const params=[];
    for (let key in this._currentParameterValues) params.push(key+"="+this._currentParameterValues[key]);
    const url=document.location.protocol+"//"+document.location.host+document.location.pathname+"?distribution="+distShortName+"&"+params.join("&");

    PermaLink.href=url;
    menuColorModeLight.href=url;
    menuColorModeDark.href=url;
    menuColorModeSystemDefault.href=url;
  }

  /**
   * Allows to set the values of the input fields from outside the object
   * @param {Object} parameterValues Object containing the key value data for the distribution parameters
   */
  setParmeterExtern(parameterValues) {
    if (this.#panel==null) this.#panel=this.#buildPanel();

    for (let parameter of this.#parameters) {
      const newValue=parameterValues[parameter.id];
      if (typeof(newValue)=='undefined') continue;
      parameter.inputElement.value=formatNumber(newValue,14);
    }

    this._fireParameterUpdated();
  }

  #fireCalcParameterUpdated() {
    let value;
    if (this.#continuous) value=getFloat(this.#calcInput); else value=getInt(this.#calcInput);

    if (value==null) {
      this.#calcInput.classList.add("is-invalid");
      this.#calcError.innerHTML=this.#continuous?language.distributions.parameterErrorFloat:language.distributions.parameterErrorInt;
      this._clearCalcOutput();
    } else {
      this.#calcInput.classList.remove("is-invalid");
      if (this.#allParameterOk) {
        this._calcValues(this._currentParameterValues,value);
      } else {
        this._clearCalcOutput();
      }
    }
  }

  #removeErrorMarker(id) {
    const list=this.#parameters.filter(parameter=>parameter.id==id);
    if (list.length!=1) return;
    const parameter=list[0];

    parameter.inputElement.classList.remove("is-invalid");
  }

  /**
   * Marks an input parameter as invalid.
   * @param {string} id Parameter id
   * @param {string} info Error message to be shown (or null, if the error message is to be calculated automatically from the parameter setup)
   */
  _setErrorMarker(id, info=null) {
    const list=this.#parameters.filter(parameter=>parameter.id==id);
    if (list.length!=1) return;
    const parameter=list[0];

    if (info==null) {
      if (parameter.discrete) {
        if (!parameter.hasMinValue && !parameter.hasMaxValue) info=language.distributions.parameterErrorInt;
        if (parameter.hasMinValue && !parameter.hasMaxValue) info=format(language.distributions.parameterErrorIntMin,parameter.minValue);
        if (!parameter.hasMinValue && parameter.hasMaxValue) info=format(language.distributions.parameterErrorIntMax,parameter.maxValue);
        if (parameter.hasMinValue && parameter.hasMaxValue) info=format(language.distributions.parameterErrorIntMinMax,parameter.minValue,parameter.maxValue);
      } else {
        if (!parameter.hasMinValue && !parameter.hasMaxValue) info=language.distributions.parameterErrorFloat;
        if (parameter.hasMinValue && !parameter.hasMaxValue) {
          if (parameter.minValueInclusive) {
            info=format(language.distributions.parameterErrorFloatMinInclusive,parameter.minValue);
          } else {
            info=format(language.distributions.parameterErrorFloatMinExclusive,parameter.minValue);
          }
        }
        if (!parameter.hasMinValue && parameter.hasMaxValue) {
          if (parameter.maxValueInclusive) {
            info=format(language.distributions.parameterErrorFloatMaxInclusive,parameter.maxValue);
          } else {
            info=format(language.distributions.parameterErrorFloatMaxExclusive,parameter.maxValue);
          }
        }
        if (parameter.hasMinValue && parameter.hasMaxValue) {
          if (!parameter.minValueInclusive && !parameter.maxValueInclusive) info=format(language.distributions.parameterErrorFloatMinMaxExclusiveExclusive,parameter.minValue,parameter.maxValue);
          if (parameter.minValueInclusive && !parameter.maxValueInclusive) info=format(language.distributions.parameterErrorFloatMinMaxInclusiveExclusive,parameter.minValue,parameter.maxValue);
          if (!parameter.minValueInclusive && parameter.maxValueInclusive) info=format(language.distributions.parameterErrorFloatMinMaxExclusiveInclusive,parameter.minValue,parameter.maxValue);
          if (parameter.minValueInclusive && parameter.maxValueInclusive) info=format(language.distributions.parameterErrorFloatMinMaxInclusiveInclusive,parameter.minValue,parameter.maxValue);
        }
      }
    }

    parameter.inputElement.classList.add("is-invalid");
    parameter.errorElement.innerHTML=info;
  }

  /**
   * Distribution specific checks if the values of the parameters are valid in this combination
   * @param {Object} values Object containing the values for the parameter ids
   * @returns Returns true if the parameters are valid in this combination
   */
  _checkParameters(values) {
    return true;
  }

  /**
   * Starts calculating the characteristics and showing the diagrams after change of the input parameters.
   * @param {Object} values Object containing the values for the parameter ids
   */
  _calcDistribution(values) {
  }

  /**
   * Starts calculating the probability for a specific value.
   * @param {Object} parameterValues Object containing the values for the parameter ids
   * @param {Number} value Value to calculate the probability for
   */
  _calcValues(parameterValues, value) {
  }

  /**
   * Clears all output (characteristics, diagram, calculated values area).
   */
  _clearAllOutput() {
    this.#cardCharacteristics.innerHTML=language.distributions.infoCharacteristicsError;
    this._drawChart(null);
    this._clearCalcOutput();
  }

  /**
   * Clears the calculated values area.
   */
  _clearCalcOutput() {
    this.#calcResults.innerHTML=language.distributions.infoCalcValuesError;
  }

  /**
   * Sets the text to be displayed in the characteristics box.
   * @param {String}  Text to be displayed in the characteristics box
   */
  set characteristics(characteristics) {
    if (this.#cardCharacteristics) this.#cardCharacteristics.innerHTML=characteristics;
  }

  /**
   * HTML element containing the editor and the output values for calculating individual values of the probability distribution
   */
  get calcValues() {
    return this.#calcResults;
  }

  /**
   * HTML element containing the complete editor and viewer for the distribution
   */
  get panel() {
    if (this.#panel==null) this.#panel=this.#buildPanel();
    return this.#panel;
  }

  /**
   * Initializes the chart
   * @param {Object} setup Chart.js setup object (or null to just remove the current chart)
   */
  _drawChart(setup) {
    if (this.#chart!=null) {this.#chart.destroy(); this.#chart=null;}
    if (this.#canvas) {
      if (setup==null) {
        this.#canvas.innerHTML="";
        this.#canvasInfo.style.display="none";
      } else {
        this.#chart=new Chart(this.#canvas,setup);
        this.#canvasInfo.style.display=(this.#isSmallMode)?"none":"";
        if (this.#isSmallMode) {
          let height=this.#canvas.style.height;
          height=parseInt(height.substring(0,height.length-2));
          this.#canvas.style.height=Math.round(height/2)+'px';
          this.#canvas.height=Math.round(this.#canvas.height/2);
        }
      }
    }
  }

  /**
   * Chart-js element
   */
  get chart() {
    return this.#chart;
  }

  /**
   * HTML canvas element
   */
  get canvas() {
    return this.#canvas;
  }

  /**
   * HTML element for an optional info panel under the chart
   */
  get canvasInfo() {
    return this.#canvasInfo;
  }

  /**
   * Sets the support text for the probability distribution (if no support is defined, no support information will be displayed in the general information)
   * @param {String} support  Support of the distribution
   */
  set support(support) {
    this.#support=support;
  }

  /**
   * Sets a string containing an information text about the probability distribution function.
   * @param {String} infoText String containing an information text about the probability distribution function
   */
  set infoText(infoText) {
    this.#infoText=infoText;
  }

  /**
   * Sets the file name of an optional image to be displayed next to the information text.
   * @param {String} infoImage  Optional image to be displayed next to the information text
   */
  set infoImage(infoImage) {
    this.#infoImage=infoImage;
  }

  /**
   * Sets the optional width of the optional image to be displayed next to the information text.
   * @param {Number} infoImageWidth Width of the image to be displayed next to the information text
   */
  set infoImageWidth(infoImageWidth) {
    this.#infoImageWidth=infoImageWidth;
  }

  /**
   * Sets the optional height of the optional image to be displayed next to the information text.
   * @param {Number} infoImageHeight Height of the image to be displayed next to the information text
   */
  set infoImageHeight(infoImageHeight) {
    this.#infoImageHeight=infoImageHeight;
  }

  /**
   * Sets the Wikipedia URL to the probability distribution
   * @param {String}  wikipediaURL Wikipedia URL to the probability distribution
   */
  set wikipediaURL(wikipediaURL) {
    this.#wikipediaURL=wikipediaURL;
  }

  /**
   * Sets the formula for the probability distribution function
   * @param {String}  pdfText for the probability distribution function
   */
  set pdfText(pdfText) {
    this.#pdfText=pdfText;
  }

  /**
   * Sets the formula for the cumulative distribution function
   * @param {String}  cdfText for the cumulative distribution function
   */
  set cdfText(cdfText) {
    this.#cdfText=cdfText;
  }

  /**
   * Sets the text for the SciPy implementation of the probability distribution
   * @param {String}  scipyText Text for the SciPy implementation of the probability distribution
   * @description The text should be a Python code block that can be used to create the distribution in SciPy
   * @see https://docs.scipy.org/doc/scipy/reference/stats.html for more information about the SciPy distributions.
   */
  set scipyText(scipyText) {
    this.#scipyText=scipyText;
  }

  /**
   * Adds a discrete valued parameter to the editor for the probability distribution
   * @param {String} id Internal id for the parameter
   * @param {String} shortName Name to be displayed left to the parameter input field
   * @param {String} fullName Name to be displayed above the parameter input field
   * @param {Number} minValue Minimum value (typical 0 or 1)
   * @param {Number} defaultValue Default value in the editor for the parameter
   */
  _addDiscreteParameter(id, shortName, fullName, minValue, defaultValue) {
    const parameter={
      id: id,
      shortName: shortName,
      fullName: fullName,
      discrete: true,
      hasMinValue: (minValue!=null),
      minValue: minValue,
      hasMaxValue: false,
      defaultValue: defaultValue
    };
    this.#parameters.push(parameter);
  }

  /**
   * Adds a discrete valued parameter to the editor for the probability distribution
   * @param {String} id Internal id for the parameter
   * @param {String} shortName Name to be displayed left to the parameter input field
   * @param {String} fullName Name to be displayed above the parameter input field
   * @param {Number} minValue Minimum value (typical 0 or 1)
   * @param {Number} maxValue Maximum value
   * @param {Number} defaultValue Default value in the editor for the parameter
   */
  _addDiscreteParameterMinMax(id, shortName, fullName, minValue, maxValue, defaultValue) {
    const parameter={
      id: id,
      shortName: shortName,
      fullName: fullName,
      discrete: true,
      hasMinValue: (minValue!=null),
      minValue: minValue,
      hasMaxValue: (maxValue!=null),
      maxValue: maxValue,
      defaultValue: defaultValue
    };
    this.#parameters.push(parameter);
  }

  /**
   * Adds a continuous valued parameter to the editor for the probability distribution
   * @param {String} id Internal id for the parameter
   * @param {String} shortName Name to be displayed left to the parameter input field
   * @param {String} fullName Name to be displayed above the parameter input field
   * @param {Number} minValue Minimum value (can be null for no minimum)
   * @param {Boolean} minValueInclusive Is the specified minimum a valid value?
   * @param {Number} maxValue Maximum value (can be null for no maximum)
   * @param {Boolean} maxValueInclusive Is the specified maximum a valid value?
   * @param {Number} defaultValue Default value in the editor for the parameter
   */
  _addContinuousParameter(id, shortName, fullName, minValue, minValueInclusive, maxValue, maxValueInclusive, defaultValue) {
    const parameter={
      id: id,
      shortName: shortName,
      fullName: fullName,
      discrete: false,
      hasMinValue: (minValue!==null),
      minValue: minValue,
      minValueInclusive: minValueInclusive,
      hasMaxValue: (maxValue!==null),
      maxValue: maxValue,
      maxValueInclusive: maxValueInclusive,
      defaultValue: defaultValue
    };
    this.#parameters.push(parameter);
  }

  /**
   * Sets the name and the default value for the parameter for calculating probabilities
   * @param {String} shortName Name of the parameter for calculating a probability (typically "k" or "x")
   * @param {Number} defaultValue Default value for the parameter
   */
  _setCalcParameter(shortName, defaultValue) {
    this.#calcParameterShortName=shortName;
    this.#calcParameterDefaultValue=defaultValue;
  }

  /**
   * Creates and adds a button below the diagram.
   * @param {String} icon class name of the icon to be displayed on the button
   * @param {String} title Text to be displayed on the button
   * @returns Button html element
   */
  _addButton(icon, title) {
    const button=document.createElement("button");
    this.canvasInfo.appendChild(button);
    button.type="button";
    button.className="btn btn-primary btn-sm "+icon+" mt-1 me-2 mb-2";
    button.innerHTML=" "+title;
    return button;
  }

  /**
   * Adds a show E[X] in diagram checkbox
   * @param {Object} parent Parent element
   */
  _addShowE(parent) {
    const check=document.createElement("div");
    parent.appendChild(check);
    check.className="form-check small";
    check.style.display="inline-block";

    const checkbox=document.createElement("input")
    check.appendChild(checkbox);
    checkbox.type="checkbox";
    this._checkBoxMean=checkbox;
    checkbox.className="form-check-input";
    checkbox.id="showE"+this.constructor.name;
    checkbox.onchange=e=>this._fireParameterUpdated();

    const label=document.createElement("label");
    check.appendChild(label);
    label.innerHTML=language.distributions.showExpectedValue;
    label.className="form-check-label pe-3";
    label.style.userSelect="none";
    label.htmlFor="showE"+this.constructor.name;
  }

  /**
   * Adds a show E[X]+-Std[X] in diagram checkbox
   * @param {Object} parent Parent element
   */
  _addShowStd(parent) {
    const check=document.createElement("div");
    parent.appendChild(check);
    check.className="form-check small";
    check.style.display="inline-block";

    const checkbox=document.createElement("input")
    check.appendChild(checkbox);
    checkbox.type="checkbox";
    this._checkBoxStd=checkbox;
    checkbox.className="form-check-input";
    checkbox.id="showStd"+this.constructor.name;
    checkbox.onchange=e=>this._fireParameterUpdated();

    const label=document.createElement("label");
    check.appendChild(label);
    label.innerHTML=language.distributions.showStandardDeviation;
    label.className="form-check-label pe-3";
    label.style.userSelect="none";
    label.htmlFor="showStd"+this.constructor.name;
  }

  /**
   * Adds a show median in diagram checkbox
   * @param {Object} parent Parent element
   */
  _addShowMedian(parent) {
    const check=document.createElement("div");
    parent.appendChild(check);
    check.className="form-check small";
    check.style.display="inline-block";

    const checkbox=document.createElement("input")
    check.appendChild(checkbox);
    checkbox.type="checkbox";
    this._checkBoxMedian=checkbox;
    checkbox.className="form-check-input";
    checkbox.id="showMedian"+this.constructor.name;
    checkbox.onchange=e=>this._fireParameterUpdated();

    const label=document.createElement("label");
    check.appendChild(label);
    label.innerHTML=language.distributions.showMedian;
    label.className="form-check-label pe-3";
    label.style.userSelect="none";
    label.htmlFor="showMedian"+this.constructor.name;
  }

  /**
   * Adds x range input and checkboxes
   * @param {Object} parent Parent element
   */
  _addRangeSetup(parent) {
    let div;
    let span;

    /* Min X */

    parent.appendChild(div=document.createElement("div"));
    div.className="input-group input-group-sm mb-3 mt-3";
    div.style.display="inline-flex";
    div.style.width="150px";

    div.appendChild(span=document.createElement("label"));
    span.className="input-group-text";
    span.innerHTML="x<sub>min</sub>:=";
    span.htmlFor="minX"+this.constructor.name;

    div.appendChild(this._inputMinX=document.createElement("input"));
    this._inputMinX.type="text";
    this._inputMinX.className="form-control";
    this._inputMinX.id="minX"+this.constructor.name;
    this._inputMinX.disabled=true;
    this._inputMinX.oninput=e=>{if (!this._inputMinX.disabled) this._fireParameterUpdated();}
    this._inputMinX.onkeyup=e=>{if (!this._inputMinX.disabled) this._fireParameterUpdated();}

    /* Max X */

    parent.appendChild(div=document.createElement("div"));
    div.className="input-group input-group-sm mb-3 ms-1";
    div.style.display="inline-flex";
    div.style.width="150px";

    div.appendChild(span=document.createElement("label"));
    span.className="input-group-text";
    span.innerHTML="x<sub>max</sub>:=";
    span.htmlFor="maxX"+this.constructor.name;

    div.appendChild(this._inputMaxX=document.createElement("input"));
    this._inputMaxX.type="text";
    this._inputMaxX.className="form-control";
    this._inputMaxX.id="maxX"+this.constructor.name;
    this._inputMaxX.disabled=true;
    this._inputMaxX.oninput=e=>{if (!this._inputMaxX.disabled) this._fireParameterUpdated();}
    this._inputMaxX.onkeyup=e=>{if (!this._inputMaxX.disabled) this._fireParameterUpdated();}

    /* Auto range */

    const check=document.createElement("div");
    parent.appendChild(check);
    check.className="form-check small ms-2";
    check.style.display="inline-block";

    const checkbox=document.createElement("input")
    check.appendChild(checkbox);
    checkbox.type="checkbox";
    this._checkAutoRange=checkbox;
    checkbox.className="form-check-input";
    checkbox.id="autoX"+this.constructor.name;
    checkbox.onchange=e=>this._fireParameterUpdated();
    checkbox.checked=true;

    const label=document.createElement("label");
    check.appendChild(label);
    label.innerHTML=language.distributions.xAutoRange;
    label.className="form-check-label pe-3";
    label.style.userSelect="none";
    label.htmlFor="autoX"+this.constructor.name;
  }

  /**
   * Returns the selected x range.
   * @returns Array of min and max x or null in case of error or auto range active
   */
  _getRange() {
    if (typeof(this._checkAutoRange)=='undefined') return;

    if (this._checkAutoRange.checked) {
      this._inputMinX.classList.remove("is-invalid");
      this._inputMaxX.classList.remove("is-invalid");
      this._inputMinX.disabled=true;
      this._inputMaxX.disabled=true;
      return null;
    }

    this._inputMinX.disabled=false;
    this._inputMaxX.disabled=false;

    const minX=getFloat(this._inputMinX);
    const maxX=getFloat(this._inputMaxX);
    this._inputMinX.classList.toggle("is-invalid",minX===null);
    this._inputMaxX.classList.toggle("is-invalid",maxX===null || (minX!==null && minX>=maxX));

    if (minX==null || maxX===null || minX>=maxX) return null;
    return [minX, maxX];
  }

  /**
   * Sets the values for minimum and maximum x in the input boxes
   * (to show values in auto range mode).
   * @param {Number} minX Minimum X value
   * @param {Number} maxX Maximum x value
   */
  _setRangeInput(minX, maxX) {
    if (typeof(this._checkAutoRange)=='undefined') return;

    if (!this._checkAutoRange.checked) return;
    this._inputMinX.value=formatNumber(minX);
    this._inputMaxX.value=formatNumber(maxX);
  }

  /**
   * Adds a reset zoom button
   * @param {Object} parent Parent element
   */
  _addResetZoom(parent) {
    const button=document.createElement("button");
    parent.appendChild(button);
    button.type="button";
    button.className="btn btn-warning btn-sm bi-zoom-out mt-1 me-2 mb-2";
    button.innerHTML=" "+language.distributions.infoDiagramResetZoom;
    button.onclick=()=>this.chart.resetZoom();
  }

  /**
   * Adds a show table button
   * @param {Object} parent Parent element
   */
  _addShowTableButton(parent) {
    const button=document.createElement("button");
    parent.appendChild(button);
    button.type="button";
    button.className="btn btn-primary btn-sm bi-table mt-1 me-2 mb-2";
    button.innerHTML=" "+language.distributions.infoDiagramShowValues;
    let distShortName=this.constructor.name;
    distShortName=distShortName.substring(0,distShortName.length-"Distribution".length);
    button.onclick=()=>{
      const params=[];
      for (let key in this._currentParameterValues) params.push(key+"="+this._currentParameterValues[key]);
      let searchString="?distribution="+distShortName;
      if (params.length>0) searchString+="&"+params.join("&");
      this._openWindow(language.distributions.infoDiagramShowValuesFile+searchString);
    }
  }

  /**
   * Adds a export diagram button
   * @param {Object} parent Parent element
   */
  _addExportDiagramButton(parent) {
    const that=this;
    let button;

    const div=document.createElement("div");
    div.className="dropdown";
    div.style.display="inline-block";
    parent.appendChild(div);
    div.appendChild(button=document.createElement("button"));
    button.type="button";
    button.className="btn btn-primary btn-sm bi-graph-up mt-1 me-2 mb-2 dropdown-toggle";
    button.dataset.bsToggle="dropdown";
    button.innerHTML=" "+language.distributions.infoDiagramExport;
    const ul=document.createElement("ul");
    ul.className="dropdown-menu";
    div.appendChild(ul);
    let li;
    ul.appendChild(li=document.createElement("li"));
    li.appendChild(button=document.createElement("button"));
    button.type="button";
    button.className="bi-clipboard dropdown-item";
    button.innerHTML=" "+language.distributions.infoDiagramExportCopy;
    button.onclick=()=>{
      if (typeof(ClipboardItem)!="undefined") {
        that.canvas.toBlob(blob=>navigator.clipboard.write([new ClipboardItem({"image/png": blob})]));
      } else {
        alert(language.distributions.infoDiagramExportCopyError);
      }
    };
    ul.appendChild(li=document.createElement("li"));
    li.appendChild(button=document.createElement("button"));
    button.type="button";
    button.className="bi-download dropdown-item";
    button.innerHTML=" "+language.distributions.infoDiagramExportSave;
    button.onclick=()=>{
      const element=document.createElement("a");
      element.href=that.canvas.toDataURL("image/png");
      element.download="diagram.png";
      element.click();
    };
  }

  /**
   * Adds a random numbers button
   */
  _addRandomNumbersButton() {
    let distShortName=this.constructor.name;
    distShortName=distShortName.substring(0,distShortName.length-"Distribution".length);

    const button=this._addButton("bi-123",language.distributions.infoDiagramGenerateRandomNumbers);
    button.onclick=()=>{
      const params=[];
      for (let key in this._currentParameterValues) params.push(key+"="+this._currentParameterValues[key]);
      let searchString="?distribution="+distShortName+"&random=1";
      if (params.length>0) searchString+="&"+params.join("&");
      this._openWindow(language.distributions.infoDiagramShowValuesFile+searchString);
    }
  }

  /**
   * Adds a law of large numbers button
   */
  _addLawOfLargeNumbersButton() {
    let distShortName=this.constructor.name;
    distShortName=distShortName.substring(0,distShortName.length-"Distribution".length);

    const button=this._addButton("bi-bar-chart",language.distributions.infoDiagramLawOfLargeNumbers);
    button.onclick=()=>{
      const params=[];
      for (let key in this._currentParameterValues) params.push(key+"="+this._currentParameterValues[key]);
      let searchString="?distribution="+distShortName;
      if (params.length>0) searchString+="&"+params.join("&");
      this._openWindow(language.distributions.infoDiagramSimFile+searchString);
    }
  }

  /* Adds a central limit theorem button */
  _addCentralLimitTheoremButton() {
    let distShortName=this.constructor.name;
    distShortName=distShortName.substring(0,distShortName.length-"Distribution".length);

    const button=this._addButton("bi-plus-lg",language.distributions.infoDiagramCentralLimitTheorem);
    button.onclick=()=>{
      const params=[];
      for (let key in this._currentParameterValues) params.push(key+"="+this._currentParameterValues[key]);
      let searchString="?distribution="+distShortName+"&mode=1";
      if (params.length>0) searchString+="&"+params.join("&");
      this._openWindow(language.distributions.infoDiagramSimFile+searchString);
    }
  }

  /**
   * Adds buttons below diagram.
   */
  _initButtons() {
    /* Show E[X] in diagram */
    this._addShowE(this.canvasInfo);

    /* Show E[X]+-Std[X] in diagram */
    this._addShowStd(this.canvasInfo);

    /* Show median in diagram */
    this._addShowMedian(this.canvasInfo);

    this.canvasInfo.appendChild(document.createElement("br"));

    this._addRangeSetup(this.canvasInfo);

    this.canvasInfo.appendChild(document.createElement("br"));

    /* Reset zoom */
    this._addResetZoom(this.canvasInfo);

    /* Show table */
    this._addShowTableButton(this.canvasInfo);

    /* Export diagram */
    this._addExportDiagramButton(this.canvasInfo);

    /* Random numbers */
    this._addRandomNumbersButton();

    /* Law of large numbers */
    this._addLawOfLargeNumbersButton();

    /* Central limit theorem */
    this._addCentralLimitTheoremButton();
  }

  /**
   * Returns distribution parameters to fit the input values.
   * @param {Object} data Fitting input values
   * @returns Distribution parameters object or null if no fit could be calculated for the given input values
   */
  fitParameters(data) {
    return null;
  }

  /**
   * Returns the information if this distribution is in general useable for distribution fitting.
   * @returns Can this distribution used for fitting?
   */
  get canFit() {
    return false;
  }
}



/**
 * Abstract base class for all discrete probability distribution classes
 */
class DiscreteProbabilityDistribution extends ProbabilityDistribution {
  #chartOptions;
  #diagramXValues;
  #mean;
  #variance;
  #median;

  /**
   * Constructor
   * @param {string} name Name of the probability distribution
   * @param {string} nameWithFormat Name with optional html formating (optional; normal name will be used if missing)
   */
  constructor(name, nameWithFormat=null) {
    super(name,false,nameWithFormat);

    this.#chartOptions={
      scales: {
        x: {
          title: {display: true, text: "k"},
          ticks: {callback: (value, index, ticks)=>formatNumber(this.#diagramXValues[index])} /* for some unknown reasons value and index returning the same number, so we have to get the actual value from the original array */
        },
        y : {
          title: {display: true, text: language.distributions.infoDiagramProbability},
          min: 0,
          max: 1,
          ticks: {callback: value=>formatPercent(value)}
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
              modifierKey: "ctrl",
            },
            pinch: {
              enabled: true
            },
            drag: {
              enabled: true,
              modifierKey: "ctrl",
            },
            mode: 'xy',
          }
        },
        tooltip: {
          callbacks: {
              label: function(context) {
                  let label=context.dataset.label || '';
                  if (label) label+=': ';
                  if (context.parsed.y!==null) label+=formatNumber(context.parsed.y,5);
                  return label;
              }
          }
        }
      },
      animation: {duration: 0}
    };
  }

  /**
   * Outputs the characteristics of a discrete probability distribution
   * @param {String} meanFormula Expected value formula to be displayed
   * @param {Number} meanValue Expected value to be displayed (null if no value is to be output)
   * @param {String} varianceFormula Variance formula to be displayed
   * @param {Number} varianceValue Variance to be displayed (null if no value is to be output)
   * @param {String} medianFormula Median formula to be displayed (optional, defaults to null)
   * @param {Number} medianValue Median to be displayed (null if no value is to be output) (optional, defaults to null)
   * @param {String} modeFormula Mode formula to be displayed (optional, defaults to null)
   * @param {Number} modeValue Median to be displayed (null if no value is to be output) (optional, defaults to null)
   */
  _setDiscreteCharacteristics(meanFormula, meanValue, varianceFormula, varianceValue, medianFormula=null, medianValue=null, modeFormula=null, modeValue=null) {
    this.#mean=meanValue;
    this.#variance=varianceValue;
    this.#median=medianValue;

    const nameE="<a href='https://de.wikipedia.org/wiki/Erwartungswert' title='"+language.distributions.infoCharacteristicsWikipedia+"' target='_blank'>"+language.distributions.infoCharacteristicsE+"</a>";
    const nameVar="<a href='https://de.wikipedia.org/wiki/Varianz' title='"+language.distributions.infoCharacteristicsWikipedia+"' target='_blank'>"+language.distributions.infoCharacteristicsVar+"</a>";
    const nameStd="<a href='https://de.wikipedia.org/wiki/Standardabweichung' title='"+language.distributions.infoCharacteristicsWikipedia+"' target='_blank'>"+language.distributions.infoCharacteristicsStd+"</a>";
    const nameCV="<a href='https://de.wikipedia.org/wiki/Variationskoeffizient' title='"+language.distributions.infoCharacteristicsWikipedia+"' target='_blank'>"+language.distributions.infoCharacteristicsCV+"</a>";
    const nameSCV="<a href='https://de.wikipedia.org/wiki/Variationskoeffizient#Quadrierter_Variationskoeffizient_f%C3%BCr_eine_Zufallsvariable' title='"+language.distributions.infoCharacteristicsWikipedia+"' target='_blank'>"+language.distributions.infoCharacteristicsSCV+"</a>";
    const nameMedian="<a href='https://de.wikipedia.org/wiki/Median_(Stochastik)' title='"+language.distributions.infoCharacteristicsWikipedia+"' target='_blank'>"+language.distributions.infoCharacteristicsMedian+"</a>";
    const nameMode="<a href='https://de.wikipedia.org/wiki/Modus_(Stochastik)' title='"+language.distributions.infoCharacteristicsWikipedia+"' target='_blank'>"+language.distributions.infoCharacteristicsMode+"</a>";

    const X=variable("X");
    const exprE=beginMathML+defE("E",X,false)+endMathML;
    const exprVar=beginMathML+defE("Var",X,false)+endMathML;
    const exprStd=beginMathML+defE("Std",X,false)+endMathML;
    const exprCV=beginMathML+defE("CV",X,false)+endMathML;
    const exprSCV=beginMathML+defE("SCV",X,false)+endMathML;
    const exprMedian=beginMathML+"<mover><mi>x</mi><mi>~</mi></mover>"+endMathML;
    const exprMode=beginMathML+"<msub>"+variable("x")+variable("mod")+"</msub>"+endMathML;

    const lines=[];
    if (meanValue!==null) {
      lines.push([nameE+"&nbsp;",exprE,"=",meanFormula,"&approx;",formatNumberWithTitle(meanValue)]);
    }
    if (varianceValue!==null) {
      lines.push([nameVar+"&nbsp;",exprVar,"=",varianceFormula,"&approx;",formatNumberWithTitle(varianceValue)]);
      lines.push([nameStd+"&nbsp;",exprStd,"=",beginMathML+"<msqrt><mi mathvariant='normal'>Var</mi><mo>[</mo>"+X+"<mo>]</mo></msqrt>"+endMathML,"&approx;",formatNumberWithTitle(Math.sqrt(varianceValue))]);
    }
    if (meanValue!==null && varianceValue!==null && meanValue>0 && isFinite(varianceValue) && isFinite(meanValue)) {
      const scv=varianceValue/(meanValue**2);
      lines.push([nameCV+"&nbsp;",exprCV,"=",beginMathML+frac(defE("Std",X,false),"<mo>|</mo>"+defE("E",X,false)+"<mo>|</mo>")+endMathML,"&approx;",formatNumberWithTitle(Math.sqrt(scv))]);
      lines.push([nameSCV+"&nbsp;",exprSCV,"=",beginMathML+frac(defE("Var",X,false),"<msup><mrow>"+defE("E",X,false)+"</mrow><mn>2</mn>")+endMathML,"&approx;",formatNumberWithTitle(scv)]);
    }
    if (medianValue!==null) {
      lines.push([nameMedian+"&nbsp;",exprMedian,"=",medianFormula,"&approx;",formatNumberWithTitle(medianValue)]);
    }
    if (modeValue!==null) {
      lines.push([nameMode+"&nbsp;",exprMode,"=",modeFormula,"&approx;",formatNumberWithTitle(modeValue)]);
    }

    const heading="<caption class='visually-hidden'>Characteristics</caption><tr class='visually-hidden'><th class='pb-3' scope='col'>"+language.distributions.infoCharacteristic+"</th><th class='pb-3' scope='col'>"+language.distributions.infoCharacteristicSymbol+"</th><th class='pb-3' scope='col'>-</th><th class='pb-3' scope='col'>"+language.distributions.infoCharacteristicFormula+"</th><th class='pb-3' scope='col'>-</th><th class='pb-3' scope='col'>"+language.distributions.infoCharacteristicValue+"</th></tr>";
    this.characteristics="<table>"+heading+lines.map(line=>"<tr><td class='pb-3'>"+line.join("</td><td class='pb-3'>")+"</td></tr>").join("\n")+"</table>";
  }

  /**
   * Sets the pdf values to be displayed as pdf and cdf in the diagram
   * @param {Object} pdf Array of tuples (x, p) of the pdf values for the diagram
   */
  _updateDiscreteDiagram() {
    if (!this.canvasInfo) return;

    /* Init buttons on first call */
    if (this.canvasInfo && this.canvasInfo.children.length==0) this._initButtons();

    const values=this._currentParameterValues;

    /* Get min and max X */
    let minX, maxX, paddingX;
    const range=this._getRange();
    if (range!=null) {
      [minX, maxX]=range;
      paddingX=0;
    } else {
      [minX, maxX]=this.getDiscreteSupport(values,false);
      if (isNaN(maxX) || maxX>1000) maxX=1000;
      paddingX=Math.min(10,Math.max(3,Math.round((maxX-minX)/10)));
    }
    this._setRangeInput(minX-paddingX,maxX+paddingX);

    /* Build PDF and CDF data sets */
    const dataPDF=[];
    const dataCDF=[];
    const dataX=[];
    let sum=0;
    this.#diagramXValues=[];
    const support=this.getDiscreteSupport(values);
    for (let x=minX-paddingX;x<=maxX+paddingX;x++) {
      const p=(x<minX || x>maxX || x<support[0] || x>support[1])?0:this.calcProbability(values,x);
      sum=Math.min(1,sum+p);
      dataX.push("k="+x);
      this.#diagramXValues.push(x);
      dataPDF.push(p);
      dataCDF.push(sum);
    }

    /* Draw diagram */
    this.#chartOptions.plugins.annotation={};
    this.#chartOptions.plugins.annotation.annotations={};
    if (isFinite(this.#mean) && this.#mean>=minX && this.#mean<=maxX) {
      if (this._checkBoxMean && this._checkBoxMean.checked) {
        const x=this.#mean+minX+paddingX;
        this.#chartOptions.plugins.annotation.annotations.line1={type: 'line', xMin: x, xMax: x, borderColor: 'blue', borderWidth: 2, label: {content: "E[X]", display: true, position: "end", rotation: -90, backgroundColor: 'rgba(0,0,255,0.7)', padding: 2}};
      }
      if (this._checkBoxStd && this._checkBoxStd.checked) {
        if (isFinite(this.#variance) && this.#mean-Math.sqrt(this.#variance)>=minX) {
          const x=this.#mean-Math.sqrt(this.#variance)+minX+paddingX;
          this.#chartOptions.plugins.annotation.annotations.line2={type: 'line', xMin: x, xMax: x, borderColor: 'blue', borderDash: [5,5], borderWidth: 2, label: {content: "E[X]-Std[X]", display: true, position: "end", rotation: -90, backgroundColor: 'rgba(0,0,255,0.7)', padding: 2}};
        }
        if (isFinite(this.#variance) && this.#mean+Math.sqrt(this.#variance)<=maxX) {
          const x=this.#mean+Math.sqrt(this.#variance)+minX+paddingX;
          this.#chartOptions.plugins.annotation.annotations.line3={type: 'line', xMin: x, xMax: x, borderColor: 'blue', borderDash: [5,5], borderWidth: 2, label: {content: "E[X]+Std[X]", display: true, position: "end", rotation: -90, backgroundColor: 'rgba(0,0,255,0.7)', padding: 2}};
        }
      }
    }
    if (isFinite(this.#median) && this.#median>=minX && this.#median<=maxX && this._checkBoxMedian && this._checkBoxMedian.checked) {
      const x=this.#median+minX+paddingX;
      this.#chartOptions.plugins.annotation.annotations.line1={type: 'line', xMin: x, xMax: x, borderColor: 'blue', borderDash: [5,5], borderWidth: 2, label: {content: language.distributions.infoCharacteristicsMedian, display: true, position: "end", rotation: -90, backgroundColor: 'rgba(0,0,255,0.7)', padding: 2}};
    }
    this._drawChart({
      data: {
        labels: dataX,
        datasets: [
          {label: language.distributions.infoDiagramPDFDiscrete, data: dataPDF, type: "bar", hitRadius: 25, borderColor: "rgb(0,140,79)", borderWidth: 2, backgroundColor: "rgb(0,140,79,0.75)"},
          {label: language.distributions.infoDiagramCDF, fill: true, data: dataCDF, type: "line", hitRadius: 25, borderColor: "rgb(140,28,0)", backgroundColor: "rgba(140,28,0,0.05)"}
        ]
      },
      options: this.#chartOptions
    });
  }

  /**
   * Opens a new window either in browser or in desktop app.
   * @param {String} url URL for new window
   */
  _openWindow(url) {
    if (isDesktopApp) {
      /* Search strings (parts after "?" or "#") are not supported in Neutralino.js :( */
      /* Neutralino.window.create(url); */
      window.open(url);
    } else {
      window.open(url);
    }
  }

  /**
   * Starts calculating the probability for a specific value.
   * @param {Object} parameterValues Object containing the values for the parameter ids
   * @param {Number} value Value to calculate the probability for
   */
  _calcValues(parameterValues, value) {
    const support=this.getDiscreteSupport(parameterValues,true);

    const k=variable("k");
    const X=variable("X");

    const lines=[];

    let p;

    /* P(X=k) */
    p=0;
    if (value>=support[0] && value<=support[1]) p=this.calcProbability(parameterValues,value);
    lines.push([beginMathML+defP(X+equals+k,false)+endMathML,"&approx;",formatNumberWithTitle(p,5)]);

    /* P(X<=k) */
    p=0;
    for (let i=support[0];i<=Math.min(support[1],value);i++) p+=this.calcProbability(parameterValues,i);
    lines.push([beginMathML+defP(X+"<mo>&le;</mo>"+k,false)+endMathML,"&approx;",formatNumberWithTitle(p,5)]);

    /* P(X>=k) */
    p=0;
    for (let i=support[0];i<=Math.min(support[1],value-1);i++) p+=this.calcProbability(parameterValues,i);
    lines.push([beginMathML+defP(X+"<mo>&ge;</mo>"+k,false)+endMathML,"&approx;",formatNumberWithTitle(1-p,5)]);

    this.calcValues.innerHTML="<table>"+lines.map(line=>"<tr><td class='pb-3'>"+line.join("</td><td class='pb-3'>")+"</td></tr>").join("\n")+"</table>";
  }

  /**
   * Gets the net support.
   * @param {Object} values Object containing the values for the parameter ids
   * @param {Boolean} forHistogram Get support for diagrams (false) or for calculations and histograms (true)
   * @returns 2 element array containing the minimum and the maximum value for which P(X=k)>0
   */
  getDiscreteSupport(values, forHistogram) {
    return [0,100];
  }

  /**
   * Get the support to be used when generating random numbers.
   * @param {Object} values Object containing the values for the parameter ids
   * @returns 2 element array containing the minimum and the maximum value for which P(X=k)>0
   */
  getRandomNumbersSupport(values) {
    return this.getDiscreteSupport(values,true);
  }

  /**
   * Calculates P(X=k).
   * @param {Objekt} values Object containing the values for the parameter ids
   * @param {Number} k Value k in P(X=k)
   * @returns Returns P(X=k)
   */
  calcProbability(values, k) {
    return 0;
  }

  /**
   * Mean value as set by _setDiscreteCharacteristics
   */
  get mean() {
    return this.#mean;
  }

  /**
   * Variance value as set by _setDiscreteCharacteristics
   */
  get variance() {
    return this.#variance;
  }
}



/**
 * Abstract base class for all continuous probability distribution classes
 */
class ContinuousProbabilityDistribution extends ProbabilityDistribution {
  #diagramMinX;
  #diagramMaxX;
  #chartOptions;
  #diagramXValues;
  #mean;
  #variance;
  #median;

  /**
   * Constructor
   * @param {string} name Name of the probability distribution
   * @param {string} nameWithFormat Name with optional html formating (optional; normal name will be used if missing)
   */
  constructor(name, nameWithFormat=null) {
    super(name,true,nameWithFormat);

    this.#chartOptions={
      scales: {
        x: {
          title: {display: true, text: "x"},
          ticks: {callback: (value, index, ticks)=>formatNumber(this.#diagramXValues[index])} /* for some unknown reasons value and index returning the same number, so we have to get the actual value from the original array */
        },
        y : {
          title: {display: true, text: language.distributions.infoDiagramRate+" f(x)", color: "rgb(0,140,79)"},
          min: 0
        },
        y2 : {
          position: 'right',
          title: {display: true, text: language.distributions.infoDiagramProbability+" F(x)", color: "rgb(140,28,0)"},
          min: 0,
          max: 1,
          ticks: {callback: value=>formatPercent(value)}
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom'
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
              modifierKey: "ctrl",
            },
            pinch: {
              enabled: true
            },
            drag: {
              enabled: true,
              modifierKey: "ctrl",
            },
            mode: 'xy',
          }
        },
        tooltip: {
          callbacks: {
              label: function(context) {
                  let label=context.dataset.label || '';
                  if (label) label+=': ';
                  if (context.parsed.y!==null) label+=formatNumber(context.parsed.y,5);
                  return label;
              }
          }
        }
      },
      animation: {duration: 0}
    };
  }

  /**
   * Outputs the characteristics of a continuous probability distribution
   * @param {String} meanFormula Expected value formula to be displayed
   * @param {Number} meanValue Expected value to be displayed (null if no value is to be output)
   * @param {String} varianceFormula Variance formula to be displayed
   * @param {Number} varianceValue Variance to be displayed (null if no value is to be output)
   * @param {String} medianFormula Median formula to be displayed (optional, defaults to null)
   * @param {Number} medianValue Median to be displayed (null if no value is to be output) (optional, defaults to null)
   * @param {String} modeFormula Mode formula to be displayed (optional, defaults to null)
   * @param {Number} modeValue Median to be displayed (null if no value is to be output) (optional, defaults to null)
   * @param {Object} infoLines Optional array of additional lines. Each line is an array of 6 strings (optional, defaults to null).
   */
  _setContinuousCharacteristics(meanFormula, meanValue, varianceFormula, varianceValue, medianFormula=null, medianValue=null, modeFormula=null, modeValue=null, infoLines=null) {
    this.#mean=meanValue;
    this.#variance=varianceValue;
    this.#median=medianValue;

    const nameE="<a href='https://de.wikipedia.org/wiki/Erwartungswert' title='"+language.distributions.infoCharacteristicsWikipedia+"' target='_blank'>"+language.distributions.infoCharacteristicsE+"</a>";
    const nameVar="<a href='https://de.wikipedia.org/wiki/Varianz' title='"+language.distributions.infoCharacteristicsWikipedia+"' target='_blank'>"+language.distributions.infoCharacteristicsVar+"</a>";
    const nameStd="<a href='https://de.wikipedia.org/wiki/Standardabweichung' title='"+language.distributions.infoCharacteristicsWikipedia+"' target='_blank'>"+language.distributions.infoCharacteristicsStd+"</a>";
    const nameCV="<a href='https://de.wikipedia.org/wiki/Variationskoeffizient' title='"+language.distributions.infoCharacteristicsWikipedia+"' target='_blank'>"+language.distributions.infoCharacteristicsCV+"</a>";
    const nameSCV="<a href='https://de.wikipedia.org/wiki/Variationskoeffizient#Quadrierter_Variationskoeffizient_f%C3%BCr_eine_Zufallsvariable' title='"+language.distributions.infoCharacteristicsWikipedia+"' target='_blank'>"+language.distributions.infoCharacteristicsSCV+"</a>";
    const nameMedian="<a href='https://de.wikipedia.org/wiki/Median_(Stochastik)' title='"+language.distributions.infoCharacteristicsWikipedia+"' target='_blank'>"+language.distributions.infoCharacteristicsMedian+"</a>";
    const nameMode="<a href='https://de.wikipedia.org/wiki/Modus_(Stochastik)' title='"+language.distributions.infoCharacteristicsWikipedia+"' target='_blank'>"+language.distributions.infoCharacteristicsMode+"</a>";

    const X=variable("X");
    const exprE=beginMathML+defE("E",X,false)+endMathML;
    const exprVar=beginMathML+defE("Var",X,false)+endMathML;
    const exprStd=beginMathML+defE("Std",X,false)+endMathML;
    const exprCV=beginMathML+defE("CV",X,false)+endMathML;
    const exprSCV=beginMathML+defE("SCV",X,false)+endMathML;
    const exprMedian=beginMathML+"<mover><mi>x</mi><mi>~</mi></mover>"+endMathML;
    const exprMode=beginMathML+"<msub>"+variable("x")+variable("mod")+"</msub>"+endMathML;

    const lines=[];
    if (infoLines!=null) infoLines.forEach(line=>lines.push(line));
    if (meanValue!==null) {
      lines.push([nameE+"&nbsp;",exprE,"=",meanFormula,"&approx;",formatNumberWithTitle(meanValue)]);
    }
    if (varianceValue!==null) {
      lines.push([nameVar+"&nbsp;",exprVar,"=",varianceFormula,"&approx;",formatNumberWithTitle(varianceValue)]);
      lines.push([nameStd+"&nbsp;",exprStd,"=",beginMathML+"<msqrt><mi mathvariant='normal'>Var</mi><mo>[</mo>"+X+"<mo>]</mo></msqrt>"+endMathML,"&approx;",formatNumberWithTitle(Math.sqrt(varianceValue))]);
    }
    if (meanValue!==null && varianceValue!==null && meanValue>0 && isFinite(varianceValue) && isFinite(meanValue)) {
      const scv=varianceValue/(meanValue**2);
      lines.push([nameCV+"&nbsp;",exprCV,"=",beginMathML+frac(defE("Std",X,false),"<mo>|</mo>"+defE("E",X,false)+"<mo>|</mo>")+endMathML,"&approx;",formatNumberWithTitle(Math.sqrt(scv))]);
      lines.push([nameSCV+"&nbsp;",exprSCV,"=",beginMathML+frac(defE("Var",X,false),"<msup><mrow>"+defE("E",X,false)+"</mrow><mn>2</mn>")+endMathML,"&approx;",formatNumberWithTitle(scv)]);
    }
    if (medianValue!==null) {
      lines.push([nameMedian+"&nbsp;",exprMedian,"=",medianFormula,"&approx;",formatNumberWithTitle(medianValue)]);
    }
    if (modeValue!==null) {
      lines.push([nameMode+"&nbsp;",exprMode,"=",modeFormula,"&approx;",formatNumberWithTitle(modeValue)]);
    }

    const heading="<caption class='visually-hidden'>Characteristics</caption><tr class='visually-hidden'><th class='pb-3' scope='col'>"+language.distributions.infoCharacteristic+"</th><th class='pb-3' scope='col'>"+language.distributions.infoCharacteristicSymbol+"</th><th class='pb-3' scope='col'>-</th><th class='pb-3' scope='col'>"+language.distributions.infoCharacteristicFormula+"</th><th class='pb-3' scope='col'>-</th><th class='pb-3' scope='col'>"+language.distributions.infoCharacteristicValue+"</th></tr>";
    this.characteristics="<table>"+heading+lines.map(line=>"<tr><td class='pb-3'>"+line.join("</td><td class='pb-3'>")+"</td></tr>").join("\n")+"</table>";
  }

  /**
   * Sets the pdf and cdf values to be displayed in the diagram
   * @param {Number} minX Minimum x value
   * @param {Number} minY Maximum x value
   * @param {Function} pdfCallback  Callback for getting an individual pdf value
   * @param {Function} cdfCallback  Callback for getting an individual cdf value
   */
  _setContinuousDiagram(minX, maxX, pdfCallback, cdfCallback) {
    if (!this.canvasInfo) return;

    /* Init buttons on first call */
    if (this.canvasInfo && this.canvasInfo.children.length==0) this._initButtons();

    const range=this._getRange();
    if (range!=null) {
      [minX, maxX]=range;
    }
    this._setRangeInput(minX,maxX);

    this.#diagramMinX=minX;
    this.#diagramMaxX=maxX;

    /* Build PDF and CDF data sets */
    const steps=500;
    const step=(maxX-minX)/steps;
    const dataPDF=[];
    const dataCDF=[];
    const dataX=[];
    this.#diagramXValues=[];
    for (let x=minX;x<=maxX;x+=step) {
      dataPDF.push(pdfCallback(x));
      dataCDF.push(cdfCallback(x));
      dataX.push("x="+formatNumber(x));
      this.#diagramXValues.push(x);
    }

    /* Draw diagram */
    this.#chartOptions.plugins.annotation={};
    this.#chartOptions.plugins.annotation.annotations={};
    if (isFinite(this.#mean) && this.#mean>=minX && this.#mean<=maxX) {
      if (this._checkBoxMean && this._checkBoxMean.checked) {
        const x=(this.#mean-minX)/(maxX-minX)*steps;
        this.#chartOptions.plugins.annotation.annotations.line1={type: 'line', xMin: x, xMax: x, borderColor: 'blue', borderWidth: 2, label: {content: "E[X]", display: true, position: "end", rotation: -90, backgroundColor: 'rgba(0,0,255,0.7)', padding: 2}};
      }
      if (this._checkBoxStd && this._checkBoxStd.checked) {
        if (isFinite(this.#variance) && this.#mean-Math.sqrt(this.#variance)>=minX) {
          const x=(this.#mean-Math.sqrt(this.#variance)-minX)/(maxX-minX)*steps;
          this.#chartOptions.plugins.annotation.annotations.line2={type: 'line', xMin: x, xMax: x, borderColor: 'blue', borderDash: [5,5], borderWidth: 2, label: {content: "E[X]-Std[X]", display: true, position: "end", rotation: -90, backgroundColor: 'rgba(0,0,255,0.7)', padding: 2}};
        }
        if (isFinite(this.#variance) && this.#mean+Math.sqrt(this.#variance)<=maxX) {
          const x=(this.#mean+Math.sqrt(this.#variance)-minX)/(maxX-minX)*steps;
          this.#chartOptions.plugins.annotation.annotations.line3={type: 'line', xMin: x, xMax: x, borderColor: 'blue', borderDash: [5,5], borderWidth: 2, label: {content: "E[X]+Std[X]", display: true, position: "end", rotation: -90, backgroundColor: 'rgba(0,0,255,0.7)', padding: 2}};
        }
      }
    }
    if (isFinite(this.#median) && this.#median>=minX && this.#median<=maxX && this._checkBoxMedian && this._checkBoxMedian.checked) {
      const x=(this.#median-minX)/(maxX-minX)*steps;
      this.#chartOptions.plugins.annotation.annotations.line4={type: 'line', xMin: x, xMax: x, borderColor: 'blue', borderDash: [2,2], borderWidth: 2, label: {content: language.distributions.infoCharacteristicsMedian, display: true, position: "end", rotation: -90, backgroundColor: 'rgba(0,0,255,0.7)', padding: 2}};
    }
    this._drawChart({
      data: {
        labels: dataX,
        datasets: [
          {label: language.distributions.infoDiagramPDFContinuous, data: dataPDF, pointRadius: 0, hitRadius: 25, fill: true, type: "line", borderColor: "rgb(0,140,79)", borderWidth: 2, backgroundColor: "rgb(0,140,79,0.25)", yAxisID: 'y'},
          {label: language.distributions.infoDiagramCDF, data: dataCDF, pointRadius: 0, hitRadius: 25, type: "line", borderColor: "rgb(140,28,0)", borderWidth: 2, yAxisID: 'y2'}
        ]
      },
      options: this.#chartOptions
    });
  }

  /**
   * Opens a new window either in browser or in desktop app.
   * @param {String} url URL for new window
   */
  _openWindow(url) {
    if (isDesktopApp) {
      /* Search strings (parts after "?" or "#") are not supported in Neutralino.js :( */
      /* Neutralino.window.create(url); */
      window.open(url);
    } else {
      window.open(url);
    }
  }

  /**
   * Starts calculating the probability for a specific value.
   * @param {Object} parameterValues Object containing the values for the parameter ids
   * @param {Number} value Value to calculate the probability for
   */
  _calcValues(parameterValues, value) {
    const f=variable("f");
    const F=variable("F");
    const X=variable("X");
    const x=variable("x");

    const lines=[];

    let p,c;
    [p,c]=this.calcProbability(parameterValues,value);

    /* f(x) */
    lines.push([beginMathML+defF(f,x,false)+endMathML,"&approx;",formatNumberWithTitle(p,5)]);

    /* P(X<=x)=F(x) */
    lines.push([beginMathML+defP(X+"<mo>&le;</mo>"+x)+defF(F,x,false)+endMathML,"&approx;",formatNumberWithTitle(c,5)]);

    /* P(X>k)=1-F(x) */
    lines.push([beginMathML+defP(X+"<mo>&gt;</mo>"+x)+"<mn>1</mn>"+minus+defF(F,x,false)+endMathML,"&approx;",formatNumberWithTitle(1-c,5)]);

    this.calcValues.innerHTML="<table>"+lines.map(line=>"<tr><td class='pb-3'>"+line.join("</td><td class='pb-3'>")+"</td></tr>").join("\n")+"</table>";
  }

  /**
   * Calculates f(x) and F(x).
   * @param {Objekt} values Object containing the values for the parameter ids
   * @param {Number} x Value x in f(x) and F(x)
   * @returns 2 element array containing f(x) and F(x)
   */
  calcProbability(values, x) {
    return [0,0];
  }

  /**
   * Generates a pseudo random number for the distribution
   * @param {Objekt} values Object containing the values for the parameter ids
   * @returns Pseudo random number
   */
  getRandomNumber(values) {
    const limits=10_000_000;
    let a=-limits;
    let b=limits;

    let u=Math.random();
    if (this.calcProbability(values,a)[1]>u) return a;
    if (this.calcProbability(values,b)[1]<u) return b;
    while (b-a>0.001) {
      const m=(a+b)/2;
      const value=this.calcProbability(values,m)[1];
      if (value>u) b=m; else a=m;
    }

    return (a+b)/2;
  }

  /**
   * Mean value as set by _setContinuousCharacteristics
   */
  get mean() {
    return this.#mean;
  }

  /**
   * Variance value as set by _setContinuousCharacteristics
   */
  get variance() {
    return this.#variance;
  }

  /**
   * Gets the support used by the diagram.
   * @returns 2 element array containing the minimum and the maximum x value in the diagram
   */
  getDiagramSupport() {
    return [this.#diagramMinX,this.#diagramMaxX];
  }
}



/**
 * Returns the default CDF for discrete probability distributions as MathML string
 * @returns Default CDF for discrete probability distributions
 */
function getDiscreteDefaultCDF() {
  const k=variable("k");
  const m=variable("m");
  const X=variable("X");

  let cdf="";
  cdf+=beginMathML;
  cdf+=defP(X+"<mo>&le;</mo>"+m);
  cdf+="<munderover>";
  cdf+="<mo>&sum;</mo>";
  cdf+="<mrow>"+k+equals+"<mn>0</mn></mrow>";
  cdf+="<mrow>"+m+"</mrow>";
  cdf+="</munderover>";
  cdf+=defP(X+equals+k,false);
  cdf+=endMathML;
  return cdf;
}



/**
 * Returns the default CDF for continuous probability distributions as MathML string
 * @returns Default CDF for continuous probability distributions
 */
function getContinousDefaultCDF() {
    const F=variable("F");
    const f=variable("f");
    const t=variable("t");
    const x=variable("x");

    let cdf="";
    cdf+=beginMathML;
    cdf+=defF(F,x);
    cdf+="<msubsup><mo>&int;</mo><mrow>"+minus+"<mi>&infin;</mi></mrow>"+x+"</msubsup>";
    cdf+=defF(f,t,false)+"<mo>dt</mo>";
    cdf+=endMathML;
    cdf+=" "+language.distributions.for+" ";
    cdf+=beginMathML;
    cdf+=x+"<mo>&isin;</mo>"+setR;
    cdf+=endMathML;
    return cdf;
  }