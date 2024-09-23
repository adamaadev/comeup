import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Otp() {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [showSuccess, setShowSuccess] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(15);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state;
  
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
    setShowSuccess(true);

    // Start countdown timer
    const countdown = setInterval(() => {
      setTimerSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);

    // After 15 seconds, navigate back to recovery
    setTimeout(() => {
      clearInterval(countdown);
      navigate('/recovery', { state: email });
    }, 15000);
  };

  useEffect(() => {
    if (!email) {
      navigate('/');
    } else {
      axios.post('http://localhost:4000/sendemail', { email }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <h2 className="text-center">Entrez le code OTP envoyé à {email}</h2>
          <form onSubmit={handleSubmit}>
            <div className="d-flex justify-content-center gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="form-control text-center"
                  style={{ width: '40px', height: '40px', fontSize: '20px' }}
                />
              ))}
            </div>
            <button type="submit" className="btn btn-primary mt-3 d-block mx-auto">Valider</button>
          </form>

          {showSuccess && (
            <div className="alert alert-success mt-3 text-center">
              Votre OTP a été validé avec succès. Cette fenêtre se fermera automatiquement dans {timerSeconds} secondes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
