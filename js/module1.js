'use strict';

(function () {
    var onClosed = function (evt) {
        if(!(evt.keyCode === window.library.keyCode.ESC || evt.keyCode === undefined)) return;
        window.library.addClassName('.img-upload__overlay', 'hidden');
        window.library.removeListenerFrom('#upload-cancel', 'click', onClosed);
        window.library.removeListenerFromDoc('keydown', onClosed);
    };
    var onChanged = function () {
        window.library.removeClassName('.img-upload__overlay', 'hidden');
        window.library.addListenerTo('#upload-cancel', 'click', onClosed);
        window.library.addListenerToDoc('keydown', onClosed);
    };

    window.library.addListenerTo('#upload-file', 'change', onChanged);
})();