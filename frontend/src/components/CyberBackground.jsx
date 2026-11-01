import React, { useEffect, useRef } from 'react';

/**
 * CyberBackground - High-performance futuristic cybersecurity animated background.
 * Features:
 *  - Interconnected network nodes with glowing blue/cyan linkages
 *  - Digital circuit bus traces with traveling packets
 *  - Floating micro-particles with soft lighting
 *  - Faint holographic cyber-shield / encryption ring watermark
 *  - Periodic scanning light beam sweep
 *  - Low GPU/CPU overhead, pauses on tab blur, respects prefers-reduced-motion
 */
const CyberBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = mediaQuery.matches;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNetwork();
      initCircuits();
    };

    window.addEventListener('resize', handleResize);

    // ==========================================
    // 1. Interconnected Network Nodes
    // ==========================================
    const NODE_COUNT = Math.min(Math.floor((width * height) / 32000), 55);
    const nodes = [];

    const initNetwork = () => {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 1.8 + 1.2,
          baseAlpha: Math.random() * 0.4 + 0.35,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseVal: Math.random() * Math.PI,
          isCyan: Math.random() > 0.4
        });
      }
    };

    // ==========================================
    // 2. Digital Circuit Traces & Packets
    // ==========================================
    const circuits = [];
    const initCircuits = () => {
      circuits.length = 0;
      const circuitCount = 6;
      for (let i = 0; i < circuitCount; i++) {
        const startY = height * (0.15 + (i * 0.14));
        const length = width * 0.35;
        const startX = (i % 2 === 0) ? width * 0.05 : width * 0.6;
        
        circuits.push({
          x: startX,
          y: startY,
          segments: [
            { x: startX, y: startY },
            { x: startX + length * 0.4, y: startY },
            { x: startX + length * 0.6, y: startY + 40 },
            { x: startX + length, y: startY + 40 }
          ],
          packetPos: Math.random(),
          speed: 0.002 + Math.random() * 0.002,
          color: i % 2 === 0 ? '#38bdf8' : '#526DFF'
        });
      }
    };

    // ==========================================
    // 3. Floating Dust / Micro-Particles
    // ==========================================
    const particles = [];
    const PARTICLE_COUNT = 30;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -Math.random() * 0.35 - 0.1,
        radius: Math.random() * 1.2 + 0.6,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    // ==========================================
    // 4. Scanning Light Beam
    // ==========================================
    let scanY = -100;
    const scanSpeed = 1.2;

    // ==========================================
    // 5. Holographic Cyber Shield & Ring Watermark
    // ==========================================
    let shieldRotation = 0;

    initNetwork();
    initCircuits();

    // Helper: draw holographic shield watermark
    const drawHoloShield = (cx, cy) => {
      ctx.save();
      ctx.translate(cx, cy);

      // Rotating Outer Hexagonal Ring
      ctx.save();
      ctx.rotate(shieldRotation);
      ctx.strokeStyle = 'rgba(82, 109, 255, 0.10)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const r = 240;
        const hx = r * Math.cos(angle);
        const hy = r * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();

      // Small tick marks on hex
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.14)';
      ctx.setLineDash([4, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, 260, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Rotating Inner Ring (Counter-clockwise)
      ctx.save();
      ctx.rotate(-shieldRotation * 0.7);
      ctx.strokeStyle = 'rgba(136, 120, 217, 0.08)';
      ctx.setLineDash([8, 16]);
      ctx.beginPath();
      ctx.arc(0, 0, 190, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Cybersecurity Shield Outline
      ctx.save();
      ctx.strokeStyle = 'rgba(82, 109, 255, 0.12)';
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      // Shield path
      const sw = 90;
      const sh = 120;
      ctx.moveTo(0, -sh);
      ctx.quadraticCurveTo(sw, -sh * 0.9, sw, -sh * 0.1);
      ctx.quadraticCurveTo(sw, sh * 0.6, 0, sh);
      ctx.quadraticCurveTo(-sw, sh * 0.6, -sw, -sh * 0.1);
      ctx.quadraticCurveTo(-sw, -sh * 0.9, 0, -sh);
      ctx.closePath();
      ctx.stroke();

      // Inner Keyhole / Lock outline
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -15, 14, 0, Math.PI * 2);
      ctx.moveTo(-9, -5);
      ctx.lineTo(9, -5);
      ctx.lineTo(14, 32);
      ctx.lineTo(-14, 32);
      ctx.closePath();
      ctx.stroke();

      ctx.restore();
      ctx.restore();
    };

    // Main animation loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Faint cyber grid
      ctx.strokeStyle = 'rgba(30, 41, 69, 0.18)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 1. Holographic Cyber Shield in center
      shieldRotation += 0.002;
      drawHoloShield(width * 0.5, height * 0.42);

      // 2. Draw Circuit lines & Data Packets
      circuits.forEach(c => {
        ctx.save();
        ctx.strokeStyle = 'rgba(82, 109, 255, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        c.segments.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        // Terminal nodes of circuit
        ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
        const startPt = c.segments[0];
        const endPt = c.segments[c.segments.length - 1];
        ctx.beginPath();
        ctx.arc(startPt.x, startPt.y, 2.5, 0, Math.PI * 2);
        ctx.arc(endPt.x, endPt.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Moving Packet
        if (!isReduced) {
          c.packetPos += c.speed;
          if (c.packetPos > 1) c.packetPos = 0;
        }

        // Interpolate along the 3 segment sections
        const segIdx = Math.min(Math.floor(c.packetPos * 3), 2);
        const p1 = c.segments[segIdx];
        const p2 = c.segments[segIdx + 1];
        const subT = (c.packetPos * 3) - segIdx;
        const px = p1.x + (p2.x - p1.x) * subT;
        const py = p1.y + (p2.y - p1.y) * subT;

        // Draw glowing packet dot
        ctx.fillStyle = c.color;
        ctx.shadowColor = c.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px, py, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3. Interconnected Network Nodes
      const maxConnectDist = 140;
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];

        if (!isReduced) {
          n1.x += n1.vx;
          n1.y += n1.vy;
          n1.pulseVal += n1.pulseSpeed;

          // Bounce smoothly off boundaries
          if (n1.x < 0 || n1.x > width) n1.vx *= -1;
          if (n1.y < 0 || n1.y > height) n1.vy *= -1;
        }

        const alpha = n1.baseAlpha + Math.sin(n1.pulseVal) * 0.25;

        // Draw node
        ctx.save();
        const nodeColor = n1.isCyan ? `rgba(56, 189, 248, ${alpha})` : `rgba(82, 109, 255, ${alpha})`;
        ctx.fillStyle = nodeColor;
        ctx.shadowColor = n1.isCyan ? '#38bdf8' : '#526DFF';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const lineAlpha = (1 - dist / maxConnectDist) * 0.28;
            ctx.save();
            ctx.strokeStyle = n1.isCyan 
              ? `rgba(56, 189, 248, ${lineAlpha})` 
              : `rgba(82, 109, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // 4. Floating Micro-particles
      particles.forEach(p => {
        if (!isReduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y < -10) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
        }

        ctx.save();
        ctx.fillStyle = `rgba(186, 230, 253, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5. Scanning Light Beam Effect
      if (!isReduced) {
        scanY += scanSpeed;
        if (scanY > height + 150) {
          scanY = -120;
        }

        ctx.save();
        const scanGrad = ctx.createLinearGradient(0, scanY - 50, 0, scanY + 50);
        scanGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        scanGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.055)');
        scanGrad.addColorStop(1, 'rgba(82, 109, 255, 0)');
        ctx.fillStyle = scanGrad;
        ctx.fillRect(0, scanY - 50, width, 100);

        // Thin sharp scan line in the center
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, scanY);
        ctx.lineTo(width, scanY);
        ctx.stroke();
        ctx.restore();
      }

      if (!isReduced) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Pause on tab hidden to save CPU/GPU
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else if (!isReduced) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initial trigger
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div 
      className="cyber-background-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{
          display: 'block',
          width: '100%',
          height: '100%'
        }} 
      />
    </div>
  );
};

export default CyberBackground;

