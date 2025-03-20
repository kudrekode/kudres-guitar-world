import { useState } from "react";

const BPMControlSequencer: React.FC<{ bpm: number; setBpm: (bpm: number) => void }> = ({ bpm, setBpm }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(String(bpm));

    // Handle slider change
    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newBpm = Number(e.target.value);
        setBpm(newBpm);
        setInputValue(String(newBpm));
    };

    // Handle clicking the BPM number to enter manual mode
    const handleBpmClick = () => {
        setIsEditing(true);
    };

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    // When user presses Enter or clicks away, update the BPM
    const handleInputBlur = () => {
        const newBpm = Number(inputValue);
        if (!isNaN(newBpm) && newBpm >= 30 && newBpm <= 200) {
            setBpm(newBpm);
        } else {
            setInputValue(String(bpm)); // Reset to previous BPM if invalid
        }
        setIsEditing(false);
    };

    return (
        <div className="bpm-control">
            <label>BPM:</label>
            <div className="bpm-display">
                {isEditing ? (
                    <input
                        type="number"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={(e) => e.key === "Enter" && handleInputBlur()}
                        autoFocus
                        className="bpm-input"
                        min="30"
                        max="200"
                    />
                ) : (
                    <span className="bpm-value" onClick={handleBpmClick}>
                        {bpm}
                    </span>
                )}
            </div>

            <input
                type="range"
                min="30"
                max="200"
                value={bpm}
                onChange={handleSliderChange}
                className="bpm-slider"
            />
        </div>
    );
};

export default BPMControlSequencer;
