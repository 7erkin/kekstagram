'use strict';

(function () {
    var cssSelector = '.img-filters--inactive';

    window.networkHandler = {};
    window.networkHandler.onImageSend = function (evt) {
        var event = new Event('form-send');
        document.dispatchEvent(event);
    };
    window.networkHandler.onImageSendError = function (evt) {};
    window.networkHandler.onImagesDownloaded = function (evt) {
        var xhr = evt.target;
        switch (xhr.status) {
            case 200:
                window.dataStorage.originalPictures = xhr.response;
                window.dataStorage.transformPictures = xhr.response;
                window.photoRenderer.render();
                window.library.removeClassFrom(cssSelector, cssSelector.split('.')[1]);
                break;
            default:
                break;
        }
    };
    window.networkHandler.onImagesDownloadedError = function (evt) {};
})();