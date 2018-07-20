'use strict';

(function () {
    var library = window.library;
    var selector = library.selector;
    var timerId;
    var elementInputHashTags = document.querySelector(window.library.selector.input.hashTag);
    var elementInputDescription = document.querySelector(window.library.selector.input.description);

    /**
     * @description Обработчик на событие "Закрыть форму" и на событие "Форма отправлена". 
     * Закрывает форму добавления фото.
     * @param {Event} evt
     */
    var onClosed = function (evt) {
        if(!(evt.keyCode === library.keyCode.ESC || evt.keyCode === undefined)) return;
        window.resetPostForm();
        library.removeListenerFrom(selector.formClose, 'click', onClosed);
        library.removeListenerFromDoc('keydown', onClosed);
    };
    /**
     * @description Обработчик на событие "Файл загружен". 
     * Вызывается, когда пользователь загрузил своё фото для публикации.
     */
    var onFileUpload = function () {
        library.removeClassFrom(selector.overlay, 'hidden');
        library.addListenerTo(selector.formClose, 'click', onClosed);
        library.addListenerToDoc('keydown', onClosed);
    };
    /**
     * @description Обработчик на событие "Фокус на поле description".
     */
    var onFocus= function () {
        library.removeListenerFromDoc('keydown', onClosed);
    };
    /**
     * @description Обработчик на событие "Фокус переместился с поля description".
     */
    var onBlur = function () {
        library.addListenerToDoc('keydown', onClosed);
    };
    /**
     * @description Обработчик на событие "Значение в поле ввода формы изменилось".
     * @param {Event} evt
     */
    var onInputValueChanged = function (evt) {
        clearTimeout(timerId);
        setTimeout(function () {
            var notice = window.formValidation.checkElementValidity(evt.target);
            window.formNotice.update(evt.target, notice);
        }, 500);
    };
    /**
     * @description Обработчик на событие "submit".
     * @param {Event} evt
     */
    var onSubmit = function (evt) {
        evt.preventDefault();
        if(window.formValidation.isFormValidity()) {
            prepareFormValue();
            window.backend.sendPicture(window.networkHandler.onImageSend, window.networkHandler.onImageSendError);
        }
    };
    /**
     * @description Подготавливает значения полей ввода для отправки на сервер.
     */
    var prepareFormValue = function () {
        var text = window.library.prepareTextValueForSend(elementInputHashTags.value);
        elementInputHashTags.value = text;
        text = window.library.prepareTextValueForSend(elementInputDescription.value);
        elementInputDescription.value = text;
    };

    window.backend.downloadPictures(window.networkHandler.onImagesDownloaded, window.networkHandler.onImagesDownloadedError);
    library.addListenerToDoc('form send', onClosed);
    library.addListenerTo(selector.fileUpload, 'change', onFileUpload);
    window.library.addListenerTo(window.library.selector.input.description, 'focus', onFocus);
    window.library.addListenerTo(window.library.selector.input.description, 'blur', onBlur);
    window.library.addListenerTo(window.library.selector.input.description, 'input', onInputValueChanged);
    window.library.addListenerTo(window.library.selector.input.hashTag, 'input', onInputValueChanged);
    window.library.addListenerTo(window.library.selector.postForm, 'submit', onSubmit);
})();