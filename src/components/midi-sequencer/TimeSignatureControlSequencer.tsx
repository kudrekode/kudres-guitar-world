import React from 'react';

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
    { beats: 6, value: 8, name: '6/8' },
    { beats: 9, value: 8, name: '9/8' },
    { beats: 5, value: 4, name: '5/4' },
    { beats: 7, value: 4, name: '7/4' },
];

interface TimeSignatureControlProps {
    timeSignature: TimeSignature;
    onTimeSignatureChange: (newTimeSignature: TimeSignature) => void;
}

const TimeSignatureControlSequencer: React.FC<TimeSignatureControlProps> = ({
                                                                                timeSignature,
                                                                                onTimeSignatureChange,
                                                                            }) => {
    // Handle selection of a predefined time signature
    const handleSelectTimeSignature = (ts: TimeSignature) => {
        onTimeSignatureChange(ts);
    };

    return (
        <div className="time-signature-control">
            <h3>Time Signature</h3>

            <div className="time-signature-display">
                <span className="current-time-signature">{timeSignature.name}</span>
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
            </div>
        </div>
    );
};

export default TimeSignatureControlSequencer;
