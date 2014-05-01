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
//将服务器JSON转为zTree所需JSON
function ownToStandard (treeId, parentNode, responseData) {
	var dst = [];
	$.each(responseData, function (key, value) {
		dst.push({name: key, children: ownToStandard(treeId, parentNode, value)});
	});
	//console.log(dst);
	return dst;
}
//zTree异步加载所需函数
var reAsyncGetNum = 0;  //记录重复GET刷新次数
//加载失败时执行函数
function zTreeOnAsyncError (event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
	reAsyncGetNum++;
	if(reAsyncGetNum < 10) {
		var time = setTimeout('zTreeObj = $.fn.zTree.init($("#tree"), zSetting, zNodes)', 300);
	}
}
//将用户选择内容转为服务器所需JSON
function getCheckedFromNodes (nodes) {
	var dst = {};
	$.each(nodes, function(index, node) {
		if (node.checked) {
			dst[node.name] = getCheckedFromNodes(node.children);
		}
	});
	return dst;
}
function postCheckedData (data) {
	$.ajax({
		type:"post",
		url:"http://oucfeed.duapp.com/profile",
		async:true,
		contentType:"application/json",
		data:JSON.stringify(data),
		dataType:"json",
		error:postCheckedDataError,
		success:postCheckedDataSuccess
	});
}
var reAsyncPostNum = 0;  //记录重复POST刷新次数
function postCheckedDataError (XMLHttpRequest, textStatus, errorThrown) {
	reAsyncPostNum++;
	if(reAsyncPostNum < 10) {
		var time = setTimeout('postCheckedData(getCheckedFromNodes(zTreeObj.getNodes()))', 300);
	}
}
function postCheckedDataSuccess (data, textStatus, XMLHttpRequest) {
	console.log(textStatus + " & id:" + data.id);
}