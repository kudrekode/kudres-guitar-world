
import Tuner from "../components/tuner/PitchyTuner.tsx";
import {useState} from "react";

const MainPage:React.FC = () => {

    // useState to open and close the tuner (similarly to a modal)
    const [isTunerOpen, setIsTunerOpen] = useState(false);

    const toggleTuner = () => {
        setIsTunerOpen(!isTunerOpen);
    }

    return (
        <div className="MainPage">
        <h1>Kudre's Guitar World</h1>

        <button onClick={toggleTuner}>Open Tuner</button>
        <div className="other-content">
            <p>This is some other content</p>
        </div>

        {isTunerOpen && <Tuner onClose={toggleTuner} />}

        </div>
    )
}
export default MainPage;