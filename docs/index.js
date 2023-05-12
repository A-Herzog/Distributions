/* Select language */
import {selectLanguage} from './js/LanguageTools.js';
selectLanguage([{name: "default", file: "index.html"}, {name: "de", file: "index_de.html"}]);

/* Init app */
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
}