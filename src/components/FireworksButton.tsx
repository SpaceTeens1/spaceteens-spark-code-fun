
import React, { useState, useRef } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { Fireworks } from "@/components/Fireworks";

interface FireworksButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export const FireworksButton = React.forwardRef<HTMLButtonElement, FireworksButtonProps>(
  ({ children, onClick, className, ...props }, ref) => {
    const [fireworks, setFireworks] = useState<{ id: number; x: number; y: number }[]>([]);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX || (rect.left + rect.width / 2);
      const y = event.clientY || (rect.top + rect.height / 2);
      
      // Add new firework
      const id = Date.now();
      setFireworks(prev => [...prev, { id, x, y }]);
      
      // Call original onClick if provided
      if (onClick) {
        onClick(event);
      }
    };

    // Combine refs
    const setRefs = (element: HTMLButtonElement) => {
      buttonRef.current = element;
      
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    return (
      <>
        <Button
          ref={setRefs}
          onClick={handleClick}
          className={`group ${className}`}
          {...props}
        >
          {children}
        </Button>
        
        {fireworks.map(({ id, x, y }) => (
          <Fireworks
            key={id}
            x={x}
            y={y}
            onComplete={() => setFireworks(prev => prev.filter(fw => fw.id !== id))}
          />
        ))}
      </>
    );
  }
);

FireworksButton.displayName = "FireworksButton";
