import { Button } from "@/components/ui/button";
import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";
import React, { useEffect, useState } from "react";
import {IoIosSend} from "react-icons/io";
import axios from "axios";
function InfoSection({ trip }) {
  const [photoUrl,setPhotoUrl]=useState();
  useEffect(() => {
    console.log("Updated Photo URL:", photoUrl);
  }, [photoUrl]);
  useEffect(() => {
   
    if (trip?.userSelection?.location?.label) {
      GetPlacePhoto();
    } else {
      console.warn("Location label is missing.");
    }
  }, [trip]);
  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.label,
    };
  
    
  
    try {
      const response = await GetPlaceDetails(data);
      
  
      if (response?.data?.places?.length > 0) {
        const photosArray = response.data.places[0].photos;
        console.log(photosArray);
        if (photosArray?.length > 0) {
          const photoUrl = PHOTO_REF_URL.replace("{NAME}", photosArray[0].name);
          setPhotoUrl(photoUrl);
        } else {
          console.warn("No photos found for the location.");
        }
      } else {
        console.warn("No places found in response.");
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };
  
  return (
    <div>
      <img src={photoUrl} className='h-[340px] w-full object-cover rounded-xl'/>
      <div className="my-5 flex flex-col gap-2">
        <h2 className="font-bold text-2xl">
          {trip?.userSelection?.location?.label}
        </h2>
        <div className="flex justify-between items-center">
          <div className="hidden sm:flex gap-5">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              📅{trip?.userSelection?.noOfDays} days
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              💰{trip?.userSelection?.budget} budget
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              🥂no. of travellers:{trip?.userSelection?.traveller}{" "}
            </h2>
          </div>
          <Button><IoIosSend/></Button>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
