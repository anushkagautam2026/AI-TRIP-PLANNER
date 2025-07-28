import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import InfoSection from "../components/InfoSection";
import Hotels from "../components/Hotels";
import PlacesToVisit from "../components/PlacesToVisit";
import Footer from "../components/Footer";
import SplitwiseTab from "../components/SplitwiseTab"; // New
import clsx from "clsx"; // Optional: for conditional classNames

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState("info"); // 'info' or 'splitwise'

  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);

  const GetTripData = async () => {
    const docRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const tripData = docSnap.data();
      setTrip(tripData);
      setImages(tripData.images || []);
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

          const tripRef = doc(db, "AITrips", tripId);
          await updateDoc(tripRef, {
            images: arrayUnion(imageUrl),
          });

          setImages((prev) => [...prev, imageUrl]);
        }
      }
    );
    widget.open();
  };

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      <InfoSection trip={trip} />

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

      {/* Tabs */}
      <div className="flex gap-6 mb-6">
        <button
          onClick={() => setActiveTab("info")}
          className={clsx(
            "px-4 py-2 rounded-lg font-semibold",
            activeTab === "info"
              ? "bg-gray-800 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          )}
        >
          Trip Info
        </button>
        <button
          onClick={() => setActiveTab("splitwise")}
          className={clsx(
            "px-4 py-2 rounded-lg font-semibold",
            activeTab === "splitwise"
              ? "bg-gray-800 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          )}
        >
          Splitwise
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "info" && (
        <>
          <Hotels trip={trip} />
          <PlacesToVisit trip={trip} />
        </>
      )}

      {activeTab === "splitwise" && <SplitwiseTab trip={trip} tripId={tripId} />}

      <Footer />
    </div>
  );
}

export default ViewTrip;
