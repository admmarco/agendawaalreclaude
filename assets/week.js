/* Agenda Waalre — Deze week */
(function () {
  "use strict";
  var AW = window.AW;

  AW.extend({
    "w.kicker": "Aalst · Waalre-dorp · Ekenrooi",
    "w.h1a": "Welkom in Waalre,",
    "w.h1b": "fijn dat je er bent.",
    "w.lede": "Nieuw in Waalre? Hier zie je wat er deze week te doen is en waar je mensen ontmoet.",
    "w.today": "Vandaag",
    "w.statActs": "Activiteiten deze week",
    "w.statPlaces": "Plekken",
    "w.filters": "Filters",
    "w.when": "Wanneer",
    "w.what": "Soort",
    "w.r.today": "Vandaag",
    "w.r.weekend": "Dit weekend",
    "w.r.week": "Komende 7 dagen",
    "w.r.weekShort": "7 dagen",
    "w.jump": "Spring naar een dag",
    "w.jumpLabel": "Ga naar",
    "w.top": "Filters",
    "w.topTitle": "Terug naar de filters",
    "w.all": "Alles",
    "w.resTitle": "Wat is er te doen",
    "w.count1": "1 activiteit",
    "w.countN": "{n} activiteiten",
    "w.dayN1": "1 activiteit",
    "w.dayNN": "{n} activiteiten",
    "w.rel.today": "Vandaag",
    "w.rel.tomorrow": "Morgen",
    "w.until": "tot {t}",
    "w.notime": "Tijd: zie info",
    "w.where": "Waar",
    "w.org": "Organisator",
    "w.venueOnly": "Je ziet alleen activiteiten bij {v}.",
    "w.venueAll": "Toon alle plekken",
    "w.empty.endTitle": "De agenda loopt nog niet zo ver",
    "w.empty.end": "In dit overzicht staan activiteiten tot en met {d}. Kijk in de volledige agenda voor nieuwe activiteiten.",
    "w.empty.title": "Geen activiteiten gevonden",
    "w.empty.text": "In deze periode staat er niets van deze soort in de agenda. Probeer een andere periode of soort, of kijk in de volledige agenda.",
    "w.empty.reset": "Toon alles van de komende 7 dagen",
    "w.empty.full": "Naar agenda-waalre.vercel.app",
    "w.moreTitle": "Verder kijken",
    "w.t1k": "Waar is wat",
    "w.t1": "Ontmoetingsplekken, koffie & eten en winkels in één overzicht.",
    "w.t1go": "Open de kaart",
    "w.t2k": "Op de fiets of te voet",
    "w.t2": "Vier routes langs erfgoed, cultuur, sportclubs en winkels.",
    "w.t2go": "Kies een route",
    "w.t3k": "Het hele jaar",
    "w.t3title": "Jaarkalender 2027",
    "w.t3": "Carnaval, Koningsdag, braderie, Kempener Pop en meer.",
    "w.t3go": "Bekijk het jaar"
  }, {
    "w.kicker": "Aalst · Waalre village · Ekenrooi",
    "w.h1a": "Welcome to Waalre,",
    "w.h1b": "glad you're here.",
    "w.lede": "New in Waalre? Here you can see what's on this week and where people meet.",
    "w.today": "Today",
    "w.statActs": "Activities this week",
    "w.statPlaces": "Places",
    "w.filters": "Filters",
    "w.when": "When",
    "w.what": "Type",
    "w.r.today": "Today",
    "w.r.weekend": "This weekend",
    "w.r.week": "Next 7 days",
    "w.r.weekShort": "7 days",
    "w.jump": "Jump to a day",
    "w.jumpLabel": "Go to",
    "w.top": "Filters",
    "w.topTitle": "Back to the filters",
    "w.all": "All",
    "w.resTitle": "What's on",
    "w.count1": "1 activity",
    "w.countN": "{n} activities",
    "w.dayN1": "1 activity",
    "w.dayNN": "{n} activities",
    "w.rel.today": "Today",
    "w.rel.tomorrow": "Tomorrow",
    "w.until": "until {t}",
    "w.notime": "Time: see info",
    "w.where": "Where",
    "w.org": "Organiser",
    "w.venueOnly": "You are only seeing activities at {v}.",
    "w.venueAll": "Show all places",
    "w.empty.endTitle": "The agenda doesn't reach that far yet",
    "w.empty.end": "This overview lists activities up to and including {d}. Check the full agenda for new activities.",
    "w.empty.title": "No activities found",
    "w.empty.text": "Nothing of this type is listed for this period. Try another period or type, or check the full agenda.",
    "w.empty.reset": "Show everything in the next 7 days",
    "w.empty.full": "Go to agenda-waalre.vercel.app",
    "w.moreTitle": "Explore further",
    "w.t1k": "What's where",
    "w.t1": "Meeting places, coffee & food and shops in one overview.",
    "w.t1go": "Open the map",
    "w.t2k": "By bike or on foot",
    "w.t2": "Four routes past heritage, culture, sports clubs and shops.",
    "w.t2go": "Choose a route",
    "w.t3k": "All year round",
    "w.t3title": "Year calendar 2027",
    "w.t3": "Carnival, King's Day, street fair, Kempener Pop and more.",
    "w.t3go": "See the year"
  });

  var ICON = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    org: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14.5c2.4 0 4 1.5 4.6 4"/></svg>',
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/></svg>',
    empty: '<svg class="empty__icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="8" y="14" width="48" height="42" rx="5"/><path d="M8 26h48M20 8v10M44 8v10"/><path d="M24 42h16M34 36l6 6-6 6"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg>'
  };

  var esc = AW.esc;
  var state = { range: "week", type: "alle", venue: null };
  var events = [], venues = {}, coords = {}, maxDate = "";

  try {
    var qp = new URLSearchParams(location.search);
    state.venue = qp.get("venue");
    var r = qp.get("range"); if (r === "today" || r === "weekend" || r === "week") state.range = r;
    var t = qp.get("type"); if (t && AW.TYPES[t]) state.type = t;
  } catch (e) { /* oude browser */ }

  var daysEl = document.getElementById("days");
  var countEl = document.getElementById("res-count");
  var chipsEl = document.getElementById("type-chips");

  function rangeDates(kind) {
    var t = AW.today();
    if (kind === "today") return [AW.iso(t), AW.iso(t)];
    if (kind === "weekend") {
      var dow = t.getDay(); // 0 zo, 6 za
      if (dow === 6) return [AW.iso(t), AW.iso(AW.addDays(t, 1))];
      if (dow === 0) return [AW.iso(t), AW.iso(t)];
      var sat = AW.addDays(t, 6 - dow);
      return [AW.iso(sat), AW.iso(AW.addDays(sat, 1))];
    }
    return AW.weekRange();
  }

  function inRange(e, r) { return e.date >= r[0] && e.date <= r[1]; }
  function venueMatch(e) { return !state.venue || e.venueId === state.venue || (venues[e.venueId] && venues[e.venueId].partOf === state.venue); }

  function renderToday() {
    var d = AW.today();
    var el = document.getElementById("vandaag");
    el.innerHTML = "<span>" + esc(AW.fmt(d, { weekday: "long" })) + "</span>" + esc(AW.fmt(d, { day: "numeric", month: "long" }));
    var wr = AW.weekRange();
    var wk = events.filter(function (e) { return inRange(e, wr); });
    var places = {};
    wk.forEach(function (e) { places[e.venueId === "buiten-natuur" ? "buiten:" + (e.meetingPoint || e.id) : e.venueId] = 1; });
    document.getElementById("stat-acts").textContent = events.length ? wk.length : "–";
    document.getElementById("stat-places").textContent = events.length ? Object.keys(places).length : "–";
  }

  function renderSeg() {
    Array.prototype.forEach.call(document.querySelectorAll(".seg__btn"), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-range") === state.range ? "true" : "false");
    });
  }

  function renderChips(base) {
    var counts = { alle: base.length };
    AW.TYPE_ORDER.forEach(function (k) { counts[k] = 0; });
    base.forEach(function (e) { counts[AW.TYPES[e.type] ? e.type : "overig"]++; });
    var html = chipHtml("alle", AW.t("w.all"), counts.alle);
    AW.TYPE_ORDER.forEach(function (k) { html += chipHtml(k, AW.typeLabel(k), counts[k]); });
    chipsEl.innerHTML = html;
  }
  function chipHtml(k, label, n) {
    var on = state.type === k;
    return '<button type="button" class="chip' + (k === "alle" ? "" : " t-" + k) + (n ? "" : " is-empty") +
      '" data-type="' + k + '" aria-pressed="' + on + '">' +
      (k === "alle" ? "" : '<span class="dot" aria-hidden="true"></span>') +
      esc(label) + ' <span class="chip__n">' + n + "</span></button>";
  }

  function placeOf(e) {
    var v = venues[e.venueId];
    if (e.meetingPoint) return { name: e.meetingPoint, addr: "", id: null };
    if (!v) return { name: e.dorp || "", addr: "", id: null };
    var addr = [v.address, v.dorp].filter(Boolean).join(", ");
    return { name: v.name, addr: addr, id: coords["venue:" + v.id] ? v.id : null };
  }

  function timeHtml(e) {
    if (!e.time) return '<div class="ev__time is-unknown">' + esc(AW.t("w.notime")) + "</div>";
    return '<div class="ev__time">' + esc(e.time) +
      (e.endTime ? "<small>" + esc(AW.t("w.until", { t: e.endTime })) + "</small>" : "") + "</div>";
  }

  function eventHtml(e, i) {
    var p = placeOf(e);
    var type = AW.TYPES[e.type] ? e.type : "overig";
    var org = e.organiser || e.providerName || "";
    var links = '<a href="' + esc(e.providerUrl) + '" target="_blank" rel="noopener">' + esc(AW.t("moreinfo")) + " " + ICON.ext +
      '<span class="visually-hidden"> (' + esc(e.title) + ")</span></a>";
    if (p.id) links += '<a href="' + esc(AW.href("kaart.html#venue-" + p.id)) + '">' + ICON.map + " " + esc(AW.t("onmap")) + "</a>";
    return '<li class="ev t-' + type + '" style="animation-delay:' + Math.min(i * 30, 300) + 'ms">' +
      timeHtml(e) +
      "<div>" +
      '<span class="ev__type">' + esc(AW.typeLabel(type)) + "</span>" +
      '<h4 class="ev__title" lang="nl">' + esc(e.title) + "</h4>" +
      '<dl class="ev__meta">' +
      "<div><dt>" + esc(AW.t("w.where")) + "</dt>" + ICON.pin + "<dd><span>" + esc(p.name) + "</span>" +
      (p.addr ? ' <span class="soft">· ' + esc(p.addr) + "</span>" : "") + "</dd></div>" +
      (org ? "<div><dt>" + esc(AW.t("w.org")) + "</dt>" + ICON.org + '<dd class="soft">' + esc(org) + "</dd></div>" : "") +
      "</dl>" +
      (e.description ? '<p class="ev__desc" lang="nl" title="' + esc(e.description) + '">' + esc(e.description) + "</p>" : "") +
      '<div class="ev__links">' + links + "</div>" +
      "</div></li>";
  }

  function relLabel(iso) {
    var t = AW.today();
    if (iso === AW.iso(t)) return AW.t("w.rel.today");
    if (iso === AW.iso(AW.addDays(t, 1))) return AW.t("w.rel.tomorrow");
    return "";
  }

  function render() {
    renderSeg();
    var r = rangeDates(state.range);
    var base = events.filter(function (e) { return inRange(e, r) && venueMatch(e); });
    renderChips(base);
    chipsEnd();
    var list = state.type === "alle" ? base : base.filter(function (e) { return (AW.TYPES[e.type] ? e.type : "overig") === state.type; });

    countEl.textContent = list.length === 1 ? AW.t("w.count1") : AW.t("w.countN", { n: list.length });

    var vf = document.getElementById("venue-filter");
    if (state.venue && venues[state.venue]) {
      vf.hidden = false;
      document.getElementById("venue-filter-text").textContent = AW.t("w.venueOnly", { v: venues[state.venue].name });
    } else vf.hidden = true;

    var daybar = document.getElementById("daybar");
    if (!list.length) {
      daybar.hidden = true;
      var ended = maxDate && r[0] > maxDate;
      var full = '<a class="btn" href="https://agenda-waalre.vercel.app" target="_blank" rel="noopener">' + esc(AW.t("w.empty.full")) + " " + ICON.ext + "</a>";
      daysEl.innerHTML = '<div class="empty">' + ICON.empty + "<div>" +
        "<h3>" + esc(AW.t(ended ? "w.empty.endTitle" : "w.empty.title")) + "</h3>" +
        "<p>" + esc(ended ? AW.t("w.empty.end", { d: AW.fmt(AW.parse(maxDate), { day: "numeric", month: "long", year: "numeric" }) }) : AW.t("w.empty.text")) + "</p>" +
        '<div class="actions">' + full +
        (!ended && (state.type !== "alle" || state.range !== "week") ? '<button type="button" class="btn btn--ghost" data-reset>' + esc(AW.t("w.empty.reset")) + "</button>" : "") +
        "</div></div></div>";
      var rb = daysEl.querySelector("[data-reset]");
      if (rb) rb.addEventListener("click", function () { state.type = "alle"; state.range = "week"; render(); });
      return;
    }

    var byDay = {};
    list.forEach(function (e) { (byDay[e.date] = byDay[e.date] || []).push(e); });
    var html = "", i = 0;
    Object.keys(byDay).sort().forEach(function (d) {
      var evs = byDay[d];
      var rel = relLabel(d);
      var date = AW.parse(d);
      var name = AW.fmt(date, { weekday: "long", day: "numeric", month: "long" });
      name = name.charAt(0).toUpperCase() + name.slice(1);
      html += '<section class="day" id="d-' + d + '" aria-labelledby="h-' + d + '">' +
        '<h3 class="day__head" id="h-' + d + '"><span class="day__name">' + esc(name) + "</span>" +
        (rel ? '<span class="day__rel">' + esc(rel) + "</span>" : "") +
        '<span class="day__n">' + esc(evs.length === 1 ? AW.t("w.dayN1") : AW.t("w.dayNN", { n: evs.length })) + "</span></h3>" +
        '<ul class="events">' + evs.map(function (e) { return eventHtml(e, i++); }).join("") + "</ul></section>";
    });
    daysEl.innerHTML = html;
    renderDaybar(Object.keys(byDay).sort(), byDay);
  }

  function renderDaybar(days, byDay) {
    var bar = document.getElementById("daybar");
    if (days.length < 2) { bar.hidden = true; measure(); return; }
    bar.hidden = false;
    bar.innerHTML = '<div class="daybar__inner"><span class="daybar__label">' + esc(AW.t("w.jumpLabel")) + "</span>" +
      '<ul class="daybar__list">' + days.map(function (d) {
        var date = AW.parse(d);
        var wd = AW.fmt(date, { weekday: "short" }).replace(".", "");
        wd = wd.charAt(0).toUpperCase() + wd.slice(1);
        var full = AW.fmt(date, { weekday: "long", day: "numeric", month: "long" });
        return '<li><a href="#d-' + d + '" data-day="' + d + '" aria-label="' + esc(full + ", " + (byDay[d].length === 1 ? AW.t("w.dayN1") : AW.t("w.dayNN", { n: byDay[d].length }))) + '">' +
          '<span class="daybar__day" aria-hidden="true">' + esc(wd + " " + date.getDate()) + "</span>" +
          '<span class="daybar__n" aria-hidden="true">' + byDay[d].length + "</span></a></li>";
      }).join("") + "</ul>" +
      '<a class="daybar__top" href="#filters" title="' + esc(AW.t("w.topTitle")) + '">' + ICON.up + "<span>" + esc(AW.t("w.top")) + "</span></a></div>";
    measure();
    markCurrent();
  }

  /* markeer de dag die nu bovenaan staat */
  function markCurrent() {
    var bar = document.getElementById("daybar");
    if (bar.hidden) return;
    var h = bar.offsetHeight + 12, cur = null;
    Array.prototype.forEach.call(daysEl.querySelectorAll(".day"), function (sec) {
      if (sec.getBoundingClientRect().top <= h) cur = sec.getAttribute("aria-labelledby").slice(2);
    });
    var links = bar.querySelectorAll("a[data-day]");
    if (!cur && links.length) cur = links[0].getAttribute("data-day");
    Array.prototype.forEach.call(links, function (a) {
      var on = a.getAttribute("data-day") === cur;
      if (on !== a.classList.contains("is-current")) {
        a.classList.toggle("is-current", on);
        if (on) {
          var list = a.parentNode.parentNode;
          var x = a.offsetLeft - list.offsetLeft;
          if (x < list.scrollLeft || x + a.offsetWidth > list.scrollLeft + list.clientWidth) list.scrollLeft = x - 8;
        }
      }
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; markCurrent(); });
  }, { passive: true });

  /* dag-koppen plakken onder de dagenbalk */
  function measure() {
    var b = document.getElementById("daybar");
    document.documentElement.style.setProperty("--daybar-h", b.hidden ? "0px" : b.offsetHeight + "px");
  }
  window.addEventListener("resize", measure);

  document.querySelectorAll(".seg__btn").forEach(function (b) {
    b.addEventListener("click", function () { state.range = b.getAttribute("data-range"); render(); });
  });
  chipsEl.addEventListener("click", function (ev) {
    var b = ev.target.closest(".chip");
    if (!b) return;
    var k = b.getAttribute("data-type");
    state.type = state.type === k && k !== "alle" ? "alle" : k;
    render();
    var again = chipsEl.querySelector('[data-type="' + state.type + '"]');
    if (again && document.activeElement === document.body) again.focus();
    else { var same = chipsEl.querySelector('[data-type="' + k + '"]'); if (same) same.focus(); }
  });

  function chipsEnd() { chipsEl.classList.toggle("at-end", chipsEl.scrollLeft + chipsEl.clientWidth >= chipsEl.scrollWidth - 4); }
  chipsEl.addEventListener("scroll", chipsEnd, { passive: true });
  window.addEventListener("resize", chipsEnd);

  document.addEventListener("aw:lang", function () {
    AW.applyI18n();
    renderToday();
    if (events.length) render();
    measure();
  });

  AW.applyI18n();
  renderToday();
  renderSeg();
  measure();

  Promise.all([AW.json("data/events.json"), AW.json("data/venues.json"), AW.json("data/claude/coords.json").catch(function () { return {}; })])
    .then(function (res) {
      events = res[0].slice().sort(function (a, b) {
        return a.date < b.date ? -1 : a.date > b.date ? 1 : (a.time || "99") < (b.time || "99") ? -1 : (a.time || "99") > (b.time || "99") ? 1 : 0;
      });
      res[1].forEach(function (v) { venues[v.id] = v; });
      coords = res[2] || {};
      maxDate = events.length ? events[events.length - 1].date : "";
      renderToday();
      render();
      measure();
    })
    .catch(function () {
      daysEl.innerHTML = '<p class="status status--error">' + esc(AW.t("error")) + "</p>";
    });
})();
