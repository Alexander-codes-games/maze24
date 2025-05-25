const joystick = document.createElement("div");
joystick.id = "joystick-inner";
document.getElementById("joystick").appendChild(joystick);

let dragging = false;
let startX, startY;
let moveX = 0;
let moveY = 0;

const maxDistance = 40; // max joystick move radius

joystick.addEventListener("pointerdown", (e) => {
  dragging = true;
  startX = e.clientX;
  startY = e.clientY;
  joystick.style.transition = "none";
  e.target.setPointerCapture(e.pointerId);
});

joystick.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  const dx = e.clientX - startX;
  const dy = e.clientY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx);

  const limitedDistance = Math.min(maxDistance, distance);
  moveX = Math.cos(angle) * limitedDistance;
  moveY = Math.sin(angle) * limitedDistance;

  joystick.style.transform = `translate(${moveX}px, ${moveY}px)`;
});

joystick.addEventListener("pointerup", (e) => {
  dragging = false;
  moveX = 0;
  moveY = 0;
  joystick.style.transition = "transform 0.3s ease";
  joystick.style.transform = `translate(0, 0)`;
});

function updatePlayerPosition() {
  const speed = 2;
  // Normalize movement to max 1 per axis to avoid fast diagonal speed
  let normX = moveX / maxDistance;
  let normY = moveY / maxDistance;

  player.x += normX * speed;
  player.y += normY * speed;

  // Keep player inside canvas bounds
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));
}

function gameLoop() {
  updatePlayerPosition();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
