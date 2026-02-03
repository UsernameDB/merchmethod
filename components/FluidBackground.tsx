"use client";

import { useEffect, useRef, useCallback } from "react";

// WebGL Fluid Simulation based on Jos Stam's Stable Fluids
// Adapted for MerchMethod's violet/pink palette

const vertexShader = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const advectionShader = `
  precision highp float;
  uniform sampler2D u_velocity;
  uniform sampler2D u_source;
  uniform vec2 u_texelSize;
  uniform float u_dt;
  uniform float u_dissipation;
  varying vec2 v_uv;
  void main() {
    vec2 coord = v_uv - u_dt * texture2D(u_velocity, v_uv).xy * u_texelSize;
    gl_FragColor = u_dissipation * texture2D(u_source, coord);
  }
`;

const divergenceShader = `
  precision highp float;
  uniform sampler2D u_velocity;
  uniform vec2 u_texelSize;
  varying vec2 v_uv;
  void main() {
    float L = texture2D(u_velocity, v_uv - vec2(u_texelSize.x, 0.0)).x;
    float R = texture2D(u_velocity, v_uv + vec2(u_texelSize.x, 0.0)).x;
    float B = texture2D(u_velocity, v_uv - vec2(0.0, u_texelSize.y)).y;
    float T = texture2D(u_velocity, v_uv + vec2(0.0, u_texelSize.y)).y;
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const pressureShader = `
  precision highp float;
  uniform sampler2D u_pressure;
  uniform sampler2D u_divergence;
  uniform vec2 u_texelSize;
  varying vec2 v_uv;
  void main() {
    float L = texture2D(u_pressure, v_uv - vec2(u_texelSize.x, 0.0)).x;
    float R = texture2D(u_pressure, v_uv + vec2(u_texelSize.x, 0.0)).x;
    float B = texture2D(u_pressure, v_uv - vec2(0.0, u_texelSize.y)).y;
    float T = texture2D(u_pressure, v_uv + vec2(0.0, u_texelSize.y)).y;
    float div = texture2D(u_divergence, v_uv).x;
    float pressure = (L + R + B + T - div) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const gradientSubtractShader = `
  precision highp float;
  uniform sampler2D u_pressure;
  uniform sampler2D u_velocity;
  uniform vec2 u_texelSize;
  varying vec2 v_uv;
  void main() {
    float L = texture2D(u_pressure, v_uv - vec2(u_texelSize.x, 0.0)).x;
    float R = texture2D(u_pressure, v_uv + vec2(u_texelSize.x, 0.0)).x;
    float B = texture2D(u_pressure, v_uv - vec2(0.0, u_texelSize.y)).x;
    float T = texture2D(u_pressure, v_uv + vec2(0.0, u_texelSize.y)).x;
    vec2 velocity = texture2D(u_velocity, v_uv).xy;
    velocity -= vec2(R - L, T - B) * 0.5;
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const splatShader = `
  precision highp float;
  uniform sampler2D u_target;
  uniform vec2 u_point;
  uniform vec3 u_color;
  uniform float u_radius;
  uniform float u_aspectRatio;
  varying vec2 v_uv;
  void main() {
    vec2 p = v_uv - u_point;
    p.x *= u_aspectRatio;
    float d = dot(p, p);
    vec3 splat = exp(-d / u_radius) * u_color;
    vec3 base = texture2D(u_target, v_uv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`;

const displayShader = `
  precision highp float;
  uniform sampler2D u_texture;
  varying vec2 v_uv;
  void main() {
    vec3 color = texture2D(u_texture, v_uv).rgb;
    // Dim output and vignette to keep text readable
    color *= 0.4;
    float vignette = 1.0 - 0.4 * length(v_uv - 0.5);
    color *= vignette;
    gl_FragColor = vec4(color, 1.0);
  }
`;

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
}

interface DoubleFBO {
  read: FBO;
  write: FBO;
  swap: () => void;
}

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const pointerRef = useRef({ x: 0, y: 0, dx: 0, dy: 0, moved: false });
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const autoSplatTimerRef = useRef(0);

  const createShader = useCallback(
    (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    },
    []
  );

  const createProgram = useCallback(
    (gl: WebGLRenderingContext, vs: string, fs: string) => {
      const program = gl.createProgram()!;
      gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vs));
      gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(program);
      return program;
    },
    [createShader]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    // Enable float textures
    const ext = gl.getExtension("OES_texture_half_float");
    const linearExt = gl.getExtension("OES_texture_half_float_linear");
    const floatType = ext ? ext.HALF_FLOAT_OES : gl.UNSIGNED_BYTE;

    // Check if linear filtering works with float textures
    const useLinear = !!linearExt;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Simulation resolution
    const simWidth = 128;
    const simHeight = Math.round(simWidth * (canvas.height / canvas.width));
    const dyeWidth = 512;
    const dyeHeight = Math.round(dyeWidth * (canvas.height / canvas.width));

    // Vertex buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    );

    // Programs
    const advectionProg = createProgram(gl, vertexShader, advectionShader);
    const divergenceProg = createProgram(gl, vertexShader, divergenceShader);
    const pressureProg = createProgram(gl, vertexShader, pressureShader);
    const gradSubProg = createProgram(gl, vertexShader, gradientSubtractShader);
    const splatProg = createProgram(gl, vertexShader, splatShader);
    const displayProg = createProgram(gl, vertexShader, displayShader);

    function createFBO(w: number, h: number): FBO {
      const texture = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, texture);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, useLinear ? gl!.LINEAR : gl!.NEAREST);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, useLinear ? gl!.LINEAR : gl!.NEAREST);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, w, h, 0, gl!.RGBA, floatType, null);
      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0);
      gl!.viewport(0, 0, w, h);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      return { texture, fbo, width: w, height: h };
    }

    function createDoubleFBO(w: number, h: number): DoubleFBO {
      let fbo1 = createFBO(w, h);
      let fbo2 = createFBO(w, h);
      return {
        get read() { return fbo1; },
        get write() { return fbo2; },
        swap() { const temp = fbo1; fbo1 = fbo2; fbo2 = temp; },
      };
    }

    const velocity = createDoubleFBO(simWidth, simHeight);
    const pressure = createDoubleFBO(simWidth, simHeight);
    const dye = createDoubleFBO(dyeWidth, dyeHeight);
    const divergenceFBO = createFBO(simWidth, simHeight);

    function blit(target: FBO | null, w?: number, h?: number) {
      if (target) {
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo);
        gl!.viewport(0, 0, target.width, target.height);
      } else {
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null);
        gl!.viewport(0, 0, w || canvas!.width, h || canvas!.height);
      }
      gl!.drawArrays(gl!.TRIANGLES, 0, 6);
    }

    function useProg(prog: WebGLProgram) {
      gl!.useProgram(prog);
      const posLoc = gl!.getAttribLocation(prog, "a_position");
      gl!.enableVertexAttribArray(posLoc);
      gl!.vertexAttribPointer(posLoc, 2, gl!.FLOAT, false, 0, 0);
    }

    // Palette: violet, pink, fuchsia, indigo
    const colors = [
      [0.49, 0.23, 0.93],  // violet
      [0.93, 0.29, 0.60],  // pink
      [0.85, 0.24, 0.85],  // fuchsia
      [0.31, 0.27, 0.90],  // indigo
      [0.56, 0.18, 0.78],  // purple
    ];

    function randomColor() {
      const c = colors[Math.floor(Math.random() * colors.length)];
      return { r: c[0] * 0.18, g: c[1] * 0.18, b: c[2] * 0.18 };
    }

    function splat(x: number, y: number, dx: number, dy: number) {
      useProg(splatProg);

      gl!.uniform1i(gl!.getUniformLocation(splatProg, "u_target"), 0);
      gl!.uniform2f(gl!.getUniformLocation(splatProg, "u_point"), x, y);
      gl!.uniform1f(gl!.getUniformLocation(splatProg, "u_radius"), 0.015);
      gl!.uniform1f(gl!.getUniformLocation(splatProg, "u_aspectRatio"), canvas!.width / canvas!.height);

      // Splat velocity
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, velocity.read.texture);
      gl!.uniform3f(gl!.getUniformLocation(splatProg, "u_color"), dx, dy, 0.0);
      blit(velocity.write);
      velocity.swap();

      // Splat dye
      gl!.bindTexture(gl!.TEXTURE_2D, dye.read.texture);
      const color = randomColor();
      gl!.uniform3f(gl!.getUniformLocation(splatProg, "u_color"), color.r, color.g, color.b);
      blit(dye.write);
      dye.swap();
    }

    // Persistent flow sources that drift slowly across the canvas
    const flowSources = Array.from({ length: 6 }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      angle: (Math.PI * 2 * i) / 6,
      speed: 0.0003 + Math.random() * 0.0004,
      drift: Math.random() * Math.PI * 2,
      driftSpeed: 0.002 + Math.random() * 0.003,
    }));

    // Seed the canvas generously
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const x = 0.5 + Math.cos(angle) * 0.3;
      const y = 0.5 + Math.sin(angle) * 0.3;
      splat(x, y, Math.cos(angle) * 20, Math.sin(angle) * 20);
    }

    function step(dt: number) {
      // Advect velocity
      useProg(advectionProg);
      gl!.uniform2f(gl!.getUniformLocation(advectionProg, "u_texelSize"), 1.0 / simWidth, 1.0 / simHeight);
      gl!.uniform1f(gl!.getUniformLocation(advectionProg, "u_dt"), dt);
      gl!.uniform1f(gl!.getUniformLocation(advectionProg, "u_dissipation"), 0.998);
      gl!.uniform1i(gl!.getUniformLocation(advectionProg, "u_velocity"), 0);
      gl!.uniform1i(gl!.getUniformLocation(advectionProg, "u_source"), 0);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, velocity.read.texture);
      blit(velocity.write);
      velocity.swap();

      // Advect dye
      gl!.uniform2f(gl!.getUniformLocation(advectionProg, "u_texelSize"), 1.0 / dyeWidth, 1.0 / dyeHeight);
      gl!.uniform1f(gl!.getUniformLocation(advectionProg, "u_dissipation"), 0.998);
      gl!.uniform1i(gl!.getUniformLocation(advectionProg, "u_source"), 1);
      gl!.activeTexture(gl!.TEXTURE1);
      gl!.bindTexture(gl!.TEXTURE_2D, dye.read.texture);
      blit(dye.write);
      dye.swap();

      // Divergence
      useProg(divergenceProg);
      gl!.uniform2f(gl!.getUniformLocation(divergenceProg, "u_texelSize"), 1.0 / simWidth, 1.0 / simHeight);
      gl!.uniform1i(gl!.getUniformLocation(divergenceProg, "u_velocity"), 0);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, velocity.read.texture);
      blit(divergenceFBO);

      // Pressure solve (Jacobi iteration)
      useProg(pressureProg);
      gl!.uniform2f(gl!.getUniformLocation(pressureProg, "u_texelSize"), 1.0 / simWidth, 1.0 / simHeight);
      gl!.uniform1i(gl!.getUniformLocation(pressureProg, "u_divergence"), 1);
      gl!.activeTexture(gl!.TEXTURE1);
      gl!.bindTexture(gl!.TEXTURE_2D, divergenceFBO.texture);
      for (let i = 0; i < 20; i++) {
        gl!.uniform1i(gl!.getUniformLocation(pressureProg, "u_pressure"), 0);
        gl!.activeTexture(gl!.TEXTURE0);
        gl!.bindTexture(gl!.TEXTURE_2D, pressure.read.texture);
        blit(pressure.write);
        pressure.swap();
      }

      // Gradient subtract
      useProg(gradSubProg);
      gl!.uniform2f(gl!.getUniformLocation(gradSubProg, "u_texelSize"), 1.0 / simWidth, 1.0 / simHeight);
      gl!.uniform1i(gl!.getUniformLocation(gradSubProg, "u_pressure"), 0);
      gl!.uniform1i(gl!.getUniformLocation(gradSubProg, "u_velocity"), 1);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, pressure.read.texture);
      gl!.activeTexture(gl!.TEXTURE1);
      gl!.bindTexture(gl!.TEXTURE_2D, velocity.read.texture);
      blit(velocity.write);
      velocity.swap();
    }

    function render() {
      const pointer = pointerRef.current;

      // Handle mouse interaction
      if (pointer.moved) {
        splat(pointer.x, pointer.y, pointer.dx * 10000, pointer.dy * 10000);
        pointer.moved = false;
      }

      // Continuous gentle flow — each source emits a soft splat every frame
      autoSplatTimerRef.current++;
      const t = autoSplatTimerRef.current;
      for (const src of flowSources) {
        // Drift the source position slowly in a circular path
        src.drift += src.driftSpeed;
        const cx = 0.5 + Math.cos(src.drift) * 0.35;
        const cy = 0.5 + Math.sin(src.drift * 0.7) * 0.35;

        // Rotate the flow direction gradually
        src.angle += 0.008;
        const dx = Math.cos(src.angle) * 8;
        const dy = Math.sin(src.angle) * 8;

        // Only splat every 3rd frame per source to keep it smooth, not heavy
        if (t % 3 === 0) {
          splat(cx, cy, dx, dy);
        }
      }

      step(0.016);

      // Display
      useProg(displayProg);
      gl!.uniform1i(gl!.getUniformLocation(displayProg, "u_texture"), 0);
      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, dye.read.texture);
      blit(null, canvas!.width, canvas!.height);

      animationRef.current = requestAnimationFrame(render);
    }

    // Mouse handlers
    const onMouseMove = (e: MouseEvent) => {
      const x = e.clientX / canvas!.width;
      const y = 1.0 - e.clientY / canvas!.height;
      pointerRef.current = {
        x,
        y,
        dx: x - lastPointerRef.current.x,
        dy: y - lastPointerRef.current.y,
        moved: true,
      };
      lastPointerRef.current = { x, y };
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const x = touch.clientX / canvas!.width;
      const y = 1.0 - touch.clientY / canvas!.height;
      pointerRef.current = {
        x,
        y,
        dx: x - lastPointerRef.current.x,
        dy: y - lastPointerRef.current.y,
        moved: true,
      };
      lastPointerRef.current = { x, y };
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("touchmove", onTouchMove, { passive: true });

    animationRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("touchmove", onTouchMove);
    };
  }, [createProgram]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full h-full"
      style={{ background: "#0A0A0A" }}
    />
  );
}
