import type { ChakraTheme } from '@chakra-ui/react';

export const tokens = {
  colors: {
    bg: {
      default: '#e6e6e6',
      _dark: '#151716', // 'gray.900',
    },
    primary: '#BADA55',
    secondary: {
      default: '#6da376',
      _dark: '#10680e',
    },
    accent: {
      default: '#ff7a7a',
      _dark: '#DDABE4',
    },
    error: {
      default: '#FF5F5F',
      _dark: '#FD2828',
    },
    warning: {
      default: '#F0DD33',
      _dark: '#F6DF08',
    },
    success: {
      default: '#7AEE9A',
      _dark: '#75E308',
    },
    gray: {
      default: '#4D4D4D',
      _dark: '#707B83',
    },
    link: {
      default: '#3499d4',
      _dark: '#1482D1',
    },
    barBg: {
      default: '#FDE4CC',
      _dark: '#2D3738',
    },
    navLink: {
      default: 'yellow.700',
      _dark: 'yellow.600',
    },
    placeholder: {
      default: 'gray.400',
      _dark: 'whiteAlpha.300',
    },
    rootBorder: {
      default: 'gray.500',
      _dark: 'gray.700',
    },
    text: {
      default: '#4e4e4e',
      _dark: 'gray.300',
    },
    textInverse: {
      default: '#212121',
      _dark: 'gray.900',
    },
  },
};

export const semanticTokens: ChakraTheme['semanticTokens'] = tokens;
