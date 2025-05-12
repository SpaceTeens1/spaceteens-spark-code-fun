
import React, { useState, useEffect } from 'react';

interface FireworkParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
}

interface FireworksProps {
  x: number;
  y: number;
  onComplete?: () => void;
}

export const Fireworks: React.FC<FireworksProps> = ({ x, y, onComplete }) => {
  const [particles, setParticles] = useState<FireworkParticle[]>([]);
  
  useEffect(() => {
    // Create initial particles
    const initialParticles: FireworkParticle[] = [];
    const particleCount = 50;
    const colors = ['#EA5C2B', '#00A8CC', '#1A6BBD', '#FFF6F6', '#FEF7CD'];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      const size = 2 + Math.random() * 4;
      const maxLife = 40 + Math.random() * 40;
      
      initialParticles.push({
        id: i,
        x,
        y,
        color: colors[Math.floor(Math.random() * colors.length)],
        size,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed
        },
        life: 0,
        maxLife
      });
    }
    
    setParticles(initialParticles);
    
    // Animation loop
    let animationFrame: number;
    let finished = false;
    
    const animate = () => {
      setParticles(prevParticles => {
        // Update particles
        const updatedParticles = prevParticles.map(particle => ({
          ...particle,
          x: particle.x + particle.velocity.x,
          y: particle.y + particle.velocity.y,
          velocity: {
            x: particle.velocity.x * 0.98,
            y: particle.velocity.y * 0.98 + 0.05 // Add gravity
          },
          life: particle.life + 1
        })).filter(particle => particle.life < particle.maxLife);
        
        // Check if all particles are gone
        if (updatedParticles.length === 0 && !finished) {
          finished = true;
          if (onComplete) {
            onComplete();
          }
        }
        
        return updatedParticles;
      });
      
      if (!finished) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animate();
    
    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame);
      if (onComplete && !finished) {
        onComplete();
      }
    };
  }, [x, y, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => {
        const opacity = 1 - particle.life / particle.maxLife;
        
        return (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              opacity
            }}
          />
        );
      })}
    </div>
  );
};

export const useFireworks = () => {
  const [fireworks, setFireworks] = useState<{ id: number; x: number; y: number }[]>([]);
  
  const triggerFireworks = (x: number, y: number) => {
    const id = Date.now();
    setFireworks(prev => [...prev, { id, x, y }]);
  };
  
  const removeFirework = (id: number) => {
    setFireworks(prev => prev.filter(fw => fw.id !== id));
  };
  
  return {
    fireworks,
    triggerFireworks,
    removeFirework
  };
};
