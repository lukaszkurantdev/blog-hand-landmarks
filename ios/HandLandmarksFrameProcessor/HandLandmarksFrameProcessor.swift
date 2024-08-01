import VisionCamera
import MediaPipeTasksVision

@objc(HandLandmarksFrameProcessorPlugin)
public class HandLandmarksFrameProcessorPlugin: FrameProcessorPlugin {
  public override init(proxy: VisionCameraProxyHolder, options: [AnyHashable: Any]! = [:]) {
    super.init(proxy: proxy, options: options)
  }

  public override func callback(_ frame: Frame, withArguments arguments: [AnyHashable: Any]?) -> Any? {
    let buffer = frame.buffer

    let modelPath = Bundle.main.path(forResource: "hand_landmarker",
                                          ofType: "task")
    
    let options = HandLandmarkerOptions()
    options.baseOptions.modelAssetPath = "hand_landmarker.task"
    options.runningMode = .video
    options.minHandDetectionConfidence = 0.5
    options.minHandPresenceConfidence = 0.5
    options.minTrackingConfidence = 0.5
    options.numHands = 2

    do {
      let handLandmarker = try HandLandmarker(options: options)
      let image = try MPImage(sampleBuffer: buffer)
      let result = try handLandmarker.detect(videoFrame: image, timestampInMilliseconds: Int(frame.timestamp))
      
      var landmarks = [] as Array
      
      for hand in result.landmarks {
        var marks = [] as Array
        
        for handmark in hand {
          marks.append([
            "x": handmark.x,
            "y": handmark.y
          ])
        }
        
        landmarks.append(marks)
      }
      
      return landmarks
    } catch {
      return nil
    }
  }
}
