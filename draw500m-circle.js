// ==UserScript==
// @id             iitc-plugin-draw500m-circle
// @name           IITC plugin: Debug: Draw 500m Circle for Portal Selected
// @category       Draw
// @version        1.0.0
// @namespace      draw500m
// @updateURL      https://raw.githubusercontent.com/syakesaba/iitc-plugin-draw500m-circle/master/draw500m-circle.js
// @downloadURL    https://raw.githubusercontent.com/syakesaba/iitc-plugin-draw500m-circle/master/draw500m-circle.js
// @description    IITC plugin: Debug: Draw 500m Circle for Portal Selected
// @include https://intel.ingress.com/*
// @match https://intel.ingress.com/*
// @grant          none
// ==/UserScript==

function wrapper(plugin_info) {
// ensure plugin framework is there, even if iitc is not yet loaded
if(typeof window.plugin !== 'function') window.plugin = function() {};

// PLUGIN START ////////////////////////////////////////////////////////

// use own namespace for plugin
window.plugin.draw500m = function() {};

window.plugin.draw500m.setupCallback = function() {
    window.plugin.draw500m.portalRangeInFieldIndicator = null
    addHook('portalSelected', window.plugin.draw500m.drawCircle);
}

//see core/code/portal_detail_display.js
window.plugin.draw500m.drawCircle = function(d) {
  if (window.plugin.draw500m.portalRangeInFieldIndicator) {
    window.map.removeLayer(window.plugin.draw500m.portalRangeInFieldIndicator);
    window.plugin.draw500m.portalRangeInFieldIndicator = null;
  }
  let p = window.portals[d.selectedPortalGuid];
  //let up = window.portals[d.unselectedPortalGuid];
  if (!p) {
    console.warn ('Error: failed to find portal details for guid '+d.selectedPortalGuid+' - failed to fetch data');
    return;
  }
  let coord = p.getLatLng();
  window.plugin.draw500m.portalRangeInFieldIndicator = window.L.geodesicCircle(
    coord, 500, {
      fill: false,
      color: "yellow",
      weight: 3,
      dashArray: "10,10",
      interactive: false
    }
  ).addTo(window.map);
}

var setup = function () {
  window.plugin.draw500m.setupCallback();
}

// PLUGIN END //////////////////////////////////////////////////////////


setup.info = plugin_info; //add the script info data to the function as a property
if(!window.bootPlugins) window.bootPlugins = [];
window.bootPlugins.push(setup);
// if IITC has already booted, immediately run the 'setup' function
if(window.iitcLoaded && typeof setup === 'function') setup();
} // wrapper end
// inject code into site context
var script = document.createElement('script');
var info = {};
if (typeof GM_info !== 'undefined' && GM_info && GM_info.script) info.script = { version: GM_info.script.version, name: GM_info.script.name, description: GM_info.script.description };
script.appendChild(document.createTextNode('('+ wrapper +')('+JSON.stringify(info)+');'));
(document.body || document.head || document.documentElement).appendChild(script);
