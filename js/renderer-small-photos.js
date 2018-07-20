// 

'use strict';

(function () {
    var library = window.library;
    var selector = library.selector;
    var picture = {};
    var pictures = [];
    var documentCoord;
    var template = document.querySelector(selector.template.self);
    var templatePicture = template.content.querySelector(selector.template.picture.self);
    var bigPictureSelector = selector.bigPicture;
    /**
     * @description Обработчик на событие "Посмотреть изображение".
     * @param {Event} evt
     */
    var onClick = function (evt) {
        window.renderBigPhoto(evt.target);
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
        window.renderSmallPhotos();
    };
    library.addListenerToDoc('render', onRender);
    window.renderSmallPhotos = function () {
        pictures = window.dataStorage.transformPictures.slice();
        var elementsPictures = createPhotoElements();
        var container = document.querySelector('.pictures.container');
        container.appendChild(elementsPictures);
    };
})();