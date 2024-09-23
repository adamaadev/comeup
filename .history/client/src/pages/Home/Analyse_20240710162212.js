import React from 'react'

export default function Analyse() {
    const { symbol } = useParams();
    const [exist, setExist] = useState(true);
    const [infos, setInfos] = useState([]);
    const [id, setId] = useState();
    const [force, setForce] = useState("");
    const [risque, setRisque] = useState("");
    const [forces, setForces] = useState([]);
    const [risques, setRisques] = useState([]);
    const [activeTab, setActiveTab] = useState('news');
  return (
    <div>Analyse</div>
  )
}
