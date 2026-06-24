import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/* A shader-driven oscilloscope trace: brand-cyan phosphor on blue-black.
   The signal is a sum of sines (a "complex waveform" like a real scope),
   with a 1/distance glow falloff and a faint graticule. Reacts to the
   pointer (frequency/amplitude) and scroll (amplitude decay).            */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uPointer;   // -1..1
  uniform float uScroll;    // 0..1 hero scroll progress
  uniform float uReduced;   // 0 = animate, 1 = static

  float wave(float x, float t) {
    float y = 0.0;
    y += 0.42 * sin(x * 2.2 + t * 1.10);
    y += 0.20 * sin(x * 5.7 - t * 1.90);
    y += 0.11 * sin(x * 11.0 + t * 0.70);
    y += 0.05 * sin(x * 23.0 - t * 2.60);
    return y;
  }

  void main() {
    float aspect = uResolution.x / uResolution.y;
    vec2 p = vUv - 0.5;
    p.x *= aspect;

    float t = mix(uTime, 6.2831, uReduced);

    // amplitude eases down as the hero scrolls away; pointer nudges it
    float decay = 1.0 - 0.55 * uScroll;
    float amp = (0.165 + uPointer.y * 0.05) * decay;
    float freq = 1.0 + uPointer.x * 0.6;

    float y = wave(p.x * 2.2 * freq, t) * amp;
    float dist = abs(p.y - y);

    // core trace + soft bloom
    float core = amp * 0.010 / (dist + 0.0010);
    float bloom = amp * 0.020 / (dist + 0.022);
    float glow = clamp(core + bloom * 0.55, 0.0, 1.6);

    // faint graticule (scope screen) — warm, very low alpha
    vec2 g = abs(fract(vUv * vec2(18.0, 10.0)) - 0.5);
    float grid = (1.0 - smoothstep(0.0, 0.035, min(g.x, g.y))) * 0.05;
    // brighter center cross
    float cross = (1.0 - smoothstep(0.0, 0.0016, abs(p.y))) * 0.06
                + (1.0 - smoothstep(0.0, 0.0016, abs(p.x))) * 0.04;

    // brand gradient across the trace: cyan -> violet -> magenta
    vec3 c1 = vec3(0.133, 0.827, 0.933); // #22D3EE cyan
    vec3 c2 = vec3(0.545, 0.361, 0.965); // #8B5CF6 violet
    vec3 c3 = vec3(0.910, 0.475, 0.976); // #E879F9 magenta
    vec3 trace = vUv.x < 0.5 ? mix(c1, c2, vUv.x * 2.0) : mix(c2, c3, (vUv.x - 0.5) * 2.0);
    vec3 col = trace * glow + trace * (grid + cross) * 0.9;

    float alpha = clamp(glow + grid + cross, 0.0, 1.0);
    // vignette so edges fall into the page background
    float vig = smoothstep(1.25, 0.35, length(p));
    gl_FragColor = vec4(col, alpha * vig);
  }
`

function Trace({ reduced }: { reduced: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const { viewport, size } = useThree()
  const pointer = useRef(new THREE.Vector2(0, 0))

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uScroll: { value: 0 },
      uReduced: { value: reduced ? 1 : 0 },
    }),
    [reduced],
  )

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      )
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state) => {
    if (!mat.current) return
    const u = mat.current.uniforms
    u.uTime.value = state.clock.elapsedTime
    u.uResolution.value.set(size.width, size.height)
    // ease pointer toward target for a heavier, instrument-like feel
    const cur = u.uPointer.value as THREE.Vector2
    cur.lerp(pointer.current, 0.05)
    const prog = Math.min(1, window.scrollY / window.innerHeight)
    u.uScroll.value = prog
  })

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

function Oscilloscope() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      orthographic
      camera={{ position: [0, 0, 1], zoom: 1 }}
      frameloop={reduced ? 'demand' : 'always'}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Trace reduced={reduced} />
    </Canvas>
  )
}

export default Oscilloscope
