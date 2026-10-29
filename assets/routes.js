/* Agenda Waalre — Rondleidingen */
(function () {
  "use strict";
  var AW = window.AW;
  var esc = AW.esc;

  AW.extend({
    "r.kicker": "Op de fiets of te voet",
    "r.title": "Rondleidingen",
    "r.lede": "Leer Aalst en Waalre kennen in een ochtend of middag. Kies een route: je ziet de stops op de kaart, wat er te zien is, en waar je onderweg koffie drinkt.",
    "r.enNote": "",
    "r.choose": "Kies een route",
    "r.overview": "Overzichtskaart van alle routes",
    "r.pick": "Kies hierboven een route. Op de kaart zie je alvast alle vier de routes in hun eigen kleur.",
    "r.print": "Afdrukken",
    "r.mapLabel": "Kaart van de route",
    "r.mapNote": "Tik op een stop in de lijst om die op de kaart te zien.",
    "r.stopsTitle": "Stops",
    "r.coffee": "Koffie onderweg",
    "r.fiets": "Fietsroute",
    "r.wandel": "Wandelroute",
    "r.nStops": "{n} stops",
    "r.view": "Bekijk route",
    "r.selected": "Gekozen",
    "r.onmap": "Op de kaart",
    "r.cat.restaurant": "Restaurant",
    "r.cat.cafe": "Café",
    "r.cat.snack": "Lunch & snacks",
    "r.printHead": "Agenda Waalre · Rondleiding",
    "r.printFoot": "Afgedrukt van Agenda Waalre (Claude-versie). Onafhankelijk overzicht, geen officiële gemeentelijke site. Kaartgegevens © OpenStreetMap-bijdragers.",
    "r.notFound": "Deze route bestaat niet (meer). Kies hierboven een andere route.",
    "r.stop": "Stop {n}"
  }, {
    "r.kicker": "By bike or on foot",
    "r.title": "Guided routes",
    "r.lede": "Get to know Aalst and Waalre in a morning or an afternoon. Choose a route to see the stops on the map, what there is to see, and where to stop for coffee.",
    "r.enNote": "Stop names and descriptions are in Dutch, as in the source list.",
    "r.choose": "Choose a route",
    "r.overview": "Overview map of all routes",
    "r.pick": "Choose a route above. The map already shows all four routes, each in its own colour.",
    "r.print": "Print",
    "r.mapLabel": "Map of the route",
    "r.mapNote": "Tap a stop in the list to see it on the map.",
    "r.stopsTitle": "Stops",
    "r.coffee": "Coffee along the way",
    "r.fiets": "Cycling route",
    "r.wandel": "Walking route",
    "r.nStops": "{n} stops",
    "r.view": "View route",
    "r.selected": "Selected",
    "r.onmap": "On the map",
    "r.cat.restaurant": "Restaurant",
    "r.cat.cafe": "Café",
    "r.cat.snack": "Lunch & snacks",
    "r.printHead": "Agenda Waalre · Guided route",
    "r.printFoot": "Printed from Agenda Waalre (Claude version). Independent overview, not an official municipal website. Map data © OpenStreetMap contributors.",
    "r.notFound": "This route does not exist (any more). Please choose another route above.",
    "r.stop": "Stop {n}"
  });
  AW.applyI18n();

  var COLORS = { erfgoed: "#b5522e", cultuur: "#7b3f61", sport: "#2f6b4f", winkels: "#b07d12" };
  var MODE_ICON = {
    fiets: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5.5" cy="16.5" r="3.5"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M5.5 16.5 9 9h6.5l3 7.5M9 9 12 16.5h-6.5M12 16.5 15.5 9M8 6h3M15 6.5h2.5"/></svg>',
    wandel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="13" cy="4" r="2"/><path d="M10 22l2.5-7L10 12l1-5 4 3 3 1M12.5 15l2.5 2 1 5M11 7l-3 2-1 4"/></svg>'
  };
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';

  var routesEl = document.getElementById("routes");
  var detailEl = document.getElementById("route-detail");
  var emptyEl = document.getElementById("route-empty");
  var ROUTES = [], HORECA = {};
  var current = null;
  var map = null, mapLayer = null, stopMarkers = [];
  var overview = null;

  function tiles(m) {
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, className: "tiles-muted",
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap-bijdragers</a>'
    }).addTo(m);
    m.attributionControl.setPrefix(false);
  }

  function renderCards() {
    routesEl.innerHTML = ROUTES.map(function (r) {
      var sel = current && current.id === r.id;
      return '<li><a class="rcard r-' + esc(r.id) + '" href="#' + esc(r.id) + '"' + (sel ? ' aria-current="true"' : "") + ">" +
        '<span class="rcard__top"><span class="rcard__mode">' + (MODE_ICON[r.vervoer] || "") + esc(AW.t("r." + r.vervoer)) + "</span>" +
        '<span class="rcard__n">' + esc(AW.t("r.nStops", { n: r.stops.length })) + "</span></span>" +
        '<span class="rcard__title">' + esc(AW.pick(r, "titel")) + "</span>" +
        '<span class="rcard__intro">' + esc(AW.pick(r, "intro")) + "</span>" +
        '<span class="rcard__go">' + esc(sel ? AW.t("r.selected") : AW.t("r.view")) + " " + (sel ? "" : ARROW) + "</span></a></li>";
    }).join("");
  }

  function showOverview() {
    emptyEl.hidden = false;
    if (!overview) {
      overview = L.map("overview-map", { scrollWheelZoom: false });
      tiles(overview);
      var all = [];
      ROUTES.forEach(function (r) {
        var pts = r.stops.map(function (s) { return [s.lat, s.lng]; });
        all = all.concat(pts);
        L.polyline(pts, { color: COLORS[r.id] || "#1f3d2f", weight: 5, opacity: .85, lineJoin: "round", lineCap: "round", dashArray: r.vervoer === "wandel" ? "2 10" : null })
          .bindTooltip(AW.pick(r, "titel"), { sticky: true })
          .on("click", function () { location.hash = r.id; })
          .addTo(overview);
      });
      overview.fitBounds(all, { padding: [30, 30] });
    } else overview.invalidateSize();
  }

  /* off = verschuiving in px wanneer stops elkaar op de kaart overlappen */
  function stopIcon(nr, col, hot, off) {
    off = off || [0, 0];
    return L.divIcon({
      className: "stop-icon",
      html: '<div class="stop' + (hot ? " is-hot" : "") + '" style="--c:' + col + '">' + nr + "</div>",
      iconSize: [30, 30], iconAnchor: [15 - off[0], 15 - off[1]], popupAnchor: [off[0], off[1] - 16]
    });
  }
  var offsets = [], hotIdx = -1;

  /* Stops die (bijna) op dezelfde plek liggen, schuiven we iets uit elkaar zodat elk nummer leesbaar blijft. */
  function spreadStops() {
    if (!current || !map) return;
    var col = COLORS[current.id] || "#1f3d2f";
    var placed = [];
    offsets = stopMarkers.map(function (m) {
      var p = map.latLngToLayerPoint(m.getLatLng());
      var off = [0, 0];
      var tries = 0, ring = 0;
      function clash(o) {
        return placed.some(function (q) { return Math.abs(q.x - (p.x + o[0])) < 30 && Math.abs(q.y - (p.y + o[1])) < 30; });
      }
      while (clash(off) && tries < 24) {
        ring = 1 + Math.floor(tries / 8);
        var a = (tries % 8) * Math.PI / 4 - Math.PI / 2;
        off = [Math.round(Math.cos(a) * 32 * ring), Math.round(Math.sin(a) * 32 * ring)];
        tries++;
      }
      placed.push({ x: p.x + off[0], y: p.y + off[1] });
      return off;
    });
    stopMarkers.forEach(function (m, j) { m.setIcon(stopIcon(current.stops[j].nr, col, j === hotIdx, offsets[j])); });
    // dun lijntje van verschoven nummer naar het echte punt
    leaderLayer.clearLayers();
    stopMarkers.forEach(function (m, j) {
      if (!offsets[j][0] && !offsets[j][1]) return;
      var p = map.latLngToLayerPoint(m.getLatLng());
      var q = map.layerPointToLatLng(L.point(p.x + offsets[j][0], p.y + offsets[j][1]));
      L.polyline([m.getLatLng(), q], { color: col, weight: 2, opacity: .9, interactive: false }).addTo(leaderLayer);
      L.circleMarker(m.getLatLng(), { radius: 4, color: "#fff", weight: 2, fillColor: col, fillOpacity: 1, interactive: false }).addTo(leaderLayer);
    });
  }
  var leaderLayer = null;

  function select(id) {
    var r = ROUTES.filter(function (x) { return x.id === id; })[0] || null;
    current = r;
    renderCards();
    if (!r) {
      detailEl.hidden = true;
      showOverview();
      if (id) {
        emptyEl.querySelector("p").textContent = AW.t("r.notFound");
      } else {
        emptyEl.querySelector("p").textContent = AW.t("r.pick");
      }
      return;
    }
    emptyEl.hidden = true;
    detailEl.hidden = false;
    var col = COLORS[r.id] || "#1f3d2f";
    detailEl.style.setProperty("--c", col);
    renderDetailText();

    if (!map) {
      map = L.map("route-map", { scrollWheelZoom: false });
      tiles(map);
      mapLayer = L.layerGroup().addTo(map);
      leaderLayer = L.layerGroup().addTo(map);
      map.on("zoomend", spreadStops);
    }
    hotIdx = -1;
    map.invalidateSize();
    mapLayer.clearLayers();
    stopMarkers = [];
    var pts = r.stops.map(function (s) { return [s.lat, s.lng]; });
    // witte onderlijn + gekleurde lijn: leesbaar op elke ondergrond
    L.polyline(pts, { color: "#fff", weight: 9, opacity: .9, lineJoin: "round", lineCap: "round" }).addTo(mapLayer);
    L.polyline(pts, { color: col, weight: 5, opacity: .95, lineJoin: "round", lineCap: "round", dashArray: r.vervoer === "wandel" ? "2 10" : null }).addTo(mapLayer);
    r.stops.forEach(function (s, i) {
      var m = L.marker([s.lat, s.lng], { icon: stopIcon(s.nr, col), title: s.nr + ". " + s.naam, alt: s.nr + ". " + s.naam, keyboard: true, zIndexOffset: i })
        .bindPopup(function () {
          return '<span class="pop__cat" style="--c:' + col + '">' + esc(AW.t("r.stop", { n: s.nr })) + "</span>" +
            '<h3 class="pop__name">' + esc(s.naam) + "</h3>" +
            '<p class="pop__addr">' + esc(s.adres) + "</p>" +
            '<p class="pop__desc" lang="nl">' + esc(s.toelichting) + "</p>" +
            '<div class="pop__actions"><a class="pop__route" href="' + AW.routeUrl(s.lat, s.lng) + '" target="_blank" rel="noopener">' + esc(AW.t("route")) + "</a></div>";
        }, { maxWidth: 290 })
        .on("click", function () { activate(i, false); })
        .addTo(mapLayer);
      stopMarkers.push(m);
    });
    map.fitBounds(pts, { padding: [22, 22], maxZoom: 17 });
    spreadStops();
  }

  function renderDetailText() {
    var r = current;
    if (!r) return;
    var col = COLORS[r.id] || "#1f3d2f";
    document.getElementById("route-titel").textContent = AW.pick(r, "titel");
    document.getElementById("route-intro").textContent = AW.pick(r, "intro");
    document.getElementById("route-facts").innerHTML =
      "<span>" + (MODE_ICON[r.vervoer] || "") + esc(AW.t("r." + r.vervoer)) + "</span>" +
      "<span>" + esc(AW.t("r.nStops", { n: r.stops.length })) + "</span>";
    document.getElementById("print-head").textContent = AW.t("r.printHead");
    document.getElementById("print-foot").textContent = AW.t("r.printFoot");

    document.getElementById("stops").innerHTML = r.stops.map(function (s, i) {
      return '<li><button type="button" class="stopitem" data-i="' + i + '" style="--c:' + col + '">' +
        '<span class="stopitem__nr" aria-hidden="true">' + s.nr + "</span><span>" +
        '<span class="stopitem__name"><span class="visually-hidden">' + esc(AW.t("r.stop", { n: s.nr })) + ": </span>" + esc(s.naam) + "</span>" +
        '<span class="stopitem__addr">' + esc(s.adres) + "</span>" +
        '<span class="stopitem__note" lang="nl">' + esc(s.toelichting) + "</span></span></button></li>";
    }).join("");

    var cups = (r.koffie || []).map(function (id) { return HORECA[id]; }).filter(Boolean);
    document.getElementById("coffee").innerHTML = cups.map(function (h) {
      return "<li><span><span class=\"coffee__name\">" + esc(h.naam) + "</span><br>" +
        '<span class="coffee__addr">' + esc(AW.t("r.cat." + h.categorie)) + " · " + esc(h.adres) + ", " + esc(h.kern) + "</span></span>" +
        '<a href="' + esc(AW.href("kaart.html#horeca-" + h.id)) + '">' + PIN.replace("<svg", '<svg width="16" height="16"') + " " + esc(AW.t("r.onmap")) + "</a></li>";
    }).join("");
    document.querySelector(".coffee").hidden = !cups.length;
  }

  function activate(i, fromList) {
    var col = COLORS[current.id] || "#1f3d2f";
    Array.prototype.forEach.call(document.querySelectorAll(".stopitem"), function (b) {
      b.classList.toggle("is-active", +b.getAttribute("data-i") === i);
    });
    hotIdx = i;
    stopMarkers.forEach(function (m, j) {
      m.setIcon(stopIcon(current.stops[j].nr, col, j === i, offsets[j]));
      m.setZIndexOffset(j === i ? 1000 : j);
    });
    if (!fromList) {
      var item = document.querySelector('.stopitem[data-i="' + i + '"]');
      if (item && !window.matchMedia("(max-width: 900px)").matches) item.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    if (fromList) {
      var m = stopMarkers[i];
      if (window.matchMedia("(max-width: 900px)").matches) document.getElementById("route-map").scrollIntoView({ behavior: "smooth", block: "center" });
      map.flyTo(m.getLatLng(), Math.max(map.getZoom(), 16), { duration: 0.6 });
      map.once("moveend", function () { m.openPopup(); });
    }
  }

  document.getElementById("stops").addEventListener("click", function (ev) {
    var b = ev.target.closest(".stopitem");
    if (b) activate(+b.getAttribute("data-i"), true);
  });

  document.getElementById("print-btn").addEventListener("click", function () { window.print(); });

  function fromHash(scroll) {
    var id = decodeURIComponent((location.hash || "").slice(1));
    select(id);
    if (scroll && current) {
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      detailEl.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }
  window.addEventListener("hashchange", function () { fromHash(true); });

  document.addEventListener("aw:lang", function () {
    AW.applyI18n();
    if (!ROUTES.length) return;
    renderCards();
    renderDetailText();
    if (!current) emptyEl.querySelector("p").textContent = AW.t(location.hash.length > 1 ? "r.notFound" : "r.pick");
  });

  Promise.all([AW.json("data/claude/rondleidingen.json"), AW.json("data/claude/horeca.json")])
    .then(function (res) {
      ROUTES = Array.isArray(res[0]) ? res[0] : (res[0].routes || []);
      res[1].forEach(function (h) { HORECA[h.id] = h; });
      fromHash(false);
    })
    .catch(function (err) {
      routesEl.innerHTML = '<li class="status status--error">' + esc(AW.t("error")) + "</li>";
      if (window.console) console.error(err);
    });
})();
