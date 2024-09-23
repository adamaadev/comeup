import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Otp() {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [error, setError] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [countdown, setCountdown] = useState(15); // État pour le compte à rebours
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state;
  const [code, setCode] = useState();

  useEffect(() => {
    if (!email) {
      navigate('/');
    } else {
      axios.post('http://localhost:4000/sendemail', { email }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        setCode(res.data.otp);
      });

      // Déclenche un compte à rebours de 15 secondes
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setShowResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Nettoyage du timer si le composant est démonté avant la fin du délai
      return () => clearInterval(timer);
    }
  }, [email, navigate]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); 
    setOtp(newOtp);
    setError(false);
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    setError(false);
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join(""); 
    if (code === enteredOtp) {
      navigate('/recovery', { state: email });
    } else {
      setError(true);
    }
  };

  const handleResendCode = () => {
    // Code pour renvoyer l'OTP
    axios.post('http://localhost:4000/sendemail', { email }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      setCode(res.data.otp);
      // Réinitialiser le compte à rebours après avoir renvoyé le code
      setCountdown(15);
      setShowResend(false);
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <h2 className="text-center">Entrez le code OTP envoyé à {email}</h2>
          {error && <div className="alert alert-danger text-center">Le code OTP saisi est incorrect. Veuillez réessayer.</div>}
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
            <div className="text-center mt-3">
              {showResend ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResendCode}
                >
                  Renvoyer le code
                </button>
              ) : (
                <span>Renvoyer le code dans {countdown} secondes</span>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
