/* Agenda Waalre (Claude-versie) — gedeelde functies: taal, kop/voet, data, datums */
(function () {
  "use strict";

  var STORE_KEY = "aw-lang";

  var DICT = {
    nl: {
      "skip": "Direct naar de inhoud",
      "tag": "Claude-versie",
      "nav.label": "Hoofdmenu",
      "nav.week": "Deze week",
      "nav.kaart": "Kaart",
      "nav.routes": "Rondleidingen",
      "nav.jaar": "Jaarkalender",
      "lang.label": "Taal",
      "foot.independent": "Onafhankelijk overzicht, geen officiële gemeentelijke site.",
      "foot.full": "Volledige agenda:",
      "foot.data": "Gegevens: agenda-Waalre (versie {v}) · kaart © OpenStreetMap-bijdragers",
      "en.note": "",
      "loading": "Gegevens worden geladen…",
      "error": "De gegevens konden niet worden geladen. Vernieuw de pagina of probeer het later opnieuw.",
      "route": "Route plannen",
      "onmap": "Op de kaart",
      "moreinfo": "Meer info bij aanbieder",
      "website": "Website"
    },
    en: {
      "skip": "Skip to content",
      "tag": "Claude version",
      "nav.label": "Main menu",
      "nav.week": "This week",
      "nav.kaart": "Map",
      "nav.routes": "Guided routes",
      "nav.jaar": "Year calendar",
      "lang.label": "Language",
      "foot.independent": "Independent overview, not an official municipal website.",
      "foot.full": "Full agenda:",
      "foot.data": "Data: agenda-Waalre (version {v}) · map © OpenStreetMap contributors",
      "en.note": "Activities are listed in Dutch as published by the organiser.",
      "loading": "Loading…",
      "error": "The data could not be loaded. Please refresh the page or try again later.",
      "route": "Get directions",
      "onmap": "On the map",
      "moreinfo": "More info from organiser",
      "website": "Website"
    }
  };

  var TYPES = {
    sport:     { nl: "Sport & bewegen", en: "Sport & exercise" },
    wandeling: { nl: "Wandelen", en: "Walks" },
    cursus:    { nl: "Cursus", en: "Courses" },
    cultuur:   { nl: "Cultuur", en: "Culture" },
    dialoog:   { nl: "Gesprek & ontmoeting", en: "Conversation & meeting" },
    lezing:    { nl: "Lezing", en: "Talks" },
    overig:    { nl: "Overig", en: "Other" }
  };
  var TYPE_ORDER = ["sport", "wandeling", "cursus", "cultuur", "dialoog", "lezing", "overig"];

  function readLang() {
    var q = null;
    try { q = new URLSearchParams(location.search).get("lang"); } catch (e) { /* oude browser */ }
    if (q === "en" || q === "nl") { save(q); return q; }
    try {
      var s = localStorage.getItem(STORE_KEY);
      if (s === "en" || s === "nl") return s;
    } catch (e) { /* opslag geblokkeerd */ }
    return "nl";
  }
  function save(l) { try { localStorage.setItem(STORE_KEY, l); } catch (e) { /* negeren */ } }

  var AW = {
    lang: readLang(),
    TYPES: TYPES,
    TYPE_ORDER: TYPE_ORDER,
    dict: DICT
  };

  /* true als er voor deze sleutel een tekst is (in de huidige taal of in het Nederlands) */
  AW.has = function (key) { return (DICT[AW.lang] && DICT[AW.lang][key] != null) || DICT.nl[key] != null; };

  AW.t = function (key, vars) {
    var s = (DICT[AW.lang] && DICT[AW.lang][key]);
    if (s == null) s = DICT.nl[key];
    if (s == null) s = key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] != null ? vars[k] : ""; });
    return s;
  };
  /* Pagina's voegen hun eigen teksten toe */
  AW.extend = function (nl, en) {
    Object.keys(nl).forEach(function (k) { DICT.nl[k] = nl[k]; });
    Object.keys(en).forEach(function (k) { DICT.en[k] = en[k]; });
  };
  AW.pick = function (obj, field) {
    if (AW.lang === "en" && obj[field + "_en"]) return obj[field + "_en"];
    return obj[field];
  };
  AW.typeLabel = function (t) { return (TYPES[t] || TYPES.overig)[AW.lang]; };

  AW.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  /* Interne link, met ?lang=en zodat de taal ook zonder localStorage meegaat */
  AW.href = function (url) {
    if (AW.lang !== "en") return url;
    var hashAt = url.indexOf("#");
    var base = hashAt >= 0 ? url.slice(0, hashAt) : url;
    var hash = hashAt >= 0 ? url.slice(hashAt) : "";
    return base + (base.indexOf("?") >= 0 ? "&" : "?") + "lang=en" + hash;
  };

  AW.json = function (path) {
    return fetch(path, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(path + " " + r.status);
      return r.json();
    });
  };

  AW.routeUrl = function (lat, lng) {
    return "https://www.google.com/maps/dir/?api=1&destination=" + lat + "," + lng;
  };

  /* ---------- datums (lokale browserdatum) ---------- */
  AW.iso = function (d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  };
  AW.parse = function (s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); };
  AW.today = function () { var n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
  AW.addDays = function (d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); };
  AW.locale = function () { return AW.lang === "en" ? "en-GB" : "nl-NL"; };
  AW.fmt = function (d, opts) { return new Intl.DateTimeFormat(AW.locale(), opts).format(d); };

  /* De standaard zoekperiode "deze week": vandaag + 6 dagen */
  AW.weekRange = function () { var t = AW.today(); return [AW.iso(t), AW.iso(AW.addDays(t, 6))]; };

  /* ---------- kop en voet ---------- */
  function applyI18n(root) {
    // Sleutels die (nog) niet geladen zijn laten we staan: de HTML bevat de Nederlandse tekst al.
    Array.prototype.forEach.call((root || document).querySelectorAll("[data-i18n]"), function (el) {
      var k = el.getAttribute("data-i18n");
      if (AW.has(k)) el.textContent = AW.t(k);
    });
    Array.prototype.forEach.call((root || document).querySelectorAll("[data-i18n-aria]"), function (el) {
      var k = el.getAttribute("data-i18n-aria");
      if (AW.has(k)) el.setAttribute("aria-label", AW.t(k));
    });
    Array.prototype.forEach.call(document.querySelectorAll("a[data-nav]"), function (a) {
      a.setAttribute("href", AW.href(a.getAttribute("data-nav")));
    });
    Array.prototype.forEach.call(document.querySelectorAll(".lang__btn"), function (b) {
      var on = b.getAttribute("data-lang") === AW.lang;
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    var note = document.querySelector("[data-en-note]");
    if (note) note.hidden = AW.lang !== "en";
    document.documentElement.lang = AW.lang;
    var tt = document.querySelector("meta[name='aw-title-" + AW.lang + "']");
    if (tt) document.title = tt.getAttribute("content");
    renderFooterData();
  }
  AW.applyI18n = applyI18n;

  var sourceCommit = null;
  function renderFooterData() {
    var el = document.getElementById("foot-data");
    if (el) el.textContent = AW.t("foot.data", { v: sourceCommit || "…" });
  }

  AW.setLang = function (l) {
    if (l !== "nl" && l !== "en") return;
    AW.lang = l;
    save(l);
    // houd de adresbalk in lijn met de keuze
    try {
      var u = new URL(location.href);
      if (l === "en") u.searchParams.set("lang", "en"); else u.searchParams.delete("lang");
      history.replaceState(history.state, "", u.pathname + u.search + u.hash);
    } catch (e) { /* negeren */ }
    applyI18n();
    document.dispatchEvent(new CustomEvent("aw:lang", { detail: l }));
  };

  function initShell() {
    Array.prototype.forEach.call(document.querySelectorAll(".lang__btn"), function (b) {
      b.addEventListener("click", function () { AW.setLang(b.getAttribute("data-lang")); });
    });
    applyI18n();
    fetch("data/SOURCE_COMMIT", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.text() : ""; })
      .then(function (t) { sourceCommit = (t || "").trim() || "?"; renderFooterData(); })
      .catch(function () { sourceCommit = "?"; renderFooterData(); });
  }

  window.AW = AW;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initShell);
  else initShell();
})();
