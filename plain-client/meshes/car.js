const createWheel = () => {
  const boxGeometry = new t.BoxGeometry(12, 12, 33);
  const material = new t.MeshPhongMaterial({ color: 0x333333 });
  const wheel = new t.Mesh(boxGeometry, material);
  return wheel;
};

const createCar = () => {
  const car = new t.Group();
  const backWheels = createWheel();
  backWheels.position.x = -16;

  car.add(backWheels);

  const frontWheels = createWheel();
  frontWheels.position.x = 16;
  car.add(frontWheels);

  const body = new t.Mesh(
    new t.BoxGeometry(60, 15, 30),
    new t.MeshPhongMaterial({ color: 0x78b14b }),
  );
  body.position.y = 12;

  car.add(body);

  const cabin = new t.Mesh(
    new t.BoxGeometry(18, 12, 24),
    new t.MeshPhongMaterial({ color: 0xffffff }),
  );
  cabin.position.y = 24;
  cabin.position.x = 7;

  car.add(cabin);

  car.castShadow = true;
  car.receiveShadow = true;

  return car;
};
