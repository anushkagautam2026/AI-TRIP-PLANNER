import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";

const TripGallery = () => {
  const { tripId } = useParams();
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const docRef = doc(db, "AITrips", tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setImages(data.images || []);
      }
    };

    fetchImages();
  }, [tripId]);

  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;

      // Extract file name from Cloudinary URL if you like
      const filename = url.split("/").pop().split("?")[0]; // remove query if present
      link.download = filename || "trip-photo.jpg";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl); // Clean up
    } catch (error) {
      console.error("Image download failed:", error);
    }
  };

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      <h1 className="text-2xl font-bold mb-6">Trip Photo Gallery</h1>
      {images.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden shadow-lg"
            >
              <img
                src={img}
                alt={`Trip Image ${index + 1}`}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => downloadImage(img)}
                className="absolute bottom-2 right-2 bg-teal-600 text-white px-3 py-1 text-sm rounded hover:bg-teal-700"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No images available for this trip.</p>
      )}
    </div>
  );
};

export default TripGallery;
