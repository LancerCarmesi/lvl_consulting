// assets/js/login.js
// Módulo de partículas animadas estilo "conexiones" con movimiento fluido

(function () {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    let ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Configuración de partículas
    let particlesArray = [];
    const PARTICLE_COUNT = 130; // Aumentado para más dinamismo
    const CONNECTION_DISTANCE = 150;
    const PARTICLE_RADIUS = 2.2;

    // Colores de partículas: tonos azules/cyan claros para contraste con fondo oscuro
    const colors = ['#4f9eff', '#7ab3ff', '#a3c6ff', '#3c8eff', '#5fa7ff', '#80b4ff', '#6aa9ff'];

    class Particle {
        constructor(x, y, vx, vy, size, color) {
            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.size = size;
            this.color = color;
            this.originalX = x;
            this.originalY = y;
        }

        draw() {
            if (!ctx) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            // Efecto de brillo suave
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#80b3ff';
            ctx.shadowBlur = 0;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Rebote en bordes
            if (this.x < 0 || this.x > width) {
                this.vx = -this.vx;
                this.x = Math.min(Math.max(this.x, 0), width);
            }
            if (this.y < 0 || this.y > height) {
                this.vy = -this.vy;
                this.y = Math.min(Math.max(this.y, 0), height);
            }

            // Movimiento orgánico adicional
            if (Math.random() < 0.02) {
                this.vx += (Math.random() - 0.5) * 0.3;
                this.vy += (Math.random() - 0.5) * 0.3;
                // limitar velocidad máxima
                const maxSpeed = 0.6;
                this.vx = Math.min(maxSpeed, Math.max(-maxSpeed, this.vx));
                this.vy = Math.min(maxSpeed, Math.max(-maxSpeed, this.vy));
            }

            // Pequeña fuerza de atracción hacia el centro para mantener las partículas en el canvas
            const centerX = width / 2;
            const centerY = height / 2;
            const dxToCenter = centerX - this.x;
            const dyToCenter = centerY - this.y;
            const distanceToCenter = Math.sqrt(dxToCenter * dxToCenter + dyToCenter * dyToCenter);
            if (distanceToCenter > width * 0.6) {
                this.vx += dxToCenter * 0.0005;
                this.vy += dyToCenter * 0.0005;
            }
        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            let x = Math.random() * width;
            let y = Math.random() * height;
            let vx = (Math.random() - 0.5) * 0.8;
            let vy = (Math.random() - 0.5) * 0.8;
            let size = Math.random() * 2.5 + 1.2;
            let color = colors[Math.floor(Math.random() * colors.length)];
            particlesArray.push(new Particle(x, y, vx, vy, size, color));
        }
    }

    // Dibujar conexiones entre partículas cercanas
    function drawConnections() {
        if (!ctx) return;
        for (let i = 0; i < particlesArray.length; i++) {
            for (let j = i + 1; j < particlesArray.length; j++) {
                const dx = particlesArray[i].x - particlesArray[j].x;
                const dy = particlesArray[i].y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < CONNECTION_DISTANCE) {
                    // La opacidad de la línea depende de la distancia
                    const opacity = 1 - (distance / CONNECTION_DISTANCE);
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                    ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                    ctx.strokeStyle = `rgba(100, 160, 255, ${opacity * 0.4})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();

                    // Efecto de brillo en las conexiones más cercanas
                    if (distance < 50) {
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
                        ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
                        ctx.strokeStyle = `rgba(150, 200, 255, ${opacity * 0.6})`;
                        ctx.lineWidth = 2;
                        ctx.stroke();
                    }
                }
            }
        }
    }

    function animateParticles() {
        if (!ctx) return;
        ctx.clearRect(0, 0, width, height);

        for (let p of particlesArray) {
            p.update();
            p.draw();
        }
        drawConnections();
        requestAnimationFrame(animateParticles);
    }

    function handleResize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initParticles();
    }

    // Configuración inicial
    function setupCanvas() {
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');
        initParticles();
        animateParticles();
        window.addEventListener('resize', handleResize);
    }

    setupCanvas();

    // Efecto de interacción con el mouse
    let mouseX = null, mouseY = null;
    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Influencia en partículas cercanas
        for (let p of particlesArray) {
            const dx = p.x - mouseX;
            const dy = p.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const angle = Math.atan2(dy, dx);
                const force = (120 - dist) / 800;
                p.vx += Math.cos(angle) * force * 0.3;
                p.vy += Math.sin(angle) * force * 0.3;
                // límite de velocidad
                const maxSpd = 0.6;
                p.vx = Math.min(maxSpd, Math.max(-maxSpd, p.vx));
                p.vy = Math.min(maxSpd, Math.max(-maxSpd, p.vy));
            }
        }
    });

    canvas.addEventListener('mouseleave', () => {
        mouseX = null;
        mouseY = null;
    });
})();