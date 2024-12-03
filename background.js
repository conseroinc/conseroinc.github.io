// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('three-container').appendChild(renderer.domElement);

// Shader material for the grid sphere
const gridMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x00f6ff) }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        
        void main() {
            float intensity = 0.8 + 0.2 * sin(time * 2.0);
            gl_FragColor = vec4(color * intensity, 0.3);
        }
    `,
    transparent: true,
    wireframe: true
});

// Create Sphere with increased segments
const sphereGeometry = new THREE.SphereGeometry(50, 128, 128);
const sphereMesh = new THREE.Mesh(sphereGeometry, gridMaterial);
scene.add(sphereMesh);

// Debug: Log to confirm sphere creation
console.log("Sphere created and added to the scene.");

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(30, 20, 30);
scene.add(directionalLight);

// Debug: Log to confirm lighting setup
console.log("Lighting added to the scene.");

// Camera setup
camera.position.set(0, 0, 50); // Start the camera a bit away from the origin
camera.lookAt(0, 0, 0);

// Debug: Log to confirm camera setup
console.log("Camera setup complete.");

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // Rotate the entire scene diagonally
    scene.rotation.x += delta * 0.1; // Rotate along the x-axis
    scene.rotation.y += delta * 0.1; // Rotate along the y-axis
    scene.rotation.z += delta * 0.1; // Rotate along the z-axis

    // Update material time uniform for animation effect
    gridMaterial.uniforms.time.value += delta;

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // Debug: Log to confirm resize handling
    console.log("Window resized. Renderer and camera updated.");
});

// Handle scroll to pan the camera
window.addEventListener('wheel', (event) => {
    const delta = Math.sign(event.deltaY) * 0.1;
    camera.position.y -= delta; // Move the camera up and down based on the scroll

    // Ensure the camera doesn't move too far up or down
    camera.position.y = Math.max(-50, Math.min(50, camera.position.y));

    // Debug: Log camera position
    console.log("Camera Y position:", camera.position.y);
    camera.lookAt(0, 0, 0);
});
