
const cameraWidth = 720;
const cameraHeight = cameraWidth / aspectRatio;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(200, 500, 300);
scene.add(directionalLight);

const camera = new t.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    2000,
);

camera.position.set(700, 600, 550);
camera.lookAt(60, 0, 60);

const floor = createFloor();

scene.add(floor);


const car = createCar();

scene.add(car);

console.log('Car initial position:', car.position);

const maxZ = 306;
const minZ = -300;

const maxX = 290;
const minX = -276;

car.position.y = 10;
car.position.x = -276;
car.position.z = -300;

const virtualPosition = {
  x: car.position.x,
  y: car.position.y,
  z: car.position.z,
};


const updatePosition = (position, { x, y, z }) => {
  if (x) position.x = x;
  if (y) position.y = y;
  if (z) position.z = z;
};

const updateCarPos = (newPos) => updatePosition(car.position, newPos);

const carMovementSpeed = {
  x: 10,
  z: 10,
};

// controls

debouncedListener('mousedown', (downEvent) => {
  downEvent.preventDefault();
  if (raycastIntersectsMesh(car, downEvent.clientX, downEvent.clientY)) {
    const unregister = debouncedListener('mousemove', (moveEvent) => {
      const { x: mappedX, y: mappedY } = mapScreenToBoard(
        { x: moveEvent.clientX, y: moveEvent.clientY },
        { width: Math.abs(minX) + maxX, height: Math.abs(minZ) + maxZ },
      );

      updateCarPos({ x: mappedX, z: mappedY })
    });

    debouncedListener('mouseup', () => {
      unregister();
    });
  }
});

// render:
renderer.render(scene, camera);

const animate = (currentFrame) => {
  renderer.render(scene, camera);
  
  requestAnimationFrame(() => animate(currentFrame + 1));
};

animate(0);
