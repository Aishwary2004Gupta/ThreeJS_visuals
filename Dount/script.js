const torus = document.querySelector('.torus');
const glow = document.querySelector('.glow');

let time = 0;
const speed = 1;

function animate() {
  time += 0.01 * speed;
  const rotationX = Math.sin(time) * 30;
  const rotationY = Math.cos(time) * 30;

  torus.style.transform = `rotate(${time * 50}deg) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  glow.style.transform = `translate(-50%, -50%) scale(${1 + Math.sin(time) * 0.2})`;

  requestAnimationFrame(animate);
}

animate();