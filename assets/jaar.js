/* Agenda Waalre — Jaarkalender 2027 */
(function () {
  "use strict";
  var AW = window.AW;
  var esc = AW.esc;

  AW.extend({
    "j.kicker": "Wat er elk jaar gebeurt",
    "j.title": "Jaarkalender",
    "j.lede": "Van nieuwjaarsreceptie tot kerstviering: de vaste momenten waarop het hele dorp elkaar tegenkomt.",
    "j.note": "Bron: Activiteitenlijst Aalst Waalre 2027. Data worden aangevuld zodra ze bekend zijn.",
    "j.legend": "Betekenis:",
    "j.b.vast": "Datum bekend",
    "j.b.verwacht": "Verwacht",
    "j.b.volgt": "Datum volgt",
    "j.tbd": "Datum nog niet bekend",
    "j.tbdSub": "Wel in 2027",
    "j.emptyMonth": "Nog niets bekend in deze maand.",
    "j.noloc": "Locatie volgt.",
    "j.n1": "1 activiteit",
    "j.nN": "{n} activiteiten",
    "j.where": "Waar"
  }, {
    "j.kicker": "What happens every year",
    "j.title": "Year calendar",
    "j.lede": "From the New Year's reception to the Christmas celebration: the regular moments when the whole village gets together.",
    "j.note": "Source: Activiteitenlijst Aalst Waalre 2027 (activity list). Dates are added as soon as they are known.",
    "j.legend": "Key:",
    "j.b.vast": "Date confirmed",
    "j.b.verwacht": "Expected",
    "j.b.volgt": "Date to follow",
    "j.tbd": "Date not yet known",
    "j.tbdSub": "Sometime in 2027",
    "j.emptyMonth": "Nothing known yet for this month.",
    "j.noloc": "Location to follow.",
    "j.n1": "1 event",
    "j.nN": "{n} events",
    "j.where": "Where"
  });
  AW.applyI18n();

  var MAP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/></svg>';
  var monthsEl = document.getElementById("months");
  var DATA = null;

  function badgeKey(z) { return z === "vast" ? "vast" : z === "verwacht" ? "verwacht" : "volgt"; }
  function badge(z) {
    var k = badgeKey(z);
    return '<span class="badge badge--' + k + '">' + esc(AW.t("j.b." + k)) + "</span>";
  }

  function monthName(m, year) {
    var s = AW.fmt(new Date(year, m - 1, 1), { month: "long" });
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function itemHtml(it) {
    var locs = (it.locaties || []).filter(function (l) { return l && l.naam; });
    var locHtml = locs.length
      ? '<ul class="yitem__locs" aria-label="' + esc(AW.t("j.where")) + '">' + locs.map(function (l) {
          var link = "";
          if (isFinite(l.lat) && isFinite(l.lng) && l.lat !== null && l.lng !== null) {
            var label = l.naam + (l.adres ? ", " + l.adres : "");
            var url = "kaart.html?lat=" + l.lat + "&lng=" + l.lng + "&label=" + encodeURIComponent(label);
            link = '<a href="' + esc(AW.href(url)) + '">' + MAP + " " + esc(AW.t("onmap")) +
              '<span class="visually-hidden">: ' + esc(l.naam) + "</span></a>";
          }
          return '<li><span class="yitem__loc"><b>' + esc(l.naam) + "</b>" + (l.adres && l.adres !== l.naam ? " <span>· " + esc(l.adres) + "</span>" : "") + "</span>" + link + "</li>";
        }).join("") + "</ul>"
      : '<p class="yitem__noloc">' + esc(AW.t("j.noloc")) + "</p>";
    return '<li class="yitem"><div class="yitem__top"><h3 class="yitem__title">' + esc(AW.pick(it, "titel")) + "</h3>" + badge(it.zekerheid) + "</div>" +
      '<p class="yitem__date">' + esc(AW.pick(it, "datum_tekst")) + "</p>" + locHtml + "</li>";
  }

  function render() {
    if (!DATA) return;
    var year = DATA.jaar || 2027;
    document.getElementById("badges-legend").innerHTML =
      "<span>" + esc(AW.t("j.legend")) + "</span>" + badge("vast") + badge("verwacht") + badge("datum volgt");

    var byMonth = {}, tbd = [];
    DATA.items.forEach(function (it) {
      var m = it.maand || (it.datum ? +it.datum.slice(5, 7) : null);
      if (m >= 1 && m <= 12) (byMonth[m] = byMonth[m] || []).push(it);
      else tbd.push(it);
    });
    var html = "";
    for (var m = 1; m <= 12; m++) {
      var items = (byMonth[m] || []).slice().sort(function (a, b) {
        if (a.datum && b.datum) return a.datum < b.datum ? -1 : 1;
        if (a.datum) return -1;
        if (b.datum) return 1;
        return 0;
      });
      var id = "maand-" + m;
      html += '<section class="month' + (items.length ? "" : " is-empty") + '" aria-labelledby="' + id + '">' +
        '<h2 class="month__name" id="' + id + '">' + esc(monthName(m, year)) +
        (items.length ? "<small>" + esc(items.length === 1 ? AW.t("j.n1") : AW.t("j.nN", { n: items.length })) + "</small>" : "") + "</h2>" +
        (items.length ? '<ul class="items">' + items.map(itemHtml).join("") + "</ul>" : '<p class="month__empty">' + esc(AW.t("j.emptyMonth")) + "</p>") +
        "</section>";
    }
    if (tbd.length) {
      html += '<section class="month month--tbd" aria-labelledby="maand-tbd">' +
        '<h2 class="month__name" id="maand-tbd">' + esc(AW.t("j.tbd")) + "<small>" + esc(AW.t("j.tbdSub")) + "</small></h2>" +
        '<ul class="items">' + tbd.map(itemHtml).join("") + "</ul></section>";
    }
    monthsEl.innerHTML = html;
  }

  document.addEventListener("aw:lang", function () { AW.applyI18n(); render(); });

  AW.json("data/claude/jaarkalender-2027.json")
    .then(function (d) { DATA = d; render(); })
    .catch(function (err) {
      monthsEl.innerHTML = '<p class="status status--error">' + esc(AW.t("error")) + "</p>";
      if (window.console) console.error(err);
    });
})();
