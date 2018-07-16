'use strict';

(function () {
    var elementImage = document.querySelector(window.library.selector.imagePreview.self);
    var elementScaleValue = document.querySelector(window.library.selector.scale.value);
    var elementScaleLevel = document.querySelector(window.library.selector.scale.level);
    var elementScalePin = document.querySelector(window.library.selector.scale.pin);
    var SCALE_WIDTH = 453;
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

    var getCoords = function (evt) {
        return {
            x: evt.clientX,
            y: evt.clientY
        };
    };

    var getShift = function (coords1, coords2) {
        return {
            x: coords1.x - coords2.x,
            y: coords1.y - coords2.y
        };
    };

    var getScalePinCoords = function () {
        return {
            x: elementScalePin.offsetLeft,
            y: elementScalePin.offsetTop
        };
    };

    var setLevel = function (nextScalePinCoord) {
        elementScaleLevel.style.width = (nextScalePinCoord / SCALE_WIDTH) * 100 + '%';
    };
    var isScalePinMoveAvailable = function (nextScalePinCoords) {
        return (nextScalePinCoords.x  < parseInt(SCALE_WIDTH, 10)) && (nextScalePinCoords.x  >= 0);
    };
    var applyShift = function (shift) {
        var currentScalePinCoords = getScalePinCoords();
        var nextScalePinCoords = {
            x: currentScalePinCoords.x - shift.x
        };
        if(isScalePinMoveAvailable(nextScalePinCoords)) {
            elementScalePin.style.left = nextScalePinCoords.x + 'px';
            setLevel(nextScalePinCoords.x);
            setImageStyle(nextScalePinCoords.x);
        }
    };
    var onMouseDown = function (evt) {
        evt.preventDefault();
        var startMouseCoords = getCoords(evt);
        var onMouseMove = function (evt) {
            evt.preventDefault();
            var currentMouseCoords = getCoords(evt);
            var shift = getShift(startMouseCoords, currentMouseCoords);
            applyShift(shift);
            startMouseCoords = currentMouseCoords;
        };
        var onMouseUp = function (evt) {
            evt.preventDefault();
            window.library.removeListenerFromDoc('mousemove', onMouseMove);
            window.library.removeListenerFromDoc('mouseup', onMouseUp);
        };
        window.library.addListenerToDoc('mousemove', onMouseMove);
        window.library.addListenerToDoc('mouseup', onMouseUp)
    };
    var getStyleValue = function (nextScalePinCoord) {
        var styleName = effectNameToStyleOption[window.library.currentEffectName].styleName;
        var styleValue = effectNameToStyleOption[window.library.currentEffectName].min + 
            (effectNameToStyleOption[window.library.currentEffectName].max -
            effectNameToStyleOption[window.library.currentEffectName].min) * (nextScalePinCoord / SCALE_WIDTH);
        return styleName + '(' + styleValue + effectNameToStyleOption[window.library.currentEffectName].scale + ')';
    };
    var setImageStyle = function (nextScalePinCoord) {
        var styleValue = getStyleValue(nextScalePinCoord);
        window.library.addStyleTo(window.library.selector.imagePreview.self, 'filter', styleValue);
    };
    
    window.library.addListenerTo(window.library.selector.scale.pin, 'mousedown', onMouseDown);
})();