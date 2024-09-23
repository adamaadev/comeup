import React, { useState, useEffect } from 'react';

export default function Otp() {
  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [showPopup, setShowPopup] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false); // état pour gérer la disponibilité du bouton

  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonEnabled(true); // activer le bouton après 15 secondes
    }, 15000); // 15000 ms = 15 secondes

    return () => clearTimeout(timer); // nettoyage du timer lorsque le composant est démonté
  }, []);

  const handleButtonClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    // Ajoutez ici votre logique de redirection ou autre action après fermeture de la popup
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-10">
          <h2 className="text-center">Entrez le code OTP</h2>
          <form>
            <div className="d-flex justify-content-center gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="form-control text-center"
                  style={{ width: '40px', height: '40px', fontSize: '20px' }}
                />
              ))}
            </div>
          </form>
          
          {/* Bouton avec gestion de l'état d'activation */}
          <button
            type="button"
            className="btn btn-primary mt-3 d-block mx-auto"
            onClick={handleButtonClick}
            disabled={!buttonEnabled} // désactivé tant que le bouton n'est pas activé
          >
            Valider
          </button>

        </div>
      </div>
    </div>
  );
}
