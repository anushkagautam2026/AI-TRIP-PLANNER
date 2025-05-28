
// import { Button } from "@/components/ui/button";
// import React from "react";
// import {FaMapLocationDot} from "react-icons/fa6"
// import { Link } from "react-router-dom";
// function PlacesToVisit({ trip }) {
//     if (!trip?.tripData?.itinerary) {
//         return <p className="text-center text-red-500 font-bold">No itinerary available</p>;
//       }
//   return (
//     <div>
//       <h2 className="font-bold text-lg">Places to Visit</h2>
//       <div>
//         {Object.entries(trip.tripData.itinerary).sort(([dayA], [dayB]) => Number(dayA.replace("day", "")) - Number(dayB.replace("day", ""))).
//         map(([day, details]) => (
//           <div key={day} >
//             <h2 className="font-medium text-lg">{day}</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2  gap-4 mt-3">
//               {details.places.map((place, index) => (
//                 <Link to={'https://www.google.com/maps/search/?api=1&query='+place?.placeName} target="_blank">
//                 <div key={index} className="border p-4 rounded shadow-md hover:scale-105 transition-all hover:shadow-md cursor-pointer">
                    
//                   <img
//                     src={'/ap.jpeg'}
//                     alt={place.placeName}
//                     className="w-full h-40 object-cover rounded"
//                   />
//                   <h3 className="font-bold mt-2">Best Time to Visit: </h3>{details.bestTimeToVisit}
//                   <h3 className="font-bold mt-2">{place.placeName}</h3>
//                   <p className="text-sm text-gray-500"> {place.placeDetails || "No details available"}</p>
//                   <p><strong>Travel Time🕚</strong></p>
//                   <p > {place.travelTimeFromHotel || place.travelTimeFromPrevious || "N/A"}</p>
//                   <p><strong>Ticket Pricing🎟</strong></p>
//                   <p> {place.ticketPricing || "Free"}</p>
//                   <Button><FaMapLocationDot/></Button>
//                 </div>
//                 </Link>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default PlacesToVisit;
import React from "react";
import PlaceCardItem from "./PlaceCardItem";

function PlacesToVisit({ trip }) {
  if (!trip?.tripData?.itinerary) {
    return <p className="text-center text-red-500 font-bold">No itinerary available</p>;
  }

  return (
    <div>
      <h2 className="font-bold text-lg">Places to Visit</h2>
      <div>
        {Object.entries(trip.tripData.itinerary)
          .sort(([dayA], [dayB]) => Number(dayA.replace("day", "")) - Number(dayB.replace("day", "")))
          .map(([day, details]) => (
            <div key={day}>
              <h2 className="font-medium text-lg">{day}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {details.places.map((place, index) => (
                  <PlaceCardItem key={index} place={place} bestTimeToVisit={details.bestTimeToVisit} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;
