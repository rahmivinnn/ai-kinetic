import { Pose } from '@tensorflow-models/pose-detection';
import { calculateAngle } from './pose-detection';

// Define exercise types
export type ExerciseType = 'squat' | 'pushup' | 'shoulderPress' | 'bicepCurl' | 'lunge' | 'general';

// Define repetition state
interface RepState {
  count: number;
  phase: 'up' | 'down' | 'unknown';
  confidence: number;
  lastUpdateTime: number;
  keyJointAngle: number;
  keyJointName: string;
  thresholds: {
    up: number;
    down: number;
  };
}

// Define exercise configuration
interface ExerciseConfig {
  keyJointName: string;
  thresholds: {
    up: number;
    down: number;
  };
  keypoints: [string, string, string]; // [p1, p2, p3] for angle calculation
  direction: 'increasing' | 'decreasing'; // Whether angle increases or decreases during rep
}

/**
 * RepetitionCounter class for counting exercise repetitions
 */
export class RepetitionCounter {
  private exerciseType: ExerciseType;
  private state: RepState;
  private history: number[] = [];
  private readonly historySize = 10;
  private exerciseConfig: ExerciseConfig;
  
  /**
   * Create a new repetition counter
   * @param exerciseType Type of exercise to count
   */
  constructor(exerciseType: ExerciseType) {
    this.exerciseType = exerciseType;
    this.exerciseConfig = this.getExerciseConfig(exerciseType);
    this.state = this.getInitialState();
  }
  
  /**
   * Get exercise configuration based on exercise type
   * @param exerciseType Type of exercise
   * @returns Exercise configuration
   */
  private getExerciseConfig(exerciseType: ExerciseType): ExerciseConfig {
    switch (exerciseType) {
      case 'squat':
        return {
          keyJointName: 'knee',
          thresholds: { up: 150, down: 110 },
          keypoints: ['hip', 'knee', 'ankle'],
          direction: 'decreasing'
        };
      case 'pushup':
        return {
          keyJointName: 'elbow',
          thresholds: { up: 160, down: 90 },
          keypoints: ['shoulder', 'elbow', 'wrist'],
          direction: 'decreasing'
        };
      case 'shoulderPress':
        return {
          keyJointName: 'shoulder',
          thresholds: { up: 60, down: 120 },
          keypoints: ['elbow', 'shoulder', 'hip'],
          direction: 'decreasing'
        };
      case 'bicepCurl':
        return {
          keyJointName: 'elbow',
          thresholds: { up: 60, down: 160 },
          keypoints: ['shoulder', 'elbow', 'wrist'],
          direction: 'decreasing'
        };
      case 'lunge':
        return {
          keyJointName: 'knee',
          thresholds: { up: 150, down: 100 },
          keypoints: ['hip', 'knee', 'ankle'],
          direction: 'decreasing'
        };
      default:
        return {
          keyJointName: 'knee',
          thresholds: { up: 150, down: 110 },
          keypoints: ['hip', 'knee', 'ankle'],
          direction: 'decreasing'
        };
    }
  }
  
  /**
   * Get initial state for the repetition counter
   * @returns Initial repetition state
   */
  private getInitialState(): RepState {
    return {
      count: 0,
      phase: 'unknown',
      confidence: 0,
      lastUpdateTime: Date.now(),
      keyJointAngle: 180,
      keyJointName: this.exerciseConfig.keyJointName,
      thresholds: this.exerciseConfig.thresholds
    };
  }
  
  /**
   * Update the repetition counter with a new pose
   * @param pose Current pose from pose detection
   * @param side Which side to track ('left', 'right', or 'both')
   * @returns Current repetition count and phase
   */
  public update(pose: Pose, side: 'left' | 'right' | 'both' = 'both'): { count: number, phase: string, confidence: number } {
    if (!pose || !pose.keypoints) {
      return { count: this.state.count, phase: this.state.phase, confidence: 0 };
    }
    
    // Create keypoint map for easy lookup
    const kp: {[key: string]: any} = {};
    pose.keypoints.forEach(keypoint => {
      if (keypoint.name) {
        kp[keypoint.name] = keypoint;
      }
    });
    
    // Get the angle for the specified joint
    let angle: number | null = null;
    
    if (side === 'left' || side === 'both') {
      const leftAngle = this.getJointAngle(kp, 'left');
      if (leftAngle !== null) {
        angle = leftAngle;
      }
    }
    
    if ((side === 'right' || side === 'both') && angle === null) {
      const rightAngle = this.getJointAngle(kp, 'right');
      if (rightAngle !== null) {
        angle = rightAngle;
      }
    }
    
    if (angle === null) {
      return { count: this.state.count, phase: this.state.phase, confidence: 0 };
    }
    
    // Update history
    this.history.push(angle);
    if (this.history.length > this.historySize) {
      this.history.shift();
    }
    
    // Smooth angle using moving average
    const smoothedAngle = this.history.reduce((sum, val) => sum + val, 0) / this.history.length;
    
    // Update state
    this.state.keyJointAngle = smoothedAngle;
    
    // Determine phase and count repetitions
    this.updatePhaseAndCount();
    
    return {
      count: this.state.count,
      phase: this.state.phase,
      confidence: this.state.confidence
    };
  }
  
  /**
   * Get the angle for a specific joint
   * @param kp Keypoint map
   * @param side Which side to use ('left' or 'right')
   * @returns Joint angle or null if not available
   */
  private getJointAngle(kp: {[key: string]: any}, side: 'left' | 'right'): number | null {
    const [p1Base, p2Base, p3Base] = this.exerciseConfig.keypoints;
    const p1Name = `${side}_${p1Base}`;
    const p2Name = `${side}_${p2Base}`;
    const p3Name = `${side}_${p3Base}`;
    
    if (kp[p1Name] && kp[p2Name] && kp[p3Name]) {
      const p1 = { x: kp[p1Name].x, y: kp[p1Name].y };
      const p2 = { x: kp[p2Name].x, y: kp[p2Name].y };
      const p3 = { x: kp[p3Name].x, y: kp[p3Name].y };
      
      return calculateAngle(p1, p2, p3);
    }
    
    return null;
  }
  
  /**
   * Update the phase and count based on the current angle
   */
  private updatePhaseAndCount(): void {
    const { keyJointAngle, thresholds, phase } = this.state;
    const { direction } = this.exerciseConfig;
    
    // Determine new phase based on angle and direction
    let newPhase = phase;
    
    if (direction === 'decreasing') {
      // For exercises where angle decreases during the down phase (like squats)
      if (keyJointAngle < thresholds.down) {
        newPhase = 'down';
      } else if (keyJointAngle > thresholds.up) {
        newPhase = 'up';
      }
    } else {
      // For exercises where angle increases during the down phase
      if (keyJointAngle > thresholds.down) {
        newPhase = 'down';
      } else if (keyJointAngle < thresholds.up) {
        newPhase = 'up';
      }
    }
    
    // Count a rep when transitioning from down to up
    if (phase === 'down' && newPhase === 'up') {
      this.state.count++;
      this.state.confidence = 0.9; // High confidence for a completed rep
    } else {
      // Adjust confidence based on how close we are to the threshold
      const downThreshold = thresholds.down;
      const upThreshold = thresholds.up;
      const range = Math.abs(upThreshold - downThreshold);
      
      if (newPhase === 'down') {
        // How close to the bottom of the movement
        const progress = direction === 'decreasing'
          ? (upThreshold - keyJointAngle) / range
          : (keyJointAngle - upThreshold) / range;
        
        this.state.confidence = Math.min(0.8, Math.max(0.4, progress));
      } else {
        // Default confidence
        this.state.confidence = 0.5;
      }
    }
    
    this.state.phase = newPhase;
    this.state.lastUpdateTime = Date.now();
  }
  
  /**
   * Reset the repetition counter
   */
  public reset(): void {
    this.state = this.getInitialState();
    this.history = [];
  }
  
  /**
   * Get the current repetition count
   * @returns Current repetition count
   */
  public getCount(): number {
    return this.state.count;
  }
  
  /**
   * Get the current phase
   * @returns Current phase ('up', 'down', or 'unknown')
   */
  public getPhase(): string {
    return this.state.phase;
  }
  
  /**
   * Get the current confidence level
   * @returns Confidence level (0-1)
   */
  public getConfidence(): number {
    return this.state.confidence;
  }
}
