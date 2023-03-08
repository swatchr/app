import React from 'react';

const colors = [
  'red.500',
  'blue.500',
  'green.500',
  'brown',
  'purple.500',
  'pink',
  'orange.500',
  'black',
  'gray.500',
];

export const Debugger = ({ children }: { children: React.ReactNode }) => {
  const kids = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<any>, {
        ...child.props,
        outline: '1px solid',
        outlineColor: colors[Math.floor(Math.random() * colors.length)],
        margin: 0.5,
      });
    }
  });
  return <>{kids}</>;
};
