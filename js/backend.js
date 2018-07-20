'use strict';

(function () {
    var URL_GET = 'https://js.dump.academy/kekstagram/data';
    var URL_POST = 'https://js.dump.academy/kekstagram';
    var elementPostForm = document.querySelector(window.library.selector.postForm);

    window.backend = {};
    /**
    * @description Загружает картинки с сервера
    * @param {Function} onLoad Колбэк на событие загрузки данных
    * @param {Function} onError Колбэк на событие ошибки при загрузке данных
    */
    window.backend.downloadPictures = function (onLoad, onError) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', onLoad);
        xhr.addEventListener('error', onError);
        xhr.responseType = 'json';
        xhr.open('GET', URL_GET, true);
        xhr.send();
    };
    /**
    * @description Отправляет данные с формы на сервер
    * @param {Function} onLoad Колбэк на событие отправки данных
    * @param {Function} onError Колбэк на событие ошибки при отправке данных
    */
    window.backend.sendPicture = function (onLoad, onError) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', onLoad);
        xhr.addEventListener('error', onError);
        var data = new FormData (elementPostForm);
        xhr.open('POST', URL_POST, true);
        xhr.send(data);
    };
})();