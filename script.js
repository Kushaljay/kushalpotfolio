const canvas = document.getElementById("fluid-canvas");


if (canvas) {
    const ctx = canvas.getContext("2d");

    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    let mouse = { x: width / 2, y: height / 2, px: width / 2, py: height / 2, down: false };

    window.addEventListener("mousemove", e => {
        mouse.px = mouse.x;
        mouse.py = mouse.y;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mousedown", () => mouse.down = true);
    window.addEventListener("mouseup", () => mouse.down = false);

    let particles = [];
    const NUM = 2000;

    for (let i = 0; i < NUM; i++) {
        particles.push({ x: Math.random() * width, y: Math.random() * height, vx: 0, vy: 0 });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        const mouseVX = mouse.x - mouse.px;
        const mouseVY = mouse.y - mouse.py;

        const interactionRadius = 25;
        const radiusSq = interactionRadius * interactionRadius;

        for (let i = 0; i < NUM; i++) {
            let p1 = particles[i];
            for (let j = i + 1; j < NUM; j++) {
                let p2 = particles[j];
                let dx = p2.x - p1.x;
                let dy = p2.y - p1.y;
                let distSq = dx * dx + dy * dy;

                if (distSq < radiusSq && distSq > 0.0001) {
                    let dist = Math.sqrt(distSq);
                    let nx = dx / dist;
                    let ny = dy / dist;

                    let overlap = interactionRadius - dist;
                    let pressure = overlap * 0.02;

                    p1.vx -= nx * pressure;
                    p1.vy -= ny * pressure;
                    p2.vx += nx * pressure;
                    p2.vy += ny * pressure;

                    let dvx = p2.vx - p1.vx;
                    let dvy = p2.vy - p1.vy;

                    let viscosity = 0.05;

                    p1.vx += dvx * viscosity;
                    p1.vy += dvy * viscosity;
                    p2.vx -= dvx * viscosity;
                    p2.vy -= dvy * viscosity;
                }
            }
        }

        particles.forEach(p => {
            let dx = p.x - mouse.x;
            let dy = p.y - mouse.y;
            let distSq = dx * dx + dy * dy;

            if (mouse.down) {
                const radius = 120;
                if (distSq < radius * radius) {
                    const dist = Math.sqrt(distSq);
                    const gradient = 1 - dist / radius;
                    p.vx += mouseVX * 0.08 * gradient;
                    p.vy += mouseVY * 0.08 * gradient;
                }
            } else {
                const radius = 80;
                if (distSq < radius * radius) {
                    const dist = Math.sqrt(distSq);
                    const gradient = 1 - dist / radius;
                    p.vx += mouseVX * 0.01 * gradient;
                    p.vy += mouseVY * 0.01 * gradient;
                }
            }

            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.96;
            p.vy *= 0.96;

            if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;

            const fadeStart = height - 220;
            let alpha = 1;
            if (p.y > fadeStart) {
                alpha = 1 - (p.y - fadeStart) / 220;
            }

            ctx.fillStyle = `rgba(100,100,100,${alpha})`;

            // ✅ SIZE BASED ON SPEED (NEW)
            let speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            let size = 1.2 + Math.min(speed * 0.8, 2);
            // small boost, capped so it doesn't explode

            ctx.beginPath();
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
        });

        mouse.px = mouse.x;
        mouse.py = mouse.y;

        requestAnimationFrame(draw);
    }

    draw();
}



const navbar = document.getElementById("navbar");

if (navbar) {
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY;

        // only react to meaningful scroll
        if (Math.abs(delta) > 10) {

            if (delta > 0 && currentScrollY > 80) {
                // scrolling down
                navbar.classList.add("hidden");
            } else {
                // scrolling up
                navbar.classList.remove("hidden");
            }

            lastScrollY = currentScrollY;
        }
    });
}