import { Chord } from '@tonaljs/tonal';

interface ChordDisplayProps {
    selectedNotes: string[];
}

const ChordDisplay: React.FC<ChordDisplayProps> = ({ selectedNotes }) => {
    const detectChord = (notes: string[]) => {
        if (notes.length === 0) return null;

        // Get all possible chord names from the selected notes:
        let detected = Chord.detect(notes);

        if (detected.length === 0) return "No recognized chord";

        //If the output is a major chord it will write DM (D major) and for minor, Dm. So to make it more readable we change the capitalised M to be removed:
        detected = detected.map(note => note.replace('M', ''));

        // Return the first (most likely) chord name? Come back to!:
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