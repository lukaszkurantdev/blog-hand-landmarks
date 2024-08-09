import {PaintStyle, Skia} from '@shopify/react-native-skia';
import React, {useEffect} from 'react';

import {StyleSheet, Text} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  VisionCameraProxy,
  Frame,
  useSkiaFrameProcessor,
} from 'react-native-vision-camera';

const plugin = VisionCameraProxy.initFrameProcessorPlugin('handLandmarks', {});

export function handLandmarks(frame: Frame) {
  'worklet';
  if (plugin == null) {
    throw new Error('Failed to load Frame Processor Plugin!');
  }
  return plugin.call(frame);
}

const lines = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [0, 5],
  [5, 6],
  [6, 7],
  [7, 8],
  [5, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [9, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [13, 17],
  [17, 18],
  [18, 19],
  [19, 20],
  [0, 17],
];

function App(): React.JSX.Element {
  const device = useCameraDevice('front');
  const {hasPermission, requestPermission} = useCameraPermission();

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const paint = Skia.Paint();
  paint.setStyle(PaintStyle.Fill);
  paint.setStrokeWidth(2);
  paint.setColor(Skia.Color('red'));

  const linePaint = Skia.Paint();
  linePaint.setStyle(PaintStyle.Fill);
  linePaint.setStrokeWidth(4);
  linePaint.setColor(Skia.Color('lime'));

  const frameProcessor = useSkiaFrameProcessor(frame => {
    'worklet';
    const data = handLandmarks(frame);
    frame.render();

    const frameWidth = frame.width;
    const frameHeight = frame.height;

    for (const hand of data || []) {
      // Draw lines
      for (const [from, to] of lines) {
        frame.drawLine(
          hand[from].x * Number(frameWidth),
          hand[from].y * Number(frameHeight),
          hand[to].x * Number(frameWidth),
          hand[to].y * Number(frameHeight),
          linePaint,
        );
      }

      // Draw circles
      for (const mark of hand) {
        frame.drawCircle(
          mark.x * Number(frameWidth),
          mark.y * Number(frameHeight),
          6,
          paint,
        );
      }
    }
  }, []);

  if (!hasPermission) {
    return <Text>No permission</Text>;
  }
  if (device == null) {
    return <Text>No device</Text>;
  }
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
      fps={30}
      pixelFormat="rgb"
    />
  );
}

export default App;
