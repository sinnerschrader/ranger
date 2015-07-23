import {getNumber, pauseEvent, debounce} from './utilities/utils';
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

    let sliderList            = Array.prototype.slice.call(sliderNodeList);
    //-- Debounce helpers
    let setDebouncedValue     = debounce(setValueInDom, 10);
    let setDebouncedAttr      = debounce(setAttributeInDom, 40);

    sliderList.forEach((slider, i, array) => {
        let inputEl           = slider.querySelector('.js-ranger-input');
        let trackEl           = slider.querySelector('.js-ranger-track');
        let distanceEl        = slider.querySelector('.js-ranger-distance');
        let valueEl           = slider.querySelector('.js-ranger-value');
        let indicatorEL       = slider.querySelector('.js-ranger-indicator');

        let ranger = {
            isMoving: false,
            min: getNumber(inputEl, 'data-min'),
            max: getNumber(inputEl, 'data-max'),
            value: getNumber(inputEl, 'value'),
            steps: getNumber(inputEl, 'data-step'),
            curretValue: 0,
            offset: 0,
            dimensions: trackEl.getBoundingClientRect()
        }

        let init = () => {
            let initialPosition = setInitialPosition(ranger.min, ranger.max, ranger.value)  + '%';

            distanceEl.style.width= initialPosition;

            if (indicatorEL !== null) {
                setValueInDom(valueEl, ranger.value);
                indicatorEL.style.left = initialPosition;
            }

            //-- Set the steps fractions in DOM only if required
            if (!isNaN(ranger.steps)) {
                let sliderFractionsEl = document.createElement('div');
                let fractionCount     = (ranger.max - ranger.min) / ranger.steps;
                let fractionDistance  = (100 / fractionCount);
                let i;

                sliderFractionsEl.classList.add('Slider-fractions');
                slider.appendChild(sliderFractionsEl);

                for (i = fractionCount - 1; i >= 1; i--) {
                    let fraction = document.createElement('span');

                    fraction.style.left = (fractionDistance * i) + '%';
                    sliderFractionsEl.appendChild(fraction);
                }
            }
        }
        init();

        let onMouseDown  = e => {
            pauseEvent(e);
            ranger.isMoving       = true;

            requestAnimationFrame(update);

            //-- Read only calculations responsible for the later
            //-- positioning of the slider individual components.
            ranger.offset         = e.pageX - ranger.dimensions.left;

            if (!isNaN(ranger.steps)) {
                ranger.currentPosition = handlePositionSteps(ranger.offset, ranger.dimensions.width, ranger.min, ranger.max, ranger.steps);

            } else {
                ranger.currentPosition= handlePosition(ranger.offset, ranger.dimensions.width);
            }

            ranger.currentValue    = handleValue(ranger.min, ranger.max, ranger.currentPosition);
        };


        let onMouseMove = e => {
            if (ranger.isMoving) {
                pauseEvent(e);

                requestAnimationFrame(update);

                //-- Read only calculations responsible for the later
                //-- positioning of the slider individual components.
                ranger.offset         = e.pageX - ranger.dimensions.left;

                if (!isNaN(ranger.steps)) {
                    ranger.currentPosition = handlePositionSteps(ranger.offset, ranger.dimensions.width, ranger.min, ranger.max, ranger.steps);

                } else {
                    ranger.currentPosition= handlePosition(ranger.offset, ranger.dimensions.width);
                }

                ranger.currentValue   = handleValue(ranger.min, ranger.max, ranger.currentPosition);
            }
        }

        let onMouseUp = e => {
            if (ranger.isMoving) {
                ranger.isMoving = false;
            }
        }

        //-- Write only function responsible for the updates of the
        //-- slider components
        let update = () => {
            if (ranger.isMoving) {
                requestAnimationFrame(update);

                if (!slider.classList.contains ('is-moving')) {
                    slider.classList.add ('is-moving');
                }

            } else {

                if (slider.classList.contains('is-moving')) {
                    slider.classList.remove('is-moving');
                }
            }

            distanceEl.style.width =  ranger.currentPosition + '%';
            setDebouncedAttr(inputEl, 'value', ranger.currentValue);

            if (indicatorEL !== null) {
                setDebouncedValue(valueEl, ranger.currentValue);
                indicatorEL.style.left = ranger.currentPosition + '%';
            }
        }

        slider.addEventListener('mousedown', onMouseDown);
        slider.removeEventListener('mousedown', onMouseDown, true);
        window.addEventListener('mousemove', debounce(onMouseMove, 10));
        window.removeEventListener('mousemove', onMouseMove, true);
        slider.addEventListener('mouseup', onMouseUp);
        slider.removeEventListener('mouseup', onMouseUp, true);

        console.log(ranger);

        return ranger;
    });
}
