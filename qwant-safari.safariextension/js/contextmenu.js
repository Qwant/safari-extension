/**
 * Context menu
 * @file contextMenu.js
 * @author Qwant
 */
'use strict';

document.addEventListener("contextmenu", handleContextMenu, false);
/**
 * Handle context menu
 * @function handleContextMenu
 * @param event
 */
function handleContextMenu(event) {
	var sel = window.parent.getSelection().toString();
	sel = sel.replace(/^\s+|\s+$/g, '');
	safari.self.tab.setContextMenuEventUserInfo(event, {type: 'text', data: sel});
}