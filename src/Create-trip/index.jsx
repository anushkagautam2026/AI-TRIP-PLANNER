import React, { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

function CreateTrip() {
  const inputRef = useRef(null);
  const [destination, setDestination] = useState("");

  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyBcrtrdD1CBsW8iCK6xL-IoDWoJnYd-Wq4",  // Replace with your API key
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      if (inputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(inputRef.current);
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          setDestination(place.formatted_address || "");
        });
      }
    });
  }, []);

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">Tell us your travel preferences</h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className="mt-20">
        <h2 className="text-xl font-medium my-3">What is your destination?</h2>
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter your destination"
          className="border border-gray-300 px-4 py-2 rounded w-full"
        />
        {destination && <p className="mt-2 text-gray-600">Selected: {destination}</p>}
      </div>
    </div>
  );
}

export default CreateTrip;
