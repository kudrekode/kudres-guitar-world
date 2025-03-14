import React from 'react';

interface TuningMeterProps {
  cents: number;
  inTune: boolean;
}

const TuningMeter: React.FC<TuningMeterProps> = ({ cents, inTune }) => {
  return (
    <div className="tuning-meter">
      <div className="meter-scale">
        <div className="meter-marker" style={{ left: '0%' }}>-50</div>
        <div className="meter-marker" style={{ left: '25%' }}>-25</div>
        <div className="meter-marker" style={{ left: '50%' }}>0</div>
        <div className="meter-marker" style={{ left: '75%' }}>+25</div>
        <div className="meter-marker" style={{ left: '100%' }}>+50</div>
      </div>
      
      <div className="meter-indicator" 
        style={{ 
          left: `${Math.min(Math.max((cents + 50) / 100 * 100, 0), 100)}%`,
          backgroundColor: inTune ? '#4CAF50' : Math.abs(cents) < 15 ? '#FFC107' : '#F44336'
        }}>
      </div>
    </div>
  );
};

export default TuningMeter; 