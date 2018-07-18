'use strict';

(function () {
    window.library = {};
    window.library.keyCode = {
        ESC: 27,
        ENTER: 13
    };
    window.library.currentEffectName = '';
    window.library.removeClassFrom = function (cssSelector, className) {
        var element = document.querySelector(cssSelector);
        element.classList.remove(className);
    };
    window.library.addClassTo = function (cssSelector, className) {
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
    window.library.addStyleTo = function (cssSelector, styleName, value) {
        var element = document.querySelector(cssSelector);
        element.style[styleName] = value;
    };
    window.library.removeStyleFrom = function (cssSelector, styleName) {
        var element = document.querySelector(cssSelector);
        element.style[styleName] = '';
    };
    window.library.flushStyle = function (cssSelector) {
        var element = document.querySelector(cssSelector);
        element.setAttribute('style', '');
    };
    window.library.prepareTextValueForSend = function (text) {
        var newText = text.replace(/[ ]+/g, ' ')
                          .replace(/^ /, '')
                          .replace(/ $/,'');
        return newText;
    };

    window.library.SCALE_WIDTH = 453;
    window.library.selector = {
        postForm: '#upload-select-image',
        formClose: '#upload-cancel',
        imagePreview: {
            self: '.img-upload__preview',
            source: '.img-upload__preview > img'
        },
        fileUpload: '#upload-file',
        overlay: '.img-upload__overlay',
        slider: '.img-upload__scale',
        effectsList: '.effects__list',
        filters: '.img-filters',
        input: {
            hashTag: '.text__hashtags',
            description: '.text__description',
            effectLevel: '[name="effect-level"]'
        },
        scale: {
            value: '.resize__control--value',
            valuePlus: '.resize__control--minus',
            valueMinus: '.resize__control--plus',
            line: '.scale__line',
            pin: '.scale__pin',
            level: '.scale__level'
        },
        template: {
            self: '#picture',
            picture: {
                self: '.picture__link',
                statComments: '.picture__stat--comments',
                statLikes: '.picture__stat--likes'
            },
            socialComment: {
                self: '.social__comment',
                avatar: '.social__picture',
                text: '.social__text'
            },
            errorNotice: {
                self: '#notice',
                text: '#notice > p'
            }
        },
        bigPicture: {
            self: '.big-picture.overlay',
            source: '.big-picture__img > img',
            statLikes: '.likes-count',
            statComments: '.comments-count',
            comments: '.social__comments',
            cancel: '#picture-cancel',
            statShownComments: '.current-stat',
            loadMoreComments: '.social__loadmore'
        },
        filter: {
            self: '.img-filters__form',
            popular: '#filter-popular',
            discussed: '#filter-discussed',
            new: '#filter-new',
            activeFilter: '.img-filters__button--active'
        }
    };
})();