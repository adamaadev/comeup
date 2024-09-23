import React, { useState } from 'react'

export default function Recovery() {
 const [infos , setinfos] = useState({password : '' , newpassword : ''});

 function change(e){
    setinfos({...infos,[e.target.name ]: e.target.value})
 }

 function submit(e){
    e.preventDefault();
    alert(infos.password , infos.newpassword)
 }

  return (
    <div>
        <form onSubmit={submit}>
            <input type="password" name="password" onChange={change}/>
            <input type="password" name="newpassword" onChange={change}/>
            <button type='submit'>soumettre</button>
        </form>
    </div>
  )
}
