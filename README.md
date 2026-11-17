# Web DTMko.cz

Statický web (HTML, CSS, trochu JavaScriptu), bez knihoven, bez sledování a bez externích písem. Zveřejňuje se přes GitHub Pages na adrese <https://dtmko.cz>.

## Soubory
| Soubor | Obsah |
|---|---|
| `index.html` | celá stránka (Postup, Funkce, Kontroly, Kompletka, Novinky, Dotazy) |
| `style.css` | vzhled podle vzhledu programu, světlý i tmavý režim |
| `script.js` | přepínač vzhledu a nabídka na telefonu |
| `assets\logo.png`, `favicon.ico` | logo programu |
| `stahnout\Ondrovo-DTMko-Setup.exe` | instalační program ke stažení ze stránky |
| `CNAME` | vlastní doména pro GitHub Pages (`dtmko.cz`), nemazat |
| `.nojekyll` | vypne zpracování Jekyllem, nemazat |

## Náhled na počítači
```
python -m http.server 8765
```
a otevřít <http://localhost:8765>.

## Nasazení (GitHub Pages)
1. Repozitář na GitHubu, větev `main`.
2. Settings → Pages → Source: *Deploy from a branch*, větev `main`, složka `/ (root)`.
3. Settings → Pages → Custom domain: `dtmko.cz` (soubor `CNAME` už v repozitáři je), po vydání certifikátu zapnout *Enforce HTTPS*.
4. U správce DNS domény `dtmko.cz` nastavit (MX, SPF a DKIM záznamy pro e-mail neměnit):

| Typ | Název | Hodnota |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `0ndinek.github.io` |

Aktuální adresy vždy ověřit v dokumentaci GitHub Pages (Managing a custom domain). Změna DNS se projeví do několika hodin.

## Nové vydání programu
- Nahradit `stahnout\Ondrovo-DTMko-Setup.exe`, jen když se změnil instalační program.
- Při novém vydání programu doplnit novou položku do sekce Novinky v `index.html` (nahoře, nejnovější první). Sekce Stažení na stránce není, tlačítka Stáhnout vedou přímo na instalátor.
- Po každé úpravě `style.css` nebo `script.js` zvýšit číslo `?v=` u jejich odkazů v `index.html` (například `style.css?v=4`), jinak si prohlížeče mohou až 10 minut držet starý soubor a stránka se zobrazí rozbitě.
- Commit a push do `main`, stránka se přenasadí sama.

## Poznámky
- Instalační program sám při instalaci stahuje program z GitHubu (`0NDINEK/DTMko`), takže repozitář s vydáním musí zůstat veřejný.
- Kontakt na stránce je `info@dtmko.cz`, schránka musí existovat.
- Ukázka okna programu je ilustrace nakreslená v HTML.
