import regexes from '../regexes';
const cache = new Map();

/**
 * Fixes ugly color names
 * Inspired by BTTV's colour parser, in fact used quite a bit to understand how this works.
 * Color conversion algorithms from here: https://gist.github.com/mjackson/5311256
 * BTTV algorithm: https://github.com/night/BetterTTV/blob/8d5dda3951ae96fc9a97d25a8b5ca70432ae4ce6/src/utils/colors.js
 */

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }

    return [h, s, l];
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l) {
    var r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}  

// Borrowed from BTTV
function calculateColorBackground(color) {
    // Converts HEX to YIQ to judge what color background the color would look best on
    color = color.replace(regexes.notColorGlobal, '');
    if (color.length < 6) {
        color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }

    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    console.log()
    return yiq >= 128 ? 'dark' : 'light';
}

function calculateReplacementColor(color, background) {
    color = color.replace(regexes.notColorGlobal, '');
    if (color.length < 6) {
        color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }

    let r = parseInt(color.substr(0, 2), 16);
    let g = parseInt(color.substr(2, 2), 16);
    let b = parseInt(color.substr(4, 2), 16);

    const hsl = rgbToHsl(r, g, b);
    let l = 1 - (1 - 0.1) * (1 - hsl[2]);
    l = Math.min(Math.max(0, l), 1);

    [r, g, b] = hslToRgb(hsl[0], hsl[1], l);

    r = r.toString(16);
    g = r.toString(16);
    b = b.toString(16);

    r = ('00' + r).substr(r.length);
    g = ('00' + g).substr(g.length);
    b = ('00' + b).substr(b.length);

    return `#${r}${g}${b}`;
}

function colorFix(color) {
    if (cache.has(color)) {
        return cache.get(color);
    }

    const isColor = regexes.color.test(color);
    if (!isColor) {
        return color;
    }

    for (let i = 0; i < 20; i++) {
        const bgColor = calculateColorBackground(color);
        if (bgColor === 'dark') {
            break;
        }
        color = calculateReplacementColor(color, bgColor);
    }
    // if (bgColor !== 'dark') {
    //     color = calculateReplacementColor(color, bgColor);
    // }

    
    cache.set(color, color);

    if (cache.size > 1000) { // Welp that's how I wasted a ton of mem.
        cache.delete(cache.entries().next().value[0]);
    }
    return color;
}

module.exports = colorFix;