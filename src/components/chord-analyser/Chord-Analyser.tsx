import {Fretboard} from "@moonwave99/fretboard.js";
import {useRef, useEffect, useState} from "react";
import {get as getScale} from '@tonaljs/scale';
import ChordDisplay from './ChordDisplay';
import './ChordAnalyser.css';

// We create a custom type for the fretbaord.js requirements (i..e, a enumeration almost type):
type Position = Record<string, string | number | boolean | (string | number)[]>;

// dot configuration interface so we can add dots and remove them easily:
interface DotConfig {
    moving?: boolean;
    note?: string;
}

// ensures that the dot is a position type:
interface Dot extends Position {
    fret: number;
    string: number;
    note: string;
}

interface ChordAnalyserProps {
    onClose: () => void;
}

// Common guitar tunings with their names and notes:
const TUNINGS = {
    'Standard': ["E2", "A2", "D3", "G3", "B3", "E4"],
    'Drop D': ["D2", "A2", "D3", "G3", "B3", "E4"],
    'Open G': ["D2", "G2", "D3", "G3", "B3", "D4"],
    'DADGAD': ["D2", "A2", "D3", "G3", "A3", "D4"],
    'Half Step Down': ["Eb2", "Ab2", "Db3", "Gb3", "Bb3", "Eb4"],
    'Open D': ["D2", "A2", "D3", "F#3", "A3", "D4"]
} as const;

type TuningName = keyof typeof TUNINGS;

const ChordAnalyser: React.FC<ChordAnalyserProps> = ({ onClose }) => {
    // Create a ref to render in the DOM:
    const fretboardRef = useRef<HTMLDivElement>(null);
    const fretboardInstance = useRef<Fretboard | null>(null);
    const dotsRef = useRef<Dot[]>([]);

    // useState only for selected notes to trigger re-renders:
    const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
    // Add state for current tuning:
    const [currentTuning, setCurrentTuning] = useState<TuningName>('Standard');

    // Clear all dots and selected notes:
    const handleClear = () => {
        dotsRef.current = [];
        setSelectedNotes([]);
        if (fretboardInstance.current) {
            fretboardInstance.current.setDots([]).render();
        }
    };

    // Handle tuning change:
    const handleTuningChange = (tuningName: TuningName) => {
        setCurrentTuning(tuningName);
        // Clear current selections when tuning changes
        handleClear();
    };

    // Handle close with cleanup
    const handleClose = () => {
        handleClear();
        onClose();
    };

    // Wrap everything in a useEffect so we run this code on mount of FC:
    useEffect(() => {
        // Checks the Fretboard Div exists before render:
        if (fretboardRef.current) {
            //Prevents there being two instances:
            fretboardRef.current.innerHTML = '';

            //Initialise the fretboard from the package here:
            const fretboard = new Fretboard({
                el: fretboardRef.current,
                fretColor: 'blue',
                dotFill: ({ moving }: DotConfig) => moving ? '#999' : '#f00',
                dotStrokeColor: ({ moving }: DotConfig) => moving ? '#666' : '#900',
                dotText: ({ note }: DotConfig) => note || '',
                dotSize: 25
            });

            // Store the fretboard instance:
            fretboardInstance.current = fretboard;

            //render the fretboard first:
            fretboard.render();

            // Create a mutable copy of the tuning array
            const tuning = [...TUNINGS[currentTuning]].reverse();
            const fretboardNotes = tuning.map((note: string) => {
                const [noteName, octave] = note.split(/(\d+)/);
                return [
                    // we use getScale from Tonal.js (included in moowaves package:
                    ...getScale(`${note} chromatic`).notes,
                    ...getScale(`${noteName}${+octave + 1} chromatic`).notes,
                ];
            });

            // Built in methods for mouse clicking the fretboard with moonwave:
            fretboard.on("mousemove", ({ fret, string }) => {
                const note = fretboardNotes[string - 1][fret];
                const dot = {
                    fret,
                    string,
                    note: note.substring(0, note.length - 1),
                    moving: true
                };

                const dotsToRender = [...dotsRef.current];
                const existingDotIndex = dotsToRender.findIndex((x) => x.fret === fret && x.string === string);
                if (existingDotIndex === -1) {
                    dotsToRender.push(dot);
                    fretboard.setDots(dotsToRender).render();
                }
            });

            // When removing a dot:
            fretboard.on("mouseleave", () => {
                fretboard.setDots(dotsRef.current).render();
            });

            // Actual clicking on a fret and rendering:
            fretboard.on("click", ({ fret, string }) => {
                const note = fretboardNotes[string - 1][fret];
                const noteWithoutOctave = note.substring(0, note.length - 1);
                const dot = {
                    fret,
                    string,
                    note: noteWithoutOctave
                };

                // We use existing consts so that if a dot on fret already, we can remove it (no multiple dots on same string):
                const existingStringDotIndex = dotsRef.current.findIndex(x => x.string === string);
                const existingDotIndex = dotsRef.current.findIndex(x => x.fret === fret && x.string === string);
                if (existingDotIndex !== -1) {
                    dotsRef.current.splice(existingDotIndex, 1);
                    setSelectedNotes(prev => prev.filter(n => n !== noteWithoutOctave));
                } 
                else if (existingStringDotIndex !== -1) {
                    // Remove the old note from selected notes:
                    const oldDot = dotsRef.current[existingStringDotIndex];
                    setSelectedNotes(prev => prev.filter(n => n !== oldDot.note));
                    
                    // Replace the old dot with the new one:
                    dotsRef.current[existingStringDotIndex] = dot;
                    setSelectedNotes(prev => [...prev, noteWithoutOctave]);
                }
                // If clicking on a completely new string we do add:
                else {
                    dotsRef.current.push(dot);
                    setSelectedNotes(prev => [...prev, noteWithoutOctave]);
                }

                fretboard.setDots(dotsRef.current).render();
            });
        }
        //Nothing in dependency so runs on mount!
    }, [currentTuning]); // Add currentTuning as dependency

    return(
        <div className="chord-analyser">
            <div className="chord-analyser-header">
                <h2>Chord Analyser</h2>
                <button className="close-button" onClick={handleClose}>×</button>
            </div>
            <div className="tuning-selector">
                <label htmlFor="tuning-select">Tuning: </label>
                <select 
                    id="tuning-select"
                    value={currentTuning}
                    onChange={(e) => handleTuningChange(e.target.value as TuningName)}
                    className="tuning-select"
                >
                    {Object.keys(TUNINGS).map((tuning) => (
                        <option key={tuning} value={tuning}>
                            {tuning}
                        </option>
                    ))}
                </select>
            </div>
            <div className="fretboard-container" ref={fretboardRef}></div>
            <button 
                className="clear-button" 
                onClick={handleClear}
            >
                Clear Fretboard
            </button>
            <ChordDisplay selectedNotes={selectedNotes} />
        </div>
    );
};

export default ChordAnalyser;


