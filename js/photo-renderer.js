'use strict';

(function () {
    var library = window.library;
    var selector = library.selector;
    var QUANTITY_COMMENTS = 5;
    var currentCommentsQuantity = 0;
    var picture = {};
    var pictures = [];
    var documentCoord;

    var bigPictureSelector = selector.bigPicture;
    var template = document.querySelector(selector.template.self);
    var templatePicture = template.content.querySelector(selector.template.picture.self);
    var elementBigPicture = document.querySelector(bigPictureSelector.self);
    var templateComment = template.content.querySelector(selector.template.socialComment.self);
    /**
     * @description Обработчик события "Закрыть масштабный вариант показа изображения".
     * @param {Event} evt
     */
    var onClosed = function (evt) {
        if(!(evt.keyCode === library.keyCode.ESC || evt.keyCode === undefined)) return;
        window.scrollTo(0, documentCoord);
        library.addClassTo(selector.bigPicture.self, 'hidden');
        clearComments();
        library.removeListenerFrom(bigPictureSelector.cancel, 'click', onClosed);
        library.removeListenerFromDoc('keydown', onClosed);
        library.removeListenerFrom(bigPictureSelector.loadMoreComments, 'click', onLoadMoreCommentsClicked);
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
        document.querySelector(bigPictureSelector.loadMoreComments).hidden = true;
    };
    /**
     * @description Показать кнопку отображения дополнительных комментариев.
     */
    var showLoadMoreComments = function () {
        document.querySelector(bigPictureSelector.loadMoreComments).hidden = false;
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
        elementBigPicture.querySelector(bigPictureSelector.comments).appendChild(fragment);
        elementBigPicture.querySelector(bigPictureSelector.statShownComments).textContent = currentCommentsQuantity;
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
    var setBigPicture = function (elementPicture) {
        currentCommentsQuantity = 0;
        showLoadMoreComments();
        var commentSelector = selector.template.socialComment;
        picture = pictures[Number(elementPicture.parentElement.dataset.id)];
        elementBigPicture.querySelector(bigPictureSelector.source).src = picture.url;
        elementBigPicture.querySelector(bigPictureSelector.statLikes).textContent = picture.likes;
        elementBigPicture.querySelector(bigPictureSelector.statComments).textContent = picture.comments.length;
        addComments();
        library.removeClassFrom(selector.bigPicture.self, 'hidden');
        library.addClassTo('body', 'modal-open');
        library.addListenerTo(bigPictureSelector.cancel, 'click', onClosed);
        library.addListenerToDoc('keydown', onClosed);
        elementBigPicture.querySelector(bigPictureSelector.source).scrollIntoView(true);
    };
    /**
     * @description Обработчик на событие "Нажатие на кнопку "загрузить ещё комментарии"". 
     */
    var onLoadMoreCommentsClicked = function () {
        addComments();
    };
    /**
     * @description Обработчик на событие "Посмотреть изображение".
     * @param {Event} evt
     */
    var onClick = function (evt) {
        documentCoord = window.pageYOffset;
        setBigPicture(evt.target);
        library.addListenerTo(bigPictureSelector.loadMoreComments, 'click', onLoadMoreCommentsClicked);
    };
    /**
     * @description Конструктор изображения, для масштабного просмотра.
     * @param {Object} picture Объект описывающий изображение.
     * @param {Number} index Индекс для нумерации изображений в дереве.
     * @returns
     */
    var Photo = function (picture, index) {
        var elementPicture = templatePicture.cloneNode(true);
        elementPicture.querySelector('img').src = picture.url;
        elementPicture.querySelector(selector.template.picture.statComments).textContent = picture.comments.length;
        elementPicture.querySelector(selector.template.picture.statLikes).textContent = picture.likes;
        elementPicture.setAttribute('data-id', index);
        return elementPicture;
    };
    /**
     * @description Создаёт фрагмент из узлов-фотографий, для отображения.
     * @return {DocumentFragment}
     */
    var createPhotoElements = function () {
        var fragment = document.createDocumentFragment();
        pictures.forEach(function (picture, index) {
            var elementPicture = new Photo(picture, index);
            elementPicture.addEventListener('click', onClick);
            fragment.appendChild(elementPicture);
        });
        return fragment;
    };
    /**
     * @description Удаляет узлы-фотографии из дерева.
     */
    var clearPictures = function () {
        var elementsPictures = document.querySelectorAll(selector.template.picture.self);
        Array.prototype.forEach.call(elementsPictures, function (elementPicture) {
            elementPicture.remove();
        });
    };
    /**
     * @description Обработчик события "Отрисовать фотографии на страничке".
     */
    var onRender = function () {
        clearPictures();
        window.photoRenderer.render();
    };
    library.addListenerToDoc('render', onRender);

    window.photoRenderer = {};
    window.photoRenderer.render = function () {
        pictures = window.dataStorage.transformPictures.slice();
        var elementsPictures = createPhotoElements();
        var container = document.querySelector('.pictures.container');
        container.appendChild(elementsPictures);
    };
})();