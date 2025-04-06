import React, { useState } from 'react'

function Dashboard() {
    const [getorderLength, setOrderLenth] = useState("")
    const orders = localStorage.getItem("orderLength")
    setOrderLenth(orders)
    
  return (
    <div>
        <div>
            Total orders : {orders}
        </div>
    </div>
  )
}

export default Dashboard