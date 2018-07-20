// Модуль определяет управление изменением масштаба загружаемого изображения.

'use strict';

(function () {
    var STEP = 25;
    var MIN = 25;
    var MAX = 100;
    var AttributeValueToOperand = {
        minus: -1,
        plus: 1
    };
    var library = window.library;
    var selector = library.selector;
    var elementImage = document.querySelector(selector.imagePreview.self);
    var elementResizeValue = document.querySelector(selector.scale.value);
    /**
     * @description Изменяет масштаб загружаемого изображения.
     * @param {Number} value
     */
    var changeResizeValue = function (value) {
        var nextValue = parseInt(elementResizeValue.value, 10) + value;
        if(nextValue >= 25 && nextValue <= 100) {
            elementResizeValue.value = nextValue + '%';
            library.addStyleTo(selector.imagePreview.self, 'transform', 'scale(' + nextValue / 100 + ')');
        }
    };
    /**
     * @description Обработчик события "Изменить масштаб загружаемого изображения".
     * @param {Event} evt
     */
    var onClicked = function (evt) {
        var addictionalValue = AttributeValueToOperand[evt.target.dataset.operand] * STEP;
        changeResizeValue(addictionalValue);
    };

    library.addListenerTo(selector.scale.valueMinus, 'click', onClicked);
    library.addListenerTo(selector.scale.valuePlus, 'click', onClicked);
})();