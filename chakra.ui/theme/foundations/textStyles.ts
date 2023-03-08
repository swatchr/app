import type { ChakraTheme } from '@chakra-ui/react';

export const customTextStyles = {
  h1: {
    fontSize: { base: '4xl', sm: '5xl' },
    fontFamily: 'heading',
    fontWeight: 900,
    lineHeight: 'taller',
    textTransform: 'capitalize',
  },
  h2: {
    fontSize: { base: '2xl', sm: '3xl' },
    fontFamily: 'heading',
    fontWeight: 800,
    lineHeight: 'tall',
    textTransform: 'capitalize',
  },
  h3: {
    fontSize: '2xl',
    fontFamily: 'heading',
    fontWeight: 700,
    lineHeight: 'tall',
    textTransform: 'capitalize',
  },
  h4: {
    fontSize: 'xl',
    fontFamily: 'heading',
    fontWeight: 600,
    lineHeight: 'tall',
    textTransform: 'capitalize',
  },
  body: {
    fontSize: 'initial',
    fontFamily: 'body',
    fontWeight: 'normal',
    lineHeight: 'base',
  },
  description: {
    fontSize: 'lg',
    fontFamily: 'body',
    fontWeight: 'normal',
    lineHeight: 'base',
  },
  stat: {
    fontSize: 'sm',
    fontFamily: 'body',
    fontWeight: 'normal',
    lineHeight: 'small',
  },
  tiny: {
    fontSize: 'xs',
    fontFamily: 'body',
    fontWeight: 'normal',
    lineHeight: 'smaller',
  },
  title: {
    fontSize: 'xl',
    fontFamily: 'heading',
    fontWeight: 700,
    lineHeight: 1.2,
    textTransform: 'capitalize',
  },
  card: {
    title: {
      fontSize: '2xl',
      fontFamily: 'body',
      color: 'teal.400',
      textTransform: 'capitalize',
    },
    'title-sm': {
      fontSize: 'xl',
      fontFamily: 'body',
      color: 'teal.400',
      textTransform: 'capitalize',
    },
  },
  container: {
    default: {
      fontFamily: 'body',
      fontSize: 'base',
      fontWeight: 'normal',
      lineHeight: 'base',
      letterSpacing: 'normal',
      textAlign: 'left',
      textDecoration: 'none',
      textOverflow: 'none',
      textTransform: 'none',
    },
  },
  content: {
    heading: {
      basic: {
        fontFamily: 'heading',
        fontSize: '3xl',
        fontWeight: '600',
        lineHeight: 'taller',
        textTransform: 'capitalize',
        color: 'red.300',
      },
      benefits: {
        fontFamily: 'heading',
        fontSize: '3xl',
        fontWeight: '600',
        lineHeight: 'taller',
        textTransform: 'capitalize',
        color: 'primary',
      },
      disclaimer: {
        fontFamily: 'heading',
        fontSize: '3xl',
        fontWeight: '600',
        lineHeight: 'taller',
        textTransform: 'capitalize',
        color: 'accent',
      },
    },
    text: {
      basic: {
        fontFamily: 'body',
        fontSize: 'xl',
        fontWeight: 'normal',
        lineHeight: 'tall',
        color: 'gray.600',
      },
      benefits: {
        fontFamily: 'body',
        fontSize: 'xl',
        fontWeight: 'normal',
        lineHeight: 'tall',
        color: 'gray.600',
      },
      disclaimer: {
        fontFamily: 'body',
        fontSize: 'xl',
        fontWeight: 'normal',
        lineHeight: 'tall',
        color: 'gray.500',
      },
    },
  },
};

export const textStyles: ChakraTheme['textStyles'] = customTextStyles;
