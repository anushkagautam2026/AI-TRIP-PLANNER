import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InfoSection from '../components/InfoSection';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConfig';
import Hotels from '../components/Hotels';
import PlacesToVisit from '../components/PlacesToVisit';
import Footer from '../components/Footer';

function ViewTrip() {
  const {tripId}=useParams();
  const [trip,setTrip]=useState([]);
  useEffect(()=>{tripId&&GetTripData();},[tripId])
  const GetTripData=async()=>{
    const docRef=doc(db, 'AITrips', tripId);
    const docSnap=await getDoc (docRef);
    if(docSnap.exists()) {
    
    setTrip(docSnap.data());
    }
    else{
    console.log("No Such Document");
    toast( 'No trip Found!')
    }
  }
  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      <InfoSection trip={trip} className="h-[340px] w-full object-cover rounded-xl"/>
      <Hotels trip={trip}/>
      <PlacesToVisit trip={trip}/>
      <Footer/>
    </div>
  )
}

export default ViewTrip