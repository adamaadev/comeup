import React, { useState, useRef } from 'react';

export default function Otp() {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); 
    
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div>
      <h2>Entrez votre code OTP</h2>
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
    </div>
  );
}
