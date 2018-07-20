'use strict';

(function () {
    var cssSelector = '.img-filters--inactive';

    window.networkHandler = {};
    /**
     * @description Обработчик на событие "Изображение отправлено".
     * @param {Event} evt
     */
    window.networkHandler.onImageSend = function (evt) { 
        var xhr = evt.target;
        switch (xhr.status) {
            case 200:
                window.resetPostForm();
                break;
            default:
                break;
        }
    };
    /**
     * @description Обработчик на событие "Ошибка в отправке изображения".
     * @param {Event} evt
     */
    window.networkHandler.onImageSendError = function (evt) {};
    /**
     * @description Обработчик на событие "Изображения загружены".
     * @param {Event} evt
     */
    window.networkHandler.onImagesDownloaded = function (evt) {
        var xhr = evt.target;
        switch (xhr.status) {
            case 200:
                window.dataStorage.originalPictures = xhr.response;
                window.dataStorage.transformPictures = xhr.response;
                window.renderSmallPhotos();
                window.library.removeClassFrom(cssSelector, cssSelector.split('.')[1]);
                break;
            default:
                break;
        }
    };
    /**
     * @description Обработчик на событие "Ошибка при загрузке изображений".
     * @param {Event} evt
     */
    window.networkHandler.onImagesDownloadedError = function (evt) {};
})();