// TensorFlow.js initialization script
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

/**
 * Initialize TensorFlow.js with optimal settings
 * @returns Promise that resolves when TensorFlow.js is initialized
 */
export const initializeTensorFlow = async (): Promise<boolean> => {
  try {
    // Wait for TensorFlow.js to be ready
    await tf.ready();
    console.log('TensorFlow.js core initialized');
    
    // Set backend to WebGL for better performance
    await tf.setBackend('webgl');
    console.log('WebGL backend initialized');
    
    // Set WebGL flags for better performance
    const gl = await tf.backend().getGPGPUContext().gl;
    
    // Configure WebGL for better performance
    if (gl) {
      // Disable depth testing
      gl.disable(gl.DEPTH_TEST);
      
      // Disable stencil testing
      gl.disable(gl.STENCIL_TEST);
      
      // Disable blending
      gl.disable(gl.BLEND);
      
      // Set dither to false
      gl.disable(gl.DITHER);
      
      console.log('WebGL optimizations applied');
    }
    
    // Configure memory management
    tf.env().set('WEBGL_DELETE_TEXTURE_THRESHOLD', 0);
    tf.env().set('WEBGL_FORCE_F16_TEXTURES', true);
    tf.env().set('WEBGL_PACK', true);
    
    // Log TensorFlow.js version and backend
    console.log(`TensorFlow.js version: ${tf.version.tfjs}`);
    console.log(`Using backend: ${tf.getBackend()}`);
    
    return true;
  } catch (error) {
    console.error('Error initializing TensorFlow.js:', error);
    return false;
  }
};

/**
 * Clean up TensorFlow.js resources
 */
export const cleanupTensorFlow = (): void => {
  try {
    // Dispose of any tensors in memory
    tf.disposeVariables();
    
    // Clear the backend
    tf.engine().endScope();
    tf.engine().startScope();
    
    console.log('TensorFlow.js resources cleaned up');
  } catch (error) {
    console.error('Error cleaning up TensorFlow.js resources:', error);
  }
};

/**
 * Get TensorFlow.js memory info
 * @returns Memory info object
 */
export const getTensorFlowMemoryInfo = (): tf.MemoryInfo => {
  return tf.memory();
};

/**
 * Check if WebGL is available and supported
 * @returns Boolean indicating if WebGL is supported
 */
export const isWebGLSupported = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
};

/**
 * Get WebGL information
 * @returns Object with WebGL information
 */
export const getWebGLInfo = (): { vendor: string; renderer: string; version: string } | null => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return null;
    }
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    
    if (!debugInfo) {
      return {
        vendor: 'Unknown',
        renderer: 'Unknown',
        version: gl.getParameter(gl.VERSION)
      };
    }
    
    return {
      vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
      renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
      version: gl.getParameter(gl.VERSION)
    };
  } catch (e) {
    return null;
  }
};
