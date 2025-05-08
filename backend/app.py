"""
Flask API for OpenPose Analyzer
"""

from flask import Flask, request, jsonify, Response, send_file
from flask_cors import CORS
import cv2
import numpy as np
import base64
import os
import tempfile
import time
import threading
from werkzeug.utils import secure_filename
from openpose_analyzer import OpenPoseAnalyzer

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize OpenPose Analyzer
analyzer = OpenPoseAnalyzer(model_complexity=1)

# Global variables for webcam streaming
webcam = None
webcam_lock = threading.Lock()
is_streaming = False
stream_thread = None

# Temporary directory for uploaded videos
UPLOAD_FOLDER = os.path.join(tempfile.gettempdir(), 'openpose_analyzer')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'mp4', 'avi', 'mov', 'webm'}

def encode_frame(frame):
    """Encode a frame to base64 for sending over HTTP."""
    _, buffer = cv2.imencode('.jpg', frame)
    return base64.b64encode(buffer).decode('utf-8')

def webcam_stream():
    """Generator function for webcam streaming."""
    global webcam, is_streaming
    
    if webcam is None:
        with webcam_lock:
            webcam = cv2.VideoCapture(0)
    
    try:
        while is_streaming:
            with webcam_lock:
                if not webcam.isOpened():
                    break
                    
                success, frame = webcam.read()
                if not success:
                    break
                
                # Analyze the frame if analysis is active
                if analyzer.is_analyzing:
                    frame, joint_angles, accuracy = analyzer.analyze_frame(frame)
                
            # Encode the frame
            encoded_frame = encode_frame(frame)
            
            # Yield the frame in multipart format
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + 
                   base64.b64decode(encoded_frame) + b'\r\n')
            
            # Control the frame rate
            time.sleep(0.03)  # ~30 FPS
    
    finally:
        # Clean up resources
        with webcam_lock:
            if webcam is not None and webcam.isOpened():
                webcam.release()
                webcam = None

@app.route('/api/start_webcam', methods=['POST'])
def start_webcam():
    """Start the webcam stream."""
    global is_streaming
    
    is_streaming = True
    
    return jsonify({
        'status': 'success',
        'message': 'Webcam stream started'
    })

@app.route('/api/stop_webcam', methods=['POST'])
def stop_webcam():
    """Stop the webcam stream."""
    global is_streaming, webcam
    
    is_streaming = False
    
    with webcam_lock:
        if webcam is not None and webcam.isOpened():
            webcam.release()
            webcam = None
    
    return jsonify({
        'status': 'success',
        'message': 'Webcam stream stopped'
    })

@app.route('/api/webcam_stream')
def get_webcam_stream():
    """Stream webcam frames with pose analysis."""
    global is_streaming
    
    is_streaming = True
    
    return Response(
        webcam_stream(),
        mimetype='multipart/x-mixed-replace; boundary=frame'
    )

@app.route('/api/start_analysis', methods=['POST'])
def start_analysis():
    """Start pose analysis."""
    analyzer.start_analysis()
    
    return jsonify({
        'status': 'success',
        'message': 'Pose analysis started'
    })

@app.route('/api/stop_analysis', methods=['POST'])
def stop_analysis():
    """Stop pose analysis."""
    analyzer.stop_analysis()
    
    # Get analysis summary
    summary = analyzer.get_analysis_summary()
    
    return jsonify({
        'status': 'success',
        'message': 'Pose analysis stopped',
        'summary': summary
    })

@app.route('/api/get_feedback', methods=['GET'])
def get_feedback():
    """Get current posture feedback."""
    return jsonify({
        'status': 'success',
        'feedback': analyzer.posture_feedback,
        'accuracy': analyzer.current_accuracy,
        'joint_angles': analyzer.joint_angles
    })

@app.route('/api/upload_video', methods=['POST'])
def upload_video():
    """Upload and analyze a video file."""
    if 'video' not in request.files:
        return jsonify({
            'status': 'error',
            'message': 'No video file provided'
        }), 400
    
    video_file = request.files['video']
    
    if video_file.filename == '':
        return jsonify({
            'status': 'error',
            'message': 'No video file selected'
        }), 400
    
    if not allowed_file(video_file.filename):
        return jsonify({
            'status': 'error',
            'message': 'File type not allowed. Please upload MP4, AVI, MOV, or WEBM files.'
        }), 400
    
    # Save the uploaded file
    filename = secure_filename(video_file.filename)
    timestamp = int(time.time())
    video_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{timestamp}_{filename}")
    video_file.save(video_path)
    
    # Prepare output path
    output_filename = f"analyzed_{timestamp}_{filename}"
    output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
    
    # Analyze the video in a separate thread to avoid blocking
    def analyze_video_task():
        try:
            summary = analyzer.analyze_video(video_path, output_path)
            # Clean up the original video file
            if os.path.exists(video_path):
                os.remove(video_path)
        except Exception as e:
            print(f"Error analyzing video: {e}")
    
    threading.Thread(target=analyze_video_task).start()
    
    return jsonify({
        'status': 'success',
        'message': 'Video uploaded and analysis started',
        'video_id': f"{timestamp}_{filename}",
        'output_video': output_filename
    })

@app.route('/api/video_result/<video_id>', methods=['GET'])
def get_video_result(video_id):
    """Get the analyzed video result."""
    output_filename = f"analyzed_{video_id}"
    output_path = os.path.join(app.config['UPLOAD_FOLDER'], output_filename)
    
    if not os.path.exists(output_path):
        return jsonify({
            'status': 'pending',
            'message': 'Video analysis is still in progress'
        })
    
    return send_file(output_path, mimetype='video/mp4')

@app.route('/api/export_results', methods=['POST'])
def export_results():
    """Export analysis results to a file."""
    format_type = request.json.get('format', 'json')
    
    try:
        file_path = analyzer.export_results(app.config['UPLOAD_FOLDER'], format_type)
        filename = os.path.basename(file_path)
        
        return jsonify({
            'status': 'success',
            'message': f'Results exported as {format_type}',
            'file': filename
        })
    
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@app.route('/api/download_results/<filename>', methods=['GET'])
def download_results(filename):
    """Download exported results file."""
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    
    if not os.path.exists(file_path):
        return jsonify({
            'status': 'error',
            'message': 'File not found'
        }), 404
    
    # Determine the MIME type based on file extension
    mime_type = 'application/json' if filename.endswith('.json') else 'text/csv'
    
    return send_file(file_path, mimetype=mime_type, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
