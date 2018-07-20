'use strict';

(function () {
    var LIMIT_CHARACTERS_FOR_DESCRIPTION = 140;
    var QUANTITY_HASHTAG = 5;
    var MAX_HASHTAG_LENGTH = 10;
    var preliminaryCheck = function (hashtags) {
        return (hashtags.length === 1 && hashtags[0].length === 1) ? false : true;
    };
    var attributeToCheckCollection = {
        hashtags: {
            NOT_SHARP_BEGIN: function (hashtags) {
                return hashtags.some(function (hashtag) {
                    return hashtag[0] !== '#';
                });
            },
            ONLY_ONE_SHARP_USED: function (hashtags) {
                return hashtags.some(function (hashtag) {
                    return hashtag.length == 1;
                });
            },
            NO_SPACE_USED: function (hashtags) {
                return hashtags.some(function (hashtag) {
                    return hashtag.split('#').length > 2;
                });
            },
            HASHTAG_REPEATED: function (hashtags) {
                return hashtags.some(function (hashtag){
                    var tempArray = hashtags.filter(function (element) {
                        return element === hashtag;
                    });
                    return tempArray.length > 1;
                });
            },
            HASHTAG_LIMIT_INCREASED: function (hashtags) {
                return hashtags.length > QUANTITY_HASHTAG;
            },
            HASHTAG_LENGTH_INCREASED: function (hashtags) {
                return hashtags.some(function (hashtag) {
                    return hashtag.length > MAX_HASHTAG_LENGTH;
                });
            }
        },
        description: {
            DESCRIPTION_LIMIT_INCREASED: function (text) {
                return text.length > LIMIT_CHARACTERS_FOR_DESCRIPTION;
            }
        }
    };
    var validityErrorNameToNotice = {
        NOT_SHARP_BEGIN: 'хештег должен начинаться с символа #',
        ONLY_ONE_SHARP_USED:  'хештег не может состоять только из символа #',
        NO_SPACE_USED: 'хештеги должны разделяться пробелом',
        HASHTAG_REPEATED:  'хештеги не должны повторяться',
        HASHTAG_LIMIT_INCREASED: 'количество хештегов не должно быть больше ' + QUANTITY_HASHTAG,
        HASHTAG_LENGTH_INCREASED: 'длина хештега не должна превышать ' + MAX_HASHTAG_LENGTH + ' символов',
        DESCRIPTION_LIMIT_INCREASED: 'количество символов не может быть больше ' + LIMIT_CHARACTERS_FOR_DESCRIPTION
    };
    var attributeToValidityStatus = {
        hashtags: true,
        description: true
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
     * @description Возвращает значение поля, которое нужно провалидировать.
     * Именно такое значение отправится на сервер, в случае соответствия правилам заполнения.
     * @param {HTMLElement} element
     * @returns
     */
    var getValueForValidate = function (element) {
        var text = element.value;
        if(element.dataset.postFormElement === 'description') {
            return (text.replace(/ +/, '') === '' || text.length === 0) ? '' : text.match(/[^ ]+/g).join(' ');
        }
        if(element.dataset.postFormElement === 'hashtags') {
            return (text.replace(/ +/, '') === '' || text.length === 0) ? '' : text.match(/[^ ]+/g);
        }
    }
    /**
     * @description Определяет имя ошибки валидации поля ввода
     * @param {HTMLElement} element Элемент, проверяемый на валидность
     * @return {String} errorName  Имя ошибки валидации
     */
    var getErrorName = function (element) {
        var text = element.valueForSend;
        if(text === '') return '';
        var checkObject = attributeToCheckCollection[element.dataset.postFormElement];
        var errorName = '';
        Object.keys(checkObject).some(function (key) {
            if(checkObject[key](element.valueForSend)) {
                errorName = key;
                return true;
            }
            return false;
        });
        return errorName;
    };
    /**
     * @description Обновляет индикаторы валидности поля.
     * @param {HTMLElement} element 
     * @param {String} errorName
     */
    var updateValidityStatus= function (element, errorName) {
        if(errorName !== '') {
            attributeToValidityStatus[element.dataset.postFormElement] = false;
            return;
        }
        attributeToValidityStatus[element.dataset.postFormElement] = true;
    };
    /**
     * @description Валидирует элемент формы. 
     * @param {HTMLElement} element Валидируемый элемент
     * @return {String} errorName Название ошибки валидации
     */
    var validate = function (element) {
        element.valueForSend = getValueForValidate(element);
        var errorName = getErrorName(element);
        updateValidityStatus(element, errorName);
        return errorName;
    };

    window.formValidation = {};
    /**
     * @description Получает результат валидности заполнения формы, перед её отправкой.
     * @return {Boolean}
     */
    window.formValidation.isFormValidity = function () {
        return !Object.keys(attributeToValidityStatus).some(function(key) {
            return !attributeToValidityStatus[key];
        });
    };
    /**
     * @description Валидирует элемент и в случае, если есть ошибки валидации, возвращает имя ошибки валидации.
     * @param {HTMLElement} element
     * @returns
     */
    window.formValidation.checkElementValidity = function (element) {
        var errorValidityName = validate(element);
        return errorValidityName === '' ? '' : validityErrorNameToNotice[errorValidityName];
    };
})();