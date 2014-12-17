/**
 * @file popup.js
 * @author Qwant
 */
'use strict';

displayOptionsValues();

if (localStorage.lastSearch.length > 0 && safari.extension.settings.saveLastSearch === true) {
	document.getElementById('qwant_popup_search_input').value = localStorage.lastSearch;
}

document.getElementById('qwant_popup_search_input').onkeyup = function () {
	if (this.value.length < 1) {
		clearPopOver();
	}
};

function googleOpt() {
	safari.extension.settings.google = document.getElementById('googleEmbed').checked;
}
function bingOpt() {
	safari.extension.settings.bing = document.getElementById('bingEmbed').checked;
}
function yahooOpt() {
	safari.extension.settings.yahoo = document.getElementById('yahooEmbed').checked;
}
function yandexOpt() {
	safari.extension.settings.yandex = document.getElementById('yandexEmbed').checked;
}
function mailruOpt() {
	safari.extension.settings.mailru = document.getElementById('mailruEmbed').checked;
}
function savelastOpt() {
	safari.extension.settings.saveLastSearch = document.getElementById('savelast').checked;
}
function engineOpt() {
	safari.extension.settings.engine = document.getElementById('engine').checked;
}

function displayOptionsValues() {
	document.getElementById('googleEmbed').checked = safari.extension.settings.google;
	document.getElementById('bingEmbed').checked = safari.extension.settings.bing;
	document.getElementById('yahooEmbed').checked = safari.extension.settings.yahoo;
	document.getElementById('yandexEmbed').checked = safari.extension.settings.yandex;
	document.getElementById('mailruEmbed').checked = safari.extension.settings.mailru;
	document.getElementById('saveLast').checked = safari.extension.settings.saveLastSearch;
	document.getElementById('engine').checked = safari.extension.settings.engine;
}

function openTab(url) {
	var tab = safari.application.activeBrowserWindow.openTab();
	tab.url = url;
	tab.activate();
}

function clearPopOver() {
	document.getElementById('qwant_popup_search_input').value = '';
}

function search() {
	var input = document.getElementById("qwant_popup_search_input").value;

	if (safari.extension.settings.saveLastSearch === true) {
		localStorage.lastSearch = input;
	} else {
		clearPopOver();
	}

	if (safari.application.activeBrowserWindow.activeTab.url === undefined || safari.application.activeBrowserWindow.activeTab.url.length < 1) {
		safari.application.activeBrowserWindow.activeTab.url = "https://www.qwant.com/?q="+encodeURIComponent(input);
	} else {
		openTab("https://www.qwant.com/?q=" + encodeURIComponent(input));
	}
	safari.extension.popovers[0].hide();
}