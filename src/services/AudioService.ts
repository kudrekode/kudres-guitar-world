import { PitchDetector } from "pitchy";

export interface PitchDetectionResult {
  pitch: number | null;
  note: string | null;
  clarity: number | null;
  cents: number | null;
}

export interface AudioContextRef {
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  microphone: MediaStreamAudioSourceNode | null;
  animationFrameId: number | null;
  stream: MediaStream | null;
}

export class AudioService {
  private audioContextRef: AudioContextRef = {
    audioContext: null,
    analyser: null,
    microphone: null,
    animationFrameId: null,
    stream: null
  };

  // Initialize audio context and request microphone access
  async initialize(): Promise<void> {
    if (!this.audioContextRef.audioContext) {
      this.audioContextRef.audioContext = new (window.AudioContext || 
        (window as any).webkitAudioContext)();
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.audioContextRef.stream = stream;
      
      const audioContext = this.audioContextRef.audioContext;
      this.audioContextRef.analyser = audioContext.createAnalyser();
      this.audioContextRef.analyser.fftSize = 2048;
      
      this.audioContextRef.microphone = audioContext.createMediaStreamSource(stream);
      this.audioContextRef.microphone.connect(this.audioContextRef.analyser);
    } catch (error) {
      console.error("Error initializing audio:", error);
      throw error;
    }
  }

  // Find the closest note in the given tuning
  findClosestNote(frequency: number, tuning: Record<string, number>): { 
    note: string, 
    cents: number 
  } {
    let closestNote = "";
    let minDifference = Infinity;
    
    Object.entries(tuning).forEach(([note, noteFreq]) => {
      const difference = Math.abs(frequency - noteFreq);
      if (difference < minDifference) {
        closestNote = note;
        minDifference = difference;
      }
    });
    
    const cents = Math.round(1200 * Math.log2(frequency / tuning[closestNote]));
    
    return {
      note: closestNote,
      cents
    };
  }

  // Start pitch detection
  startPitchDetection(
    tuning: Record<string, number>,
    onPitchDetected: (result: PitchDetectionResult) => void
  ): void {
    if (!this.audioContextRef.analyser || !this.audioContextRef.audioContext) {
      throw new Error("Audio context not initialized");
    }
    
    const sampleRate = this.audioContextRef.audioContext.sampleRate;
    const bufferSize = 2048;
    const detector = PitchDetector.forFloat32Array(bufferSize);
    const inputBuffer = new Float32Array(bufferSize);
    
    const detectPitch = () => {
      if (!this.audioContextRef.analyser) return;
      
      this.audioContextRef.analyser.getFloatTimeDomainData(inputBuffer);
      
      try {
        const [detectedPitch, detectedClarity] = detector.findPitch(inputBuffer, sampleRate);
        
        if (detectedClarity > 0.8 && detectedPitch > 50) {
          const { note, cents } = this.findClosestNote(detectedPitch, tuning);
          
          onPitchDetected({
            pitch: detectedPitch,
            note,
            clarity: detectedClarity,
            cents
          });
        }
      } catch (err) {
        console.error("Pitch detection error:", err);
      }
      
      this.audioContextRef.animationFrameId = requestAnimationFrame(detectPitch);
    };
    
    detectPitch();
  }

  // Stop pitch detection and clean up resources
  stopPitchDetection(): void {
    if (this.audioContextRef.animationFrameId) {
      cancelAnimationFrame(this.audioContextRef.animationFrameId);
      this.audioContextRef.animationFrameId = null;
    }
    
    if (this.audioContextRef.stream) {
      this.audioContextRef.stream.getTracks().forEach(track => track.stop());
      this.audioContextRef.stream = null;
    }
    
    if (this.audioContextRef.microphone) {
      this.audioContextRef.microphone.disconnect();
      this.audioContextRef.microphone = null;
    }
  }

  // Clean up all resources
  cleanup(): void {
    this.stopPitchDetection();
    
    if (this.audioContextRef.audioContext) {
      this.audioContextRef.audioContext.close();
      this.audioContextRef.audioContext = null;
    }
  }
}

export default new AudioService(); 