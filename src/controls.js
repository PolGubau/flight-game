function easeOutQuad(x) {
  return 1 - (1 - x) * (1 - x);
}
let maxTiltAngle = Math.PI / 4; // Maximum tilt angle in radians

export let controls = {
  a: false,
  d: false,
  w: false,
  s: false,
  rotateLeft: false,
  rotateRight: false,
  rotateUp: false,
  rotateDown: false,
  shift: false,
};
// window.addEventListener("touchstart", handleTouchStart, false);
// window.addEventListener("touchend", handleTouchEnd, false);

// function handleTouchStart(event) {
//   // Prevent default touch behavior if needed
//   // event.preventDefault();

//   for (let i = 0; i < event.touches.length; i++) {
//     const touch = event.touches[i];
//     handleTouch(touch.identifier, true);
//   }
// }

// function handleTouchEnd(event) {
//   // Prevent default touch behavior if needed
//   // event.preventDefault();

//   for (let i = 0; i < event.changedTouches.length; i++) {
//     const touch = event.changedTouches[i];
//     handleTouch(touch.identifier, false);
//   }
// }

// function handleTouch(touchId, isPressed) {
//   const screenWidth = window.innerWidth;
//   const screenHeight = window.innerHeight;

//   // Find the touch object based on touchId
//   const touch = Array.from(event.touches).find((t) => t.identifier === touchId);
//   if (!touch) return; // Touch not found, exit

//   const touchX = touch.clientX;
//   const touchY = touch.clientY;

//   // Adjust controls based on touch position
//   if (touchX < screenWidth / 2) {
//     controls["a"] = isPressed;
//     controls["d"] = !isPressed;
//   } else {
//     controls["d"] = isPressed;
//     controls["a"] = !isPressed;
//   }

//   if (touchY < screenHeight / 2) {
//     controls["w"] = isPressed;
//     controls["s"] = !isPressed;
//   } else {
//     controls["s"] = isPressed;
//     controls["w"] = !isPressed;
//   }

//   // Stop movement when touch ends
//   if (!isPressed) {
//     controls["a"] = false;
//     controls["d"] = false;
//     controls["w"] = false;
//     controls["s"] = false;
//   }
// }

// device turn

window.addEventListener("deviceorientation", handleOrientation, true);
// Function to handle device orientation change
function handleOrientation(event) {
  // Get the device orientation angles
  const alpha = event.alpha;
  const beta = event.beta;
  const gamma = event.gamma;

  // Calculate the tilt angle
  const tiltAngle = Math.atan2(Math.sqrt(gamma * gamma + beta * beta), alpha);

  // Adjust the controls based on the tilt angle
  if (tiltAngle > maxTiltAngle) {
    controls["a"] = true;
    controls["d"] = false;
  } else if (tiltAngle < -maxTiltAngle) {
    controls["d"] = true;
    controls["a"] = false;
  } else {
    controls["a"] = false;
    controls["d"] = false;
  }

  if (beta > maxTiltAngle) {
    controls["w"] = true;
    controls["s"] = false;
  } else if (beta < -maxTiltAngle) {
    controls["s"] = true;
    controls["w"] = false;
  } else {
    controls["w"] = false;
    controls["s"] = false;
  }
}

window.addEventListener("keydown", (e) => {
  controls[e.key.toLowerCase()] = true;
});
window.addEventListener("keyup", (e) => {
  controls[e.key.toLowerCase()] = false;
});

let maxVelocity = 0.04;
let jawVelocity = 0;
let pitchVelocity = 0;
let planeSpeed = 0.006;
export let turbo = 2;

export function updatePlaneAxis(x, y, z, planePosition, camera) {
  jawVelocity *= 0.95;
  pitchVelocity *= 0.95;

  // Function to handle device orientation change

  if (Math.abs(jawVelocity) > maxVelocity)
    jawVelocity = Math.sign(jawVelocity) * maxVelocity;

  if (Math.abs(pitchVelocity) > maxVelocity)
    pitchVelocity = Math.sign(pitchVelocity) * maxVelocity;

  if (controls["a"]) {
    jawVelocity += 0.0025;
  }

  if (controls["d"]) {
    jawVelocity -= 0.0025;
  }

  if (controls["w"]) {
    pitchVelocity -= 0.0025;
  }

  if (controls["s"]) {
    pitchVelocity += 0.0025;
  }
  if (controls["rotateDown"]) {
    pitchVelocity += 0.0015;
  }
  if (controls["rotateUp"]) {
    pitchVelocity -= 0.0015;
  }
  if (controls["rotateLeft"]) {
    jawVelocity += 0.001;
  }
  if (controls["rotateRight"]) {
    jawVelocity -= 0.001;
  }

  if (controls["r"]) {
    jawVelocity = 0;
    pitchVelocity = 0;
    turbo = 0;
    x.set(1, 0, 0);
    y.set(0, 1, 0);
    z.set(0, 0, 1);
    planePosition.set(0, 3, 7);
  }

  x.applyAxisAngle(z, jawVelocity);
  y.applyAxisAngle(z, jawVelocity);

  y.applyAxisAngle(x, pitchVelocity);
  z.applyAxisAngle(x, pitchVelocity);

  x.normalize();
  y.normalize();
  z.normalize();

  // plane position & velocity
  if (controls.shift) {
    turbo += 0.025;
  } else {
    turbo *= 0.95;
  }
  turbo = Math.min(Math.max(turbo, 0), 1);

  let turboSpeed = easeOutQuad(turbo) * 0.02;

  camera.fov = 45 + turboSpeed * 900;
  camera.updateProjectionMatrix();

  planePosition.add(z.clone().multiplyScalar(-planeSpeed - turboSpeed));
}
