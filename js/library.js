'use strict';

(function () {
    window.library = {};
    window.library.keyCode = {
        ESC: 27,
        ENTER: 13
    };
    window.library.removeClassName = function (cssSelector, className) {
        var element = document.querySelector(cssSelector);
        element.classList.remove(className);
    };
    window.library.addClassName = function (cssSelector, className) {
        var element = document.querySelector(cssSelector);
        element.classList.add(className);
    };
    window.library.addListenerTo = function (cssSelector, eventName, handlerName) {
        var element = document.querySelector(cssSelector);
        element.addEventListener(eventName, handlerName);
    };
    window.library.removeListenerFrom = function (cssSelector, eventName, handlerName) {
        var element = document.querySelector(cssSelector);
        element.removeEventListener(eventName, handlerName);
    };
    window.library.addListenerToDoc = function (eventName, handlerName) {
        document.addEventListener(eventName, handlerName);
    };
    window.library.removeListenerFromDoc = function (eventName, handlerName) {
        document.removeEventListener(eventName, handlerName);
    };
})();