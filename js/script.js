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
	//console.log(textStatus + " & id:" + data.id);
	if (setStorage(data.id)) {
		$("#subscribe").html("订阅成功！");
		$('<p class="jumpnotice">页面没有跳转？点<a href="index.html">这里</a>去查看最新消息。</p>').appendTo("article.main");
		var time = setTimeout('location.href = "index.html"', 2000);
	} else{
		$("#subscribe").html("订阅失败:-(");
	}
}
//本地存储用户id方法
function setStorage (id) {
	if (window.localStorage) {
		var storage = window.localStorage;
		if (!storage.getItem("feedId")) {
			try{
				storage.setItem("feedId", id);
				return true;
			}catch(e){
				//TODO handle the exception 应提示存储失败
				return false;
			}
		} else{
			storage.removeItem("feedId");
			storage.setItem("feedId", id);
			return true;
		}
	} else{
		//TODO 不支持LoaclStorage,使用cookies
	}
}
//获得本地用户id方法
function getStorage () {
	if (window.localStorage) {
		var storage = window.localStorage;
		return storage.getItem("feedId");
	} else{
		//TODO 不支持LoaclStorage,使用cookies
		return false;
	}
}
//初始化消息列表
function initMessageList () {
	var str = '<div class="title"><h2>最新消息</h2><hr /></div><ul class="message-list"></ul><a href="javascript:;" id="loadMore">查看更多</a>';
	$(str).appendTo("article.main");
}
//输出消息列表
function updateMessageList (userFeedId) {
	// 消息列表Ajax
	$.getJSON('http://oucfeed.duapp.com/list/' + userFeedId, function(data) {
		var items = [];
		$.each(data, function(key, val) {
			items.push('<li><section class="message-con"><a href="#"><h3>' +
				val.title + '</h3><p>来源：<span>' +
				val.category.join("-") + '</span>&nbsp;时间：<time>' +
				val.datetime + '</time></p><span class="more">详情></span></a></section></li>');
		});
		$(items.join("")).appendTo(".message-list");
	})
}
//初始化订阅提示及按钮
function initSubscribe () {
	var str = '<div class="title"><h2>订阅消息</h2><hr /></div><p class="subscribe">你还没有订阅任何消息，点击下面按钮开始个性化之旅吧！</p><a href="subscribe.html" id="subscribe">开始订阅</a>';
	$(str).appendTo("article.main");
}