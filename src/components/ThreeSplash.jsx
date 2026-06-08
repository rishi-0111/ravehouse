import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export default function ThreeSplash({ onComplete }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const taglineRef = useRef(null);
  const logoBoxRef = useRef(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // 1. Three.js Background Setup
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.015);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Create moving particle system (Rave/House vibes - Red & White particles)
    const particleCount = 400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorRed = new THREE.Color('#ff003c');
    const colorWhite = new THREE.Color('#ffffff');

    for (let i = 0; i < particleCount * 3; i += 3) {
      // position
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      // color mix (Red and White particles)
      const mixedColor = Math.random() > 0.4 ? colorRed : colorWhite;
      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom Canvas Texture for circular particles
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 0.15,
      map: texture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // Glowing lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xff003c,
      transparent: true,
      opacity: 0.1,
    });
    const lineGroup = new THREE.Group();
    for (let i = 0; i < 15; i++) {
      const lineGeom = new THREE.BufferGeometry();
      const points = [];
      const startX = (Math.random() - 0.5) * 15;
      const startY = (Math.random() - 0.5) * 15;
      const startZ = (Math.random() - 0.5) * 15;
      points.push(new THREE.Vector3(startX, startY, startZ));
      points.push(new THREE.Vector3(startX + (Math.random() - 0.5) * 4, startY + (Math.random() - 0.5) * 4, startZ + (Math.random() - 0.5) * 4));
      lineGeom.setFromPoints(points);
      const line = new THREE.Line(lineGeom, lineMaterial);
      lineGroup.add(line);
    }
    scene.add(lineGroup);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    // Animation Loop
    let animationFrameId;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) / 1000;

      particleSystem.rotation.y = elapsedTime * 0.05;
      particleSystem.rotation.x = elapsedTime * 0.02;
      lineGroup.rotation.y = -elapsedTime * 0.03;

      // Pulse camera position slightly
      camera.position.z = 8 + Math.sin(elapsedTime * 0.5) * 0.5;

      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleResize = () => {
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Progress bar simulation
    const progressTimeline = gsap.to({}, {
      duration: 2.5,
      onUpdate: function () {
        setLoadingProgress(Math.floor(this.progress() * 100));
      }
    });

    // GSAP Intro/Outro Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Cleanup ThreeJS
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        if (containerRef.current && renderer.domElement) {
          containerRef.current.removeChild(renderer.domElement);
        }
        renderer.dispose();
        onComplete();
      }
    });

    tl.set([logoBoxRef.current, textRef.current, taglineRef.current], { opacity: 0, scale: 0.9 })
      .to(logoBoxRef.current, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' })
      .to(textRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .to(taglineRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3')
      .to({}, { duration: 1.5 }) // Hold
      .to([logoBoxRef.current, textRef.current, taglineRef.current], {
        opacity: 0,
        scale: 0.95,
        y: -20,
        duration: 0.8,
        ease: 'power2.inOut',
      });

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      progressTimeline.kill();
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div style={styles.splashWrapper}>
      {/* ThreeJS Background Canvas Container */}
      <div ref={containerRef} style={styles.canvasContainer} />

      {/* Main Content Container */}
      <div style={styles.contentOverlay}>
        <div ref={logoBoxRef} style={styles.logoBorderBox}>
          <h1 ref={textRef} style={styles.logoText}>
            <span style={styles.redText}>RAVE</span>
            <span style={styles.whiteText}> HOUSE</span>
          </h1>
          <hr style={styles.line} />
          <div ref={taglineRef} style={styles.tagline}>
            MOVEMENT. CULTURE. COMMUNITY.
          </div>
        </div>

        {/* Progress Tracker */}
        <div style={styles.progressContainer}>
          <div style={styles.progressBarBackground}>
            <div style={{ ...styles.progressBarFill, width: `${loadingProgress}%` }} />
          </div>
          <span style={styles.progressText}>{loadingProgress}%</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  splashWrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
    zIndex: 9999,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Outfit', 'Inter', sans-serif",
  },
  canvasContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  contentOverlay: {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px',
  },
  logoBorderBox: {
    borderTop: '2px solid rgba(255, 255, 255, 0.8)',
    borderBottom: '2px solid rgba(255, 255, 255, 0.8)',
    padding: '25px 50px',
    backgroundColor: 'rgba(10, 10, 10, 0.75)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    maxWidth: '480px',
  },
  logoText: {
    fontSize: '3.5rem',
    fontWeight: '900',
    letterSpacing: '12px',
    margin: '0 0 10px 0',
    textTransform: 'uppercase',
    display: 'inline-block',
  },
  redText: {
    color: '#ff003c',
    textShadow: '0 0 15px rgba(255, 0, 60, 0.6)',
  },
  whiteText: {
    color: '#ffffff',
    textShadow: '0 0 15px rgba(255, 255, 255, 0.3)',
  },
  line: {
    border: 0,
    height: '1px',
    backgroundImage: 'linear-gradient(to right, rgba(255, 0, 60, 0), rgba(255, 255, 255, 0.75), rgba(255, 0, 60, 0))',
    margin: '15px 0',
  },
  tagline: {
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '5px',
    color: '#a0a0a0',
    textTransform: 'uppercase',
  },
  progressContainer: {
    marginTop: '40px',
    width: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  progressBarBackground: {
    width: '100%',
    height: '3px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ff003c',
    boxShadow: '0 0 10px #ff003c',
    transition: 'width 0.1s ease-out',
  },
  progressText: {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#707070',
    letterSpacing: '2px',
  },
};
