// Přepínač vzhledu (světlý / tmavý) a nabídka na telefonu. Bez knihoven, bez sledování.
(function () {
  var root = document.documentElement;

  function uloz(hodnota) { try { localStorage.setItem("dtmko-vzhled", hodnota); } catch (e) {} }
  function nacti() { try { return localStorage.getItem("dtmko-vzhled"); } catch (e) { return null; } }

  var ulozeny = nacti();
  if (ulozeny === "light" || ulozeny === "dark") root.setAttribute("data-theme", ulozeny);

  var tlacitko = document.getElementById("theme");
  if (tlacitko) {
    tlacitko.addEventListener("click", function () {
      var ted = root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var dalsi = ted === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", dalsi);
      uloz(dalsi);
    });
  }

  var menuTlacitko = document.getElementById("menu-btn");
  var nabidka = document.getElementById("nav");
  if (menuTlacitko && nabidka) {
    menuTlacitko.addEventListener("click", function () {
      var otevrena = nabidka.classList.toggle("open");
      menuTlacitko.setAttribute("aria-expanded", String(otevrena));
    });
    nabidka.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nabidka.classList.remove("open");
        menuTlacitko.setAttribute("aria-expanded", "false");
      }
    });
  }
})();
