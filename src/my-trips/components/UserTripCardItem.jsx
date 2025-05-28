import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function UserTripCardItem(trip) {
    const [photoUrl,setPhotoUrl]=useState();
      useEffect(() => {
        trip && GetPlacePhoto();
      }, [trip]);
      const GetPlacePhoto = async () => {
              const data = { textQuery: trip?.trip?.userSelection?.location?.label };
            
              try {
                const resp = await GetPlaceDetails(data);
            
                if (!resp?.data?.places || resp.data.places.length === 0) {
                  console.error("No places found in the API response.");
                  return;
                }
            
                // Find the first place object that contains a photos array with at least one photo
                const placeWithPhotos = resp.data.places.find(p => p.photos && p.photos.length > 0);
            
                if (!placeWithPhotos) {
                  console.warn("No photos available, using default image.");
                  setPhotoUrl("/ap.jpeg"); // Provide a fallback image
                  return;
                }
            
                // Select a valid photo (use 4th if available, otherwise take the last available)
                const photoIndex = Math.min(3, placeWithPhotos.photos.length - 1);
                const PhotoUrl = PHOTO_REF_URL.replace("{NAME}", placeWithPhotos.photos[photoIndex].name);
                
                setPhotoUrl(PhotoUrl);
              } catch (error) {
                console.error("Error fetching place details:", error);
                setPhotoUrl("/ap.jpeg"); // Use fallback image in case of API failure
              }
            };
  return (
    <Link to={'/view-trip/'+trip?.trip?.id}>
    <div className='hover:scale-105 transition-all'>
        
        <img src={photoUrl} className='object-cover rounded-xl'/>
        <div>
            <h2 className='font-bold text-lg'>{trip?.trip?.userSelection?.location?.label}</h2>
            <h2 className='text-sm text-gray-500'>{trip?.trip?.userSelection?.noOfDays} days trip with {trip?.trip?.userSelection?.budget} budget</h2>
        </div>
    </div>
    </Link>
  )
}

export default UserTripCardItem