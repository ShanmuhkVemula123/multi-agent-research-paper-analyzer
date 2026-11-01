import React, { useEffect, useRef } from 'react';

/**
 * FloatingAmbientBackground - Premium 3D Ambient Atmosphere for Internal Pages
 * Features:
 *  - Deep charcoal canvas (#191820)
 *  - Slowly drifting liquid-like dark purple radial gradients
 *  - Slowly floating 3D-shaded purple spheres with realistic volume & specular highlights
 *  - Soft translucent floating 3D geometric objects (octahedrons, cubes, rings) with slow 3D rotation
 *  - Parallax depth layering (foreground, midground, background)
 *  - Low GPU/CPU overhead, pauses on tab blur, respects prefers-reduced-motion
 *  - Strictly non-intrusive: low opacities so report text is 100% readable
 */
const FloatingAmbientBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = mediaQuery.matches;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initElements();
    };

    window.addEventListener('resize', handleResize);

    // ==========================================
    // 1. Moving Liquid-like Ambient Light Blobs
    // ==========================================
    const liquidBlobs = [
      { x: 0.2 * width, y: 0.25 * height, r: 420, vx: 0.15, vy: 0.1, color: 'rgba(80, 50, 140, 0.12)' },
      { x: 0.8 * width, y: 0.65 * height, r: 480, vx: -0.12, vy: 0.08, color: 'rgba(128, 100, 216, 0.09)' },
      { x: 0.5 * width, y: 0.85 * height, r: 380, vx: 0.08, vy: -0.14, color: 'rgba(64, 40, 115, 0.10)' }
    ];

    // ==========================================
    // 2. Floating 3D Purple Spheres
    // ==========================================
    const spheres = [];
    // ==========================================
    // 3. Floating 3D Geometric Objects (Wireframe/Translucent)
    // ==========================================
    const geometries = [];

    const initElements = () => {
      spheres.length = 0;
      geometries.length = 0;

      // Create 12-16 floating 3D spheres across 3 depth planes
      const sphereCount = Math.min(Math.floor(width / 110), 16);
      for (let i = 0; i < sphereCount; i++) {
        const depth = Math.random() * 0.7 + 0.3; // 0.3 (deep) to 1.0 (near)
        spheres.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: (18 + Math.random() * 32) * depth,
          vx: (Math.random() - 0.5) * 0.3 * depth,
          vy: (-Math.random() * 0.25 - 0.08) * depth,
          depth,
          alpha: (0.18 + Math.random() * 0.22) * depth,
          wobbleOffset: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.01 + Math.random() * 0.015
        });
      }

      // Create 6-8 floating 3D geometric objects (cubes and octahedrons)
      const geoCount = Math.min(Math.floor(width / 220), 8);
      for (let i = 0; i < geoCount; i++) {
        const type = i % 2 === 0 ? 'cube' : 'octa';
        const depth = Math.random() * 0.6 + 0.4;
        geometries.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: (25 + Math.random() * 35) * depth,
          vx: (Math.random() - 0.5) * 0.25 * depth,
          vy: (-Math.random() * 0.2 - 0.05) * depth,
          rx: Math.random() * Math.PI,
          ry: Math.random() * Math.PI,
          rz: Math.random() * Math.PI,
          rotSpeedX: (Math.random() - 0.5) * 0.008,
          rotSpeedY: (Math.random() - 0.5) * 0.01,
          rotSpeedZ: (Math.random() - 0.5) * 0.006,
          type,
          depth,
          alpha: 0.12 * depth
        });
      }
    };

    initElements();

    // Helper: Draw a realistic 3D volumetric sphere with specular highlight
    const draw3DSphere = (sphere) => {
      ctx.save();
      const { x, y, radius, alpha } = sphere;

      // Radial gradient for 3D sphere volume: light source coming from top-left
      const lightX = x - radius * 0.35;
      const lightY = y - radius * 0.35;
      const grad = ctx.createRadialGradient(
        lightX, lightY, radius * 0.08,
        x, y, radius
      );

      // Light specular highlight -> mid-tone purple -> shadow edge
      grad.addColorStop(0, `rgba(240, 237, 247, ${alpha * 1.3})`); // Soft specular point
      grad.addColorStop(0.25, `rgba(177, 154, 245, ${alpha})`);     // #B19AF5 mid-tone
      grad.addColorStop(0.65, `rgba(128, 100, 216, ${alpha * 0.8})`);// #8064D8 body
      grad.addColorStop(0.95, `rgba(41, 38, 50, ${alpha * 0.6})`);  // Dark shadow limb
      grad.addColorStop(1, 'rgba(25, 24, 32, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Subtle atmospheric outer glow for larger foreground spheres
      if (sphere.depth > 0.6) {
        const glowGrad = ctx.createRadialGradient(x, y, radius * 0.8, x, y, radius * 1.35);
        glowGrad.addColorStop(0, `rgba(128, 100, 216, ${alpha * 0.25})`);
        glowGrad.addColorStop(1, 'rgba(128, 100, 216, 0)');
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.35, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    // Helper: 3D point projection for geometric wireframes
    const project3D = (px, py, pz, rx, ry, rz, cx, cy, scale) => {
      // Rotation around X
      let y1 = py * Math.cos(rx) - pz * Math.sin(rx);
      let z1 = py * Math.sin(rx) + pz * Math.cos(rx);

      // Rotation around Y
      let x2 = px * Math.cos(ry) + z1 * Math.sin(ry);
      let z2 = -px * Math.sin(ry) + z1 * Math.cos(ry);

      // Rotation around Z
      let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);

      // Perspective projection
      const fov = 400;
      const pzFinal = z2 + 350;
      const factor = fov / (pzFinal > 1 ? pzFinal : 1);

      return {
        x: cx + x3 * factor * (scale / 40),
        y: cy + y3 * factor * (scale / 40),
        z: z2
      };
    };

    // Draw 3D Cube wireframe with soft translucent face fill
    const draw3DCube = (geo) => {
      const vertices = [
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]
      ];
      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];

      const projected = vertices.map(v => 
        project3D(v[0] * 20, v[1] * 20, v[2] * 20, geo.rx, geo.ry, geo.rz, geo.x, geo.y, geo.size)
      );

      ctx.save();
      ctx.strokeStyle = `rgba(177, 154, 245, ${geo.alpha * 1.4})`;
      ctx.lineWidth = 1.2;

      edges.forEach(([i1, i2]) => {
        ctx.beginPath();
        ctx.moveTo(projected[i1].x, projected[i1].y);
        ctx.lineTo(projected[i2].x, projected[i2].y);
        ctx.stroke();
      });

      // Soft face fill
      ctx.fillStyle = `rgba(128, 100, 216, ${geo.alpha * 0.35})`;
      ctx.beginPath();
      ctx.moveTo(projected[0].x, projected[0].y);
      ctx.lineTo(projected[1].x, projected[1].y);
      ctx.lineTo(projected[2].x, projected[2].y);
      ctx.lineTo(projected[3].x, projected[3].y);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    // Draw 3D Octahedron wireframe
    const draw3DOcta = (geo) => {
      const vertices = [
        [0, -1.4, 0], [0, 1.4, 0],
        [-1, 0, 0],  [1, 0, 0],
        [0, 0, -1],  [0, 0, 1]
      ];
      const edges = [
        [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 2], [1, 3], [1, 4], [1, 5],
        [2, 4], [4, 3], [3, 5], [5, 2]
      ];

      const projected = vertices.map(v => 
        project3D(v[0] * 22, v[1] * 22, v[2] * 22, geo.rx, geo.ry, geo.rz, geo.x, geo.y, geo.size)
      );

      ctx.save();
      ctx.strokeStyle = `rgba(128, 100, 216, ${geo.alpha * 1.5})`;
      ctx.lineWidth = 1.2;

      edges.forEach(([i1, i2]) => {
        ctx.beginPath();
        ctx.moveTo(projected[i1].x, projected[i1].y);
        ctx.lineTo(projected[i2].x, projected[i2].y);
        ctx.stroke();
      });

      ctx.restore();
    };

    // ==========================================
    // Main Render Loop
    // ==========================================
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Liquid-like Background Purple Glows
      liquidBlobs.forEach(blob => {
        if (!isReduced) {
          blob.x += blob.vx;
          blob.y += blob.vy;
          if (blob.x < -100 || blob.x > width + 100) blob.vx *= -1;
          if (blob.y < -100 || blob.y > height + 100) blob.vy *= -1;
        }

        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
        grad.addColorStop(0, blob.color);
        grad.addColorStop(1, 'rgba(25, 24, 32, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw & Animate Floating 3D Spheres
      spheres.forEach(s => {
        if (!isReduced) {
          s.x += s.vx + Math.sin(s.wobbleOffset) * 0.15;
          s.y += s.vy;
          s.wobbleOffset += s.wobbleSpeed;

          // Wrap smoothly
          if (s.y < -s.radius * 2) {
            s.y = height + s.radius * 2;
            s.x = Math.random() * width;
          }
          if (s.x < -s.radius * 2) s.x = width + s.radius * 2;
          if (s.x > width + s.radius * 2) s.x = -s.radius * 2;
        }

        draw3DSphere(s);
      });

      // 3. Draw & Animate 3D Geometric Objects
      geometries.forEach(geo => {
        if (!isReduced) {
          geo.x += geo.vx;
          geo.y += geo.vy;
          geo.rx += geo.rotSpeedX;
          geo.ry += geo.rotSpeedY;
          geo.rz += geo.rotSpeedZ;

          if (geo.y < -geo.size * 2) {
            geo.y = height + geo.size * 2;
            geo.x = Math.random() * width;
          }
          if (geo.x < -geo.size * 2) geo.x = width + geo.size * 2;
          if (geo.x > width + geo.size * 2) geo.x = -geo.size * 2;
        }

        if (geo.type === 'cube') {
          draw3DCube(geo);
        } else {
          draw3DOcta(geo);
        }
      });

      if (!isReduced) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Pause on tab blur to avoid wasting battery/CPU
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else if (!isReduced) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      className="floating-ambient-container"
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

export default FloatingAmbientBackground;

