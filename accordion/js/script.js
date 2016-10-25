window.onload = function() {
    var outer = document.getElementById('subject');
    var list = outer.getElementsByTagName('li');

    function addEvent(element, event, callbackFunction) {
        if (element.addEventListener) {
            element.addEventListener(event, callbackFunction, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + event, callbackFunction);
        }
    }

    for (var i = 0; i < list.length; i++) {
        addEvent(list[i], "mouseover", function(e) {

            var target = e.target || e.srcElement;
            for (var j = 0; j < list.length; j++) {
                list[j].className = "";
            }
            while (target.tagName != 'LI' && target.tagName != 'BODY') {
                target = target.parentNode;
            }
            target.className = "big";
        });
    }
}
