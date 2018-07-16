'use strict';

(function () {
    var library = window.library;
    var selector = library.selector;
    var elementScalePin = document.querySelector(selector.scale.pin);
    var elementImage = document.querySelector(selector.imagePreview.self);

    var shouldSliderHide = function (effectName) {
        return effectName === 'effects__preview--none';
    };
    var setSlider = function (effectName) {
        if(shouldSliderHide(effectName)) {
            library.addClassTo(selector.slider ,'hidden');
            return;
        } 
        library.removeClassFrom(selector.slider ,'hidden');
    };
    var applyEffect = function (effectName) {
        var oldEffectName = elementImage.className.match(/effects__preview--[0-9a-zA-Z]+/) || '';
        library.removeClassFrom(selector.imagePreview.self, oldEffectName[0]);;
        library.addClassTo(selector.imagePreview.self, effectName);
    };
    var applyChanges = function (target) {
        var effectName = target.className.match(/effects__preview--[0-9a-zA-Z]+/) || '';
        applyEffect(effectName[0]);
        setSlider(effectName[0]);
        library.currentEffectName = effectName[0].split('--')[1]; 
    };
    var updateStyles = function () {
        library.removeStyleFrom(selector.imagePreview.self, 'filter');
    };
    var setScalePinBasePosition = function () {
        elementScalePin.style.left = library.SCALE_WIDTH + 'px';
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
    library.addListenerTo(selector.effectsList, 'click', onClicked);
})();