'use strict';

(function () {
    var imageCssSelector = '.img-upload__preview';
    var sliderCssSelector = '.img-upload__scale';
    var scalePinCssSelector = '.scale__pin';
    var scaleWidth = 453;
    var elementScalePin = document.querySelector(scalePinCssSelector);
    var elementImage = document.querySelector(imageCssSelector);

    var shouldSliderHide = function (effectName) {
        return effectName === 'effects__preview--none';
    };
    var setSlider = function (effectName) {
        if(shouldSliderHide(effectName)) {
            window.library.addClassName(sliderCssSelector ,'hidden');
            return;
        } 
        window.library.removeClassName(sliderCssSelector ,'hidden');
    };
    var applyEffect = function (effectName) {
        var oldEffectName = elementImage.className.match(/effects__preview--[0-9a-zA-Z]+/) || '';
        window.library.removeClassName(imageCssSelector, oldEffectName[0]);;
        window.library.addClassName(imageCssSelector, effectName);
    };
    var applyChanges = function (target) {
        var effectName = target.className.match(/effects__preview--[0-9a-zA-Z]+/) || '';
        applyEffect(effectName[0]);
        setSlider(effectName[0]);
        window.library.currentEffectName = effectName[0].split('--')[1]; 
    };
    var updateStyles = function () {
        window.library.removeStyleFrom(imageCssSelector, 'filter');
    };
    var setScalePinBasePosition = function () {
        elementScalePin.style.left = scaleWidth + 'px';
    };
    var onClicked = function (evt) {
        evt.preventDefault();
        if(evt.target.classList.contains('effects__preview')) {
            applyChanges(evt.target); 
            updateStyles();  
            setScalePinBasePosition(); 
        }  
    };

    setScalePinBasePosition();
    window.library.addListenerTo('.effects__list', 'click', onClicked);
})();