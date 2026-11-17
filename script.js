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

  // Formulář s dotazem: odeslání přes službu FormSubmit na info@dtmko.cz (bez vlastního serveru).
  var formular = document.getElementById("ask-form");
  var stav = document.getElementById("ask-status");
  if (formular && stav && window.fetch) {
    formular.addEventListener("submit", function (e) {
      e.preventDefault();
      var tlacitko = formular.querySelector('button[type="submit"]');
      var data = {};
      new FormData(formular).forEach(function (hodnota, klic) { data[klic] = hodnota; });
      stav.className = "ask-status";
      stav.textContent = "Odesílám…";
      tlacitko.disabled = true;
      fetch("https://formsubmit.co/ajax/fdb6ac00a01b7220bcc143b189ed0f6a", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      }).then(function (odpoved) {
        return odpoved.json().then(function (j) { return { ok: odpoved.ok, json: j }; });
      }).then(function (v) {
        if (v.ok && (v.json.success === true || v.json.success === "true")) {
          formular.reset();
          stav.className = "ask-status ok";
          stav.textContent = "Děkujeme, dotaz je odeslaný. Odpovíme na váš e-mail.";
        } else {
          throw new Error("neodesláno");
        }
      }).catch(function () {
        stav.className = "ask-status err";
        stav.textContent = "Dotaz se nepodařilo odeslat. Napište nám prosím přímo na info@dtmko.cz.";
      }).then(function () { tlacitko.disabled = false; });
    });
  }
})();
