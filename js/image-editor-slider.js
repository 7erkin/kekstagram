'use strict';

(function () {
    var library = window.library;
    var elementImage = document.querySelector(library.selector.imagePreview.self);
    var elementScaleValue = document.querySelector(library.selector.scale.value);
    var elementScaleLevel = document.querySelector(library.selector.scale.level);
    var elementScalePin = document.querySelector(library.selector.scale.pin);
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

    var getShift = function (coords1, coords2) {
        return coords1 - coords2;
    };

    var getPinXCoord = function () {
        return elementScalePin.offsetLeft;
    };

    var setLevel = function (nextScalePinCoord) {
        elementScaleLevel.style.width = (nextScalePinCoord / SCALE_WIDTH) * 100 + '%';
    };
    var isScalePinMoveAvailable = function (nextPinXCoord) {
        return (nextPinXCoord  < parseInt(SCALE_WIDTH, 10)) && (nextPinXCoord  >= 0);
    };
    var applyShift = function (shift) {
        var currentPinXCoord = getPinXCoord();
        var nextPinXCoord = currentPinXCoord - shift;
        if(isScalePinMoveAvailable(nextPinXCoord)) {
            elementScalePin.style.left = nextPinXCoord + 'px';
            setLevel(nextPinXCoord);
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
    var getStyleValue = function (nextScalePinCoord) {
        var styleName = effectNameToStyleOption[library.currentEffectName].styleName;
        var styleValue = effectNameToStyleOption[library.currentEffectName].min + 
            (effectNameToStyleOption[library.currentEffectName].max -
            effectNameToStyleOption[library.currentEffectName].min) * (nextScalePinCoord / SCALE_WIDTH);
        return styleName + '(' + styleValue + effectNameToStyleOption[library.currentEffectName].scale + ')';
    };
    var setImageStyle = function (nextScalePinCoord) {
        var styleValue = getStyleValue(nextScalePinCoord);
        library.addStyleTo(library.selector.imagePreview.self, 'filter', styleValue);
    };
    
    library.addListenerTo(library.selector.scale.pin, 'mousedown', onMouseDown);
})();