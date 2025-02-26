import React from "react";
import style from "./LowerNavbar.module.scss";

// Icons
import facebookIcon from "/public/facebookIcon.svg";
import internetIcon from "/public/internetIcon.svg";
import gitIcon from "/public/gitIcon.svg";
import linkedinIcon from "/public/linkedinIcon.svg";
import optionIcon from "/public/optionIcon.svg";
import tasksIcon from "/public/tasksIcon.svg";
import peopleIcon from "/public/peopleIcon.svg";
import bagIcon from "/public/bagIcon.svg";
import graphIcon from "/public/graphIcon.svg";
import toDoicon from "/public/toDoicon.svg";

// MUI Components
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

export default function LowerNavbar() {
  return (
    <nav>
      <Box className={style.navContainer}>
        {/* Left Nav */}
        <Box className={style.leftNav}>
          <Typography className={style.navText}>قائمة المهام</Typography>
          <img src={toDoicon} alt="to-do-icon" className={style.todoIcon} />
        </Box>

        {/* Mid Nav */}
        <Box className={style.midNav}>
          <Box className={style.iconsContainer}>
            {[
              { src: graphIcon, gradient: "gradient-1" },
              { src: bagIcon, gradient: "gradient-2" },
              { src: peopleIcon, gradient: "gradient-3" },
              { src: tasksIcon, gradient: "gradient-4" },
              { src: optionIcon, gradient: "gradient-5" },
            ].map((icon, index) => (
              <Box
                key={index}
                className={`${style.iconBox} ${style[icon.gradient]}`}
              >
                <img
                  src={icon.src}
                  alt={`icon-${index}`}
                  className={style.midNavIcons}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right Nav */}
        <Box className={style.rightNav}>
          <Box className={style.socialIconBox}>
            <img src={linkedinIcon} alt="linkedin-icon" />
          </Box>
          <Box className={style.socialIconBox}>
            <img src={gitIcon} alt="github-icon" />
          </Box>
          <Box className={style.socialIconBox}>
            <img src={internetIcon} alt="internet-icon" />
          </Box>
          <Box className={style.socialIconBox}>
            <img src={facebookIcon} alt="facebook-icon" />
          </Box>
        </Box>
      </Box>
    </nav>
  );
}