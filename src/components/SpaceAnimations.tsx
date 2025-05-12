
import React, { useState, useEffect } from 'react';
import { Rocket, Plane, Star } from 'lucide-react';

const getRandomPosition = () => {
  return {
    top: `${Math.random() * 90}%`,
    left: `${Math.random() * 90}%`,
    animationDelay: `${Math.random() * 5}s`,
    transform: `rotate(${Math.random() * 360}deg)`,
  };
};

interface FloatingElementProps {
  children: React.ReactNode;
  size?: number;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ children, size = 24 }) => {
  const [position] = useState(getRandomPosition());

  return (
    <div
      className="absolute z-10 pointer-events-none"
      style={{
        top: position.top,
        left: position.left,
        animationDelay: position.animationDelay,
        transform: position.transform,
      }}
    >
      {children}
    </div>
  );
};

export const SpaceElements = () => {
  const [elements, setElements] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    const elementsArray: React.ReactNode[] = [];
    
    // Create rockets
    for (let i = 0; i < 3; i++) {
      elementsArray.push(
        <FloatingElement key={`rocket-${i}`}>
          <Rocket 
            className="text-spaceteens-orange animate-float" 
            size={16 + Math.random() * 12}
          />
        </FloatingElement>
      );
    }
    
    // Create planets (using Plane icons styled as planets)
    for (let i = 0; i < 4; i++) {
      const colors = ['text-spaceteens-teal', 'text-spaceteens-orange', 'text-spaceteens-lightblue'];
      const colorClass = colors[Math.floor(Math.random() * colors.length)];
      
      elementsArray.push(
        <FloatingElement key={`planet-${i}`}>
          <div 
            className={`${colorClass} rounded-full animate-pulse-slow`}
            style={{ 
              width: `${20 + Math.random() * 16}px`, 
              height: `${20 + Math.random() * 16}px`,
              background: `radial-gradient(circle, currentColor 60%, transparent 70%)`,
              opacity: 0.5,
            }}
          />
        </FloatingElement>
      );
    }
    
    // Create stars
    for (let i = 0; i < 12; i++) {
      elementsArray.push(
        <FloatingElement key={`star-${i}`}>
          <Star 
            className="text-white/80 animate-pulse-slow" 
            size={4 + Math.random() * 6}
            fill="white"
          />
        </FloatingElement>
      );
    }
    
    setElements(elementsArray);
  }, []);
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {elements}
    </div>
  );
};
