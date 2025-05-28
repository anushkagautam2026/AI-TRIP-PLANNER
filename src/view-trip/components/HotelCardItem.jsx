import { GetPlaceDetails, PHOTO_REF_URL } from "@/service/GlobalApi";
import { useState ,useEffect} from "react";
import { Link } from "react-router-dom";

function HotelCardItem({ hotel }) {
    const [photoUrl,setPhotoUrl]=useState();
  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel]);
  const GetPlacePhoto = async () => {
    const data = {
      textQuery: hotel?.hotelName,
    };
    const result = await GetPlaceDetails(data).then((resp) => {
      
      const PhotoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        resp.data.places[0].photos[3].name
      );
      setPhotoUrl(PhotoUrl);
    });
  };
  return (
    <div className="hover:scale-105 transition-all">
      <Link
        to={
          "https://www.google.com/maps/search/?api=1&query=" +
          hotel?.hotelName +
          " " +
          hotel?.hotelAddress
        }
        target="_blank"
      >
        <img src={photoUrl} alt="Hotel Image" className="rounded-xl h-[180px] w-full object-cover" />
        <div className="my-4">
          <h2 className="font-medium">{hotel?.hotelName || "No Name"}</h2>
          <h2 className="text-xs text-gray-500">
            📍{hotel?.hotelAddress || "No Address"}
          </h2>
          <p className="text-sm">💰 {hotel?.price || "Price Unavailable"}</p>
          <p className="text-sm">⭐️ {hotel?.rating || "No Rating"} stars</p>
        </div>
      </Link>
    </div>
  );
}

export default HotelCardItem;
