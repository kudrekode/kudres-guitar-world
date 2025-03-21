import {useState, useEffect, useRef} from 'react';
import * as Tone from "tone";

import BPMControlSequencer from "./BPMControlSequencer.tsx";
// import TimeSignatureControlSequencer from "./TimeSignatureControlSequencer.tsx"; //not neeeded?
// import TimeSignatureControl, {commonTimeSignatures, TimeSignature} from "../metronome/TimeSignatureControl.tsx";
import TimeSignatureControlSequencer, {commonTimeSignatures, TimeSignature} from "./TimeSignatureControlSequencer.tsx";

import './MidiSequencer.css';
import {start} from "tone";

interface MidiSequencerProps {
    onClose?: () => void;
}

const MidiSequencer:React.FC<MidiSequencerProps> = ({onClose}) => {

    //Some hooks to track state of whether sequencer loop has begun and whether we have started Tone.js loop:
    const [playLoop, setPlayLoop] = useState<boolean>(false);
    const [isToneStarted, setIsToneStarted] = useState<boolean>(false);

    //Unused currently
    // const [scribble, setScribble] = useState<any>(null);

    //Import and track time signature intialisation and changes:
    const [timeSignature, setTimeSignature] = useState<TimeSignature>(commonTimeSignatures[0]); // Default to 4/4

    const handleTimeSignatureChange = (newTimeSignature: TimeSignature) => {
        setTimeSignature(newTimeSignature);
    };

    //We initialise this variable to ensure that if we select new time signature it doesnt play at same time:
    const currentSequence = useRef<Tone.Sequence | null>(null);

    //Some samples of mine using Tone.Player to point to correct destination (needed to load samples into Tone.js objects):
    const drumKit = {
        kick: new Tone.Player("/assets/audio/drumsounds/kick.mp3").toDestination(),
        snare: new Tone.Player("/assets/audio/drumsounds/snare.mp3").toDestination(),
        hihat: new Tone.Player("/assets/audio/drumsounds/hihatclosed.mp3").toDestination(),
        hihatO: new Tone.Player("/assets/audio/drumsounds/hihatopen.mp3").toDestination(),
        crash: new Tone.Player("/assets/audio/drumsounds/crash.mp3").toDestination(),
        ride: new Tone.Player("/assets/audio/drumsounds/ride.mp3").toDestination(),
    };

    //Track state of BPM so when can change is while playing:
    const [bpm, setBpm] = useState(100);

    //Function to allow dyamic BPM change with Smoothing effect
    useEffect(() => {
        if (playLoop) {
            Tone.Transport.bpm.rampTo(bpm, 0.5);
        }
    }, [bpm, playLoop]);

    //The actual sequencer loop (calls start loop fns):
    useEffect(() => {
        if (playLoop) {
            startDrumLoop();
        } else {
            stopDrumLoop();
        }
        //Adding time signature into dependency ensures it will restart loop with time signature changes:
    }, [playLoop,timeSignature]);


    //We use async functions to ensure that all the modules have loaded and are waiting for other code:
    async function startDrumLoop() {

        //Tone.js will not work unless the Audio context is initialised so we do this to start with:
        if (!isToneStarted) {
            await Tone.start();
            setIsToneStarted(true);
            console.log("Tone.js AudioContext started");
        }

        //This is where we reset the sequence to stop simultaneous playing:
        if (currentSequence.current) {
            currentSequence.current.stop();
            currentSequence.current.dispose();
            currentSequence.current = null;
            console.log("Previous sequence stopped and cleared.");
        }
        //Stops and resets the Tone.Transport between loops:
        Tone.Transport.stop();
        Tone.Transport.cancel();
        Tone.Transport.bpm.value = bpm;
        Tone.Transport.timeSignature = [timeSignature.beats, timeSignature.value];


        //Import the BPM from BPM controls:
        Tone.Transport.bpm.value = bpm;

        //Potentially add a swing?:
        // Tone.Transport.swing = 0.2;


        // Tone.Transport.timeSignature = [4, 4];
        // Import custom time signatures:
        Tone.Transport.timeSignature = [timeSignature.beats, timeSignature.value];

        // Determines our quarter notes and then input into loop:
        let QuarterNotes:string = "8n";
        let TotalBeats:number[] = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

        // Determines the pattern that we can attach to different time signatures:
        let pattern: { sound: Tone.Player; beats: number[] }[] = [];

        // Actual Switch logic for different chosen time (imported from our controller):
        switch (timeSignature.name) {
            case "4/4":
                pattern = [
                    { sound: drumKit.kick, beats: [0,4,5,8,12,13] },
                    { sound: drumKit.snare, beats: [2, 6, 10, 14,15] },
                    { sound: drumKit.hihat, beats: [0,1,2,3, 4,5,6,8,9,10,11 ,12,13,14,15] },
                    { sound: drumKit.hihatO, beats: [7 ] },
                    { sound: drumKit.crash, beats: [0] },
                ];
                QuarterNotes = "8n";
                TotalBeats = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
                break;

                //Playing new time signs doesn't reset!
            case "3/4":
                pattern = [
                    { sound: drumKit.kick, beats: [0,6] },
                    { sound: drumKit.snare, beats: [2, 4, 7, 10] },
                    { sound: drumKit.hihat, beats: [0,1,2 ,3,4 ,5,7,8 ,9,10,11] },
                    { sound: drumKit.hihatO, beats: [6 ] },
                    { sound: drumKit.crash, beats: [0] },
                ];
                QuarterNotes = "8n";
                TotalBeats = [0,1,2, 3,4,5 ,6,7,8 ,9,10,11];
                break;

            case "6/8":
                pattern = [
                    { sound: drumKit.kick, beats: [0,6,12,18] },
                    { sound: drumKit.snare, beats: [ 2, 4, 7, 10, 14,16,19,23] },
                    { sound: drumKit.hihat, beats: [0,1,2, 3,4,5,
                                                        6,7,8, 9,10,11
                                                        ,12,13,14, 15,16,17
                                                        ,18,19,21, 22,23,24] },
                    { sound: drumKit.hihatO, beats: [5,11] },
                    { sound: drumKit.crash, beats: [0] },
                ];
                QuarterNotes = "8n";
                TotalBeats = [0,1,2, 3,4,5,
                                6,7,8, 9,10,11
                                ,12,13,14, 15,16,17
                                    ,18,19,21, 22,23,24];
                break;

            case "9/8":
                pattern = [
                    { sound: drumKit.kick, beats: [0,5] },
                    { sound: drumKit.snare, beats: [ 4, 8] },
                    { sound: drumKit.hihat, beats: [0,1,2,3,4,5,6,7,8,9] },
                    // { sound: drumKit.hihatO, beats: [5] },
                    { sound: drumKit.crash, beats: [0] },
                ];
                QuarterNotes = "8n";
                TotalBeats = [0,1,2,3,4,5,6,7,8,9];
                break;

            case "5/4":
                pattern = [
                    { sound: drumKit.kick, beats: [0,6,12] },
                    { sound: drumKit.snare, beats: [2, 9, 14] },
                    { sound: drumKit.hihat, beats: [0,1,2,3,4 ,6,7 ,9,10 ,12,14,15] },
                    { sound: drumKit.hihatO, beats: [5,8,11,13] },
                    { sound: drumKit.crash, beats: [0] },
                ];
                QuarterNotes = "8n";
                TotalBeats = [0,1,2,3,4,5 ,6,7,8,9,10 ,11,12,13,14,15];
                break;

            case "7/4":
                pattern = [
                    { sound: drumKit.kick, beats: [0, 3, 6, 10] },
                    { sound: drumKit.snare, beats: [2, 6, 11, 13] },
                    { sound: drumKit.hihat, beats: [0,1,2,3,4,5,6,7,8,9,10,11,12,13] },
                    { sound: drumKit.crash, beats: [0] },
                ];
                QuarterNotes = "8n";
                TotalBeats = [0,1,2,3,4,5,6,7,8,9,10,11,12,13];
                break;
        }

        // We use Tone.Sequence() over Tone.Loop() as behaves more as Midi sequencer rather than fixed interval time based loop!:
        currentSequence.current = new Tone.Sequence(
            (time: number, step: number) => {
                pattern.forEach(({ sound, beats }) => {
                    if (beats.includes(step)) {
                        sound.start(time);
                    }
                });
            },
            TotalBeats,
            QuarterNotes
        ).start(0);

        //Starts the actual loop:
        Tone.Transport.start();
        console.log("Drum Loop Started!");
    }

    function stopDrumLoop() {
        Tone.Transport.stop();
        Tone.Transport.cancel();
        console.log("Drum Loop Stopped!");

        if (currentSequence.current) {
            currentSequence.current.stop();
            currentSequence.current.dispose();
            currentSequence.current = null;
        }
    }

    // Handle closing the sequencer
    const handleClose = () => {
        // Call the onClose prop if provided
        if (onClose) {
            onClose();
        }
    };

    return(
        <div className="MidiSequencer">

            <div className="sequencer-header">
                <h1>Beat Sequencer</h1>
                {onClose && (
                    <button className="close-button" onClick={handleClose}>
                        ×
                    </button>
                )}
            </div>

            <div className="sequence-controls">
                <div className="control-section">
                    <h3>BPM</h3>
                    <BPMControlSequencer bpm={bpm} setBpm={setBpm}/>
                </div>
                <div className="control-section">
                    <TimeSignatureControlSequencer
                        timeSignature={timeSignature}
                        onTimeSignatureChange={handleTimeSignatureChange}
                    />
                </div>
            </div>

            <button onClick={() => setPlayLoop(prev => !prev)}>
                {playLoop ? "Stop" : "Play"}
            </button>


        </div>
    )
}
export default MidiSequencer;