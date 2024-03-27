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

export {language};

let lang;

/* German */

const languageDE={};
lang=languageDE;

lang.GUI={};
lang.GUI.appName="Wahrscheinlichkeitsverteilungen";
lang.GUI.homeURL="warteschlangensimulation.de";
lang.GUI.imprint="Impressum";
lang.GUI.privacy="Datenschutz";
lang.GUI.privacyInfo1="Info";
lang.GUI.privacyInfo2="Alle Berechnungen laufen vollständig im Browser ab.<br>Diese Webapp führt nach dem Laden des HTML- und Skriptcodes keine weitere Kommunikation mit dem Server durch.";
lang.GUI.simulators="Simulatoren";
lang.GUI.selectDistribution="Wahrscheinlichkeitsverteilung";
lang.GUI.switchLanguage="Switch to <b>English</b>";
lang.GUI.switchLanguageHint="Switch to English";
lang.GUI.switchLanguageShort="English";
lang.GUI.switchLanguageMode='default';
lang.GUI.switchLanguageFile="index.html";
lang.GUI.tabColorMode="Farbmodus";
lang.GUI.tabColorModeLight="Hell";
lang.GUI.tabColorModeDark="Dunkel";
lang.GUI.tabColorModeSystemDefault="Systemvorgabe";
lang.GUI.downloadLabel="Diese Webapp steht auch als offline-nutzbare Windows-Anwendung zur Verfügung:";
lang.GUI.downloadButton="Windows-Anwendung (exe)";

lang.distributions={};
lang.distributions.typeDiscrete="diskret";
lang.distributions.typeDiscreteFull="Diskrete Wahrscheinlichkeitsverteilungen";
lang.distributions.typeContinuous="kontinuierlich";
lang.distributions.typeContinuousFull="Kontinuierliche Wahrscheinlichkeitsverteilungen";
lang.distributions.infoProperties="Eigenschaften";
lang.distributions.infoPropertiesName="Name";
lang.distributions.infoPropertiesType="Typ";
lang.distributions.infoPropertiesSupport="Träger";
lang.distributions.infoPropertiesWikipediaLink="Mehr Informationen in der Wikipedia";
lang.distributions.infoParameters="Parameter";
lang.distributions.infoNoParameters="Die Verteilung besitzt keine Parameter.";
lang.distributions.infoVisualizationDiscrete="Zähldichte und Verteilungsfunktion";
lang.distributions.infoVisualizationContinuous="Dichte und Verteilungsfunktion";
lang.distributions.infoCharacteristic="Kenngröße";
lang.distributions.infoCharacteristicSymbol="Symbol";
lang.distributions.infoCharacteristicFormula="Formel";
lang.distributions.infoCharacteristicValue="Wert";
lang.distributions.infoCharacteristics="Kenngrößen";
lang.distributions.infoCharacteristicsError="Bitte korrigieren Sie die Werte für die Verteilungsparameter. Dann werden hier die zugehörigen Kenngrößen ausgegeben.";
lang.distributions.infoCharacteristicsE="Erwartungswert";
lang.distributions.infoCharacteristicsVar="Varianz";
lang.distributions.infoCharacteristicsStd="Standardabweichung";
lang.distributions.infoCharacteristicsCV="Variationskoeffizient";
lang.distributions.infoCharacteristicsSCV="Quadrierter Variationskoeffizient";
lang.distributions.infoDiagramRate="Rate";
lang.distributions.infoDiagramProbability="Wahrscheinlichkeit";
lang.distributions.infoDiagramPDFDiscrete="Zähldichte";
lang.distributions.infoDiagramPDFContinuous="Dichte";
lang.distributions.infoDiagramCDF="Verteilungsfunktion";
lang.distributions.infoDiagramResetZoom="Standardzoom";
lang.distributions.infoDiagramZoomInfo="Mit gedrückter <span class='border rounded-1 ps-1 pe-1 bg-light'><tt>Strg</tt></span>-Taste kann per Mausrad gezoomt werden und es können Zoom-Rahmen aufgezogen werden.";
lang.distributions.infoDiagramShowValues="Tabelle";
lang.distributions.infoDiagramShowValuesFile="table_de.html";
lang.distributions.infoDiagramShowValuesStep="Schrittweite";
lang.distributions.infoDiagramCopyValues="Werte kopieren";
lang.distributions.infoDiagramSaveValues="Werte speichern";
lang.distributions.infoDiagramSaveValuesTextFiles="Textdateien";
lang.distributions.infoDiagramExport="Diagramm exportieren";
lang.distributions.infoDiagramExportCopy="Diagramm in die Zwischenablage kopieren";
lang.distributions.infoDiagramExportCopyError="Ihr Browser unterstützt das Kopieren von Bildern leider nicht.";
lang.distributions.infoDiagramExportSave="Diagramm als Grafik speichern";
lang.distributions.infoDiagramCloseWindow="Fenster schließen";
lang.distributions.infoDiagramCloseWindowShort="Schließen";
lang.distributions.infoDiagramGenerateRandomNumbers="Pseudozufallszahlen";
lang.distributions.infoDiagramGenerateRandomNumbersTitle="Pseudozufallszahlen";
lang.distributions.infoDiagramGenerateRandomNumbersCount="Erzeugte Pseudozufallszahlen";
lang.distributions.infoDiagramGenerateRandomNumbersMean="Mittelwert";
lang.distributions.infoDiagramGenerateRandomNumbersStd="Standardabweichung";
lang.distributions.infoDiagramGenerateRandomNumbersMin="Minimum";
lang.distributions.infoDiagramGenerateRandomNumbersMax="Maximum";
lang.distributions.infoDiagramGenerateRandomNumbersByDistribution="theoretischer Wert gemäß Verteilung";
lang.distributions.infoDiagramGenerateRandomNumbersGenerateNew="Neue Pseudozufallszahlen erzeugen";
lang.distributions.infoDiagramGenerateRandomNumbersGenerateNewShort="Neu";
lang.distributions.infoCalcParameter="Parameter";
lang.distributions.infoCalcValues="Werte berechnen";
lang.distributions.infoCalcValuesError="Bitte korrigieren Sie die Werte für die Verteilungsparameter. Dann werden können hier konkrete Wahrscheinlichkeiten berechnet werden.";
lang.distributions.PDFDiscrete="Zähldichte";
lang.distributions.PDFContinuous="Dichte";
lang.distributions.CDF="Verteilungsfunktion";
lang.distributions.for="für";
lang.distributions.with="mit";
lang.distributions.and="und";
lang.distributions.else="sonst";
lang.distributions.parameterErrorInt="Es muss eine Ganzzahl angegeben werden.";
lang.distributions.parameterErrorIntMin="Es muss eine Ganzzahl &ge; {0} angegeben werden.";
lang.distributions.parameterErrorIntMax="Es muss eine Ganzzahl &le; {0} angegeben werden.";
lang.distributions.parameterErrorIntMinMax="Es muss eine Ganzzahl vom Bereich von {0} bis {1} (jeweils einschließlich der Grenzen) angegeben werden.";
lang.distributions.parameterErrorFloat="Es muss eine Zahl angegeben werden.";
lang.distributions.parameterErrorFloatMinInclusive="Es muss eine Zahl &ge; {0} angegeben werden.";
lang.distributions.parameterErrorFloatMinExclusive="Es muss eine Zahl &gt; {0} angegeben werden.";
lang.distributions.parameterErrorFloatMaxInclusive="Es muss eine Zahl &le; {0} angegeben werden.";
lang.distributions.parameterErrorFloatMaxExclusive="Es muss eine Zahl &lt; {0} angegeben werden.";
lang.distributions.parameterErrorFloatMinMaxInclusiveInclusive="Es muss eine Zahl im Bereich von {0} bis {1} (jeweils inklusive der Grenzen) angegeben werden.";
lang.distributions.parameterErrorFloatMinMaxInclusiveExclusive="Es muss eine Zahl im Bereich von {0} (inklusive) bis {1} (exklusive) angegeben werden.";
lang.distributions.parameterErrorFloatMinMaxExclusiveInclusive="Es muss eine Zahl im Bereich von {0} (exklusive) bis {1} (inklusive) angegeben werden.";
lang.distributions.parameterErrorFloatMinMaxExclusiveExclusive="Es muss eine Zahl im Bereich von {0} bis {1} (jeweils exklusive der Grenzen) angegeben werden.";
lang.distributions.parameterValueDown="Wert verringern";
lang.distributions.parameterValueUp="Wert vergrößern";

lang.distributions.hypergeometric={};
lang.distributions.hypergeometric.name="Hypergeometrische Verteilung";
lang.distributions.hypergeometric.info="In einer Urne befinden sich insgesamt <b>N</b> Kugeln, <b>R</b> rote und <b>N-R</b> schwarze. Es werden ohne Zurücklegen <b>n</b> Kugeln gezogen. Die hypergeometrische Verteilung gibt dann an, mit welcher Wahrscheinlichkeit wie viele rote Kugeln in den <b>n</b> Kugeln enthalten sind.";
lang.distributions.hypergeometric.wikipedia="https://de.wikipedia.org/wiki/Hypergeometrische_Verteilung";
lang.distributions.hypergeometric.parameterInfoN="Anzahl an Kugeln in der Urne";
lang.distributions.hypergeometric.parameterInfoR="Anzahl an roten Kugeln in der Urne";
lang.distributions.hypergeometric.parameterInfoRError="Die Anzahl an roten Kugeln <i>R</i> kann nicht größer als die Gesamtanzahl an Kugeln <i>N</i> sein.";
lang.distributions.hypergeometric.parameterInfon="Anzahl an Kugeln, die ohne Zurücklegen gezogen werden";
lang.distributions.hypergeometric.parameterInfonError="Es können nicht mehr Kugeln ohne Zurücklegen gezogen werden (<i>n</i>), als insgesamt in der Urne enthalten sind (<i>N</i>).";

lang.distributions.binomial={};
lang.distributions.binomial.name="Binomialverteilung";
lang.distributions.binomial.info="In einer Urne befinden sich rote und schwarze Kugeln. Die Wahrscheinlichkeit beim einmaligen Ziehen eine rote Kugel zu erhalten, beträgt <b>p</b>. Aus der Urne werden <b>n</b> Kugeln gezogen. Nach dem Ziehen einer Kugel wird diese sofort wieder zurückgelegt. Die Binomialverteilung gibt dann an, mit welcher Wahrscheinlichkeit <b>k</b> mal eine rote Kugel gezogen wurde.";
lang.distributions.binomial.wikipedia="https://de.wikipedia.org/wiki/Binomialverteilung";
lang.distributions.binomial.parameterInfon="Anzahl an Kugeln, die mit Zurücklegen gezogen werden";
lang.distributions.binomial.parameterInfop="Anteil rote Kugeln";

lang.distributions.poisson={};
lang.distributions.poisson.name="Poisson-Verteilung";
lang.distributions.poisson.info="Mit der Poisson-Verteilung kann die Wahrscheinlichkeit, dass bis zu einem bestimmten Zeitpunkt <b>t</b> insgesamt <b>k</b> Ereignisse eingetreten sind, bestimmt werden, wenn die Ereignisse unabhängig mit einer konstanten Rate <b>&alpha;</b> eintreten. (Für den Verteilungsparameter gilt dann: &lambda;:=&alpha;&middot;<i>t</i>.)";
lang.distributions.poisson.wikipedia="https://de.wikipedia.org/wiki/Poisson-Verteilung";
lang.distributions.poisson.parameterInfolambda="Erwartungswert";

lang.distributions.geometric={};
lang.distributions.geometric.name="Geometrische Verteilung";
lang.distributions.geometric.info="Beträgt die Wahrscheinlichkeit für einen Erfolg bei einem wiederholt ausgeführten Experiment <b>p</b>, so gibt die geometrische Verteilung die Wahrscheinlichkeit dafür an, dass vor dem ersten Erfolg <b>k</b> Fehlversuche stattfanden.";
lang.distributions.geometric.wikipedia="https://de.wikipedia.org/wiki/Geometrische_Verteilung";
lang.distributions.geometric.parameterInfop="Wahrscheinlichkeit für einen Erfolg";

lang.distributions.discreteUniform={};
lang.distributions.discreteUniform.name="Diskrete Gleichverteilung";
lang.distributions.discreteUniform.info="Bei der diskreten Gleichverteilung wird die Wahrscheinlichkeitsmasse gleichmäßig auf eine Reihe von unmittelbar aufeinander folgende ganzzahlige Werte verteilt.";
lang.distributions.discreteUniform.wikipedia="https://de.wikipedia.org/wiki/Diskrete_Gleichverteilung";
lang.distributions.discreteUniform.parameterInfoa="Untere Bereichsgrenze";
lang.distributions.discreteUniform.parameterInfob="Obere Bereichsgrenze";
lang.distributions.discreteUniform.parameterInfobError="Die obere Bereichsgrenze <i>b</i> muss größer oder gleich der unteren Bereichsgrenze <i>a</i> sein.";

lang.distributions.negativeBinomial={};
lang.distributions.negativeBinomial.name="Negative Binomialverteilung";
lang.distributions.negativeBinomial.info="Die negative Binomialverteilung gibt Wahrscheinlichkeit für die Anzahl an Misserfolgen <b>k</b> an, die notwendig sind, um in einem Experiment, welches nur die Ausgänge \"Erfolg\" (Wahrscheinlichkeit <b>p</b>) und \"Misserfolg\" (Wahrscheinlichkeit <b>1-p</b>) besitzt, die vorgegebene Anzahl <b>r</b> an Erfolgen zu erzielen.";
lang.distributions.negativeBinomial.wikipedia="https://de.wikipedia.org/wiki/Negative_Binomialverteilung";
lang.distributions.negativeBinomial.parameterInfor="Anzahl Erfolge bis zum Abbruch";
lang.distributions.negativeBinomial.parameterInfop="Wahrscheinlichkeit für einen Erfolg";

lang.distributions.negativeHypergeometric={};
lang.distributions.negativeHypergeometric.name="Negative hypergeometrische Verteilung";
lang.distributions.negativeHypergeometric.info="In einer Urne befinden sich insgesamt <b>N</b> Kugeln, <b>R</b> rote und <b>N-R</b> schwarze. Es wird solange ohne Zurücklegen gezogen, bis rote <b>n</b> Kugeln gezogen wurden. Die negative hypergeometrische Verteilung gibt wie Wahrscheinlichkeit an, dafür <b>k</b> Kugeln ziehen zu müssen.";
lang.distributions.negativeHypergeometric.wikipedia="https://de.wikipedia.org/wiki/Negative_hypergeometrische_Verteilung";
lang.distributions.negativeHypergeometric.parameterInfoN="Anzahl an Kugeln in der Urne";
lang.distributions.negativeHypergeometric.parameterInfoR="Anzahl an roten Kugeln in der Urne";
lang.distributions.negativeHypergeometric.parameterInfoRError="Die Anzahl an roten Kugeln <i>R</i> kann nicht größer als die Gesamtanzahl an Kugeln <i>N</i> sein.";
lang.distributions.negativeHypergeometric.parameterInfon="Anzahl der roten Kugeln, die ohne Zurücklegen gezogen werden sollen";
lang.distributions.negativeHypergeometric.parameterInfonError="Es können nicht mehr rote Kugeln ohne Zurücklegen gezogen werden (<i>n</i>), als insgesamt in der Urne enthalten sind (<i>R</i>).";

lang.distributions.rademacher={};
lang.distributions.rademacher.name="Rademacherverteilung";
lang.distributions.rademacher.info="Die Rademacherverteilung wird u.a. zur Modellierung von einfachen Irrfahrten auf <abbr title='Ganze Zahlen &#x2124;=...,-3,-2,-1,0,1,2,3,...'>&#x2124;</abbr> verwendet.";
lang.distributions.rademacher.wikipedia="https://de.wikipedia.org/wiki/Rademacherverteilung";

lang.distributions.zeta={};
lang.distributions.zeta.name="Zeta-Verteilung";
lang.distributions.zeta.info="Die Zeta-Verteilung kommt u.a. im <a href='https://de.wikipedia.org/wiki/Zipfsches_Gesetz' target=_blank'>Zipfschen Gesetz</a> zur Anwendung.";
lang.distributions.zeta.wikipedia="https://de.wikipedia.org/wiki/Zeta-Verteilung";
lang.distributions.zeta.parameterInfos="Parameter der &zeta;-Funktion";

lang.distributions.uniform={};
lang.distributions.uniform.name="Gleichverteilung";
lang.distributions.uniform.info="Bei der Gleichverteilung ist die Wahrscheinlichkeit für alle Werte innerhalb eines bestimmten Bereichs identisch (und außerhalb dieses Bereich null).";
lang.distributions.uniform.wikipedia="https://de.wikipedia.org/wiki/Stetige_Gleichverteilung";
lang.distributions.uniform.parameterInfoa="Untere Bereichsgrenze";
lang.distributions.uniform.parameterInfob="Obere Bereichsgrenze";
lang.distributions.uniform.parameterInfobError="Die obere Bereichsgrenze <i>b</i> muss größer oder gleich der unteren Bereichsgrenze <i>a</i> sein.";

lang.distributions.exponential={};
lang.distributions.exponential.name="Exponentialverteilung";
lang.distributions.exponential.info="Die Exponentialverteilung ist aufgrund ihrer einfachen Struktur eine der am häufigsten eingesetzten Wahrscheinlichkeitsverteilung zur Beschreibung stochastischer Prozesse. Ihre wesentliche Eigenschaft ist die <b>Gedächtnislosigkeit</b>, welche sie z.B. für die Beschreibung von Abständen zwischen Kundenankünften besonders auszeichnet.";
lang.distributions.exponential.wikipedia="https://de.wikipedia.org/wiki/Exponentialverteilung";
lang.distributions.exponential.parameterInfoLambda="Skalenparameter";

lang.distributions.normal={};
lang.distributions.normal.name="Normalverteilung";
lang.distributions.normal.info="Werden eine Reihe von unabhängigen und identisch verteilten Zufallsgrößen addiert, so ergibt sich gemäß des zentralen Grenzwertsatzes näherungsweise die Normalverteilung.";
lang.distributions.normal.wikipedia="https://de.wikipedia.org/wiki/Normalverteilung";
lang.distributions.normal.parameterInfoMu="Lage (Erwartungswert)";
lang.distributions.normal.parameterInfoSigma="Skalierung (Standardabweichung)";

lang.distributions.logNormal={};
lang.distributions.logNormal.name="Logarithmische Normalverteilung";
lang.distributions.logNormal.info="Die logarithmische Normalverteilung operiert auf den positiven reellen Zahlen. Der Verlauf der Dichte beschreibt in vielen Fällen Bediendauern und ähnliche Zeiten sehr gut.";
lang.distributions.logNormal.wikipedia="https://de.wikipedia.org/wiki/Logarithmische_Normalverteilung";
lang.distributions.logNormal.parameterInfoMu="Erwartungswert";
lang.distributions.logNormal.parameterInfoSigma="Standardabweichung";

lang.distributions.gamma={};
lang.distributions.gamma.name="Gammaverteilung";
lang.distributions.gamma.info="Die Gammaverteilung stellt eine Verallgemeinerung der Erlang-Verteilung dar. Die Erlang-Verteilungsparameter n und &lambda; entsprechen bei der Gamma-Verteilung den Parametern <b>&alpha;</b> und <b>&beta;</b>. Während n eine natürliche Zahl sein musste, darf &alpha; eine beliebige positive reelle Zahl sein. Die Gammaverteilung eignet sich ähnlich wie die Logarithmische Normalverteilung für die Modellierung von Bediendauern.";
lang.distributions.gamma.wikipedia="https://de.wikipedia.org/wiki/Gammaverteilung";
lang.distributions.gamma.parameterInfoAlpha="Form";
lang.distributions.gamma.parameterInfoBeta="Rate";

lang.distributions.erlang={};
lang.distributions.erlang.name="Erlang-Verteilung";
lang.distributions.erlang.info="Werden die Werte von <b>n</b> Exponentialverteilungen mit Parameter <math style='font-size: 120%'><mrow><mfrac><mn>1</mn><mi><b>&lambda;</b></mi></mfrac></mrow></math> addiert, so ergibt sich die Erlangverteilung. Damit ergibt sich die Erlangverteilung z.B. für die Wartezeit eines Kunden in einer Warteschlange bekannter Länge und exponentiell verteilten Bediendauern.";
lang.distributions.erlang.wikipedia="https://de.wikipedia.org/wiki/Erlang-Verteilung";
lang.distributions.erlang.parameterInfon="Form";
lang.distributions.erlang.parameterInfoLambda="Rate";

lang.distributions.beta={};
lang.distributions.beta.name="Beta-Verteilung";
lang.distributions.beta.info="Im Gegensatz zu den meisten anderen kontinuierlichen Verteilungen besitzt die Beta-Verteilung einen abgeschlossenen Träger [<b>a</b>;<b>b</b>]. Über die beiden Parameter <b>&alpha;</b> und <b>&beta;</b> kann das Aussehen der Dichte sehr flexibel gesteuert werden - wodurch die Konfiguration der Verteilung allerdings auch schwieriger wird.";
lang.distributions.beta.wikipedia="https://de.wikipedia.org/wiki/Beta-Verteilung";
lang.distributions.beta.parameterInfoAlpha="Form";
lang.distributions.beta.parameterInfoBeta="Form";
lang.distributions.beta.parameterInfoa="Untere Bereichsgrenze";
lang.distributions.beta.parameterInfob="Obere Bereichsgrenze";
lang.distributions.beta.parameterInfobError="Die obere Bereichsgrenze <i>b</i> muss größer oder gleich der unteren Bereichsgrenze <i>a</i> sein.";

lang.distributions.triangular={};
lang.distributions.triangular.name="Dreiecksverteilung";
lang.distributions.triangular.info="Die Dreiecksverteilung wird gerne zur Modellierung von Prozessen, über die wenig bekannt ist, verwendet. Es müssen lediglich die minimal- und die maximalmögliche Ausprägung der Werte (Parameter <b>a</b> und <b>b</b>) sowie der am häufigsten auftretende Wert (Parameter <b>c</b>) bekannt sein.";
lang.distributions.triangular.wikipedia="https://de.wikipedia.org/wiki/Dreiecksverteilung";
lang.distributions.triangular.parameterInfoa="Untere Bereichsgrenze";
lang.distributions.triangular.parameterInfob="Obere Bereichsgrenze";
lang.distributions.triangular.parameterInfobError="Die obere Bereichsgrenze <i>b</i> muss größer oder gleich dem Modus <i>c</i> sein.";
lang.distributions.triangular.parameterInfoc="Modus";
lang.distributions.triangular.parameterInfocError="Der Modus <i>c</i> muss größer oder gleich der unteren Bereichsgrenze <i>a</i> sein.";

lang.distributions.trapezoid={};
lang.distributions.trapezoid.name="Trapezverteilung";
lang.distributions.trapezoid.info="The trapezoid distribution is a combination of a triangular distribution and a uniform distribution.";
lang.distributions.trapezoid.wikipedia="https://de.wikipedia.org/wiki/Trapezverteilung",
lang.distributions.trapezoid.parameterInfoa="Untere Bereichsgrenze";
lang.distributions.trapezoid.parameterInfob="Beginn Bereich Gleichverteilung";
lang.distributions.trapezoid.parameterInfobError="Der Wert für <i>b</i> muss größer oder gleich dem Wert für <i>a</i> sein.";
lang.distributions.trapezoid.parameterInfoc="Ende Bereich Gleichverteilung";
lang.distributions.trapezoid.parameterInfocError="Der Wert für <i>c</i> muss größer oder gleich dem Wert für <i>b</i> sein.";
lang.distributions.trapezoid.parameterInfod="Obere Bereichsgrenze";
lang.distributions.trapezoid.parameterInfodError="Der Wert für <i>d</i> muss größer oder gleich dem Wert für <i>c</i> sein.";

lang.distributions.weibull={};
lang.distributions.weibull.name="Weibull-Verteilung";
lang.distributions.weibull.info="Die Weibull-Verteilung wird u.a. zur Modellierung von Lebensdauer von Bauteilen verwendet. In Abhängigkeit von ihren Parametern kann ein sowohl eine steigende als auch eine fallende Ausfallrate abgebildet werden.";
lang.distributions.weibull.wikipedia="https://de.wikipedia.org/wiki/Weibull-Verteilung";
lang.distributions.weibull.parameterInfoBeta="Form";
lang.distributions.weibull.parameterInfoLambda="Inverse Skalierung";

lang.distributions.studentT={};
lang.distributions.studentT.name="Studentsche t-Verteilung";
lang.distributions.studentT.info="Die Studentsche t-Verteilung wird zur Schätzung des Stichprobenmittelwertes von normalverteilten Daten (deren exakte Standardabweichung ebenfalls nicht bekannt ist) verwendet. Der Name der Verteilung rührt daher, da der Autor seine Forschungsergebnisse nicht unter seinem Namen veröffentlichen durfte und das Pseudonym \"Student\" wählte.";
lang.distributions.studentT.wikipedia="https://de.wikipedia.org/wiki/Studentsche_t-Verteilung";
lang.distributions.studentT.parameterInfoNu="Anzahl an Freiheitsgraden";
lang.distributions.studentT.parameterInfoMu="Erwartungswert";

lang.distributions.cauchy={};
lang.distributions.cauchy.name="Cauchy-Verteilung";
lang.distributions.cauchy.info="Die Cauchy-Verteilung beschreibt die Auslenkung eines schwingenden Pendels betrachtet in x-Richtung.";
lang.distributions.cauchy.wikipedia="https://de.wikipedia.org/wiki/Cauchy-Verteilung";
lang.distributions.cauchy.parameterInfos="Form";
lang.distributions.cauchy.parameterInfot="Median";

lang.distributions.f={};
lang.distributions.f.name="F-Verteilung";
lang.distributions.f.info="Die F-Verteilung wird z.B. im F-Test verwendet. Mit Hilfe des F-Tests lassen sich Stichproben in Bezug auf ihre statistischen Schwankungen hin untersuchen.";
lang.distributions.f.wikipedia="https://de.wikipedia.org/wiki/F-Verteilung";
lang.distributions.f.parameterInfom="Anzahl an Freiheitsgraden im Zähler";
lang.distributions.f.parameterInfon="Anzahl an Freiheitsgraden im Nenner";

lang.distributions.laplace={};
lang.distributions.laplace.name="Laplace-Verteilung";
lang.distributions.laplace.info="Die Laplace-Verteilung hat die Form zweier aneinandergefügter Exponentialverteilungen. Daher wird sie auch als zweiseitige Exponentialverteilung bezeichnet.";
lang.distributions.laplace.wikipedia="https://de.wikipedia.org/wiki/Laplace-Verteilung";
lang.distributions.laplace.parameterInfoMu="Lage";
lang.distributions.laplace.parameterInfoSigma="Skalierung";

lang.distributions.pareto={};
lang.distributions.pareto.name="Pareto-Verteilung";
lang.distributions.pareto.info="Die Pareto-Verteilung eignet sich u.a. zur Beschreibung von Einkommensverteilungen, Verteilungen von Einwohnerzahlen von Städten usw.";
lang.distributions.pareto.wikipedia="https://de.wikipedia.org/wiki/Pareto-Verteilung";
lang.distributions.pareto.parameterInfoxm="Skalierung";
lang.distributions.pareto.parameterInfoAlpha="Form";

lang.distributions.chi2={};
lang.distributions.chi2.name="Chi-Quadrat-Verteilung";
lang.distributions.chi2.info="Die Summe von <b>k</b> standardnormalverteilten Zufallsvariablen ist &Chi;<sup>2</sup>-verteilt. Die &Chi;<sup>2</sup>-Verteilung tritt u.a. in dem Schätzer für die Stichprobenvarianz auf.";
lang.distributions.chi2.wikipedia="https://de.wikipedia.org/wiki/Chi-Quadrat-Verteilung";
lang.distributions.chi2.parameterInfok="Freiheitsgrade";

lang.distributions.chi={};
lang.distributions.chi.name="Chi-Verteilung";
lang.distributions.chi.info="Die Wurzel aus der Summe von <b>k</b> standardnormalverteilten Zufallsvariablen ist &Chi;-verteilt.";
lang.distributions.chi.wikipedia="https://en.wikipedia.org/wiki/Chi_distribution"; /* Leide keine deutsche Seite vorhanden */
lang.distributions.chi.parameterInfok="Freiheitsgrade";

lang.distributions.halfNormal={};
lang.distributions.halfNormal.name="Halbe Normalverteilung";
lang.distributions.halfNormal.info="Die halbe Normalverteilung kombiniert den Verlauf der Normalverteilung mit der Eigenschaft, dass nur nichtnegative x-Werte mit einer positiven Dichte belegt werden.";
lang.distributions.halfNormal.wikipedia="https://de.wikipedia.org/wiki/Normalverteilung";
lang.distributions.halfNormal.parameterInfoMu="Erwartungswert";

lang.distributions.irwinhall={};
lang.distributions.irwinhall.name="Irwin-Hall-Verteilung";
lang.distributions.irwinhall.info="Die Irwin-Hall-Verteilung ist die Verteilung der Summe von unabhängigen, im Intervall [0;1] gleichverteilten Zufallsvariablen.";
lang.distributions.irwinhall.wikipedia="https://de.wikipedia.org/wiki/Irwin-Hall-Verteilung";
lang.distributions.irwinhall.parameterInfon="Anzahl der zu summierenden Gleichverteilungen";

lang.numbers={};
lang.numbers.N="Natürliche Zahlen";
lang.numbers.N0="Natürliche Zahlen zzgl. der Null";
lang.numbers.Z="Ganze Zahlen";
lang.numbers.R="Reelle Zahlen";
lang.numbers.RPlus="Positive reelle Zahlen";
lang.numbers.RPlus0="Nichtnegative reelle Zahlen";

lang.functions={};
lang.functions.Gamma="Gammafunktion";
lang.functions.gamma="Unvollständige untere Gammafunktion";
lang.functions.Beta="Betafunktion";
lang.functions.I="Regularisierte unvollständige Betafunktion";
lang.functions.P="Regularisierte Gammafunktion";

/* English */

const languageEN={};
lang=languageEN;

lang.GUI={};
lang.GUI.appName="Probability distributions";
lang.GUI.homeURL="queueingsimulation.de";
lang.GUI.imprint="Imprint";
lang.GUI.privacy="Privacy";
lang.GUI.privacyInfo1="Info";
lang.GUI.privacyInfo2="All calculations are performed entirely in the browser.<br>This Webapp does not perform any further communication with the server after loading the HTML and script code.";
lang.GUI.simulators="Simulators";
lang.GUI.selectDistribution="Probability distribution";
lang.GUI.switchLanguage="Auf <b>Deutsch</b> umschalten";
lang.GUI.switchLanguageHint="Auf Deutsch umschalten";
lang.GUI.switchLanguageShort="Deutsch";
lang.GUI.switchLanguageMode='de';
lang.GUI.switchLanguageFile="index_de.html";
lang.GUI.tabColorMode="Color mode";
lang.GUI.tabColorModeLight="Light";
lang.GUI.tabColorModeDark="Dark";
lang.GUI.tabColorModeSystemDefault="System default";
lang.GUI.downloadLabel="This webapp is also available as an offline usable Windows application:";
lang.GUI.downloadButton="Windows application (exe)";

lang.distributions={};
lang.distributions.typeDiscrete="discrete";
lang.distributions.typeDiscreteFull="Discrete probability distributions";
lang.distributions.typeContinuous="continuous";
lang.distributions.typeContinuousFull="Continuous probability distributions";
lang.distributions.infoProperties="Properties";
lang.distributions.infoPropertiesName="Name";
lang.distributions.infoPropertiesType="Type";
lang.distributions.infoPropertiesSupport="Support";
lang.distributions.infoPropertiesWikipediaLink="More information in Wikipedia";
lang.distributions.infoParameters="Parameters";
lang.distributions.infoNoParameters="The distribution has no parameters.";
lang.distributions.infoVisualizationDiscrete="Count density and cumulative distribution function";
lang.distributions.infoVisualizationContinuous="Density and cumulative distribution function";
lang.distributions.infoCharacteristic="Characteristic";
lang.distributions.infoCharacteristicSymbol="Symbol";
lang.distributions.infoCharacteristicFormula="Formula";
lang.distributions.infoCharacteristicValue="Value";
lang.distributions.infoCharacteristics="Characteristics";
lang.distributions.infoCharacteristicsError="Please correct the values for the distribution parameters. Then the associated characteristics will be output here.";
lang.distributions.infoCharacteristicsE="Expected value";
lang.distributions.infoCharacteristicsVar="Variance";
lang.distributions.infoCharacteristicsStd="Standard deviation";
lang.distributions.infoCharacteristicsCV="Coefficient of variation";
lang.distributions.infoCharacteristicsSCV="Squared coefficient of variation";
lang.distributions.infoDiagramRate="Rate";
lang.distributions.infoDiagramProbability="Probability";
lang.distributions.infoDiagramPDFDiscrete="Probability distribution function";
lang.distributions.infoDiagramPDFContinuous="Probability distribution function";
lang.distributions.infoDiagramCDF="Cumulative distribution function";
lang.distributions.infoDiagramResetZoom="Reset zoom";
lang.distributions.infoDiagramZoomInfo="By holding down the <span class='border rounded-1 ps-1 pe-1 bg-light'><tt>Ctrl</tt></span> key, the mouse wheel can be used to zoom in and out, and zoom frames can be drawn.";
lang.distributions.infoDiagramShowValues="Table";
lang.distributions.infoDiagramShowValuesFile="table.html";
lang.distributions.infoDiagramShowValuesStep="Step";
lang.distributions.infoDiagramCopyValues="Copy values";
lang.distributions.infoDiagramSaveValues="Save values";
lang.distributions.infoDiagramSaveValuesTextFiles="Text files";
lang.distributions.infoDiagramExport="Export diagram";
lang.distributions.infoDiagramExportCopy="Copy diagram to clipboard";
lang.distributions.infoDiagramExportCopyError="Your browser does not support copying images to clipboard.";
lang.distributions.infoDiagramExportSave="Save diagram as graphics file";
lang.distributions.infoDiagramCloseWindow="Close window";
lang.distributions.infoDiagramCloseWindowShort="Close";
lang.distributions.infoDiagramGenerateRandomNumbers="Pseudo random numbers";
lang.distributions.infoDiagramGenerateRandomNumbersTitle="Pseudo random numbers";
lang.distributions.infoDiagramGenerateRandomNumbersCount="Generated pseudo random numbers";
lang.distributions.infoDiagramGenerateRandomNumbersMean="Mean";
lang.distributions.infoDiagramGenerateRandomNumbersStd="Standard deviation";
lang.distributions.infoDiagramGenerateRandomNumbersMin="Minimum";
lang.distributions.infoDiagramGenerateRandomNumbersMax="Maximum";
lang.distributions.infoDiagramGenerateRandomNumbersByDistribution="theoretical value according to distribution";
lang.distributions.infoDiagramGenerateRandomNumbersGenerateNew="Generate new pseudo random numbers";
lang.distributions.infoDiagramGenerateRandomNumbersGenerateNewShort="New";
lang.distributions.infoCalcParameter="Parameter";
lang.distributions.infoCalcValues="Calculate values";
lang.distributions.infoCalcValuesError="Please correct the values for the distribution parameters. Then probability values can be calculated here.";
lang.distributions.PDFDiscrete="Count density";
lang.distributions.PDFContinuous="Density";
lang.distributions.CDF="Cumulative distribution function";
lang.distributions.for="for";
lang.distributions.with="with";
lang.distributions.and="and";
lang.distributions.else="else";
lang.distributions.parameterErrorInt="An integer number has to be specified.";
lang.distributions.parameterErrorIntMin="An integer number &ge; {0} has to be specified.";
lang.distributions.parameterErrorIntMax="An integer number &le; {0} has to be specified.";
lang.distributions.parameterErrorIntMinMax="An integer number in the range of {0} to {1} (including the limits in each case) has to be specified.";
lang.distributions.parameterErrorFloat="A number has to be specified.";
lang.distributions.parameterErrorFloatMinInclusive="A number &ge; {0} has to be specified.";
lang.distributions.parameterErrorFloatMinExclusive="A number &gt; {0} has to be specified.";
lang.distributions.parameterErrorFloatMaxInclusive="A number &le; {0} has to be specified.";
lang.distributions.parameterErrorFloatMaxExclusive="A number &lt; {0} has to be specified.";
lang.distributions.parameterErrorFloatMinMaxInclusiveInclusive="A number in the range from {0} to {1} (including the limits in each case) has to be specified.";
lang.distributions.parameterErrorFloatMinMaxInclusiveExclusive="A number in the range from {0} (inclusive) to {1} (exclusive) has to be specified.";
lang.distributions.parameterErrorFloatMinMaxExclusiveInclusive="A number in the range from {0} (exclusive) to {1} (inclusive) has to be specified.";
lang.distributions.parameterErrorFloatMinMaxExclusiveExclusive="A number in the range from {0} to {1} (excluding the limits in each case) has to be specified.";
lang.distributions.parameterValueDown="Decrease value";
lang.distributions.parameterValueUp="Increase value";

lang.distributions.hypergeometric={};
lang.distributions.hypergeometric.name="Hypergeometric distribution";
lang.distributions.hypergeometric.info="An urn contains a total of <b>N</b> balls, <b>R</b> red and <b>N-R</b> black. There are <b>n</b> balls drawn without putting them back. The hypergeometric distribution then gives the probability of how many red balls are contained in the <b>n</b> balls.";
lang.distributions.hypergeometric.wikipedia="https://en.wikipedia.org/wiki/Hypergeometric_distribution";
lang.distributions.hypergeometric.parameterInfoN="Number of balls in the urn";
lang.distributions.hypergeometric.parameterInfoR="Number of red balls in the urn";
lang.distributions.hypergeometric.parameterInfoRError="The number of red balls <i>R</u> cannot be greater than the total number of balls <i>N</i>.";
lang.distributions.hypergeometric.parameterInfon="Number of balls, which are drawn without putting them back";
lang.distributions.hypergeometric.parameterInfonError="No more balls can be drawn without putting them back (<i>n</i>) than the total number of balls in the urn (<i>N</i>).";

lang.distributions.binomial={};
lang.distributions.binomial.name="Binomial distribution";
lang.distributions.binomial.info="There are red and black balls in an urn. The probability of getting a red ball when drawing once is <b>p</b>. <b>n</b> balls are drawn from the urn. After drawing a ball, it is immediately put back. The binomial distribution then indicates with which probability <b>k</b> times a red ball was drawn.";
lang.distributions.binomial.wikipedia="https://en.wikipedia.org/wiki/Binomial_distribution";
lang.distributions.binomial.parameterInfon="Number of balls, which are drawn with putting them back";
lang.distributions.binomial.parameterInfop="Proportion of red balls";

lang.distributions.poisson={};
lang.distributions.poisson.name="Poisson distribution";
lang.distributions.poisson.info="The Poisson distribution can be used to calculate the probability that a total of <b>k</b> events have occurred up to a certain time <b>t</b>, if the events occur independently at a constant rate <b>&alpha;</b>. (For the distribution parameter then applies: &lambda;:=&alpha;&middot;<i>t</i>.)";
lang.distributions.poisson.wikipedia="https://en.wikipedia.org/wiki/Poisson_distribution";
lang.distributions.poisson.parameterInfolambda="Expected value";

lang.distributions.geometric={};
lang.distributions.geometric.name="Geometric distribution";
lang.distributions.geometric.info="If the probability of success in a repeatedly performed experiment is <b>p</b>, the geometric distribution gives the probability that <b>k</b> failed attempts occurred before the first success.";
lang.distributions.geometric.wikipedia="https://en.wikipedia.org/wiki/Geometric_distribution";
lang.distributions.geometric.parameterInfop="Probability of success";

lang.distributions.discreteUniform={};
lang.distributions.discreteUniform.name="Discrete uniform distribution";
lang.distributions.discreteUniform.info="The discrete uniform distribution equally distributes the probability mass over a series of immediately successive integer values.";
lang.distributions.discreteUniform.wikipedia="https://en.wikipedia.org/wiki/Discrete_uniform_distribution";
lang.distributions.discreteUniform.parameterInfoa="Lower bound";
lang.distributions.discreteUniform.parameterInfob="Upper bound";
lang.distributions.discreteUniform.parameterInfobError="The upper bound <i>b</i> has to be equal or larger than the lower bound <i>a</i>.";

lang.distributions.negativeBinomial={};
lang.distributions.negativeBinomial.name="Negative binomial distribution";
lang.distributions.negativeBinomial.info="The negative binomial distribution gives probability for the number of failures <b>k</b> necessary to achieve the given number of <b>r</b> successes in an experiment that has only the outcomes \"success\" (probability <b>p</b>) and \"failure\" (probability <b>1-p</b>).";
lang.distributions.negativeBinomial.wikipedia="https://en.wikipedia.org/wiki/Negative_binomial_distribution";
lang.distributions.negativeBinomial.parameterInfor="Number of successes until termination";
lang.distributions.negativeBinomial.parameterInfop="Probability of success";

lang.distributions.negativeHypergeometric={};
lang.distributions.negativeHypergeometric.name="Negative hypergeometric distribution";
lang.distributions.negativeHypergeometric.info="An urn contains a total of <b>N</b> balls, <b>R</b> red and <b>N-R</b> black. The balls are drawn without putting them back until <b>n</b> red balls have been drawn. The negative hypergeometric distribution indicates the probability of having to draw <b>k</b> balls.";
lang.distributions.negativeHypergeometric.wikipedia="https://en.wikipedia.org/wiki/Negative_hypergeometric_distribution";
lang.distributions.negativeHypergeometric.parameterInfoN="Number of balls in the urn";
lang.distributions.negativeHypergeometric.parameterInfoR="Number of red balls in the urn";
lang.distributions.negativeHypergeometric.parameterInfoRError="The number of red balls <i>R</u> cannot be greater than the total number of balls <i>N</i>.";
lang.distributions.negativeHypergeometric.parameterInfon="Number of reds balls, which are drawn without putting them back";
lang.distributions.negativeHypergeometric.parameterInfonError="No more reds balls can be drawn without putting them back (<i>n</i>) than the total number of balls in the urn (<i>R</i>).";

lang.distributions.rademacher={};
lang.distributions.rademacher.name="Rademacher distribution";
lang.distributions.rademacher.info="The Rademacher distribution is used, among other things, to model basic wandering on <abbr title='Integer numbers &#x2124;=...,-3,-2,-1,0,1,2,3,...'>&#x2124;</abbr>.";
lang.distributions.rademacher.wikipedia="https://en.wikipedia.org/wiki/Rademacher_distribution";

lang.distributions.zeta={};
lang.distributions.zeta.name="Zeta distribution";
lang.distributions.zeta.info="The zeta distribution is used in <a href='https://en.wikipedia.org/wiki/Zipf%27s_law' target='_blank'>Zipf's law</a>";
lang.distributions.zeta.wikipedia="https://en.wikipedia.org/wiki/Zeta_distribution";
lang.distributions.zeta.parameterInfos="Parameter of the &zeta; function";

lang.distributions.uniform={};
lang.distributions.uniform.name="Uniform distribution";
lang.distributions.uniform.info="In the uniform distribution, the probability for all values within a certain range is identical (and zero outside this range).";
lang.distributions.uniform.wikipedia="https://en.wikipedia.org/wiki/Continuous_uniform_distribution";
lang.distributions.uniform.parameterInfoa="Lower bound";
lang.distributions.uniform.parameterInfob="Upper bound";
lang.distributions.uniform.parameterInfobError="The upper bound <i>b</i> has to be equal or larger than the lower bound <i>a</i>.";

lang.distributions.exponential={};
lang.distributions.exponential.name="Exponential distribution";
lang.distributions.exponential.info="Due to its simple structure, the exponential distribution is one of the most frequently used probability distributions for describing stochastic processes. Its essential property is <b>memorylessness</b>, which makes it particularly suitable, for example, for describing intervals between customer arrivals.";
lang.distributions.exponential.wikipedia="https://en.wikipedia.org/wiki/Exponential_distribution";
lang.distributions.exponential.parameterInfoLambda="Scale parameter";

lang.distributions.normal={};
lang.distributions.normal.name="Normal distribution";
lang.distributions.normal.info="If a series of independent and identically distributed random variables are added, the normal distribution is approximately obtained according to the central limit theorem.";
lang.distributions.normal.wikipedia="https://en.wikipedia.org/wiki/Normal_distribution";
lang.distributions.normal.parameterInfoMu="Location (mean)";
lang.distributions.normal.parameterInfoSigma="Scale (standard deviation)";

lang.distributions.logNormal={};
lang.distributions.logNormal.name="Log-normal distribution";
lang.distributions.logNormal.info="The logarithmic normal distribution operates on positive real numbers. In many cases, the course of the density describes service times and similar times very well.";
lang.distributions.logNormal.wikipedia="https://en.wikipedia.org/wiki/Log-normal_distribution";
lang.distributions.logNormal.parameterInfoMu="Mean";
lang.distributions.logNormal.parameterInfoSigma="Standard deviation";

lang.distributions.gamma={};
lang.distributions.gamma.name="Gamma distribution";
lang.distributions.gamma.info="The gamma distribution is a generalization of the Erlang distribution. The Erlang distribution parameters n and lambda correspond to the parameters <b>&alpha;</b> and <b>&beta;</b> of the gamma distribution. While n had to be a natural number, &alpha; may be any positive real number. Similar to the logarithmic normal distribution the gamma distribution is suitable for the modeling of service times.";
lang.distributions.gamma.wikipedia="https://en.wikipedia.org/wiki/Gamma_distribution";
lang.distributions.gamma.parameterInfoAlpha="Shape";
lang.distributions.gamma.parameterInfoBeta="Rate";

lang.distributions.erlang={};
lang.distributions.erlang.name="Erlang distribution";
lang.distributions.erlang.info="If the values of <b>n</b> exponential distributions with parameter <math style='font-size: 120%'><mrow><mfrac><mn>1</mn><mi><b>&lambda;</b></mi></mfrac></mrow></math> are added, the Erlang distribution is obtained. Thus, the Erlang distribution results e.g. for the waiting time of a customer in a queue of known length and exponentially distributed service times.";
lang.distributions.erlang.wikipedia="https://en.wikipedia.org/wiki/Erlang_distribution";
lang.distributions.erlang.parameterInfon="Shape";
lang.distributions.erlang.parameterInfoLambda="Rate";

lang.distributions.beta={};
lang.distributions.beta.name="Beta distribution";
lang.distributions.beta.info="In contrast to most other continuous distributions, the beta distribution has a closed support [<b>a</b>;<b>b</b>]. Via the two parameters <b>&alpha;</b> and <b>&beta;</b> the appearance of the density can be controlled very flexibly - which, however, also makes the configuration of the distribution more difficult.";
lang.distributions.beta.wikipedia="https://en.wikipedia.org/wiki/Beta_distribution";
lang.distributions.beta.parameterInfoAlpha="Shape";
lang.distributions.beta.parameterInfoBeta="Shape";
lang.distributions.beta.parameterInfoa="Lower bound";
lang.distributions.beta.parameterInfob="Upper bound";
lang.distributions.beta.parameterInfobError="The upper bound <i>b</i> has to be equal or larger than the lower bound <i>a</i>.";

lang.distributions.triangular={};
lang.distributions.triangular.name="Triangular distribution";
lang.distributions.triangular.info="The triangular distribution is often used to model processes about which little is known. Only the minimum and maximum possible values (parameters <b>a</b> and <b>b</b>) and the most likely value (parameter <b>c</b>) have to be known.";
lang.distributions.triangular.wikipedia="https://en.wikipedia.org/wiki/Triangular_distribution";
lang.distributions.triangular.parameterInfoa="Lower bound";
lang.distributions.triangular.parameterInfob="Upper bound";
lang.distributions.triangular.parameterInfobError="The upper bound <i>b</i> has to be equal or larger than the mode <i>c</i>.";
lang.distributions.triangular.parameterInfoc="Mode";
lang.distributions.triangular.parameterInfocError="The mode <i>c</i> has to be equal or larger than the lower bound <i>a</i>.";

lang.distributions.trapezoid={};
lang.distributions.trapezoid.name="Trapezoid distribution";
lang.distributions.trapezoid.info="Die Trapezverteilung stellt eine Kombination aus einer Dreiecksverteilung und einer Gleichverteilung dar.";
lang.distributions.trapezoid.wikipedia="https://en.wikipedia.org/wiki/Trapezoidal_distribution",
lang.distributions.trapezoid.parameterInfoa="Lower bound";
lang.distributions.trapezoid.parameterInfob="Start uniform section";
lang.distributions.trapezoid.parameterInfobError="The value for <i>b</i> has to be equal or larger then the value for <i>a</i>.";
lang.distributions.trapezoid.parameterInfoc="End uniform section";
lang.distributions.trapezoid.parameterInfocError="The value for <i>c</i> has to be equal or larger then the value for <i>b</i>.";
lang.distributions.trapezoid.parameterInfod="Upper bound";
lang.distributions.trapezoid.parameterInfodError="The value for <i>d</i> has to be equal or larger then the value for <i>c</i>.";

lang.distributions.weibull={};
lang.distributions.weibull.name="Weibull distribution";
lang.distributions.weibull.info="The Weibull distribution is used, among other things, to model the life time of components. Depending on its parameters, both an increasing and a decreasing failure rate can be modeled.";
lang.distributions.weibull.wikipedia="https://en.wikipedia.org/wiki/Weibull_distribution";
lang.distributions.weibull.parameterInfoBeta="Shape";
lang.distributions.weibull.parameterInfoLambda="Inverse scale";

lang.distributions.studentT={};
lang.distributions.studentT.name="Student's t-distribution";
lang.distributions.studentT.info="The Student t-distribution is used to estimate the sample mean of normally distributed data (whose exact standard deviation is also unknown). The name of the distribution comes from the fact that the author was not allowed to publish his research results under his name and chose the pseudonym \"Student\".";
lang.distributions.studentT.wikipedia="https://en.wikipedia.org/wiki/Student%27s_t-distribution";
lang.distributions.studentT.parameterInfoNu="Degrees of freedom";
lang.distributions.studentT.parameterInfoMu="Expected value";

lang.distributions.cauchy={};
lang.distributions.cauchy.name="Cauchy distribution";
lang.distributions.cauchy.info="The Cauchy distribution describes the deflection of a swinging pendulum viewed in the x-direction.";
lang.distributions.cauchy.wikipedia="https://en.wikipedia.org/wiki/Cauchy_distribution";
lang.distributions.cauchy.parameterInfos="Shape";
lang.distributions.cauchy.parameterInfot="Median";

lang.distributions.f={};
lang.distributions.f.name="F-distribution";
lang.distributions.f.info="The F-distribution is used, for example, in the F-test. With the help of the F-test, samples can be examined with regard to their statistical fluctuations.";
lang.distributions.f.wikipedia="https://en.wikipedia.org/wiki/F-distribution";
lang.distributions.f.parameterInfom="Degrees of freedom numerator";
lang.distributions.f.parameterInfon="Degrees of freedom denominator";

lang.distributions.laplace={};
lang.distributions.laplace.name="Laplace distribution";
lang.distributions.laplace.info="The Laplace distribution has the form of two joined exponential distributions. Therefore, it is also called a two-sided exponential distribution.";
lang.distributions.laplace.wikipedia="https://en.wikipedia.org/wiki/Laplace_distribution";
lang.distributions.laplace.parameterInfoMu="Location";
lang.distributions.laplace.parameterInfoSigma="Scale";

lang.distributions.pareto={};
lang.distributions.pareto.name="Pareto- distribution";
lang.distributions.pareto.info="The Pareto distribution is suitable, among other things, for the description of income distributions, distributions of population numbers of cities, etc.";
lang.distributions.pareto.wikipedia="https://en.wikipedia.org/wiki/Pareto_distribution";
lang.distributions.pareto.parameterInfoxm="Scale";
lang.distributions.pareto.parameterInfoAlpha="Shape";

lang.distributions.chi2={};
lang.distributions.chi2.name="Chi-squared distribution";
lang.distributions.chi2.info="The sum of <b>k</b> standard normally distributed random variables is &Chi;<sup>2</sup> distributed. The &Chi;<sup>2</sup> distribution occurs, among other things, in the estimator for the sample variance.";
lang.distributions.chi2.wikipedia="https://en.wikipedia.org/wiki/Chi-squared_distribution";
lang.distributions.chi2.parameterInfok="Degrees of freedom";

lang.distributions.chi={};
lang.distributions.chi.name="Chi distribution";
lang.distributions.chi.info="The square root of the sum of <b>k</b> standard normally distributed random variables is &Chi; distributed.";
lang.distributions.chi.wikipedia="https://en.wikipedia.org/wiki/Chi_distribution";
lang.distributions.chi.parameterInfok="Degrees of freedom";

lang.distributions.halfNormal={};
lang.distributions.halfNormal.name="Half normal distribution";
lang.distributions.halfNormal.info="The half normal distribution combines the course of the normal distribution with the property that only non-negative x-values are assigned a positive density.";
lang.distributions.halfNormal.wikipedia="https://en.wikipedia.org/wiki/Normal_distribution";
lang.distributions.halfNormal.parameterInfoMu="Expected value";

lang.distributions.irwinhall={};
lang.distributions.irwinhall.name="Irwin-Hall distribution";
lang.distributions.irwinhall.info="The Irwin-Hall distribution is the distribution of the sum of independent random variables that are uniform distributed in the interval [0;1].";
lang.distributions.irwinhall.wikipedia="https://en.wikipedia.org/wiki/Irwin%E2%80%93Hall_distribution";
lang.distributions.irwinhall.parameterInfon="Number uniform distributions to be summed";

lang.numbers={};
lang.numbers.N="Natural numbers";
lang.numbers.N0="Natural numbers and zero";
lang.numbers.Z="Integer numbers";
lang.numbers.R="Real numbers";
lang.numbers.RPlus="Positive real numbers";
lang.numbers.RPlus0="Non-negative real numbers";

lang.functions={};
lang.functions.Gamma="gamma function";
lang.functions.gamma="lower incomplete gamma function";
lang.functions.Beta="beta function";
lang.functions.I="regularized incomplete beta function";
lang.functions.P="regularized gamma function";

/* Activate language */

const language=(document.documentElement.lang=='de')?languageDE:languageEN;