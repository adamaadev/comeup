import React, { useState } from 'react'

export default function Recovery() {
 const [infos , setinfos] = useState({password : '' , newpassword : ''});
 function change(){

 }
 function submit(e){
    e.preventDefault();
 }
  return (
    <div>
        <form onSubmit={submit}>
            <input type="password" name="password" onChange={change}/>
            <input type="password" name="newpassword" onChange={change}/>
        </form>
    </div>
  )
}
