(function(){
	var Menubar = function(){
		this.el = document.querySelector('#sidebar ul');
		this.state = 'allClosed';//hasOpened
		//阻止事件冒泡，这样点击菜单项，只响应菜单项事件，不干扰sidebar
		this.el.addEventListener('click',function(e){
			//关闭传播
			e.stopPropagation();
		});
		var self = this;
		//声明当前打开的菜单项的内容
		this.currentOpenedMenuContent = null;

		//给每一个菜单项添加click事件
		this.menuList = document.querySelectorAll('#sidebar ul > li');
		for (var i = 0; i < this.menuList.length; i++) {
			this.menuList[i].addEventListener('click',function(e){
				//获取当前菜单项对应的内容项
				var menuContentEl = document.getElementById(e.currentTarget.id + '-content');
				if (self.state === 'allClosed') {
					console.log('打开'+ menuContentEl.id);
					menuContentEl.style.left ='-85px';
					menuContentEl.style.className = "nav-content";
					menuContentEl.classList.add('menuContent-move-right');
					self.state = "hasOpened";
					//保存当前打开的内容项
					self.currentOpenedMenuContent = menuContentEl;
				} else {
					//console.log('关闭'+self.currentOpenedMenuContent.id);
					self.currentOpenedMenuContent.className ="nav-content";
					self.currentOpenedMenuContent.style.left ="35px";
					self.currentOpenedMenuContent.classList.add('menuContent-move-left');
					//console.log('打开'+menuContentEl.id);
					menuContentEl.className = 'nav-content';
					menuContentEl.style.top ='250px';
					menuContentEl.style.left ='35px';
					menuContentEl.classList.add('menuContent-move-up');
					self.state = "hasOpened";
					self.currentOpenedMenuContent = menuContentEl;

				}
			});
		}
		//给内容项关闭按钮添加click事件
		this.menuContentList =  document.querySelectorAll('.nav-content > div.nav-con-close');
		for (var i = 0; i < this.menuContentList.length; i++) {
			this.menuContentList[i].addEventListener('click',function(e){
				var menuContent = e.currentTarget.parentNode;
				menuContent.className ="nav-content";
				menuContent.style.left ="35px";
				menuContent.classList.add('menuContent-move-left');
				self.state = "allClosed";
			})
		}
	}
	//构造函数
	var Sidebar = function(eId,closeBarId){
		//定义状态，初始化
		this.state = 'opened';
		this.el = document.getElementById(eId||'sidebar');
		this.closeBarEl = document.getElementById(closeBarId||'closeBar');
		var self = this;
		this.menubar = new Menubar();
		this.el.addEventListener('click',function(event){
			//如果点击的不是sidebar自身，那就是closebar或者i
			if (event.target !== self.el) {

				self.triggerSwitch();
			}
		});
	};
	//对象的行为放在原型链中
	Sidebar.prototype.close =function(){
		this.el.style.left = '0';
		this.el.className = 'sidebar-move-left';
		this.closeBarEl.style.left = '0';
		this.closeBarEl.className = 'closeBar-move-right';
		//更改状态
		this.state = "closed";

	};
	Sidebar.prototype.open =function(){
		//transition并不真正移动坐标，此时sidebarleft值仍为0，所以初始化left值为我们上次向左移动的值
		this.el.style.left = "-120px";
		this.el.className = 'sidebar-move-right';
		//初始化closeBar的left值为上次他transition的开始位置
		this.closeBarEl.style.left = "160px";

		this.closeBarEl.className = 'closeBar-move-left';
		this.state = "opened";
	};
	//根据状态选择是调用打开还是关闭函数
	Sidebar.prototype.triggerSwitch =function(){
		if (this.state === 'opened') {
			this.close();
		} else {
			this.open();
		}
	};
	var  sidebar = new Sidebar();

})();
