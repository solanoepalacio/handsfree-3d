// math helper functions
const getVertex = (startingPoint, xSpan, ySpan) => {
  return {
    x: startingPoint.x + (xSpan / 2),
    y: startingPoint.y + ySpan
  };
};

const getQuadraticEquation = (startingPoint, vertex) => {
  const { x: x0, y: y0 } = startingPoint;
  const { x: xV, y: yV } = vertex;
  const t = Math.sqrt(y0 - yV);
  const d = x0 - xV
  const a = t / d; // https://www.youtube.com/watch?v=DHYPjhQNHIo&ab_channel=3Blue1Brown
  return (currentX) => {
    console.log({ a, x0, xV, yV })
    return a * Math.pow(currentX - xV, 2) + yV;
  };
};

const getInterpolator = (initialValue, range, steps, interpolationFunction) => {
  const stepSize = range / steps;
  const vals = new Array(steps).fill(null).map(
    (_, i) => {
      const x = initialValue + (i * stepSize);
      const y = interpolationFunction(x);
      return { x, y };
    }
  );
  return (frameNumber) => vals[frameNumber] || null;
};

const buildCuadraticInterpolator = (startingPoint, xRange, yRange, steps) => {
  const vertex = getVertex(
    startingPoint,
    xRange,
    yRange,
  );

  const interpolationFunction = getQuadraticEquation(startingPoint, vertex);

  return getInterpolator(startingPoint.x, xRange, steps, interpolationFunction);
};

// mesh constructors:

const cameraWidth = 320;
const cameraHeight = cameraWidth / aspectRatio;

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(200, 500, 300);
scene.add(directionalLight);

const camera = new t.OrthographicCamera(
  cameraWidth / -2,
  cameraWidth / 2,
  cameraHeight / 2,
  cameraHeight / -2,
  0,
  1000,
);

camera.position.set(200, 200, 200);
camera.lookAt(60, 10, -60);

car = createCar();

scene.add(car);

// render:
renderer.render(scene, camera);

const animationFrames = 90; // ~ 1.5;

const startingPoint = { x: car.position.x, y: car.position.y };

const getPositionFromFrame = buildCuadraticInterpolator(startingPoint, 170, -20, 90);

const animate = (currentFrame) => {
  const newPosition = getPositionFromFrame(currentFrame);
  if (newPosition) {
    car.position.z = newPosition.y / 6;
    car.position.x = newPosition.x;
  }

  car.rotation.y += 0.03;
  renderer.render(scene, camera);

  if (currentFrame < animationFrames) requestAnimationFrame(() => animate(currentFrame + 1));
};

animate(0);