const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');

const colors = ['#1a1a1a', '#2d2d2d', '#333333', '#111111', '#222222', '#0d0d0d', '#3d3d3d', '#444444'];

let currentAngle = 0;
let isSpinning = false;

function getSegments() {
    return ['$1,000,000', '¥1,000,000', '$50,000,000', '₦100,000,000', '$20,000', 'DEATH', '$25,000', 'Try-again'];
}

function drawWheel() {
    const segments = getSegments();
    const numSegments = segments.length;
    const arcSize = (2 * Math.PI) / numSegments;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 190;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    segments.forEach((segment, i) => {
        const startAngle = currentAngle + i * arcSize;
        const endAngle = startAngle + arcSize;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + arcSize / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(segment, radius - 10, 5);
        ctx.restore();
    });

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Draw pointer
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 10, centerY - 15);
    ctx.lineTo(centerX + radius + 10, centerY + 15);
    ctx.lineTo(centerX + radius + 40, centerY);
    ctx.fillStyle = 'red';
    ctx.fill();
}

function spin() {
    if (isSpinning) return;
    isSpinning = true;
    spinBtn.disabled = true;

    const spinAmount = Math.random() * 10 + 5;
    let speed = spinAmount;

    function animate() {
        speed *= 0.98;
        currentAngle += speed * 0.1;
        drawWheel();

        if (speed > 0.01) {
            requestAnimationFrame(animate);
        } else {
            isSpinning = false;
            spinBtn.disabled = false;
            getResult();
        }
    }
    animate();
}

function getResult() {
    const segments = getSegments();
    const numSegments = segments.length;
    const arcSize = (2 * Math.PI) / numSegments;
    const normalizedAngle = ((Math.PI * 2) - (currentAngle % (Math.PI * 2))) % (Math.PI * 2);
    const index = Math.floor(normalizedAngle / arcSize) % numSegments;
    alert('🎉 You landed on: ' + segments[index]);
}

spinBtn.addEventListener('click', spin);
drawWheel();


const particleCanvas = document.getElementById('particles');
const pCtx = particleCanvas.getContext('2d');
particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

const particles = [];

function createSpark() {
    return {
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        length: Math.random() * 4 + 1,
        speedX: Math.random() * 4 - 2,
        speedY: Math.random() * 4 - 2,
        opacity: 1,
        decay: Math.random() * 0.02 + 0.01,
        color: `hsl(${Math.random() * 30 + 10}, 100%, 60%)`
    };
}

for (let i = 0; i < 300; i++) {
    particles.push(createSpark());
}

function animateParticles() {
    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    particles.forEach((p, i) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.05;
        p.opacity -= p.decay;

        if (p.opacity <= 0) {
            particles[i] = createSpark();
        }

        pCtx.save();
        pCtx.globalAlpha = p.opacity;
        pCtx.strokeStyle = p.color;
        pCtx.lineWidth = 1;
        pCtx.beginPath();
        pCtx.moveTo(p.x, p.y);
        pCtx.lineTo(p.x + p.length, p.y + p.length);
        pCtx.stroke();
        pCtx.restore();
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener('resize', () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
});

function getResult() {
    const segments = getSegments();
    const numSegments = segments.length;
    const arcSize = (2 * Math.PI) / numSegments;
    const normalizedAngle = ((Math.PI * 2) - (currentAngle % (Math.PI * 2))) % (Math.PI * 2);
    const index = Math.floor(normalizedAngle / arcSize) % numSegments;
    
    const popup = document.getElementById('popup');
    const popupResult = document.getElementById('popupResult');
    popupResult.textContent = segments[index];
    popup.classList.add('active');
}

document.getElementById('popupClose').addEventListener('click', () => {
    document.getElementById('popup').classList.remove('active');
});

const smokeParticles = [];

for (let i = 0; i < 15; i++) {
    smokeParticles.push({
        x: Math.random() * particleCanvas.width,
        y: particleCanvas.height + Math.random() * 100,
        size: Math.random() * 200 + 100,
        speedY: Math.random() * 1 + 0.5,
        speedX: Math.random() * 0.8 - 0.4,
        opacity: Math.random() * 0.15 + 0.08
    });
}

function animateSmoke() {
    smokeParticles.forEach(p => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.size += 0.3;
        p.opacity -= 0.0002;

        if (p.y < -p.size || p.opacity <= 0) {
            p.x = Math.random() * particleCanvas.width;
            p.y = particleCanvas.height + 100;
            p.size = Math.random() * 150 + 50;
            p.opacity = Math.random() * 0.07 + 0.02;
        }

        const gradient = pCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        gradient.addColorStop(0, `rgba(150, 0, 0, ${p.opacity})`);
        gradient.addColorStop(0.5, `rgba(150, 0, 0, ${p.opacity*0.5})`);
        gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);

        pCtx.beginPath();
        pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        pCtx.fillStyle = gradient;
        pCtx.fill();
    });

    requestAnimationFrame(animateSmoke);
}

animateSmoke();