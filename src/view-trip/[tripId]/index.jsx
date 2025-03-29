import React from 'react'
import { useParams } from 'react-router-dom'

function ViewTrip() {
  const {tripId}=useParams()
  return (
    <div>ViewTrip:{tripId}
    
    </div>
  )
}

export default ViewTrip