(function(window, document) {
    function Calendar(options) {

        this.id = options.id; // 整个容器的id
        this.inputId = options.inputId; //获取时间的文本框的id
        this.tbodyId = options.tbodyId; //日历的表格的id
        this.tableClassName = options.tableClassName; //日历表格的类名
        //设定选择时间范围时的跨度
        this.minRangeLen = options.minRangeLen;
        this.maxRangeLen = options.maxRangeLen;

        this.hasChoosed = false; //选择某一天时，是否已经选择过了日期
        clickCount = 0; // 点击次数
        this.defaultDate = new Date(); //默认选中的日期，若为空，则显示当日的日期
        this.chooseDate = [0, 0, 0]; //选择某一天时，选中的日期，初始为空
        this.firstDate = [0, 0, 0]; //选择时间范围时，选中的开始时间
        this.secondDate = [0, 0, 0]; //选择时间范围时，选中的结尾时间
        this.init();
    }
    Calendar.prototype = {
            init: function() {
                this.cacheDom(); // 存储dom 对象
                this.loadCss(); //动态加载样式文件
                this.bindEvents(); //事件绑定
                this.setDefaultTime(); //获取默认时间
                this.render(); //渲染
            },
            // 创建日历tbody的DOM结构
            createTableDom: function() {

                var tbodyHtml = "";
                for (var i = 0; i < 6; i++) {
                    tbodyHtml += '<tr>';
                    for (var j = 0; j < 7; j++) {
                        tbodyHtml += '<td></td>';
                    }
                    tbodyHtml += '</tr>';
                }
                return tbodyHtml;
            },
            // 存储dom 对象
            cacheDom: function() {
                this.container = document.getElementById(this.id);
                this.input = document.getElementById(this.inputId);
                this.myTable = document.getElementById(this.tbodyId);

                this.myTable.className = this.tableClassName;
                this.myTable.innerHTML = this.createTableDom();

                this.singleDay = document.getElementById('single');
                this.dateRange = document.getElementById('multi');


                this.day = this.container.querySelector('.day');
                this.month = this.container.querySelector('.month');
                this.year = this.container.querySelector('.year');

                this.dayContainer = this.container.querySelector('.cal-table');
                this.dayLists = this.dayContainer.getElementsByTagName('td');

                this.nextMonth = this.container.querySelector('.arrow-r');
                this.prevMonth = this.container.querySelector('.arrow-l');
            },
            /*  动态引入日历的样式文件
             */
            loadCss: function() {
                var link = document.createElement('link');
                link.type = 'text/css';
                link.rel = 'stylesheet';
                link.href = 'css/mycalendar.css';
                document.head.appendChild(link);
            },
            //事件绑定
            bindEvents: function() {
                var self = this;
                // 对月份的增减的事件监听
                this.prevMonth.addEventListener('click', function(e) {
                    (self.month.innerHTML == '1') ? ((self.year.innerHTML--) && (self.month.innerHTML = '12')) : (self.month.innerHTML--);
                    self.render();

                }, false);
                this.nextMonth.addEventListener('click', function(e) {
                    (self.month.innerHTML == '12') ? ((self.year.innerHTML++) && (self.month.innerHTML = '1')) : (self.month.innerHTML++);
                    self.render();
                }, false);

                //事件代理，监听到单个日期上的点击事件
                this.dayContainer.addEventListener('click', function(event) {
                    // var e = event || window.event;
                    var target = event.target || event.srcElement;
                    if (target.tagName.toLowerCase() == 'td' && target.innerHTML) {
                        //当前面板已经选择过了日期
                        self.hasChoosed = true;
                        doAction(self, target);
                    }
                }, false);
                // 文本框焦点切换对应日历的显示和隐藏
                this.input.addEventListener('focus', function() {
                    if (self.isShow(self.container)) {
                        self.hide(self.container);
                    } else {
                        self.show(self.container);
                    }
                }, false);
            },

            /**
             * @param  {object}  ele dom对象
             * @return {Boolean}    判断dom对象是否隐藏
             */
            isShow: function(ele) {
                if (ele.style.display == 'block') {
                    return true;
                }
                return false;
            },
            /**
             * 清空掉选择的日期的样式
             */
            clearChoosedStyle: function() {
                var allHasChoosedEle = document.querySelectorAll('.choosed');
                for (var i = 0, len = allHasChoosedEle.length; i < len; i++) {
                    allHasChoosedEle[i].classList.remove('choosed');
                }
            },
            /**
             * @param  {string} year  年份
             * @param  {string} month 月份
             * @param  {string} day   号
             * @return {object}  message
             * message{
             * year   年份
             * month  月份
             * monthLen  那个月的天数
             * whichDay  1号是周几
             * day       号
             * }
             */
            calculate: function(year, month, day) {
                var date = year + '/' + month + '/' + '1';
                var whichDay = new Date(date).getDay();
                var message = {
                    year: year,
                    month: month,
                    monthLen: new Date(year, month, 0).getDate(),
                    whichDay: whichDay,
                    day: day
                        //date: date
                };
                return message;
            },
            hide: function(ele) {
                ele.style.display = 'none';
            },
            show: function(ele) {
                ele.style.display = 'block';
            },
            /**
             * 清理掉所有单元格的内容和背景色
             */
            clearBackGround: function() {
                for (var i = 0, len = this.dayLists.length; i < len; i++) {
                    this.dayLists[i].innerHTML = "";
                    this.dayLists[i].style.backgroundColor = "";
                }
                var defaultDateEle = document.querySelector('.choosed');
                if (defaultDateEle && defaultDateEle.classList
                    .contains('choosed')) {
                    defaultDateEle.classList.remove('choosed');
                }
            },
            /**
             * 开始时间与结束时间之间的单元格的背景色
             */
            clearDayInRangeStyle: function() {
                var dayInRangeEles = document.querySelectorAll('.day-in-range');
                for (var i = 0, len = dayInRangeEles.length; i < len; i++) {
                    dayInRangeEles[i].classList.remove('day-in-range');
                }
            },
            /**
             * 设置显示默认的时间
             */
            setDefaultTime: function() {

                this.day.innerHTML = this.defaultDate.getDate();
                this.month.innerHTML = this.defaultDate.getMonth() + 1;
                this.year.innerHTML = this.defaultDate.getFullYear();
            },
            //渲染函数
            render: function() {
                this.clearBackGround();
                this.clearChoosedStyle();
                this.clearDayInRangeStyle();

                //当前显示的日期的面板就是今天日期的面板
                var tempFlag1 = (parseInt(this.year.innerHTML) == parseInt(this.defaultDate.getFullYear())) && (parseInt(this.month.innerHTML) == parseInt(this.defaultDate.getMonth() + 1));
                //当前显示日期的面板就是选择的日期的面板
                var tempFlag2 = (parseInt(this.year.innerHTML) == parseInt(this.chooseDate[0])) && (parseInt(this.month.innerHTML) == parseInt(this.chooseDate[1]));
                //当前显示日期的面板就是开始日期的面板
                var tempFlag3 = (parseInt(this.year.innerHTML) == parseInt(this.firstDate[0])) && (parseInt(this.month.innerHTML) == parseInt(this.firstDate[1]));
                //当前显示的面板就是结束日期的面板
                var tempFlag4 = (parseInt(this.year.innerHTML) == parseInt(this.secondDate[0])) && (parseInt(this.month.innerHTML) == parseInt(this.secondDate[1]));

                if (!this.hasChoosed && tempFlag1) { //如果当前显示的日期面板为今天日期的面板而且没有选中

                    var datey = this.defaultDate.getFullYear();
                    var datem = this.defaultDate.getMonth() + 1;
                    var dated = this.defaultDate.getDate();

                    var message = this.calculate.call("", datey, datem, dated);
                    //console.log(message.date);
                    this.dayLists[message.whichDay + parseInt(message.day) - 1].classList.add('choosed');

                } else {
                    var message = this.calculate(this.year.innerHTML, this.month.innerHTML, this.day.innerHTML);

                }

                if (this.singleDay.checked && tempFlag2) { //选择的日期在目前显示的面板
                    message = this.calculate.apply("", this.chooseDate);
                    //console.log(this.chooseDate);
                    this.dayLists[message.whichDay + parseInt(message.day) - 1].classList.add('choosed');

                    var datey = this.defaultDate.getFullYear();
                    var datem = this.defaultDate.getMonth() + 1;
                    var dated = this.defaultDate.getDate();

                    var _message = this.calculate.call("", datey, datem, dated);
                    if (message.day != _message.day) {
                        //给没有选中的今天添加样式
                        this.dayLists[_message.whichDay + parseInt(_message.day) - 1].classList.add('unchoosed');
                    } else {
                        //再次选中今天去掉unchoosed
                        this.dayLists[_message.whichDay + parseInt(_message.day) - 1].classList.remove('unchoosed');
                    }
                }
                if (this.dateRange.checked) { //时间段
                    if (tempFlag3) { //开始的日期
                        message = this.calculate.apply("", this.firstDate);
                        this.dayLists[message.whichDay + parseInt(message.day) - 1].classList.add('choosed');
                    }
                    if (tempFlag4) { //结束的日期
                        message = this.calculate.apply("", this.secondDate);
                        this.dayLists[message.whichDay + parseInt(message.day) - 1].classList.add('choosed');
                    }
                }
                // 选择日期范围，给处于开始和结束时间之内的日期添加样式
                var unSlectedDate;
                if (this.firstDate[0] !== 0 && this.secondDate[0] !== 0) {
                    var tempFlag = true;
                } else {
                    var tempFlag = false;
                }
                for (var i = 1, len = message.monthLen; i < len + 1; i++) {
                    //这一个月每天都在正确的位置
                    this.dayLists[i + message.whichDay - 1].innerHTML = i;
                    unSlectedDate = this.year.innerHTML + '-' + this.month.innerHTML + '-' + i;
                    //console.log(unSlectedDate);
                    if (tempFlag && compareDate(unSlectedDate, this.firstDate.join('-')) && compareDate(this.secondDate.join('-'), unSlectedDate)) {
                        this.dayLists[i + message.whichDay - 1].classList.add('day-in-range');
                    }
                }
            },
            /**
             * 设置选择时间段时，开始时间与结束时间的差是否在设置的跨度中
             * 是的话，返回true，否则返回false
             */
            chargeDiffDayinRange: function() {
                var diffDays = getDiffsDays(this.secondDate, this.firstDate);
                if (!(this.minRangeLen <= diffDays && this.maxRangeLen >= diffDays)) {
                    return false;
                }
                return true;
            },
            //返回选择的某一天日期
            getDayDate: function() {
                return this.chooseDate;
            },
            //返回选择的日期范围
            getRangeDate: function() {
                return this.firstDate + '到' + this.secondDate;
            }
        }
        //判断奇偶
    function isOdd(n) {
        if (n % 2 !== 0) {
            return true;
        } else {
            return false;
        }
    }

    function isEven(n) {
        return !isOdd(n);
    }
    /**
     * 比较date1和date2哪个日期大
     * @param  {string} date1 [description]
     * @param  {string} date2 [description]
     * @return {Boolean}    date1>date2,返回true，否则返回false
     */
    function compareDate(date1, date2) {
        if (date1 === null || date2 === null) {
            return ture;
        }
        //date1为字符串转换成，分隔的字符串
        var t1 = Date.parse(date1);
        var t2 = Date.parse(date2);
        return (t1 > t2) ? true : false;
    }
    /**
     * 找出两个日期之间中差了多少天
     * @param  {string} date1  日期
     * @param  {string} date2  日期
     * @return {number}     相差的天数
     */
    function getDiffsDays(date1, date2) {
        var d1 = new Date(date1);
        var d2 = new Date(date2);
        var timeDiff = Math.abs(d1.getTime() - d2.getTime());
        return (Math.ceil(timeDiff / (1000 * 3600 * 24)));
    }
    /**
     * [doAction description]
     * @param  {[type]} self [description]
     * @param  {[type]} ele  [description]
     * @return {[type]}      [description]
     */
    function doAction(self, ele) {
        //被选中的dom对象，写成tbodyId+类名是为了防止页面中有多个对象时会冲突
        var selector = '#' + self.tbodyId + ' ' + '.choosed';
        var allHasChoosedEle = document.querySelectorAll(selector);
        var len = allHasChoosedEle.length;

        if (self.dateRange.checked) { //设置了日期范围
            //更新点击次数
            clickCount++;
            //清除上次选择范围的样式
            self.clearDayInRangeStyle();
            if (clickCount !== 0) {
                if (isOdd(clickCount)) {
                    self.firstDate = [parseInt(self.year.innerHTML), parseInt(self.month.innerHTML), parseInt(ele.innerHTML)];
                } else if (isEven(clickCount)) {
                    self.secondDate = [parseInt(self.year.innerHTML), parseInt(self.month.innerHTML), parseInt(ele.innerHTML)];
                }
            }
            if (self.secondDate[0] === 0) { //规定选择时间段的时候，只选择了一个日期
                var datey = self.defaultDate.getFullYear();
                var datem = self.defaultDate.getMonth() + 1;
                var dated = self.defaultDate.getDate();
                self.secondDate = [datey, datem, dated];
            }
            if (self.chargeDiffDayinRange()) { //开始结束时间的范围在设定的跨度中

                if (compareDate(self.firstDate.join('-'), self.secondDate.join('-'))) { //如果第一个选择的日期大于第二次选择的日期，进行交换
                    self.firstDate = [self.secondDate, self.secondDate = self.firstDate][0];
                    alert(self.firstDate + '到' + self.secondDate);
                    self.input.value = self.firstDate + '到' + self.secondDate;

                } else {

                    alert(self.firstDate + '到' + self.secondDate);
                    self.input.value = self.firstDate + '到' + self.secondDate;

                }
                self.render();
            }
        }

        if (self.singleDay.checked) { //设置单日
            self.day.innerHTML = ele.innerHTML;
            self.input.value = self.year.innerHTML + '/' + self.month.innerHTML + '/' + self.day.innerHTML;
            self.chooseDate = [self.year.innerHTML, self.month.innerHTML, self.day.innerHTML];
            self.render();
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    allHasChoosedEle[i].classList.remove('choosed');
                }
            }
            ele.classList.add('choosed');
        }
    }
    window.Calendar = Calendar;
})(window, document);
