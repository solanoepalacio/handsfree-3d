

const raycastIntersectedObjects = (scene, x, y) => {
  const proyectedPoint = new t.Vector2();

  proyectedPoint.x = 2 * ( x / window.innerWidth ) - 1;
  proyectedPoint.y = 1 - 2 * ( y / window.innerHeight );
  raycaster.setFromCamera(proyectedPoint, camera);

  return raycaster.intersectObjects(scene.children, true);
};

const raycastIntersectsMesh = (mesh, x, y) => {
  const intersected = raycastIntersectedObjects(mesh, x, y);
  return !!intersected.find((intersection) => {
    return intersection.object.uuid === mesh.uuid || intersection.object.parent.uuid === mesh.uuid;
  });
};

const mapScreenToBoard = (screenPoint, boardDimentions) => {
  const abstractX = screenPoint.x / window.innerWidth * 2 - 1;
  const abstractY = screenPoint.y / window.innerHeight * 2 - 1;
  return {
    x: abstractX * boardDimentions.width,
    y: abstractY * boardDimentions.height,
  };
}

const debouncedListener = function (event, callback) {
  let execution;
  const listener = (e) => {
    if (execution) window.cancelAnimationFrame(execution);

    execution = requestAnimationFrame(() => callback(e));
  };

  window.addEventListener(event, listener);

  return function unregister () {
    window.removeEventListener(event, listener);
  }
};
