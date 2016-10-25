 jQuery(document).ready(function() {
        //监听滚动条事件
        $(window).scroll(function() {
            /* Act on the event */
            //获取滚动条到顶端的距离
            var top = $(document).scrollTop();
            //获取导航
            var menu = $("#menu");
            //jq通过id筛选比通过class筛选效率高很多
            var items = $("#content").find('.item');

            var currentId = "";

            items.each(function(index, el) {
                var m = $(this);
                var itemTop = m.offset().top;
                if (top > itemTop - 200) {
                    currentId = "#" + m.attr('id');
                }
            });
            //设置当前class为current，取消其他楼层


            var currentLink = menu.find(".current")
            if (currentId && currentLink.attr("href") != currentId) {
                currentLink.removeClass('current');
                menu.find("[href=" + currentId + "]").addClass('current');
            }
        });
    });
