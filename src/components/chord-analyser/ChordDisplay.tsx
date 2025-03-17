import React from 'react';
import { Chord } from '@tonaljs/tonal';

interface ChordDisplayProps {
    selectedNotes: string[];
}

const ChordDisplay: React.FC<ChordDisplayProps> = ({ selectedNotes }) => {
    const detectChord = (notes: string[]) => {
        if (notes.length === 0) return null;
        
        // Get all possible chord names from the selected notes:
        const detected = Chord.detect(notes);
        
        if (detected.length === 0) return "No recognized chord";
        
        // Return the first (most likely) chord name:
        return detected[0];
    };

    const chordName = detectChord(selectedNotes);

    return (
        <div className="chord-display">
            <h3>Selected Notes: {selectedNotes.join(', ') || 'None'}</h3>
            <h2>Detected Chord: {chordName || 'Select notes to detect chord'}</h2>
        </div>
    );
};

export default ChordDisplay; 