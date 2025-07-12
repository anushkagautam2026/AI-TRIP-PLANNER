import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [openDialog, setOpenDialog] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (coderesp) => getUserProfile(coderesp),
    onError: (error) => console.log(error),
  });
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

    setOpenDialog(false);
    window.location.reload();
  };

  return (
    <div className="p-3 shadow-sm flex justify-between items-center">
      <svg
        width="180"
        height="100"
        viewBox="0 0 400 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="400" height="100" rx="20" ry="20" fill="black" />

        <path
          d="M60 20C45 20 33 32 33 47C33 65 60 90 60 90C60 90 87 65 87 47C87 32 75 20 60 20Z"
          fill="#00BFA6"
        />
        <circle cx="60" cy="47" r="9" fill="white" />

        <path d="M130 25L160 50L130 45L120 70L115 40L130 25Z" fill="#FFA726" />

        <circle cx="105" cy="50" r="5" fill="#4FC3F7" />
        <line
          x1="105"
          y1="50"
          x2="130"
          y2="45"
          stroke="#4FC3F7"
          stroke-width="2"
        />

        <text
          x="180"
          y="55"
          font-family="Poppins, sans-serif"
          font-size="32"
          font-weight="600"
          fill="#FFFFFF"
        >
          Trip
        </text>
        <text
          x="255"
          y="55"
          font-family="Poppins, sans-serif"
          font-size="32"
          font-weight="600"
          fill="#00BFA6"
        >
          Buddy
        </text>
      </svg>

      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <a href="/create-trip">
              <Button varient="outline" className="rounded-full">
                Create Trip
              </Button>
            </a>
            <a href="/my-trips">
              <Button varient="outline" className="rounded-full">
                My Trips
              </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <img
                  src={user?.picture}
                  className="h-[35px] w-[35px] rounded-full"
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            Sign In
          </Button>
        )}
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
              <Button className="w-full mt-5" onClick={login}>
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

export default Header;
