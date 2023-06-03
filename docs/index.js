/* Select language */
import {selectLanguage} from './js/LanguageTools.js';
selectLanguage([{name: "default", file: "index.html"}, {name: "de", file: "index_de.html"}]);

/* Init app */
import {language} from "./js/Language.js";
import {initApp, isDesktopApp} from './js/Main.js';
initApp();

if (isDesktopApp) {
  const footer=document.querySelector('footer');
  for (let link of footer.querySelectorAll("a")) if (link.href!='') {
    const href=link.href;
    link.onclick=()=>Neutralino.os.open(href);
    link.removeAttribute("href");
    link.style.cursor="pointer";
    link.classList.add("link-primary");
  }
} else {
  const downloadA='<a id="downloadApp" target="_blank" href="https://github.com/A-Herzog/Distributions/releases/latest/download/Distributions.exe" style="display: none;"></a>';
  const downloadButton='<button class="btn btn-primary my-1 bi-windows" onclick="document.getElementById(\'downloadApp\').click();"> '+language.GUI.downloadButton+'</button>';
  downloadInfoArea.innerHTML="<p class='mt-3'>"+language.GUI.downloadLabel+"</p><p>"+downloadA+downloadButton+"</p>";
}