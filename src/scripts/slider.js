import debounce from 'lodash.debounce';
import {getMin, getMax, getSteps, getValue, pauseEvent} from './utilities/utils';
import {handlePosition, handlePositionSteps} from './utilities/move';
import {handleValue, setValueInDom, setAttributeInDom} from './utilities/data';

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
    let _debouncedSetValueInDom     = debounce(setValueInDom, 20);
    let _debouncedSetAttributeInDom = debounce(setAttributeInDom, 40);

    //-- Ranger Settings
    let ranger = {
        isActive: false,
        offset: 0,
        dimensions: 0,
        clientRectLeft: 0,
        currentPosition: 0,
        currentValue: null
    }

    sliderList.forEach((slider, i, array) => {
        let inputEl           = slider.querySelector('.js-ranger-input');
        let trackEl           = slider.querySelector('.js-ranger-track');
        let distanceEl        = slider.querySelector('.js-ranger-distance');
        let valueEl           = slider.querySelector('.js-ranger-value');
        let indicatorEL       = slider.querySelector('.js-ranger-indicator');
        let minVal            = getMin(inputEl, 'data-min');
        let maxVal            = getMax(inputEl, 'data-max');
        let value             = getValue(inputEl, 'value');
        let steps             = getSteps(inputEl, 'data-step');
        ranger.dimensions     = trackEl.getBoundingClientRect();
        ranger.clientRectLeft = ranger.dimensions.left;

        let handleMouseDown  = e => {
            pauseEvent(e);
            if (!slider.classList.contains ('is-active')) {
                slider.classList.add ('is-active');
            }

            //-- Calculates and sets the new position of the slider
            ranger.offset         = e.pageX - ranger.clientRectLeft;
            ranger.isActive       = true;

            //-- Verify if the slider has steps
            //-- and set the position accordingly
            if (!isNaN(steps)) {
                ranger.currentPosition = handlePositionSteps(ranger.offset, ranger.dimensions.width, minVal, maxVal, steps);
            } else {
                ranger.currentPosition= handlePosition(ranger.offset, ranger.dimensions.width);
            }
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
                pauseEvent(e);

                //-- Calculates and sets the new position of the slider
                ranger.offset         = e.pageX - ranger.clientRectLeft;

                //-- Verify if the slider has steps
                //-- and set the position accordingly
                if (!isNaN(steps)) {
                    ranger.currentPosition = handlePositionSteps(ranger.offset, ranger.dimensions.width, minVal, maxVal, steps);
                } else {
                    ranger.currentPosition= handlePosition(ranger.offset, ranger.dimensions.width);
                }
                distanceEl.style.width =  ranger.currentPosition + '%';

                //-- Calculates and sets the value of the specific slider
                ranger.currentValue   = handleValue(minVal, maxVal, ranger.currentPosition);
                _debouncedSetAttributeInDom(inputEl, 'value', ranger.currentValue);

                if (indicatorEL !== null) {
                    _debouncedSetValueInDom(valueEl, ranger.currentValue);
                }
            }
        }

        slider.addEventListener('mousemove', debounce(handleMouseMove, 10));
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
