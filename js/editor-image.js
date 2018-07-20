// Модуль определяет базовую функциональность редактора изображения
// 1. Установка эффекта на изображение.
// 2. Корректное отображение формы редактирования.
// 3. Операции с формой редактирования.

'use strict';

(function () {
    var library = window.library;
    var selector = library.selector;
    var elementImage = document.querySelector(selector.imagePreview.self);
    /**
     * @description Определяет, должен ли слайдер (глубина эффекта) спрятан.
     * @param {String} effectName
     * @return {Boolean}
     */
    var shouldSliderHide = function (effectName) {
        return effectName === 'effects__preview--none';
    };
    /**
     * @description В зависимости от выбранного эффекта, скрывает или отображает слайдер.
     * @param {String} effectName
     */
    var setSlider = function (effectName) {
        if(shouldSliderHide(effectName)) {
            library.addClassTo(selector.slider ,'hidden');
            return;
        } 
        library.removeClassFrom(selector.slider ,'hidden');
    };
    /**
     * @description Применяет эффект к загружаемому изображению.
     * @param {String} effectName
     */
    var setEffect = function (effectName) {
        var oldEffectName = elementImage.className.match(/effects__preview--[0-9a-zA-Z]+/) || '';
        library.removeClassFrom(selector.imagePreview.self, oldEffectName[0]);;
        library.addClassTo(selector.imagePreview.self, effectName);
    };
    /**
     * @description Обновляет форму загрузки изображения, согласно выбранному новому эффекту.
     * @param {HTMLElement} target
     */
    var applyChanges = function (target) {
        var effectName = (target.className.match(/effects__preview--[0-9a-zA-Z]+/) || '')[0];
        setEffect(effectName);
        setSlider(effectName);
        library.currentEffectName = effectName.split('--')[1]; 
    };
    /**
     * @description Удаляет предыдущие примененные стили к загружаемому изображению.
     */
    var deletePreviousStyle = function () {
        library.removeStyleFrom(selector.imagePreview.self, 'filter');
    };
    /**
     * @description Перемещает ползунок слайдера в начальное положение.
     */
    var setScalePinBasePosition = function () {
        library.addStyleTo(selector.scale.level, 'width', '100%');
        library.addStyleTo(selector.scale.pin, 'left', library.SCALE_WIDTH + 'px');
    };
    /**
     * @description Обработчик на событие "Выбран очередной эффект для изображения".
     * @param {Event} evt
     */
    var onClicked = function (evt) {
        evt.preventDefault();
        if(evt.target.classList.contains('effects__preview')) {
            applyChanges(evt.target); 
            deletePreviousStyle();  
            setScalePinBasePosition(); 
        }  
    };

    setScalePinBasePosition();
    library.addListenerTo(selector.effectsList, 'click', onClicked);
})();