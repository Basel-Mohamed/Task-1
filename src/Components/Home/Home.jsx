import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import style from "./Home.module.scss";

export default function Home() {
  // Group related states
  const [timeData, setTimeData] = useState({
    time: "",
    gregorianDate: "",
    hijriDate: "",
  });

  // Memoize Arabic number conversion
  const toArabicNumbers = useCallback((num) => {
    const arabicNums = "٠١٢٣٤٥٦٧٨٩";
    return num.toString().replace(/\d/g, (d) => arabicNums[d]);
  }, []);

  // Memoize time formatting
  const formatTime = useCallback((now) => {
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const amPm = hours >= 12 ? "م" : "ص";
    const formattedHours = hours % 12 || 12;
    
    return ` ${toArabicNumbers(minutes)} :${toArabicNumbers(formattedHours)} ${amPm}`;
  }, [toArabicNumbers]);

  // Memoize Gregorian date formatting
  const formatGregorianDate = useCallback((now) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return now.toLocaleDateString("ar-EG", options);
  }, []);

  // Separate Hijri date fetching logic
  const fetchHijriDate = useCallback(async (date) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDate() - 1;

    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/gToHCalendar/${month}/${year}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch Hijri date');
      }

      const data = await response.json();

      if (data?.data?.[day]?.hijri) {
        const hijriInfo = data.data[day].hijri;
        return `${toArabicNumbers(hijriInfo.day)} ${hijriInfo.month.ar} ${toArabicNumbers(hijriInfo.year)}`;
      }
      
      return "";
    } catch (error) {
      console.error("Error fetching Hijri date:", error);
      return "";
    }
  }, [toArabicNumbers]);

  // Update all time-related data
  const updateTimeData = useCallback(async () => {
    const now = new Date();
    
    setTimeData(prev => ({
      ...prev,
      time: formatTime(now),
      gregorianDate: formatGregorianDate(now)
    }));

    // Fetch Hijri date separately to avoid blocking
    const hijriDate = await fetchHijriDate(now);
    if (hijriDate) {
      setTimeData(prev => ({
        ...prev,
        hijriDate
      }));
    }
  }, [formatTime, formatGregorianDate, fetchHijriDate]);

  // Set up timer and initial data
  useEffect(() => {
    // Initial update
    updateTimeData();

    // Set up interval for updates
    const interval = setInterval(updateTimeData, 1000);

    // Cleanup
    return () => clearInterval(interval);
  }, [updateTimeData]);

  // Memoize welcome text
  const welcomeText = useMemo(() => "! مرحبا بك أحمد محمد", []);

  return (
    <Box className={style.container}>
      <Box className={style.content}>
        <Typography className={style.welcomeText}>
          {welcomeText}
        </Typography>
        <Typography className={style.timeText}>
          {timeData.time}
        </Typography>
        <Box className={style.dateContainer}>
          <Typography className={style.dateText}>
            {timeData.gregorianDate}
          </Typography>
          <Typography className={style.dateText}>
            {timeData.hijriDate}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}