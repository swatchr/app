import {
  AspectRatio,
  Box,
  Card,
  CardBody,
  chakra,
  Container,
  Flex,
  Heading,
  shouldForwardProp,
  Square,
  Text,
  type ButtonProps,
} from '@chakra-ui/react';
import {
  AnimateSharedLayout,
  isValidMotionProp,
  LayoutGroup,
  motion,
  type MotionProps,
} from 'framer-motion';

import type {
  AspectRatioProps,
  BoxProps,
  CardBodyProps,
  CardProps,
  CenterProps,
  ContainerProps,
  FlexProps,
  HeadingProps,
  SquareProps,
  TextProps,
} from '@chakra-ui/react';

export const MotionContainer = motion<ContainerProps>(Container);
export const MotionFlex = motion<FlexProps>(Flex);
export const MotionSquare = motion<SquareProps>(Square);
export const MotionRatio = motion<AspectRatioProps>(AspectRatio);
export const MotionCardBody = motion<CardBodyProps>(CardBody);
export const MotionCard = motion<CardProps>(Card);
export const MotionText = motion<TextProps>(Text);
// export const MotionHeading = motion<HeadingProps>(Heading);

export const ChAnimateSharedLayout = chakra(AnimateSharedLayout);
export const ChLayoutGroup = chakra(LayoutGroup);

type MotionBoxProps = MotionProps & BoxProps;
type MotionCenterProps = MotionProps & CenterProps;
type MotionCenterButtonProps = MotionProps & CenterProps & ButtonProps;

export const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    prop !== 'transition' && prop !== 'transformTemplate',
}) as React.FC<MotionBoxProps>;

export const MotionBox2 = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
}) as React.FC<MotionBoxProps>;

export const MotionP = chakra(motion.p, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
}) as React.FC<MotionProps & TextProps>;

export const MotionHeading = chakra(motion.h1, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
}) as React.FC<MotionProps & HeadingProps>;

export const MotionCenterButton = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    prop !== 'transition' && prop !== 'transformTemplate',
}) as React.FC<MotionCenterButtonProps>;

export const MotionCenter = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    prop !== 'transition' && prop !== 'transformTemplate',
}) as React.FC<MotionCenterProps>;
