import './style.css';
import './style.sass';
import $ from 'jquery'


const progress_bar = document.getElementsByClassName('progress_bar')[0] as HTMLElement;
const progress_bar_window = document.getElementsByClassName('progress_bar_window')[0] as HTMLElement;
const img_wrapper = document.getElementsByClassName('img_wrapper')[0] as HTMLElement;
const main_image = img_wrapper.getElementsByClassName('main_image')[0] as HTMLImageElement;

function min(a : number,b : number) {
    if(a>b)
        return b;
    return a;
}

function max(a : number,b : number) {
    if(a<b)
        return b;
    return a;
}

let main_image_left : number;
let min_left_progress_bar_window : number;


main_image.style.webkitFilter = 'brightness(.5)';
// const brightnessBefore = main_image.style.webkitFilter.split('(')[1].split(')')[0];
// $(".some_text").text(brightnessBefore);

function prepositioning(scaleX : number, left : number | null = null) {
    main_image_left =  (scaleX - 1) / 2 * main_image.width;

    const offsetX = Number(main_image.style.transform && main_image.style.transform.split(',')[4]);

    const leftBefore = left !== null ? max(- main_image.getBoundingClientRect().width + img_wrapper.getBoundingClientRect().width +  main_image_left,
        min(offsetX, main_image_left))
        : main_image_left;
    // main_image_left = leftBefore;

    // main_image_left =  (scaleX - 1) / 2 * main_image.width;
    // $(".some_text").text(leftBefore);


    main_image.style.transform = 'matrix(' +
        scaleX +
        ', 0, 0, 1, ' +
        leftBefore +
        ', 0)';

    const kf = img_wrapper.getBoundingClientRect().width / main_image.getBoundingClientRect().width;

    progress_bar.style.width = (img_wrapper.getBoundingClientRect().width / 2.0) + 'px';

    let progress_bar_window_before_style_width : number = parseFloat(progress_bar_window.style.width!.split('p')[0]);

    progress_bar_window.style.width = min(progress_bar.getBoundingClientRect().width, (kf * progress_bar.getBoundingClientRect().width)) + 'px';



    if(left === null){
        progress_bar_window.style.left = -1 / 4 * progress_bar.getBoundingClientRect().width +
            1 / 2 * progress_bar_window.getBoundingClientRect().width +
            progress_bar.getBoundingClientRect().left -
            8
            + 'px';

        min_left_progress_bar_window = parseFloat(progress_bar_window.style.left.substring(0, progress_bar_window.style.left.length -2));


    } else {
        if(progress_bar_window_before_style_width > parseFloat(progress_bar_window.style.width.split('p')[0])){
            progress_bar_window.style.left = parseFloat(progress_bar_window.style.left!.split('p')[0]) +
                ( + ( + progress_bar_window_before_style_width - parseFloat(progress_bar_window.style.width.split('p')[0])) / 2)
                + 'px';
        }

    }



    $(".zoom").text('zoom 1:' + scaleX.toFixed(2));
}

    function eventsListeners() {

        let previousAngle = 0;

        let beforeX : number | undefined = 0.0;

        let pointerSet = new Set();

        $("html").bind("pointerleave", function(e : JQuery.Event){
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
        $("html").on("pointerup", function(e : JQuery.Event){
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

        function pointermoveFunc(e : JQuery.Event) {

            if(pointerSet.size === 1) {
                const kf = main_image.getBoundingClientRect().width / (progress_bar.getBoundingClientRect().width);

                const main_image_transform = main_image.style.transform!.split(',');
                const speed = 48;

                if(main_image.getBoundingClientRect().width > img_wrapper.getBoundingClientRect().width){
                    if(e.clientX && beforeX && beforeX > e.clientX){
                        // $(".some_text").text(- main_image.getBoundingClientRect().width + img_wrapper.getBoundingClientRect().width +  main_image_left + ' ' +
                        //     (parseFloat(main_image_transform[4]) - speed) + ' ');

                        main_image.style.transform = main_image_transform[0] + ', ' +
                            main_image_transform[1] + ', ' +
                            main_image_transform[2] + ', ' +
                            main_image_transform[3] + ', ' +
                            max( - main_image.getBoundingClientRect().width + img_wrapper.getBoundingClientRect().width +  main_image_left,
                                (parseFloat(main_image_transform[4]) - speed)) + ', ' +
                            main_image_transform[5];

                        progress_bar_window.style.left = min(parseFloat(progress_bar_window.style.left!.substring(0, progress_bar_window.style.left!.length -2)) + speed/kf,
                            progress_bar.getBoundingClientRect().width - progress_bar_window.getBoundingClientRect().width + min_left_progress_bar_window) + 'px';

                    } else if (e.clientX && beforeX && beforeX < e.clientX){
                        // $(".some_text").text(main_image_left + ' ' +
                        //     (parseFloat(main_image_transform[4]) + speed) + ' ');

                        main_image.style.transform = main_image_transform[0] + ', ' +
                            main_image_transform[1] + ', ' +
                            main_image_transform[2] + ', ' +
                            main_image_transform[3] + ', ' +
                            min(main_image_left, (parseFloat(main_image_transform[4]) + speed)) +
                            ', ' + main_image_transform[5];


                        progress_bar_window.style.left = max(parseFloat(progress_bar_window.style.left!.substring(0, progress_bar_window.style.left!.length -2)) - speed/kf,
                            min_left_progress_bar_window) + 'px';

                    }
                }
                beforeX = e.clientX;
            }

            if(pointerSet.size === 2){
                //zoom

                const pointerArray = Array.from(pointerSet);

                const x1 : number = parseFloat(pointerArray[0].clientX);
                const y1 : number = parseFloat(pointerArray[0].clientY);
                const x2 : number = parseFloat(pointerArray[1].clientX);
                const y2 : number = parseFloat(pointerArray[1].clientY);

                const dist = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

                let x1Moved : number | undefined = parseFloat(pointerArray[0].clientX);
                let y1Moved : number | undefined = parseFloat(pointerArray[0].clientY);
                let x2Moved : number | undefined = parseFloat(pointerArray[1].clientX);
                let y2Moved : number | undefined = parseFloat(pointerArray[1].clientY);


                if(e.pointerId === pointerArray[0].pointerId){
                    x1Moved = e.clientX;
                    y1Moved = e.clientY;
                } else {
                    x2Moved = e.clientX;
                    y2Moved = e.clientY;
                }

                const distMoved = x1Moved && x2Moved && y1Moved && y2Moved &&
                                     Math.sqrt(Math.pow(x1Moved - x2Moved, 2) + Math.pow(y1Moved - y2Moved, 2));


                const distDiff = distMoved &&  dist - distMoved;

                if(distDiff && distDiff > 0) {
                    const main_image_array =  main_image.style.transform!.split(',');

                    const scaleXnew = max(1, parseFloat(main_image_array[0].split('(')[1]) - 0.01);
                    if(scaleXnew !== parseFloat(main_image_array[0].split('(')[1]))
                        prepositioning(scaleXnew, 1);

                } else {
                    const main_image_array =  main_image.style.transform!.split(',');

                    const scaleXnew = min(4, parseFloat(main_image_array[0].split('(')[1]) + 0.01);
                    if(scaleXnew !== parseFloat(main_image_array[0].split('(')[1]))
                        prepositioning(scaleXnew, 1);

                }

                //brightness 2


                const angleBefore = Math.atan2(y1-y2, x1-x2) / Math.PI * 180;
                let angleAfter = x1Moved && x2Moved && y1Moved && y2Moved && 
                                    Math.atan2(y1Moved-y2Moved, x1Moved-x2Moved) / Math.PI * 180 - angleBefore;
                if(angleAfter && angleAfter < 0) angleAfter = 360 + angleAfter;

                const brightnessBefore = parseFloat(main_image.style.webkitFilter!.split('(')[1].split(')')[0]);
                //$(".some_text").text(brightnessBefore);


                if(angleAfter && previousAngle - angleAfter < - .5){
                    // $(".some_text").text(previousAngle + ' ' + angleAfter);

                    // $(".some_text").text(previousAngle + ' ' + angleAfter);
                    main_image.style.webkitFilter = 'brightness(' +
                        min(1, brightnessBefore + 1 / 180)+
                        ')';
                    previousAngle = angleAfter;

                    $(".brightness").text("brightness: " + (min(1, brightnessBefore + 1 / 180) * 100).toFixed(0) + "%")
                } else if (angleAfter && previousAngle - angleAfter > .5) {
                    // $(".some_text").text(previousAngle + ' ' + angleAfter);
                    main_image.style.webkitFilter = 'brightness(' +
                        min(1, brightnessBefore - 1 / 180)+
                        ')';
                    previousAngle = angleAfter;

                    $(".brightness").text("brightness: " + (max(0, brightnessBefore - 1 / 180) * 100).toFixed(0) + "%")
                }

            }
        }

        function pointerdownFunc(e : JQuery.Event) {

            e.preventDefault();

            pointerSet.add(e);

            // $(".some_text").text(pointerSet.size);

            // beforeX = e.clientX;

            $("html").on("pointermove", pointermoveFunc);
        }

    $(".img_wrapper").on("pointerdown", pointerdownFunc);

}


prepositioning(4);
eventsListeners();