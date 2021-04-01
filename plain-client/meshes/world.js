const createFloor = (width, height) => {
    const boxGeometry = new t.BoxGeometry(width, 0, height);
    const material = new t.MeshLambertMaterial({ color: 0xeaeaea });
    const floor = new t.Mesh(boxGeometry, material);


    floor.castShadow = true;
    floor.receiveShadow = true;
    
    return floor;
};