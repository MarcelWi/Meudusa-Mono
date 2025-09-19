import React from 'react';
import * as Icons from './Icons';

type IconProps = {
  name: keyof typeof Icons;
  className?: string;
  [key: string]: any;
};

const Icon: React.FC<IconProps> = ({ name, className = "", ...props }) => {
  const IconComponent = Icons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" does not exist`);
    return null;
  }

  return <IconComponent className={className} {...props} />;
};

export default Icon;