import {handlePosition} from './utilities/movement';

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


    //-- Ranger helper to get required calculation settings
    let ranger = {
        isActive: false,
        offset: 0,
        dimensions: 0,
        clientRectLeft: 0,
        min(node) {
            console.log(this);
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
        let inputEl    = slider.querySelector('.js-ranger-input');
        let trackEl    = slider.querySelector('.js-ranger-track');
        let distanceEl = slider.querySelector('.js-ranger-distance');
        let minVal     = ranger.min(inputEl);
        let maxVal     = ranger.max(inputEl);
        // let value      = ranger.value(inputEl);

        slider.addEventListener('mousedown', e => {
            e.preventDefault();

            ranger.isActive       = true;
            ranger.dimensions     = trackEl.getBoundingClientRect();
            ranger.clientRectLeft = ranger.dimensions.left;
            ranger.offset         = e.pageX - ranger.clientRectLeft;

            if (!slider.classList.contains('is-active')) {
                slider.classList.add('is-active');
            }

            distanceEl.style.width =  handlePosition(ranger.offset, ranger.dimensions.width) + '%';

        });

        console.log(ranger.offset);

        slider.addEventListener('mousemove', e => {
            if (ranger.isActive) {
                e.preventDefault();
                ranger.dimensions     = trackEl.getBoundingClientRect();
                ranger.clientRectLeft = ranger.dimensions.left;
                ranger.offset         = e.pageX - ranger.clientRectLeft;
                distanceEl.style.width =  handlePosition(ranger.offset, ranger.dimensions.width) + '%';
                console.log(distanceEl.style.width);
            }
        });

        slider.addEventListener('mouseup', e => {
            if (ranger.isActive) {
                if (slider.classList.contains('is-active')) {
                    slider.classList.remove('is-active');
                }
                ranger.isActive = false;
            }

        });
    });

    //-- $todo: the function should retun an object
    //-- with the values of slider
    return ranger;
}
