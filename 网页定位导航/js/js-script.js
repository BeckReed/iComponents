window.onload = function() {
    window.onscroll = function() {
        var top = document.documentElement.scrollTop || document.body.scrollTop;
        var menus = document.getElementById('menu').getElementsByTagName('a');
        var items = document.getElementById('content').getElementsByClassName('item');
        var currentId = "";
        for (var i = 0; i < items.length; i++) {
            var _item = items[i];
            var _itemTop = _item.offsetTop;
            if (top > _itemTop - 200) {
                currentId = _item.id;
            } else {
                break;
            }
        }
        if (currentId) {
            for (var j = 0; j < menus.length; j++) {
                var _menu = menus[j];
                var _href = _menu.href.split('#');
                if (_href[_href.length - 1] != currentId) {
                    _menu.setAttribute('class','');
                } else {
                    _menu.setAttribute('class','current');
                }
            }
        }

    }
}
