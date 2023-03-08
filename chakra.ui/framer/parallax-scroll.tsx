import { useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { createRef } from 'react';
import { MotionBox } from './motion';

import type { FC, ReactNode } from 'react';

const ref = createRef<HTMLDivElement>();

export const HorizontalParallax: FC<{
  speed?: number;
  children: ReactNode;
}> = ({ speed = 1 / 2, children, ...props }) => {
  const prefersReducedMotion = useReducedMotion();

  const { scrollY } = useScroll({
    container: ref,
  });

  // const y = useTransform(scrollY, (value) => -value * speed);
  const x = useTransform(scrollY, (value) => (value * speed) / 2);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    //  @FIXME: type issueF
    <>
      {/* <MotionBox style={{ x }} ref={ref} {...props}>
        {children}
      </MotionBox> */}
    </>
  );
};
