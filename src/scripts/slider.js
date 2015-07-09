import _ from 'lodash';
import {handlePosition} from './utilities/utils';
import {handleValue} from './utilities/utils';
import {setValueInDom} from './utilities/utils';
import {setAttributeInDom} from './utilities/utils';

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
    let sliderList           = Array.prototype.slice.call(sliderNodeList);

    //-- Debouece helpers
    let _debouncedSetValueInDom     = _.debounce(setValueInDom, 20);
    let _debouncedSetAttributeInDom = _.debounce(setAttributeInDom, 40);

    //-- Ranger helper to get required calculation settings
    let ranger = {
        isActive: false,
        offset: 0,
        dimensions: 0,
        clientRectLeft: 0,
        currentPosition: 0,
        currentValue: null,
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
        let inputEl           = slider.querySelector('.js-ranger-input');
        let trackEl           = slider.querySelector('.js-ranger-track');
        let distanceEl        = slider.querySelector('.js-ranger-distance');
        let valueEl           = slider.querySelector('.js-ranger-value');
        let indicatorEL       = slider.querySelector('.js-ranger-indicator');
        let minVal            = ranger.min(inputEl);
        let maxVal            = ranger.max(inputEl);
        let value             = ranger.value(inputEl);
        ranger.dimensions     = trackEl.getBoundingClientRect();
        ranger.clientRectLeft = ranger.dimensions.left;

        let handleMouseDown  = e => {
            e.preventDefault();
            if (!slider.classList.contains ('is-active')) {
                slider.classList.add ('is-active');
            }

            //-- Calculates and sets the new position of the slider
            ranger.offset         = e.pageX - ranger.clientRectLeft;
            ranger.isActive       = true;
            ranger.currentPosition= handlePosition(ranger.offset, ranger.dimensions.width);
            distanceEl.style.width=  ranger.currentPosition + '%';

            //-- Calculates and sets the value of the specific slider
            ranger.currentValue   = handleValue(minVal, maxVal, ranger.currentPosition);
            setAttributeInDom(inputEl, 'value', ranger.currentValue);

            if (indicatorEL !== null) {
                setValueInDom(valueEl, ranger.currentValue);
            }
        };

        slider.addEventListener('mousedown', handleMouseDown);
        slider.removeEventListener('mousedown', handleMouseDown, true);

        let handleMouseMove = e => {
            if (ranger.isActive) {
                e.preventDefault();
                //-- Calculates and sets the new position of the slider
                ranger.offset         = e.pageX - ranger.clientRectLeft;
                ranger.currentPosition= handlePosition(ranger.offset, ranger.dimensions.width)
                distanceEl.style.width =  ranger.currentPosition + '%';

                //-- Calculates and sets the value of the specific slider
                ranger.currentValue   = handleValue(minVal, maxVal, ranger.currentPosition);
                _debouncedSetAttributeInDom(inputEl, 'value', ranger.currentValue);

                if (indicatorEL !== null) {
                    _debouncedSetValueInDom(valueEl, ranger.currentValue);
                }
            }
        }

        slider.addEventListener('mousemove', _.debounce(handleMouseMove, 10));
        slider.removeEventListener('mousemove', handleMouseMove, true);

        let handleMouseUp = e => {
            if (ranger.isActive) {
                if (slider.classList.contains('is-active')) {
                    slider.classList.remove('is-active');
                }
                ranger.isActive = false;
            }
        }

        slider.addEventListener('mouseup', handleMouseUp);
        slider.removeEventListener('mouseup', handleMouseUp, true);

    });

    //-- $todo: the function should retun an object
    //-- with the values of slider
    return ranger;
}
