import React from 'react';

interface StringButtonsProps {
  tuning: Record<string, number>;
  currentNote: string | null;
  onNoteSelect: (note: string, frequency: number) => void;
  tuningName: string;
}

const StringButtons: React.FC<StringButtonsProps> = ({ 
  tuning, 
  currentNote, 
  onNoteSelect,
  tuningName
}) => {
  return (
    <div className="tuning-reference">
      <h3>{tuningName} Tuning</h3>
      <div className="string-buttons">
        {Object.entries(tuning).map(([noteName, frequency]) => (
          <button 
            key={noteName}
            className={`string-button ${currentNote === noteName ? 'active' : ''}`}
            onClick={() => onNoteSelect(noteName, frequency)}
          >
            {noteName}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StringButtons; 