'use strict';

(function () {
    var QUANTITY_NEW_PICTURE = 10;
    var DELAY = 500;

    var filterSelector = window.library.selector.filter;
    var activeFilterClass = filterSelector.activeFilter.split('.')[1];
    var timerId;
    var checkedFilter;
    var uncheckedFilter;

    var filterIdToFiltrationFunction = {
        'filter-popular': function () {
            window.dataStorage.transformPictures = window.dataStorage.originalPictures.slice();
        },
        'filter-new': function () {
            window.dataStorage.transformPictures = window.dataStorage.originalPictures.slice(0, QUANTITY_NEW_PICTURE);
        },
        'filter-discussed': function () {
            window.dataStorage.transformPictures = window.dataStorage.originalPictures.slice();
            window.dataStorage.transformPictures.sort(function (picture1, picture2) {
                return -picture1.comments.length + picture2.comments.length;
            });
        }
    };
    /**
     * @description Генерирует событие "Отрисовка изображений на страничке".
     */
    var genRenderEvent = function () {
        var event = new Event('render');
        document.dispatchEvent(event);
    };
    /**
     * @description Фильтрует изображения по установленному фильтру.
     */
    var filtratePictures = function () {
        filterIdToFiltrationFunction[checkedFilter.id]();
        genRenderEvent();
    };
    /**
     * @description Обновляет отображение фильтров, после выбора другого фильтра.
     * @param {HTMLElement} currentFilter Выбранный фильтр.
     */
    var updateFilterView = function (currentFilter) {
        uncheckedFilter = document.querySelector(filterSelector.self).querySelector(filterSelector.activeFilter);
        uncheckedFilter.classList.remove(activeFilterClass);
        checkedFilter = currentFilter;
        checkedFilter.classList.add(activeFilterClass);
    };
    /**
     * @description Обработчик на событие "Выбран очередной фильтр".
     * @param {Event} evt
     */
    var onClick = function (evt) {
        clearTimeout(timerId);
        timerId = setTimeout(filtratePictures, DELAY);
        updateFilterView(evt.target);
        filtratePictures();
    };

    window.library.addListenerTo(window.library.selector.filter.self, 'click', onClick);
})();