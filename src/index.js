
import { css } from 'styled-components';

const htmlRootFontSize = 75;

const customBreakpoints = {
    iphone5: 320,
    phone:   480,
    tablet:  768,
    desktop: 992,
    giant:   1200
};

const hedronBreakpoints = {
    sm: 500,
    md: 768,
    lg: 1100
};

const allDescendantNoPadAndMargin = `
    * {
        padding: 0;
        margin: 0;
    }
`;

const noPadAndMargin = `
    padding: 0;
    margin: 0;
`;

const regexPxStr = /^(-?[\d\.]+)(?:px)?$/i;

const getPxValue = function (value) {
    const type = typeof value;
    
    if (type === 'string') {
        const match = regexPxStr.exec(value);
        if (match)
            value = Number(match[1]);
        else
            throw "IllegalArgumentException: The format of px value is invalid.";
    }
    else if (type !== 'number')
        throw "IllegalArgumentException: The format of px value is invalid.";

    return value;
};

const pxToRem = function (value) {
    return (getPxValue(value) / htmlRootFontSize).toFixed(6) + 'rem';
};

const positions = ['top', 'left', 'right', 'bottom'];

const flexBorder = function (borderWidth, color, position = '', style = 'solid') {
    validateHexColor(color);

    if (typeof style !== 'string') {
        throw "IllegalArgumentException: style must be a String.";
    }

    return `
        border-style: ${style};
        border-color: ${color};
        ${flexBorderWidth(borderWidth, position)};
    `;
}

const flexBorderWidth = function (borderWidth, position = '') {
    borderWidth = getPxValue(borderWidth);

    if (position !== '' && positions.indexOf(position) < 0) {
        throw `IllegalArgumentException: position must be one of ${positions.join(',')}`;
    }

    const pos = position === '' ? '' : `${position}-`;
    const key = `border-${pos}width`;

    return `
        ${key}: ${borderWidth}px;
        html.hairlines & {
            ${key}: ${borderWidth / 2}px;
        }
    `;
};

const getStyleProps = function (props = {}, allowedProps = []) {
    if (!Array.isArray(allowedProps)) {
        throw "IllegalArgumentException: allowedProps must be an Array.";
    }
    if (typeof props !== 'object') {
        throw "IllegalArgumentException: props must be a plain Object.";
    }

    const obj = {};

    allowedProps.forEach((name) => {
        if (props[name]) {
            obj[name] = true;
        }
    });

    return obj;
}


const ellipsisWithWidth = function (width, isMax = false) {
    if (typeof isMax !== 'boolean') {
        throw "IllegalArgumentException: isMax must be a Boolean.";
    }

    const key = isMax ? 'max-width' : 'width';

    return `
        ${key}: ${width};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    `;
};

const regexHex = new RegExp("^\\s*#([0-9A-Fa-f]{6})\\s*$", "i");

const valueOfHex = function (colorHex) {
    var match = regexHex.exec(colorHex);
    if (match !== null) {
        match = match[1];
        try {
            return {
                r: parseInt(match.slice(0,2), 16),
                g: parseInt(match.slice(2,4), 16),
                b: parseInt(match.slice(4,6), 16),
            };
        }
        catch (ignore) { }
    }
    return null;
};

const validateHexColor = function (hexColor) {
    const rgbObj = valueOfHex(hexColor);
    if (!rgbObj) {
        throw "IllegalArgumentException: hexColor must be a valid hex format of color.";
    }

    return rgbObj;
}

const hexToRGBA = function (hexColor, opacity) {
    const rgbObj = validateHexColor(hexColor);

    const { r, g, b } = rgbObj;

    if (   typeof opacity !== 'number'
        || opacity < 0
        || opacity > 1 ) {
        throw "IllegalArgumentException: opacity must be a Number between 0 and 1.";
    }
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const mediaBreakpoints = function (breakpoints) {

    return Object.keys(breakpoints).reduce((accumulator, label) => {

        const width = breakpoints[label];

        accumulator[label] = (...args) => css`

            // Mobile first.
            @media (min-width: ${width}px) {
                ${css(...args)};
            }
        `;

        return accumulator;
    }, {});
};

const mediaHedron = mediaBreakpoints(hedronBreakpoints);
const mediaCustom = mediaBreakpoints(customBreakpoints);

export {
    ellipsisWithWidth,
    noPadAndMargin,
    allDescendantNoPadAndMargin,
    pxToRem,
    flexBorderWidth,
    flexBorder,
    validateHexColor,
    customBreakpoints,
    hedronBreakpoints,
    hexToRGBA,
    mediaHedron,
    mediaCustom,
    getStyleProps,
};
