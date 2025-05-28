import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelesList,
} from "@/constants/options";
import { chatSession } from "@/service/AIModel";
import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";
function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const login = useGoogleLogin({
    onSuccess: (coderesp) => getUserProfile(coderesp),
    onError: (error) => console.log(error),
  });
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");

    if (!user || user === "null" || user === "undefined") {
      setOpenDialog(true);
      return;
    }

    

    // console.log("FormData before validation:", formData);

    if (
      !formData?.location ||
      !formData?.location?.label ||
      !formData?.noOfDays ||
      !formData?.budget ||
      !formData?.traveller
    ) {
      toast("Please fill all details");
      return;
    }
    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",
      formData?.location?.label
    )
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{traveller}", formData?.traveller)
      .replace("{budget}", formData?.budget)
      .replace("{location}", formData?.location.label)
      .replace("{totalDays}", formData?.noOfDays);
    
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    // console.log(result?.response?.text());
    setLoading(false);
    SaveAiTrip(result?.response?.text());
  };
  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const docId = Date.now().toString();
    const user = JSON.parse(localStorage.getItem("user"));
    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user.email,
      id: docId,
    });
    setLoading(false);
    navigate('/view-trip/'+docId)
  };
  const getUserProfile = async (tokenInfo) => {
    if (!tokenInfo?.access_token?.trim()) {
      console.error("No access token received!");
      return;
    }
    const response = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token.trim()}`,
      {
        headers: {
          Authorization: `Bearer ${tokenInfo.access_token.trim()}`,
          Accept: "application/json",
        },
      }
    );
    localStorage.setItem("user", JSON.stringify(response.data));
    console.log("Stored user:", localStorage.getItem("user"));
    setOpenDialog(false);
    OnGenerateTrip();
  };
  useEffect(() => {
    
  }, [formData]);
  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">
        Tell us your travel preferences 🌴🌵
      </h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences.
      </p>
      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl font-medium my-3">
            What is your destination?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => {
                setPlace(v);
                handleInputChange("location", v);
              },
            }}
          />
        </div>

        <div>
          <h2 className="text-xl font-medium my-3">
            how many days are you planning your trip?
          </h2>
          <Input
            placeholder={"ex:3"}
            type="number"
            onChange={(e) => {
              handleInputChange("noOfDays", e.target.value);
            }}
          />
        </div>

        <div>
          <h2 className="text-xl font-medium my-3">What is your budget?</h2>
          <div className="grid grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={(e) => {
                  handleInputChange("budget", item.title);
                }}
                className={` cursor-pointer p-4 border rounded-lg hover: shadow ${
                  formData?.budget == item.title && "shadow-lg border-black"
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-medium my-3">
            Who do you plan on travilling with on your next adventure?
          </h2>
          <div className="grid grid-cols-3 gap-5 mt-5 ">
            {SelectTravelesList.map((item, index) => (
              <div
                key={index}
                onClick={(e) => {
                  handleInputChange("traveller", item.people);
                }}
                className={`cursor-pointer p-4 border rounded-lg hover: shadow ${
                  formData?.traveller == item.people && "shadow-lg border-black"
                }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="my-10 flex justify-end">
        <Button disabled={loading} onClick={OnGenerateTrip}>Generate Trip</Button>
      </div>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <DialogTitle>
                <img src="/logo.svg" />
              </DialogTitle>

              <h2 className="font-bold mt-7 text-lg">sign in with Google</h2>
              <p>sign in to the app with google authentication securely</p>
              <Button disabled={loading}className="w-full mt-5" onClick={login}>
                {" "}
                <FcGoogle />
                Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default CreateTrip;
