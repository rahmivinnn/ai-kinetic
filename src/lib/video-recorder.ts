/**
 * Video recorder utility for capturing video from canvas or camera
 */

// Define recorder options type
export interface RecorderOptions {
  mimeType?: string;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
  audioChannels?: number;
  frameRate?: number;
}

// Define recorder state type
export type RecorderState = 'inactive' | 'recording' | 'paused';

/**
 * VideoRecorder class for recording video from canvas or camera
 */
export class VideoRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private video: HTMLVideoElement | null = null;
  private options: RecorderOptions;
  private state: RecorderState = 'inactive';
  private startTime: number = 0;
  private duration: number = 0;
  private pauseTime: number = 0;
  private frameInterval: number | null = null;

  /**
   * Create a new VideoRecorder
   * @param options Recording options
   */
  constructor(options: RecorderOptions = {}) {
    this.options = {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: 2500000,
      audioBitsPerSecond: 128000,
      frameRate: 30,
      ...options
    };
  }

  /**
   * Initialize recorder with canvas for recording canvas content
   * @param canvas Canvas element to record
   * @param withAudio Whether to include audio
   * @returns Promise that resolves when recorder is initialized
   */
  public async initWithCanvas(canvas: HTMLCanvasElement, withAudio: boolean = false): Promise<boolean> {
    try {
      this.canvas = canvas;
      
      // Create a stream from the canvas
      const canvasStream = canvas.captureStream(this.options.frameRate || 30);
      
      // If audio is requested, get audio stream and combine with canvas stream
      if (withAudio) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioTracks = audioStream.getAudioTracks();
          
          if (audioTracks.length > 0) {
            audioTracks.forEach(track => canvasStream.addTrack(track));
          }
        } catch (error) {
          console.warn('Could not get audio stream:', error);
        }
      }
      
      this.stream = canvasStream;
      this.initMediaRecorder();
      return true;
    } catch (error) {
      console.error('Error initializing canvas recorder:', error);
      return false;
    }
  }

  /**
   * Initialize recorder with video element for recording camera
   * @param video Video element to record
   * @returns Promise that resolves when recorder is initialized
   */
  public async initWithCamera(video: HTMLVideoElement): Promise<boolean> {
    try {
      this.video = video;
      
      // If video already has a stream, use it
      if (video.srcObject instanceof MediaStream) {
        this.stream = video.srcObject;
        this.initMediaRecorder();
        return true;
      }
      
      // Otherwise, get a new stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      video.srcObject = stream;
      this.stream = stream;
      this.initMediaRecorder();
      return true;
    } catch (error) {
      console.error('Error initializing camera recorder:', error);
      return false;
    }
  }

  /**
   * Initialize the MediaRecorder
   */
  private initMediaRecorder(): void {
    if (!this.stream) return;
    
    try {
      // Check if the preferred mime type is supported
      if (!MediaRecorder.isTypeSupported(this.options.mimeType!)) {
        // Fall back to a more widely supported format
        this.options.mimeType = 'video/webm';
        
        // If still not supported, let the browser decide
        if (!MediaRecorder.isTypeSupported(this.options.mimeType)) {
          this.options.mimeType = '';
        }
      }
      
      // Create the media recorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: this.options.mimeType,
        videoBitsPerSecond: this.options.videoBitsPerSecond,
        audioBitsPerSecond: this.options.audioBitsPerSecond
      });
      
      // Set up event handlers
      this.mediaRecorder.ondataavailable = this.handleDataAvailable.bind(this);
      this.state = 'inactive';
      
      console.log('MediaRecorder initialized with options:', this.options);
    } catch (error) {
      console.error('Error creating MediaRecorder:', error);
      this.mediaRecorder = null;
    }
  }

  /**
   * Handle data available event
   * @param event Data available event
   */
  private handleDataAvailable(event: BlobEvent): void {
    if (event.data && event.data.size > 0) {
      this.recordedChunks.push(event.data);
    }
  }

  /**
   * Start recording
   * @returns Promise that resolves when recording starts
   */
  public start(): boolean {
    if (!this.mediaRecorder || this.state === 'recording') return false;
    
    try {
      this.recordedChunks = [];
      this.mediaRecorder.start(1000); // Collect data every second
      this.state = 'recording';
      this.startTime = Date.now();
      
      // If recording from canvas with a video source, start the frame capture loop
      if (this.canvas && this.video && this.video.readyState >= 2) {
        this.startCanvasCapture();
      }
      
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      return false;
    }
  }

  /**
   * Start canvas capture loop for recording video frames
   */
  private startCanvasCapture(): void {
    if (!this.canvas || !this.video) return;
    
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    
    const frameRate = this.options.frameRate || 30;
    const frameInterval = 1000 / frameRate;
    
    // Clear any existing interval
    if (this.frameInterval !== null) {
      clearInterval(this.frameInterval);
    }
    
    // Start new interval
    this.frameInterval = window.setInterval(() => {
      if (this.state === 'recording' && this.video!.readyState >= 2) {
        ctx.drawImage(
          this.video!,
          0, 0,
          this.canvas!.width,
          this.canvas!.height
        );
      }
    }, frameInterval);
  }

  /**
   * Pause recording
   * @returns Whether pause was successful
   */
  public pause(): boolean {
    if (!this.mediaRecorder || this.state !== 'recording') return false;
    
    try {
      this.mediaRecorder.pause();
      this.state = 'paused';
      this.pauseTime = Date.now();
      return true;
    } catch (error) {
      console.error('Error pausing recording:', error);
      return false;
    }
  }

  /**
   * Resume recording
   * @returns Whether resume was successful
   */
  public resume(): boolean {
    if (!this.mediaRecorder || this.state !== 'paused') return false;
    
    try {
      this.mediaRecorder.resume();
      this.state = 'recording';
      this.duration += (Date.now() - this.pauseTime);
      return true;
    } catch (error) {
      console.error('Error resuming recording:', error);
      return false;
    }
  }

  /**
   * Stop recording
   * @returns Promise that resolves with the recorded blob
   */
  public stop(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.state === 'inactive') {
        reject(new Error('No active recording'));
        return;
      }
      
      // Update duration
      if (this.state === 'recording') {
        this.duration += (Date.now() - this.startTime);
      }
      
      // Clear frame capture interval if it exists
      if (this.frameInterval !== null) {
        clearInterval(this.frameInterval);
        this.frameInterval = null;
      }
      
      // Set up stop event handler
      this.mediaRecorder.onstop = () => {
        try {
          // Create a blob from the recorded chunks
          const blob = new Blob(this.recordedChunks, {
            type: this.options.mimeType
          });
          
          this.state = 'inactive';
          resolve(blob);
        } catch (error) {
          reject(error);
        }
      };
      
      // Stop the recorder
      this.mediaRecorder.stop();
    });
  }

  /**
   * Get the current state of the recorder
   * @returns Current state
   */
  public getState(): RecorderState {
    return this.state;
  }

  /**
   * Get the current recording duration in milliseconds
   * @returns Recording duration
   */
  public getDuration(): number {
    if (this.state === 'inactive') {
      return this.duration;
    } else if (this.state === 'paused') {
      return this.duration + (this.pauseTime - this.startTime);
    } else {
      return this.duration + (Date.now() - this.startTime);
    }
  }

  /**
   * Clean up resources
   */
  public dispose(): void {
    if (this.mediaRecorder && this.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (error) {
        console.error('Error stopping recorder during disposal:', error);
      }
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    if (this.frameInterval !== null) {
      clearInterval(this.frameInterval);
      this.frameInterval = null;
    }
    
    this.canvas = null;
    this.video = null;
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.state = 'inactive';
  }
}
