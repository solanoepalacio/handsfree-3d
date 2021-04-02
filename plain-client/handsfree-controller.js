const HAND_CONNECTIONS = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]];

const getHandLandmarks = () => handsfree.data.hands && handsfree.data.hands.landmarks || [];

const drawLandmark = ({ x, y }, canvasContext, color = 'red') => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(x, y, 3, 3);
};

const drawLine = (canvasContext, { x: x0, y: y0 }, { x: xf, y: yf }, color = 'green') => {
  canvasContext.beginPath();
  canvasContext.strokeStyle = color;
  canvasContext.lineWidth = 1.5;
  canvasContext.lineCap = 'round';
  

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


const updateVideo = () => {
  // console.log('updateing video', handsfree.debug.$video);
  if (!handsfree.debug.$video) return;

  videoCanvasContext.drawImage(
    handsfree.debug.$video,
    0,
    0,
    videoCanvas.width,
    videoCanvas.height,
  );

  const landmarks = getHandLandmarks();
  const rightHand = landmarks[1];

  rightHand && drawAllLandmarks(rightHand, videoCanvasContext, videoCanvas);
  rightHand && drawAllConnectors(rightHand, videoCanvasContext, videoCanvas);

};

// const drawRightIndex = () => {
//   let landmark;
//   if (landmarks && landmarks.length) {
//     const rightHand = landmarks[1];
//     if (rightHand.length) {
//       landmark = rightHand[8];
//     }
//   };

//   if (landmark) {
//     const currentLandmark = {
//       x: landmark.x * canvasRef.current.width,
//       y: landmark.y * canvasRef.current.height
//     };

//     drawLandmark(currentLandmark, canvasContext);
//   }
// }

const updateHandsfreeCanvas = () => {

};
