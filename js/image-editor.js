'use strict';

(function () {
    var scaleWidth = 453;
    var elementScalePin = document.querySelector(window.library.selector.scale.pin);
    var elementImage = document.querySelector(window.library.selector.imagePreview.self);

    var shouldSliderHide = function (effectName) {
        return effectName === 'effects__preview--none';
    };
    var setSlider = function (effectName) {
        if(shouldSliderHide(effectName)) {
            window.library.addClassName(window.library.selector.slider ,'hidden');
            return;
        } 
        window.library.removeClassName(window.library.selector.slider ,'hidden');
    };
    var applyEffect = function (effectName) {
        var oldEffectName = elementImage.className.match(/effects__preview--[0-9a-zA-Z]+/) || '';
        window.library.removeClassName(window.library.selector.imagePreview.self, oldEffectName[0]);;
        window.library.addClassName(window.library.selector.imagePreview.self, effectName);
    };
    var applyChanges = function (target) {
        var effectName = target.className.match(/effects__preview--[0-9a-zA-Z]+/) || '';
        applyEffect(effectName[0]);
        setSlider(effectName[0]);
        window.library.currentEffectName = effectName[0].split('--')[1]; 
    };
    var updateStyles = function () {
        window.library.removeStyleFrom(window.library.selector.imagePreview.self, 'filter');
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
    window.library.addListenerTo(window.library.selector.effectsList, 'click', onClicked);
})();