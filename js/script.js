// JavaScript Document
// IT Studio - Maplor
// 2014-04-24
// v1.0
//var Utils = {
//	classToggle : function(element, tclass) {
//		var classes = element.className,
//			pattern = new RegExp(tclass);
//		var hasClass = pattern.test(classes);
//		// toggle the class
//		classes = hasClass ? classes.replace(pattern, '') :
//			classes + ' ' + tclass;
//		element.className = classes.trim();
//	}
//}
//
//window.onload = function() {
//	var nav = document.getElementById('nav');
//	var collapse = document.getElementById('nav-collapse');
//	
//	Utils.classToggle(nav, 'hide');
//	Utils.classToggle(collapse, 'active');
//	
//	collapse.onclick = function() {
//		Utils.classToggle(nav, 'hide')
//		return false;
//	}
//}
$(document).ready(function() {
	var nav = $('#nav');
	var collapse = $('#nav-collapse');
	nav.hide(400);
	collapse.addClass('active');
	
	collapse.on('click', function() {
		nav.toggle(300);
		return false;
	})
})
