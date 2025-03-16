import Tuner from "../components/tuner/PitchyTuner.tsx";
import {useState} from "react";
import Metronome from "../components/metronome/Metronome.tsx";
import "./MainPage.css";

const MainPage:React.FC = () => {

    // useState to open and close the tuner (similarly to a modal)
    const [isTunerOpen, setIsTunerOpen] = useState(false);
    // useState to open and close the metronome
    const [isMetronomeOpen, setIsMetronomeOpen] = useState(false);

    const toggleTuner = () => {
        setIsTunerOpen(!isTunerOpen);
        // Close metronome if tuner is being opened
        if (!isTunerOpen) setIsMetronomeOpen(false);
    }

    const toggleMetronome = () => {
        setIsMetronomeOpen(!isMetronomeOpen);
        // Close tuner if metronome is being opened
        if (!isMetronomeOpen) setIsTunerOpen(false);
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
            </div>

            {isMetronomeOpen && <Metronome onClose={toggleMetronome} />}
            {isTunerOpen && <Tuner onClose={toggleTuner}/>}
        </div>
    )
}
export default MainPage;