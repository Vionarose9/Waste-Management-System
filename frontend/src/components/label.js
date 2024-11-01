import React from 'react';
import classNames from 'classnames';

export const Label = ({ className, ...props }) => (
  <label
    className={classNames(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
);
