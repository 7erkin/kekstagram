'use strict';

(function () {
    var library = window.library;
    var selector = library.selector;

    var elementImage = document.querySelector(selector.imagePreview.self);
    var elementScaleValue = document.querySelector(selector.scale.value);
    var elementScaleLevel = document.querySelector(selector.scale.level);
    var elementUploadFile = document.querySelector(selector.fileUpload);
    var elementHashTagInput = document.querySelector(selector.input.hashTag);
    var elementDescriptionInput = document.querySelector(selector.input.description);

    var flushPageInBaseCondition = function () {
        var effectName = elementImage.className.match(/effects__preview--[^ ]+/);
        if(effectName instanceof Array) library.removeClassFrom(selector.imagePreview.self, effectName[0]);
        library.flushStyle(selector.imagePreview.self);
        elementScaleValue.value = '100%';
        elementUploadFile.value = '';
        elementScaleLevel.style.width = '100%';
        elementHashTagInput.value = '';
        elementDescriptionInput.value = '';
        library.addClassTo(selector.slider, 'hidden');
        library.removeClassFrom(selector.imagePreview.self, effectName);
        library.addClassTo(selector.overlay, 'hidden');
    };
    var onClosed = function (evt) {
        if(!(evt.keyCode === library.keyCode.ESC || evt.keyCode === undefined)) return;
        flushPageInBaseCondition();
        library.removeListenerFrom(selector.formClose, 'click', onClosed);
        library.removeListenerFromDoc('keydown', onClosed);
    };
    var onChanged = function () {
        library.removeClassFrom(selector.overlay, 'hidden');
        library.addListenerTo(selector.formClose, 'click', onClosed);
        library.addListenerToDoc('keydown', onClosed);
    };
    var onFocusHappend = function () {
        library.removeListenerFromDoc('keydown', onClosed);
    };
    var onBlurHappend = function () {
        library.addListenerToDoc('keydown', onClosed);
    };

    window.backend.downloadPictures(window.networkHandler.onImagesDownloaded, window.networkHandler.onImagesDownloadedError);
    library.addListenerToDoc('form-send', onClosed);
    library.addListenerTo(selector.fileUpload, 'change', onChanged);
    library.addListenerToDoc('focus happend', onFocusHappend);
    library.addListenerToDoc('blur happend', onBlurHappend);
})();