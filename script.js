// Matrix rain effect
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 35);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        // Simulate access delay
        document.querySelector('.btn').textContent = '► VERIFYING CREDENTIALS...';

        setTimeout(() => {
            document.getElementById('loginPage').classList.add('hidden');
            document.getElementById('dashboardPage').style.display = 'block';
            document.getElementById('displayUsername').textContent = username.toUpperCase();
            document.querySelector('.btn').textContent = '► INITIATE ACCESS ◄';
        }, 1500);
    } else {
        alert('⚠ ACCESS DENIED: MISSING CREDENTIALS ⚠');
    }
}

function logout() {
    if (confirm('⚠ TERMINATE SESSION? ALL UNSAVED DATA WILL BE LOST')) {
        document.getElementById('loginPage').classList.remove('hidden');
        document.getElementById('dashboardPage').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }
}

document.getElementById('password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        login();
    }
});

// Typing sound simulation
const inputs = document.querySelectorAll('input');
inputs.forEach(input => {
    input.addEventListener('input', function() {
        // Add subtle glow on typing
        this.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.8)';
        setTimeout(() => {
            this.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.3)';
        }, 100);
    });
});