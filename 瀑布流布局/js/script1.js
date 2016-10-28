$(document).ready(function() {
	waterfall();
	var dateInt={"data":[{"src":'P_011.jpg'},{"src":'P_011.jpg'},{"src":'P_011.jpg'},{"src":'P_011.jpg'},{"src":'P_011.jpg'}]};
	$(windows).scroll(function(event) {
		/* Act on the event */
		if (checkScrollSlide) {
			$.each(dataInt.data, function(key, val) {
				 /* iterate through array or object */
				 var oBox=$('<div>').addClass('box').appendTo($('#main'));
				 var oPic=$('<div>').addClass('pic').appendTo($(oBox));
				 $('<img>').attr('src','image/'+$(val).attr('src')).appendTo($(oPic));


			});
				 waterfall();
		}

	});
});

function waterfall(){
	var $boxs=$("#main>div");
	//一个图片框的宽
	var w=$boxs.eq(0).outerWidth();
	//计算列数 页面宽除以box的宽度
	var cols=Math.floor($(window).width()/w);
	//设置main的宽度
	$('#main').width(w*cols).css('margin','0 auto');
	//存放每一列高度的数组
	var hArr=[];
    //将box依次放入列高最小的位置
	$boxs.each(function(index, el) {
		var h=$boxs.eq(index).outerHeight();
		if (index<cols) {
			//第一行
			hArr[index]=h;
		}else{
			//数组HArr中的最小值minH
			var  minH= Math.min.apply(null,hArr);
			//获取数组中高度最小的索引
			var minHIndex=$.inArray(minH, hArr);
			$(el).css({
				'position': 'absolute',
				'top':minH+ 'px',
				'left':minHIndex*w+'px'
			});
			//更新添加了图片后的列高
			hArr[minHIndex]+=$boxs.eq(index).outerHeight();
		}
	});
}
//检测是否具有加载数据块的条件
function checkScrollSlide(){
	var $lastBox=$('#main>div').last();
	 //待加载图片距离父元素的高度
	var lastBoxDis=$lastBox.offset().top+Math.floor($lastBox.outerHeight()/2);
	//获取滚动条滚动的距离
	var scrollTop=$(window).scrollTop();
	//获得窗口的高度
	var  documentH=$(window).height();
	return (lastBoxDis<scrollTop+documentH)?true:false;
}
