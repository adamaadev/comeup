import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation} from 'react-router-dom';

export default function Otp() {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [showPopup, setShowPopup] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state;

  const generateOtp = () => {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10).toString()).join('');
  };

  const otpGenerated = useRef(generateOtp());

  console.log( otpGenerated);
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
    navigate('/recovery' ,{state : email})
  };

  useEffect(()=>{
    if (!email) {
      return navigate('/');
    }

    const sendOtp = async () => {
      try {
        const response = await fetch('/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, otp: otpGenerated.current }),
        });
        if (!response.ok) {
          throw new Error('Failed to send OTP');
        }
      } catch (error) {
        console.error('Error sending OTP:', error);
      }
    };

    sendOtp();
  }, [email, navigate]);

  return (
    <div>
      <h2>Entrez le code OTP envoyé à {email}</h2>
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
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Votre OTP</h3>
            <p>{otp.join("")}</p>
            <button onClick={handleClosePopup}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
