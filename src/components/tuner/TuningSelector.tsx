import React from 'react';

// Define all tuning types
export type TuningName = 
  | 'Standard'
  | 'E Flat'
  | 'Drop D'
  | 'DADGAD'
  | 'Open C'
  | 'Rain Song'
  | 'Open A'
  | 'Open G'
  | 'Open E'
  | 'Open D';

// Define tuning frequencies for each tuning type
export const tunings: Record<TuningName, Record<string, number>> = {
  'Standard': {
    'E2': 82.41,
    'A2': 110.00,
    'D3': 146.83,
    'G3': 196.00,
    'B3': 246.94,
    'E4': 329.63,
  },
  'E Flat': {
    'Eb2': 77.78,
    'Ab2': 103.83,
    'Db3': 138.59,
    'Gb3': 185.00,
    'Bb3': 233.08,
    'Eb4': 311.13,
  },
  'Drop D': {
    'D2': 73.42,
    'A2': 110.00,
    'D3': 146.83,
    'G3': 196.00,
    'B3': 246.94,
    'E4': 329.63,
  },
  'DADGAD': {
    'D2': 73.42,
    'A2': 110.00,
    'D3': 146.83,
    'G3': 196.00,
    'A3': 220.00,
    'D4': 293.66,
  },
  'Open C': {
    'C2': 65.41,
    'G2': 98.00,
    'C3': 130.81,
    'G3': 196.00,
    'C4': 261.63,
    'E4': 329.63,
  },
  'Rain Song': {
    'D2': 73.42,
    'G2': 98.00,
    'C3': 130.81,
    'G3': 196.00,
    'C4': 261.63,
    'D4': 293.66,
  },
  'Open A': {
    'E2': 82.41,
    'A2': 110.00,
    'E3': 164.81,
    'A3': 220.00,
    'C#4': 277.18,
    'E4': 329.63,
  },
  'Open G': {
    'D2': 73.42,
    'G2': 98.00,
    'D3': 146.83,
    'G3': 196.00,
    'B3': 246.94,
    'D4': 293.66,
  },
  'Open E': {
    'E2': 82.41,
    'B2': 123.47,
    'E3': 164.81,
    'G#3': 207.65,
    'B3': 246.94,
    'E4': 329.63,
  },
  'Open D': {
    'D2': 73.42,
    'A2': 110.00,
    'D3': 146.83,
    'F#3': 185.00,
    'A3': 220.00,
    'D4': 293.66,
  },
};

// Define tuning descriptions
export const tuningDescriptions: Record<TuningName, string> = {
  'Standard': 'E A D G B E - Standard guitar tuning',
  'E Flat': 'Eb Ab Db Gb Bb Eb - All strings down half step',
  'Drop D': 'D A D G B E - Low E down to D',
  'DADGAD': 'D A D G A D - Popular for Celtic and folk music',
  'Open C': 'C G C G C E - Open C major chord',
  'Rain Song': 'D G C G C D - Used in Led Zeppelin\'s "The Rain Song"',
  'Open A': 'E A E A C# E - Open A major chord',
  'Open G': 'D G D G B D - Open G major chord',
  'Open E': 'E B E G# B E - Open E major chord',
  'Open D': 'D A D F# A D - Open D major chord',
};

interface TuningSelectorProps {
  currentTuning: TuningName;
  showTuningSelector: boolean;
  onTuningChange: (tuning: TuningName) => void;
  onToggleSelector: () => void;
}

const TuningSelector: React.FC<TuningSelectorProps> = ({
  currentTuning,
  showTuningSelector,
  onTuningChange,
  onToggleSelector
}) => {
  return (
    <div className="tuning-selector-container">
      <button 
        className="tuning-selector-button"
        onClick={onToggleSelector}
      >
        {currentTuning} Tuning <span className="dropdown-arrow">{showTuningSelector ? '▲' : '▼'}</span>
      </button>
      
      {showTuningSelector && (
        <div className="tuning-dropdown">
          {Object.keys(tunings).map((tuningName) => (
            <div 
              key={tuningName} 
              className={`tuning-option ${currentTuning === tuningName ? 'active' : ''}`}
              onClick={() => onTuningChange(tuningName as TuningName)}
            >
              <div className="tuning-name">{tuningName}</div>
              <div className="tuning-description">{tuningDescriptions[tuningName as TuningName]}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TuningSelector; 