window.onload = function() {
    var getDom = function(id) {
        return document.getElementById(id);
    }

    var addEvent = function(id, event, fn) {
        var el = getDom(id) || document;
        if (el.addEventListener) {
            el.addEventListener(event, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + even.fn);
        }
    }
 //到浏览器窗口左边的距离
    var getElementLeft = function(element){
    	var left = element.offsetLeft;
    	var current = element.offsetParent;

    	while (current != null){
    		left += current.offsetLeft;
    		current = current.offsetParent;
    	}
    	return left;
    }
  //到浏览器窗口顶边的距离
  var getElementTop = function(element){
    	var top = element.offsetTop;
    	var current = element.offsetParent;

    	while (current != null){
    		top += current.offsetTop;
    		current = current.offsetParent;
    	}
    	return top;
    }

    var ajaxGet = function(url,callback){
    	var _xhr = null;
    	if(window.XMLHttpRequest){//非IE
    		_xhr = new window.XMLHttpRequest();
    	} else if (window.ActiveXObject){//IE
    		_xhr = new ActiveXObject("Msxml2.XMLHTTP");
    	}
    	_xhr.onreadystatechange = function(){
    		if (_xhr.readyState == 4 && _xhr.status == 200) {
    			callback(JSON.parse(_xhr.responseText));
    		}
    	}
    	_xhr.open('get',url,false);
    	_xhr.send();
    }
    //	事件代理
    var delegateEvent = function(target,event,fn){
    	addEvent(document, event, function(e){
    		if (e.target.nodeName == target.toUpperCase()) {
    			fn.call(e.target);
    		}
    	});
    }

    var container = getDom('container');
    var mask = getDom('mask');
	var _dom = getDom('suggest');


    addEvent('input', 'click', function() {
    	mask.style.opacity = 0.3;
    	_dom.style.display = 'block';
    	var searchText = getDom('input').value;
    	ajaxGet('http://api.bing.com/qsonhs.aspx?q='+searchText, function(d){
    		var d = d.As.Results[0].Suggests;
    		var html = '';
    		for (var i = 0; i < d.length; i++) {
    		html += '<li>' + d[i].Txt +'</li>';
    		}
    		getDom('result').innerHTML = html;
    		_dom.style.top = getElementTop(getDom('searchform'))+ 45 +'px';
    		_dom.style.left = getElementLeft(getDom('searchform'))+'px';
    		_dom.style.display = 'block';
    	});
    });
    addEvent('submit', 'click', function(){
    	var searchText = getDom('input').value;
    	location.href = 'http://cn.bing.com/search?q='+searchText;
    });
    //给提示列表添加点击事件
delegateEvent('li', 'click', function(){
	var keyword = this.innerHTML;
	location.href = 'http://cn.bing.com/search?q='+keyword;
});

}
