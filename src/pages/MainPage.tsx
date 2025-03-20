import {useState} from "react";

import Tuner from "../components/tuner/PitchyTuner.tsx";
import Metronome from "../components/metronome/Metronome.tsx";
import ChordAnalyser from "../components/chord-analyser/Chord-Analyser.tsx";
import MidiSequencer from "../components/midi-sequencer/MidiSequencer.tsx";

import "./MainPage.css";

const MainPage:React.FC = () => {

    // useState to open and close the tuner (similarly to a modal)
    const [isTunerOpen, setIsTunerOpen] = useState(false);
    // useState to open and close the metronome
    const [isMetronomeOpen, setIsMetronomeOpen] = useState(false);
    // useState to open and close the chord analyzer
    const [isChordAnalyserOpen, setIsChordAnalyserOpen] = useState(false);
    // useState to open and close the sequencer
    const [isSequencerOpen, setIsSequencerOpen] = useState(false);

    const toggleTuner = () => {
        setIsTunerOpen(!isTunerOpen);
        // Close other components if tuner is being opened
        if (!isTunerOpen) {
            setIsMetronomeOpen(false);
            setIsChordAnalyserOpen(false);
            setIsSequencerOpen(false);
        }
    }

    const toggleMetronome = () => {
        setIsMetronomeOpen(!isMetronomeOpen);
        // Close other components if metronome is being opened
        if (!isMetronomeOpen) {
            setIsTunerOpen(false);
            setIsChordAnalyserOpen(false);
            setIsSequencerOpen(false);
        }
    }

    const toggleChordAnalyser = () => {
        setIsChordAnalyserOpen(!isChordAnalyserOpen);
        // Close other components if chord analyser is being opened
        if (!isChordAnalyserOpen) {
            setIsTunerOpen(false);
            setIsMetronomeOpen(false);
            setIsSequencerOpen(false);
        }
    }

    const toggleSequencer = () => {
        setIsSequencerOpen(!isSequencerOpen);
        // Close other components if tuner is being opened
        if (!isSequencerOpen) {
            setIsTunerOpen(false);
            setIsMetronomeOpen(false);
            setIsChordAnalyserOpen(false);
        }
    }

    return (
        <div className="MainPage">
            <h1>Kudre's Guitar World</h1>

            <div className="other-content">
                <p>Welcome to Kudre's Guitar World.</p>
                <p>This website was developed to practice my full stack coding skills whilst also giving guitarists everything they need to practice and learn the guitar.</p>
                <p>The website has a guitar tuner with most tunings you can think of ready to go, a metronome to practice to, a beat maker to practice those harder tunes as well as some general guitar music theory!</p>
                <p>Enjoy!</p>
            </div>

            <div className="tool-buttons">
                {!isMetronomeOpen && <button onClick={toggleMetronome}>Open Metronome</button>}
                {!isTunerOpen && <button onClick={toggleTuner}>Open Tuner</button>}
                {!isChordAnalyserOpen && <button onClick={toggleChordAnalyser}>Open Chord Analyser</button>}
                {!isSequencerOpen && <button onClick={toggleSequencer}>Open Beat Sequencer</button>}
            </div>

            {isMetronomeOpen && <Metronome onClose={toggleMetronome} />}
            {isTunerOpen && <Tuner onClose={toggleTuner}/>}
            {isChordAnalyserOpen && <ChordAnalyser onClose={toggleChordAnalyser} />}
            {isSequencerOpen && <MidiSequencer onClose={toggleSequencer} />}

        </div>
    )
}
export default MainPage;