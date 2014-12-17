/**
 * @file engines.js
 * @author Qwant
 */
'use strict';

var disabledOn = {
	bing: '',
	google: 'tbm=',
	mail: '',
	yahoo: 'tbm=',
	yandex: 'tbm='
},
	url = window.location.hostname.split('.'),
	hostname = url[url.length - 2],
	getInput = function (hostname) {
		var query;
		switch (hostname) {
		case 'bing':
			query = document.getElementsByName('q')[0];
			break;
		case 'google':
			query = document.getElementsByName('q')[0];
			break;
		case 'mail':
			query = document.getElementsByName('q')[0];
			break;
		case 'yahoo':
			query = document.getElementsByName('p')[0];
			break;
		case 'yandex':
			query = document.querySelector('.input__control');
			break;
		}
		return query;
	},
	qwtEmbed,
	qwtSpinner,
	qwtParent;

safari.self.addEventListener('message', function (event) {
	if (event.name === 'reply_allowed' && event.message.allowed === true) {
		show();
	}
	if (event.name === 'reply_embed') {
		fillEmbed(null, null, event.message.json, event.message.query);
	}
}, false);
/**
 * Shows the addon
 * @function show
 * @param text
 */
var show = function () {
	// Variables definition
	var getQuery = function () {
		var query;
		switch (hostname) {
		case 'bing':
			query = document.getElementsByName('q')[0].value;
			break;
		case 'google':
			query = document.getElementsByName('q')[0].value;
			break;
		case 'mail':
			query = document.getElementsByName('q')[0].value;
			break;
		case 'yahoo':
			query = document.getElementsByName('p')[0].value;
			break;
		case 'yandex':
			query = document.querySelector('.input__control').value;
			break;
		}
		return query;
	},
		getTarget = function (hostname) {
			var target;
			switch (hostname) {
			case 'bing':
				target = document.getElementById('b_context');
				break;
			case 'google':
				if (navigator.appVersion.indexOf("Mac") !== -1) { // Safari Mac
					target = document.getElementById('rhs');
				} else { // Safari Windows
					target = document.getElementById('desktop-search').children[1].lastChild;
				}
				break;
			case 'mail':
				target = document.getElementById('layout-rightcol');
				break;
			case 'yahoo':
				target = document.getElementById('right');
				break;
			case 'yandex':
				target = document.querySelector('.content__left');
				break;
			}
			return target;
		},
		data = {
			preferredLanguage: window.navigator.language.substr(0, 2),
			search: window.location.search,
			ext: url[url.length - 1],
			hostname: url[url.length - 2],
			disabledOn: disabledOn[hostname],
			query: getQuery(hostname),
			target: getTarget(hostname)
		},
		qwtEmbed = document.createElement('div'),
		qwtSpinner = createSpinner(),
		qwtParent = data.target;

	// Displays the addon
	if (data.disabledOn === "" || ((data.search.indexOf(data.disabledOn) === -1) && (data.query.length > 0))) {

		qwtEmbed.setAttribute('class', 'qwt-embed qwt-embed-' + data.hostname);
		fillEmbed(qwtEmbed, qwtSpinner, null, data.query);

		if (qwtParent.hasChildNodes) {
			qwtParent.insertBefore(qwtEmbed, qwtParent.firstChild);
		} else {
			qwtParent.appendChild(qwtEmbed);
		}

		var lang = navigator.language.slice(0, 2) || navigator.userLanguage.slice(0, 2) || data.ext;

			safari.self.tab.dispatchMessage('ask_embed', {query: data.query, ext: lang});

		document.body.addEventListener('mousedown', exchange, false);

	} else {
		console.log('AddOn disabled on this page or query empty');
	}
};
/**
 * Create a loading spinner.
 * @function createSpinner
 * @returns {HTMLElement}
 */
var createSpinner = function () {
	var qwtSpinner = document.createElement('div');
	qwtSpinner.setAttribute('class', 'qwt-spinner');
	return qwtSpinner;
};
/**
 * Sort the results.
 * @function sortResults
 * @param results
 * @returns {{web: Array, news: Array, media: Array, social: Array}}
 */
var sortResults = function (results) {
	var sorted	= {
		web		: [],
		news	: [],
		media	: [],
		social	: []
	};
	for (var i = 0; i < results.length; ++i) {
		switch (results[i]._type) {
			case 'web' :
				sorted.web.push(results[i]);
				break;
			case 'news' :
				sorted.news.push(results[i]);
				break;
			case 'media' :
				sorted.media.push(results[i]);
				break;
			case 'social' :
				sorted.social.push(results[i]);
				break;
		}
	}
	return sorted;
};
/**
 * Fill the embedded Qwant object.
 * @function fillEmbed
 * @param qwtEmbed
 * @param qwtSpinner
 * @param results
 */
var fillEmbed = function (qwtEmbed, qwtSpinner, results, query) {
	if (results === null) {
		qwtEmbed.appendChild(qwtSpinner);
	} else {
		var qwtResults = document.createElement('div'),
			qwtFragment = document.createDocumentFragment(),
			sortedResults = sortResults(results);

		qwtResults.setAttribute('class', 'qwt-results');

		if (sortedResults.web.length > 0) {
			var webResults = createWeb(sortedResults.web);
			qwtResults.appendChild(webResults);
		}
		if (sortedResults.news.length > 0) {
			var newsResults = createNews(sortedResults.news);
			qwtResults.appendChild(newsResults);
		}
		if (sortedResults.media.length > 0) {
			var mediaResults = createMedia(sortedResults.media);
			qwtResults.appendChild(mediaResults);
		}
		if (sortedResults.social.length > 0) {
			var socialResults = createSocial(sortedResults.social);
			qwtResults.appendChild(socialResults);
		}

		//qwtFragment.appendChild(createHeader());
		qwtFragment.appendChild(qwtResults);
		qwtFragment.appendChild(createFooter(query));
		document.querySelector('.qwt-spinner').setAttribute('style', 'display:none');
		document.querySelector('.qwt-embed').appendChild(qwtFragment);
	}
};
/**
 * Create the header section.
 * @function createHeader
 * @returns {HTMLElement}
 */
var createHeader = function () {
	var qwtHeader = document.createElement('div');
	qwtHeader.setAttribute('class', 'qwt-header');

	var qwtOptions = document.createElement('a');
	qwtOptions.setAttribute('class', 'qwt-options');
	qwtOptions.setAttribute('title', 'options');
	qwtOptions.setAttribute('href', '#');
	qwtOptions.addEventListener('click', function(e){
		e.preventDefault();
		self.port.emit('options');
	});

	var qwtOptionsImg = document.createElement('img');
	qwtOptionsImg.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABL0lEQVQ4jY1SscqDMBDuLiR2EOIiHYROLbgUB7GLS1C6iJNTXzJrmxu6C76ALyB9g69L41+T/KUHB0fu7rt8391m88UYi1LGovRbzVcLw5jCMKafGzgXnZnIuegMAOeiMz8ysWdalIVhTHwbK76NlWleQFbvUeYAaP3IDscT2Y22H44n0vrhAgAQvwIAEF7+n4VFWdE0TTRNExVltaZj6+CbdLtrBUACkLe7djRZbaduWkp2+1Uyz8/S5PP8LD9zyW5PddP+AQCgYRgd1RkTkjEh7a0Mw0gA1vcBoLO5+rwoKwLg3kIQRMKm4fNkt6cgiNwtSHnJzIS+vzqNfX9dtiHlxXsH2TCMNM9PBUB9avLmrOb5qd6xC2B0AJCauG5aqpt24Qwg9fL/zwC4alv2Ag4I6fETvv/XAAAAAElFTkSuQmCC');

	qwtHeader.appendChild(qwtOptions);
	qwtOptions.appendChild(qwtOptionsImg);

	return qwtHeader;
};
/**
 * Create the Web results section.
 * @param webResults
 * @returns {HTMLElement}
 */
var createWeb = function (webResults) {
	var qwtWeb = document.createElement('div');
	qwtWeb.setAttribute('class', 'qwt-web');

	for (var i = 0; i < 1; ++i) {
		var qwtWebResultLink = document.createElement('div'),
			qwtLink = document.createElement('a'),
			qwtLinkInfo = document.createElement('div'),
			qwtLinkUrl = document.createElement('span'),
			urlParser = document.createElement('a');

		urlParser.href = webResults[i].url;

		qwtWebResultLink.setAttribute('class', 'qwt-web-result-link');

		qwtLink.setAttribute('class', 'qwt-link');
		qwtLink.setAttribute('data-src', webResults[i]['url_csrf']);
		qwtLink.setAttribute('href', webResults[i].url);
		qwtLink.textContent = webResults[i].title;

		qwtLinkInfo.setAttribute('class', 'qwt-link-info');

		qwtLinkUrl.setAttribute('class', 'qwt-link-url');
		qwtLinkUrl.textContent = urlParser.hostname;

		qwtLinkInfo.appendChild(qwtLinkUrl);
		qwtWebResultLink.appendChild(qwtLink);
		qwtWebResultLink.appendChild(qwtLinkInfo);
		qwtWeb.appendChild(qwtWebResultLink);
	}
	return qwtWeb;
};
/**
 * Create the News results section.
 * @function createNews
 * @param newsResults
 * @returns {HTMLElement}
 */
var createNews = function (newsResults) {
	var qwtNews = document.createElement('div');
	qwtNews.setAttribute('class', 'qwt-news');

	for (var i = 0; i < newsResults.length; ++i) {
		var qwtNewsResultLink = document.createElement('div'),
			qwtLink = document.createElement('a'),
			qwtLinkInfo = document.createElement('div'),
			qwtLinkUrl = document.createElement('span'),
			qwtLinkInfoSeparator = document.createElement('p'),
			qwtLinkDate = document.createElement('span'),
			urlParser = document.createElement('a');

		urlParser.href = newsResults[i].url;

		qwtNewsResultLink.setAttribute('class', 'qwt-news-result-link');

		qwtLink.setAttribute('class', 'qwt-link');
		qwtLink.setAttribute('data-src', newsResults[i]['url_csrf']);
		qwtLink.setAttribute('href', newsResults[i].url);
		qwtLink.textContent = newsResults[i].title;

		qwtLinkInfo.setAttribute('class', 'qwt-link-info');

		qwtLinkUrl.setAttribute('class', 'qwt-link-url');
		qwtLinkUrl.textContent = urlParser.hostname;

		qwtLinkInfoSeparator.textContent = ' - ';

		qwtLinkDate.setAttribute('class', 'qwt-link-date');
		qwtLinkDate.textContent = getTimeAgo(parseInt(newsResults[i].date) * 1000, hostname = url[url.length - 1]);

		qwtLinkInfo.appendChild(qwtLinkUrl);
		qwtLinkInfo.appendChild(qwtLinkInfoSeparator);
		qwtLinkInfo.appendChild(qwtLinkDate);
		qwtNewsResultLink.appendChild(qwtLink);
		qwtNewsResultLink.appendChild(qwtLinkInfo);
		qwtNews.appendChild(qwtNewsResultLink);
	}
	return qwtNews;
};
/**
 * Create the Media section.
 * @function createMedia
 * @param mediaResults
 * @returns {HTMLElement}
 */
var createMedia = function(mediaResults) {
	var qwtMedia = document.createElement('div');
	qwtMedia.setAttribute('class', 'qwt-media');

	for (var i = 0; i < mediaResults.length; ++i) {
		var qwtMediaThumb = document.createElement('div'),
			qwtMediaThumbImg = document.createElement('img'),
			qwtMediaThumbLink = document.createElement('a'),
			qwtMediaThumbLinkImg = document.createElement('img'),
			qwtMediaResultLink = document.createElement('div'),
			qwtLink = document.createElement('a'),
			qwtLinkInfo = document.createElement('div'),
			qwtLinkUrl = document.createElement('span'),
			qwtLinkInfoSeparator = document.createElement('p'),
			qwtLinkDate = document.createElement('span'),
			urlParser = document.createElement('a');

		urlParser.href = mediaResults[i].url;

		qwtMediaThumb.setAttribute('class', 'qwt-media-thumb');

		qwtMediaThumbImg.setAttribute('src', mediaResults[i].img);

		qwtMediaThumbLink.setAttribute('title', mediaResults[i].title);
		qwtMediaThumbLink.setAttribute('href', mediaResults[i].url);

		qwtMediaThumbLinkImg.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD4AAAAuCAYAAABwF6rfAAABfElEQVRoge3XP0tCURyH8afoH0VDwzVaqqHJkBbFhoTmFpfmiEa35vaCRukluDQoQQ1GfzZD30CexQp1CVzktDn8GjSwUmu4euD6+8DZvw93OOeCUkoppZRSSo2hGWANWAYmHW8ZqdVCoXCdz+evgHXGKH6jWq0+i4iUSqV7YBOYcj1qFDZqtVpZOorF4mM0Gt0FZl0PG7Zv4SIi5XL5rRM/7XrcMP0KFxGpVCov8Xh8hwB/+Z7hIiL1ev01EonsAQvAhOuhfusb/hWfTCb3CWD8wHARkUajYVOp1AEw73qsn/4MFxFpNps2nU5vE6B7/l/h1tpWLBa7oP3SC4Q/w621rUQi8QScA0uuB/tlYLgxxobD4QfgDNhyPdZPfcONMdbzvFvgBFhxPdRvPcODHg09wo0xH6FQ6I4AR8OP8Gw2+w7cAMcEOBq6fktzudxX9BGw6HjX0HnGmMtMJvMKZIFDxiAa2i8xDzgFDhiT6G5znaOUUkoppZRSPX0CBNSzvEFuuEAAAAAASUVORK5CYII=');

		qwtMediaResultLink.setAttribute('class', 'qwt-media-result-link');

		qwtLink.setAttribute('class', 'qwt-link');
		qwtLink.setAttribute('data-src', mediaResults[i]['url_csrf']);
		qwtLink.setAttribute('href', mediaResults[i].url);
		qwtLink.textContent = mediaResults[i].title;

		qwtLinkInfo.setAttribute('class', 'qwt-link-info');

		qwtLinkUrl.setAttribute('class', 'qwt-link-url');
		qwtLinkUrl.textContent = urlParser.hostname;

		qwtLinkInfoSeparator.textContent = ' - ';

		qwtLinkDate.setAttribute('class', 'qwt-link-date');
		qwtLinkDate.textContent = getTimeAgo(parseInt(mediaResults[i].date) * 1000, hostname = url[url.length - 1]);

		qwtMediaThumbLink.appendChild(qwtMediaThumbLinkImg);
		qwtMediaThumb.appendChild(qwtMediaThumbImg);
		qwtMediaThumb.appendChild(qwtMediaThumbLink);

		qwtLinkInfo.appendChild(qwtLinkUrl);
		qwtLinkInfo.appendChild(qwtLinkInfoSeparator);
		qwtLinkInfo.appendChild(qwtLinkDate);
		qwtMediaResultLink.appendChild(qwtMediaThumb);
		qwtMediaResultLink.appendChild(qwtLink);
		qwtMediaResultLink.appendChild(qwtLinkInfo);
		qwtMedia.appendChild(qwtMediaResultLink);
	}
	return qwtMedia;
};
/**
 * Create the Social section.
 * @function createSocial
 * @param socialResults
 * @returns {HTMLElement}
 */
var createSocial = function(socialResults) {
	var qwtSocial = document.createElement('div');
	qwtSocial.setAttribute('class', 'qwt-social');

	for (var i = 0; i < socialResults.length; ++i) {
		var qwtSocialAccountLink = document.createElement('a'),
			qwtSocialAccountImg = document.createElement('div'),
			qwtSocialResultLink = document.createElement('div'),
			qwtLink = document.createElement('a'),
			qwtLinkInfo = document.createElement('div'),
			qwtLinkAuthor = document.createElement('span'),
			qwtLinkAuthorSeparator = document.createElement('p'),
			qwtLinkUrl = document.createElement('span'),
			qwtLinkInfoSeparator = document.createElement('p'),
			qwtLinkDate = document.createElement('span'),
			urlParser = document.createElement('a');

		urlParser.href = socialResults[i].url;

		qwtSocialAccountLink.setAttribute('href', socialResults[i].url + '/status/' + socialResults[i].post);
		qwtSocialAccountLink.setAttribute('title', socialResults[i].post);

		qwtSocialAccountImg.setAttribute('class', 'qwt-social-author-thumb');
		qwtSocialAccountImg.setAttribute('style', 'background:url(' + socialResults[i].img + ')');

		qwtSocialResultLink.setAttribute('class', 'qwt-social-result-link');

		qwtLink.setAttribute('class', 'qwt-link');
		qwtLink.setAttribute('data-src', socialResults[i]['url_csrf']);
		qwtLink.setAttribute('href', socialResults[i].url + '/status/' + socialResults[i].post);
		qwtLink.textContent = socialResults[i].desc;

		qwtLinkInfo.setAttribute('class', 'qwt-link-info');

		qwtLinkAuthor.setAttribute('class', 'qwt-author');
		qwtLinkAuthor.textContent = '@' + socialResults[i].url.split('/').pop();

		qwtLinkAuthorSeparator.textContent = ' via ';

		qwtLinkUrl.setAttribute('class', 'qwt-link-url');
		qwtLinkUrl.textContent = urlParser.hostname;

		qwtLinkInfoSeparator.textContent = ' - ';

		qwtLinkDate.setAttribute('class', 'qwt-link-date');
		qwtLinkDate.textContent = getTimeAgo(parseInt(socialResults[i].date) * 1000, hostname = url[url.length - 1]);

		qwtLinkInfo.appendChild(qwtLinkAuthor);
		qwtLinkInfo.appendChild(qwtLinkAuthorSeparator);
		qwtLinkInfo.appendChild(qwtLinkUrl);
		qwtLinkInfo.appendChild(qwtLinkInfoSeparator);
		qwtLinkInfo.appendChild(qwtLinkDate);
		qwtSocialResultLink.appendChild(qwtSocialAccountLink);
		qwtSocialResultLink.appendChild(qwtSocialAccountImg);
		qwtSocialResultLink.appendChild(qwtLink);
		qwtSocialResultLink.appendChild(qwtLinkInfo);
		qwtSocial.appendChild(qwtSocialResultLink);
	}
	return qwtSocial;
};
/**
 * Create the footer section.
 * @function createFooter
 * @returns {HTMLElement}
 */
var createFooter = function(query) {
	var qwtFooter = document.createElement('div'),
		qwtFooterLink = document.createElement('a');

	qwtFooter.setAttribute('class', 'qwt-footer');

	qwtFooterLink.setAttribute('href', 'https://www.qwant.com/?q=' + query);
	qwtFooterLink.textContent = l10n(url[url.length - 1], 'all_results_on_qwant');

	qwtFooter.appendChild(qwtFooterLink);

	return qwtFooter;
};

var input = getInput(hostname),
	timer,
	flag = 0;

if (input !== null && input !== undefined) {
	input.addEventListener('input', function(){
		clearTimeout(timer);
		timer = setTimeout(function(){
			if (flag === 0) {
				safari.self.tab.dispatchMessage('ask_allowed', {hostname:hostname});
				flag = 1;
			}
		}, 700);
	});

	if (input.value.length > 0 && flag === 0) {
		safari.self.tab.dispatchMessage('ask_allowed', {hostname:hostname});
		flag = 1;
	}
}

if (hostname === 'google') {
	window.onhashchange = function() {
		clearTimeout(timer);
		timer = setTimeout(function() {
			safari.self.tab.dispatchMessage('ask_allowed', {hostname:hostname});
		}, 1400);
	}
}

function exchange(e) {
	e = e || window.event;
	var target = e.target || e.srcElement;
	if (target.className.match('qwt-link')) {
		target.setAttribute('href', target.getAttribute('data-src'));
	}
};
/**
 * Returns user locale
 * @param ext
 * @returns {*}
 */
function getLocale(ext) {
	var handledLanguages	= {
		'com': 'en_US',
		'co.uk': 'en_GB',
//		'es': 'es_ES',
//		'it': 'it_IT',
//		'de': 'de_DE',
		'fr': 'fr_FR',
//		'nl': 'nl_NL',
//		'pt': 'pt_PT',
//		'ru': 'ru_RU',
//		'ja': 'ja_JP',
//		'ar': 'ar_XA',
//		'pl': 'pl_PL',
//		'el': 'el_GR',
//		'tr': 'tr_TR',
//		'he': 'he_IL',
//		'fi': 'fi_FI',
//		'zh': 'zh_CN'
	};
	if (!(ext in handledLanguages)){
		if (!(ext in handledLanguages)){
			return 'en_US';
		} else {
			return handledLanguages[ext];
		}
	} else {
		return handledLanguages[ext];
	}
};

function l10n(ext, key) {
	var handledLocales = [
	];
	var localizedStrings = {
		fr_FR: {
			all_results_on_qwant: 'Tous les résultats sur Qwant'
		},
		en_US: {
			all_results_on_qwant: 'All results on Qwant'
		}
	};
	return localizedStrings[getLocale(ext)][key];
}

function getTimeAgo(time, ext) {
	var localizedStrings = {
		fr: {
			timeAgo_just_now: 'à l\'instant',
			timeAgo_few_seconds_ago: 'il y a quelques secondes',
			timeAgo_ago_prefix: 'il y a',
			timeAgo_minutes_ago_suffix: 'minutes',
			timeAgo_one_hour_ago: 'il y a une heure',
			timeAgo_hours_ago_suffix: 'heures',
			timeAgo_yesterday: 'hier',
			timeAgo_days_ago_suffix: 'jours',
			timeAgo_weeks_ago_suffix: 'semaines',
			timeAgo_months_ago_suffix: 'mois',
			timeAgo_years_ago_suffix: 'années'
		},
		en: {
			timeAgo_just_now: 'just now',
			timeAgo_few_seconds_ago: 'few seconds ago',
			timeAgo_ago_prefix: '',
			timeAgo_minutes_ago_suffix: 'minutes ago',
			timeAgo_one_hour_ago: 'an hour ago',
			timeAgo_hours_ago_suffix: 'hours ago',
			timeAgo_yesterday: 'yesterday',
			timeAgo_days_ago_suffix: 'days ago',
			timeAgo_weeks_ago_suffix: 'weeks ago',
			timeAgo_months_ago_suffix: 'months ago',
			timeAgo_years_ago_suffix: 'years ago'
		}
	};

	if (!time || time === null) {
		return '';
	}

	if (!ext || ext === null) {
		return '';
	}

	if(isNaN(time)) {
		var date = new Date(time.replace(/-/g,'/').replace(/[TZ]/g, ' '));
		time = date.getTime();
	}

	if (!(ext in localizedStrings)) {
		ext = 'en';
	}

	var diff = (((new Date()).getTime() - time) / 1000);
	var day_diff = Math.floor(diff / 86400);

	if ( isNaN(day_diff) || day_diff < 0 ) // || day_diff >= 31
		return '';

	return day_diff === 0 && (
		diff < 60 && localizedStrings[ext].timeAgo_just_now ||
		diff < 120 && localizedStrings[ext].timeAgo_few_seconds_ago ||
		diff < 3600 && ((localizedStrings[ext].timeAgo_ago_prefix === '') ? '' : localizedStrings[ext].timeAgo_ago_prefix) + ' ' +
		Math.floor( diff / 60 ) + ' ' +
		localizedStrings[ext].timeAgo_minutes_ago_suffix ||
		diff < 7200 && localizedStrings[ext].timeAgo_one_hour_ago		||
		diff < 86400 && ((localizedStrings[ext].timeAgo_ago_prefix === '') ? '' : localizedStrings[ext].timeAgo_ago_prefix) + ' ' +
		Math.floor( diff / 3600 ) + ' ' +
		localizedStrings[ext].timeAgo_hours_ago_suffix) ||
		day_diff == 1 && localizedStrings[ext].timeAgo_yesterday			||
		day_diff < 7 && ((localizedStrings[ext].timeAgo_ago_prefix === '') ? '' : localizedStrings[ext].timeAgo_ago_prefix) + ' ' +
		day_diff + ' ' +
		localizedStrings[ext].timeAgo_days_ago_suffix ||
		day_diff < 31 && ((localizedStrings[ext].timeAgo_ago_prefix === '') ? '' : localizedStrings[ext].timeAgo_ago_prefix) + ' ' +
		Math.ceil( day_diff / 7 ) + ' ' +
		localizedStrings[ext].timeAgo_weeks_ago_suffix ||
		day_diff < 365 && ((localizedStrings[ext].timeAgo_ago_prefix === '') ? '' : localizedStrings[ext].timeAgo_ago_prefix) + ' ' +
		Math.ceil( day_diff / 30 ) + ' ' +
		localizedStrings[ext].timeAgo_months_ago_suffix ||
		((localizedStrings[ext].timeAgo_ago_prefix === '') ? '' : localizedStrings[ext].timeAgo_ago_prefix) + ' ' +
		Math.ceil( day_diff / 30 ) + ' ' +
		localizedStrings[ext].timeAgo_years_ago_suffix;
};