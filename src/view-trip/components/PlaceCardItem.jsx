import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaMapLocationDot } from "react-icons/fa6";
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";

function PlaceCardItem({ place, bestTimeToVisit }) {
    const [photoUrl,setPhotoUrl]=useState();
      useEffect(() => {
        place && GetPlacePhoto();
      }, [place]);
      const GetPlacePhoto = async () => {
        const data = { textQuery: place?.placeName };
      
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
      
      // const GetPlacePhoto = async () => {
      //   const data = {
      //     textQuery: place?.placeName,
      //   };
      //   const result = await GetPlaceDetails(data).then((resp) => {
          
      //     const PhotoUrl = PHOTO_REF_URL.replace(
      //       "{NAME}",
      //       resp.data.places[0].photos[3].
      //       displayName
      //     );
      //     console.log(resp.data.places);
      //     setPhotoUrl(PhotoUrl);
      //   });
      // };
  return (
    <Link to={"https://www.google.com/maps/search/?api=1&query=" + place?.placeName} target="_blank">
      <div className="border p-4 rounded shadow-md hover:scale-105 transition-all hover:shadow-md cursor-pointer">
        <img src={photoUrl} alt={place.placeName} className="w-full h-40 object-cover rounded" />
        
        <h3 className="font-bold mt-2">Best Time to Visit:</h3>
        <p>{bestTimeToVisit || "No information available"}</p>
        
        <h3 className="font-bold mt-2">{place?.placeName || "Unknown Place"}</h3>
        
        <p className="text-sm text-gray-500">{place?.placeDetails || "No details available"}</p>
        
        <p><strong>Travel Time🕚</strong></p>
        <p>{place?.travelTimeFromHotel || place?.travelTimeFromPrevious || "N/A"}</p>
        
        <p><strong>Ticket Pricing🎟</strong></p>
        <p>{place?.ticketPricing || "Free"}</p>
        
        <Button><FaMapLocationDot /></Button>
      </div>
    </Link>
  );
}

export default PlaceCardItem;
