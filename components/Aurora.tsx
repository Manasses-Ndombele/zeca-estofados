'use client';
// Recriação do efeito "Aurora" (React Bits) com OGL.
import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';

const VERT = `#version 300 es
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform float uTime, uAmplitude, uBlend, uHeight, uGlow, uBrightness, uOpacity, uIntro, uFlip, uScale;
uniform vec3 uStops[3];
uniform vec2 uRes, uMouse;
out vec4 fragColor;

vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
vec3 ramp(float x){
  x = clamp(x, 0.0, 1.0);
  return x < 0.5 ? mix(uStops[0], uStops[1], x*2.0) : mix(uStops[1], uStops[2], (x-0.5)*2.0);
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float d = uFlip > 0.5 ? 1.0 - uv.y : uv.y;       // distância à borda de origem
  float n = snoise(vec2(uv.x*2.0*uScale + uTime*0.10 + uMouse.x*0.4, uTime*0.15)) * uAmplitude;
  float reach = uHeight * (1.0 + 0.5*n) + uMouse.y*0.03;
  float body = 1.0 - smoothstep(reach*(1.0-uBlend), reach + uBlend*0.3, d);
  float rays = 0.65 + 0.35*snoise(vec2(uv.x*14.0*uScale, uTime*0.2));
  float glow = exp(-d*3.0) * uGlow * 0.5;
  float a = clamp(body*rays + glow, 0.0, 1.0) * uOpacity * uIntro;
  vec3 col = ramp(uv.x + 0.15*n) * uBrightness;
  fragColor = vec4(col*a, a);
}`;

export interface AuroraProps {
  colorStops?: string[]; amplitude?: number; blend?: number; height?: number; speed?: number;
  glow?: number; scale?: number; brightness?: number; layers?: number; direction?: 'top' | 'bottom';
  opacity?: number; mouseInteraction?: boolean; intro?: boolean; lightMode?: boolean;
}

export default function Aurora({
  colorStops = ['#5227FF', '#7cff67', '#5227FF'], amplitude = 1, blend = 0.5, height = 0.45, speed = 1,
  glow = 0.6, scale = 1, brightness = 1, direction = 'top', opacity = 1, mouseInteraction = true, intro = true,
}: AuroraProps) {
  const ref = useRef<HTMLDivElement>(null);
  const props = useRef({ amplitude, blend, height, speed, glow, scale, brightness, direction, opacity, mouseInteraction, intro, colorStops });
  props.current = { amplitude, blend, height, speed, glow, scale, brightness, direction, opacity, mouseInteraction, intro, colorStops };

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.cssText = 'width:100%;height:100%;display:block';
    host.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex: VERT, fragment: FRAG,
      uniforms: {
        uTime: { value: 0 }, uAmplitude: { value: 1 }, uBlend: { value: 0.5 }, uHeight: { value: 0.45 },
        uGlow: { value: 0.6 }, uBrightness: { value: 1 }, uOpacity: { value: 1 }, uIntro: { value: 0 },
        uFlip: { value: 1 }, uScale: { value: 1 },
        uStops: { value: props.current.colorStops.map((c) => new Color(c)) },
        uRes: { value: [1, 1] }, uMouse: { value: [0, 0] },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      renderer.setSize(host.offsetWidth, host.offsetHeight);
      program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const target = [0, 0];
    const onMove = (e: PointerEvent) => {
      if (!props.current.mouseInteraction) return;
      const r = host.getBoundingClientRect();
      target[0] = ((e.clientX - r.left) / r.width) * 2 - 1;
      target[1] = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove);

    let raf = 0;
    const start = performance.now();
    let last = start;
    let t = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const p = props.current;
      t += ((now - last) / 1000) * p.speed;
      last = now;
      const u = program.uniforms;
      u.uTime.value = t;
      u.uAmplitude.value = p.amplitude; u.uBlend.value = p.blend; u.uHeight.value = p.height;
      u.uGlow.value = p.glow; u.uBrightness.value = p.brightness; u.uOpacity.value = p.opacity;
      u.uScale.value = p.scale; u.uFlip.value = p.direction === 'top' ? 1 : 0;
      u.uStops.value = p.colorStops.map((c) => new Color(c));
      u.uIntro.value = p.intro ? Math.min(1, (now - start) / 2000) : 1;
      const m = u.uMouse.value as number[];
      m[0] += (target[0] - m[0]) * 0.05; m[1] += (target[1] - m[1]) * 0.05;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onMove);
      if (gl.canvas.parentNode === host) host.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <div ref={ref} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} aria-hidden />;
}
