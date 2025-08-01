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
lang.GUI.permaLink="Permalink zu dieser Seite mit diesen Einstellungen";
lang.GUI.downloadLabel="Diese Webapp steht auch als offline-nutzbare Anwendung zur Verfügung:";
lang.GUI.downloadButton="Download";
lang.GUI.downloadButtonExe="Windows-Anwendung (exe)";
lang.GUI.downloadButtonZip="Linux und MacOS-Anwendung (zip)";
lang.GUI.toolsLabel="Weitere Hilfsmittel:";
lang.GUI.size={};
lang.GUI.size.collapse="Platz sparen";
lang.GUI.size.expand="Alles anzeigen";

lang.distributions={};
lang.distributions.typeDiscrete="diskret";
lang.distributions.typeDiscreteFull="Diskrete Wahrscheinlichkeitsverteilungen";
lang.distributions.typeContinuous="kontinuierlich";
lang.distributions.typeContinuousFull="Kontinuierliche Wahrscheinlichkeitsverteilungen";
lang.distributions.countDiscrete="diskrete Wahrscheinlichkeitsverteilungen";
lang.distributions.countContinuous="kontinuierliche Wahrscheinlichkeitsverteilungen";
lang.distributions.countSum="Wahrscheinlichkeitsverteilungen";
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
lang.distributions.infoCharacteristicsMedian="Median";
lang.distributions.infoCharacteristicsMode="Modalwert";
lang.distributions.infoCharacteristicsWikipedia="Wikipedia-Seite";
lang.distributions.infoDiagramRate="Rate";
lang.distributions.infoDiagramProbability="Wahrscheinlichkeit";
lang.distributions.infoDiagramPDFDiscrete="Zähldichte";
lang.distributions.infoDiagramPDFContinuous="Dichte";
lang.distributions.infoDiagramCDF="Verteilungsfunktion";
lang.distributions.infoDiagramResetZoom="Standardzoom";
lang.distributions.infoDiagramZoomInfo="Mit gedrückter <span class='border rounded-1 ps-1 pe-1 bg-light'><tt>Strg</tt></span>-Taste kann per Mausrad gezoomt werden und es können Zoom-Rahmen aufgezogen werden.";
lang.distributions.infoDiagramShowValues="Tabelle";
lang.distributions.infoDiagramShowValuesFile="table_de.html";
lang.distributions.infoDiagramSimFile="sim_de.html";
lang.distributions.infoDiagramShowValuesStep="Schrittweite";
lang.distributions.infoExportTabelle="Tabelle exportieren";
lang.distributions.infoDiagramCopyValues="Werte kopieren";
lang.distributions.infoDiagramSaveValues="Werte speichern";
lang.distributions.infoDiagramSaveValuesTextFiles="Textdateien";
lang.distributions.infoDiagramExport="Diagramm exportieren";
lang.distributions.infoDiagramExportCopy="Diagramm in die Zwischenablage kopieren";
lang.distributions.infoDiagramExportCopyError="Ihr Browser unterstützt das Kopieren von Bildern leider nicht.";
lang.distributions.infoDiagramExportSave="Diagramm als Grafik speichern";
lang.distributions.infoDiagramFit="Verteilungsanpassung";
lang.distributions.infoDiagramFitInfo="Verteilung suchen, die die Werte möglichst gut beschreibt";
lang.distributions.infoDiagramCloseWindow="Fenster schließen";
lang.distributions.infoDiagramCloseWindowShort="Schließen";
lang.distributions.infoDiagramTable="Dichte und Verteilung";
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
lang.distributions.infoDiagramGenerateRandomNumbersWorking="Pseudozufallszahlen werden erzeugt...";
lang.distributions.infoCalcParameter="Parameter";
lang.distributions.infoCalcValues="Werte berechnen";
lang.distributions.infoCalcValuesError="Bitte korrigieren Sie die Werte für die Verteilungsparameter. Dann werden können hier konkrete Wahrscheinlichkeiten berechnet werden.";
lang.distributions.infoDiagramLawOfLargeNumbers="Gesetz der großen Zahlen";
lang.distributions.infoDiagramLawOfLargeNumbersWikipedia="https://de.wikipedia.org/wiki/Gesetz_der_gro%C3%9Fen_Zahlen";
lang.distributions.infoDiagramLawOfLargeNumbersInfo=`Das arithmetische Mittel
<math><mrow><mfrac><mrow><mn>1</mn></mrow><mrow><mi>n</mi></mrow></mfrac><munderover><mo>&sum;</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><msub><mi>X</mi><mi>i</mi></msub></math>
aus i.i.d. verteilten Zufallsvariablen konvergiert fast sicher gegen den Erwartungswert
<math><mrow><mi mathvariant='normal'>E</mi><mo>[</mo><msub><mi>X</mi><mn>1</mn></msub><mo>]</mo></mrow></math>.
Zur Veranschaulichung werden Zufallszahlen zu der auswählten Verteilung erzeugt (dies entspricht einer Beobachtung von <math><msub><mi>X</mi><mn>1</mn></msub></math>, <math><msub><mi>X</mi><mn>2</mn></msub></math>, ...).
Im rechten Bild werden die (Zähl-) Dichte der Verteilung und die relativen Häufigkeiten der simulierten Werte gezeigt. Im linken Bild markiert die grüne Linie den Erwartungswert <math><mrow><mi mathvariant='normal'>E</mi><mo>[</mo><msub><mi>X</mi><mn>1</mn></msub><mo>]</mo></mrow></math>,
die rote Linie zeigt den Verlauf des arithmetischen Mittels der Zufallszahlen.`;
lang.distributions.infoDiagramLawOfLargeNumbersHeadingMeanExpectedValue="Mittelwert und Erwartungswert";
lang.distributions.infoDiagramLawOfLargeNumbersHeadingDensitySample="Dichte und Stichprobe";
lang.distributions.infoDiagramLawOfLargeNumbersScaleExpectedValueMean="Erwartungswert bzw. Mittelwert";
lang.distributions.infoDiagramLawOfLargeNumbersScalePercentage="Anteil (in %)";
lang.distributions.infoDiagramLawOfLargeNumbersDatasetExpectedValue="Erwartungswert";
lang.distributions.infoDiagramLawOfLargeNumbersDatasetMean="Arithmetisches Mittel";
lang.distributions.infoDiagramLawOfLargeNumbersDatasetDiscreteDensity="Zähldichte";
lang.distributions.infoDiagramLawOfLargeNumbersDatasetDiscreteSample="Stichprobe";
lang.distributions.infoDiagramLawOfLargeNumbersDatasetContinuousDensity="Dichte";
lang.distributions.infoDiagramLawOfLargeNumbersDatasetContinuousDensityHistogramBarWidth="Histogrammbalkenbreite";
lang.distributions.infoDiagramLawOfLargeNumbersDatasetContinuousSample="Stichprobe";
lang.distributions.infoDiagramLawOfLargeNumbersControlStep="Einzelschritt";
lang.distributions.infoDiagramLawOfLargeNumbersControlStart="Start";
lang.distributions.infoDiagramLawOfLargeNumbersControlStop="Stopp";
lang.distributions.infoDiagramLawOfLargeNumbersControlReset="Zurücksetzen";
lang.distributions.infoDiagramLawOfLargeNumbersControlSteps="Schrittanzahl";
lang.distributions.infoDiagramLawOfLargeNumbersControlStepsInput="Führt die angegebene Anzahl an Simulationsschritten durch.";
lang.distributions.infoDiagramLawOfLargeNumbersInfoNewestRandomNumber="Neuste Zufallszahl";
lang.distributions.infoDiagramLawOfLargeNumbersInfoSampleValues="Stichprobenwerte";
lang.distributions.infoDiagramLawOfLargeNumbersInfoExpectedValueOfDistribution="Erwartungswert der Wahrscheinlichkeitsverteilung";
lang.distributions.infoDiagramLawOfLargeNumbersInfoArithmeticMeanOfTheSampleValues="Arithmetisches Mittel der Stichprobenwerte";
lang.distributions.infoDiagramLawOfLargeNumbersInfoRelativeDeviationMeanExpectedValue="Relative Abweichung Mittelwert zu Erwartungswert";
lang.distributions.infoDiagramLawOfLargeNumbersInfoSum="Summe";
lang.distributions.infoDiagramCentralLimitTheorem="Zentraler Grenzwertsatz";
lang.distributions.infoDiagramCentralLimitTheoremWikipedia="https://de.wikipedia.org/wiki/Zentraler_Grenzwertsatz";
lang.distributions.infoDiagramCentralLimitTheoremInfo="Für i.i.d. verteilte Zufallsvariablen <i>X</i><sub>1</sub>, <i>X</i><sub>2</sub>, ... mit gemeinsamem Erwartungswert &mu; und gemeinsamer Varianz &sigma;<sup>2</sup> strebt <math><mrow><msub><mi>Y</mi><mi>n</mi></msub><mo>=</mo><mfrac><mn>1</mn><msqrt><mi>n</mi></msqrt></mfrac><munderover><mo>&sum;</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mo>&infin;</mo></munderover><mfrac><mrow><msub><mn>x</mn><mn>i</mn></msub><mo>-</mo><mn>&mu;</mn></mrow><mn>&sigma;</mn></mfrac></math> für <i>n</i>&rarr;&infin; verteilungsmäßig gegen die Standardnormalverteilung <i>N</i>(0,1). Zur Veranschaulichung werden die <i>X<sub>i</sub></i> durch simulierte Zufallszahlen zur ausgewählten Verteilung ersetzt. Die relativen Häufigkeiten der dazu ermittelten <i>Y<sub>n</sub></i> Werte werden im rechten Diagramm angezeigt, sie nähern sich rasch der Dichte von <i>N</i>(0,1)<(i>) an.";
lang.distributions.infoDiagramCentralLimitTheoremHeadingSample="Stichprobe";
lang.distributions.infoDiagramCentralLimitTheoremHeadingStandardNormalDistribution="Standardnormalverteilung";
lang.distributions.infoDiagramCentralLimitTheoremDatasetDensityPhi="Dichte der Standardnormalverteilung";
lang.distributions.infoDiagramCentralLimitTheoremDatasetPartialSumSample="Histogramm der Partialsummen";
lang.distributions.infoDiagramCentralLimitTheoremNewestParialSum="Neuste Partialsumme";
lang.distributions.infoDiagramCentralLimitTheoremValuesPerPartialSum="Werte pro Partialsumme";
lang.distributions.infoDiagramCentralLimitTheoremNumberOfPartialSums="Anzahl an Partialsummen";
lang.distributions.infoDiagramCentralLimitTheoremMeanOfSample="Mittelwert der Messwerte";
lang.distributions.infoDiagramCentralLimitTheoremMeanOfPartialSums="Mittelwert der Partialsummen";
lang.distributions.infoDiagramCentralLimitTheoremVarianceOfPartialSums="Varianz der Partialsummen";
lang.distributions.infoDiagramDiceRollSimulation="Würfelsimulation";
lang.distributions.infoDiagramNumberOfDots="Augenzahl";
lang.distributions.infoDiagramAbsoluteFrequency="Absolute Häufigkeit";
lang.distributions.infoDiagramRelativeFrequency="Relative Häufigkeit";
lang.distributions.PDFDiscrete="Zähldichte";
lang.distributions.PDFContinuous="Dichte";
lang.distributions.CDF="Verteilungsfunktion";
lang.distributions.scipyTooltip="SciPy Python-Code für die Verteilung";
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
lang.distributions.showExpectedValue="Erwartungswert einzeichnen";
lang.distributions.showStandardDeviation="Standardabweichung einzeichnen";
lang.distributions.showMedian="Median einzeichnen";
lang.distributions.xAutoRange="x-Bereich automatisch";
lang.distributions.EulerMascheroni="Approximation für Euler-Mascheroni-Konstante";

lang.fitter={};
lang.fitter.title="Verteilungsanpassung";
lang.fitter.info="Bei der Verteilungsanpassung werden zunächst die Kenngrößen der Messwerte berechnet. Auf dieser Basis werden die verschiedenen Verteilungsverteilungen parametrisiert. Die so konfigurierten Verteilungen werden mit dem aus den Messwerten gebildeten Histogramm vergleichen. Je kleiner die jeweilige Summe der quadrierten Fehler &Delta; ausfällt, desto besser passt die Verteilung zu den Messwerten.";
lang.fitter.inputValues="Eingabewerte";
lang.fitter.inputValuesLoadInfo="<b>Eine Datei zum Laden des Inhalts hierhin ziehen und ablegen.</b><br><small>Die Verarbeitung der Daten erfolgt vollständig lokal im Browser. Es werden keinerlei Daten ins Netz transferiert.</small>";
lang.fitter.inputValuesLoadError="Die Datei enthielt keine Zahlenwerte, die verarbeitet werden könnten.";
lang.fitter.loadedValues="Geladene Werte";
lang.fitter.loadedValuesCount="Anzahl an Werten";
lang.fitter.loadedValuesMinimum="Minimum";
lang.fitter.loadedValuesMaximum="Maximum";
lang.fitter.loadedValuesMean="Mittelwert";
lang.fitter.loadedValuesStandardDeviation="Standardabweichung";
lang.fitter.outputHeader="Ergebnisse der Verteilungsanpassung";
lang.fitter.outputHeaderInfo="Verteilungen geprüft";
lang.fitter.outputNoFit="keine Anpassung an die Eingabedaten möglich";
lang.fitter.histogram="Histogramm";
lang.fitter.fittedDistribution="Angepasste Verteilung";
lang.fitter.openInEditor="Verteilung in Editor laden";
lang.fitter.infoDelta="Quadratische Abweichung zwischen Histogramm und Dichte. Je kleiner dieser Wert ist, desto besser beschreibt die Verteilungsfunktion die Werte des Histogramms.";
lang.fitter.infoPValueKS="p-Value für den Kolmogorov-Smirnov-Anpassungstest. Je höher ein p-Wert ist, desto schwerer ist es, die Hypothese abzulehnen, dass der Messreihe die jeweilige Verteilung zugrunde liegt.";
lang.fitter.infoPValueChiSqr="p-Value für den &chi;²-Anpassungstest. Je höher ein p-Wert ist, desto schwerer ist es, die Hypothese abzulehnen, dass der Messreihe die jeweilige Verteilung zugrunde liegt.";

lang.lcg={};
lang.lcg.title="Linearer Kongruenzgenerator";
lang.lcg.wikipedia="https://de.wikipedia.org/wiki/Kongruenzgenerator";
lang.lcg.info=`
<p>Zur Durchführung von stochastischen Simulationen werden <strong>Zufallszahlen</strong>, die gemäß bestimmter Wahrscheinlichkeitsverteilungen verteilt sind, benötigt. Diese Zufallszahlen gewinnt man durch verschiedene, verteilungsabhängige Methoden aus Zufallszahlen, die auf dem Intervall [0,1] gleichverteilt sind.</p>
<p>Generell können in einem deterministisch arbeitenden Computer keine echten Zufallszahlen erzeugt werden, sondern stets nur <strong>Pseudo-Zufallszahlen</strong>. Diese Peudo-Zufallszahlen sind zwar sind zwar ebenfalls näherungsweise auf dem Intervall [0,1] gleichverteilt und erfüllen eine Reihe von Kriterien echter Zufallszahlen, besitzen aber dennoch gewisse Regelmäßigkeiten, die echte Zufallszahlen nicht aufweisen. Für Anwendungen in der Kryptographie ist es wichtig, dass diese Regelmäßigkeiten möglichst gering ausfallen und insbesondere nicht aus einer Reihe von Pseudo-Zufallszahlen auf die jeweils nächste Pseudo-Zufallszahl geschlossen werden kann. Für die Anwendung in der stochastischen Simulation sind jedoch keine so starken Voraussetzungen notwendig, so dass hier häufig <strong>lineare Kongruenzgeneratoren</strong> zur Erzeugung von Zufallszahlen zur Anwendung kommen.</p>
<p>Bei einem linearen Kongruenzgenerator wird die jeweils nächste Zufallszahl (<strong>a<sub>n+1</sub></strong>) aus der vorherigen gewonnen, in dem der letzte Wert mit einer fest gewählten Zahl multipliziert (<strong>b</strong>) wird und anschließend ebenfalls ein fest gewählter Wert addiert (<strong>c</strong>) wird. Abschließend wird das Ergebnis modulo eines ebenfalls fest gewählten Wertes (<strong>m</strong>) betrachtet. Damit sich eine Verteilung zwischen 0 und 1 ergibt, werden die so ermittelten Zahlen durch den gewählten Modul geteilt:</p>
<p>
<strong>a<sub>0</sub></strong> := Startwert<br>
<strong>a<sub>n+1</sub></strong> := <strong>b&middot;a<sub>n</sub>+c mod m</strong><br>
Zufallszahlen: <strong>u<sub>n</sub></strong> := <strong>a<sub>n</sub>/m</strong>
</p>
<p>Die Qualität der Zufallszahlen, d.h. wie gut die sich ergebenden Werte un eine Gleichverteilung auf [0,1] annähern, hängt von der Wahl von <strong>b</strong>, <strong>c</strong> und <strong>m</strong> ab.</p>
`;
lang.lcg.pseudoRandomNumbers="Pseudozufallszahlen";
lang.lcg.showCompleteTable="Gesamte Tabelle anzeigen";
lang.lcg.gridStructure="Gitterstruktur";
lang.lcg.processing="Verarbeitung...";
lang.lcg.tableHeading="Berechnung von Zufallszahlen gemäß der Rechenvorschrift";
lang.lcg.tableHeadingWithInitialValue="mit Startwert";
lang.lcg.tableHeadingAnd="und";
lang.lcg.resultA="Die Periodenlänge beträgt mehr als";
lang.lcg.resultB="Die Periodenlänge beträgt";
lang.lcg.resultC=", d.h. nach";
lang.lcg.resultD="Zahlen wiederholt sich die Zahlenfolge.";
lang.lcg.resultInfoA="Die maximale Periodenlänge für einen linearen Kongruenzgenerator mit Modul";
lang.lcg.resultInfoB="beträgt";
lang.lcg.resultInfoC="Die gewählten Parameter schöpfen die maximal mögliche Periodenlänge optimal aus.";
lang.lcg.resultInfoD="Die gewählten Parameter für den multiplikativen und den additiven Parameter sind folglich nicht optimal. Eine Anleitung, wie die Parameter gewählt werden müssen, um auf die maximale Periodenlänge zu kommen, gibt es u.a. <a href='http://de.wikipedia.org/wiki/Kongruenzgenerator#Linearer_Kongruenzgenerator' target='_blank'>hier</a>.";

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
lang.distributions.rademacher.name="Rademacher-Verteilung";
lang.distributions.rademacher.info="Die Rademacher-Verteilung wird u.a. zur Modellierung von einfachen Irrfahrten auf <abbr title='Ganze Zahlen &#x2124;=...,-3,-2,-1,0,1,2,3,...'>&#x2124;</abbr> verwendet.";
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
lang.distributions.gamma.parameterInfoBeta="Skalierung";

lang.distributions.erlang={};
lang.distributions.erlang.name="Erlang-Verteilung";
lang.distributions.erlang.info="Werden die Werte von <b>n</b> Exponentialverteilungen mit Parameter <math style='font-size: 120%'><mrow><mfrac><mn>1</mn><mi><b>&lambda;</b></mi></mfrac></mrow></math> addiert, so ergibt sich die Erlangverteilung. Damit ergibt sich die Erlangverteilung z.B. für die Wartezeit eines Kunden in einer Warteschlange bekannter Länge und exponentiell verteilten Bediendauern.";
lang.distributions.erlang.wikipedia="https://de.wikipedia.org/wiki/Erlang-Verteilung";
lang.distributions.erlang.parameterInfon="Form";
lang.distributions.erlang.parameterInfoLambda="Skalierung";

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

lang.distributions.sawtoothLeft={};
lang.distributions.sawtoothLeft.name="Linke Sägezahnverteilung";
lang.distributions.sawtoothLeft.info="Die Sägezahnverteilungen stellen einen vereinfachten Spezialfall der Dreiecksverteilung dar.";
lang.distributions.sawtoothLeft.wikipedia="https://de.wikipedia.org/wiki/Dreiecksverteilung";
lang.distributions.sawtoothLeft.parameterInfoa="Untere Bereichsgrenze";
lang.distributions.sawtoothLeft.parameterInfob="Obere Bereichsgrenze";
lang.distributions.sawtoothLeft.parameterInfobError="Die obere Bereichsgrenze <i>b</i> muss größer oder gleich der unteren Bereichsgrenze <i>a</i> sein.";

lang.distributions.sawtoothRight={};
lang.distributions.sawtoothRight.name="Rechte Sägezahnverteilung";
lang.distributions.sawtoothRight.info="Die Sägezahnverteilungen stellen einen vereinfachten Spezialfall der Dreiecksverteilung dar.";
lang.distributions.sawtoothRight.wikipedia="https://de.wikipedia.org/wiki/Dreiecksverteilung";
lang.distributions.sawtoothRight.parameterInfoa="Untere Bereichsgrenze";
lang.distributions.sawtoothRight.parameterInfob="Obere Bereichsgrenze";
lang.distributions.sawtoothRight.parameterInfobError="Die obere Bereichsgrenze <i>b</i> muss größer oder gleich der unteren Bereichsgrenze <i>a</i> sein.";

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
lang.distributions.chi.wikipedia="https://en.wikipedia.org/wiki/Chi_distribution"; /* Leider keine deutsche Seite vorhanden */
lang.distributions.chi.parameterInfok="Freiheitsgrade";

lang.distributions.halfNormal={};
lang.distributions.halfNormal.name="Halbe Normalverteilung";
lang.distributions.halfNormal.info="Die halbe Normalverteilung kombiniert den Verlauf der Normalverteilung mit der Eigenschaft, dass nur nichtnegative x-Werte mit einer positiven Dichte belegt werden.";
lang.distributions.halfNormal.wikipedia="https://en.wikipedia.org/wiki/Half-normal_distribution"; /* Leider keine deutsche Seite vorhanden */
lang.distributions.halfNormal.parameterInfoS="Verschiebung";
lang.distributions.halfNormal.parameterInfoMu="Erwartungswert";

lang.distributions.irwinhall={};
lang.distributions.irwinhall.name="Irwin-Hall-Verteilung";
lang.distributions.irwinhall.info="Die Irwin-Hall-Verteilung ist die Verteilung der Summe von unabhängigen, im Intervall [0;1] gleichverteilten Zufallsvariablen.";
lang.distributions.irwinhall.wikipedia="https://de.wikipedia.org/wiki/Irwin-Hall-Verteilung";
lang.distributions.irwinhall.parameterInfon="Anzahl der zu summierenden Gleichverteilungen";

lang.distributions.wignerSemicircle={};
lang.distributions.wignerSemicircle.name="Wigner Halbkreisverteilung";
lang.distributions.wignerSemicircle.info="Ber der nach dem Physiker Eugene Wigner benannten Verteilung bildet die Dichte einen Halbkreis mit Radius <b>R</b>. Die Verteilung tritt u.a. als Grenzverteilung der Eigenwerte verschiedener symmetrischer Matrizen auf.";
lang.distributions.wignerSemicircle.wikipedia="https://en.wikipedia.org/wiki/Wigner_semicircle_distribution"; /* Leider keine deutsche Seite vorhanden */
lang.distributions.wignerSemicircle.parameterInfoM="Mittelpunkt";
lang.distributions.wignerSemicircle.parameterInfoR="Radius";

lang.distributions.uQuadratic={}
lang.distributions.uQuadratic.name="U-quadratische Verteilung";
lang.distributions.uQuadratic.info="Die U-quadratische Verteilung wird zur Modellierung von bimodalen Prozessen verwendet.";
lang.distributions.uQuadratic.wikipedia="https://en.wikipedia.org/wiki/U-quadratic_distribution"; /* Leider keine deutsche Seite vorhanden */
lang.distributions.uQuadratic.parameterInfoa="Untere Bereichsgrenze";
lang.distributions.uQuadratic.parameterInfob="Obere Bereichsgrenze";
lang.distributions.uQuadratic.parameterInfobError="Die obere Bereichsgrenze <i>b</i> muss größer oder gleich der unteren Bereichsgrenze <i>a</i> sein.";

lang.distributions.reciprocal={}
lang.distributions.reciprocal.name="Reziproke Verteilung";
lang.distributions.reciprocal.info="Die reziproke Verteilung ist auch unter dem Namen Log-Gleichverteilung bekannt.";
lang.distributions.reciprocal.wikipedia="https://en.wikipedia.org/wiki/Reciprocal_distribution"; /* Leider keine deutsche Seite vorhanden */
lang.distributions.reciprocal.parameterInfoa="Untere Bereichsgrenze";
lang.distributions.reciprocal.parameterInfob="Obere Bereichsgrenze";
lang.distributions.reciprocal.parameterInfobError="Die obere Bereichsgrenze <i>b</i> muss größer oder gleich der unteren Bereichsgrenze <i>a</i> sein.";

lang.distributions.kumaraswamy={};
lang.distributions.kumaraswamy.name="Kumaraswamy-Verteilung";
lang.distributions.kumaraswamy.info="Die Kumaraswamy-Verteilung eignet sich, ähnlich wie die Beta-Verteilung, zur Modellierung von Prozessen, die nur Werte in einem endlichen Bereich annehmen können. Im Gegensatz zur Beta-Verteilung können jedoch Dichte und Verteilungsfunktion durch elementare Formeln ausgedrückt werden.";
lang.distributions.kumaraswamy.wikipedia="https://en.wikipedia.org/wiki/Kumaraswamy_distribution"; /* Leider keine deutsche Seite vorhanden */
lang.distributions.kumaraswamy.parameterInfoA="Formparameter";
lang.distributions.kumaraswamy.parameterInfoB="Formparameter";

lang.distributions.sine={}
lang.distributions.sine.name="Sinus-Verteilung";
lang.distributions.sine.info="Die Sinus-Verteilung nutzt den skalierten ersten Bogen der Sinusfunktion Dichte.";
lang.distributions.sine.wikipedia=null;

lang.distributions.arcsine={}
lang.distributions.arcsine.name="Arcus Sinus-Verteilung";
lang.distributions.arcsine.info="";
lang.distributions.arcsine.wikipedia=null;

lang.distributions.gumbel={};
lang.distributions.gumbel.name="Gumbel-Verteilung";
lang.distributions.gumbel.info="Die Gumbel-Verteilung wird auch als doppelte Exponentialverteilung bezeichnet.";
lang.distributions.gumbel.wikipedia="https://de.wikipedia.org/wiki/Gumbel-Verteilung";
lang.distributions.gumbel.parameterInfoMean="Erwartungswert";
lang.distributions.gumbel.parameterInfoStd="Standardabweichung";

lang.distributions.hyperbolicSecant={};
lang.distributions.hyperbolicSecant.name="Hyperbolische Sekantenverteilung";
lang.distributions.hyperbolicSecant.info="";
lang.distributions.hyperbolicSecant.wikipedia="https://en.wikipedia.org/wiki/Hyperbolic_secant_distribution"; /* No German Wikipedia page */
lang.distributions.hyperbolicSecant.parameterInfoMu="Lage (Erwartungswert)";
lang.distributions.hyperbolicSecant.parameterInfoSigma="Skalierung (Standardabweichung)";

lang.distributions.inverseGaussian={};
lang.distributions.inverseGaussian.name="Inverse Gauß-Verteilung";
lang.distributions.inverseGaussian.info="Die inverse Gauß-Verteilung, auch als inverse Normalverteilung bezeichnet, wird in verallgemeinerten linearen Modellen verwendet.";
lang.distributions.inverseGaussian.wikipedia="https://de.wikipedia.org/wiki/Inverse_Normalverteilung";
lang.distributions.inverseGaussian.parameterInfoLambda="Ereignisrate";
lang.distributions.inverseGaussian.parameterInfoMu="Erwartungswert";

lang.distributions.johnson={};
lang.distributions.johnson.name="Johnson-SU-Verteilung";
lang.distributions.johnson.nameFormat="Johnson-S<sub>U</sub>-Verteilung";
lang.distributions.johnson.info="Die Johnson S<sub>U</sub>-Verteilung ist eine von N. L. Johnson entwickelte vier-parametrige Wahrscheinlichkeitsverteilung. Die Verteilung wird u.a. zur Modellierung von Vermögenserträgen in der Portfolioverwaltung eingesetzt.";
lang.distributions.johnson.wikipedia="https://en.wikipedia.org/wiki/Johnson%27s_SU-distribution"; /* No German Wikipedia page */
lang.distributions.johnson.parameterInfoGamma=""; /* No special names for parameters */
lang.distributions.johnson.parameterInfoXi=""; /* No special names for parameters */
lang.distributions.johnson.parameterInfoDelta=""; /* No special names for parameters */
lang.distributions.johnson.parameterInfoLambda=""; /* No special names for parameters */

lang.distributions.levy={};
lang.distributions.levy.name="Lévy-Verteilung";
lang.distributions.levy.info="Die Lévy-Verteilung besitzt als besondere Eigenschaft einen unendlichen Erwartungswert.";
lang.distributions.levy.wikipedia="https://de.wikipedia.org/wiki/Lévy-Verteilung";
lang.distributions.levy.parameterInfoMu="Lageparameter";
lang.distributions.levy.parameterInfoGamma="Skalenparameter";

lang.distributions.logistic={};
lang.distributions.logistic.name="Logistische Verteilung";
lang.distributions.logistic.info="Die logistische Verteilung wird insbesondere zur Beschreibung von Wachstumsprozessen mit Sättigungstendenz verwendet.";
lang.distributions.logistic.wikipedia="https://de.wikipedia.org/wiki/Logistische_Verteilung";
lang.distributions.logistic.parameterInfoMu="Lageparameter";
lang.distributions.logistic.parameterInfoS="Skalenparameter";

lang.distributions.logLogistic={};
lang.distributions.logLogistic.name="Log-logistische Verteilung";
lang.distributions.logLogistic.info="Die log-logistische Verteilung wird in der Lebensdaueranalyse für Ereignisse verwendet, deren Häufigkeit zunächst zunimmt und später abnimmt.";
lang.distributions.logLogistic.wikipedia="https://en.wikipedia.org/wiki/Log-logistic_distribution"; /* No German Wikipedia page */
lang.distributions.logLogistic.parameterInfoAlpha="Skalenparameter";
lang.distributions.logLogistic.parameterInfoBeta="Formparameter";

lang.distributions.maxwellBoltzmann={};
lang.distributions.maxwellBoltzmann.name="Maxwell-Boltzmann-Verteilung";
lang.distributions.maxwellBoltzmann.info="Die Maxwell-Boltzmann-Verteilung wird in der Thermodynamik zur Beschreibung der Teilchengeschwindigkeiten in idealen Gasen verwendet.";
lang.distributions.maxwellBoltzmann.wikipedia="https://de.wikipedia.org/wiki/Maxwell-Boltzmann-Verteilung";
lang.distributions.maxwellBoltzmann.parameterInfoA="Skalenparameter";

lang.distributions.pert={};
lang.distributions.pert.name="Pert-Verteilung";
lang.distributions.pert.info="Die Pert-Verteilung verwendet dieselben Parameter wie die Dreiecksverteilung, besitzt aber im Gegensatz zu dieser einen glatteren Verlauf.";
lang.distributions.pert.wikipedia="https://en.wikipedia.org/wiki/PERT_distribution"; /* No German Wikipedia page */
lang.distributions.pert.parameterInfoa="Untere Bereichsgrenze";
lang.distributions.pert.parameterInfob="Modus";
lang.distributions.pert.parameterInfoc="Obere Bereichsgrenze";
lang.distributions.pert.parameterInfobError="Der Modus <i>b</i> muss größer oder gleich der unteren Bereichsgrenze <i>a</i> sein.";
lang.distributions.pert.parameterInfocError="Die obere Bereichsgrenze <i>c</i> muss größer oder gleich dem Modus <i>b</i> sein.";

lang.distributions.power={};
lang.distributions.power.name="Potenzverteilung";
lang.distributions.power.info="Die Potenzverteilung ist eine inverse Pareto-Verteilung.";
lang.distributions.power.wikipedia="https://en.wikipedia.org/wiki/Pareto_distribution#Inverse-Pareto_Distribution_/_Power_Distribution"; /* No German Wikipedia page */
lang.distributions.power.parameterInfoa="Untere Bereichsgrenze";
lang.distributions.power.parameterInfob="Obere Bereichsgrenze";
lang.distributions.power.parameterInfobError="Die obere Bereichsgrenze <i>b</i> muss größer oder gleich der unteren Bereichsgrenze <i>a</i> sein.";
lang.distributions.power.parameterInfoc="Potenzierungswert";

lang.distributions.rayleigh={};
lang.distributions.rayleigh.name="Rayleigh-Verteilung";
lang.distributions.rayleigh.info="Werden zwei normalverteilte, stochastisch unabhängige Zufallsvariablen als zweidimensionaler Vektor aufgefasst, so ist der Betrag des Vektors Rayleigh-verteilt.";
lang.distributions.rayleigh.wikipedia="https://de.wikipedia.org/wiki/Rayleigh-Verteilung";
lang.distributions.rayleigh.parameterInfom="Erwartungswert";

lang.distributions.fatigueLife={};
lang.distributions.fatigueLife.name="Fatigue-Life-Verteilung";
lang.distributions.fatigueLife.info="Die Fatigue-Life-Verteilung wird vor allem in der Zuverlässigkeitstheorie eingesetzt.";
lang.distributions.fatigueLife.wikipedia="https://en.wikipedia.org/wiki/Birnbaum%E2%80%93Saunders_distribution";
lang.distributions.fatigueLife.parameterInfoMu="Lageparameter";
lang.distributions.fatigueLife.parameterInfoBeta="Skalenparameter";
lang.distributions.fatigueLife.parameterInfoGamma="Formparameter";

lang.distributions.frechet={};
lang.distributions.frechet.name="Fréchet-Verteilung";
lang.distributions.frechet.info="Die Fréchet-Verteilung ist auch unter dem Namen Inverse Weibull-Verteilung bekannt. Die Verteilung ist nach dem französischen Mathematiker <a href='https://de.wikipedia.org/wiki/Maurice_Ren%C3%A9_Fr%C3%A9chet' target='_blank'>Maurice René Fréchet</a> benannt und wird zur Modellierung von Extermereignissen (z.B. der Regenmengen an einzelnen Tagen) verwendet.";
lang.distributions.frechet.wikipedia="https://de.wikipedia.org/wiki/Fr%C3%A9chet-Verteilung";
lang.distributions.frechet.parameterInfoDelta="Lageparameter";
lang.distributions.frechet.parameterInfoBeta="Skalenparameter";
lang.distributions.frechet.parameterInfoAlpha="Formparameter";

lang.distributions.logarithmic={};
lang.distributions.logarithmic.name="Logarithmische Verteilung";
lang.distributions.logarithmic.info="Die logarithmische Verteilung wird u.a. in der Versicherungsmathematik als Schadenshöhenverteilung verwendet.";
lang.distributions.logarithmic.wikipedia="https://de.wikipedia.org/wiki/Logarithmische_Verteilung";
lang.distributions.logarithmic.parameterInfoP="Erfolgswahrscheinlichkeit";

lang.distributions.logCauchy={};
lang.distributions.logCauchy.name="Log-Cauchy-Verteilung";
lang.distributions.logCauchy.info="Die Log-Cauchy-Verteilung ergibt sich, wenn eine Cauchy-verteilte Zufallsvariable logarithmiert wird.";
lang.distributions.logCauchy.wikipedia="https://en.wikipedia.org/wiki/Log-Cauchy_distribution"; /* No German Wikipedia page */
lang.distributions.logCauchy.parameterInfoMu="Lageparameter";
lang.distributions.logCauchy.parameterInfoSigma="Skalenparameter";

lang.distributions.borel={};
lang.distributions.borel.name="Borel-Verteilung";
lang.distributions.borel.info="Die Borel-Verteilung kommt bei der Modellierung von Verzweigungsprozessen und in der Warteschlangentheorie zum Einsatz. Wenn die Anzahl der Nachkommen eines Lebenswesens mit einem Erwartungswert kleiner als 1 Poisson-verteilt ist, dann ist die Gesamtzahl an Nachkommen (über alle Generationen hinweg) Borel verteilt.";
lang.distributions.borel.wikipedia="https://en.wikipedia.org/wiki/Borel_distribution"; /* No German Wikipedia page */
lang.distributions.borel.parameterInfoMu="Erwartungswert der zugehörigen Poisson-Verteilung";

lang.distributions.bernoulli={};
lang.distributions.bernoulli.name="Bernoulli-Verteilung";
lang.distributions.bernoulli.info="Die Bernoulli-Verteilung wird zur Modellierung von zufälligen Ereignissen, bei denen nur zwei Ausgänge möglich sind, verwendet. Die möglichen Ergebnisse werden dann meist \"Erfolg\" und \"Misserfolg\". Dem Erfolg wird dann die Wahrscheinlichkeit <i>p</i> zugeordnet.";
lang.distributions.bernoulli.wikipedia="https://de.wikipedia.org/wiki/Bernoulli-Verteilung";
lang.distributions.bernoulli.parameterInfoP="Wahrscheinlichkeit für einen Erfolg";

lang.distributions.gaussKuzmin={};
lang.distributions.gaussKuzmin.name="Gauss-Kuzmin-Verteilung";
lang.distributions.gaussKuzmin.info="Die Gauss-Kuzmin-Verteilung tritt als Grenzverteilung für die Koeffizienten von Kettenbrüchen auf.";
lang.distributions.gaussKuzmin.wikipedia="https://en.wikipedia.org/wiki/Gauss%E2%80%93Kuzmin_distribution"; /* No German Wikipedia page */

lang.distributions.cosine={};
lang.distributions.cosine.name="Cosinus-Verteilung";
lang.distributions.cosine.info="Die Cosinus-Verteilung ist eine symmetrische Verteilungsfunktion auf einem abgeschlossenen Intervall. Sie weist der Intervallmitte die hohe Wahrscheinlichkeiten und den Rändern niedrige Wahrscheinlichkeiten zu.";
lang.distributions.cosine.wikipedia="https://en.wikipedia.org/wiki/Raised_cosine_distribution"; /* No German Wikipedia page */
lang.distributions.cosine.parameterInfoa="Untere Bereichsgrenze";
lang.distributions.cosine.parameterInfob="Obere Bereichsgrenze";
lang.distributions.cosine.parameterInfobError="Die obere Bereichsgrenze <i>b</i> muss größer oder gleich der unteren Bereichsgrenze <i>a</i> sein.";

lang.distributions.logGamma={};
lang.distributions.logGamma.name="Logarithmische Gammaverteilung";
lang.distributions.logGamma.info="Die logarithmische Gammaverteilung ist eine Verteilung mit schweren Rändern. Sie wird zur Modellierung der Schadensdaten von extremen Großschäden verwendet.";
lang.distributions.logGamma.wikipedia="https://de.wikipedia.org/wiki/Logarithmische_Gammaverteilung";
lang.distributions.logGamma.parameterInfoa="Parameter a";
lang.distributions.logGamma.parameterInfob="Parameter b";

lang.distributions.inverseGamma={};
lang.distributions.inverseGamma.name="Inverse Gammaverteilung";
lang.distributions.inverseGamma.info="Die inverse Gammaverteilung liefert den reziproken Wert einer gammaverteilten Zufallsvariable. Die inverse Gammaverteilung wird vor allem in der Bayes-Statistik verwendet.";
lang.distributions.inverseGamma.wikipedia="https://en.wikipedia.org/wiki/Inverse-gamma_distribution"; /* No German Wikipedia page */
lang.distributions.inverseGamma.parameterInfoAlpha="Form";
lang.distributions.inverseGamma.parameterInfoBeta="Skalierung";

lang.distributions.continuousBernoulli={};
lang.distributions.continuousBernoulli.name="Kontinuierliche Bernoulli-Verteilung";
lang.distributions.continuousBernoulli.info="Die kontinuierliche Bernoulli-Verteilung wird beim Deep Learning und in der Bilderkennung zur Modellierung von Intensitäten verwendet.";
lang.distributions.continuousBernoulli.wikipedia="https://en.wikipedia.org/wiki/Continuous_Bernoulli_distribution"; /* No German Wikipedia page */
lang.distributions.continuousBernoulli.parameterInfoa="Untere Bereichsgrenze";
lang.distributions.continuousBernoulli.parameterInfob="Obere Bereichsgrenze";
lang.distributions.continuousBernoulli.parameterInfoLambda="Verteilungsparameter";
lang.distributions.continuousBernoulli.parameterInfobError="Die obere Bereichsgrenze <i>b</i> muss größer oder gleich der unteren Bereichsgrenze <i>a</i> sein.";

lang.distributions.halfCauchy={};
lang.distributions.halfCauchy.name="Halbe Cauchy-Verteilung";
lang.distributions.halfCauchy.info="";
lang.distributions.halfCauchy.wikipedia=""; /* No Wikipedia page available */
lang.distributions.halfCauchy.parameterInfoMu="Lage";
lang.distributions.halfCauchy.parameterInfoSigma="Skalierung";

lang.numbers={};
lang.numbers.N="Natürliche Zahlen";
lang.numbers.N0="Natürliche Zahlen zzgl. der Null";
lang.numbers.Z="Ganze Zahlen";
lang.numbers.R="Reelle Zahlen";
lang.numbers.RPlus="Positive reelle Zahlen";
lang.numbers.RPlus0="Nichtnegative reelle Zahlen";

lang.functions={};
lang.functions.Gamma="Gammafunktion";
lang.functions.inGamma="Unvollständige obere Gammafunktion";
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
lang.GUI.permaLink="Permalink to this page with these settings";
lang.GUI.downloadLabel="This webapp is also available as an offline usable application:";
lang.GUI.downloadButton="Download";
lang.GUI.downloadButtonExe="Windows application (exe)";
lang.GUI.downloadButtonZip="Linux and macOS application (zip)";
lang.GUI.toolsLabel="More tools:";
lang.GUI.size={};
lang.GUI.size.collapse="Save space";
lang.GUI.size.expand="Show all";

lang.distributions={};
lang.distributions.typeDiscrete="discrete";
lang.distributions.typeDiscreteFull="Discrete probability distributions";
lang.distributions.typeContinuous="continuous";
lang.distributions.typeContinuousFull="Continuous probability distributions";
lang.distributions.countDiscrete="discrete probability distributions";
lang.distributions.countContinuous="continuous probability distributions";
lang.distributions.countSum="probability distributions";
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
lang.distributions.infoCharacteristicsMedian="Median";
lang.distributions.infoCharacteristicsMode="Mode";
lang.distributions.infoCharacteristicsWikipedia="Wikipedia page";
lang.distributions.infoDiagramRate="Rate";
lang.distributions.infoDiagramProbability="Probability";
lang.distributions.infoDiagramPDFDiscrete="Probability distribution function";
lang.distributions.infoDiagramPDFContinuous="Probability distribution function";
lang.distributions.infoDiagramCDF="Cumulative distribution function";
lang.distributions.infoDiagramResetZoom="Reset zoom";
lang.distributions.infoDiagramZoomInfo="By holding down the <span class='border rounded-1 ps-1 pe-1 bg-light'><tt>Ctrl</tt></span> key, the mouse wheel can be used to zoom in and out, and zoom frames can be drawn.";
lang.distributions.infoDiagramShowValues="Table";
lang.distributions.infoDiagramShowValuesFile="table.html";
lang.distributions.infoDiagramSimFile="sim.html";
lang.distributions.infoDiagramShowValuesStep="Step";
lang.distributions.infoExportTabelle="Export table";
lang.distributions.infoDiagramCopyValues="Copy values";
lang.distributions.infoDiagramSaveValues="Save values";
lang.distributions.infoDiagramSaveValuesTextFiles="Text files";
lang.distributions.infoDiagramExport="Export diagram";
lang.distributions.infoDiagramExportCopy="Copy diagram to clipboard";
lang.distributions.infoDiagramExportCopyError="Your browser does not support copying images to clipboard.";
lang.distributions.infoDiagramExportSave="Save diagram as graphics file";
lang.distributions.infoDiagramFit="Distribution fitting";
lang.distributions.infoDiagramFitInfo="Search for a distribution that describes the values as good as possible";
lang.distributions.infoDiagramCloseWindow="Close window";
lang.distributions.infoDiagramCloseWindowShort="Close";
lang.distributions.infoDiagramTable="Density and distribution";
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
lang.distributions.infoDiagramGenerateRandomNumbersWorking="Generating pseudo random numbers...";
lang.distributions.infoCalcParameter="Parameter";
lang.distributions.infoCalcValues="Calculate values";
lang.distributions.infoCalcValuesError="Please correct the values for the distribution parameters. Then probability values can be calculated here.";
lang.distributions.infoDiagramLawOfLargeNumbers="Law of large numbers";
lang.distributions.infoDiagramLawOfLargeNumbersWikipedia="https://en.wikipedia.org/wiki/Law_of_large_numbers";
lang.distributions.infoDiagramLawOfLargeNumbersInfo=`The arithmetic mean
<math><mrow><mfrac><mrow><mn>1</mn></mrow><mrow><mi>n</mi></mrow></mfrac><munderover><mo>&sum;</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mi>n</mi></munderover><msub><mi>X</mi><mi>i</mi></msub></math>
of i.i.d. distributed random variables almost certainly converges towards the expected value
<math><mrow><mi mathvariant='normal'>E</mi><mo>[</mo><msub><mi>X</mi><mn>1</mn></msub><mo>]</mo></mrow></math>.
To illustrate this, random numbers are generated for the selected distribution (this corresponds to an observation of <math><msub><mi>X</mi><mn>1</mn></msub></math>, <math><msub><mi>X</mi><mn>2</mn></msub></math>, ...).
The disgram on the right shows the (count) density of the distribution and the relative frequencies of the simulated values. In the left-hand diagram, the green line marks the expected value <math><mrow><mi mathvariant='normal'>E</mi><mo>[</mo><msub><mi>X</mi><mn>1</mn></msub><mo>]</mo></mrow></math>,
the red line shows the course of the arithmetic mean of the random numbers.`;
lang.distributions.infoDiagramLawOfLargeNumbersHeadingMeanExpectedValue="Mean and expected value";
lang.distributions.infoDiagramLawOfLargeNumbersHeadingDensitySample="Density and sample";
lang.distributions.infoDiagramLawOfLargeNumbersScaleExpectedValueMean="Expected value or mean value";
lang.distributions.infoDiagramLawOfLargeNumbersScalePercentage="Percentage";
lang.distributions.infoDiagramLawOfLargeNumbersDatasetExpectedValue="Expected value";
lang.distributions.infoDiagramLawOfLargeNumbersDatasetMean="Arithmetic mean";
lang.distributions.infoDiagramLawOfLargeNumbersDatasetDiscreteDensity="Count density";
lang.distributions.infoDiagramLawOfLargeNumbersDatasetDiscreteSample="Sample";
lang.distributions.infoDiagramLawOfLargeNumbersDatasetContinuousDensity="Density";
lang.distributions.infoDiagramLawOfLargeNumbersDatasetContinuousDensityHistogramBarWidth="Histogram bar width";
lang.distributions.infoDiagramLawOfLargeNumbersDatasetContinuousSample="Simaple";
lang.distributions.infoDiagramLawOfLargeNumbersControlStep="Step";
lang.distributions.infoDiagramLawOfLargeNumbersControlStart="Start";
lang.distributions.infoDiagramLawOfLargeNumbersControlStop="Stop";
lang.distributions.infoDiagramLawOfLargeNumbersControlReset="Reset";
lang.distributions.infoDiagramLawOfLargeNumbersControlSteps="Number of steps";
lang.distributions.infoDiagramLawOfLargeNumbersControlStepsInput="Performs the specified number of simulation steps.";
lang.distributions.infoDiagramLawOfLargeNumbersInfoNewestRandomNumber="Newest random number";
lang.distributions.infoDiagramLawOfLargeNumbersInfoSampleValues="Sample values";
lang.distributions.infoDiagramLawOfLargeNumbersInfoExpectedValueOfDistribution="Expected value of the probability distribution";
lang.distributions.infoDiagramLawOfLargeNumbersInfoArithmeticMeanOfTheSampleValues="Arithmetic mean of the sample values";
lang.distributions.infoDiagramLawOfLargeNumbersInfoRelativeDeviationMeanExpectedValue="Relative deviation of mean value from expected value";
lang.distributions.infoDiagramLawOfLargeNumbersInfoSum="Sum";
lang.distributions.infoDiagramCentralLimitTheorem="Central limit theorem";
lang.distributions.infoDiagramCentralLimitTheoremWikipedia="https://en.wikipedia.org/wiki/Central_limit_theorem";
lang.distributions.infoDiagramCentralLimitTheoremInfo="For i.i.d. distributed random variables <i>X</i><sub>1</sub>, <i>X</i><sub>2</sub>, ... with common expected value &mu; and common variance &sigma;<sup>2</sup> the partial sum <math><mrow><msub><mi>Y</mi><mi>n</mi></msub><mo>=</mo><mfrac><mn>1</mn><msqrt><mi>n</mi></msqrt></mfrac><munderover><mo>&sum;</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow><mo>&infin;</mo></munderover><mfrac><mrow><msub><mn>x</mn><mn>i</mn></msub><mo>-</mo><mn>&mu;</mn></mrow><mn>&sigma;</mn></mfrac></math> tends for <i>n</i>&rarr;&infin; in distribution to the standard normal distribution <i>N</i>(0,1). For illustration purposes, the <i>X<sub>i</sub></i> are replaced by simulated random numbers for the selected distribution. The relative frequencies of the <i>Y<sub>n</sub></i> values determined for this are displayed in the right chart; they quickly approach the density of <i>N</i>(0,1)</i>.";
lang.distributions.infoDiagramCentralLimitTheoremHeadingSample="Sample";
lang.distributions.infoDiagramCentralLimitTheoremHeadingStandardNormalDistribution="Standard normal distribution";
lang.distributions.infoDiagramCentralLimitTheoremDatasetDensityPhi="Density of standard normal distribution";
lang.distributions.infoDiagramCentralLimitTheoremDatasetPartialSumSample="Histogram of the partial sums";
lang.distributions.infoDiagramCentralLimitTheoremNewestParialSum="Newest partial sum";
lang.distributions.infoDiagramCentralLimitTheoremValuesPerPartialSum="Values per partial sum";
lang.distributions.infoDiagramCentralLimitTheoremNumberOfPartialSums="Number of partial sums";
lang.distributions.infoDiagramCentralLimitTheoremMeanOfSample="Arithmetic mean of the sample values";
lang.distributions.infoDiagramCentralLimitTheoremMeanOfPartialSums="Arithmetic mean of the partial sums";
lang.distributions.infoDiagramCentralLimitTheoremVarianceOfPartialSums="Variance of the partial sums";
lang.distributions.infoDiagramDiceRollSimulation="Dice roll simulation";
lang.distributions.infoDiagramNumberOfDots="Number of dots";
lang.distributions.infoDiagramAbsoluteFrequency="Absolute frequency";
lang.distributions.infoDiagramRelativeFrequency="Relative frequency";
lang.distributions.PDFDiscrete="Count density";
lang.distributions.PDFContinuous="Density";
lang.distributions.CDF="Cumulative distribution function";
lang.distributions.scipyTooltip="SciPy Python-Code for this distribution";
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
lang.distributions.showExpectedValue="Draw expected value";
lang.distributions.showStandardDeviation="Draw standard deviation";
lang.distributions.showMedian="Draw median";
lang.distributions.xAutoRange="x auto range";
lang.distributions.EulerMascheroni="Approximation for the Euler Mascheroni constant";

lang.fitter={};
lang.fitter.title="Distribution fitter";
lang.fitter.info="In distribution fitting, the indicators of the measured values are calculated first. The various distributions are parameterized on this basis. The distributions configured in this way are compared with the histogram formed from the measured values. The smaller the respective sum of squared errors &Delta;, the better the distribution fits the measured values.";
lang.fitter.inputValues="Input values";
lang.fitter.inputValuesLoadInfo="<b>Drop a file containing values here to load the data.</b><small>The data is processed completely locally in the browser. No data is transferred to the Internet.</small>";
lang.fitter.inputValuesLoadError="The file did not contain any numbers.";
lang.fitter.loadedValues="Loaded values";
lang.fitter.loadedValuesCount="Number of values";
lang.fitter.loadedValuesMinimum="Minimum";
lang.fitter.loadedValuesMaximum="Maximum";
lang.fitter.loadedValuesMean="Mean";
lang.fitter.loadedValuesStandardDeviation="Standard deviation";
lang.fitter.outputHeader="Distribution fitting results";
lang.fitter.outputHeaderInfo="distributions tested";
lang.fitter.outputNoFit="no fit possible for the input data";
lang.fitter.histogram="Histogram";
lang.fitter.fittedDistribution="Fitted distribution";
lang.fitter.openInEditor="Open in distribution editor";
lang.fitter.infoDelta="Square discrepancy between histogram and density. The smaller this value is, the better the distribution function describes the values of the histogram.";
lang.fitter.infoPValueKS="p-value for the Kolmogorov-Smirnov adjustment test. The higher the p-value, the more difficult it is to reject the hypothesis that the samples are based on the respective distribution.";
lang.fitter.infoPValueChiSqr="p-value for the &chi;² adjustment test. The higher the p-value, the more difficult it is to reject the hypothesis that the samples are based on the respective distribution.";

lang.lcg={};
lang.lcg.title="Linear congruential generator";
lang.lcg.wikipedia="https://en.wikipedia.org/wiki/Linear_congruential_generator";
lang.lcg.info=`
<p>For stochastic simulations, <strong>random numbers</strong> that are distributed according to certain probability distributions are required. These random numbers are obtained using various distribution-dependent methods from random numbers that are equally distributed on the interval [0,1].</p>
<p>In general, no real random numbers can be generated in a deterministic computer, only <strong>pseudo-random numbers</strong>. Although these Peudo random numbers are also approximately uniformly distributed on the interval [0,1] and fulfill a number of criteria of true random numbers, they still have certain regularities that true random numbers do not have. For applications in cryptography, it is important that these regularities are as small as possible and, in particular, that it is not possible to deduce the next pseudo-random number from a series of pseudo-random numbers. For use in stochastic simulation, however, no such strong prerequisites are necessary, so that <strong>linear congruence generators</strong> are often used here to generate random numbers.</p>
<p>In a linear congruence generator, the next random number (<strong>a<sub>n+1</sub></strong>) is obtained from the previous one by multiplying the last value by a fixed number (<strong>b</strong>) and then adding a fixed value (<strong>c</strong>). Finally, the result is considered modulo another fixed value (<strong>m</strong>). To obtain a distribution between 0 and 1, the numbers determined in this way are divided by the selected module:</p>
<p>
<strong>a<sub>0</sub></strong> := Initial value<br>
<strong>a<sub>n+1</sub></strong> := <strong>b&middot;a<sub>n</sub>+c mod m</strong><br>
Random number: <strong>u<sub>n</sub></strong> := <strong>a<sub>n</sub>/m</strong>
</p>
<p>The quality of the random numbers, i.e. how well the resulting values approximate a uniform distribution to [0,1], depends on the choice of <strong>b</strong>, <strong>c</strong> and <strong>m</strong>.</p>
`;
lang.lcg.pseudoRandomNumbers="Pseudo-random numbers";
lang.lcg.showCompleteTable="Show complete table";
lang.lcg.gridStructure="Grid structure";
lang.lcg.processing="Processing...";
lang.lcg.tableHeading="Calculation of random numbers according to the calculation rule";
lang.lcg.tableHeadingWithInitialValue="with initial value";
lang.lcg.tableHeadingAnd="and";
lang.lcg.resultA="The period length is more than";
lang.lcg.resultB="The period length is";
lang.lcg.resultC="this means after";
lang.lcg.resultD="numbers the series starts again.";
lang.lcg.resultInfoA="The maximum period length for a linear congruence generator with module";
lang.lcg.resultInfoB="is";
lang.lcg.resultInfoC="The selected parameters make optimum use of the maximum possible period length.";
lang.lcg.resultInfoD="The parameters selected for the multiplicative and additive parameters are therefore not optimal. Instructions on how to select the parameters in order to achieve the maximum period length can be found <a href='https://en.wikipedia.org/wiki/Linear_congruential_generator' target='_blank'>here</a>.";

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
lang.distributions.gamma.parameterInfoBeta="Scale";

lang.distributions.erlang={};
lang.distributions.erlang.name="Erlang distribution";
lang.distributions.erlang.info="If the values of <b>n</b> exponential distributions with parameter <math style='font-size: 120%'><mrow><mfrac><mn>1</mn><mi><b>&lambda;</b></mi></mfrac></mrow></math> are added, the Erlang distribution is obtained. Thus, the Erlang distribution results e.g. for the waiting time of a customer in a queue of known length and exponentially distributed service times.";
lang.distributions.erlang.wikipedia="https://en.wikipedia.org/wiki/Erlang_distribution";
lang.distributions.erlang.parameterInfon="Shape";
lang.distributions.erlang.parameterInfoLambda="Scale";

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

lang.distributions.sawtoothLeft={};
lang.distributions.sawtoothLeft.name="Left Sawtooth distribution";
lang.distributions.sawtoothLeft.info="The sawtooth distributions represent a simplified special case of the triangular distribution.";
lang.distributions.sawtoothLeft.wikipedia="https://en.wikipedia.org/wiki/Triangular_distribution";
lang.distributions.sawtoothLeft.parameterInfoa="Lower bound";
lang.distributions.sawtoothLeft.parameterInfob="Upper bound";
lang.distributions.sawtoothLeft.parameterInfobError="The upper bound <i>b</i> has to be equal or larger than the lower bound <i>a</i>.";

lang.distributions.sawtoothRight={};
lang.distributions.sawtoothRight.name="Right Sawtooth distribution";
lang.distributions.sawtoothRight.info="The sawtooth distributions represent a simplified special case of the triangular distribution.";
lang.distributions.sawtoothRight.wikipedia="https://en.wikipedia.org/wiki/Triangular_distribution";
lang.distributions.sawtoothRight.parameterInfoa="Lower bound";
lang.distributions.sawtoothRight.parameterInfob="Upper bound";
lang.distributions.sawtoothRight.parameterInfobError="The upper bound <i>b</i> has to be equal or larger than the lower bound <i>a</i>.";

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
lang.distributions.halfNormal.wikipedia="https://en.wikipedia.org/wiki/Half-normal_distribution";
lang.distributions.halfNormal.parameterInfoS="Shift";
lang.distributions.halfNormal.parameterInfoMu="Expected value";

lang.distributions.irwinhall={};
lang.distributions.irwinhall.name="Irwin-Hall distribution";
lang.distributions.irwinhall.info="The Irwin-Hall distribution is the distribution of the sum of independent random variables that are uniform distributed in the interval [0;1].";
lang.distributions.irwinhall.wikipedia="https://en.wikipedia.org/wiki/Irwin%E2%80%93Hall_distribution";
lang.distributions.irwinhall.parameterInfon="Number uniform distributions to be summed";

lang.distributions.wignerSemicircle={};
lang.distributions.wignerSemicircle.name="Wigner semicircle distribution";
lang.distributions.wignerSemicircle.info="In the distribution named after the physicist Eugene Wigner, the density forms a semicircle with a radius <b>R</b>. The distribution occurs, among other things, as a limit distribution of the eigenvalues of various symmetrical matrices.";
lang.distributions.wignerSemicircle.wikipedia="https://en.wikipedia.org/wiki/Wigner_semicircle_distribution";
lang.distributions.wignerSemicircle.parameterInfoM="Center point";
lang.distributions.wignerSemicircle.parameterInfoR="Radius";

lang.distributions.uQuadratic={}
lang.distributions.uQuadratic.name="U-quadratic distribution";
lang.distributions.uQuadratic.info="The U-quadratic distribution can be used for modelling symmetric bimodal processes.";
lang.distributions.uQuadratic.wikipedia="https://en.wikipedia.org/wiki/U-quadratic_distribution";
lang.distributions.uQuadratic.parameterInfoa="Lower bound";
lang.distributions.uQuadratic.parameterInfob="Upper bound";
lang.distributions.uQuadratic.parameterInfobError="The upper bound <i>b</i> has to be equal or larger than the lower bound <i>a</i>.";

lang.distributions.reciprocal={}
lang.distributions.reciprocal.name="Reciprocal distribution";
lang.distributions.reciprocal.info="The reciprocal distribution is also known as the log-uniform distribution.";
lang.distributions.reciprocal.wikipedia="https://en.wikipedia.org/wiki/Reciprocal_distribution"; /* Leider keine deutsche Seite vorhanden */
lang.distributions.reciprocal.parameterInfoa="Lower bound";
lang.distributions.reciprocal.parameterInfob="Upper bound";
lang.distributions.reciprocal.parameterInfobError="The upper bound <i>b</i> has to be equal or larger than the lower bound <i>a</i>.";

lang.distributions.kumaraswamy={};
lang.distributions.kumaraswamy.name="Kumaraswamy distribution";
lang.distributions.kumaraswamy.info="Similar to the beta distribution, the Kumaraswamy distribution is suitable for modeling processes that can only have values in a finite range. In contrast to the beta distribution, however, the density and distribution function can be expressed using elementary formulas.";
lang.distributions.kumaraswamy.wikipedia="https://en.wikipedia.org/wiki/Kumaraswamy_distribution";
lang.distributions.kumaraswamy.parameterInfoA="Shape";
lang.distributions.kumaraswamy.parameterInfoB="Shape";

lang.distributions.sine={}
lang.distributions.sine.name="Sine distribution";
lang.distributions.sine.info="The sine distribution uses the scaled first arc of the sine function.";
lang.distributions.sine.wikipedia=null;

lang.distributions.arcsine={}
lang.distributions.arcsine.name="Arcsine distribution";
lang.distributions.arcsine.info="";
lang.distributions.arcsine.wikipedia=null;

lang.distributions.gumbel={};
lang.distributions.gumbel.name="Gumbel distribution";
lang.distributions.gumbel.info="The Gumbel distribution is also known as double exponential distribution.";
lang.distributions.gumbel.wikipedia="https://en.wikipedia.org/wiki/Gumbel_distribution";
lang.distributions.gumbel.parameterInfoMean="Expected value";
lang.distributions.gumbel.parameterInfoStd="Standard deviation";

lang.distributions.hyperbolicSecant={};
lang.distributions.hyperbolicSecant.name="Hyperbolic secant distribution";
lang.distributions.hyperbolicSecant.info="";
lang.distributions.hyperbolicSecant.wikipedia="https://en.wikipedia.org/wiki/Hyperbolic_secant_distribution";
lang.distributions.hyperbolicSecant.parameterInfoMu="Location (mean)";
lang.distributions.hyperbolicSecant.parameterInfoSigma="Scale (standard deviation)";

lang.distributions.inverseGaussian={};
lang.distributions.inverseGaussian.name="Inverse Gaussian distribution";
lang.distributions.inverseGaussian.info="The inverse Gaussian distribution, also known as the inverse normal distribution, is used in generalized linear models.";
lang.distributions.inverseGaussian.wikipedia="https://en.wikipedia.org/wiki/Inverse_Gaussian_distribution";
lang.distributions.inverseGaussian.parameterInfoLambda="Event rate";
lang.distributions.inverseGaussian.parameterInfoMu="Expected value";

lang.distributions.johnson={};
lang.distributions.johnson.name="Johnson SU distribution";
lang.distributions.johnson.nameFormat="Johnson S<sub>U</sub> distribution";
lang.distributions.johnson.info="The Johnson S<sub>U</sub>-distribution is a four-parameter probability distributionsdeveloped by N. L. Johnson. The distribution is being used to model asset returns for portfolio management.";
lang.distributions.johnson.wikipedia="https://en.wikipedia.org/wiki/Johnson%27s_SU-distribution";
lang.distributions.johnson.parameterInfoGamma=""; /* No special names for parameters */
lang.distributions.johnson.parameterInfoXi=""; /* No special names for parameters */
lang.distributions.johnson.parameterInfoDelta=""; /* No special names for parameters */
lang.distributions.johnson.parameterInfoLambda=""; /* No special names for parameters */

lang.distributions.levy={};
lang.distributions.levy.name="Lévy distribution";
lang.distributions.levy.info="The Lévy distribution has an infinite expected value as a special property.";
lang.distributions.levy.wikipedia="https://en.wikipedia.org/wiki/L%C3%A9vy_distribution";
lang.distributions.levy.parameterInfoMu="Location";
lang.distributions.levy.parameterInfoGamma="Scale";

lang.distributions.logistic={};
lang.distributions.logistic.name="Logistic distribution";
lang.distributions.logistic.info="The logistic distribution is used in particular to describe growth processes with a tendency towards saturation.";
lang.distributions.logistic.wikipedia="https://en.wikipedia.org/wiki/Logistic_distribution";
lang.distributions.logistic.parameterInfoMu="Location";
lang.distributions.logistic.parameterInfoS="Scale";

lang.distributions.logLogistic={};
lang.distributions.logLogistic.name="Log-logistic distribution";
lang.distributions.logLogistic.info="The log-logistic distribution is used in survival analysis as a parametric model for events whose rate increases initially and decreases later.";
lang.distributions.logLogistic.wikipedia="https://en.wikipedia.org/wiki/Log-logistic_distribution";
lang.distributions.logLogistic.parameterInfoAlpha="Scale";
lang.distributions.logLogistic.parameterInfoBeta="Shape";

lang.distributions.maxwellBoltzmann={};
lang.distributions.maxwellBoltzmann.name="Maxwell-Boltzmann distribution";
lang.distributions.maxwellBoltzmann.info="The Maxwell-Boltzmann distribution is used in thermodynamics to describe particle velocities in ideal gases.";
lang.distributions.maxwellBoltzmann.wikipedia="https://en.wikipedia.org/wiki/Maxwell%E2%80%93Boltzmann_distribution";
lang.distributions.maxwellBoltzmann.parameterInfoA="Scale";

lang.distributions.pert={};
lang.distributions.pert.name="Pert distribution";
lang.distributions.pert.info="The Pert distribution uses the same parameters as the triangular distribution, but unlike the triangular distribution, it has a smoother curve.";
lang.distributions.pert.wikipedia="https://en.wikipedia.org/wiki/PERT_distribution";
lang.distributions.pert.parameterInfoa="Lower bound";
lang.distributions.pert.parameterInfob="Mode";
lang.distributions.pert.parameterInfoc="Upper bound";
lang.distributions.pert.parameterInfobError="The mode <i>b</i> has to be equal or larger than the lower bound <i>a</i>.";
lang.distributions.pert.parameterInfocError="The upper bound <i>c</i> has to be equal or larger than the mode <i>b</i>.";

lang.distributions.power={};
lang.distributions.power.name="Power distribution";
lang.distributions.power.info="The power distribution is an inverse Pareto distribution.";
lang.distributions.power.wikipedia="https://en.wikipedia.org/wiki/Pareto_distribution#Inverse-Pareto_Distribution_/_Power_Distribution";
lang.distributions.power.parameterInfoa="Lower bound";
lang.distributions.power.parameterInfob="Upper bound";
lang.distributions.power.parameterInfobError="The upper bound <i>b</i> has to be equal or larger than the lower bound <i>a</i>.";
lang.distributions.power.parameterInfoc="Potentiation value";

lang.distributions.rayleigh={};
lang.distributions.rayleigh.name="Rayleigh distribution";
lang.distributions.rayleigh.info="If two normally distributed, stochastically independent random variables are interpreted as a two-dimensional vector, the absolute value of the vector is Rayleigh-distributed.";
lang.distributions.rayleigh.wikipedia="https://en.wikipedia.org/wiki/Rayleigh_distribution";
lang.distributions.rayleigh.parameterInfom="Expected value";

lang.distributions.fatigueLife={};
lang.distributions.fatigueLife.name="Fatigue life distribution";
lang.distributions.fatigueLife.info="The fatigue life distribution is mainly used in reliability theory.";
lang.distributions.fatigueLife.wikipedia="https://en.wikipedia.org/wiki/Birnbaum%E2%80%93Saunders_distribution";
lang.distributions.fatigueLife.parameterInfoMu="Location";
lang.distributions.fatigueLife.parameterInfoBeta="Scale";
lang.distributions.fatigueLife.parameterInfoGamma="Shape";

lang.distributions.frechet={};
lang.distributions.frechet.name="Fréchet distribution";
lang.distributions.frechet.info="The Fréchet distribution is also known as inverse Weibull distribution. The distribution is named after the French mathematican <a href='https://en.wikipedia.org/wiki/Maurice_Fr%C3%A9chet' target='_blank'>Maurice René Fréchet</a> and is use to model exterm events (like the amount of rain on a single day).";
lang.distributions.frechet.wikipedia="https://en.wikipedia.org/wiki/Fr%C3%A9chet_distribution";
lang.distributions.frechet.parameterInfoDelta="Location";
lang.distributions.frechet.parameterInfoBeta="Scale";
lang.distributions.frechet.parameterInfoAlpha="Shape";

lang.distributions.logarithmic={};
lang.distributions.logarithmic.name="Logarithmic distribution";
lang.distributions.logarithmic.info="The logarithmic distribution is used in actuarial mathematics, for example, as a loss amount distribution.";
lang.distributions.logarithmic.wikipedia="https://en.wikipedia.org/wiki/Logarithmic_distribution";
lang.distributions.logarithmic.parameterInfoP="Success probability";

lang.distributions.logCauchy={};
lang.distributions.logCauchy.name="Log-Cauchy distribution";
lang.distributions.logCauchy.info="The Log-Cauchy distribution results when a Cauchy-distributed random variable is logarithmized.";
lang.distributions.logCauchy.wikipedia="https://en.wikipedia.org/wiki/Log-Cauchy_distribution";
lang.distributions.logCauchy.parameterInfoMu="Location";
lang.distributions.logCauchy.parameterInfoSigma="Scale";

lang.distributions.borel={};
lang.distributions.borel.name="Borel distribution";
lang.distributions.borel.info="The Borel distribution is used in the modeling of branching processes and in queueing theory. If the number of offspring of a living being is Poisson distributed with an expected value less than 1, then the total number of offspring (across all generations) is Borel distributed.";
lang.distributions.borel.wikipedia="https://en.wikipedia.org/wiki/Borel_distribution";
lang.distributions.borel.parameterInfoMu="Expected value of the corresponding Poisson distribution";

lang.distributions.bernoulli={};
lang.distributions.bernoulli.name="Bernoulli distribution";
lang.distributions.bernoulli.info="The Bernoulli distribution is used to model random events where only two outcomes are possible. The possible outcomes are then usually \"success\" and \"failure\". The probability <i>p</i> is then assigned to success.";
lang.distributions.bernoulli.wikipedia="https://en.wikipedia.org/wiki/Bernoulli_distribution";
lang.distributions.bernoulli.parameterInfoP="Probability for success";

lang.distributions.gaussKuzmin={};
lang.distributions.gaussKuzmin.name="Gauss-Kuzmin distribution";
lang.distributions.gaussKuzmin.info="The Gauss-Kuzmin distribution occurs as a limit distribution for the coefficients of continued fractions.";
lang.distributions.gaussKuzmin.wikipedia="https://en.wikipedia.org/wiki/Gauss%E2%80%93Kuzmin_distribution";

lang.distributions.cosine={};
lang.distributions.cosine.name="Cosine distribution";
lang.distributions.cosine.info="The cosine distribution is a symmetrical distribution function on a closed interval. It assigns high probabilities to the center of the interval and low probabilities to the edges.";
lang.distributions.cosine.wikipedia="https://en.wikipedia.org/wiki/Raised_cosine_distribution";
lang.distributions.cosine.parameterInfoa="Lower bound";
lang.distributions.cosine.parameterInfob="Upper bound";
lang.distributions.cosine.parameterInfobError="The upper bound <i>b</i> has to be equal or larger than the lower bound <i>a</i>.";

lang.distributions.logGamma={};
lang.distributions.logGamma.name="Logarithmic gamma distribution";
lang.distributions.logGamma.info="The logarithmic gamma distribution is a heavy-tailed distribution. It is used to model the damage data of extreme major damages.";
lang.distributions.logGamma.wikipedia="https://de.wikipedia.org/wiki/Logarithmische_Gammaverteilung"; /* No English Wikipedia page */
lang.distributions.logGamma.parameterInfoa="Parameter a";
lang.distributions.logGamma.parameterInfob="Parameter b";

lang.distributions.inverseGamma={};
lang.distributions.inverseGamma.name="Inverse gamma distribution";
lang.distributions.inverseGamma.info="The inverse gamma distribution provides the reciprocal value of a gamma-distributed random variable. The inverse gamma distribution is mainly used in Bayesian statistics.";
lang.distributions.inverseGamma.wikipedia="https://en.wikipedia.org/wiki/Inverse-gamma_distribution";
lang.distributions.inverseGamma.parameterInfoAlpha="Shape";
lang.distributions.inverseGamma.parameterInfoBeta="Scale";

lang.distributions.continuousBernoulli={};
lang.distributions.continuousBernoulli.name="Continuous Bernoulli distribution";
lang.distributions.continuousBernoulli.info="The continuous Bernoulli distribution is used in deep learning and computer vision to model intensities.";
lang.distributions.continuousBernoulli.wikipedia="https://en.wikipedia.org/wiki/Continuous_Bernoulli_distribution";
lang.distributions.continuousBernoulli.parameterInfoa="Lower bound";
lang.distributions.continuousBernoulli.parameterInfob="Upper bound";
lang.distributions.continuousBernoulli.parameterInfoLambda="Distribution parameter";
lang.distributions.continuousBernoulli.parameterInfobError="The upper bound <i>b</i> has to be equal or larger than the lower bound <i>a</i>.";

lang.distributions.halfCauchy={};
lang.distributions.halfCauchy.name="Half Cauchy distribution";
lang.distributions.halfCauchy.info="";
lang.distributions.halfCauchy.wikipedia=""; /* No Wikipedia page available */
lang.distributions.halfCauchy.parameterInfoMu="Location";
lang.distributions.halfCauchy.parameterInfoSigma="Scale";

lang.numbers={};
lang.numbers.N="Natural numbers";
lang.numbers.N0="Natural numbers and zero";
lang.numbers.Z="Integer numbers";
lang.numbers.R="Real numbers";
lang.numbers.RPlus="Positive real numbers";
lang.numbers.RPlus0="Non-negative real numbers";

lang.functions={};
lang.functions.Gamma="gamma function";
lang.functions.inGamma="upper incomplete gamma function";
lang.functions.gamma="lower incomplete gamma function";
lang.functions.Beta="beta function";
lang.functions.I="regularized incomplete beta function";
lang.functions.P="regularized gamma function";

/* Activate language */

const language=(document.documentElement.lang=='de')?languageDE:languageEN;