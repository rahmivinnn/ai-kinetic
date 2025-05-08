"""
OpenPose Analyzer - A comprehensive pose analysis tool using OpenPose/MediaPipe
"""

import cv2
import numpy as np
import mediapipe as mp
import time
import json
import os
from datetime import datetime
import pandas as pd
import math
from typing import List, Dict, Tuple, Optional, Union

class OpenPoseAnalyzer:
    """
    A class for analyzing human poses using MediaPipe Pose.
    Provides functionality for both live webcam analysis and video file analysis.
    """

    def __init__(self,
                 model_complexity: int = 1,
                 min_detection_confidence: float = 0.5,
                 min_tracking_confidence: float = 0.5):
        """
        Initialize the OpenPoseAnalyzer with MediaPipe Pose.

        Args:
            model_complexity: Model complexity (0, 1, or 2). Higher is more accurate but slower.
            min_detection_confidence: Minimum confidence for pose detection.
            min_tracking_confidence: Minimum confidence for pose tracking.
        """
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            model_complexity=model_complexity,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )

        # Analysis results storage
        self.results_history = []
        self.is_analyzing = False
        self.frame_count = 0
        self.start_time = None

        # Feedback system
        self.posture_feedback = []
        self.current_accuracy = 0
        self.joint_angles = {}

        # Define joint connections for angle calculations
        self.angle_joints = {
            'left_elbow': [
                self.mp_pose.PoseLandmark.LEFT_SHOULDER.value,
                self.mp_pose.PoseLandmark.LEFT_ELBOW.value,
                self.mp_pose.PoseLandmark.LEFT_WRIST.value
            ],
            'right_elbow': [
                self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value,
                self.mp_pose.PoseLandmark.RIGHT_ELBOW.value,
                self.mp_pose.PoseLandmark.RIGHT_WRIST.value
            ],
            'left_shoulder': [
                self.mp_pose.PoseLandmark.LEFT_ELBOW.value,
                self.mp_pose.PoseLandmark.LEFT_SHOULDER.value,
                self.mp_pose.PoseLandmark.LEFT_HIP.value
            ],
            'right_shoulder': [
                self.mp_pose.PoseLandmark.RIGHT_ELBOW.value,
                self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value,
                self.mp_pose.PoseLandmark.RIGHT_HIP.value
            ],
            'left_hip': [
                self.mp_pose.PoseLandmark.LEFT_SHOULDER.value,
                self.mp_pose.PoseLandmark.LEFT_HIP.value,
                self.mp_pose.PoseLandmark.LEFT_KNEE.value
            ],
            'right_hip': [
                self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value,
                self.mp_pose.PoseLandmark.RIGHT_HIP.value,
                self.mp_pose.PoseLandmark.RIGHT_KNEE.value
            ],
            'left_knee': [
                self.mp_pose.PoseLandmark.LEFT_HIP.value,
                self.mp_pose.PoseLandmark.LEFT_KNEE.value,
                self.mp_pose.PoseLandmark.LEFT_ANKLE.value
            ],
            'right_knee': [
                self.mp_pose.PoseLandmark.RIGHT_HIP.value,
                self.mp_pose.PoseLandmark.RIGHT_KNEE.value,
                self.mp_pose.PoseLandmark.RIGHT_ANKLE.value
            ]
        }

    def start_analysis(self) -> None:
        """Start the pose analysis session."""
        self.is_analyzing = True
        self.frame_count = 0
        self.start_time = time.time()
        self.results_history = []
        self.posture_feedback = []
        print("Analysis started")

    def stop_analysis(self) -> None:
        """Stop the pose analysis session."""
        self.is_analyzing = False
        print("Analysis stopped")

    def calculate_angle(self, a: np.ndarray, b: np.ndarray, c: np.ndarray) -> float:
        """
        Calculate the angle between three points.

        Args:
            a: First point coordinates [x, y]
            b: Middle point coordinates [x, y] (vertex of the angle)
            c: Last point coordinates [x, y]

        Returns:
            Angle in degrees
        """
        a = np.array(a)
        b = np.array(b)
        c = np.array(c)

        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)

        if angle > 180.0:
            angle = 360 - angle

        return angle

    def analyze_frame(self, frame: np.ndarray) -> Tuple[np.ndarray, Dict, float]:
        """
        Analyze a single frame for pose detection.

        Args:
            frame: Input image frame

        Returns:
            Tuple containing:
                - Annotated frame with pose landmarks
                - Dictionary of joint angles
                - Overall pose accuracy score
        """
        if not self.is_analyzing:
            return frame, {}, 0.0

        # Convert the BGR image to RGB
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Process the image and detect poses
        results = self.pose.process(image_rgb)

        # Initialize variables
        annotated_frame = frame.copy()
        joint_angles = {}
        accuracy = 0.0

        # Check if pose landmarks are detected
        if results.pose_landmarks:
            # Draw pose landmarks on the image
            self.mp_drawing.draw_landmarks(
                annotated_frame,
                results.pose_landmarks,
                self.mp_pose.POSE_CONNECTIONS,
                self.mp_drawing.DrawingSpec(color=(245, 117, 66), thickness=2, circle_radius=2),
                self.mp_drawing.DrawingSpec(color=(245, 66, 230), thickness=2, circle_radius=2)
            )

            # Calculate joint angles
            landmarks = results.pose_landmarks.landmark
            h, w, _ = frame.shape

            for joint_name, joint_indices in self.angle_joints.items():
                if all(0 <= idx < len(landmarks) for idx in joint_indices):
                    a = [landmarks[joint_indices[0]].x * w, landmarks[joint_indices[0]].y * h]
                    b = [landmarks[joint_indices[1]].x * w, landmarks[joint_indices[1]].y * h]
                    c = [landmarks[joint_indices[2]].x * w, landmarks[joint_indices[2]].y * h]

                    angle = self.calculate_angle(a, b, c)
                    joint_angles[joint_name] = angle

                    # Display angle on the frame
                    cv2.putText(annotated_frame, f"{joint_name}: {angle:.1f}°",
                                (int(b[0]), int(b[1])),
                                cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 2, cv2.LINE_AA)

            # Calculate overall accuracy based on landmark visibility
            visible_landmarks = sum(1 for landmark in landmarks if landmark.visibility > 0.5)
            accuracy = (visible_landmarks / len(landmarks)) * 100

            # Generate posture feedback
            self.generate_posture_feedback(joint_angles, landmarks)

            # Store results for history
            self.frame_count += 1
            self.results_history.append({
                'frame': self.frame_count,
                'timestamp': time.time() - self.start_time,
                'joint_angles': joint_angles.copy(),
                'accuracy': accuracy,
                'feedback': self.posture_feedback[-5:] if self.posture_feedback else []
            })

        # Display accuracy on the frame
        cv2.putText(annotated_frame, f"Accuracy: {accuracy:.1f}%",
                    (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)

        self.current_accuracy = accuracy
        self.joint_angles = joint_angles

        return annotated_frame, joint_angles, accuracy

    def generate_posture_feedback(self, joint_angles: Dict[str, float], landmarks: List) -> None:
        """
        Generate posture feedback based on joint angles and landmarks.

        Args:
            joint_angles: Dictionary of calculated joint angles
            landmarks: List of pose landmarks
        """
        feedback = []

        # Check for symmetry between left and right sides
        if 'left_shoulder' in joint_angles and 'right_shoulder' in joint_angles:
            diff = abs(joint_angles['left_shoulder'] - joint_angles['right_shoulder'])
            if diff > 15:
                feedback.append("Shoulders are not level. Try to balance your posture.")
            elif diff < 5:
                feedback.append("Good shoulder alignment. Keep it up!")

        if 'left_hip' in joint_angles and 'right_hip' in joint_angles:
            diff = abs(joint_angles['left_hip'] - joint_angles['right_hip'])
            if diff > 15:
                feedback.append("Hips are not level. Check your stance.")
            elif diff < 5:
                feedback.append("Excellent hip alignment. Well done!")

        # Check for specific joint angles
        if 'left_knee' in joint_angles:
            if joint_angles['left_knee'] < 150 and joint_angles['left_knee'] > 30:
                if joint_angles['left_knee'] < 90:
                    feedback.append("Left knee is deeply bent. Watch your form.")
                else:
                    feedback.append("Left knee is slightly bent. Adjust based on your exercise.")
            elif joint_angles['left_knee'] >= 150:
                feedback.append("Left knee is well extended. Good form!")

        if 'right_knee' in joint_angles:
            if joint_angles['right_knee'] < 150 and joint_angles['right_knee'] > 30:
                if joint_angles['right_knee'] < 90:
                    feedback.append("Right knee is deeply bent. Watch your form.")
                else:
                    feedback.append("Right knee is slightly bent. Adjust based on your exercise.")
            elif joint_angles['right_knee'] >= 150:
                feedback.append("Right knee is well extended. Good form!")

        # Check for elbow angles
        if 'left_elbow' in joint_angles:
            if joint_angles['left_elbow'] < 90:
                feedback.append("Left elbow is tightly bent. Ensure this is intended for your exercise.")
            elif joint_angles['left_elbow'] > 160:
                feedback.append("Left arm is well extended. Good control!")

        if 'right_elbow' in joint_angles:
            if joint_angles['right_elbow'] < 90:
                feedback.append("Right elbow is tightly bent. Ensure this is intended for your exercise.")
            elif joint_angles['right_elbow'] > 160:
                feedback.append("Right arm is well extended. Good control!")

        # Check for back alignment
        if (self.mp_pose.PoseLandmark.LEFT_SHOULDER.value < len(landmarks) and
            self.mp_pose.PoseLandmark.LEFT_HIP.value < len(landmarks) and
            self.mp_pose.PoseLandmark.LEFT_ANKLE.value < len(landmarks)):

            # Check for vertical alignment
            shoulder = landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value]
            hip = landmarks[self.mp_pose.PoseLandmark.LEFT_HIP.value]

            if abs(shoulder.x - hip.x) > 0.1:  # Threshold for horizontal displacement
                feedback.append("Back is not straight. Try to maintain a neutral spine position.")
            elif abs(shoulder.x - hip.x) < 0.05:
                feedback.append("Excellent back alignment. Maintaining good posture!")

        # Check for neck alignment
        if (self.mp_pose.PoseLandmark.NOSE.value < len(landmarks) and
            self.mp_pose.PoseLandmark.LEFT_SHOULDER.value < len(landmarks) and
            self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value < len(landmarks)):

            nose = landmarks[self.mp_pose.PoseLandmark.NOSE.value]
            left_shoulder = landmarks[self.mp_pose.PoseLandmark.LEFT_SHOULDER.value]
            right_shoulder = landmarks[self.mp_pose.PoseLandmark.RIGHT_SHOULDER.value]

            # Calculate midpoint between shoulders
            mid_shoulder_x = (left_shoulder.x + right_shoulder.x) / 2

            if abs(nose.x - mid_shoulder_x) > 0.1:
                feedback.append("Head is not aligned with your shoulders. Check your neck position.")
            elif abs(nose.x - mid_shoulder_x) < 0.05:
                feedback.append("Good head and neck alignment. Keep it up!")

        # Check for balance (using ankles and hips)
        if (self.mp_pose.PoseLandmark.LEFT_ANKLE.value < len(landmarks) and
            self.mp_pose.PoseLandmark.RIGHT_ANKLE.value < len(landmarks) and
            self.mp_pose.PoseLandmark.LEFT_HIP.value < len(landmarks) and
            self.mp_pose.PoseLandmark.RIGHT_HIP.value < len(landmarks)):

            left_ankle = landmarks[self.mp_pose.PoseLandmark.LEFT_ANKLE.value]
            right_ankle = landmarks[self.mp_pose.PoseLandmark.RIGHT_ANKLE.value]
            left_hip = landmarks[self.mp_pose.PoseLandmark.LEFT_HIP.value]
            right_hip = landmarks[self.mp_pose.PoseLandmark.RIGHT_HIP.value]

            # Calculate midpoints
            mid_ankle_x = (left_ankle.x + right_ankle.x) / 2
            mid_hip_x = (left_hip.x + right_hip.x) / 2

            if abs(mid_ankle_x - mid_hip_x) > 0.15:
                feedback.append("Your weight seems unbalanced. Try to center your weight.")
            elif abs(mid_ankle_x - mid_hip_x) < 0.05:
                feedback.append("Good balance. Weight is well distributed.")

        # Add feedback if new insights were found
        current_time = time.time()

        # Remove old feedback (older than 5 seconds)
        self.posture_feedback = [f for f in self.posture_feedback if current_time - f.get('timestamp', 0) < 5]

        # Add new feedback with timestamps
        for item in feedback:
            # Check if this feedback is already in the list
            if not any(f['message'] == item for f in self.posture_feedback):
                self.posture_feedback.append({
                    'message': item,
                    'timestamp': current_time
                })

        # Keep only the most recent feedback items
        if len(self.posture_feedback) > 10:
            self.posture_feedback = sorted(self.posture_feedback, key=lambda x: x['timestamp'], reverse=True)[:10]

    def analyze_video(self, video_path: str, output_path: Optional[str] = None) -> Dict:
        """
        Analyze a video file frame by frame.

        Args:
            video_path: Path to the video file
            output_path: Optional path to save the analyzed video

        Returns:
            Dictionary containing analysis results
        """
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video file not found: {video_path}")

        # Open the video file
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        # Prepare output video if needed
        video_writer = None
        if output_path:
            fourcc = cv2.VideoWriter_fourcc(*'mp4v')
            video_writer = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

        # Start analysis
        self.start_analysis()

        # Process each frame
        frame_idx = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            # Analyze the frame
            annotated_frame, joint_angles, accuracy = self.analyze_frame(frame)

            # Write to output video if needed
            if video_writer:
                video_writer.write(annotated_frame)

            frame_idx += 1

            # Print progress
            if frame_idx % 30 == 0:
                print(f"Processing frame {frame_idx}/{total_frames} ({frame_idx/total_frames*100:.1f}%)")

        # Stop analysis
        self.stop_analysis()

        # Release resources
        cap.release()
        if video_writer:
            video_writer.release()

        # Prepare analysis summary
        summary = self.get_analysis_summary()

        return summary

    def get_analysis_summary(self) -> Dict:
        """
        Get a summary of the analysis results.

        Returns:
            Dictionary containing analysis summary
        """
        if not self.results_history:
            return {
                "status": "No analysis data available",
                "accuracy": 0,
                "feedback": [],
                "joint_angles": {},
                "frame_count": 0,
                "duration": 0
            }

        # Calculate average accuracy
        avg_accuracy = sum(result['accuracy'] for result in self.results_history) / len(self.results_history)

        # Calculate average joint angles
        all_joints = {}
        for result in self.results_history:
            for joint, angle in result['joint_angles'].items():
                if joint not in all_joints:
                    all_joints[joint] = []
                all_joints[joint].append(angle)

        avg_joint_angles = {joint: sum(angles) / len(angles) for joint, angles in all_joints.items()}

        # Calculate duration
        duration = self.results_history[-1]['timestamp'] if self.results_history else 0

        return {
            "status": "Analysis completed",
            "accuracy": avg_accuracy,
            "feedback": self.posture_feedback,
            "joint_angles": avg_joint_angles,
            "frame_count": self.frame_count,
            "duration": duration
        }

    def export_results(self, output_path: str, format: str = 'json') -> str:
        """
        Export analysis results to a file.

        Args:
            output_path: Path to save the results
            format: Format to save the results ('json' or 'csv')

        Returns:
            Path to the saved file
        """
        if not self.results_history:
            raise ValueError("No analysis data available to export")

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"pose_analysis_{timestamp}"

        if format.lower() == 'json':
            file_path = f"{output_path}/{filename}.json"
            with open(file_path, 'w') as f:
                json.dump(self.results_history, f, indent=2)

        elif format.lower() == 'csv':
            file_path = f"{output_path}/{filename}.csv"

            # Flatten the data for CSV format
            flattened_data = []
            for result in self.results_history:
                row = {
                    'frame': result['frame'],
                    'timestamp': result['timestamp'],
                    'accuracy': result['accuracy']
                }

                # Add joint angles
                for joint, angle in result['joint_angles'].items():
                    row[f"angle_{joint}"] = angle

                flattened_data.append(row)

            # Convert to DataFrame and save
            df = pd.DataFrame(flattened_data)
            df.to_csv(file_path, index=False)

        else:
            raise ValueError(f"Unsupported export format: {format}")

        return file_path
