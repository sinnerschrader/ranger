import {getMin, getMax, getSteps, getValue, pauseEvent, debounce} from './utilities/utils';
import {handlePosition, handlePositionSteps, setInitialPosition} from './utilities/move';
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

    //-- Debounce helpers
    let setDebouncedValue           = debounce(setValueInDom, 20);
    let setDebouncedAttr            = debounce(setAttributeInDom, 40);

    sliderList.forEach((slider, i, array) => {

        let inputEl           = slider.querySelector('.js-ranger-input');
        let trackEl           = slider.querySelector('.js-ranger-track');
        let distanceEl        = slider.querySelector('.js-ranger-distance');
        let valueEl           = slider.querySelector('.js-ranger-value');
        let indicatorEL       = slider.querySelector('.js-ranger-indicator');

        //-- Ranger Settings
        let ranger = {
            isActive: false,
            min: getMin(inputEl, 'data-min'),
            max: getMax(inputEl, 'data-max'),
            value: getValue(inputEl, 'value'),
            steps: getSteps(inputEl, 'data-step'),
            dimensions: trackEl.getBoundingClientRect(),
            offset: 0,
            curretValue: 0
        }

        //-- Initialize the slider
        let init = () => {

            if (indicatorEL !== null) {
                setValueInDom(valueEl, ranger.value);
                indicatorEL.style.left = setInitialPosition(ranger.min, ranger.max, ranger.value)  + '%';
            }

            distanceEl.style.width= setInitialPosition(ranger.min, ranger.max, ranger.value)  + '%';
        }

        init();

        let handleMouseDown  = e => {

            pauseEvent(e);
            if (!slider.classList.contains ('is-active')) {
                slider.classList.add ('is-active');
            }

            //-- Calculates and sets the new position of the slider
            ranger.offset         = e.pageX - ranger.dimensions.left;
            ranger.isActive       = true;

            //-- Verify if the slider has steps
            //-- and set the position accordingly
            if (!isNaN(ranger.steps)) {

                ranger.currentPosition = handlePositionSteps(ranger.offset, ranger.dimensions.width, ranger.min, ranger.max, ranger.steps);

            } else {

                ranger.currentPosition= handlePosition(ranger.offset, ranger.dimensions.width);
            }

            distanceEl.style.width=  ranger.currentPosition + '%';

            //-- Calculates and sets the value of the specific slider
            ranger.currentValue   = handleValue(ranger.min, ranger.max, ranger.currentPosition);
            setAttributeInDom(inputEl, 'value', ranger.currentValue);

            if (indicatorEL !== null) {
                setValueInDom(valueEl, ranger.currentValue);
                indicatorEL.style.left = ranger.currentPosition + '%';
            }
        };

        slider.addEventListener('mousedown', handleMouseDown);
        slider.removeEventListener('mousedown', handleMouseDown, true);

        let handleMouseMove = e => {
            if (ranger.isActive) {
                pauseEvent(e);

                //-- Calculates and sets the new position of the slider
                ranger.offset         = e.pageX - ranger.dimensions.left;

                if (!isNaN(ranger.steps)) {

                    ranger.currentPosition = handlePositionSteps(ranger.offset, ranger.dimensions.width, ranger.min, ranger.max, ranger.steps);

                } else {

                    ranger.currentPosition= handlePosition(ranger.offset, ranger.dimensions.width);
                }
                distanceEl.style.width =  ranger.currentPosition + '%';

                //-- Calculates and sets the value of the specific slider
                ranger.currentValue   = handleValue(ranger.min, ranger.max, ranger.currentPosition);
                setDebouncedAttr(inputEl, 'value', ranger.currentValue);

                if (indicatorEL !== null) {
                    setDebouncedValue(valueEl, ranger.currentValue);
                    indicatorEL.style.left = ranger.currentPosition + '%';
                }
            }

            return;
        }

        window.addEventListener('mousemove', debounce(handleMouseMove, 10));
        window.removeEventListener('mousemove', handleMouseMove, true);

        let handleMouseUp = e => {

            if (ranger.isActive) {

                if (slider.classList.contains('is-active')) {
                    slider.classList.remove('is-active');
                }

                ranger.isActive = false;
            }

            return;
        }

        slider.addEventListener('mouseup', handleMouseUp);
        slider.removeEventListener('mouseup', handleMouseUp, true);

        console.log(ranger);

        return ranger;
    });
}
