//通过$获取元素
function $(id) {
    return typeof id === 'string' ? document.getElementById(id) : id;
}

window.onload = tab;

function tab() {
    //当前选项卡索引,自动切换选项卡从第一个开始
    var index = 0;
    var timer = null;

    //获取鼠标滑过或点击的选项卡和要切换内容的元素
    var tabs = document.getElementsByTagName('li');
    var divs = $('content').getElementsByTagName('div');
    //遍历所有选项卡,添加手动切换
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].id = i;
        tabs[i].onmouseover = function() {
            clearInterval(timer);
            change(this.id);
        }
        tabs[i].onmouseout = function() {
            //添加定时器，改变索引
   			 timer = setInterval(autoPlay, 2000);
        }
    }
    //清除定时器
    if (timer) {
    	clearInterval(timer);
    	timer= null;
    }
    //添加定时器，改变索引
    timer = setInterval(autoPlay, 2000);

 	function autoPlay(){
 		index++;
        if (index >= tabs.length) {
            index = 0;
        }
        change(index);
 	}
    //切换选项卡
    function change(curIndex) {
        //清除其他
        for (var j = 0; j < tabs.length; j++) {
            tabs[j].className = "";
            divs[j].className = "tab-pane";
        }
        //设置当前为高亮显示
        tabs[curIndex].className = "active";
        divs[curIndex].className = "active";
        index = curIndex;
    }
}
