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

  // Formulář s dotazem: odeslání přes službu FormSubmit (bez vlastního serveru).
  // Služba odpovídá pomalu (i přes minutu), proto se pole vyprázdní hned po odeslání a výsledek se doplní, až přijde.
  var formular = document.getElementById("ask-form");
  var stav = document.getElementById("ask-status");
  if (formular && stav && window.fetch) {
    var cil = "https://formsubmit.co/ajax/fdb6ac00a01b7220bcc143b189ed0f6a";
    var posledni = { klic: "", cas: 0 };

    function ukaz(trida, text, odkaz) {
      stav.className = "ask-status " + trida;
      stav.textContent = text;
      if (odkaz) {
        var a = document.createElement("a");
        a.href = odkaz.href;
        a.textContent = odkaz.text;
        stav.appendChild(document.createTextNode(" "));
        stav.appendChild(a);
      }
    }

    formular.addEventListener("submit", function (e) {
      e.preventDefault();
      var tlacitko = formular.querySelector('button[type="submit"]');
      if (tlacitko.disabled) { return; }

      var data = {};
      new FormData(formular).forEach(function (hodnota, klic) { data[klic] = hodnota; });

      // stejný dotaz od stejného odesílatele do 10 minut neposílat podruhé
      var klic = (data.email || "") + "|" + (data.dotaz || "");
      if (klic === posledni.klic && Date.now() - posledni.cas < 600000) {
        ukaz("ok", "Tento dotaz už jsme odeslali, děkujeme.");
        return;
      }
      posledni = { klic: klic, cas: Date.now() };

      // pole se vyprázdní hned, aby se dotaz nedal poslat opakovaně
      formular.reset();
      tlacitko.disabled = true;
      ukaz("", "Odesíláme dotaz, může to trvat až minutu. Stránku prosím nezavírejte.");

      var radic = window.AbortController ? new AbortController() : null;
      var casovac = radic ? setTimeout(function () { radic.abort(); }, 120000) : null;

      fetch(cil, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data),
        signal: radic ? radic.signal : undefined
      }).then(function (odpoved) {
        return odpoved.json().then(function (j) { return { ok: odpoved.ok, json: j }; });
      }).then(function (v) {
        if (v.ok && (v.json.success === true || v.json.success === "true")) {
          ukaz("ok", "Děkujeme, dotaz je odeslaný. Odpovíme na váš e-mail.");
        } else {
          throw new Error("neodesláno");
        }
      }).catch(function () {
        // odpověď se nepodařilo ověřit; zpráva mohla odejít, proto neutrální text a záložní e-mail s vyplněným dotazem
        var telo = "Od: " + (data.jmeno || "") + " <" + (data.email || "") + ">\n\n" + (data.dotaz || "");
        var href = "mailto:info@dtmko.cz?subject=" + encodeURIComponent("Dotaz z webu dtmko.cz") +
          "&body=" + encodeURIComponent(telo.slice(0, 1500));
        ukaz("err", "Nepodařilo se potvrdit, že dotaz odešel. Pokud se vám do několika dnů neozveme, pošlete ho prosím e-mailem.",
          { href: href, text: "Otevřít e-mail s vaším dotazem" });
      }).then(function () {
        if (casovac) { clearTimeout(casovac); }
        tlacitko.disabled = false;
      });
    });
  }
})();
