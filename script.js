document.addEventListener("DOMContentLoaded", () => {
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const container = document.querySelector('.container');  // The first container where the No button should move
    const messages = ['Try harder! 😜', 'Nope! 🙅♀️', 'Not today! 😅', 'Catch me! 🏃♀️'];
    const MIN_DISTANCE = 80;
    let isMoving = false;

    const scaleFactor = 1.2; // The factor by which the Yes button will grow each time the No button is clicked
    let yesBtnScale = 1; // Initial scale factor for the Yes button

    // Function to grow the "Yes" button when the "No" button is clicked
    noBtn.addEventListener("click", () => {
        yesBtnScale *= scaleFactor; // Increase the scale factor by multiplying
        yesBtn.style.transform = `scale(${yesBtnScale})`; // Apply the new scale to the Yes button
        yesBtn.style.transition = "transform 0.2s ease-in-out"; // Smooth transition for the scaling effect
    });

    // Function to get valid position for the No button inside the container
    function getValidPosition() {
        const containerRect = container.getBoundingClientRect(); // Get the size and position of the container
        const noRect = noBtn.getBoundingClientRect(); // Get the size of the No button

        const maxX = containerRect.width - noRect.width; // Prevent the button from going out of container on the right
        const maxY = containerRect.height - noRect.height; // Prevent the button from going out of container on the bottom

        let isValidPosition = false;
        let newX, newY;
        let attempts = 0;

        // Try to find a valid position for the No button that does not collide with the Yes button
        while (!isValidPosition && attempts < 100) {
            newX = Math.random() * maxX; // Get random X within container's width
            newY = Math.random() * maxY; // Get random Y within container's height

            const yesRect = yesBtn.getBoundingClientRect();
            const yesCenterX = yesRect.left + yesRect.width / 2;
            const yesCenterY = yesRect.top + yesRect.height / 2;
            const noCenterX = newX + noRect.width / 2;
            const noCenterY = newY + noRect.height / 2;

            const distance = Math.sqrt(
                Math.pow(noCenterX - yesCenterX, 2) +
                Math.pow(noCenterY - yesCenterY, 2)
            );

            isValidPosition = distance > MIN_DISTANCE; // Ensure the distance between buttons is greater than MIN_DISTANCE

            attempts++;
        }

        // Return the new valid position for the No button
        return { x: newX, y: newY };
    }

    // Function to move the No button within the container
    function moveButton() {
        if (isMoving) return;
        isMoving = true;

        const newPos = getValidPosition(); // Get a valid position for the No button inside the container

        // Set the No button's new position within the bounds of the container
        noBtn.style.transform = `translate(${newPos.x}px, ${newPos.y}px)`;
        noBtn.textContent = messages[Math.floor(Math.random() * messages.length)];

        noBtn.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';

        setTimeout(() => {
            noBtn.style.transition = '';
            isMoving = false;
        }, 400);
    }

    // Add touchstart and mouseover listeners to move the No button
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

    window.addEventListener('resize', moveButton); // Resize the No button's position on window resize

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

    // Function to show response when Yes button is clicked
    function showResponse(yes) {
        if(yes) {
            document.getElementById('message').style.display = 'block'; // Show Thank You message
            document.querySelector('.options').style.display = 'none'; // Hide options (Yes/No buttons)
            triggerConfetti();
            
            createHearts(100); // Create heart animations
            setTimeout(() => createHearts(75), 200);
            setTimeout(() => createHearts(75), 400);

            const heartInterval = setInterval(() => {
                createHearts(Math.random() * 10 + 10);
            }, 1000);

            setTimeout(() => clearInterval(heartInterval), 5000);
        }
    }

    // Event listener for Yes button
    yesBtn.addEventListener("click", () => {
        showResponse(true); // Show Thank You message when Yes button is clicked
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

    moveButton(); // Initial move for the No button
});
