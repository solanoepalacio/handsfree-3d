const HAND_CONNECTIONS = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]];

const getHandLandmarks = () => handsfree.data.hands && handsfree.data.hands.landmarks || [];

const defaultLandmarkStyle = {
  color: 'red',
  size: 3,
};

const drawLandmark = ({ x, y }, canvasContext, { color, size } = defaultLandmarkStyle) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, size, size);
};

const drawLine = (canvasContext, { x: x0, y: y0 }, { x: xf, y: yf }, color = 'green') => {
  canvasContext.strokeStyle = color;
  canvasContext.lineWidth = 1.5;
  canvasContext.lineCap = 'round';
  
  canvasContext.beginPath();

  canvasContext.moveTo(x0, y0);
  canvasContext.lineTo(xf, yf);
  canvasContext.stroke();

  canvasContext.closePath();
};

const drawAllLandmarks = (handLandmarks, canvasContext, canvasSize) => {
  const { width, height } = canvasSize;
  handLandmarks.forEach(({ x, y }) => {
    drawLandmark({ x: x * width, y: y * height }, canvasContext);
  });
};

const drawAllConnectors = (handLandmarks, canvasContext, canvasSize) => {
  const { width, height } = canvasSize;
  HAND_CONNECTIONS.forEach(([startIndex, endIndex]) => {
    const startPoint = handLandmarks[startIndex];
    const endpoint = handLandmarks[endIndex];

    if (startPoint && endpoint) {
      drawLine(
        canvasContext,
        { x: startPoint.x * width, y: startPoint.y * height },
        { x: endpoint.x * width, y: endpoint.y * height },
      );
    }
  });
};

const getIndexPinch = () => {
  const pinchState = handsfree.data.hands &&
    handsfree.data.hands.pinchState ||
    null;

  if (!pinchState) return null;
  const [_, rightHandPinches] = pinchState;
  
  return rightHandPinches[0] === 'held';
}
const getPinchFingers = () => {
  const rightHand = getRightHand();
  if (rightHand) {
    const pinch = getIndexPinch();
    return [ rightHand[4], rightHand[8], pinch ];
  }

  else return [ null, null, null ];
};

const getRightHand = () => {
  const landmarks = getHandLandmarks();
  return landmarks.length ? landmarks[1] : null;
};

const updateHands = () => {
  if (!handsfree.debug.$video) return;

  videoCanvasContext.drawImage(
    handsfree.debug.$video,
    0,
    0,
    videoCanvas.width,
    videoCanvas.height,
  );

  
  const rightHand = getRightHand();
  

  rightHand && drawAllLandmarks(rightHand, videoCanvasContext, videoCanvas);
  rightHand && drawAllConnectors(rightHand, videoCanvasContext, videoCanvas);

  drawingCanvasContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  rightHand && drawAllLandmarks(rightHand, drawingCanvasContext, drawingCanvas);
  rightHand && drawAllConnectors(rightHand, drawingCanvasContext, drawingCanvas);

};
