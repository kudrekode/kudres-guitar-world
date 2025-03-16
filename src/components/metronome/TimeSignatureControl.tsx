import React, { useState } from 'react';

// Props/types for interfacing the UI:
export interface TimeSignature {
  beats: number;  
  value: number;  
  name: string;  
}

// Default list of more known time signatures:
export const commonTimeSignatures: TimeSignature[] = [
  { beats: 4, value: 4, name: '4/4' },
  { beats: 3, value: 4, name: '3/4' },
  { beats: 2, value: 4, name: '2/4' },
  { beats: 6, value: 8, name: '6/8' },
  { beats: 9, value: 8, name: '9/8' },
  { beats: 12, value: 8, name: '12/8' },
  { beats: 5, value: 4, name: '5/4' },
  { beats: 7, value: 4, name: '7/4' },
];

interface TimeSignatureControlProps {
  timeSignature: TimeSignature;
  onTimeSignatureChange: (newTimeSignature: TimeSignature) => void;
}

const TimeSignatureControl: React.FC<TimeSignatureControlProps> = ({
  timeSignature,
  onTimeSignatureChange
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customBeats, setCustomBeats] = useState(timeSignature.beats.toString());
  const [customValue, setCustomValue] = useState(timeSignature.value.toString());

  // Handle selection of a predefined time signature
  const handleSelectTimeSignature = (ts: TimeSignature) => {
    onTimeSignatureChange(ts);
    setShowCustom(false);
  };

  // Handle custom time signature input
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const beats = parseInt(customBeats, 10);
    const value = parseInt(customValue, 10);
    
    // Validate inputs
    if (isNaN(beats) || isNaN(value) || beats < 1 || beats > 32 || ![2, 4, 8, 16].includes(value)) {
      alert('Please enter valid values. Beats should be 1-32 and value should be 2, 4, 8, or 16.');
      return;
    }
    
    onTimeSignatureChange({
      beats,
      value,
      name: `${beats}/${value}`
    });
  };

  return (
    <div className="time-signature-control">
      <h3>Time Signature</h3>
      
      <div className="time-signature-display">
        <span className="current-time-signature" onClick={() => setShowCustom(!showCustom)}>
          {timeSignature.name}
        </span>
      </div>
      
      <div className="time-signature-options">
        {commonTimeSignatures.map((ts) => (
          <button
            key={ts.name}
            className={`time-signature-button ${timeSignature.name === ts.name ? 'active' : ''}`}
            onClick={() => handleSelectTimeSignature(ts)}
          >
            {ts.name}
          </button>
        ))}
        
        <button
          className={`time-signature-button ${showCustom ? 'active' : ''}`}
          onClick={() => setShowCustom(!showCustom)}
        >
          Custom
        </button>
      </div>
      
      {showCustom && (
        <form className="custom-time-signature" onSubmit={handleCustomSubmit}>
          <div className="custom-inputs">
            <input
              type="number"
              value={customBeats}
              onChange={(e) => setCustomBeats(e.target.value)}
              min="1"
              max="32"
              className="beats-input"
            />
            <span className="time-signature-divider">/</span>
            <select
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              className="value-select"
            >
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="8">8</option>
              <option value="16">16</option>
            </select>
          </div>
          <button type="submit" className="apply-button">Apply</button>
        </form>
      )}
    </div>
  );
};

export default TimeSignatureControl;
