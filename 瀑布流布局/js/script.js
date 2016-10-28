window.onload=function(){
	waterfall("main","box");
	//模拟后台传给前端渲染的数据
	var dataInt={"data":[{"src":'P_011.jpg'},{"src":'P_011.jpg'},{"src":'P_011.jpg'},{"src":'P_011.jpg'}]};
    window.onscroll=function(){
    	if (checkScrollSlide) {
    		var oParent=document.getElementById('#main');
    		for (var i = 0; i < dataInt.data.length; i++) {
    			var oBox=document.createElement('div');
    			oBox.className='box';
    			oParent.appendChild(oBox);
    			var oPic=document.createElement('div');
    			oBox.className='pic';
    			oBox.appendChild(oPic);
    			var oImg= document.createElement('img');
    			oImg.src="images/"+dataInt.data[i].src;
    			oPic.appendChild(oImg);
    		}
    		waterfall("main","box");
    	}
    }
}
////动态添加瀑布图片的功能函数
function waterfall(parent,box){
	//将box取出来
	var oParent = document.getElementById(parent);
	var oBoxs = oParent.getElementsByClassName('box');
	//计算列数 页面宽除以box的宽度
	//先取得浏览器的可视宽度，然后通过除以每个展示框的宽度来计算出一排可以展示多少个展示框的，然后通过一个数组 hArr来保持每一列的高度，
	var oBoxW=oBoxs[0].offsetWidth;
	var cols = Math.floor(document.documentElement.clientWidth/oBoxW);
	//给最外围的main元素设置宽度和外边距
	oParent.style.cssText = "width:"+oBoxW*cols+'px;margin:0 auto';
	var hArr=[];//存放每一列高度
	//将box依次放入列高最小的位置
	for (var i = 0; i < oBoxs.length; i++) {
		if (i<cols) {
			hArr.push(oBoxs[i].offsetHeight);//第一行
		}else{
			//数组HArr中的最小值minH
			var minH= Math.min.apply(null,hArr);
			var index= getMinhIndex(hArr,minH);
			oBoxs[i].style.position ='absolute';
			oBoxs[i].style.top=minH+'px';
			//oBoxs[i].style.left=oBoxW*index+'px';
			oBoxs[i].style.left=oBoxs[index].offsetLeft+'px';
			//更新添加了图片后的列高
			hArr[index]+=oBoxs[i].offsetHeight;

		}
	}
}



//获取数组中高度最小的索引
function getMinhIndex(arr,val){
	for (var i in arr) {
		if (arr[i]==val) {
			return i;
		}
}
}

//检测是否具有加载数据块的条件
function checkScrollSlide(){
	var oParent=document.getElementById('main');
	var oBoxs = oParent.getElementsByClassName('box');
	var  lastBoxH= oBoxs[oBoxs.length-1].offsetTop+oBoxs[oBoxs.length-1].offsetHeight/2;
	//alert(oBoxs[oBoxs.length-1].offsetHeight);
	//获取滚动条滚动的距离
	var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;
	var height=document.body.clientHeight||document.documentElement.clientHeight;
	return (lastBoxH<scrollTop+height)?true:false;
 
}

