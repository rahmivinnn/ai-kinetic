// Simulated pose detection library (no external dependencies)

// Define types to match the TensorFlow.js pose detection API
export interface Keypoint {
  x: number;
  y: number;
  z?: number;
  score?: number;
  name?: string;
}

export interface Pose {
  keypoints: Keypoint[];
  score?: number;
  keypoints3D?: Keypoint[];
  id?: number;
}

export interface PoseDetector {
  estimatePoses: (
    image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
    config?: {
      flipHorizontal?: boolean;
      maxPoses?: number;
      scoreThreshold?: number;
    }
  ) => Promise<Pose[]>;
  dispose?: () => void;
}

// Initialize TensorFlow.js (simulated)
export const initializeTensorFlow = async () => {
  try {
    console.log('Simulated TensorFlow.js initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing simulated TensorFlow.js:', error);
    return false;
  }
};

// Create a detector (simulated)
export const createDetector = async (modelType: string = 'movenet') => {
  try {
    // Create a simulated detector that returns realistic pose data
    const detector: PoseDetector = {
      estimatePoses: async (
        image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
        config?: {
          flipHorizontal?: boolean;
          maxPoses?: number;
          scoreThreshold?: number;
        }
      ) => {
        // Get image dimensions
        const width = image instanceof HTMLVideoElement ? image.videoWidth :
                     image instanceof HTMLImageElement ? image.width :
                     image.width;
        const height = image instanceof HTMLVideoElement ? image.videoHeight :
                      image instanceof HTMLImageElement ? image.height :
                      image.height;

        // Generate realistic pose data based on image dimensions
        const centerX = width / 2;
        const centerY = height / 2;

        // Add some movement to make it look realistic
        const time = Date.now() / 1000;
        const offsetX = Math.sin(time) * 20;
        const offsetY = Math.cos(time) * 10;

        // Create keypoints for a human pose
        const keypoints: Keypoint[] = [
          { x: centerX + offsetX, y: centerY - 100 + offsetY, score: 0.9, name: 'nose' },
          { x: centerX - 20 + offsetX, y: centerY - 110 + offsetY, score: 0.85, name: 'left_eye' },
          { x: centerX + 20 + offsetX, y: centerY - 110 + offsetY, score: 0.85, name: 'right_eye' },
          { x: centerX - 40 + offsetX, y: centerY - 100 + offsetY, score: 0.7, name: 'left_ear' },
          { x: centerX + 40 + offsetX, y: centerY - 100 + offsetY, score: 0.7, name: 'right_ear' },
          { x: centerX - 70 + offsetX, y: centerY - 50 + offsetY, score: 0.8, name: 'left_shoulder' },
          { x: centerX + 70 + offsetX, y: centerY - 50 + offsetY, score: 0.8, name: 'right_shoulder' },
          { x: centerX - 100 + offsetX, y: centerY + offsetY, score: 0.75, name: 'left_elbow' },
          { x: centerX + 100 + offsetX, y: centerY + offsetY, score: 0.75, name: 'right_elbow' },
          { x: centerX - 130 + offsetX, y: centerY + 50 + offsetY, score: 0.7, name: 'left_wrist' },
          { x: centerX + 130 + offsetX, y: centerY + 50 + offsetY, score: 0.7, name: 'right_wrist' },
          { x: centerX - 50 + offsetX, y: centerY + 50 + offsetY, score: 0.8, name: 'left_hip' },
          { x: centerX + 50 + offsetX, y: centerY + 50 + offsetY, score: 0.8, name: 'right_hip' },
          { x: centerX - 60 + offsetX, y: centerY + 150 + offsetY, score: 0.75, name: 'left_knee' },
          { x: centerX + 60 + offsetX, y: centerY + 150 + offsetY, score: 0.75, name: 'right_knee' },
          { x: centerX - 70 + offsetX, y: centerY + 250 + offsetY, score: 0.7, name: 'left_ankle' },
          { x: centerX + 70 + offsetX, y: centerY + 250 + offsetY, score: 0.7, name: 'right_ankle' }
        ];

        // Apply horizontal flip if requested
        if (config?.flipHorizontal) {
          keypoints.forEach(keypoint => {
            keypoint.x = width - keypoint.x;
          });
        }

        // Filter by score threshold if provided
        const filteredKeypoints = config?.scoreThreshold
          ? keypoints.filter(kp => (kp.score || 0) >= (config.scoreThreshold || 0.5))
          : keypoints;

        // Create the pose object
        const pose: Pose = {
          keypoints: filteredKeypoints,
          score: 0.8 + Math.random() * 0.2
        };

        // Return the number of poses requested (default to 1)
        const numPoses = config?.maxPoses || 1;
        const poses: Pose[] = [];

        for (let i = 0; i < numPoses; i++) {
          // Create variations for multiple poses
          if (i === 0) {
            poses.push(pose);
          } else {
            // Create variations for additional poses
            const offsetMultiplier = i * 50;
            const variantPose: Pose = {
              keypoints: pose.keypoints.map(kp => ({
                ...kp,
                x: kp.x + offsetMultiplier,
                y: kp.y + offsetMultiplier * 0.5,
                score: (kp.score || 0.8) - 0.1 * i // Lower confidence for additional poses
              })),
              score: (pose.score || 0.8) - 0.1 * i
            };
            poses.push(variantPose);
          }
        }

        return poses;
      },

      dispose: () => {
        console.log('Simulated detector disposed');
      }
    };

    console.log(`${modelType} detector created successfully (simulated)`);
    return detector;
  } catch (error) {
    console.error('Error creating simulated pose detector:', error);
    return null;
  }
};

// Detect poses in an image/video frame (simulated wrapper)
export const detectPoses = async (
  detector: PoseDetector,
  image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
  flipHorizontal: boolean = false,
  maxPoses: number = 1,
  scoreThreshold: number = 0.5
) => {
  if (!detector) return null;

  try {
    const poses = await detector.estimatePoses(image, {
      flipHorizontal,
      maxPoses,
      scoreThreshold
    });

    return poses;
  } catch (error) {
    console.error('Error detecting poses:', error);
    return null;
  }
};

// Draw the skeleton on a canvas
export const drawSkeleton = (
  ctx: CanvasRenderingContext2D,
  pose: poseDetection.Pose,
  confidenceThreshold: number = 0.5,
  lineWidth: number = 3,
  color: string = '#4f46e5'
) => {
  if (!pose || !pose.keypoints) return;

  // Define connections between keypoints
  const connections = [
    ['nose', 'left_eye'], ['nose', 'right_eye'],
    ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
    ['left_shoulder', 'right_shoulder'],
    ['left_shoulder', 'left_elbow'], ['right_shoulder', 'right_elbow'],
    ['left_elbow', 'left_wrist'], ['right_elbow', 'right_wrist'],
    ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
    ['left_hip', 'right_hip'],
    ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
    ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle']
  ];

  // Create keypoint map for easy lookup
  const keypointMap: {[key: string]: poseDetection.Keypoint} = {};
  pose.keypoints.forEach(kp => {
    keypointMap[kp.name] = kp;
  });

  // Draw connections
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  connections.forEach(([from, to]) => {
    const fromKp = keypointMap[from];
    const toKp = keypointMap[to];

    if (fromKp && toKp &&
        fromKp.score > confidenceThreshold &&
        toKp.score > confidenceThreshold) {
      ctx.beginPath();
      ctx.moveTo(fromKp.x, fromKp.y);
      ctx.lineTo(toKp.x, toKp.y);
      ctx.stroke();
    }
  });
};

// Draw keypoints on a canvas
export const drawKeypoints = (
  ctx: CanvasRenderingContext2D,
  pose: poseDetection.Pose,
  confidenceThreshold: number = 0.5,
  radius: number = 5,
  color: string = '#4f46e5'
) => {
  if (!pose || !pose.keypoints) return;

  ctx.fillStyle = color;

  pose.keypoints.forEach(kp => {
    if (kp.score > confidenceThreshold) {
      ctx.beginPath();
      ctx.arc(kp.x, kp.y, radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
};

// Calculate angle between three points
export const calculateAngle = (
  p1: { x: number, y: number },
  p2: { x: number, y: number },
  p3: { x: number, y: number }
) => {
  const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) - Math.atan2(p1.y - p2.y, p1.x - p2.x);
  let angle = Math.abs(radians * 180.0 / Math.PI);

  // Ensure angle is between 0 and 180
  if (angle > 180) {
    angle = 360 - angle;
  }

  return angle;
};

// Draw angle between three points
export const drawAngle = (
  ctx: CanvasRenderingContext2D,
  p1: { x: number, y: number },
  p2: { x: number, y: number },
  p3: { x: number, y: number },
  color: string = 'rgba(79, 70, 229, 0.7)',
  textColor: string = '#4f46e5',
  radius: number = 20
) => {
  // Calculate angle
  const angle = calculateAngle(p1, p2, p3);

  // Draw angle arc
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;

  const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
  const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);

  // Draw arc
  ctx.beginPath();
  ctx.arc(p2.x, p2.y, radius, angle1, angle2, false);
  ctx.stroke();

  // Draw angle text
  ctx.fillStyle = textColor;
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';

  // Position text at midpoint of arc
  const midAngle = (angle1 + angle2) / 2;
  const textX = p2.x + (radius + 10) * Math.cos(midAngle);
  const textY = p2.y + (radius + 10) * Math.sin(midAngle);

  ctx.fillText(`${Math.round(angle)}°`, textX, textY);
};

// Calculate joint angles from pose
export const calculateJointAngles = (pose: poseDetection.Pose) => {
  if (!pose || !pose.keypoints) return null;

  // Create keypoint map for easy lookup
  const kp: {[key: string]: poseDetection.Keypoint} = {};
  pose.keypoints.forEach(keypoint => {
    kp[keypoint.name] = keypoint;
  });

  // Calculate angles
  const angles: {[key: string]: number} = {};

  // Right elbow angle
  if (kp['right_shoulder'] && kp['right_elbow'] && kp['right_wrist']) {
    angles.rightElbow = calculateAngle(
      { x: kp['right_shoulder'].x, y: kp['right_shoulder'].y },
      { x: kp['right_elbow'].x, y: kp['right_elbow'].y },
      { x: kp['right_wrist'].x, y: kp['right_wrist'].y }
    );
  }

  // Left elbow angle
  if (kp['left_shoulder'] && kp['left_elbow'] && kp['left_wrist']) {
    angles.leftElbow = calculateAngle(
      { x: kp['left_shoulder'].x, y: kp['left_shoulder'].y },
      { x: kp['left_elbow'].x, y: kp['left_elbow'].y },
      { x: kp['left_wrist'].x, y: kp['left_wrist'].y }
    );
  }

  // Right shoulder angle
  if (kp['right_elbow'] && kp['right_shoulder'] && kp['right_hip']) {
    angles.rightShoulder = calculateAngle(
      { x: kp['right_elbow'].x, y: kp['right_elbow'].y },
      { x: kp['right_shoulder'].x, y: kp['right_shoulder'].y },
      { x: kp['right_hip'].x, y: kp['right_hip'].y }
    );
  }

  // Left shoulder angle
  if (kp['left_elbow'] && kp['left_shoulder'] && kp['left_hip']) {
    angles.leftShoulder = calculateAngle(
      { x: kp['left_elbow'].x, y: kp['left_elbow'].y },
      { x: kp['left_shoulder'].x, y: kp['left_shoulder'].y },
      { x: kp['left_hip'].x, y: kp['left_hip'].y }
    );
  }

  // Right knee angle
  if (kp['right_hip'] && kp['right_knee'] && kp['right_ankle']) {
    angles.rightKnee = calculateAngle(
      { x: kp['right_hip'].x, y: kp['right_hip'].y },
      { x: kp['right_knee'].x, y: kp['right_knee'].y },
      { x: kp['right_ankle'].x, y: kp['right_ankle'].y }
    );
  }

  // Left knee angle
  if (kp['left_hip'] && kp['left_knee'] && kp['left_ankle']) {
    angles.leftKnee = calculateAngle(
      { x: kp['left_hip'].x, y: kp['left_hip'].y },
      { x: kp['left_knee'].x, y: kp['left_knee'].y },
      { x: kp['left_ankle'].x, y: kp['left_ankle'].y }
    );
  }

  // Hip angle
  if (kp['left_shoulder'] && kp['left_hip'] && kp['left_knee']) {
    angles.leftHip = calculateAngle(
      { x: kp['left_shoulder'].x, y: kp['left_shoulder'].y },
      { x: kp['left_hip'].x, y: kp['left_hip'].y },
      { x: kp['left_knee'].x, y: kp['left_knee'].y }
    );
  }

  if (kp['right_shoulder'] && kp['right_hip'] && kp['right_knee']) {
    angles.rightHip = calculateAngle(
      { x: kp['right_shoulder'].x, y: kp['right_shoulder'].y },
      { x: kp['right_hip'].x, y: kp['right_hip'].y },
      { x: kp['right_knee'].x, y: kp['right_knee'].y }
    );
  }

  return angles;
};

// Check if camera is available
export const isCameraAvailable = async (): Promise<boolean> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Error checking camera availability:', error);
    return false;
  }
};

// Start camera stream
export const startCamera = async (
  videoElement: HTMLVideoElement,
  constraints: MediaStreamConstraints = { video: { width: 640, height: 480 } }
): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = stream;

    return new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        videoElement.play()
          .then(() => resolve(true))
          .catch((error) => {
            console.error('Error playing video:', error);
            resolve(false);
          });
      };
    });
  } catch (error) {
    console.error('Error starting camera:', error);
    return false;
  }
};

// Stop camera stream
export const stopCamera = (videoElement: HTMLVideoElement): void => {
  if (!videoElement || !videoElement.srcObject) return;

  const stream = videoElement.srcObject as MediaStream;
  const tracks = stream.getTracks();

  tracks.forEach(track => track.stop());
  videoElement.srcObject = null;
};

// Generate feedback based on pose analysis
export const generatePoseFeedback = (
  pose: poseDetection.Pose,
  angles: {[key: string]: number},
  poseType: string = 'general'
): { type: 'correction' | 'suggestion' | 'warning' | 'positive', message: string }[] => {
  const feedback: { type: 'correction' | 'suggestion' | 'warning' | 'positive', message: string }[] = [];

  if (!pose || !angles) return feedback;

  // General posture feedback
  if (pose.keypoints.find(kp => kp.name === 'nose') &&
      pose.keypoints.find(kp => kp.name === 'left_hip') &&
      pose.keypoints.find(kp => kp.name === 'right_hip')) {

    const nose = pose.keypoints.find(kp => kp.name === 'nose')!;
    const leftHip = pose.keypoints.find(kp => kp.name === 'left_hip')!;
    const rightHip = pose.keypoints.find(kp => kp.name === 'right_hip')!;

    const hipCenterX = (leftHip.x + rightHip.x) / 2;

    // Check if leaning too far forward or backward
    const horizontalDifference = Math.abs(nose.x - hipCenterX);
    if (horizontalDifference > 100) {
      feedback.push({
        type: 'correction',
        message: 'Try to maintain a more vertical posture. Your upper body is leaning too far.'
      });
    } else if (horizontalDifference < 30) {
      feedback.push({
        type: 'positive',
        message: 'Good vertical alignment in your posture.'
      });
    }
  }

  // Specific pose type feedback
  switch (poseType.toLowerCase()) {
    case 'squat':
      // Check knee angles for proper squat form
      if (angles.leftKnee && angles.rightKnee) {
        const avgKneeAngle = (angles.leftKnee + angles.rightKnee) / 2;

        if (avgKneeAngle > 170) {
          feedback.push({
            type: 'suggestion',
            message: 'Try to bend your knees more to achieve proper squat depth.'
          });
        } else if (avgKneeAngle < 70) {
          feedback.push({
            type: 'warning',
            message: 'Your squat may be too deep. Try not to go below parallel to protect your knees.'
          });
        } else if (avgKneeAngle >= 85 && avgKneeAngle <= 110) {
          feedback.push({
            type: 'positive',
            message: 'Great squat depth! Your knee angle is optimal.'
          });
        }
      }
      break;

    case 'plank':
      // Check body alignment for plank
      if (angles.leftShoulder && angles.rightShoulder && angles.leftHip && angles.rightHip) {
        const avgShoulderAngle = (angles.leftShoulder + angles.rightShoulder) / 2;
        const avgHipAngle = (angles.leftHip + angles.rightHip) / 2;

        if (avgShoulderAngle < 70 || avgShoulderAngle > 110) {
          feedback.push({
            type: 'correction',
            message: 'Adjust your shoulder position to maintain a straight line from head to heels.'
          });
        }

        if (avgHipAngle < 160) {
          feedback.push({
            type: 'correction',
            message: 'Keep your hips in line with your shoulders and ankles. Your hips are too low or too high.'
          });
        }

        if (avgShoulderAngle >= 80 && avgShoulderAngle <= 100 && avgHipAngle >= 170) {
          feedback.push({
            type: 'positive',
            message: 'Excellent plank form! Your body is well-aligned.'
          });
        }
      }
      break;

    default:
      // General symmetry check
      if (angles.leftElbow && angles.rightElbow) {
        const elbowDifference = Math.abs(angles.leftElbow - angles.rightElbow);
        if (elbowDifference > 20) {
          feedback.push({
            type: 'suggestion',
            message: 'Try to maintain more symmetry between your left and right arms.'
          });
        }
      }

      if (angles.leftKnee && angles.rightKnee) {
        const kneeDifference = Math.abs(angles.leftKnee - angles.rightKnee);
        if (kneeDifference > 20) {
          feedback.push({
            type: 'suggestion',
            message: 'Your legs appear to be asymmetrical. Try to balance your weight evenly.'
          });
        }
      }
  }

  // If no specific feedback was generated, add a general one
  if (feedback.length === 0) {
    feedback.push({
      type: 'positive',
      message: 'Your form looks good! Continue maintaining this posture.'
    });
  }

  return feedback;
};

// Calculate pose score based on various metrics
export const calculatePoseScore = (
  pose: poseDetection.Pose,
  angles: {[key: string]: number},
  poseType: string = 'general'
): {[key: string]: number} => {
  const scores: {[key: string]: number} = {
    form: 0,
    alignment: 0,
    stability: 0,
    range: 0,
    overall: 0
  };

  if (!pose || !angles) return scores;

  // Calculate average keypoint confidence as base score
  let totalConfidence = 0;
  let validKeypoints = 0;

  pose.keypoints.forEach(kp => {
    if (kp.score > 0.2) {
      totalConfidence += kp.score;
      validKeypoints++;
    }
  });

  const avgConfidence = validKeypoints > 0 ? totalConfidence / validKeypoints : 0;
  scores.stability = Math.round(avgConfidence * 100);

  // Calculate alignment score
  if (pose.keypoints.find(kp => kp.name === 'nose') &&
      pose.keypoints.find(kp => kp.name === 'left_hip') &&
      pose.keypoints.find(kp => kp.name === 'right_hip')) {

    const nose = pose.keypoints.find(kp => kp.name === 'nose')!;
    const leftHip = pose.keypoints.find(kp => kp.name === 'left_hip')!;
    const rightHip = pose.keypoints.find(kp => kp.name === 'right_hip')!;

    const hipCenterX = (leftHip.x + rightHip.x) / 2;
    const horizontalDifference = Math.abs(nose.x - hipCenterX);

    // Convert to a score (lower difference = higher score)
    scores.alignment = Math.max(0, Math.round(100 - (horizontalDifference / 2)));
  }

  // Calculate form score based on pose type
  switch (poseType.toLowerCase()) {
    case 'squat':
      if (angles.leftKnee && angles.rightKnee) {
        const avgKneeAngle = (angles.leftKnee + angles.rightKnee) / 2;
        // Optimal squat angle is around 90-100 degrees
        const kneeScore = 100 - Math.min(100, Math.abs(95 - avgKneeAngle) * 1.5);
        scores.form = Math.round(kneeScore);

        // Range of motion score
        const initialKneeAngle = 175; // Assumed starting position
        const rangePercentage = (initialKneeAngle - avgKneeAngle) / (initialKneeAngle - 90) * 100;
        scores.range = Math.min(100, Math.max(0, Math.round(rangePercentage)));
      }
      break;

    case 'plank':
      if (angles.leftShoulder && angles.rightShoulder && angles.leftHip && angles.rightHip) {
        const avgShoulderAngle = (angles.leftShoulder + angles.rightShoulder) / 2;
        const avgHipAngle = (angles.leftHip + angles.rightHip) / 2;

        // Optimal plank has shoulder around 90 degrees and hip around 180 degrees
        const shoulderScore = 100 - Math.min(100, Math.abs(90 - avgShoulderAngle) * 2);
        const hipScore = 100 - Math.min(100, Math.abs(180 - avgHipAngle) * 1.5);

        scores.form = Math.round((shoulderScore + hipScore) / 2);
        scores.range = 100; // Plank is a static hold, so range is always 100
      }
      break;

    default:
      // For general poses, check symmetry
      let symmetryScore = 100;

      if (angles.leftElbow && angles.rightElbow) {
        const elbowDifference = Math.abs(angles.leftElbow - angles.rightElbow);
        symmetryScore -= Math.min(50, elbowDifference);
      }

      if (angles.leftKnee && angles.rightKnee) {
        const kneeDifference = Math.abs(angles.leftKnee - angles.rightKnee);
        symmetryScore -= Math.min(50, kneeDifference);
      }

      scores.form = Math.max(0, Math.round(symmetryScore));
      scores.range = 75; // Default value for general poses
  }

  // Calculate overall score as weighted average
  scores.overall = Math.round(
    (scores.form * 0.4) +
    (scores.alignment * 0.3) +
    (scores.stability * 0.2) +
    (scores.range * 0.1)
  );

  return scores;
};
