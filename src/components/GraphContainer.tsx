import React from 'react';
import { GraphContainerProps } from '../types';

const GraphContainer: React.FC<GraphContainerProps> = ({ cyRef }) => {
  return (
    <div ref={cyRef} className="w-full h-full" />
  );
};

export default GraphContainer;