'use strict';

(function () {
    var QUANTITY_COMMENTS = 5;
    var currentCommentsQuantity = 0;
    var picture = {};
    var pictures = [];
    var documentCoord;

    var bigPictureSelector = window.library.selector.bigPicture;
    var template = document.querySelector(window.library.selector.template.self);
    var templatePicture = template.content.querySelector(window.library.selector.template.picture.self);
    var elementBigPicture = document.querySelector(bigPictureSelector.self);
    var templateComment = template.content.querySelector(window.library.selector.template.socialComment.self);

    var onClosed = function (evt) {
        if(!(evt.keyCode === window.library.keyCode.ESC || evt.keyCode === undefined)) return;
        window.scrollTo(0, documentCoord);
        window.library.addClassName(window.library.selector.bigPicture.self, 'hidden');
        window.library.removeListenerFrom(bigPictureSelector.cancel, 'click', onClosed);
        window.library.removeListenerFromDoc('keydown', onClosed);
        window.library.removeListenerFrom(bigPictureSelector.loadMoreComments, 'click', onLoadMoreCommentsClicked);
        window.library.removeClassName('body', 'modal-open');
    };
    var shouldLoadMoreHide = function (value) {
        return value % QUANTITY_COMMENTS !== 0 || value == picture.comments.length;
    };
    var hideLoadMoreComments = function () {
        document.querySelector(bigPictureSelector.loadMoreComments).hidden = true;
    };
    var showLoadMoreComments = function () {
        document.querySelector(bigPictureSelector.loadMoreComments).hidden = false;
    };
    var addComments = function () {
        var fragment = document.createDocumentFragment();
        picture.comments.slice(currentCommentsQuantity, currentCommentsQuantity + QUANTITY_COMMENTS).forEach(function (comment) {
            var elementComment = templateComment.cloneNode(true);
            elementComment.querySelector(window.library.selector.template.socialComment.text).textContent = comment;
            fragment.appendChild(elementComment);
            ++currentCommentsQuantity;
        });
        if(shouldLoadMoreHide(currentCommentsQuantity)) {
            hideLoadMoreComments();
        }
        elementBigPicture.querySelector(bigPictureSelector.comments).appendChild(fragment);
        elementBigPicture.querySelector(bigPictureSelector.statShownComments).textContent = currentCommentsQuantity;
    };
    var clearComments = function () {
        var elementsComments = document.querySelectorAll(window.library.selector.template.socialComment.self);
        Array.prototype.forEach.call(elementsComments, function (elementComment) {
            elementComment.remove();
        });
    };
    var setBigPicture = function (elementPicture) {
        currentCommentsQuantity = 0;
        showLoadMoreComments();
        var commentSelector = window.library.selector.template.socialComment;
        picture = pictures[Number(elementPicture.parentElement.dataset.id)];
        elementBigPicture.querySelector(bigPictureSelector.source).src = picture.url;
        elementBigPicture.querySelector(bigPictureSelector.statLikes).textContent = picture.likes;
        elementBigPicture.querySelector(bigPictureSelector.statComments).textContent = picture.comments.length;
        clearComments();
        addComments();
        window.library.removeClassName(window.library.selector.bigPicture.self, 'hidden');
        window.library.addClassName('body', 'modal-open');
        window.library.addListenerTo(bigPictureSelector.cancel, 'click', onClosed);
        window.library.addListenerToDoc('keydown', onClosed);
        elementBigPicture.querySelector(bigPictureSelector.source).scrollIntoView(true);
    };
    var onLoadMoreCommentsClicked = function () {
        addComments();
    };
    var onClick = function (evt) {
        documentCoord = window.pageYOffset;
        setBigPicture(evt.target);
        window.library.addListenerTo(bigPictureSelector.loadMoreComments, 'click', onLoadMoreCommentsClicked);
    };
    var Photo = function (picture, index) {
        var elementPicture = templatePicture.cloneNode(true);
        elementPicture.querySelector('img').src = picture.url;
        elementPicture.querySelector(window.library.selector.template.picture.statComments).textContent = picture.comments.length;
        elementPicture.querySelector(window.library.selector.template.picture.statLikes).textContent = picture.likes;
        elementPicture.setAttribute('data-id', index);
        return elementPicture;
    };
    var createPhotoElements = function () {
        var fragment = document.createDocumentFragment();
        pictures.forEach(function (picture, index) {
            var elementPicture = new Photo(picture, index);
            elementPicture.addEventListener('click', onClick);
            fragment.appendChild(elementPicture);
        });
        return fragment;
    };
    var clearPictures = function () {
        var elementsPictures = document.querySelectorAll(window.library.selector.template.picture.self);
        Array.prototype.forEach.call(elementsPictures, function (elementPicture) {
            elementPicture.remove();
        });
    };
    var onRender = function () {
        clearPictures();
        window.photoRenderer.render();
    };
    window.library.addListenerToDoc('render', onRender);

    window.photoRenderer = {};
    window.photoRenderer.render = function () {
        pictures = window.dataStorage.transform.downloadedPictures.slice();
        var elementsPictures = createPhotoElements();
        var container = document.querySelector('.pictures.container');
        container.appendChild(elementsPictures);
    };
})();