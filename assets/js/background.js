// ===== Canvas Setup =====
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ===== Mouse Tracking =====
let mouse = { x: -9999, y: -9999 };
window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// ===== Simple Noise Function =====
function noise(x, y, t) {
    return (Math.sin(x * 0.01 + t * 0.002) +
            Math.sin(y * 0.01 + t * 0.002) +
            Math.sin((x + y) * 0.008 + t * 0.002)) / 3;
}

// ===== Animation Loop =====
let t = 0;
function animate() {
    t++;

    const w = canvas.width;
    const h = canvas.height;
    const img = ctx.createImageData(w, h);
    const data = img.data;

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {

            // Base noise
            let n = noise(x, y, t);
            let brightness = (n + 1) * 128;

            // Glow effect around mouse
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                const glow = (1 - dist / 150) * 150;
                brightness += glow;
            }

            const index = (y * w + x) * 4;
            data[index] = brightness;     // R
            data[index + 1] = brightness; // G
            data[index + 2] = brightness; // B
            data[index + 3] = 255;        // A
        }
    }

    ctx.putImageData(img, 0, 0);
    requestAnimationFrame(animate);
}

animate();
