import axios from "axios";
import { useEffect } from "react";

export default function Dashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/users')
      .then(res => setUsers(res.data));
  }, []);

  return (
    <div>
        {users.map((user , index)=>(
            <li key={index}>{user.username}</li>
        ))}
    </div>
  )
}
