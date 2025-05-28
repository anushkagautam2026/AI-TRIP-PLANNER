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
      <img src="/logo.svg"></img>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <a href='/create-trip'>
            <Button varient="outline" className="rounded-full">
              Create Trip
            </Button>
            </a>
            <a href='/my-trips'>
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
          <Button onClick={()=>{setOpenDialog(true)}}>Sign In</Button>
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
