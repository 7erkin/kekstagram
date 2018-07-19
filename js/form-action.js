'use strict';

(function () {
    var library = window.library;
    var selector = library.selector;

    var elementImage = document.querySelector(selector.imagePreview.self);
    /**
     * @description Сбрасывает страничку в начальное состояние. Удаляем все примененные классы и стили, 
     * в процессе редактирования загружаемой картинки.
     */
    var flushPageInBaseCondition = function () {
        var effectName = elementImage.className.match(/effects__preview--[^ ]+/);
        if(effectName instanceof Array) library.removeClassFrom(selector.imagePreview.self, effectName[0]);
        library.flushStyle(selector.imagePreview.self);
        genEventResetForm();
        library.addClassTo(selector.slider, 'hidden');
        library.removeClassFrom(selector.imagePreview.self, effectName);
        library.addClassTo(selector.overlay, 'hidden');
    };
    /**
     * @description Генерирует событие "Сбросить форму". Обработчик события вернёт элементы формы в исходное состояние.
     */
    var genEventResetForm = function () {
        var event = new Event('reset form');
        document.dispatchEvent(event);
    };
    /**
     * @description Обработчик на событие "Закрыть форму" и на событие "Форма отправлена". 
     * Закрывает форму добавления фото.
     * @param {Event} evt
     */
    var onClosed = function (evt) {
        if(!(evt.keyCode === library.keyCode.ESC || evt.keyCode === undefined)) return;
        flushPageInBaseCondition();
        library.removeListenerFrom(selector.formClose, 'click', onClosed);
        library.removeListenerFromDoc('keydown', onClosed);
    };
    /**
     * @description Обработчик на событие "Файл загружен". 
     * Вызывается, когда пользователь загрузил своё фото для публикации.
     */
    var onChanged = function () {
        library.removeClassFrom(selector.overlay, 'hidden');
        library.addListenerTo(selector.formClose, 'click', onClosed);
        library.addListenerToDoc('keydown', onClosed);
    };
    /**
     * @description Обработчик на событие "Фокус на поле description".
     */
    var onFocusHappend = function () {
        library.removeListenerFromDoc('keydown', onClosed);
    };
    /**
     * @description Обработчик на событие "Фокус переместился с поля description".
     */
    var onBlurHappend = function () {
        library.addListenerToDoc('keydown', onClosed);
    };

    window.backend.downloadPictures(window.networkHandler.onImagesDownloaded, window.networkHandler.onImagesDownloadedError);
    library.addListenerToDoc('form send', onClosed);
    library.addListenerTo(selector.fileUpload, 'change', onChanged);
    library.addListenerToDoc('focus happend', onFocusHappend);
    library.addListenerToDoc('blur happend', onBlurHappend);
})();