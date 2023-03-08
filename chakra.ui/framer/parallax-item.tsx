// @link: https://medium.com/workbench/floating-parallax-images-with-react-and-framer-motion-2f3703a8a070
import { chakra } from '@chakra-ui/react';
import { useScroll, useSpring, useTransform } from 'framer-motion';
import React, { useLayoutEffect, useRef, useState } from 'react';

import type { FC, ReactNode } from 'react';

import { MotionBox } from './motion';

const calculateMinHeight = (height: number, range: number) => {
  return height + height * range;
};

const rand = (min = 0, max = 100) => {
  return Math.floor(Math.random() * (+max - +min)) + +min;
};

export const ParallaxItem: FC<{ children: ReactNode }> = ({ children }) => {
  const range = 0.2;
  const { scrollY } = useScroll();
  const ref = useRef<HTMLDivElement | null>(null);
  const [offsetTop, setOffsetTop] = useState(0);
  const [minHeight, setMinHeight] = useState<number | 'auto' | undefined>(
    'auto'
  );
  const springConfig = {
    damping: 100,
    stiffness: 200,
    mass: rand(1, 3),
  };

  useLayoutEffect(() => {
    if (!ref.current) return;
    const onResize = () => {
      if (!ref.current) return;
      setOffsetTop(Number(ref.current.offsetTop));
      setMinHeight(calculateMinHeight(ref.current.offsetHeight, range));
    };

    onResize();
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, [ref]);

  const y = useSpring(
    useTransform(
      scrollY,
      [offsetTop - 500, offsetTop + 500],
      ['0%', `${range * 100}%`]
    ),
    springConfig
  );

  return (
    <chakra.div minH={minHeight}>
      {/* <MotionBox ref={ref} initial={{ y: 0 }} style={{ y }}>
        {children}
      </MotionBox> */}
    </chakra.div>
  );
};
