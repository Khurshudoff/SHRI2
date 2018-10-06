import _ from 'lodash';
import './style.css';
import './style.sass';
import $ from 'jquery/dist/jquery'


const progress_bar = document.getElementsByClassName('progress_bar')[0];
const progress_bar_window = document.getElementsByClassName('progress_bar_window')[0];
const img_wrapper = document.getElementsByClassName('img_wrapper')[0];
const main_image = img_wrapper.getElementsByClassName('main_image')[0];

function min(a,b) {
    if(a>b)
        return b;
    return a;
}

function max(a,b) {
    if(a<b)
        return b;
    return a;
}

let main_image_left;
let min_left_progress_bar_window;

main_image.style.webkitFilter = 'brightness(.5)';
// const brightnessBefore = main_image.style.webkitFilter.split('(')[1].split(')')[0];
// $(".some_text").text(brightnessBefore);

function prepositioning(scaleX) {
    main_image_left =  (scaleX - 1) / 2 * main_image.width;
    main_image.style.transform = 'matrix(' +
        scaleX +
        ', 0, 0, 1, ' +
        main_image_left +
        ', 0)';

    const kf = img_wrapper.getBoundingClientRect().width / main_image.getBoundingClientRect().width;

    progress_bar.style.width = (img_wrapper.getBoundingClientRect().width / 2.0) + 'px';

    progress_bar_window.style.width = min(progress_bar.getBoundingClientRect().width, (kf * progress_bar.getBoundingClientRect().width)) + 'px';
    progress_bar_window.style.left = -1 / 4 * progress_bar.getBoundingClientRect().width +
        1 / 2 * progress_bar_window.getBoundingClientRect().width +
        progress_bar.getBoundingClientRect().left -
        8
        + 'px';

    min_left_progress_bar_window = parseFloat(progress_bar_window.style.left.substring(0, progress_bar_window.style.left.length -2));

    $(".zoom").text('zoom 1:' + scaleX.toFixed(2));
}



    function eventsListeners() {

        let previousAngle = 0;


        let beforeX = 0.0;

        let pointerSet = new Set([]);

        $("html").on("pointerleave", function(e){
            const pointerArray = Array.from(pointerSet);
            if(pointerArray.length !== 0){
                if(pointerArray[0].pointerId === e.pointerId){
                    pointerSet.delete(pointerArray[0])
                } else {
                    pointerSet.delete(pointerArray[1])
                }
            }
            $("html").off("pointermove", pointermoveFunc);
        });

        function pointermoveFunc(e) {

            if(pointerSet.size === 1) {
                const kf = main_image.getBoundingClientRect().width / (progress_bar.getBoundingClientRect().width);

                const main_image_transform = main_image.style.transform.split(',');
                const speed = 48;

                if(main_image.getBoundingClientRect().width > img_wrapper.getBoundingClientRect().width){
                    if(beforeX > e.clientX){
                        main_image.style.transform = main_image_transform[0] + ', ' +
                            main_image_transform[1] + ', ' +
                            main_image_transform[2] + ', ' +
                            main_image_transform[3] + ', ' +
                            max( - main_image.getBoundingClientRect().width + img_wrapper.getBoundingClientRect().width +  main_image_left,
                                (parseFloat(main_image_transform[4]) - speed)) + ', ' +
                            main_image_transform[5];

                        progress_bar_window.style.left = min(parseFloat(progress_bar_window.style.left.substring(0, progress_bar_window.style.left.length -2)) + speed/kf,
                            progress_bar.getBoundingClientRect().width - progress_bar_window.getBoundingClientRect().width + min_left_progress_bar_window) + 'px';

                    } else if (beforeX < e.clientX){
                        main_image.style.transform = main_image_transform[0] + ', ' +
                            main_image_transform[1] + ', ' +
                            main_image_transform[2] + ', ' +
                            main_image_transform[3] + ', ' +
                            min(main_image_left, (parseFloat(main_image_transform[4]) + speed)) +
                            ', ' + main_image_transform[5];


                        progress_bar_window.style.left = max(parseFloat(progress_bar_window.style.left.substring(0, progress_bar_window.style.left.length -2)) - speed/kf,
                            min_left_progress_bar_window) + 'px';

                    }
                }
                beforeX = e.clientX;
            }

            if(pointerSet.size === 2){
                //zoom

                const pointerArray = Array.from(pointerSet);

                const x1 = parseFloat(pointerArray[0].clientX);
                const y1 = parseFloat(pointerArray[0].clientY);
                const x2 = parseFloat(pointerArray[1].clientX);
                const y2 = parseFloat(pointerArray[1].clientY);

                const dist = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

                let x1Moved = parseFloat(pointerArray[0].clientX);
                let y1Moved = parseFloat(pointerArray[0].clientY);
                let x2Moved = parseFloat(pointerArray[1].clientX);
                let y2Moved = parseFloat(pointerArray[1].clientY);


                if(e.pointerId === pointerArray[0].pointerId){
                    x1Moved = parseFloat(e.clientX);
                    y1Moved = parseFloat(e.clientY);
                } else {
                    x2Moved = parseFloat(e.clientX);
                    y2Moved = parseFloat(e.clientY);
                }

                const distMoved = Math.sqrt(Math.pow(x1Moved - x2Moved, 2) + Math.pow(y1Moved - y2Moved, 2));


                const distDiff = dist - distMoved;

                if(distDiff > 0) {
                    const main_image_array =  main_image.style.transform.split(',');

                    const scaleXnew = max(1, parseFloat(main_image_array[0].split('(')[1]) - 0.01);
                    if(scaleXnew !== parseFloat(main_image_array[0].split('(')[1]))
                        prepositioning(scaleXnew);

                } else {
                    const main_image_array =  main_image.style.transform.split(',');

                    const scaleXnew = min(4, parseFloat(main_image_array[0].split('(')[1]) + 0.01);
                    if(scaleXnew !== parseFloat(main_image_array[0].split('(')[1]))
                        prepositioning(scaleXnew);

                }


                const angleBefore = Math.atan2(y1-y2, x1-x2) / Math.PI * 180;
                let angleAfter = Math.atan2(y1Moved-y2Moved, x1Moved-x2Moved) / Math.PI * 180 - angleBefore;
                if(angleAfter < 0) angleAfter = 360 + angleAfter;
                // $(".some_text").text(angleAfter);

                const brightnessBefore = parseFloat(main_image.style.webkitFilter.split('(')[1].split(')')[0]);
                //$(".some_text").text(brightnessBefore);

                if(previousAngle < angleAfter){
                    // $(".some_text").text(previousAngle + ' ' + angleAfter);
                    main_image.style.webkitFilter = 'brightness(' +
                        min(1, brightnessBefore + 1 / 180)+
                        ')';
                    previousAngle = angleAfter;

                    $(".brightness").text("brightness: " + (min(1, brightnessBefore + 1 / 180) * 100).toFixed(0) + "%")
                } else if (previousAngle > angleAfter) {
                    // $(".some_text").text(previousAngle + ' ' + angleAfter);
                    main_image.style.webkitFilter = 'brightness(' +
                        min(1, brightnessBefore - 1 / 180)+
                        ')';
                    previousAngle = angleAfter;

                    $(".brightness").text("brightness: " + (min(1, brightnessBefore - 1 / 180) * 100).toFixed(0) + "%")
                }


                //brightness 2
            }
        }

        function pointerdownFunc(e) {

            e.preventDefault();

            pointerSet.add(e);

            // $(".some_text").text(pointerSet.size);

            beforeX = e.clientX;

            $("html").on("pointermove", pointermoveFunc);
        }


    $(".img_wrapper").on("pointerdown", pointerdownFunc);

}


prepositioning(4);
eventsListeners();