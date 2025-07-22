import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import InfoSection from "../components/InfoSection";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import Hotels from "../components/Hotels";
import PlacesToVisit from "../components/PlacesToVisit";
import Footer from "../components/Footer";

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  const GetTripData = async () => {
    const docRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const tripData = docSnap.data();
      setTrip(tripData);
      setImages(tripData.images || []); // ✅ load existing images
    } else {
      console.log("No Such Document");
    }
  };

  const handleUpload = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "drgj9mmoh",
        uploadPreset: "trip_photos",
        folder: `trip_photos/${tripId}`,
        multiple: true,
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          const imageUrl = result.info.secure_url;

          // Update Firestore with the new image
          const tripRef = doc(db, "AITrips", tripId);
          await updateDoc(tripRef, {
            images: arrayUnion(imageUrl),
          });

          // Update local state immediately
          setImages((prev) => [...prev, imageUrl]);
        }
      }
    );
    widget.open();
  };

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      <InfoSection
        trip={trip}
        className="h-[340px] w-full object-cover rounded-xl"
      />

      {/* Upload and view gallery buttons */}
      <div className="my-6 flex gap-4">
        <button
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg"
          onClick={handleUpload}
        >
          Upload Photos
        </button>

        <Link to={`/trip/${tripId}/gallery`}>
          <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition">
            View Trip Photos
          </button>
        </Link>
      </div>

      <Hotels trip={trip} />
      <PlacesToVisit trip={trip} />
      <Footer />
    </div>
  );
}

export default ViewTrip;
