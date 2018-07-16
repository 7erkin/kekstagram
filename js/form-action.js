'use strict';

(function () {
    var elementImage = document.querySelector(window.library.selector.imagePreview.self);
    var elementScaleValue = document.querySelector(window.library.selector.scale.value);
    var elementScaleLevel = document.querySelector(window.library.selector.scale.level);
    var elementUploadFile = document.querySelector(window.library.selector.fileUpload);
    var elementHashTagInput = document.querySelector(window.library.selector.input.hashTag);
    var elementDescriptionInput = document.querySelector(window.library.selector.input.description);

    var flushInBaseCondition = function () {
        var effectName = elementImage.className.match(/effects__preview--[^ ]+/);
        if(effectName instanceof Array) window.library.removeClassName(window.library.selector.imagePreview.self, effectName[0]);
        window.library.flushStyle(window.library.selector.imagePreview.self);
        elementScaleValue.value = '100%';
        elementUploadFile.value = '';
        elementScaleLevel.style.width = '100%';
        window.library.addClassName(window.library.selector.slider, 'hidden');
        window.library.removeClassName(window.library.selector.imagePreview.self, effectName);
        window.library.addClassName(window.library.selector.overlay, 'hidden');
    };
    var onClosed = function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if(!(evt.keyCode === window.library.keyCode.ESC || evt.keyCode === undefined)) return;
        flushInBaseCondition();
        window.library.removeListenerFrom(window.library.selector.formClose, 'click', onClosed);
        window.library.removeListenerFromDoc('keydown', onClosed);
    };
    var onChanged = function () {
        window.library.removeClassName(window.library.selector.overlay, 'hidden');
        window.library.addListenerTo(window.library.selector.formClose, 'click', onClosed);
        window.library.addListenerToDoc('keydown', onClosed);
    };
    var onFocusHappend = function () {
        window.library.removeListenerFromDoc('keydown', onClosed);
    };
    var onBlurHappend = function () {
        window.library.addListenerToDoc('keydown', onClosed);
    };
    var downloadImages = function () {
        window.backend.downloadImages(window.networkHandler.onImagesDownloaded, window.networkHandler.onImagesDownloadedError);
    };

    downloadImages();
    window.library.addListenerToDoc('form-send', onClosed);
    window.library.addListenerTo(window.library.selector.fileUpload, 'change', onChanged);
    window.library.addListenerToDoc('focus happend', onFocusHappend);
    window.library.addListenerToDoc('blur happend', onBlurHappend);
})();