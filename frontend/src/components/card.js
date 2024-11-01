import React from 'react';
import classNames from 'classnames';

export const Card = ({ className, ...props }) => (
  <div 
    className={classNames(
      "rounded-lg border bg-white text-slate-900 shadow-sm", 
      className
    )} 
    {...props} 
  />
);

export const CardHeader = ({ className, ...props }) => (
  <div 
    className={classNames(
      "flex flex-col space-y-1.5 p-6", 
      className
    )} 
    {...props} 
  />
);

export const CardTitle = ({ className, ...props }) => (
  <h3 
    className={classNames(
      "text-2xl font-semibold leading-none tracking-tight", 
      className
    )} 
    {...props} 
  />
);

export const CardDescription = ({ className, ...props }) => (
  <p 
    className={classNames(
      "text-sm text-slate-500", 
      className
    )} 
    {...props} 
  />
);

export const CardContent = ({ className, ...props }) => (
  <div 
    className={classNames(
      "p-6 pt-0", 
      className
    )} 
    {...props} 
  />
);

export const CardFooter = ({ className, ...props }) => (
  <div 
    className={classNames(
      "flex items-center p-6 pt-0", 
      className
    )} 
    {...props} 
  />
);
