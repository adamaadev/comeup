import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Details() {
  const { symbol } = useParams();
  const [exist, setExist] = useState(true);
  const [infos, setInfos] = useState([]);
  const [id, setId] = useState();
  const [force, setForce] = useState("");
  const [risque, setRisque] = useState("");
  const [forces, setForces] = useState([]);
  const [risques, setRisques] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [modalQuestion, setModalQuestion] = useState(null); // State to manage modal question

  // Mocked questions grouped by categories
  const questionsByCategory = {
    produits: [
      "Est ce que les produits sont considérées comme essentiels ou indispensables pour les consommateurs ou clients ?",
      "Est ce que les produits sont achetés de manière régulière ou récurrentes par les consommateurs ou le clients ?",
      "Est-ce que les produits sont adoptés par une base diversifiée de client ?",
      "Est-ce que les produit sont proposés à des prix compétitifs ou bas ?",
      "Est-ce que les produits sont résiliants face aux évolutions du marché ou aux changements technologique ?",
      "Les ventes sont-elles prévisibles et régulières ? (Consommable, abonnement)"
    ],
    positionnement: [
      "Les clients expriment-ils généralement une satisfaction élevé à l’égard des produits ou service de l’entreprise ?",
      "L’entreprise propose t-elle des produits ou services uniques, se démarquant clairement de la concurrence ?",
      "L’entreprise est elle leader dans son marché / industrie ?",
      "L’entreprise fait-elle preuve de résilience face à la concurrence, en maintenant ou en renforçant sa position sur le marché malgré les pressions concurrentielles ?",
      "L’entreprise peut-elle augmenter ses prix facilement, sans répercussion majeure ?",
      "L’entreprise opère t-elle à l’échelle internationale ?"
    ],
    management: [
      "Est-ce que l’entreprise alloue efficacement son capital ? (Disponible sur le rapport de Morningstar).",
      "L’entreprise est-elle facile à gérer",
      "L’entreprise met elle l’accent sur la qualité de ses produits ?",
      "Le management de l’entreprise est-il compétent ?",
      "Le management a t-il un intérêt financier dans l’entreprise ? (Possède t’il des parts, s’agit t’il d’une entreprise familiale, le CEO possède des primes ou des bonus liés au résultats de l’entreprise ?)",
      "Est-ce que l’entreprise privilégie les intérêts de ses actionnaires ? (Généreux programmes de retour aux actions, que ce soit les dividendes ou les rachats d’actions)"
    ],
    autres: [
      "Est ce que l’entreprise présente des perspectives de croissances significatives ?",
      "Est-ce l’entreprise opère dans un secteur en expansion ?"
    ]
  };

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => {
        if (res.data.success) {
          setId(res.data.id);
        }
      });
  }, []);

  useEffect(() => {
    if (symbol && id) {
      axios.post('http://localhost:4000/checkforuser', { symbol, id })
        .then(response => setExist(response.data.exist));
    }
  }, [symbol, id]);

  useEffect(() => {
    axios.get(`https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=7DpR3qkhqfZy2qfQDZZwHrz0Ohd6oRUX`)
      .then(res => {
        setInfos([res.data[0]]) 
        const {companyName , image , symbol , country , mktCap , sector} = res.data[0];
        axios.post('http://localhost:4000/checkcompany',{ companyName , image , symbol , country , mktCap , sector }).then(res=>console.log(res.data))
      });
  }, [symbol]);

  useEffect(() => {
    if (id) {
      axios.post('http://localhost:4000/listanalyse', { symbol, id })
        .then(res => {
          const forcesData = res.data.filter(item => item.type === 'force');
          const risquesData = res.data.filter(item => item.type === 'risque');
          setForces(forcesData);
          setRisques(risquesData);
        });
    }
  }, [symbol, id]);

  const add = (symbol) => {
    axios.post('http://localhost:4000/addforuser', { symbol, id })
      .then(res => {
        if (res.data.success) {
          setExist(true);
        }
      });
  };

  const deleteItem = (symbol) => {
    axios.post('http://localhost:4000/deleteforuser', { symbol, id })
      .then(res => {
        if (res.data.success) {
          setExist(false);
        }
      });
  };

  const sendForce = (e) => {
    e.preventDefault();
    if (force.trim().length > 0) {
      axios.post('http://localhost:4000/sendforce', { symbol, id, force }).then(() => {
        setForce('');
      });
    }
  };

  const sendRisque = (e) => {
    e.preventDefault();
    if (risque.trim().length > 0) {
      axios.post('http://localhost:4000/sendrisque', { symbol, id, risque }).then(() => {
        setRisque('');
      });
    }
  };

  const supprimer = (index) => {
    axios.post('http://localhost:4000/deleteanalyse', { index });
  };

  const handleModalOpen = (question) => {
    setModalQuestion(question);
    // Code to open modal here
  };

  const handleModalClose = () => {
    setModalQuestion(null);
    // Code to close modal here
  };
