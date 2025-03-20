import {useState, useEffect, useRef} from 'react';
import useSound from 'use-sound';
import BPMControl from './BPMControl';
import TimeSignatureControl, { TimeSignature, commonTimeSignatures } from './TimeSignatureControl';
import click1 from '/assets/audio/click1.wav';
import click2 from '/assets/audio/click2.wav';
import './Metronome.css';

interface MetronomeProps {
    onClose?: () => void;
}

const Metronome:React.FC<MetronomeProps> = ({ onClose }) => {
    // useState to change BPM:
    const [bpm, setBpm] = useState(100);
    const [isPlaying, setIsPlaying] = useState(false);
    
    // yseState to change the time signature:
    const [timeSignature, setTimeSignature] = useState<TimeSignature>(commonTimeSignatures[0]); // Default to 4/4
    
    // useState to track UI changes:
    const [currentBeat, setCurrentBeat] = useState<number>(1);
    
    // Clicks imported and use useSound to play:
    const [playClick1] = useSound(click1);
    const [playClick2] = useSound(click2);
    
    // Refs to track timing and state between renders
    const animationFrameRef = useRef<number | null>(null);
    const lastTickTimeRef = useRef<number | null>(null);
    const beatIndexRef = useRef<number>(0);
    
    // Calculate milliseconds per beat based on BPM and time signature
    const msPerBeat = calculateMsPerBeat(bpm, timeSignature);
    
    // Function to calculate ms per beat based on time signature
    function calculateMsPerBeat(bpm: number, ts: TimeSignature): number {
        if (ts.value === 4) {
            return 60000 / bpm;
        }
        
        // for x/8 timesigs, we have to count dotted quater notes:
        if (ts.value === 8) {
            return (60000 / bpm) * (3 / (ts.beats / 2));
        }
        
        if (ts.value === 2) {
            return (60000 / bpm) * 2;
        }
        
        // same to count 16ths:
        if (ts.value === 16) {
            return (60000 / bpm) / 4;
        }
        
        // Default fallback
        return 60000 / bpm;
    }
    
    // Actual metronome loop with useEffect to have real time changes:
    useEffect(() => {
        if (isPlaying) {
            startMetronome();
        } else {
            stopMetronome();
            setCurrentBeat(1);
        }
        
        // Cleanup funciton for unmounting:
        return () => {
            stopMetronome();
        };
    }, [isPlaying, bpm, timeSignature]); 
    
    // Actual start function:
    const startMetronome = () => {
        // Resets the timing references and beat index:
        lastTickTimeRef.current = null;
        beatIndexRef.current = 0;
        setCurrentBeat(1);
        
        // Start the animation frame loop:
        tick();
    };
    
    // Function to stop the metronome
    const stopMetronome = () => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    };
    
    // The main timing function using requestAnimationFrame
    const tick = (timestamp?: number) => {
        if (!timestamp) {
            animationFrameRef.current = requestAnimationFrame(tick);
            return;
        }
        
        if (lastTickTimeRef.current === null) {
            lastTickTimeRef.current = timestamp;

            //ensure first beat is the accent:
            playClick2(); 
            
            animationFrameRef.current = requestAnimationFrame(tick);
            return;
        }
        
        const elapsed = timestamp - lastTickTimeRef.current;
        
        if (elapsed >= msPerBeat) {
            beatIndexRef.current = (beatIndexRef.current + 1) % timeSignature.beats;
            
            // Play the appropriate click sound depending on where in loop:
            if (beatIndexRef.current === 0) {
                playClick2(); 
            } else {
                // for the other tim sigs:
                if (timeSignature.value === 8 && beatIndexRef.current % 3 === 0) {
                    playClick2();
                } else {
                    playClick1();
                }
            }
            
            setCurrentBeat(beatIndexRef.current + 1);
            
            lastTickTimeRef.current = timestamp - (elapsed % msPerBeat);
        }
        
        animationFrameRef.current = requestAnimationFrame(tick);
    };
    
    const handleBpmChange = (newBpm: number) => {
        setBpm(newBpm);
    };
    
    const handleTimeSignatureChange = (newTimeSignature: TimeSignature) => {
        setTimeSignature(newTimeSignature);
        beatIndexRef.current = 0;
        setCurrentBeat(1);
    };
    
    // Handle closing the metronome
    const handleClose = () => {
        // Stop the metronome if it's playing
        if (isPlaying) {
            setIsPlaying(false);
            stopMetronome();
        }
        
        // Call the onClose prop if provided
        if (onClose) {
            onClose();
        }
    };
    
    return (
        <div className="metronome">
            <div className="metronome-header">
                <h1>Metronome</h1>
                {onClose && (
                    <button className="close-button" onClick={handleClose}>
                        ×
                    </button>
                )}
            </div>
            
            <div className="metronome-controls">
                <div className="control-section">
                    <h3>BPM</h3>
                    <BPMControl bpm={bpm} setBpm={handleBpmChange} />
                </div>
                
                <div className="control-section">
                    <TimeSignatureControl 
                        timeSignature={timeSignature} 
                        onTimeSignatureChange={handleTimeSignatureChange} 
                    />
                </div>
            </div>
            
            <div className="beat-display">
                <div className="beat-indicator">
                    {Array.from({ length: timeSignature.beats }).map((_, index) => (
                        <div 
                            key={index} 
                            className={`beat ${currentBeat === index + 1 && isPlaying ? 'active' : ''}`}
                        />
                    ))}
                </div>
                <p className="beat-count">
                    {isPlaying ? `Beat: ${currentBeat} of ${timeSignature.beats}` : 'Press Start'}
                </p>
            </div>
            
            <button 
                className={`metronome-button ${isPlaying ? 'stop' : 'start'}`}
                onClick={() => setIsPlaying(prev => !prev)}
            >
                {isPlaying ? "Stop" : "Start"}
            </button>
        </div>
    );
};

export default Metronome;