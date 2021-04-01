
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

camera.position.set(0, 600, 800);
camera.lookAt(0, 10, 0);

const boardWith = 1280;
const boardHeight = boardWith / aspectRatio;
const floor = createFloor(boardWith, boardHeight);

scene.add(floor);

const car = createCar();

scene.add(car);

console.log('Car initial position:', car.position);

const maxZ = 306;
const minZ = -300;

const maxX = 290;
const minX = -276;

car.position.y = 10;
car.position.x = 0;
car.position.z = 0;
car.rotation.y = -0.5;

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
      const mappedPosition = mapScreenToBoard(
        { x: moveEvent.clientX, y: moveEvent.clientY },
        { width: boardWith, height: boardHeight },
      );
      updateCarPos(mappedPosition)
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
