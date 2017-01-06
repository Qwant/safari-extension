/**
 * @file popup.js
 * @author Qwant
 */
'use strict';

displayOptionsValues();

function openTab (url) {
    var tab = safari.application.activeBrowserWindow.openTab();
    tab.url = url;
    tab.activate();
}

function clearPopOver () {
    document.getElementById('search-input').value = '';
}

function search() {
  var input = document.getElementById("search-input");

  var special = '&client=qwant-safari';

  if (safari.application.activeBrowserWindow.activeTab.url === undefined ||
      safari.application.activeBrowserWindow.activeTab.url === '') {
    safari.application.activeBrowserWindow.activeTab.url = "https://www.qwant.com/?q="+encodeURIComponent(input.value)+special;
  } else {
    openTab("https://www.qwant.com/?q="+encodeURIComponent(input.value)+special);
 }

  safari.extension.popovers[0].hide();

  return false;
}

function engineOpt() {
    safari.extension.settings.engine = document.getElementById('engine').checked;
}

function displayOptionsValues() {
    document.getElementById('engine').checked = safari.extension.settings.engine;
}