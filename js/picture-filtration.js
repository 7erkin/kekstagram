'use strict';

(function () {
    var QUANTITY_NEW_PICTURE = 10;
    var DELAY = 500;

    var pictures = window.dataStorage.transform.downloadedPictures;
    var filterSelector = window.library.selector.filter;
    var activeFilterClass = filterSelector.activeFilter.split('.')[1];
    var timerId;
    var checkedFilter;
    var uncheckedFilter;

    var filterIdToFiltrationFunction = {
        'filter-popular': function () {
            window.dataStorage.transform.downloadedPictures = window.dataStorage.original.downloadedPictures.slice();
        },
        'filter-new': function () {
            window.dataStorage.transform.downloadedPictures = window.dataStorage.original.downloadedPictures.slice(0, QUANTITY_NEW_PICTURE);
        },
        'filter-discussed': function () {
            window.dataStorage.transform.downloadedPictures = window.dataStorage.original.downloadedPictures.slice();
            window.dataStorage.transform.downloadedPictures.sort(function (picture1, picture2) {
                return -picture1.comments.length + picture2.comments.length;
            });
        }
    };

    var genRenderEvent = function () {
        var event = new Event('render');
        document.dispatchEvent(event);
    };

    var filtratePictures = function () {
        filterIdToFiltrationFunction[checkedFilter.id]();
        genRenderEvent();
    };
    var updateFilterView = function (currentFilter) {
        uncheckedFilter = document.querySelector(filterSelector.self).querySelector(filterSelector.activeFilter);
        uncheckedFilter.classList.remove(activeFilterClass);
        checkedFilter = currentFilter;
        checkedFilter.classList.add(activeFilterClass);
    };

    var onClick = function (evt) {
        clearTimeout(timerId);
        timerId = setTimeout(filtratePictures, DELAY);
        updateFilterView(evt.target);
        filtratePictures();
    };

    window.library.addListenerTo(window.library.selector.filter.self, 'click', onClick);
})();