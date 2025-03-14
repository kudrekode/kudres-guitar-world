import React, { useEffect, useState } from "react";
import "./PitchyTuner.css"; 
import TuningSelector, { TuningName, tunings } from "./TuningSelector";
import TuningMeter from "./TuningMeter";
import StringButtons from "./StringButtons";
import audioService, { PitchDetectionResult } from "../../services/AudioService";

// We create some props so we can close the tuner like a modal:
interface TunerProps {
    onClose: () => void;
}

// We pass the prop into the component:
const Tuner: React.FC<TunerProps> = ({ onClose }) => {
    // States for UI updates
    const [pitch, setPitch] = useState<number | null>(null);
    const [note, setNote] = useState<string | null>(null);
    const [clarity, setClarity] = useState<number | null>(null);
    const [cents, setCents] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [currentTuning, setCurrentTuning] = useState<TuningName>('Standard');
    const [showTuningSelector, setShowTuningSelector] = useState<boolean>(false);
    const [inTune, setInTune] = useState<boolean>(false);
    
    // Get the current tuning frequencies
    const tuning = tunings[currentTuning];

    // Handle pitch detection results
    const handlePitchDetected = (result: PitchDetectionResult) => {
        setPitch(result.pitch);
        setNote(result.note);
        setClarity(result.clarity);
        
        if (result.cents !== null) {
            setCents(result.cents);
            setInTune(Math.abs(result.cents) < 5);
        }
    };

    // Start the tuner
    const startTuner = async () => {
        try {
            setError(null);
            
            await audioService.initialize();
            audioService.startPitchDetection(tuning, handlePitchDetected);
            
            setIsActive(true);
        } catch (error) {
            console.error("Error starting tuner:", error);
            setError("Could not access microphone. Please check permissions.");
            setIsActive(false);
        }
    };

    // Stop the tuner
    const stopTuner = () => {
        audioService.stopPitchDetection();
        setIsActive(false);
    };

    // Change the current tuning
    const changeTuning = (newTuning: TuningName) => {
        // If tuner is active, stop it before changing tuning
        if (isActive) {
            stopTuner();
        }
        
        setCurrentTuning(newTuning);
        setNote(null);
        setPitch(null);
        setClarity(null);
        setCents(0);
        setShowTuningSelector(false);
    };

    // Toggle the tuning selector dropdown
    const toggleTuningSelector = () => {
        setShowTuningSelector(!showTuningSelector);
    };

    // Handle note selection from string buttons
    const handleNoteSelect = (selectedNote: string, frequency: number) => {
        setNote(selectedNote);
        setPitch(frequency);
        setCents(0);
        setInTune(true);
    };

    // Clean up on component unmount
    useEffect(() => {
        return () => {
            audioService.cleanup();
        };
    }, []);

    return (
        <div className="tuner-container">
            <button onClick={onClose}>Close Tuner</button>

            <h1>Guitar Tuner</h1>
            
            {error && <div className="error-message">{error}</div>}
            
            <TuningSelector 
                currentTuning={currentTuning}
                showTuningSelector={showTuningSelector}
                onTuningChange={changeTuning}
                onToggleSelector={toggleTuningSelector}
            />
            
            <div className="tuner-display">
                <div className="note-display">
                    <h2>{note || "—"}</h2>
                </div>
                
                <TuningMeter cents={cents} inTune={inTune} />
                
                <div className="tuner-info">
                    <p>Frequency: {pitch ? pitch.toFixed(2) + " Hz" : "—"}</p>
                    <p>Cents: {note ? (cents > 0 ? "+" : "") + cents : "—"}</p>
                    <p>Clarity: {clarity ? (clarity * 100).toFixed(0) + "%" : "—"}</p>
                </div>
            </div>
            
            <div className="tuner-controls">
                <button 
                    className={`tuner-button ${isActive ? 'stop' : 'start'}`}
                    onClick={isActive ? stopTuner : startTuner}
                >
                    {isActive ? "Stop Tuner" : "Start Tuner"}
                </button>
            </div>
            
            <StringButtons 
                tuning={tuning}
                currentNote={note}
                onNoteSelect={handleNoteSelect}
                tuningName={currentTuning}
            />

        </div>
    );
};

export default Tuner;


