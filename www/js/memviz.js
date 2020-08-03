!function($) {
    "use strict";

    const ImageWidth = 512;
    const Patern = 2;
    // pattern 0: rgba = [d0, d1, d2, d3]
    // pattern 1: rgba = [d0, d1, d2, 0xff]
    // pattern 2: rgba = [d0[7:6], d0[5:4], d0[3:2], d0[1:0]]

    $('#load-btn').on('click', function() {
        $('#load-btn-hidden').click();
    });

    $('#load-btn-hidden').change(function(event){
        let file = event.target.files[0];
        $('#fname-text').text(file.name);
        console.log('file:', file);
        let reader = new FileReader();
        show_sandclock();
        reader.readAsArrayBuffer(file);
        reader.onload = function(f){
            // let buff = new Uint8Array(f.target.result);
            let buff = Array.from(new Uint8Array(f.target.result));
            while (buff.length % (ImageWidth * 4)) { // buff length must be a multiple of 4
                buff.push(0);
            }
            paint_image(new Uint8Array(buff), Pattern);
        };
    });

    function paint_image(buff, paint_pattern) {
        let buffw = ImageWidth;
        let buffh;
        switch (paint_pattern) {
        case 0:
            buffh = buff.length / (buffw * 4);
            break;
        case 1:
            buffh = buff.length / (buffw * 3);
            break;
        case 2:
            buffh = buff.length / (buffw * 1);
            break;
        }
        // console.log('w:', buffw, ' h:', buffh);
        $('#canvas0').css('width', buffw + 'px');
        $('#canvas0').css('height', buffh + 'px');
        let img = new Image();
        let canvas = document.getElementById('canvas0');
        let ctx = canvas.getContext('2d');
        let pixel = ctx.createImageData(buffw, buffh);
        let w = pixel.width;
        switch (paint_pattern) {
        case 0:
            for(let i = 0; i < buff.length; i++) {
                pixel.data[i] = buff[i];
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
        case 2:
            for(let i = 0; i < buff.length; i++) {
                let b0 = buff[i] >> 6;
                let b1 = (buff[i] & 0x3f) >> 4;
                let b2 = (buff[i] & 0x0f) >> 2;
                let b3 = (buff[i] & 0x03);
                pixel.data[i+0] = b0 << 6;
                pixel.data[i+1] = b1 << 6;
                pixel.data[i+2] = b2 << 6;
                pixel.data[i+3] = b3 << 6;
                if (i < 20) {
                    console.log(buff[i],
                                pixel.data[i+0],
                                pixel.data[i+1],
                                pixel.data[i+2],
                                pixel.data[i+3]);
                }
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
