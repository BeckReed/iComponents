$(function() {
    var $container = $('#container');
    var $list = $('#list');
    var $buttons = $('#buttons span');
    var $prev = $('#prev');
    var $next = $('#next');
    var index = 1; //小圆点序号
    var len = 5; //图片个数
    var interval = 2000; //自动播放时间间隔
    var timer;

    $next.click(function() {
        if (index == 5) {
            index = 1;
            // $list.css('left', '0px');
            $list.animate({ "left": "0px" }, "normal");
        } else {
            index += 1;
            $list.animate({ "left": "-=600px" }, "normal");
        }
        showButton();

    });
    $prev.click(function() {
        if (index == 1) {
            index = 5;
            // $list.css('left', '-2400px');
            $list.animate({ "left": "-2400px" }, "normal");
        } else {
            index -= 1;
            $list.animate({ "left": "+=600px" }, "normal");
        }
        showButton();
    });

    function showButton() {
        //遍历所有小圆点，置灰已前点亮的小圆点
        //点亮当前小圆点
        $buttons.eq(index - 1).addClass('on').siblings().removeClass('on');
    }
    $buttons.each(function() {
        $(this).click(function() {
            var myIndex = parseInt($(this).attr("index"));
            var offset = -600 * (myIndex - index);
            var oLeft = parseInt($list.css("left")) + offset + "px";
            $list.animate({ "left": oLeft }, "normal");
            index = myIndex;
            showButton();
        });
    });

    function play() {
        timer = setTimeout(function() {
            $next.trigger('click');
            play();
        }, interval);
    }

    function stop() {
        clearTimeout(timer);
    }
    $container.hover(stop, play);

    play();
})
