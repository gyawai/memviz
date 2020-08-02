!function($) {
    "use strict";

    const ImageWidth = 512;

    $('#load-btn').on('click', function() {
        $('#load-btn-hidden').click();
    });

    $('#load-btn-hidden').change(function(event){
        let file = event.target.files[0];
        let reader = new FileReader();
        console.log('file:', file);
        show_sandclock();
        reader.readAsArrayBuffer(file);
        reader.onload = function(f){
            // let buff = new Uint8Array(f.target.result);
            let buff = Array.from(new Uint8Array(f.target.result));
            while (buff.length % (ImageWidth * 4)) { // buff length must be a multiple of 4
                buff.push(0);
            }
            paint_image(new Uint8Array(buff));
        };
    });

    function paint_image(buff) {
        let buffw = ImageWidth;
        let buffh = buff.length / buffw * 4.0 / 3.0;
        console.log('w:', buffw, ' h:', buffh);
        $('#canvas0').css('width', buffw + 'px');
        $('#canvas0').css('height', buffh / 3 + 'px');
        let img = new Image();
        let canvas = document.getElementById('canvas0');
        let ctx = canvas.getContext('2d');
/*
        let pixel = ctx.createImageData(new ImageData(Uint8ClampedArray.from(buff), buffw));
        ctx.putImageData(pixel, 0, 0);
*/
        let paint_pattern = 1;
        let pixel = ctx.createImageData(buffw, buffh);
        let w = pixel.width;
        switch (paint_pattern) {
        case 0:
            for(let i = 0; i < buff.length; i++) {
                pixel.data[i] = buff[i];
                // if (i % (512 * 1024) == 0) console.log(Math.floor(i * 100 / buff.length) + '% done')
            }
            break;
        case 1:
            let j = 0;
            for(let i = 0; i < buff.length;) {
                pixel.data[i+0] = buff[j+0];
                pixel.data[i+1] = buff[j+1];
                pixel.data[i+2] = buff[j+2];
                pixel.data[i+3] = 255;
                i += 4;
                j += 3;
            }
            break;
        default:
            // nop
        }
        ctx.putImageData(pixel, 0, 0);
        hide_sandclock();
    };

    function init_var() {
        let img = new Image();
        let canvas = document.getElementById('canvas0');
        let ctx = canvas.getContext('2d');
        let pixel = ctx.createImageData(256, 256);
        let w = pixel.width;
        for(let i = 0; i < 256; i++) {
            // if ((i / 5).toFixed(0) % 3 != 0) continue;
            for (let j = 0; j < 256; j++) {
                let xoff = Math.floor(i / 10) % 2;
                let do_dot = (Math.floor(j / 10 + xoff)) % 2;
                if (!do_dot) continue;
                let rgba = [0, 100, 256, 256];
                let idx = w * 4 * i + 4 * j;
                for (let k = 0; k < 4; k++) {
                    pixel.data[idx + k] = rgba[k];
                }
            }
        }
        ctx.putImageData(pixel, 0, 0);
        /*
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            // img.style.display = 'none';
        }
        */
    };

    let NSandClock = 0;
    function show_sandclock() {
        NSandClock += 1;
        $('#indicator').show();
    };

    function hide_sandclock() {
        NSandClock -= 1;
        if (NSandClock <= 0) {
            NSandClock = 0;
            $('#indicator').hide();
        }
    };


    $(function init() {
        // init_var();
    });
}(jQuery);
