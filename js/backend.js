'use strict';

(function () {
    var URL_GET = 'https://js.dump.academy/kekstagram/data';
    var URL_POST = 'https://js.dump.academy/kekstagram';
    var elementPostForm = document.querySelector(window.library.selector.postForm);

    window.backend = {};
    window.backend.downloadImages = function (onLoad, onError) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', onLoad);
        xhr.addEventListener('error', onError);
        xhr.responseType = 'json';

        xhr.open('GET', URL_GET, true);

        xhr.send();
    };
    window.backend.sendPhoto = function (onLoad, onError) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', onLoad);
        xhr.addEventListener('error', onError);

        var data = new FormData (elementPostForm);

        xhr.open('POST', URL_POST, true);

        xhr.send(data);
    };
})();