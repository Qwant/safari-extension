/**
 * @file qwant.js
 * @author Qwant
 */
'use strict';

var url = window.location.hostname.split('.'),
	hostname = url[url.length - 2];

if (hostname === 'qwant') {
	var qwtExt = document.createElement('meta');
	qwtExt.setAttribute('property', 'qwantExtension');
	qwtExt.setAttribute('content', 'true');
	document.head.appendChild(qwtExt);
}

