import regexes from '../regexes';
const cache = new Map();

/**
 * Fixes ugly color names
 * Inspired by BTTV's colour parser, in fact used quite a bit to understand how this works.
 * None of this credit goes to me, 100% to BetterTTV and that development team, thank you!
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
  // Convert RGB to HSL, not ideal but it's faster than HCL or full YIQ conversion
  // based on http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = Math.min(Math.max(0, (max + min) / 2), 1);
  const d = Math.min(Math.max(0, max - min), 1);

  if (d === 0) {
      return [d, d, l]; // achromatic
  }

  let h;
  switch (max) {
      case r: h = Math.min(Math.max(0, (g - b) / d + (g < b ? 6 : 0)), 6); break;
      case g: h = Math.min(Math.max(0, (b - r) / d + 2), 6); break;
      case b: h = Math.min(Math.max(0, (r - g) / d + 4), 6); break;
  }
  h /= 6;

  let s = l > 0.5 ? d / (2 * (1 - l)) : d / (2 * l);
  s = Math.min(Math.max(0, s), 1);

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
  const hueToRgb = (pp, qq, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return pp + (qq - pp) * 6 * t;
    if (t < 1 / 2) return qq;
    if (t < 2 / 3) return pp + (qq - pp) * (2 / 3 - t) * 6;
    return pp;
  };

  if (s === 0) {
    const rgb = Math.round(Math.min(Math.max(0, 255 * l), 255)); // achromatic
    return [rgb, rgb, rgb];
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(Math.min(Math.max(0, 255 * hueToRgb(p, q, h + 1 / 3)), 255)),
    Math.round(Math.min(Math.max(0, 255 * hueToRgb(p, q, h)), 255)),
    Math.round(Math.min(Math.max(0, 255 * hueToRgb(p, q, h - 1 / 3)), 255))
  ];
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
    return yiq >= 128 ? 'dark' : 'light';
}

function calculateReplacementColor(color, background) {
    const light = background === 'light';
    const factor = light ? 0.1 : -0.1;

    color = color.replace(regexes.notColorGlobal, '');
    if (color.length < 6) {
        color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2];
    }

    let r = parseInt(color.substr(0, 2), 16);
    let g = parseInt(color.substr(2, 2), 16);
    let b = parseInt(color.substr(4, 2), 16);

    const hsl = rgbToHsl(r, g, b);
    let l = light ? 1 - (1 - factor) * (1 - hsl[2]) : (1 + factor) * hsl[2];
    l = Math.min(Math.max(0, l), 1);

    const rgb = hslToRgb(hsl[0], hsl[1], l);

    r = rgb[0].toString(16);
    g = rgb[1].toString(16);
    b = rgb[2].toString(16);

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
