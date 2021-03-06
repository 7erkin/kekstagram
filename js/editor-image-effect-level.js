// Модуль определяет изменение стилей при перемещении ползунка слайдера.

'use strict';

(function () {
    var library = window.library;
    var elementImage = document.querySelector(library.selector.imagePreview.self);
    var elementScaleValue = document.querySelector(library.selector.scale.value);
    var elementScaleLevel = document.querySelector(library.selector.scale.level);
    var elementScalePin = document.querySelector(library.selector.scale.pin);
    var elementEffectValue = document.querySelector(library.selector.input.effectLevel);
    var effectNameToStyleOption = {
        chrome: {
            styleName: 'grayscale',
            scale: '',
            min: 0,
            max: 1
        },
        sepia: {
            styleName: 'sepia',
            scale: '',
            min: 0,
            max: 1
        },
        marvin: {
            styleName: 'invert',
            scale: '%',
            min: 0,
            max: 100
        },
        phobos: {
            styleName: 'blur',
            scale: 'px',
            min: 0,
            max: 3
        },
        heat: {
            styleName: 'brightness',
            scale: '',
            min: 1,
            max: 3
        }
    };

    var getShift = function (coords1, coords2) {
        return coords1 - coords2;
    };
    var getPinXCoord = function () {
        return elementScalePin.offsetLeft;
    };
    /**
     * @description Устанавливает стили элемента уровня эффекта
     * @param {Number} nextScalePinCoord
     */
    var setEffectLevelStyle = function (nextScalePinCoord) {
        elementScaleLevel.style.width = (nextScalePinCoord / window.library.SCALE_WIDTH) * 100 + '%';
    };
    /**
     * @description Устанавливает величину эффекта
     * @param {Number} nextScalePinCoord
     */
    var setEffectValue = function (nextScalePinCoord) {
        elementEffectValue.setAttribute('value', nextScalePinCoord / window.library.SCALE_WIDTH * 100);
    };
    /**
     * @description Определяет, можно ли передвигать ползунок слайдера
     * @param {Number} nextPinXCoord
     * @returns
     */
    var isScalePinMoveAvailable = function (nextPinXCoord) {
        return (nextPinXCoord  < parseInt(window.library.SCALE_WIDTH, 10)) && (nextPinXCoord  >= 0);
    };
    /**
     * @description Применяет новый значения к элементам, согласно координатам ползунка слайдера.
     * @param {Number} shift
     */
    var applyShift = function (shift) {
        var currentPinXCoord = getPinXCoord();
        var nextPinXCoord = currentPinXCoord - shift;
        if(isScalePinMoveAvailable(nextPinXCoord)) {
            elementScalePin.style.left = nextPinXCoord + 'px';
            setEffectLevelStyle(nextPinXCoord);
            setEffectValue(nextPinXCoord);
            setImageStyle(nextPinXCoord);
        }
    };

    var onMouseDown = function (evt) {
        evt.preventDefault();
        var startXCoord = evt.clientX;
        var onMouseMove = function (evt) {
            evt.preventDefault();
            var currentXCoord = evt.clientX;
            var shift = getShift(startXCoord, currentXCoord);
            applyShift(shift);
            startXCoord = currentXCoord;
        };
        var onMouseUp = function (evt) {
            evt.preventDefault();
            library.removeListenerFromDoc('mousemove', onMouseMove);
            library.removeListenerFromDoc('mouseup', onMouseUp);
        };
        library.addListenerToDoc('mousemove', onMouseMove);
        library.addListenerToDoc('mouseup', onMouseUp)
    };
    /**
     * @description Вычисляет значение стиля filter.
     * @param {Number} nextScalePinCoord
     * @return {String}
     */
    var getFilterValue = function (nextScalePinCoord) {
        var styleName = effectNameToStyleOption[library.currentEffectName].styleName;
        var styleValue = effectNameToStyleOption[library.currentEffectName].min + 
            (effectNameToStyleOption[library.currentEffectName].max -
            effectNameToStyleOption[library.currentEffectName].min) * (nextScalePinCoord / window.library.SCALE_WIDTH);
        return styleName + '(' + styleValue + effectNameToStyleOption[library.currentEffectName].scale + ')';
    };
    /**
     * @description Устанавливает стили на изображение.
     * @param {Number} nextScalePinCoord
     */
    var setImageStyle = function (nextScalePinCoord) {
        var styleValue = getFilterValue(nextScalePinCoord);
        library.addStyleTo(library.selector.imagePreview.self, 'filter', styleValue);
    };
    
    library.addListenerTo(library.selector.scale.pin, 'mousedown', onMouseDown);
})();