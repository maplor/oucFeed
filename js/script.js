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
	// 导航栏点击切换方法
	var nav = $('#nav');
	var collapse = $('#nav-collapse');
	nav.hide(400);
	collapse.addClass('active');
	
	collapse.on('click', function() {
		nav.toggle(300);
		return false;
	})
	
	// 消息列表Ajax
//	$.getJSON('http://oucfeed.duapp.com/list', function(data) {
//		var items = [];
//		$.each(data, function(key, val) {
//			items.push('<li><section class="message-con"><a href="#"><h3>' +
//				val.title + '</h3><p>来源：<span>' +
//				val.category.join("-") + '</span>&nbsp;时间：<time>' +
//				val.datetime + '</time></p><span class="more">详情></span></a></section></li>');
//		});
//		$(items.join("")).appendTo(".message-list");
//	})
})

function ownToStandard (treeId, parentNode, responseData) {
	var dst = [];
	for(key in responseData){
		dst.push({name:key, children:ownToStandard(treeId, parentNode, responseData[key])});
	}
	//console.log(dst);
	return dst;
}
var reAsyncNum = 0;  //记录重复刷新次数
function zTreeOnAsyncError (event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
	reAsyncNum++;
	if(reAsyncNum < 10) {
		var time = setTimeout('zTreeObj = $.fn.zTree.init($("#tree"), zSetting, zNodes)', 500);
	}
}