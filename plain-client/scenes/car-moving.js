// initial setup:

const cameraWidth = 720;
const cameraHeight = cameraWidth / aspectRatio;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(-200, 500, 150);
scene.add(directionalLight);

// const pointLight = new THREE.PointLight(0xffffff, 0.7);
// pointLight.position.set(0, 70, 0);
// scene.add(pointLight);

const camera = new t.PerspectiveCamera(
  40,
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

const update3dPoint = (point, { x, y, z }) => {
  if (x) point.x = x;
  if (y) point.y = y;
  if (z) point.z = z;
};

const updateCarPos = (newPos) => update3dPoint(car.position, newPos);

const carMovementSpeed = {
  x: 10,
  z: 10,
};

const carInitialPosition = Object.assign({}, car.position);

// controllers:

debouncedListener('mousedown', (e) => {
  e.preventDefault();

  if (raycastIntersectsMesh(car, e.clientX, e.clientY)) {
    updateState({ draggingCar: true });
  }
});

debouncedListener('mouseup', () => {
  if (getState().draggingCar) updateState({ draggingCar: false });
});

debouncedListener('mousemove', (e) => {
  if (state.draggingCar) {
    const mappedPosition = mapScreenToBoard(
      { x: e.clientX, y: e.clientY },
      { width: boardWith, height: boardHeight },
    );

    updateCarPos(mappedPosition);
  }

  else if (raycastIntersectsMesh(car, e.clientX, e.clientY)) {
    !state.hoveringCar && updateState({ hoveringCar: true });
  }

  else updateState({ hoveringCar: false });
});

// animations: 

let animationTimelines = {};

const addTimeline = () => {
  const timeline = new TimelineMax();
  const timelineId = `${Date.now()}`;

  animationTimelines[timelineId] = timeline;

  const removeTimeline = () => {
    delete animationTimelines[timelineId];
  };

  return [timeline, removeTimeline];
}

const animateMeshChange = (mesh, propName, duration, params, callback) => {
  const [timeline, cleanup] = addTimeline();
  params.onComplete = () => {
    cleanup();
    callback();
  };

  timeline.to(mesh[propName], duration, params);
};

const animationLocks = {};

const getAnimationLocks = (name) => {
  let locks = animationLocks[name] || {};
  if (!animationLocks[name]) {
    animationLocks[name] = locks;
  }

  return locks;
};

const lockedAnimation = (lockId, mesh, propName, duration, params) => {
  const locks = getAnimationLocks(lockId);
  if (!locks[mesh.uuid]) {
    locks[mesh.uuid] = true;
    animateMeshChange(mesh, propName, duration, params, () => {
      delete locks[mesh.uuid];
    });
  }
};

const liftAnimation = () => {
  if (state.draggingCar)
    lockedAnimation('animate-up', car, 'position', 1, { y: 50, ease: Expo.easeOut });
  
  if (!state.draggingCar && car.position.y !== carInitialPosition.y)
    lockedAnimation('animate-down', car, 'position', 1, { y: 10, ease: Expo.easeOut });
};

const scaleAnimation = () => {
  if (state.hoveringCar)
    lockedAnimation('scale-up', car, 'scale', 0.4, { x: 1.25, y: 1.25, z: 1.25 })
  

  else if (car.scale.x > 1)
    lockedAnimation('scale-down', car, 'scale', 0.4, { x: 1, y: 1, z: 1 });
};

