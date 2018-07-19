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
    var INVALID_INPUT_CLASSNAME = 'invalid-input';
    var QUANTITY_HASHTAG = 5;
    var MAX_HASHTAG_LENGTH = 20;
    var LIMIT_CHARACTERS_IN_DESCRIPTION = 140;
    var NOTICE_FOR_DESCRIPTION = 'количество символов не может быть больше ' + LIMIT_CHARACTERS_IN_DESCRIPTION;
    var template = document.querySelector(window.library.selector.template.self);
    var templateNotice = template.content.querySelector(window.library.selector.template.errorNotice.self);
    var inputHashTagValidity = true;
    var inputDescriptionValidity = true;
    var timerId;
    var validityErrorNameToInputHashTagCheckInstrument = {
        NOT_SHARP_BEGIN: {
            notice: 'хештег должен начинаться с символа #',
            checkFunction: function (hashtags) {
                return hashtags.some(function (hashtag) {
                    return hashtag[0] !== '#';
                });
            }
        },
        ONLY_ONE_SHARP_USED: {
            notice: 'хештег не может состоять только из символа #',
            checkFunction: function (hashtags) {
                return hashtags.some(function (hashtag) {
                    return hashtag.length == 1;
                });
            }
        },
        NO_SPACE_USED: {
            notice: 'хештеги должны разделяться пробелом',
            checkFunction: function (hashtags) {
                return hashtags.some(function (hashtag) {
                    return hashtag.split('#').length > 2;
                });
            }
        },
        HASHTAG_REPEATED: {
            notice: 'хештеги не должны повторяться',
            checkFunction : function (hashtags) {
                return hashtags.some(function (hashtag){
                    var tempArray = hashtags.filter(function (element) {
                        return element === hashtag;
                    });
                    return tempArray.length > 1;
                });
            }
        },
        HASHTAG_LIMIT_INCREASED: {
            notice: 'количество хештегов не должно быть больше ' + QUANTITY_HASHTAG,
            checkFunction: function (hashtags) {
                return hashtags.length > QUANTITY_HASHTAG;
            }
        },
        HASHTAG_LENGTH_INCREASED: {
            notice: 'длина хештега не должна превышать ' + MAX_HASHTAG_LENGTH + ' символов',
            checkFunction: function (hashtags) {
                return hashtags.some(function (hashtag) {
                    return hashtag.length > 20;
                });
            }
        }
    };

    var elementInputHashTags = document.querySelector(window.library.selector.input.hashTag);
    var elementInputDescription = document.querySelector(window.library.selector.input.description);
    /**
     * @description Удаляет все узлы "ошибки валидации", которые были добавлены ранее.
     */
    var flushAllNotices = function () {
        var elementsNotices = document.querySelectorAll(window.library.selector.template.errorNotice.self);
        Array.prototype.forEach.call(elementsNotices, function (elementNotice) {
            elementNotice.remove();
        });
        elementInputDescription.classList.remove(INVALID_INPUT_CLASSNAME);
        elementInputHashTags.classList.remove(INVALID_INPUT_CLASSNAME);
    };
    /**
     * @description Встаривает узел ошибки валидации в дерево.
     * @param {HTMLElement} elementInput Элемент формы, которое было заполнено невалидно
     * @param {HTMLDivElement} noticeNode Узел, который добавляется в дерево
     */
    var embedNotice = function (elementInput, noticeNode) {
        if(elementInput.classList[0] === 'text__hashtags') {
            var element = document.querySelector('.text__description');
            elementInput.parentElement.insertBefore(noticeNode, element);
        }
        if(elementInput.classList[0] === 'text__description') {
            elementInput.parentElement.appendChild(noticeNode);
        }
    };
    /**
     * @description Показывает сообщение пользователю, если он неверно заполнил поле ввода.
     * @param {HTMLElement} elementInput Невалидно заполненное поле ввода.
     * @param {HTMLDivElement} notice Сообщение ошибки ввода.
     */
    var setNotice = function (elementInput, notice) {
        elementInput.classList.add(INVALID_INPUT_CLASSNAME);
        var elementNotice = templateNotice.cloneNode(true);
        elementNotice.querySelector(window.library.selector.template.errorNotice.text);
        elementNotice.textContent = notice;
        embedNotice(elementInput, elementNotice);
    };
    /**
     * @description Осуществляет проверку валидности поля ввода хештегов.
     * @return {String} notice Сообщение ошибки (пустая строка, если поле ввода заполнено валидно).
     */
    var validateInputHashTags = function () {
        var notice = '';
        var hashtags = elementInputHashTags.value.split(' ').filter(function (hashtag) {
            return hashtag !== '';
        });
        if(hashtags.length == 1 && hashtags[0] === '') {
            return notice;
        }
        Object.keys(validityErrorNameToInputHashTagCheckInstrument).some(function (key) {
            if(validityErrorNameToInputHashTagCheckInstrument[key].checkFunction(hashtags)) {
                notice = validityErrorNameToInputHashTagCheckInstrument[key].notice;
                return true;
            }
            return false;
        });
        return notice;
    };
    /**
     * @description Осуществляет проверку валидности поля ввода описания загружаемой картинки.
     * @return {Boolean}
     */
    var validateInputDescription = function () { 
        return elementInputDescription.value.length > LIMIT_CHARACTERS_IN_DESCRIPTION ? NOTICE_FOR_DESCRIPTION : '';
    };
    /**
     * @description Получает результат валидности заполнения формы, перед её отправкой.
     * @return {Boolean}
     */
    var isFormValidity = function () {
        return inputHashTagValidity && inputDescriptionValidity;
    };
    /**
     * @description Подготавливает значения полей ввода для отправки на сервер.
     */
    var prepareFormValue = function () {
        var text = window.library.prepareTextValueForSend(elementHashTagInput.value);
        elementHashTagInput.value = text;
        text = window.library.prepareTextValueForSend(elementDescriptionInput.value);
        elementDescriptionInput.value = text;
    };
    /**
     * @description Обработчик на событие "submit".
     * @param {Event} evt
     */
    var onSubmit = function (evt) {
        evt.preventDefault();
        if(isFormValidity()) {
            prepareFormValue();
            sendPicture();
        }
    };
    /**
     * @description Отправляет данные на сервер
     */
    var sendPicture = function () {
        window.backend.sendPicture(window.networkHandler.onImageSend, window.networkHandler.onImageSendError);
    };
    /**
     * @description Обработчик события "Фокус на поле description". 
     */
    var onFocus = function () {
        var event = new Event('focus happend');
        document.dispatchEvent(event);
    };
    /**
     * @description Удаляет сообщение об ошибки валидации, установленное ранее для переданного в функцию поля ввода.
     * @param {HTMLElement} elementInput поле ввода, у которой нужно удалить сообщение ошибки
     */
    var flushNotice = function (elementInput) {
        var potentialNoticeNode = elementInput.nextElementSibling;
        if(potentialNoticeNode !== null && potentialNoticeNode.id === 'notice') {
            potentialNoticeNode.remove();
            elementInput.classList.remove(INVALID_INPUT_CLASSNAME);
        }
    };
    /**
     * @description Валидирует элемент формы. 
     * @param {HTMLElement} element
     * @param {String} elementClassName
     */
    var validateFormElement = function (element, elementClassName) {
        if(elementClassName === 'text__description') {
            var notice = validateInputDescription();
            if(notice !== '') {
                inputDescriptionValidity = false;
                setNotice(element, notice);
            } else {
                inputDescriptionValidity = true;
            }
        }
        if(elementClassName === 'text__hashtags') {
            var notice = validateInputHashTags();
            if(notice !== '') {
                inputHashTagValidity = false;
                setNotice(element, notice);
            } else {
                inputHashTagValidity = true;
            }
        }
    };
    /**
     * @description Обработчик на событие "Фокус на поле description".
     */
    var onBlur = function () {
        var event = new Event('blur happend');
        document.dispatchEvent(event);
    };
    /**
     * @description Обработчик на событие "Значение в поле ввода формы изменилось".
     * @param {Event} evt
     */
    var onChanged = function (evt) {
        clearTimeout(timerId);
        setTimeout(function () {
            if(evt.target.classList[0] === 'text__hashtags') {
                flushNotice(evt.target);
                validateFormElement(evt.target, 'text__hashtags');
            }
            if(evt.target.classList[0] === 'text__description') {
                flushNotice(evt.target);
                validateFormElement(evt.target, 'text__description');
            }
        }, 500);
    };
    /**
     * @description Сброс значений полей ввода формы.
     */
    var resetInputs = function () {
        elementScaleValue.value = '100%';
        elementUploadFile.value = '';
        elementScaleLevel.style.width = '100%';
        elementHashTagInput.value = '';
        elementDescriptionInput.value = '';
    };
    /**
     * @description Обработчик события на "Сбросить форму".
     */
    var onReset = function () {
        flushAllNotices();
        resetInputs();
    };

    window.library.addListenerTo(window.library.selector.input.description, 'focus', onFocus);
    window.library.addListenerTo(window.library.selector.input.description, 'blur', onBlur);
    window.library.addListenerTo(window.library.selector.input.description, 'input', onChanged);
    window.library.addListenerTo(window.library.selector.input.hashTag, 'input', onChanged);
    window.library.addListenerTo(window.library.selector.postForm, 'submit', onSubmit);
    window.library.addListenerToDoc('reset form', onReset);
})();