'use strict';

(function () {
    var cssSelector = '.img-filters--inactive';

    window.networkHandler = {};
    window.networkHandler.onImageSend = function (evt) {};
    window.networkHandler.onImageSendError = function (evt) {};
    window.networkHandler.onImagesDownloaded = function (evt) {
        var xhr = evt.target;
        switch (xhr.status) {
            case 200:
                window.dataStorage.original.downloadedPictures = xhr.response;
                window.dataStorage.transform.downloadedPictures = xhr.response;
                window.photoRenderer.render();
                window.library.removeClassName(cssSelector, cssSelector.split('.')[1]);
                break;
            default:
                break;
        }
    };
    window.networkHandler.onImagesDownloadedError = function (evt) {};
})();