// Модуль сбрасывает все данные, добавленные в форму

'use strict';

(function () {
    var VALUE_MAX = '100%';
    var VALUE_EMPTY = '';

    var library = window.library;
    var selector = library.selector;
    var elementImage = document.querySelector(selector.imagePreview.self);
    var elementScaleValue = document.querySelector(selector.scale.value);
    var elementScaleLevel = document.querySelector(selector.scale.level);
    var elementUploadFile = document.querySelector(selector.fileUpload);
    var elementHashTagInput = document.querySelector(selector.input.hashTag);
    var elementDescriptionInput = document.querySelector(selector.input.description);
    /**
     * @description Сброс значений полей ввода формы.
     */
    var resetInputs = function () {
        elementScaleValue.value = VALUE_MAX;
        elementUploadFile.value = VALUE_EMPTY;
        elementScaleLevel.style.width = VALUE_MAX;
        elementHashTagInput.value = VALUE_EMPTY;
        elementDescriptionInput.value = VALUE_EMPTY;
    };
    /**
     * @description Сбрасывает страничку в начальное состояние. Удаляем все примененные классы и стили, 
     * в процессе редактирования загружаемой картинки.
     */
    var hidePostForm = function () {
        library.addClassTo(selector.slider, 'hidden');
        library.addClassTo(selector.overlay, 'hidden');
    };
    var resetImageEffect = function () {
        var effectName = elementImage.className.match(/effects__preview--[^ ]+/);
        if(effectName instanceof Array) library.removeClassFrom(selector.imagePreview.self, effectName[0]);
        library.removeClassFrom(selector.imagePreview.self, effectName);
        library.removeStylesFrom(selector.imagePreview.self);
    };
    window.resetPostForm = function () {
        window.formNotice.deleteAll();
        resetInputs();
        resetImageEffect();
        hidePostForm();
    };
})();