'use strict';

(function () {
    var QUANTITY_COMMENTS = 5;
    var currentCommentsQuantity = 0;
    var library = window.library;
    var selector = library.selector;
    var template = document.querySelector(selector.template.self);
    var elementBigPicture = document.querySelector(selector.bigPicture.self);
    var templateComment = template.content.querySelector(selector.template.socialComment.self);
    var picture;
    var returnDocumentCoordY;
    var bigPictureSelector = selector.bigPicture;
    /**
    * @description Обработчик на событие "Нажатие на кнопку "загрузить ещё комментарии"". 
    */
    var onLoadMoreCommentsClicked = function () {
        addComments();
    };
    /**
     * @description Обработчик события "Закрыть масштабный вариант показа изображения".
     * @param {Event} evt
     */
    var onClosed = function (evt) {
        if(!(evt.keyCode === library.keyCode.ESC || evt.keyCode === undefined)) return;
        window.scrollTo(0, returnDocumentCoordY);
        library.addClassTo(selector.bigPicture.self, 'hidden');
        clearComments();
        library.removeListenerFrom(selector.bigPicture.cancel, 'click', onClosed);
        library.removeListenerFromDoc('keydown', onClosed);
        library.removeListenerFrom(selector.bigPicture.loadMoreComments, 'click', onLoadMoreCommentsClicked);
        library.removeClassFrom('body', 'modal-open');
    };
    /**
     * @description Определяет, нужно ли скрыть кнопку загрузки дополнительных комментариев.
     * @param {Number} value количество уже отображенных комментариев.
     * @return {Boolean}
     */
    var shouldLoadMoreHide = function (value) {
        return value % QUANTITY_COMMENTS !== 0 || value == picture.comments.length;
    };
    /**
     * @description Скрыть кнопку отображения дополнительных комментариев.
     */
    var hideLoadMoreComments = function () {
        document.querySelector(selector.bigPicture.loadMoreComments).hidden = true;
    };
    /**
     * @description Показать кнопку отображения дополнительных комментариев.
     */
    var showLoadMoreComments = function () {
        document.querySelector(selector.bigPicture.loadMoreComments).hidden = false;
    };
    /**
     * @description Добавить комментарии к изображению.
     */
    var addComments = function () {
        var fragment = document.createDocumentFragment();
        picture.comments.slice(currentCommentsQuantity, currentCommentsQuantity + QUANTITY_COMMENTS).forEach(function (comment) {
            var elementComment = templateComment.cloneNode(true);
            elementComment.querySelector(selector.template.socialComment.text).textContent = comment;
            fragment.appendChild(elementComment);
            ++currentCommentsQuantity;
        });
        if(shouldLoadMoreHide(currentCommentsQuantity)) {
            hideLoadMoreComments();
        }
        elementBigPicture.querySelector(selector.bigPicture.comments).appendChild(fragment);
        elementBigPicture.querySelector(selector.bigPicture.statShownComments).textContent = currentCommentsQuantity;
    };
    /**
     * @description Удалить комментарии к изображению из дерева.
     */
    var clearComments = function () {
        var elementsComments = document.querySelectorAll(selector.template.socialComment.self);
        Array.prototype.forEach.call(elementsComments, function (elementComment) {
            elementComment.remove();
        });
    };
    /**
     * @description Отображает выбранное пользователем изображение в масштабном варианте.
     * @param {HTMLElement} elementPicture
     */
    window.renderBigPhoto = function (elementPicture) {
        returnDocumentCoordY = window.pageYOffset;
        currentCommentsQuantity = 0;
        showLoadMoreComments();
        var commentSelector = selector.template.socialComment;
        picture = window.dataStorage.originalPictures[Number(elementPicture.parentElement.dataset.id)];
        elementBigPicture.querySelector(selector.bigPicture.source).src = picture.url;
        elementBigPicture.querySelector(selector.bigPicture.statLikes).textContent = picture.likes;
        elementBigPicture.querySelector(selector.bigPicture.statComments).textContent = picture.comments.length;
        addComments(picture);
        library.removeClassFrom(selector.bigPicture.self, 'hidden');
        library.addClassTo('body', 'modal-open');
        library.addListenerTo(selector.bigPicture.cancel, 'click', onClosed);
        library.addListenerToDoc('keydown', onClosed);
        library.addListenerTo(bigPictureSelector.loadMoreComments, 'click', onLoadMoreCommentsClicked);
        elementBigPicture.querySelector(selector.bigPicture.source).scrollIntoView(true);
    };
})();