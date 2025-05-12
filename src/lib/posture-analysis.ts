import { Pose } from '@tensorflow-models/pose-detection';
import { calculateJointAngles } from './pose-detection';

// Define exercise types for analysis
export type ExerciseType = 'squat' | 'pushup' | 'lunge' | 'plank' | 'shoulderPress' | 'bicepCurl' | 'general';

// Define feedback types
export type FeedbackType = 'correction' | 'suggestion' | 'warning' | 'positive';

// Define feedback message
export interface FeedbackMessage {
  type: FeedbackType;
  message: string;
  confidence: number;
  jointName?: string;
  targetAngle?: number;
  currentAngle?: number;
}

// Define reference angles for different exercises
const REFERENCE_ANGLES: Record<ExerciseType, Record<string, { min: number, max: number, ideal: number }>> = {
  squat: {
    leftKnee: { min: 80, max: 120, ideal: 90 },
    rightKnee: { min: 80, max: 120, ideal: 90 },
    leftHip: { min: 70, max: 110, ideal: 90 },
    rightHip: { min: 70, max: 110, ideal: 90 },
    spine: { min: 150, max: 180, ideal: 170 }
  },
  pushup: {
    leftElbow: { min: 80, max: 100, ideal: 90 },
    rightElbow: { min: 80, max: 100, ideal: 90 },
    spine: { min: 160, max: 180, ideal: 180 }
  },
  lunge: {
    leftKnee: { min: 80, max: 110, ideal: 90 },
    rightKnee: { min: 80, max: 110, ideal: 90 },
    leftHip: { min: 90, max: 130, ideal: 110 },
    rightHip: { min: 90, max: 130, ideal: 110 }
  },
  plank: {
    leftElbow: { min: 80, max: 100, ideal: 90 },
    rightElbow: { min: 80, max: 100, ideal: 90 },
    leftShoulder: { min: 80, max: 100, ideal: 90 },
    rightShoulder: { min: 80, max: 100, ideal: 90 },
    leftHip: { min: 160, max: 180, ideal: 180 },
    rightHip: { min: 160, max: 180, ideal: 180 }
  },
  shoulderPress: {
    leftElbow: { min: 150, max: 180, ideal: 170 },
    rightElbow: { min: 150, max: 180, ideal: 170 },
    leftShoulder: { min: 80, max: 100, ideal: 90 },
    rightShoulder: { min: 80, max: 100, ideal: 90 }
  },
  bicepCurl: {
    leftElbow: { min: 40, max: 160, ideal: 90 },
    rightElbow: { min: 40, max: 160, ideal: 90 }
  },
  general: {
    spine: { min: 160, max: 180, ideal: 180 },
    neck: { min: 160, max: 180, ideal: 170 },
    leftShoulder: { min: 80, max: 100, ideal: 90 },
    rightShoulder: { min: 80, max: 100, ideal: 90 }
  }
};

/**
 * Analyze pose and generate feedback
 * @param pose Detected pose
 * @param angles Joint angles (optional, will be calculated if not provided)
 * @param exerciseType Type of exercise being performed
 * @returns Array of feedback messages
 */
export const analyzePoseAndGenerateFeedback = (
  pose: Pose,
  angles?: Record<string, number>,
  exerciseType: ExerciseType = 'general'
): FeedbackMessage[] => {
  const feedback: FeedbackMessage[] = [];
  
  if (!pose || !pose.keypoints || pose.keypoints.length === 0) return feedback;
  
  // Calculate angles if not provided
  const jointAngles = angles || calculateJointAngles(pose);
  if (!jointAngles) return feedback;
  
  const referenceAngles = REFERENCE_ANGLES[exerciseType];
  
  // Check each joint angle against reference
  Object.entries(jointAngles).forEach(([jointName, angle]) => {
    const reference = referenceAngles[jointName];
    
    if (reference) {
      // Check if angle is within acceptable range
      if (angle < reference.min) {
        feedback.push({
          type: 'correction',
          message: `${formatJointName(jointName)} angle too small (${angle}°)`,
          confidence: 0.8,
          jointName,
          targetAngle: reference.ideal,
          currentAngle: angle
        });
      } else if (angle > reference.max) {
        feedback.push({
          type: 'correction',
          message: `${formatJointName(jointName)} angle too large (${angle}°)`,
          confidence: 0.8,
          jointName,
          targetAngle: reference.ideal,
          currentAngle: angle
        });
      } else if (Math.abs(angle - reference.ideal) < 5) {
        feedback.push({
          type: 'positive',
          message: `${formatJointName(jointName)} position is good`,
          confidence: 0.9,
          jointName,
          targetAngle: reference.ideal,
          currentAngle: angle
        });
      }
    }
  });
  
  // Add posture-specific feedback
  addPostureSpecificFeedback(feedback, pose, jointAngles, exerciseType);
  
  return feedback;
};

/**
 * Add posture-specific feedback based on exercise type
 * @param feedback Feedback array to add to
 * @param pose Detected pose
 * @param angles Joint angles
 * @param exerciseType Type of exercise being performed
 */
const addPostureSpecificFeedback = (
  feedback: FeedbackMessage[],
  pose: Pose,
  angles: Record<string, number>,
  exerciseType: ExerciseType
) => {
  // Create keypoint map for easy lookup
  const kp: {[key: string]: any} = {};
  pose.keypoints.forEach(keypoint => {
    if (keypoint.name) {
      kp[keypoint.name] = keypoint;
    }
  });
  
  // Check for specific posture issues based on exercise type
  switch (exerciseType) {
    case 'squat':
      // Check for back alignment
      if (angles.spine && angles.spine < 160) {
        feedback.push({
          type: 'correction',
          message: 'Keep your back straight during squats',
          confidence: 0.9,
          jointName: 'spine',
          targetAngle: 170,
          currentAngle: angles.spine
        });
      }
      
      // Check for knee alignment
      checkKneeAlignment(feedback, kp);
      break;
      
    case 'pushup':
      // Check for hip alignment
      if (angles.spine && angles.spine < 170) {
        feedback.push({
          type: 'correction',
          message: 'Keep your body straight, hips are sagging',
          confidence: 0.9,
          jointName: 'spine',
          targetAngle: 180,
          currentAngle: angles.spine
        });
      }
      break;
      
    case 'plank':
      // Check for hip alignment
      if (angles.leftHip && angles.rightHip) {
        const avgHipAngle = (angles.leftHip + angles.rightHip) / 2;
        if (avgHipAngle < 160) {
          feedback.push({
            type: 'correction',
            message: 'Raise your hips to maintain a straight line from head to heels',
            confidence: 0.9,
            jointName: 'hips',
            targetAngle: 180,
            currentAngle: avgHipAngle
          });
        }
      }
      break;
      
    case 'general':
      // Check for shoulder symmetry
      checkShoulderSymmetry(feedback, angles);
      
      // Check for head alignment
      if (angles.neck && angles.neck < 160) {
        feedback.push({
          type: 'correction',
          message: 'Head is too far forward, align with spine',
          confidence: 0.8,
          jointName: 'neck',
          targetAngle: 170,
          currentAngle: angles.neck
        });
      }
      break;
  }
};

/**
 * Check knee alignment
 * @param feedback Feedback array to add to
 * @param kp Keypoint map
 */
const checkKneeAlignment = (feedback: FeedbackMessage[], kp: {[key: string]: any}) => {
  if (kp.left_knee && kp.left_ankle && kp.left_hip &&
      kp.right_knee && kp.right_ankle && kp.right_hip) {
    
    // Check if knees are going inward (knee valgus)
    const leftKneeX = kp.left_knee.x;
    const leftAnkleX = kp.left_ankle.x;
    const rightKneeX = kp.right_knee.x;
    const rightAnkleX = kp.right_ankle.x;
    
    if (leftKneeX < leftAnkleX) {
      feedback.push({
        type: 'warning',
        message: 'Left knee is caving inward',
        confidence: 0.85,
        jointName: 'leftKnee'
      });
    }
    
    if (rightKneeX > rightAnkleX) {
      feedback.push({
        type: 'warning',
        message: 'Right knee is caving inward',
        confidence: 0.85,
        jointName: 'rightKnee'
      });
    }
  }
};

/**
 * Check shoulder symmetry
 * @param feedback Feedback array to add to
 * @param angles Joint angles
 */
const checkShoulderSymmetry = (feedback: FeedbackMessage[], angles: Record<string, number>) => {
  if (angles.leftShoulder && angles.rightShoulder) {
    const difference = Math.abs(angles.leftShoulder - angles.rightShoulder);
    
    if (difference > 15) {
      const lowerSide = angles.leftShoulder < angles.rightShoulder ? 'left' : 'right';
      feedback.push({
        type: 'correction',
        message: `${lowerSide === 'left' ? 'Left' : 'Right'} shoulder is lower than the other`,
        confidence: 0.8,
        jointName: `${lowerSide}Shoulder`
      });
    }
  }
};

/**
 * Format joint name for user-friendly messages
 * @param jointName Joint name in camelCase
 * @returns Formatted joint name
 */
const formatJointName = (jointName: string): string => {
  // Handle camelCase
  const words = jointName.replace(/([A-Z])/g, ' $1').toLowerCase().split(' ');
  return words
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
