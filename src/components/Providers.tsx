import React from 'react'
  import { ToastContainer, toast } from 'react-toastify';

function Providers({children}: {children: React.ReactNode}) {
  return (
    <div>
        <ToastContainer
        position='bottom-right'/>
        {children}
    </div>
    
  )
}

export default Providers