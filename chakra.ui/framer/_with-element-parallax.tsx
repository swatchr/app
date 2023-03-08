// @link: https://blog.gilesperry.info/advanced-scroll-effects-in-framer

import { useScroll, useTransform } from 'framer-motion';
import { createRef } from 'react';

import type { ComponentType, FC } from 'react';

// create a ref so we can attach it to the scroll container
const ref = createRef<HTMLDivElement>();

// apply this to the element being scrolled
export function withScrollRef(Component: FC): ComponentType {
  // eslint-disable-next-line react/display-name
  return (props: any) => {
    return <Component {...props} ref={ref} />;
  };
}

// apply this to the element with the scroll effect
export function withElementParallax(Component: FC): ComponentType {
  const speed = 1 / 2;
  // eslint-disable-next-line react/display-name
  return (props: any) => {
    const { scrollY } = useScroll({
      container: ref,
    });
    const x = useTransform(scrollY, (value) => -value * speed); // scrolling down translates left
    return <Component {...props} style={{ ...props.style, x: x }} />;
  };
}
