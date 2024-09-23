import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Otp() {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [showPopup, setShowPopup] = useState(false);
  const [timer, setTimer] = useState(15);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state;

  const generateOtp = () => {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10).toString()).join('');
  };

  const otpGenerated = useRef(generateOtp());

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
    navigate('/recovery', { state: { email } });
  };

  const startTimer = () => {
    setTimer(15);
    setIsResendDisabled(true);
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(countdown);
          setIsResendDisabled(false);
        }
        return prevTimer - 1;
      });
    }, 1000);
  };


  useEffect(() => {
    if (!email) {
      return navigate('/');
    }
    axios.post('http://localhost:4000/send-otp', { email})
  .then(res => {
    console.log('Response:', res.data);
  })
  .catch(error => {
    console.error('There was an error!', error);
  });

  }, [email, navigate]);

  const handleResendOtp = () => {
    otpGenerated.current = generateOtp();
  };

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
              ref={(el) => (inputRefs.current[index] = el)}
              style={{
                width: '40px',
                height: '40px',
                textAlign: 'center',
                fontSize: '20px',
              }}
            />
          ))}
        </div>
        <button type="submit" style={{ marginTop: '20px' }}>Submit</button>
      </form>

      <button
        onClick={handleResendOtp}
        disabled={isResendDisabled}
        style={{ marginTop: '20px' }}
      >
        {isResendDisabled ? `Resend OTP in ${timer}s` : 'Resend OTP'}
      </button>

      {showPopup && (
        <div className="popup-overlay" key="popup">
          <div className="popup-content">
            <h3>Votre OTP</h3>
            <p>{otp.join('')}</p>
            <button onClick={handleClosePopup}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
