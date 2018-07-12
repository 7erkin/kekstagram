'use strict';

(function () {
    var STEP = 25;
    var MIN = 25;
    var MAX = 100;
    var AttributeValueToOperand = {
        minus: -1,
        plus: 1
    };
    var elementImage = document.querySelector('.img-upload__preview');
    var elementResizeValue = document.querySelector('.resize__control--value');
    var changeResizeValue = function (value) {
        var nextValue = parseInt(elementResizeValue.value, 10) + value;
        if(nextValue >= 25 && nextValue <= 100) {
            elementResizeValue.value = nextValue + '%';
            elementImage.style = 'transform: scale(' + nextValue / 100 + ')';
        }
    };
    var onClicked = function (evt) {
        var addictionalValue = AttributeValueToOperand[evt.target.dataset.operand] * STEP;
        changeResizeValue(addictionalValue);
    };

    window.library.addListenerTo('.resize__control--minus', 'click', onClicked);
    window.library.addListenerTo('.resize__control--plus', 'click', onClicked);
})();