const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Mouse tracking
const mouse = { x: null, y: null };
window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
});

// Particle layers for depth
const layers = [
    { count: 40, speed: 0.15, size: 1.5, color: "rgba(255,255,255,0.6)" },
    { count: 30, speed: 0.25, size: 2, color: "rgba(255,255,255,0.8)" },
    { count: 20, speed: 0.35, size: 2.5, color: "rgba(255,255,255,1)" }
];

const particles = [];

for (const layer of layers) {
    for (let i = 0; i < layer.count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * layer.speed,
            vy: (Math.random() - 0.5) * layer.speed,
            tx: 0, // target velocity x
            ty: 0, // target velocity y
            size: layer.size,
            color: layer.color,
            baseSpeed: layer.speed
        });
    }
}

function animate() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowBlur = 8;
    ctx.shadowColor = "white";

    for (const p of particles) {
        // Drift target velocity (smooth random wandering)
        p.tx += (Math.random() - 0.5) * 0.01;
        p.ty += (Math.random() - 0.5) * 0.01;

        // Limit target velocity
        const max = p.baseSpeed;
        p.tx = Math.max(-max, Math.min(max, p.tx));
        p.ty = Math.max(-max, Math.min(max, p.ty));

        // Ease actual velocity toward target velocity
        p.vx += (p.tx - p.vx) * 0.05;
        p.vy += (p.ty - p.vy) * 0.05;

        // Mouse repulsion (smooth falloff)
        if (mouse.x !== null) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = 140;

            if (dist < radius) {
                const force = Math.pow(1 - dist / radius, 2); // smoother curve
                p.vx += (dx / dist) * force * 0.4;
                p.vy += (dy / dist) * force * 0.4;
            }
        }

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }

    // Lines between particles
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 130) {
                ctx.globalAlpha = 1 - dist / 130;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
}

animate();
