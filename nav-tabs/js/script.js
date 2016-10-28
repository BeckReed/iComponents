//通过$获取元素
function $(id){
	return typeof id === 'string'?document.getElementById(id):id;
}
window.onload = function(){

	var timer = null;

	//获取鼠标滑过或点击的选项卡和要切换内容的元素
	var tabs =document.getElementsByTagName('li');
	var divs = $('content').getElementsByTagName('div');
	//选项卡的数量必须等于内容盒子的数量
	if (tabs.length!= divs.length)
		return;
	//遍历所有选项卡
	for (var i = 0; i < tabs.length; i++) {
		tabs[i].id =i;
		tabs[i].onmouseover = function(){
			//如果存在准备执行的定时器，清除定时器,只有当前停留时间大于500ms才开始执行
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			//引用当前的选项卡
			var that = this;
			//延迟半秒,定时器是全局对象，this=window
			timer = setTimeout(function(){
				//清除其他
				for (var j = 0; j < tabs.length; j++) {
				tabs[j].className = "";
				divs[j].className = "tab-pane";
			}
			//设置当前为高亮显示
			that.className = "active";
			divs[that.id].className = "active";
			},300);
		}
	}
}
