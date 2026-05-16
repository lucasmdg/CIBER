import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Setup
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020202);
scene.fog = new THREE.FogExp2(0x020202, 0.0005);

const fov = 45;
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 4000);
let cameraDistance = (window.innerHeight / 2) / Math.tan(THREE.MathUtils.degToRad(fov / 2));
camera.position.z = cameraDistance;

// Post-processing (AAA Bloom for glowing white/silver)
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.5; // Only bright elements bloom
bloomPass.strength = 0.6; // Subtle bloom
bloomPass.radius = 1.2; // Soft, spread out glow

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Global Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(1, 2, 3);
scene.add(dirLight);

// Global floating particles for extra effect
const pGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(500 * 3);
for(let i=0; i<1500; i++) {
    pPos[i] = (Math.random() - 0.5) * 4000;
}
pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 3, transparent: true, opacity: 0.4 });
const globalParticles = new THREE.Points(pGeo, pMat);
scene.add(globalParticles);

// ==========================================
// BACKGROUND SHADER: Flowing Liquid Marble
// ==========================================
const bgUniforms = { time: { value: 0 } };

const bgVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const bgFragmentShader = `
uniform float time;
varying vec2 vUv;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    // Distort UVs for liquid effect
    vec2 uv = vUv * 4.0;
    float n1 = snoise(uv + time * 0.05);
    float n2 = snoise(uv + vec2(n1) - time * 0.04);
    
    // Marble bands
    float marble = sin(uv.x * 6.0 + n2 * 8.0) * 0.5 + 0.5;
    
    // Grayscale palette
    vec3 c1 = vec3(0.02, 0.02, 0.02); // very dark
    vec3 c2 = vec3(0.15, 0.15, 0.15); // dark grey
    vec3 c3 = vec3(0.4, 0.4, 0.4);    // light silver
    
    vec3 color = mix(c1, c2, marble);
    color = mix(color, c3, smoothstep(0.85, 1.0, marble));
    
    gl_FragColor = vec4(color, 1.0);
}
`;

const bgMat = new THREE.ShaderMaterial({
    uniforms: bgUniforms,
    vertexShader: bgVertexShader,
    fragmentShader: bgFragmentShader,
    depthWrite: false
});
const bgGeo = new THREE.PlaneGeometry(window.innerWidth * 3, window.innerHeight * 3);
const bgMesh = new THREE.Mesh(bgGeo, bgMat);
bgMesh.position.z = -1500; // Far behind
scene.add(bgMesh);


// ==========================================
// SCENES & OBJECTS (Ancient Greece + Future)
// ==========================================
const groups = [];
const cards = document.querySelectorAll('.project-card');

const textureLoader = new THREE.TextureLoader();
const statueTexture = textureLoader.load('img/statue.png');

// Custom Shader for the statue planes (depth + tinting + dynamic category distortion)
const createStatueMaterial = (colorTint, level) => {
    return new THREE.ShaderMaterial({
        uniforms: {
            tDiffuse: { value: statueTexture },
            uColor: { value: new THREE.Color(colorTint) },
            uTime: { value: 0 },
            uHover: { value: 0.0 },
            uLevel: { value: level }
        },
        vertexShader: `
            uniform float uTime;
            uniform float uHover;
            uniform float uLevel;
            varying vec2 vUv;
            void main() {
                vUv = uv;
                vec3 pos = position;
                
                // Futuro (Abstracto) - Vertex displacement
                if (uLevel > 2.5) {
                    pos.x += sin(pos.y * 10.0 + uTime) * 0.05;
                    pos.y += cos(pos.x * 10.0 + uTime) * 0.05;
                }
                
                // Subtle breathing effect
                pos.z += sin(pos.x * 5.0 + uTime) * 0.1 * uHover;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform sampler2D tDiffuse;
            uniform vec3 uColor;
            uniform float uTime;
            uniform float uHover;
            uniform float uLevel;
            varying vec2 vUv;
            
            // Noise function
            float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }
            
            void main() {
                vec2 uv = vUv;
                
                // --- CATEGORY BASED DISTORTIONS ---
                
                // Básico (uLevel == 0.0) -> Geometría / Pixelated
                if (uLevel < 0.5) {
                    float pixels = 40.0;
                    uv = floor(uv * pixels) / pixels;
                }
                
                // Intermedio (uLevel == 1.0) -> Arquitectura / Symmetry
                else if (uLevel > 0.5 && uLevel < 1.5) {
                    uv.x = abs(uv.x - 0.5) + 0.5; // Mirror half
                    uv.y = fract(uv.y * 1.2); // slight repetition
                }
                
                // Avanzado (uLevel == 2.0) -> Cyber Clásica
                else if (uLevel > 1.5 && uLevel < 2.5) {
                    // Slight chromatic aberration always on
                    uv.x += sin(uv.y * 50.0 + uTime * 5.0) * 0.002;
                }
                
                // Futuro (uLevel == 3.0) -> Abstracta Moderna
                else if (uLevel > 2.5) {
                    uv.x += sin(uv.y * 10.0 + uTime) * 0.05;
                    uv.y += cos(uv.x * 10.0 - uTime) * 0.05;
                }
                
                // Hover Glitch
                float rOffset = uHover * 0.005 * sin(uTime * 10.0);
                float bOffset = uHover * -0.005 * cos(uTime * 8.0);
                
                float r = texture2D(tDiffuse, uv + vec2(rOffset, 0.0)).r;
                float g = texture2D(tDiffuse, uv).g;
                float b = texture2D(tDiffuse, uv + vec2(bOffset, 0.0)).b;
                
                vec4 texColor = vec4(r, g, b, texture2D(tDiffuse, uv).a);
                
                // Convert to grayscale/silver
                float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
                vec3 finalColor = mix(vec3(gray), uColor, 0.7);
                
                // Add a glowing aura on hover
                float dist = distance(uv, vec2(0.5));
                float glow = smoothstep(0.5, 0.2, dist) * uHover * 0.3;
                finalColor += uColor * glow;
                
                // Apply a mask to hide the edges smoothly
                float edgeMask = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x) * 
                                 smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);
                
                gl_FragColor = vec4(finalColor, texColor.a * edgeMask);
            }
        `,
        transparent: true,
        depthWrite: false
    });
};

const planeGeo = new THREE.PlaneGeometry(1.6, 2.0, 32, 32);
const glowGeo = new THREE.TorusGeometry(1.2, 0.01, 16, 64);
const particlesGeo = new THREE.BufferGeometry();
const pPos = new Float32Array(50 * 3);
for(let i=0; i<150; i++) {
    pPos[i] = (Math.random() - 0.5) * 3;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

cards.forEach((card, index) => {
    const level = card.getAttribute('data-level');
    const outerGroup = new THREE.Group();
    const innerGroup = new THREE.Group();
    outerGroup.add(innerGroup);
    
    let colorTint = 0xffffff;
    let shaderLevel = 0;
    
    if (level === 'basico') {
        colorTint = 0xcccccc; // Silver
        shaderLevel = 0.0;
    } else if (level === 'intermedio') {
        colorTint = 0x888888; // Darker marble
        shaderLevel = 1.0;
    } else if (level === 'avanzado') {
        colorTint = 0xff6666; // Subtle red tint
        shaderLevel = 2.0;
    } else {
        colorTint = 0xffffff; // Ethereal white
        shaderLevel = 3.0;
    }

    // Cinematic Statue Plane
    const statueMat = createStatueMaterial(colorTint, shaderLevel);
    const statueMesh = new THREE.Mesh(planeGeo, statueMat);
    innerGroup.add(statueMesh);

    // Glowing Halo / Ring
    const haloMat = new THREE.MeshBasicMaterial({ color: colorTint, transparent: true, opacity: 0.1, wireframe: true });
    const halo = new THREE.Mesh(glowGeo, haloMat);
    halo.position.z = -0.3;
    innerGroup.add(halo);

    // Particles around the statue
    const pMat = new THREE.PointsMaterial({ color: colorTint, size: 0.03, transparent: true, opacity: 0.3 });
    const particles = new THREE.Points(particlesGeo, pMat);
    innerGroup.add(particles);

    const uniqueOffset = index * 0.5;
    
    const updateFn = (t) => {
        const time = t + uniqueOffset;
        
        // Breathing and slow movement
        statueMesh.position.y = Math.sin(time * 1.5) * 0.05;
        statueMesh.rotation.y = Math.sin(time * 0.5) * 0.08;
        statueMesh.rotation.z = Math.sin(time * 0.3) * 0.02;
        
        statueMat.uniforms.uTime.value = time;
        
        halo.rotation.x = time * 0.2;
        halo.rotation.y = time * 0.3;
        halo.scale.setScalar(1.0 + Math.sin(time * 2) * 0.05);

        particles.rotation.y = -time * 0.1;
        particles.position.y = Math.sin(time) * 0.1;
    };

    innerGroup.userData.update = updateFn;
    innerGroup.userData.material = statueMat;
    scene.add(outerGroup);

    // GSAP Interactions for Cinematic Feel
    let isHovered = false;
    card.addEventListener('mouseenter', () => {
        isHovered = true;
        // Cinematic zoom and lift
        gsap.to(innerGroup.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.8, ease: "power3.out" });
        gsap.to(innerGroup.position, { z: 15, duration: 0.8, ease: "power3.out" });
        gsap.to(haloMat, { opacity: 0.6, duration: 0.5 });
        gsap.to(statueMat.uniforms.uHover, { value: 1.0, duration: 0.5 });
    });

    card.addEventListener('mouseleave', () => {
        isHovered = false;
        gsap.to(innerGroup.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: "power2.out" });
        gsap.to(innerGroup.position, { z: 0, x: 0, y: 0, duration: 0.8, ease: "power2.out" });
        gsap.to(innerGroup.rotation, { x: 0, y: 0, duration: 0.8, ease: "power2.out" });
        gsap.to(haloMat, { opacity: 0.1, duration: 0.5 });
        gsap.to(statueMat.uniforms.uHover, { value: 0.0, duration: 0.5 });
    });

    card.addEventListener('click', () => {
        // Impact on click
        gsap.fromTo(halo.scale, 
            { x: 1.4, y: 1.4, z: 1.4 }, 
            { x: 1, y: 1, z: 1, duration: 1, ease: "elastic.out(1, 0.3)" }
        );
        gsap.fromTo(statueMat.uniforms.uHover,
            { value: 2.0 },
            { value: isHovered ? 1.0 : 0.0, duration: 1 }
        );
    });
    
    card.addEventListener('mousemove', (e) => {
        if (!isHovered) return;
        const rect = card.getBoundingClientRect();
        // Calculate mouse position relative to card center (-0.5 to 0.5)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        // 3D Parallax Rotation
        gsap.to(innerGroup.rotation, {
            x: y * 0.3,
            y: x * 0.3,
            duration: 0.5,
            ease: "power2.out"
        });
        
        // Slight position shift for depth
        gsap.to(innerGroup.position, {
            x: x * 4,
            y: -y * 4,
            duration: 0.5,
            ease: "power2.out"
        });
    });

    groups.push({ card, outerGroup, innerGroup });
});

// Parallax Camera
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
window.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth) * 2 - 1;
    targetY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    cameraDistance = (window.innerHeight / 2) / Math.tan(THREE.MathUtils.degToRad(fov / 2));
    camera.position.z = cameraDistance;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
    
    bgMesh.geometry.dispose();
    bgMesh.geometry = new THREE.PlaneGeometry(window.innerWidth * 3, window.innerHeight * 3);
});

// Animation Loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Shader update
    bgUniforms.time.value = time;
    
    // Global particles
    globalParticles.rotation.y = time * 0.05;
    globalParticles.rotation.x = Math.sin(time * 0.02) * 0.1;

    // Smooth camera parallax
    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;
    
    camera.position.x = mouseX * 40;
    camera.position.y = mouseY * 40;
    camera.lookAt(scene.position);

    groups.forEach(({ card, outerGroup, innerGroup }) => {
        const rect = card.getBoundingClientRect();
        
        // Hide if outside viewport
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
            outerGroup.visible = true;
            
            // Map 2D position to 3D
            const x = rect.left + rect.width / 2 - window.innerWidth / 2;
            const y = -(rect.top + rect.height / 2 - window.innerHeight / 2);
            outerGroup.position.set(x, y, 0);
            
            // Scale object to fit card nicely
            const baseScale = Math.min(rect.width, rect.height) * 0.45;
            outerGroup.scale.set(baseScale, baseScale, baseScale);
            
            // Update custom animations
            if (innerGroup.userData.update) {
                innerGroup.userData.update(time);
            }
        } else {
            outerGroup.visible = false;
        }
    });

    composer.render();
}

animate();
