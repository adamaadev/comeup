import React from 'react'

export default function Try() {

    const handleLogout = () => {
        axios.post('http://localhost:4000/logout', { type })
          .then(res => {
            if (res.data.success) {
              window.location.reload(true);
            }
          });
      };
  return (
    <div>
        Try
        <button></button>
    </div>
  )
}
