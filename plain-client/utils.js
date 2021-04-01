
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

const getBoardOriginFromDimensions = ({ width, height }) => {
  return {
    x: 0 - width / 2,
    z: 0 - height / 2,
  };
};

const mapScreenToBoard = (screenPoint, boardDimentions) => {
  const normalizedX = screenPoint.x / window.innerWidth;
  const normalizedY = screenPoint.y / window.innerHeight;
  const boardOrigin = getBoardOriginFromDimensions(boardDimentions);
  return {
    x: boardOrigin.x + (normalizedX * boardDimentions.width),
    z: boardOrigin.z + (normalizedY * boardDimentions.height),
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
