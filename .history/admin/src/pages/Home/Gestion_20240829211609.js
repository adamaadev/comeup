import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function Gestion() {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/users').then(res => {
      setEmails(res.data);
    }).catch(err => {
      console.error("Erreur lors de la récupération des emails :", err);
    });
  }, []);

  const downloadExcel = () => {
    // Créez une nouvelle feuille de calcul
    const worksheet = XLSX.utils.json_to_sheet(emails.map(email => ({ Email: email })));
    
    // Créez un nouveau classeur
    const workbook = XLSX.utils.book_new();
    
    // Ajoutez la feuille de calcul au classeur
    XLSX.utils.book_append_sheet(workbook, worksheet, "Emails");
    
    // Générez un fichier Excel
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // Enregistrez le fichier
    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'emails.xlsx');
  };

  return (
    <div>
      <h2>Liste des emails</h2>
      <ul>
        {emails.map((email, index) => (
          <li key={index}>{email}</li>
        ))}
      </ul>
      <button onClick={downloadExcel}>Télécharger en format Excel</button>
    </div>
  );
}
