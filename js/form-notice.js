'use strict';

(function (){
    var INVALID_INPUT_CLASSNAME = 'invalid-input';

    var selector = window.library.selector;
    var elementInputHashTags = document.querySelector(window.library.selector.input.hashTag);
    var elementInputDescription = document.querySelector(window.library.selector.input.description);
    var template = document.querySelector(selector.template.self);
    var templateNotice = template.content.querySelector(selector.template.errorNotice.self);

    /**
     * @description Встаривает узел ошибки валидации в дерево.
     * @param {HTMLElement} elementInput Элемент формы, которое было заполнено невалидно
     * @param {HTMLDivElement} noticeNode Узел, который добавляется в дерево
     */
    var embedNoticeElement = function (elementInput, elementNotice) {
        if(elementInput.classList[0] === 'text__hashtags') {
            var element = document.querySelector('.text__description');
            elementInput.parentElement.insertBefore(elementNotice, element);
        }
        if(elementInput.classList[0] === 'text__description') {
            elementInput.parentElement.appendChild(elementNotice);
        }
    };
    /**
     * @description Создаёт и заполняет узел ошибки валидации
     * @param {String} notice Сообщение ошибки валидации
     * @return {HTMLElement} Созданный узел
     */
    var createNoticeElement = function (notice) {
        var elementNotice = templateNotice.cloneNode(true);
        elementNotice.querySelector(window.library.selector.template.errorNotice.text);
        elementNotice.textContent = notice;
        return elementNotice;
    };

    window.formNotice = {};
    /**
     * @description Показывает сообщение пользователю, если он неверно заполнил поле ввода.
     * @param {HTMLElement} elementInput Невалидно заполненное поле ввода.
     * @param {HTMLDivElement} notice Сообщение ошибки ввода.
     */
    window.formNotice.set = function (elementInput, notice) {
        elementInput.classList.add(INVALID_INPUT_CLASSNAME);
        var elementNotice = createNoticeElement();
        elementNotice.textContent = notice;
        embedNoticeElement(elementInput, elementNotice);
    };
    /**
     * @description Удаляет сообщение об ошибки валидации, установленное ранее для переданного в функцию поля ввода.
     * @param {HTMLElement} elementInput поле ввода, у которой нужно удалить сообщение ошибки
     */
    window.formNotice.delete = function (elementInput) {
        var potentialNoticeNode = elementInput.nextElementSibling;
        if(potentialNoticeNode !== null && potentialNoticeNode.id === 'notice') {
            potentialNoticeNode.remove();
            elementInput.classList.remove(INVALID_INPUT_CLASSNAME);
        }
    };
    /**
     * @description Удаляет все узлы "ошибки валидации", которые были добавлены ранее.
     */
    window.formNotice.deleteAll = function () {
        var elementsNotices = document.querySelectorAll(window.library.selector.template.errorNotice.self);
        Array.prototype.forEach.call(elementsNotices, function (elementNotice) {
            elementNotice.remove();
        });
        library.removeClassFrom(selector.input.description, INVALID_INPUT_CLASSNAME);
        library.removeClassFrom(selector.input.hashTag, INVALID_INPUT_CLASSNAME);
    };
    /**
     * @description Обновляет узел ошибки валидации в дереве
     * @param {} element Элемент, которому соответствует узел ошибки валидации
     * @param {*} notice Сообщение ошибки валидации
     */
    window.formNotice.update = function (element, notice) {
        window.formNotice.delete(element);
        if (notice !== '') {
            window.formNotice.set(element, notice);
        }
    };
})();