#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#if __has_include("handlandmarks/handlandmarks-Swift.h")
#import "handlandmarks/handlandmarks-Swift.h"
#else
#import "handlandmarks-Swift.h"
#endif

VISION_EXPORT_SWIFT_FRAME_PROCESSOR(HandLandmarksFrameProcessorPlugin, handLandmarks)