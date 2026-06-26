import React, { useEffect, useRef } from 'react';

export const InteractiveBackground: React.FC = React.memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Grid configuration
    const spacing = 75; // px between grid intersections
    const nodes: Array<{
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      phase: number;
      speed: number;
      offsetRange: number;
    }> = [];

    // Initialize nodes in a grid pattern
    const cols = Math.ceil(width / spacing) + 2;
    const rows = Math.ceil(height / spacing) + 2;

    for (let c = -1; c < cols; c++) {
      for (let r = -1; r < rows; r++) {
        const baseX = c * spacing;
        const baseY = r * spacing;
        nodes.push({
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          phase: Math.random() * Math.PI * 2,
          speed: 0.005 + Math.random() * 0.008,
          offsetRange: 6 + Math.random() * 8,
        });
      }
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation (spring effect)
      const mouse = mouseRef.current;
      if (mouse.targetX === -1000) {
        mouse.x += (-1000 - mouse.x) * 0.1;
        mouse.y += (-1000 - mouse.y) * 0.1;
      } else {
        mouse.x += (mouse.targetX - mouse.x) * 0.15;
        mouse.y += (mouse.targetY - mouse.y) * 0.15;
      }

      // 1. Update Node Positions with organic floating
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.phase += node.speed;
        
        // Base floating
        let targetX = node.baseX + Math.sin(node.phase) * node.offsetRange;
        let targetY = node.baseY + Math.cos(node.phase * 0.8) * node.offsetRange;

        // Cursor attraction/repulsion
        const dx = mouse.x - node.baseX;
        const dy = mouse.y - node.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 220) {
          const force = (1 - dist / 220) * 22; // push factor
          const angle = Math.atan2(dy, dx);
          // Push away slightly
          targetX -= Math.cos(angle) * force;
          targetY -= Math.sin(angle) * force;
        }

        // Smooth position updates
        node.x += (targetX - node.x) * 0.1;
        node.y += (targetY - node.y) * 0.1;
      }

      // 2. Draw Connections
      ctx.lineWidth = 0.55;
      const maxDistance = spacing * 1.4;

      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        
        // Proximity to mouse
        const dxMouse = mouse.x - nodeA.x;
        const dyMouse = mouse.y - nodeA.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        const nearMouse = distMouse < 220;
        const mouseIntensity = nearMouse ? (1 - distMouse / 220) : 0;

        // Search in a local box to keep it O(N) rather than O(N^2)
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          
          // Check spatial proximity
          const dx = nodeB.x - nodeA.x;
          if (Math.abs(dx) > maxDistance) continue;
          
          const dy = nodeB.y - nodeA.y;
          if (Math.abs(dy) > maxDistance) continue;

          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            const alphaFactor = 1 - dist / maxDistance;
            
            // Base connection opacity
            let alpha = alphaFactor * 0.055;
            let strokeColor = '80, 70, 140'; // Deep violet

            // Proximity to cursor illuminates connection
            if (nearMouse) {
              const dxBMouse = mouse.x - nodeB.x;
              const dyBMouse = mouse.y - nodeB.y;
              const distBMouse = Math.sqrt(dxBMouse * dxBMouse + dyBMouse * dyBMouse);
              
              if (distBMouse < 220) {
                const combinedIntensity = (mouseIntensity + (1 - distBMouse / 220)) * 0.5;
                alpha += combinedIntensity * 0.28;
                // Transition color to cyan-purple
                strokeColor = combinedIntensity > 0.6 ? '6, 182, 212' : '139, 92, 246';
              }
            }

            ctx.strokeStyle = `rgba(${strokeColor}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        const dxMouse = mouse.x - node.x;
        const dyMouse = mouse.y - node.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        const nearMouse = distMouse < 220;
        const mouseIntensity = nearMouse ? (1 - distMouse / 220) : 0;

        let radius = 1;
        let color = 'rgba(255, 255, 255, 0.12)';

        if (nearMouse) {
          radius = 1.2 + mouseIntensity * 2.8;
          color = `rgba(139, 92, 246, ${0.12 + mouseIntensity * 0.8})`;
          
          // Outer pulse ring for highlight nodes
          if (mouseIntensity > 0.7 && i % 8 === 0) {
            ctx.strokeStyle = `rgba(6, 182, 212, ${(mouseIntensity - 0.7) * 0.4})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.arc(node.x, node.y, radius * (1.8 + Math.sin(time * 0.005) * 0.5), 0, Math.PI * 2);
            ctx.stroke();
          }
        } else {
          // Slow pulsing for normal nodes
          radius = 1 + Math.sin(time * 0.002 + node.phase) * 0.35;
        }

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Subtle mouse indicator glint
      if (mouse.targetX !== -1000) {
        const grad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 250);
        grad.addColorStop(0, 'rgba(124, 58, 237, 0.025)');
        grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.01)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 250, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-[#02000c]"
      style={{ mixBlendMode: 'screen', opacity: 0.95 }}
    />
  );
});

InteractiveBackground.displayName = 'InteractiveBackground';
