import React, { useState } from 'react'

export default function ChangePassword() {
 const [infos , setinfos] = useState({password : '' , newpassword : ''});
  return (
    <div>
        <form>
            <input type="password" name="password"/>
            <input type="password" name="newpassword"/>
        </form>
    </div>
  )
}
