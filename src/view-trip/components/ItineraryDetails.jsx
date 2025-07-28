import React from "react";

function ItineraryDetails({ trip }) {
  if (!trip || !trip.itinerary) {
    return <p className="text-gray-500">No itinerary details available.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-orange-600">Itinerary</h2>
      {trip.itinerary.map((day, index) => (
        <div key={index} className="p-4 bg-gray-100 rounded-md shadow-sm">
          <h3 className="font-bold text-teal-700">Day {index + 1}</h3>
          <p className="mt-1 text-gray-700">{day}</p>
        </div>
      ))}
    </div>
  );
}

export default ItineraryDetails;
