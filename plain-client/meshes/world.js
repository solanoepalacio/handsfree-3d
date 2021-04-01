const createFloor = () => {
    const boxGeometry = new t.BoxGeometry(640, 0, 640);
    const material = new t.MeshLambertMaterial({ color: 0xeaeaea });
    const floor = new t.Mesh(boxGeometry, material);


    floor.castShadow = true;
    floor.receiveShadow = true;
    
    return floor;
};