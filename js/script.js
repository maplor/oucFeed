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
var nav = $('#nav');
var navItem = nav.find("li");
var collapse = $('#nav-collapse');
$(document).ready(function() {
	if (!window.JSON) {
		$('<script type="text/javascript" src="js/json2.min.js" ></script>').appendTo("head");
	}
	if (!window.localStorage) {
		$('<script type="text/javascript" src="js/localstorageshim.min.js" ></script>').appendTo("head");
	}
	if (responsiveNav()) {
		collapse.on('click', function() {
			nav.toggle(300);
			return false;
		});
	}
})
$(window).resize(function() {
	responsiveNav();
})
//响应式导航栏
function responsiveNav () {
	if (navItem.css("float") != "left") {
		nav.hide(400);
		collapse.addClass('active');
	} else{
		nav.show();
		collapse.removeClass('active');
	}
	return true;
}
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
				storage.removeItem("feedId");
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
function getStorage (key) {
	if (window.localStorage) {
		var storage = window.localStorage;
		return storage.getItem(key);
	} else{
		//TODO 不支持LoaclStorage,使用cookies
		return false;
	}
}
//清楚本地存储消息
function clearStorgae (key) {
	if (window.localStorage) {
		window.localStorage.removeItem(key);
		return true;
	} else{
		//TODO 不支持LoaclStorage,使用cookies
		return false;
	}
}
//初始化消息列表
function initMessageList () {
	var str = '<div class="title"><h2>最新消息</h2><hr /></div><ul class="message-list"></ul>';
	$(str).appendTo("article.main");
}
//输出消息列表
function updateMessageList (userFeedId) {
	// 消息列表Ajax
	$.getJSON('http://oucfeed.duapp.com/list/' + userFeedId, function(data) {
		var items = [];
		$.each(data, function(key, val) {
			items.push('<li><section class="message-con"><a class="abstract" href="' +
				val.link + '" data-id="' +
				val.id + '"><h3>' +
				val.title + '</h3><p>来源：<span>' +
				val.category.join("-") + '</span>&nbsp;时间：<time>' +
				val.datetime + '</time></p><span class="more">详情&gt;</span></a></section></li>');
		});
		$(items.join("")).appendTo(".message-list");
		$(".message-con a.abstract").on('click', function() {
			if ($(this).next().html() == null) {
				addContentById(this);
			} else{
				$(this).next().toggle(500);
			}
			var toggleNotice = $(this).children(".more");
			toggleNotice.html() == '详情&gt;' ? toggleNotice.html('收起^') : toggleNotice.html('详情&gt;')
			return false;
		})
	})
}
//通过消息的id获得消息内容
function addContentById (elem) {
	var from = $(elem).attr("href");
	var messageId = $(elem).attr("data-id");
	$.getJSON('http://oucfeed.duapp.com/item/' + messageId, function(data) {
		$(elem).after('<div class="message-con"><h4 class="con-title">消息内容</h4>' + data.content + '</div>').next().show(500);
	})
}
//初始化订阅提示及按钮
function initSubscribe () {
	var str = '<div class="title"><h2>订阅消息</h2><hr /></div><p class="subscribe">你还没有订阅任何消息，点击下面按钮开始个性化之旅吧！</p><a href="subscribe.html" id="subscribe">开始订阅</a>';
	$(str).appendTo("article.main");
}
//初始化取消订阅按钮
function initUnsubscribe () {
	var str = '<div class="title"><h2>取消订阅</h2><hr /></div><p class="subscribe">取消订阅后将会丢失自定义的订阅分类，真的要取消？</p><a href="index.html" id="un-subscribe">取消订阅</a>';
	$(str).appendTo("article.main");
	$("#un-subscribe").on('click', function() {
		if (clearStorgae("feedId")) {
			return true;
		} else{
			return false;
		}
	})
	
}