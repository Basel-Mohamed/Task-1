// react
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
// swiper
import 'swiper/scss';
import 'swiper/scss/pagination';
// style
import styles from "./UpperNavbar.module.scss";
// images
import firstWallpaperImg from "/Main-Wallpaper.jpeg";
import secondWallpaperImg from "/Wallpaper-2.png";
import thirdWallpaperImg from "/Wallpaper-3.png";
import fourthWallpaperImg from "/Wallpaper-4.png";
import fifthWallpaperImg from "/Wallpaper-5.png";

// MUI components
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import { Paper, Typography } from "@mui/material";

// icons
import avatarPic from "/profileIcon.svg";
import logoPic from "/logo white.svg";
import picIcon from "/picIcon.svg";
import menuIcon from "/menuIcon.svg";
import newsIcon from "/newsIcon.svg";
import calenderIcon from "/calenderIcon.svg";
import sunIcon from "/sunIcon.svg";
import closeIcon from "/closeIcon.svg";
import leftArrow from "/leftArrow.svg";

export default function UpperNavbar({ setBackgroundImage }) {
  const [isImgContainerVisible, setIsImgContainerVisible] = useState(false);
  const containerRef = useRef(null);
  const imagesRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [temporaryImage, setTemporaryImage] = useState(null);
  const [isNewsContainerVisible, setIsNewsContainerVisible] = useState(false);
  const [isNewsDesContainerVisible, setIsNewsDesContainerVisible] =
    useState(false);
  const newsDesContainerRef = useRef(null);
  const newsContainerRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [weatherData, setWeatherData] = useState({
    tempMin: null,
    tempMax: null,
  });
  // handel carsuol
  const [activeStep, setActiveStep] = useState(0);
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);


  const paginationConfig = {
    clickable: true,
    renderBullet: (index, className) => {
      if (index < 3) {
        return `<span class="${className}"></span>`;
      }
      return '';
    },
  };



  // toggle News Des Container Visibility
  const toggleNewsDesContainer = () => {
    setIsNewsDesContainerVisible((prev) => !prev);
  };

  // toggle Img container visibility
  const toggleContainer = () => {
    setIsImgContainerVisible((prev) => !prev);
  };
  // toggle News Container Visibility
  const toggleNewsContainer = () => {
    setIsNewsContainerVisible((prev) => !prev);
  };

  // close container if clicked outside
  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsImgContainerVisible(false);
    }
  };

  // handle mouse down (start drag)
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - imagesRef.current.offsetLeft);
    setScrollLeft(imagesRef.current.scrollLeft);
  };

  // handle mouse move (drag)
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - imagesRef.current.offsetLeft;
    const walk = x - startX;
    imagesRef.current.scrollLeft = scrollLeft - walk;
  };

  // handle mouse up (end drag)
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // UseEffect

  // handel news API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
  
        const fakeNews = data.slice(0, 10).map((product) => ({
          label: product.title,
          imgPath: product.image, // صورة بجودة أعلى
          title: product.title,
          description: product.description,
          id: product.id,
        }));
  
        setNews(fakeNews);
      } catch (error) {
        console.error("Error fetching fake news:", error);
      }
    };
  
    fetchNews();
  }, []);
  
  

  // handel when img Container is open to close
  useEffect(() => {
    if (isImgContainerVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      setTemporaryImage(null);
      if (imagesRef.current) {
        imagesRef.current.scrollLeft = 0;
      }
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isImgContainerVisible]);

  // handel when news Container is open to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        newsContainerRef.current &&
        !newsContainerRef.current.contains(event.target) &&
        !(
          newsDesContainerRef.current &&
          newsDesContainerRef.current.contains(event.target)
        ) 
      ) {
        setIsNewsContainerVisible(false);
      }
    };

    if (isNewsContainerVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNewsContainerVisible, isNewsDesContainerVisible]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        newsDesContainerRef.current &&
        !newsDesContainerRef.current.contains(event.target)
      ) {
        setIsNewsDesContainerVisible(false);
      }
    };

    if (isNewsDesContainerVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNewsDesContainerVisible]);

  // dynamic time
  useEffect(() => {
    const today = new Date();
    const day = today.toLocaleString("ar-EG", { day: "numeric" });
    const month = today.toLocaleString("ar-EG", { month: "long" });
    const year = today.toLocaleString("ar-EG", { year: "numeric" });

    setCurrentDate(`${day} ، ${month} ، ${year}`);
  }, []);

  // dynamic weather
  const fetchWeather = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        {
          params: {
            latitude,
            longitude,
            daily: ["temperature_2m_max", "temperature_2m_min"],
            timezone: "auto",
          },
        }
      );

      const { temperature_2m_max, temperature_2m_min } = response.data.daily;
      setWeatherData({
        tempMin: temperature_2m_min[0],
        tempMax: temperature_2m_max[0],
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeather(24.7136, 46.6753);
  }, []);

  // main function return
  return (
    <nav>
      <Box className={styles.upperNavbar}>
        {/* left Upper Navbar */}
        <Box className={styles.leftUpperNavbar}>
          <img src={logoPic} />
        </Box>
        {/* end of left Upper Navbar */}
        {/* Middle Upper Navbar */}
        <Box className={styles.midUpperNav}>
          <Box>
            <img
              className={styles.calenderIcon}
              src={calenderIcon}
              alt="calenderIcon"
            />
          </Box>
          <Typography className={styles.calenderText}>التقويم</Typography>
          <Box>
            <img className={styles.sunIcon} src={sunIcon} alt="weather-icon" />
          </Box>
          <Typography className={styles.weatherText}>الطقس</Typography>
          <span className={styles.customText}>{currentDate}</span>
          <Typography component="span" className={styles.tempMin}>
            {weatherData.tempMin !== null
              ? new Intl.NumberFormat("ar-EG").format(
                  Math.round(weatherData.tempMin)
                )
              : "--"}
          </Typography>
          <Typography component="span" className={styles.slash}>
            /
          </Typography>
          <Typography component="span" className={styles.tempMax}>
            {weatherData.tempMax !== null
              ? new Intl.NumberFormat("ar-EG").format(
                  Math.round(weatherData.tempMax)
                )
              : "--"}
          </Typography>
          <Typography component="span" className={styles.degree1}>
            o
          </Typography>
          <Typography component="span" className={styles.degree2}>
            o
          </Typography>
        </Box>
        {/* end of Middle Navbar */}
        {/* Right Upper Navbar */}
        <Box className={styles.rightUpperNav}>
          <IconButton
            className={styles.newsButton}
            onClick={toggleNewsContainer}
          >
            <img src={newsIcon} alt="news" className={styles.newsIcon} />
          </IconButton>
          {/* News Container Element */}
          <Box
            ref={newsContainerRef}
            className={`${styles.newsContainer} ${
              isNewsContainerVisible ? styles.visible : styles.hidden
            }`}
          >
            {/* start cursol */}
            <Box className={styles.container}>
      <Paper className={styles.paper}>
        <Box className={styles.relativeBox}>
          <Swiper
            modules={[Pagination]}
            pagination={paginationConfig}
            onSlideChange={(swiper) => setActiveStep(swiper.activeIndex)}
            activeIndex={activeStep}
          >
            {news.map((item) => (
              <SwiperSlide key={item.id}>
                <Box className={styles.imageContainer}>
                  <img
                    src={item.imgPath}
                    alt={item.label}
                    onError={(e) => {
                      e.target.src = firstWallpaperImg;
                    }}
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper> 
        </Box>
      </Paper>
    </Box>

            {/* close button */}
            <IconButton
              onClick={() => setIsNewsContainerVisible(false)}
              className={styles.closeButton}
            >
              <img src={closeIcon} alt="Close" />
            </IconButton>
            {/* second title */}
            <Typography className={styles.newsTitle}>اخر الاخبار</Typography>

            {/* newes Images */}
            {news.slice(0, 3).map((item, index) => (
              <Box
                key={index}
                sx={{
                  margin: "12px 17px 15px 152px",
                }}
              >
                <Box sx={{ display: "flex", gap: "8px" }}>
                  <Box sx={{ flexShrink: 0 }}>
                    <img
                      src={item.imgPath}
                      alt={item.label}
                      onError={(e) => {
                        e.target.src = firstWallpaperImg;
                      }}
                      style={{
                        width: "188px",
                        height: "114px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  </Box>
                  {/* news text */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    {/* Date */}
                    <Typography
                      sx={{
                        color: "#A7A7A7",
                        fontSize: "12px",
                        fontWeight: "400",
                      }}
                    >
                      {currentDate}
                    </Typography>
                    {/* News Title */}
                    <Typography sx={{ fontSize: "16px", color: "#FFFFFF" }}>
                      {item.title.split(" ").slice(0, 4).join(" ")}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "end" }}>
                      <Typography
                        sx={{
                          color: "#A7A7A7",
                          fontSize: "14px",
                          fontWeight: "400",
                        }}
                      >
                        {/* News Description */}
                        {item.description
                          ? item.description.split(" ").slice(0, 10).join(" ") +
                            "..."
                          : "No description available"}
                      </Typography>
                      {/* News Button */}
                      <IconButton
                        sx={{
                          color: "#FFCA31",
                          fontSize: "11px",
                        }}
                        onClick={() => {
                          setSelectedNews(item); 
                          setIsNewsDesContainerVisible(true);
                        }}
                      >
                        شاهد المزيد
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
          {/* end cursol */}
          <Badge
            badgeContent={"99+"}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "#FF3B30 !important",
                color: "white",
              },
            }}
          >
            {/* menu button */}
            <IconButton
              sx={{
                width: 40,
                height: 40,
                backgroundColor: "#FFFFFF26",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { backgroundColor: "#FFFFFF40" },
              }}
            >
              <img src={menuIcon} alt="menu" width={25} />
            </IconButton>
          </Badge>
          {/* Img icon button */}
          <IconButton
            sx={{
              width: 40,
              height: 40,
              backgroundColor: "#FFFFFF26",
              borderRadius: "50%",
              justifyContent: "center",
              alignItems: "center",
              "&:hover": { backgroundColor: "#FFFFFF40" },
              display: { xs: "none", md: "flex" },
            }}
            onClick={toggleContainer}
          >
            <img src={picIcon} alt="pic" width={25} />
          </IconButton>
          {/* Black layer when clicking on pic or news Icon */}

          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              zIndex: 99,
              transition: "opacity .3s ease, visibility .3s ease",
              opacity: isImgContainerVisible || isNewsContainerVisible ? 1 : 0,
              visibility:
                isImgContainerVisible || isNewsContainerVisible
                  ? "visible"
                  : "hidden",
            }}
          />

          {/*Img container element */}

          <Box
            ref={containerRef}
            sx={{
              overflowX: "auto",
              scrollbarWidth: "none",
              whiteSpace: "nowrap",
              direction: "rtl",
              position: "absolute",
              top: 89,
              right: 224,
              width: 428,
              height: 250,
              backgroundColor: "#F1F5F9",
              padding: "12px",
              border: ".5px solid #FFFFFF80",
              borderRadius: "20px",
              opacity: isImgContainerVisible ? 1 : 0,
              visibility: isImgContainerVisible ? "visible" : "hidden",
              transform: isImgContainerVisible
                ? "translateY(0)"
                : "translateY(-10px)",
              transition:
                "opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease",

              cursor: isDragging ? "grabbing" : "grab",
              "&::-webkit-scrollbar": { display: "none" },
              zIndex: 100,
            }}
          >
            <Typography
              sx={{
                fontFamily: "inter",
                zIndex: 99,
                paddingRight: "16px",
                paddingTop: "12px",
                fontSize: "22px",
                fontWeight: 400,
                lineHeight: "28px",
              }}
            >
              الخلفيات
            </Typography>

            <Box
              ref={imagesRef}
              sx={{
                overflowX: "auto",
                scrollbarWidth: "none",
                whiteSpace: "nowrap",
                direction: "rtl",
                cursor: isDragging ? "grabbing" : "grab",
                "&::-webkit-scrollbar": { display: "none" },
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {[
                firstWallpaperImg,
                secondWallpaperImg,
                thirdWallpaperImg,
                fourthWallpaperImg,
                fifthWallpaperImg,
              ].map((imgSrc, index) => (
                <IconButton
                  ref={imagesRef}
                  key={index}
                  sx={{
                    width: "30%",
                  }}
                  disableRipple
                  disableFocusRipple
                  onClick={() => setTemporaryImage(imgSrc)}
                >
                  <Box
                    component="img"
                    src={imgSrc}
                    alt={`Wallpaper-${index + 1}`}
                    draggable="false"
                    onMouseDown={handleMouseDown}
                    sx={{
                      width: "100%",
                      border:
                        temporaryImage === imgSrc
                          ? "2px solid #06BE8E"
                          : "none",
                      borderRadius: "4px",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.2)",
                      },
                    }}
                  />
                </IconButton>
              ))}
            </Box>
            <Box>
              <IconButton
                disableRipple
                disableFocusRipple
                sx={{
                  width: "190px",
                  height: "48px",
                  borderRadius: "10px",
                  backgroundColor: "#2271EC",
                  marginTop: "42px",
                  marginLeft: "16px",
                  "&:hover": { backgroundColor: "#1A5FCC " },
                  transition: "all 0.3s ease",
                }}
                onClick={() => {
                  if (temporaryImage) {
                    setBackgroundImage(temporaryImage);
                  }
                  setIsImgContainerVisible(false);
                }}
              >
                <Typography sx={{ color: "white" }}>تعيين الخلفية</Typography>
              </IconButton>
              <IconButton
                disableRipple
                disableFocusRipple
                sx={{
                  width: "190px",
                  height: "48px",
                  borderRadius: "10px",
                  backgroundColor: "#FFFFFF",
                  marginTop: "42px",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                  transition: "all 0.3s ease",
                }}
                onClick={() => setIsImgContainerVisible(false)}
              >
                <Typography
                  sx={{
                    color: "#3A3619",
                  }}
                >
                  إلغاء
                </Typography>
              </IconButton>
            </Box>
          </Box>

          <Stack sx={{ width: "166px" }}>
            <Chip
              sx={{
                backgroundColor: "#FFFFFF26",
                color: "white",
                flexDirection: "row-reverse",
                height: "40px",
              }}
              avatar={
                <Avatar
                  src={avatarPic}
                  sx={{ width: "32px !important", height: "32px !important" }}
                />
              }
              label={
                <span>
                  <span>
                    <IconButton sx={{ color: "white", width: 16, height: 16 }}>
                      <ExpandMoreIcon />
                    </IconButton>
                  </span>
                  <span className={styles.text}>عمر الالفي</span>
                </span>
              }
            />
          </Stack>
        </Box>
      </Box>
      {/* start news Des */}
      <Box
        ref={newsDesContainerRef}
        sx={{
          direction: "rtl",
          position: "absolute",
          top: "88px",
          right: 410,
          width: "44%",
          height: "81%",
          margin: "auto",
          backgroundColor: "#FFFFFF2B",
          backdropFilter: "blur(15px)",

          borderRadius: "10px",
          opacity: isNewsDesContainerVisible ? 1 : 0,
          visibility: isNewsDesContainerVisible ? "visible" : "hidden",
          transform: isNewsDesContainerVisible
            ? "translateY(0)"
            : "translateY(-10px)",
          zIndex: 9999,
        }}
      >
        {/* start cursol */}
        <Box sx={{ width: "100%", position: "relative" }}>
          <Paper
            sx={{
              width: "85%",
              margin: "15% auto",
              borderRadius: "16px",
            }}
          >
            <Box sx={{ position: "relative" }}>
              {/* cursol Images */}

              <div>
                {selectedNews && (
                  <img
                    src={selectedNews.imgPath}
                    alt={selectedNews.label}
                    onError={(e) => {
                      e.target.src = firstWallpaperImg;
                    }}
                    style={{
                      width: "100%",
                      height: 204,
                      borderRadius: "16px",
                    }}
                  />
                )}
              </div>
            </Box>
          </Paper>
        </Box>
        {/* close button */}
        <IconButton
          onClick={() => {
            setIsNewsDesContainerVisible(false),
              setIsNewsContainerVisible(false);
          }}
          sx={{ position: "absolute", top: "18px", left: "16px" }}
        >
          <img src={closeIcon} />
        </IconButton>
        {/* back to news button */}
        <IconButton
          onClick={() => {
            setIsNewsDesContainerVisible(false),
              setIsNewsContainerVisible(true);
          }}
          sx={{
            position: "absolute",
            top: "9%",
            right: "10px",
            border: "1px solid #FAFAFA",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "130px",
            borderRadius: "8px",
          }}
        >
          <span className="text-[12px] text-white"> الرجوع لكل الأخبار</span>
          <img src={leftArrow} alt="leftArrow" />
        </IconButton>
        {/* second title */}
        <Typography
          sx={{
            position: "absolute",
            top: "3%",
          right: "15px",
            color: "white", 
          }}
        >
          اخر الاخبار
        </Typography>
        <Typography
          sx={{
            position: "absolute",
            top: {md:"50%" ,lg:"60%"},
            right: "15px",
            color: "white",
            width: "90px",
            fontSize: "12px",
            fontWeight: "400",
          }}
        >
          {currentDate}
        </Typography>

        {selectedNews && selectedNews.title ? (
          <Box
            sx={{
              padding: "0 16px",
              color: "white",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#888",
                borderRadius: "10px",
              },

              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "#555",
              },
            }}
          >
            {/* NEWS title */}
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#FFFFFF",
              }}
            >
              {selectedNews.title}
            </Typography>

            {/* news description*/}
            <Typography
              sx={{ fontSize: "14px", color: "#A7A7A7", marginTop: "8px" }}
            >
              {selectedNews.description
                ? selectedNews.description
                : "لا يوجد وصف متاح"}
            </Typography>
          </Box>
        ) : (
          <Typography sx={{ fontSize: "16px", color: "white" }}>
            لم يتم تحديد خبر بعد
          </Typography>
        )}
      </Box>
      ;{/* end cursol */}
    </nav>
  );
}
