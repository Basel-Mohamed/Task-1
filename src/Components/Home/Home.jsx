import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import style from "./Home.module.scss";

export default function Home() {
  const [time, setTime] = useState("");
  const [gregorianDate, setGregorianDate] = useState("");
  const [hijriDate, setHijriDate] = useState("");

// convert nums to Arabic
  const toArabicNumbers = (num) =>
    num.toString().replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // formating Time
      let hours = now.getHours();
      let minutes = now.getMinutes();
      const amPm = hours >= 12 ? "م" : "ص";
      hours = hours % 12 || 12; // 12 hrs format
      const formattedTime = ` ${toArabicNumbers(minutes)} :${toArabicNumbers(hours)} ${amPm}`;
      setTime(formattedTime);

      // format melady Date
      const gregorianOptions = { year: "numeric", month: "long", day: "numeric" };
      const formattedGregorianDate = now.toLocaleDateString("ar-EG", gregorianOptions);
      setGregorianDate(formattedGregorianDate);

      // call Hijri Date API
      fetchHijriDate(now);
    };

    const fetchHijriDate = async (date) => {
      const month = date.getMonth() + 1; // Match hijri with melady Date by add 1 month
      const year = date.getFullYear();
      try {
        const response = await fetch(
          `https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`
        );
        const data = await response.json();

        if (data && data.data) {
          const day = date.getDate() - 1;
          const hijriInfo = data.data[day].hijri;
          const formattedHijriDate = `${toArabicNumbers(
            hijriInfo.day
          )} ${hijriInfo.month.ar} ${toArabicNumbers(hijriInfo.year)}`;
          setHijriDate(formattedHijriDate);
        }
      } catch (error) {
        console.error("حدث خطأ أثناء جلب التاريخ الهجري:", error);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box className={style.container}>
      <Box className={style.content}>
        <Typography className={style.welcomeText}>! مرحبا بك أحمد محمد</Typography>
        <Typography className={style.timeText}>{time}</Typography>
        <Box className={style.dateContainer}>
          <Typography className={style.dateText}>{gregorianDate}</Typography>
          <Typography className={style.dateText}>{hijriDate}</Typography>
        </Box>
      </Box>
    </Box>
  );
}