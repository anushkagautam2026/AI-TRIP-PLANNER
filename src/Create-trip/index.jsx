import React from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
function CreateTrip() {
  return (
  <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
    <h2 className='font-bold text-3xl'>Tell us your travel preferences</h2>
    <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information, and our trip planner will generate a
    customized itinerary based on your preferences.</p>
    <div>
      <div className='mt-20'>
      <h2 className='text-xl font-medium my-3'>What is your destination?</h2>
      {console.log(import.meta.env.VITE_GOOGLE_PLACE_API_KEY)}
      <GooglePlacesAutocomplete apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}/>
      </div>
    </div>
  </div>
  
  )
}
export default CreateTrip