import { keyframes, usePrefersReducedMotion } from '@chakra-ui/react';

type CSSAnimation = {
  keyframes: string;
  animation: string;
};

export type CSSAnim = Record<string, CSSAnimation>;

export type UseCssAnimationesult = string | undefined;

export const cssAnimations: CSSAnim = {
  'slide-in-top': {
    keyframes: keyframes`from {transform: translateY(100);}
    to {transform: translateY(-100px);}`,
    animation: '0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
  },
  'slide-in-bottom': {
    keyframes: keyframes`from {transform: translateY(-100);}
    to {transform: translateY(100px);}`,
    animation: '0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
  },
};

export const animateCSS: (
  prefersMotion: boolean,
  anim: string
) => string | undefined = (prefersMotion = false, anim = 'slide-in-top') => {
  const animation = cssAnimations[anim] as CSSAnimation;

  return prefersMotion && !!animation
    ? undefined
    : `${animation.keyframes && animation.keyframes} ${
        animation?.animation && animation?.animation
      }`;
};

export function useCssAnimation(key = 'slideInTop') {
  const prefersReducedMotion = usePrefersReducedMotion();

  const animation = animateCSS(prefersReducedMotion, key);
  return animation as UseCssAnimationesult;
}
