import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function Otp() {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [error, setError] = useState(false);
  const [showResend, setShowResend] = useState(false); // État pour contrôler la visibilité du bouton
  const [countdown, setCountdown] = useState(15); // État pour le compte à rebours
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state;
  const [code, setCode] = useState();
  const timerRef = useRef(null); // Référence au timer

  useEffect(() => {
    if (!email) {
      navigate('/');
    } else {
      axios.post('http://localhost:4000/sendemail', { email }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        console.log(res);
        setCode(res.data.otp);
      });

      // Récupérer le temps restant du localStorage
      const savedCountdown = localStorage.getItem('countdown');
      if (savedCountdown) {
        setCountdown(parseInt(savedCountdown, 10));
        setShowResend(countdown === 0);
      } else {
        // Démarrer le compte à rebours
        startCountdown(15);
      }

      // Nettoyer le timer si le composant est démonté avant la fin du délai
      return () => clearInterval(timerRef.current);
    }
  }, [email, navigate]);

  const startCountdown = (initialTime) => {
    setCountdown(initialTime);
    setShowResend(false); // Masquer le bouton de renvoi au démarrage
    localStorage.setItem('countdown', initialTime); // Stocker le temps initial
    if (timerRef.current) clearInterval(timerRef.current); // Nettoyer le timer précédent
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        const newTime = prev - 1;
        localStorage.setItem('countdown', newTime); // Mettre à jour le temps restant
        if (newTime === 0) {
          clearInterval(timerRef.current);
          setShowResend(true); // Afficher le bouton de renvoi quand le compte à rebours se termine
        }
        return newTime;
      });
    }, 1000);
  };

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
    // Réinitialiser le temps dans le localStorage
    localStorage.removeItem('countdown');
    startCountdown(15);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        {code}
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
