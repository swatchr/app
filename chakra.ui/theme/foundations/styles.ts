import type { ChakraTheme } from '@chakra-ui/react';
import { type StyleFunctionProps } from '@chakra-ui/theme-tools';

export const styles: ChakraTheme['styles'] = {
  global: (props: StyleFunctionProps) => ({
    '*': {
      border: 0,
      margin: 0,
      padding: 0,
      fontFeatureSettings: 'kern',
      textRendering: 'optimizeLegibility',
      WebkitFontSmoothing: 'antialiased',
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
      whiteSpace: 'normal', // @FIXME: this maybe a hack: text was not wrapping inside divs
    },
    '*, *::before, *::after': {
      borderColor: 'rootBorder',
      boxSizing: 'border-box',
      wordWrap: 'break-word',
    },
    // '*::-webkit-scrollbar-track, *::-moz-scrollbar-track': {
    //   boxShadow: 'inset 0 0 6px var(--chakra-colors-bg1)',
    //   borderRadius: '10px',
    //   backgroundColor: 'transparent',
    // },
    // '*::-webkit-scrollbar': {
    //   width: '9px',
    // },
    // scrollbarWidth: 'thin',
    // scrollbarColor: 'var(--chakra-colors-red-200) transparent',
    // '*::-webkit-scrollbar-thumb, *::-moz-scrollbar-thumb': {
    //   borderRadius: '10px',
    //   boxShadow: 'inset 0 0 6px var(--chakra-colors-gray-300)',
    //   backgroundColor: 'var(--chakra-colors-red-200)',
    // },
    // '*::-moz-scrollbar-thumb:hover, *::-webkit-scrollbar-thumb:hover': {
    //   backgroundColor: 'var(--chakra-colors-red-300)',
    // },
    'html, body, #__next, #root': {
      '--chakra-colors-chakra-body-bg': 'var(--chakra-colors-bg)',
      '--chakra-colors-chakra-body-text': 'var(--chakra-colors-text)',
    },
    'html, body': {
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      scrollBehavior: 'smooth',
      // using % here allows users to override default size in browser settings??
      fontSize: '100%', // == 16px
      fontFamily: 'body',
      height: '100%',
      backgroundColor: '#888',
    },
    body: {
      position: 'relative',
      fontFamily: 'body',
      fontSize: '1.5rem',
      lineHeight: 2,
      textRendering: 'optimizeLegibility',
      WebkitTextSizeAdjust: 'none',
      MozFontSmoothing: 'grayscale',
      overflowX: 'auto',
      maxW: 'full',
      // backgroundColor: 'var(--chakra-colors-chakra-body-bg)',
    },
    '#__next, #root': {
      display: 'flex',
      flexDirection: 'column',
      minH: '100%',
    },
    '*::placeholder': {
      color: 'placeholder',
    },
    'input:focus': {
      border: 'inherit',
    },
    'input:focus:invalid': {
      background: 'rgba(255, 224, 224, 1)',
    },
    'input:focus, input:focus:valid': {
      background: 'rgba(226, 250, 219, 1)',
    },
    'a:active, a:focus, a:visited': {
      outline: 0,
      border: 'none',
      outlineStyle: 'none',
      textDecoration: 'none',
      boxShadow: '0 0 0 1px rgba(0, 0, 0, 0) !important',
    },
    a: {
      textDecoration: 'none',
      color: 'link',
    },
    h1: {
      textStyle: 'h1',
    },
    h2: {
      textStyle: 'h2',
    },
    h3: {
      textStyle: 'h3',
    },
    h4: {
      textStyle: 'h4',
    },
    p: {
      textStyle: 'body',
    },
    small: {
      textStyle: 'tiny',
    },
    ol: {
      listStyleType: 'none',
    },
    ul: {
      listStyleType: 'none',
    },
    '.mobile-nav-link:active, .mobile-nav-link:focused, .mobile-nav-link:visited, ':
      {
        color: 'yellow.700',
      },
    '.mobile-nav-link:hover': {
      color: 'yellow.600',
      // color: 'blue',
      textDecoration: 'none',
    },
    '.mobile-nav-link': {
      color: 'primary',
    },
  }),
};

/**
 * @TODO: implement this hack to force mobile browsers to rotate the screen
 @media screen and (min-width: 320px) and (max-width: 767px) and (orientation: portrait) {
  html {
    transform: rotate(-90deg);
    transform-origin: left top;
    width: 100vh;
    height: 100vw;
    overflow-x: hidden;
    position: absolute;
    top: 100%;
    left: 0;
  }
}
 *
*/
