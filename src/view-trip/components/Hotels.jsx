// import React from "react";
// import { Link } from "react-router-dom";

// function Hotels({ trip }) {
//   return (
//     <div>
//       <h2 className="font-bold text-xl mt-5">Hotel Recommendation</h2>
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//         {trip?.tripData?.hotelOptions?.map((hotel, index) => (
//           <div key={index} className="hover:scale-105 transition-all">
//             <Link to={'https://www.google.com/maps/search/?api=1&query='+hotel?.hotelName+" "+hotel?.hotelAddress} target='_blank'>
//             <img src="/ap.jpeg" alt="Hotel Image" className="rounded-xl" />
//             <div className="my-4">
//               <h2 className="font-medium">{hotel.hotelName}</h2>
//               <h2 className="text-xs text-gray-500">📍{hotel.hotelAddress}</h2>
//               <p className="text-sm">{hotel.price}</p>
//               <p className="text-sm">⭐️{hotel.rating} stars</p>
//             </div>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Hotels;
import React from "react";
import HotelCardItem from "./HotelCardItem";

function Hotels({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-xl mt-5">Hotel Recommendation</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {trip?.tripData?.hotelOptions?.map((hotel, index) => (
          <HotelCardItem key={index} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}

export default Hotels;
