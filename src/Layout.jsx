import React, { useState } from "react";
import UpperNavbar from "./Components/UpperNavbar/UpperNavbar";
import SideNavbar from "./Components/SideNavbar/SideNavbar";
import defaultBackground from "/public/Main-Wallpaper.jpeg"; 
import LowerNavbar from './Components/LowerNavbar/LowerNavbar';
import Home from "./Components/Home/Home"

export default function Layout() {
    const [backgroundImage, setBackgroundImage] = useState(defaultBackground);

  return (
    <div
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
            backgroundSize: "cover",
            width: "100vw",
            height: "100vh",
            transition: "background 0.5s ease-in-out",
            position:"relative",
            overflow:"hidden"
          }}
        >

          <UpperNavbar setBackgroundImage={setBackgroundImage} />
          <Home/>
          <SideNavbar/>
          <LowerNavbar/>
        </div>
  )
}
