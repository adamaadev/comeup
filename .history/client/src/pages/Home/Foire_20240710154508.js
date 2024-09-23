import React from 'react'

export default function Foire() {
    const [modalQuestion, setModalQuestion] = useState(null); // State to manage modal question
    const [selectedResponse, setSelectedResponse] = useState(""); // State for selected response
    const [justification, setJustification] = useState(""); // State for justification
    const [existingQuestions, setExistingQuestions] = useState([]);
  
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
        ]}
        useEffect(() => {
            // Récupérer les questions existantes depuis votre backend lors du chargement initial
            axios.get('http://localhost:4000/getExistingQuestions')
              .then(response => {
                setExistingQuestions(response.data); // Mettre à jour l'état avec les questions existantes récupérées
              })
              .catch(error => {
                console.error('Erreur lors de la récupération des questions existantes :', error);
              });
          }, []);
        
          // Fonction pour vérifier si une question existe déjà
          const isQuestionExisting = (question) => {
            return existingQuestions.includes(question);
          };      
  return (
    <div>Foire</div>
  )
}
