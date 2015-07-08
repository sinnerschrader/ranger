import handlePosition from './utilities/movement';

export default function() {
    let sliderNodeList      = document.getElementsByClassName('js-ranger');
    let sliderInputNodeList = document.getElementsByClassName('js-ranger-input');
    let sliderTrackNodeList = document.getElementsByClassName('js-ranger-track');

    //-- Prevent the script to be excecuted if the required DOM
    //-- Implementation is wrong
    if (sliderNodeList.length <= 0
        || sliderInputNodeList.length < sliderNodeList.length
        || sliderTrackNodeList.length < sliderNodeList.length) {
        return;
    }

    let sliderList      = Array.prototype.slice.call(sliderNodeList);
    let isActive        = false;
    let offset          = 0;

    let ranger = {
        min(node) {
            return parseInt(node.getAttribute('data-min'), 10);
        },
        max(node) {
            return parseInt(node.getAttribute('data-max'), 10);
        },
        steps(node) {
            return parseInt(node.getAttribute('data-steps'), 10);
        },
        value(node) {
            return parseInt(node.getAttribute('value'), 10);
        },
        //-- Prevent text selection while dragging
        pauseEvent(e) {
            if (e.stopPropagation) {
                 e.stopPropagation();
            }
            if (e.preventDefault) {
                 e.preventDefault();
            }

            e.cancelBubble = true;
            e.returnValue = false;

            return false;
        },
        stopPropagation(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            e.cancelBubble = true;
        }
    }

    sliderList.forEach((slider, i, array) => {
        let inputEl = slider.querySelector('.js-ranger-input');
        let minVal  = ranger.min(inputEl);
        let maxVal  = ranger.max(inputEl);
        let value   = ranger.value(inputEl);

        slider.addEventListener('mousedown', e => {
            e.preventDefault();
            console.log(inputEl, minVal, maxVal, value);
        });

        slider.addEventListener('mousemove', e => {
            e.preventDefault();
        });

        slider.addEventListener('mouseup', e => {
            e.preventDefault();

        });
    });

    //-- $todo: the function should retun an object
    //-- with the values of slider
    return 2;
}
