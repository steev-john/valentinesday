document.addEventListener("DOMContentLoaded", () => {
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const container = document.querySelector('.container');
    const messages = ['Try harder! 😜', 'Nope! 🙅♀️', 'Not today! 😅', 'Catch me! 🏃♀️'];
    const MIN_DISTANCE = 80;
    let isMoving = false;

    const scaleFactor = 1.2;
    let yesBtnScale = 1;

    noBtn.addEventListener("click", () => {
        yesBtnScale *= scaleFactor;
        yesBtn.style.transform = `scale(${yesBtnScale})`;
        yesBtn.style.transition = "transform 0.2s ease-in-out";
    });

    function getValidPosition() {
        const containerRect = container.getBoundingClientRect();
        const noRect = noBtn.getBoundingClientRect();
        const maxX = containerRect.width - noRect.width;
        const maxY = containerRect.height - noRect.height;

        let isValidPosition = false;
        let newX, newY;
        let attempts = 0;

        while (!isValidPosition && attempts < 100) {
            newX = Math.random() * maxX;
            newY = Math.random() * maxY;

            const yesRect = yesBtn.getBoundingClientRect();
            const yesCenterX = yesRect.left - containerRect.left + yesRect.width / 2;
            const yesCenterY = yesRect.top - containerRect.top + yesRect.height / 2;
            const noCenterX = newX + noRect.width / 2;
            const noCenterY = newY + noRect.height / 2;

            const distance = Math.sqrt(
                Math.pow(noCenterX - yesCenterX, 2) +
                Math.pow(noCenterY - yesCenterY, 2)
            );

            isValidPosition = distance > MIN_DISTANCE;
            attempts++;
        }

        return { x: newX, y: newY };
    }

    function moveButton() {
        if (isMoving) return;
        isMoving = true;

        const newPos = getValidPosition();
        noBtn.style.left = `${newPos.x}px`;
        noBtn.style.top = `${newPos.y}px`;
        noBtn.textContent = messages[Math.floor(Math.random() * messages.length)];

        noBtn.style.transition = 'left 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';

        setTimeout(() => {
            isMoving = false;
        }, 400);
    }

    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveButton();
    });

    noBtn.addEventListener('mouseover', () => {
        moveButton();
    });

    noBtn.addEventListener('mouseout', () => {
        moveButton();
    });

    window.addEventListener('resize', moveButton);

    function createHearts(count = 50) {
        const container = document.getElementById('heartsContainer');
        const colors = ['#ff3366', '#ff1493', '#ff69b4', '#ff85a2'];

        for(let i = 0; i < count; i++) {
            const heart = document.createElement('div');
            heart.className = 'heart';
            heart.innerHTML = '❤️';

            const x1 = Math.random() * 40 - 20;
            const y1 = Math.random() * 30;
            const x2 = Math.random() * 80 - 40;
            const y2 = Math.random() * 60 + 30;

            heart.style.cssText = `
                left: 50%;
                top: 50%;
                color: ${colors[Math.floor(Math.random() * colors.length)]};
                font-size: ${Math.random() * 40 + 20}px;
                --x1: ${x1}vw;
                --y1: ${y1}vh;
                --x2: ${x2}vw;
                --y2: ${y2}vh;
                animation-duration: ${Math.random() * 1 + 2}s;
            `;

            container.appendChild(heart);
            setTimeout(() => heart.remove(), 2000);
        }
    }

    function showResponse(yes) {
        if(yes) {
            document.getElementById('message').style.display = 'block';
            document.querySelector('.options').style.display = 'none';
            triggerConfetti();
            
            createHearts(100);
            setTimeout(() => createHearts(75), 200);
            setTimeout(() => createHearts(75), 400);

            const heartInterval = setInterval(() => {
                createHearts(Math.random() * 10 + 10);
            }, 1000);

            setTimeout(() => clearInterval(heartInterval), 5000);
        }
    }

    yesBtn.addEventListener("click", () => {
        showResponse(true);
    });

    function triggerConfetti() {
        const count = 200;
        const defaults = {
            origin: { y: 0.7 },
            colors: ['#ff3366', '#ffffff', '#ffd700'],
            shapes: ['circle', 'square']
        };

        function fire(particleRatio, opts) {
            confetti(Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio)
            }));
        }

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
    }

    moveButton();
});
