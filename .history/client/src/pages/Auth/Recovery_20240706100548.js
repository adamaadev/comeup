import React, { useState } from 'react'

export default function Recovery() {
 const [infos , setinfos] = useState({password : '' , newpassword : ''});
 function change(){
  
 }
  return (
    <div>
        <form>
            <input type="password" name="password" onChange={change}/>
            <input type="password" name="newpassword" onChange={change}/>
        </form>
    </div>
  )
}
