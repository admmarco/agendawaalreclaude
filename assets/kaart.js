/* Agenda Waalre — Kaart */
(function () {
  "use strict";
  var AW = window.AW;
  var esc = AW.esc;

  AW.extend({
    "k.mapLabel": "Kaart van Aalst en Waalre",
    "k.kicker": "Aalst & Waalre",
    "k.title": "Kaart",
    "k.intro": "Waar ontmoet je mensen, waar drink je koffie? Zet lagen aan of uit en tik op een plek.",
    "k.layers": "Wat wil je zien?",
    "k.list": "Lijst van plekken",
    "k.l.venues": "Ontmoetingsplekken",
    "k.l.venuesSub": "Buurthuizen, kerken, sport",
    "k.l.horeca": "Koffie & eten",
    "k.l.horecaSub": "Restaurant · café · lunch & snacks",
    "k.l.routes": "Rondleidingen",
    "k.l.routesSub": "Vier fiets- en wandelroutes",
    "k.l.winkels": "Winkels",
    "k.l.winkelsSub": "Supermarkt, bakker, slager",
    "k.cat.venue": "Ontmoetingsplek",
    "k.cat.restaurant": "Restaurant",
    "k.cat.cafe": "Café & brasserie",
    "k.cat.snack": "Lunch & snacks",
    "k.cat.winkel": "Winkel",
    "k.cat.route": "Rondleiding",
    "k.cat.temp": "Gekozen locatie",
    "k.thisweek": "Activiteiten deze week: {n}",
    "k.seeacts": "Bekijk activiteiten",
    "k.stops": "{n} stops",
    "k.openRoute": "Open deze rondleiding",
    "k.stop": "Stop {n}",
    "k.showall": "Toon alles",
    "k.showallTitle": "Toon alle zichtbare plekken op de kaart",
    "k.zoomIn": "Inzoomen",
    "k.zoomOut": "Uitzoomen",
    "k.noneOn": "Zet hierboven een laag aan om plekken te zien.",
    "k.places": "plekken",
    "k.website": "Website",
    "k.venueAgenda": "Bekijk de agenda van deze plek"
  }, {
    "k.mapLabel": "Map of Aalst and Waalre",
    "k.kicker": "Aalst & Waalre",
    "k.title": "Map",
    "k.intro": "Where do people meet, where can you get a coffee? Switch layers on or off and tap a place.",
    "k.layers": "What would you like to see?",
    "k.list": "List of places",
    "k.l.venues": "Meeting places",
    "k.l.venuesSub": "Community centres, churches, sport",
    "k.l.horeca": "Coffee & food",
    "k.l.horecaSub": "Restaurant · café · lunch & snacks",
    "k.l.routes": "Guided routes",
    "k.l.routesSub": "Four cycling and walking routes",
    "k.l.winkels": "Shops",
    "k.l.winkelsSub": "Supermarket, baker, butcher",
    "k.cat.venue": "Meeting place",
    "k.cat.restaurant": "Restaurant",
    "k.cat.cafe": "Café & brasserie",
    "k.cat.snack": "Lunch & snacks",
    "k.cat.winkel": "Shop",
    "k.cat.route": "Guided route",
    "k.cat.temp": "Selected location",
    "k.thisweek": "Activities this week: {n}",
    "k.seeacts": "See activities",
    "k.stops": "{n} stops",
    "k.openRoute": "Open this route",
    "k.stop": "Stop {n}",
    "k.showall": "Show all",
    "k.showallTitle": "Show all visible places on the map",
    "k.zoomIn": "Zoom in",
    "k.zoomOut": "Zoom out",
    "k.noneOn": "Switch on a layer above to see places.",
    "k.places": "places",
    "k.website": "Website",
    "k.venueAgenda": "See this venue's own agenda"
  });
  AW.applyI18n();

  var ROUTE_COLORS = { erfgoed: "#b5522e", cultuur: "#7b3f61", sport: "#2f6b4f", winkels: "#b07d12" };
  var ICON = {
    venue: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2.5 19c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5M10.5 19c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5"/></svg>',
    cup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3v3M12 3v3"/></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>',
    nav: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l18-8-8 18-2-8z"/></svg>',
    expand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9V4h5M20 15v5h-5M15 4h5v5M9 20H4v-5"/></svg>'
  };

  var mobileMq = window.matchMedia("(max-width: 900px)");
  var legendEl = document.getElementById("legenda");

  /* hoogte van de kaart = scherm minus kop */
  function sizePage() {
    var h = document.querySelector(".site-head").offsetHeight;
    document.querySelector(".map-page").style.setProperty("height", mobileMq.matches ? "auto" : "calc(100dvh - " + h + "px)");
  }
  sizePage();

  var map = L.map("kaart", { zoomControl: false, zoomSnap: 0.25, zoomDelta: 0.5 });
  var zoomCtl = L.control.zoom({ position: mobileMq.matches ? "bottomright" : "topright", zoomInTitle: AW.t("k.zoomIn"), zoomOutTitle: AW.t("k.zoomOut") }).addTo(map);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    className: "tiles-muted",
    attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap-bijdragers</a>'
  }).addTo(map);
  map.attributionControl.setPrefix(false);
  map.setView([51.392, 5.465], 14);
  // op een telefoon verdwijnen de zoomknoppen zolang er een popup open is, zodat niets de popup bedekt
  map.on("popupopen", function () { map.getContainer().classList.add("has-popup"); });
  map.on("popupclose", function () { map.getContainer().classList.remove("has-popup"); });

  var cluster = L.markerClusterGroup({
    maxClusterRadius: function (z) { return z >= 16 ? 24 : 40; },
    showCoverageOnHover: false,
    spiderfyDistanceMultiplier: 1.8,
    spiderLegPolylineOptions: { weight: 1.5, color: "#1f3d2f", opacity: .55 },
    iconCreateFunction: function (c) {
      var n = c.getChildCount();
      return L.divIcon({
        className: "cluster-icon",
        html: '<div class="cluster" title="' + n + " " + AW.t("k.places") + '">' + n + "</div>",
        iconSize: [46, 46], iconAnchor: [23, 23]
      });
    }
  });
  map.addLayer(cluster);
  // routelijnen en stops onder de pins/clusters, zodat clustergetallen leesbaar blijven
  map.createPane("routeLines").style.zIndex = 410;
  map.createPane("routeStops").style.zIndex = 450;
  var routeLayer = L.layerGroup().addTo(map);

  /* popups passen altijd in de kaart en blijven onder de zoomknoppen */
  function popOpts() {
    var w = document.getElementById("kaart").clientWidth || 360;
    var small = w < 520;
    return {
      maxWidth: Math.min(310, w - 64),
      minWidth: Math.min(230, w - 64),
      autoPanPaddingTopLeft: small ? [12, 64] : [40, 40],
      autoPanPaddingBottomRight: small ? [12, 12] : [40, 40]
    };
  }

  var layersOn = { venues: true, horeca: true, routes: true, winkels: false };
  var entries = [];          // punten: { key, layer, kind, data, marker, btn }
  var routes = [];           // { data, line, stops: [markers], btn }
  var tempMarker = null;
  var activeKey = null;
  var D = {};                // geladen data

  function kindLabel(k) { return AW.t("k.cat." + k); }

  function pinIcon(kind, svg, small) {
    return L.divIcon({
      className: "pin-icon k-" + kind,
      html: '<div class="pin' + (small ? " pin--small" : "") + '">' + svg + "</div>",
      iconSize: small ? [26, 26] : [34, 34],
      iconAnchor: small ? [13, 32] : [17, 40],
      popupAnchor: [0, small ? -32 : -40]
    });
  }

  function weekCount(venueId) {
    var r = AW.weekRange();
    return D.events.filter(function (e) {
      if (e.date < r[0] || e.date > r[1]) return false;
      if (e.venueId === venueId) return true;
      var v = D.venueById[e.venueId];
      return v && v.partOf === venueId;
    }).length;
  }

  function routeBtn(lat, lng) {
    return '<a class="pop__route" href="' + AW.routeUrl(lat, lng) + '" target="_blank" rel="noopener">' + ICON.nav + esc(AW.t("route")) + "</a>";
  }

  /* ---------- popups ---------- */
  function popVenue(v, ll) {
    var n = weekCount(v.id);
    var addr = [v.address, [v.postcode, v.dorp].filter(Boolean).join(" ")].filter(Boolean).join("<br>");
    return '<div class="k-venue"><span class="pop__cat">' + esc(kindLabel("venue")) + "</span>" +
      '<h3 class="pop__name">' + esc(v.name) + "</h3>" +
      '<p class="pop__addr">' + addr + "</p>" +
      (v.description ? '<p class="pop__desc" lang="nl">' + esc(v.description) + "</p>" : "") +
      (n ? '<p class="pop__count">' + esc(AW.t("k.thisweek", { n: n })) +
        ' · <a class="pop__link" href="' + esc(AW.href("index.html?venue=" + encodeURIComponent(v.id))) + '">' + esc(AW.t("k.seeacts")) + "</a></p>"
        : (v.agenda ? '<p class="pop__count"><a class="pop__link" href="' + esc(v.agenda) + '" target="_blank" rel="noopener">' + esc(AW.t("k.venueAgenda")) + "</a></p>" : "")) +
      '<div class="pop__actions">' + routeBtn(ll.lat, ll.lng) +
      (v.website ? '<a class="pop__link" href="' + esc(v.website) + '" target="_blank" rel="noopener">' + esc(AW.t("k.website")) + "</a>" : "") +
      "</div></div>";
  }
  function popHoreca(h) {
    return '<div class="k-' + h.categorie + '"><span class="pop__cat">' + esc(kindLabel(h.categorie)) + "</span>" +
      '<h3 class="pop__name">' + esc(h.naam) + "</h3>" +
      '<p class="pop__addr">' + esc(h.adres) + " · " + esc(h.kern) + "</p>" +
      '<div class="pop__actions">' + routeBtn(h.lat, h.lng) + "</div></div>";
  }
  function popWinkel(w, ll) {
    return '<div class="k-winkel"><span class="pop__cat">' + esc(w.subcategory || kindLabel("winkel")) + "</span>" +
      '<h3 class="pop__name">' + esc(w.name) + "</h3>" +
      '<p class="pop__addr">' + esc(w.address) + "</p>" +
      (w.description ? '<p class="pop__desc" lang="nl">' + esc(w.description) + "</p>" : "") +
      '<div class="pop__actions">' + routeBtn(ll.lat, ll.lng) +
      (w.url ? '<a class="pop__link" href="' + esc(w.url) + '" target="_blank" rel="noopener">' + esc(AW.t("k.website")) + "</a>" : "") +
      "</div></div>";
  }
  function popStop(r, s) {
    return '<div><span class="pop__cat" style="--c:' + ROUTE_COLORS[r.id] + '">' + esc(AW.pick(r, "titel")) + "</span>" +
      '<h3 class="pop__name">' + esc(AW.t("k.stop", { n: s.nr })) + " · " + esc(s.naam) + "</h3>" +
      '<p class="pop__addr">' + esc(s.adres) + "</p>" +
      '<p class="pop__desc" lang="nl">' + esc(s.toelichting) + "</p>" +
      '<div class="pop__actions">' + routeBtn(s.lat, s.lng) +
      '<a class="pop__link" href="' + esc(AW.href("rondleidingen.html#" + r.id)) + '">' + esc(AW.t("k.openRoute")) + "</a></div></div>";
  }
  function popTemp(label, lat, lng) {
    return '<div class="k-temp"><span class="pop__cat">' + esc(kindLabel("temp")) + "</span>" +
      '<h3 class="pop__name">' + esc(label || "") + "</h3>" +
      '<div class="pop__actions">' + routeBtn(lat, lng) + "</div></div>";
  }

  /* ---------- opbouwen ---------- */
  function addEntry(key, layer, kind, data, ll, svg, popupFn, small) {
    var marker = L.marker(ll, {
      icon: pinIcon(kind, svg, small),
      title: data.name || data.naam,
      alt: data.name || data.naam,
      keyboard: true,
      riseOnHover: true
    }).bindPopup(function () { return popupFn(); }, popOpts());
    var e = { key: key, layer: layer, kind: kind, data: data, marker: marker, btn: null };
    marker.on("click", function () { setActive(key, true); });
    marker.on("popupclose", function () { if (activeKey === key) setActive(null); });
    marker.on("mouseover", function () { if (e.btn) e.btn.classList.add("is-hover"); });
    marker.on("mouseout", function () { if (e.btn) e.btn.classList.remove("is-hover"); });
    marker.on("add", function () { if (activeKey === key) hot(e, true); });
    entries.push(e);
    return e;
  }

  function build() {
    D.venues.forEach(function (v) {
      var c = D.coords["venue:" + v.id];
      if (!c) return;
      var ll = L.latLng(c.lat, c.lng);
      addEntry("venue-" + v.id, "venues", "venue", v, ll, ICON.venue, function () { return popVenue(v, ll); });
    });
    D.horeca.forEach(function (h) {
      addEntry("horeca-" + h.id, "horeca", h.categorie, h, L.latLng(h.lat, h.lng), ICON.cup, function () { return popHoreca(h); }, true);
    });
    D.winkels.forEach(function (w, i) {
      var c = D.coords["voorziening:" + w.name];
      if (!c) return;
      var ll = L.latLng(c.lat, c.lng);
      addEntry("winkel-" + slug(w.name), "winkels", "winkel", w, ll, ICON.bag, function () { return popWinkel(w, ll); }, true);
    });
    D.routes.forEach(function (r) {
      var col = ROUTE_COLORS[r.id] || "#1f3d2f";
      var pts = r.stops.map(function (s) { return [s.lat, s.lng]; });
      var line = L.polyline(pts, { pane: "routeLines", color: col, weight: 3.5, opacity: .55, lineJoin: "round", dashArray: r.vervoer === "wandel" ? "2 9" : null, lineCap: "round" });
      line.bindPopup(function () {
        return '<div><span class="pop__cat" style="--c:' + col + '">' + esc(AW.t("k.cat.route")) + "</span>" +
          '<h3 class="pop__name">' + esc(AW.pick(r, "titel")) + "</h3>" +
          '<p class="pop__desc">' + esc(AW.pick(r, "intro")) + "</p>" +
          '<div class="pop__actions"><a class="pop__route" href="' + esc(AW.href("rondleidingen.html#" + r.id)) + '">' + esc(AW.t("k.openRoute")) + "</a></div></div>";
      }, popOpts());
      var stops = r.stops.map(function (s) {
        return L.marker([s.lat, s.lng], {
          icon: L.divIcon({ className: "stop-icon", html: '<div class="stop stop--small" style="--c:' + col + '"></div>', iconSize: [14, 14], iconAnchor: [7, 7], popupAnchor: [0, -8] }),
          title: s.nr + ". " + s.naam, alt: s.nr + ". " + s.naam, keyboard: true, pane: "routeStops"
        }).bindPopup(function () { return popStop(r, s); }, popOpts());
      });
      routes.push({ data: r, line: line, stops: stops, color: col });
    });
    syncLayers();
    renderLegend();
  }

  function slug(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function syncLayers() {
    entries.forEach(function (e) {
      var on = layersOn[e.layer];
      if (on && !cluster.hasLayer(e.marker)) cluster.addLayer(e.marker);
      if (!on && cluster.hasLayer(e.marker)) cluster.removeLayer(e.marker);
    });
    routes.forEach(function (r) {
      [r.line].concat(r.stops).forEach(function (l) {
        if (layersOn.routes && !routeLayer.hasLayer(l)) routeLayer.addLayer(l);
        if (!layersOn.routes && routeLayer.hasLayer(l)) routeLayer.removeLayer(l);
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll(".layer"), function (b) {
      b.setAttribute("aria-pressed", layersOn[b.getAttribute("data-layer")] ? "true" : "false");
    });
    Array.prototype.forEach.call(legendEl.querySelectorAll("[data-group]"), function (g) {
      g.hidden = !layersOn[g.getAttribute("data-group")];
    });
    var none = legendEl.querySelector("[data-none]");
    if (none) none.hidden = Object.keys(layersOn).some(function (k) { return layersOn[k]; });
  }

  /* ---------- lijst ---------- */
  function renderLegend() {
    var html = "";
    var groups = [
      { id: "venues", title: AW.t("k.l.venues") },
      { id: "horeca", title: AW.t("k.l.horeca") },
      { id: "routes", title: AW.t("k.l.routes") },
      { id: "winkels", title: AW.t("k.l.winkels") }
    ];
    groups.forEach(function (g) {
      html += '<div data-group="' + g.id + '"><h2 class="legend__group">' + esc(g.title) + '</h2><ul class="legend__list">';
      if (g.id === "routes") {
        routes.forEach(function (r) {
          html += '<li><button type="button" class="place" data-route="' + r.data.id + '" style="--c:' + r.color + '">' +
            '<span class="place__dot" aria-hidden="true">' + r.data.stops.length + "</span><span>" +
            '<span class="place__name">' + esc(AW.pick(r.data, "titel")) + "</span>" +
            '<span class="place__meta">' + esc(AW.t("k.stops", { n: r.data.stops.length })) + " · " + esc(AW.pick(r.data, "intro")) + "</span></span></button></li>";
        });
      } else {
        var list = entries.filter(function (e) { return e.layer === g.id; });
        if (g.id === "horeca") {
          var order = { cafe: 0, restaurant: 1, snack: 2 };
          list.sort(function (a, b) { return order[a.kind] - order[b.kind] || a.data.naam.localeCompare(b.data.naam, "nl"); });
        } else {
          list.sort(function (a, b) { return (a.data.name || "").localeCompare(b.data.name || "", "nl"); });
        }
        list.forEach(function (e) {
          var d = e.data, name, meta, extra = "";
          if (e.kind === "venue") {
            name = d.name; meta = [d.address, d.dorp].filter(Boolean).join(" · ");
            var n = weekCount(d.id);
            if (n) extra = '<span class="place__count">' + esc(AW.t("k.thisweek", { n: n })) + "</span>";
          } else if (e.layer === "horeca") {
            name = d.naam; meta = kindLabel(e.kind) + " · " + d.adres + " · " + d.kern;
          } else {
            name = d.name; meta = (d.subcategory ? d.subcategory + " · " : "") + d.address;
          }
          var svg = e.kind === "venue" ? ICON.venue : e.layer === "horeca" ? ICON.cup : ICON.bag;
          html += '<li><button type="button" class="place k-' + e.kind + '" data-key="' + e.key + '">' +
            '<span class="place__dot" aria-hidden="true">' + svg + "</span><span>" +
            '<span class="place__name">' + esc(name) + "</span>" +
            '<span class="place__meta">' + esc(meta) + "</span>" + extra + "</span></button></li>";
        });
      }
      html += "</ul></div>";
    });
    html += '<p class="status" data-none hidden>' + esc(AW.t("k.noneOn")) + "</p>";
    legendEl.innerHTML = html;
    entries.forEach(function (e) { e.btn = legendEl.querySelector('[data-key="' + e.key + '"]'); });
    if (activeKey) setActive(activeKey, false);
    syncLayers();
  }

  legendEl.addEventListener("click", function (ev) {
    var b = ev.target.closest(".place");
    if (!b) return;
    var rk = b.getAttribute("data-route");
    if (rk) { focusRoute(rk); return; }
    var e = byKey(b.getAttribute("data-key"));
    if (e) focusEntry(e);
  });
  legendEl.addEventListener("mouseover", function (ev) {
    var b = ev.target.closest(".place[data-key]");
    if (b) { var e = byKey(b.getAttribute("data-key")); if (e) hot(e, true); }
  });
  legendEl.addEventListener("mouseout", function (ev) {
    var b = ev.target.closest(".place[data-key]");
    if (b) { var e = byKey(b.getAttribute("data-key")); if (e && e.key !== activeKey) hot(e, false); }
  });

  function byKey(k) { for (var i = 0; i < entries.length; i++) if (entries[i].key === k) return entries[i]; return null; }

  function hot(e, on) {
    var el = e.marker.getElement();
    if (el) { var p = el.querySelector(".pin"); if (p) p.classList.toggle("is-hot", on); }
    e.marker.setZIndexOffset(on ? 1000 : 0);
  }

  function setActive(key, scroll) {
    activeKey = key;
    entries.forEach(function (e) {
      var on = e.key === key;
      if (e.btn) { e.btn.classList.toggle("is-active", on); e.btn.setAttribute("aria-current", on ? "true" : "false"); }
      hot(e, on);
    });
    if (scroll && key && !mobileMq.matches) {
      var e = byKey(key);
      if (e && e.btn) e.btn.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }

  function openWhenVisible(e, tries) {
    tries = tries || 0;
    var m = e.marker;
    if (m._icon) { m.openPopup(); hot(e, true); return; }
    var vp = cluster.getVisibleParent(m);
    if (vp && vp !== m && vp.spiderfy && !cluster._inZoomAnimation) vp.spiderfy();
    if (tries < 25) setTimeout(function () { openWhenVisible(e, tries + 1); }, 200);
  }

  function focusEntry(e) {
    if (!layersOn[e.layer]) { layersOn[e.layer] = true; syncLayers(); }
    setActive(e.key, false);
    map.closePopup();
    if (mobileMq.matches) document.getElementById("kaart").scrollIntoView({ behavior: "smooth", block: "start" });
    var ll = e.marker.getLatLng();
    var done = false;
    function open() { if (done) return; done = true; setTimeout(function () { openWhenVisible(e); }, 120); }
    var z = Math.max(map.getZoom(), 17);
    if (map.getCenter().distanceTo(ll) < 5 && Math.abs(map.getZoom() - z) < 0.01) { open(); return; }
    map.once("moveend", open);
    setTimeout(open, 1600);
    map.flyTo(ll, z, { duration: 0.8 });
  }

  function focusRoute(id) {
    var r = routes.filter(function (x) { return x.data.id === id; })[0];
    if (!r) return;
    if (!layersOn.routes) { layersOn.routes = true; syncLayers(); }
    setActive(null);
    if (mobileMq.matches) document.getElementById("kaart").scrollIntoView({ behavior: "smooth", block: "start" });
    map.flyToBounds(r.line.getBounds(), { padding: [50, 50], duration: 0.8 });
    map.once("moveend", function () { r.line.openPopup(r.line.getCenter()); });
  }

  function fitAll(animate) {
    var pts = [];
    entries.forEach(function (e) { if (layersOn[e.layer]) pts.push(e.marker.getLatLng()); });
    if (layersOn.routes) routes.forEach(function (r) { pts = pts.concat(r.line.getLatLngs()); });
    if (!pts.length) return;
    map.fitBounds(L.latLngBounds(pts), { padding: mobileMq.matches ? [30, 30] : [60, 60], maxZoom: 16, animate: animate !== false });
  }

  /* "Toon alles" */
  var ResetControl = L.Control.extend({
    options: { position: "topleft" },
    onAdd: function () {
      var b = L.DomUtil.create("button", "map-btn");
      b.type = "button";
      b.id = "reset-btn";
      L.DomEvent.disableClickPropagation(b);
      L.DomEvent.on(b, "click", function () { map.closePopup(); setActive(null); fitAll(true); });
      return b;
    }
  });
  map.addControl(new ResetControl());
  function labelReset() {
    var b = document.getElementById("reset-btn");
    b.innerHTML = ICON.expand + esc(AW.t("k.showall"));
    b.title = AW.t("k.showallTitle");
  }
  labelReset();

  Array.prototype.forEach.call(document.querySelectorAll(".layer"), function (b) {
    b.addEventListener("click", function () {
      var k = b.getAttribute("data-layer");
      layersOn[k] = !layersOn[k];
      if (!layersOn[k]) {
        var a = activeKey && byKey(activeKey);
        if (a && a.layer === k) { map.closePopup(); setActive(null); }
      }
      syncLayers();
    });
  });

  /* ---------- adresbalk: #venue-x, #horeca-x, ?lat=&lng=&label= ---------- */
  function fromUrl(initial) {
    var q;
    try { q = new URLSearchParams(location.search); } catch (e) { q = null; }
    var lat = q && parseFloat(q.get("lat")), lng = q && parseFloat(q.get("lng"));
    if (initial && isFinite(lat) && isFinite(lng)) {
      var label = q.get("label") || "";
      tempMarker = L.marker([lat, lng], {
        icon: L.divIcon({ className: "pin-icon k-temp", html: '<div class="pin pin--temp">' + ICON.star + "</div>", iconSize: [40, 40], iconAnchor: [20, 46], popupAnchor: [0, -46] }),
        title: label, alt: label, keyboard: true, zIndexOffset: 2000
      }).bindPopup(function () { return popTemp(label, lat, lng); }, popOpts()).addTo(map);
      map.setView([lat, lng], 17, { animate: false });
      setTimeout(function () { tempMarker.openPopup(); }, 250);
      return true;
    }
    var h = decodeURIComponent((location.hash || "").slice(1));
    if (h) {
      var e = byKey(h);
      if (e) {
        if (initial) map.setView(e.marker.getLatLng(), 17, { animate: false });
        focusEntry(e);
        return true;
      }
    }
    return false;
  }
  window.addEventListener("hashchange", function () { fromUrl(false); });

  document.addEventListener("aw:lang", function () {
    AW.applyI18n();
    labelReset();
    zoomCtl.getContainer().querySelector(".leaflet-control-zoom-in").title = AW.t("k.zoomIn");
    zoomCtl.getContainer().querySelector(".leaflet-control-zoom-out").title = AW.t("k.zoomOut");
    cluster.refreshClusters();
    if (entries.length) {
      renderLegend();
      var open = map._popup && map._popup.isOpen && map._popup.isOpen() ? map._popup : null;
      if (open && open._source) { var src = open._source; src.closePopup(); src.openPopup(); }
    }
  });

  /* ---------- data ---------- */
  function listOf(d) { return Array.isArray(d) ? d : (Object.keys(d).map(function (k) { return d[k]; }).filter(Array.isArray)[0] || []); }

  Promise.all([
    AW.json("data/venues.json"),
    AW.json("data/claude/coords.json"),
    AW.json("data/claude/horeca.json"),
    AW.json("data/claude/rondleidingen.json"),
    AW.json("data/voorzieningen.json"),
    AW.json("data/events.json")
  ]).then(function (res) {
    D.venues = res[0];
    D.venueById = {};
    D.venues.forEach(function (v) { D.venueById[v.id] = v; });
    D.coords = res[1];
    D.horeca = res[2];
    D.routes = listOf(res[3]);
    D.winkels = listOf(res[4]).filter(function (x) { return x.category === "winkels"; });
    D.events = res[5];
    build();
    map.invalidateSize();
    if (!fromUrl(true)) fitAll(false);
  }).catch(function (err) {
    legendEl.innerHTML = '<p class="status status--error">' + esc(AW.t("error")) + "</p>";
    if (window.console) console.error(err);
  });

  var lastSize = "";
  function onResize() {
    sizePage();
    var el = document.getElementById("kaart");
    var s = el.clientWidth + "x" + el.clientHeight;
    if (s === lastSize) return;
    lastSize = s;
    map.invalidateSize();
    var o = popOpts();
    var all = entries.map(function (e) { return e.marker; });
    routes.forEach(function (r) { all = all.concat(r.stops, [r.line]); });
    if (tempMarker) all.push(tempMarker);
    all.forEach(function (l) { var p = l.getPopup && l.getPopup(); if (p) L.Util.extend(p.options, o); });
  }
  if (window.ResizeObserver) new ResizeObserver(onResize).observe(document.getElementById("kaart"));
  window.addEventListener("resize", onResize);
})();
