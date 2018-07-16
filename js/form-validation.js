'use strict';

(function () {
    var QUANTITY_HASHTAG = 5;
    var MAX_HASHTAG_LENGTH = 20;
    var LIMIT_CHARACTERS_IN_DESCRIPTION = 140;
    var NOTICE_FOR_DESCRIPTION = 'количество символов не больше ' + LIMIT_CHARACTERS_IN_DESCRIPTION;
    var validityErrorNameToInputHashTagCheckInstrument = {
        NOT_SHARP_BEGIN: {
            notice: 'хештег начинается с #',
            checkFunction: function (hashtags) {
                return hashtags.some(function (hashtag) {
                    return hashtag[0] !== '#';
                });
            }
        },
        ONLY_ONE_SHARP_USED: {
            notice: 'хештег не может состоять только из #',
            checkFunction: function (hashtags) {
                return hashtags.some(function (hashtag) {
                    return hashtag.length == 1;
                });
            }
        },
        NO_SPACE_USED: {
            notice: 'хештеги разделяются пробелом',
            checkFunction: function (hashtags) {
                return hashtags.some(function (hashtag) {
                    return hashtag.split('#').length > 2;
                });
            }
        },
        HASHTAG_REPEATED: {
            notice: 'хештеги не повторяются',
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
            notice: 'количество хештегов не больше ' + QUANTITY_HASHTAG,
            checkFunction: function (hashtags) {
                return hashtags.length > QUANTITY_HASHTAG;
            }
        },
        HASHTAG_LENGTH_INCREASED: {
            notice: 'длина хештега не превышает ' + MAX_HASHTAG_LENGTH + 'символов',
            checkFunction: function (hashtags) {
                return hashtags.some(function (hashtag) {
                    return hashtag.length > 20;
                });
            }
        }
    };

    var elementInputHashTags = document.querySelector(window.library.selector.input.hashTag);
    var elementInputDescription = document.querySelector(window.library.selector.input.description);

    var setNotice = function (elementInput, notice) {
        elementInput.style.border = '5px solid red';
        
    };

    var validateInputHashTags = function () {
        var notice = '';
        var hashtags = elementInputHashTags.value.split(' ');
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
    var validateInputDescription = function () {
        return elementInputDescription.value.length > LIMIT_CHARACTERS_IN_DESCRIPTION ? NOTICE_FOR_DESCRIPTION : '';
    };
    var isFormValidity = function () {
        var inputHashtagsNotice = validateInputHashTags();
        var inputDescriptionNotice = validateInputDescription();
        if (inputHashtagsNotice === '' && inputDescriptionNotice === '') {
            return true;
        }
        if(inputHashtagsNotice !== '') setNotice(elementInputHashTags, inputHashtagsNotice);
        if(inputDescriptionNotice !== '') setNotice(elementInputDescription, inputDescriptionNotice);
        return false;
    };

    var onSubmit = function (evt) {
        evt.preventDefault();
        if(isFormValidity()) {
            sendPicture();
            var event = new Event('form-send');
            document.dispatchEvent(event);
        }
    };
    var sendPicture = function () {
        window.backend.sendPicture(window.networkHandler.onImageSend, window.networkHandler.onImageSendError);
    };

    var onFocus = function () {
        var event = new Event('focus happend');
        document.dispatchEvent(event);
    };
    var onBlur = function () {
        var event = new Event('blur happend');
        document.dispatchEvent(event);
    };

    window.library.addListenerTo(window.library.selector.input.description, 'focus', onFocus);
    window.library.addListenerTo(window.library.selector.input.description, 'blur', onBlur);
    window.library.addListenerTo(window.library.selector.postForm, 'submit', onSubmit);
})();