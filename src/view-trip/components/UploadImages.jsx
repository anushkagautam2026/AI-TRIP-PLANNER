import { useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const UploadImages = () => {
  const { tripId } = useParams();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // replace with your preset

    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const url = data.secure_url;

      // Save to localStorage by tripId
      const key = `trip-${tripId}-images`;
      const prevImages = JSON.parse(localStorage.getItem(key)) || [];
      localStorage.setItem(key, JSON.stringify([...prevImages, url]));
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="font-semibold mb-2">Upload Images</h2>
      <input type="file" onChange={handleUpload} disabled={uploading} />
    </div>
  );
};

export default UploadImages;
