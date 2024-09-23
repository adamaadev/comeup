import React, { useState, useRef } from 'react';

export default function Otp() {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [showPopup, setShowPopup] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); 
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <h2>Entrez votre code OTP</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={el => inputRefs.current[index] = el}
              style={{
                width: '40px',
                height: '40px',
                textAlign: 'center',
                fontSize: '20px'
              }}
            />
          ))}
        </div>
        <button type="submit" style={{ marginTop: '20px' }}>Submit</button>
      </form>

      {showPopup && (
        <div style={popupStyle}>
          <div style={popupContentStyle} className="popup-content">
            <h3>Votre OTP</h3>
            <p>{otp.join("")}</p>
            <button onClick={handleClosePopup}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}

const popupStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 1,
  visibility: 'visible',
  transition: 'opacity 0.5s ease-in-out',
};

const popupContentStyle = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
  transform: 'scale(0.7)',
  animation: 'popupAnimation 0.3s forwards'
};

const styles = `
@keyframes popupAnimation {
  from {
    transform: scale(0.7);
  }
  to {
    transform: scale(1);
  }
}
`;

