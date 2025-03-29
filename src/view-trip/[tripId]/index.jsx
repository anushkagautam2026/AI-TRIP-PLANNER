import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InfoSection from '../components/infoSection';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';

function ViewTrip() {
  const {tripId}=useParams();
  const [trip,setTrip]=useState([]);
  useEffect(()=>{tripId&&GetTripData();},[tripId])
  const GetTripData=async()=>{
    const docRef=doc(db, 'AITrips', tripId);
    const docSnap=await getDoc (docRef);
    if(docSnap.exists()) {
    console.log("Dodcument:", docSnap.data());
    setTrip(docSnap.data());
    }
    else{
    console.log("No Such Document");
    toast( 'No trip Found!')
    }
  }
  return (
    <div className=''>
      <InfoSection trip={trip}/>
    
    </div>
  )
}

export default ViewTrip