'use strict';

(function () {
    var imageCssSelector = '.img-upload__preview';
    var elementImage = document.querySelector(imageCssSelector);
    var scalePinCssSelector = '.scale__pin';
    var scaleValueSelector = '.scale__value';
    var scaleLineSelector = '.scale__line';
    var elementScaleValue = document.querySelector(scaleValueSelector);
    var elementScalePin = document.querySelector(scalePinCssSelector);
    var scaleWidth = 453;
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

    var setScaleValue = function (nextScalePinCoord) {
        elementScaleValue.setAttribute('value', (nextScalePinCoord / scaleWidth) * 100);
    };
    var isScalePinMoveAvailable = function (nextScalePinCoords) {
        return (nextScalePinCoords.x  < parseInt(scaleWidth, 10)) && (nextScalePinCoords.x  >= 0);
    };
    var applyShift = function (shift) {
        var currentScalePinCoords = getScalePinCoords();
        var nextScalePinCoords = {
            x: currentScalePinCoords.x - shift.x
        };
        if(isScalePinMoveAvailable(nextScalePinCoords)) {
            elementScalePin.style.left = nextScalePinCoords.x + 'px';
            setScaleValue(nextScalePinCoords.x);
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
            effectNameToStyleOption[window.library.currentEffectName].min) * (nextScalePinCoord / scaleWidth);
        return styleName + '(' + styleValue + effectNameToStyleOption[window.library.currentEffectName].scale + ')';
    };
    var setImageStyle = function (nextScalePinCoord) {
        var styleValue = getStyleValue(nextScalePinCoord);
        window.library.addStyleTo(imageCssSelector, 'filter', styleValue);
    };
    
    window.library.addListenerTo(scalePinCssSelector, 'mousedown', onMouseDown);
})();