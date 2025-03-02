// react
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
// swiper
import "swiper/scss";
import "swiper/scss/pagination";
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
import CircularProgress from "@mui/material/CircularProgress";

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
  // State management
  const [uiState, setUiState] = useState({
    isImgContainerVisible: false,
    isNewsContainerVisible: false,
    isNewsDesContainerVisible: false,
  });

  const [dragState, setDragState] = useState({
    isDragging: false,
    startX: 0,
    scrollLeft: 0,
  });

  const [temporaryImage, setTemporaryImage] = useState(null);
  const [currentDate, setCurrentDate] = useState(null);
  const [weatherData, setWeatherData] = useState({
    tempMin: null,
    tempMax: null,
  });
  const [activeStep, setActiveStep] = useState(0);
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refs
  const containerRef = useRef(null);
  const imagesRef = useRef(null);
  const newsDesContainerRef = useRef(null);
  const newsContainerRef = useRef(null);
  const swiperRef = useRef(null);

  // Memoized configurations
  const paginationConfig = useMemo(
    () => ({
      clickable: true,
      renderBullet: (index, className) =>
        index < 3 ? `<span class="${className}"></span>` : "",
    }),
    []
  );

  // Utility functions
  const toggleUIState = (key) => {
    setUiState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toArabicNumbers = useCallback((num) => {
    const arabicNums = "٠١٢٣٤٥٦٧٨٩";
    return num.toString().replace(/\d/g, (d) => arabicNums[d]);
  }, []);

  // Date formatting
  const formatArabicDate = useCallback(() => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString("ar-EG", { month: "long" });
    const year = today.getFullYear();
    return `${toArabicNumbers(day)} ، ${month} ، ${toArabicNumbers(year)}`;
  }, [toArabicNumbers]);

  // API calls
  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("https://fakestoreapi.com/products");
      setNews(
        data.slice(0, 10).map(({ title, image, description, id }) => ({
          label: title,
          imgPath: image,
          title,
          description,
          id,
        }))
      );
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchWeather = useCallback(async (latitude, longitude) => {
    try {
      const { data } = await axios.get(
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
      const { temperature_2m_max, temperature_2m_min } = data.daily;
      setWeatherData({
        tempMin: temperature_2m_min[0],
        tempMax: temperature_2m_max[0],
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  }, []);

  // Event handlers
  const handleMouseDown = (e) => {
    setDragState({
      isDragging: true,
      startX: e.pageX - imagesRef.current.offsetLeft,
      scrollLeft: imagesRef.current.scrollLeft,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragState.isDragging) return;
    e.preventDefault();
    const x = e.pageX - imagesRef.current.offsetLeft;
    imagesRef.current.scrollLeft =
      dragState.scrollLeft - (x - dragState.startX);
  };

  // Effects
  useEffect(() => {
    fetchNews();
    fetchWeather(24.7136, 46.6753);
    setCurrentDate(formatArabicDate());
  }, [fetchNews, fetchWeather, formatArabicDate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Handle image container
      if (
        uiState.isImgContainerVisible &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setUiState((prev) => ({ ...prev, isImgContainerVisible: false }));
      }

      // Handle news containers
      const isClickOutsideNews =
        newsContainerRef.current &&
        !newsContainerRef.current.contains(event.target);
      const isClickOutsideNewsDes =
        newsDesContainerRef.current &&
        !newsDesContainerRef.current.contains(event.target);

      if (
        (uiState.isNewsContainerVisible || uiState.isNewsDesContainerVisible) &&
        isClickOutsideNews &&
        isClickOutsideNewsDes
      ) {
        setUiState((prev) => ({
          ...prev,
          isNewsContainerVisible: false,
          isNewsDesContainerVisible: false,
        }));
      }
    };

    // Only add listener if any container is visible
    if (
      uiState.isImgContainerVisible ||
      uiState.isNewsContainerVisible ||
      uiState.isNewsDesContainerVisible
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    uiState.isImgContainerVisible,
    uiState.isNewsContainerVisible,
    uiState.isNewsDesContainerVisible,
  ]);

  // Add effect to reset scroll and selection when container closes
  useEffect(() => {
    if (!uiState.isImgContainerVisible) {
      if (imagesRef.current) {
        imagesRef.current.scrollLeft = 0;
      }
      setTemporaryImage(null);
    }
  }, [uiState.isImgContainerVisible]);

  // Add event listener for Escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        if (uiState.isNewsDesContainerVisible) {
          // Return to news container
          setUiState((prev) => ({
            ...prev,
            isNewsContainerVisible: true,
            isNewsDesContainerVisible: false,
          }));
        } else if (
          uiState.isImgContainerVisible ||
          uiState.isNewsContainerVisible
        ) {
          // Close everything
          setUiState({
            isImgContainerVisible: false,
            isNewsContainerVisible: false,
            isNewsDesContainerVisible: false,
          });
        }
      }
    };

    document.addEventListener("keydown", handleEscKey);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [
    uiState.isImgContainerVisible,
    uiState.isNewsContainerVisible,
    uiState.isNewsDesContainerVisible,
  ]);

  // Add event listener for arrow keys
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!uiState.isNewsContainerVisible || !swiperRef.current) return;

      if (event.key === "ArrowLeft") {
        swiperRef.current.slideNext();
      } else if (event.key === "ArrowRight") {
        swiperRef.current.slidePrev();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [uiState.isNewsContainerVisible]);

  // Add effect for image container keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!uiState.isImgContainerVisible || !imagesRef.current) return;

      const images = [
        firstWallpaperImg,
        secondWallpaperImg,
        thirdWallpaperImg,
        fourthWallpaperImg,
        fifthWallpaperImg,
      ];

      const currentIndex = images.indexOf(temporaryImage || images[0]);
      const scrollWidth = imagesRef.current.clientWidth;

      switch (event.key) {
        case "ArrowLeft":
          // Move to next image
          if (currentIndex < images.length - 1) {
            setTemporaryImage(images[currentIndex + 1]);
            imagesRef.current.scrollTo({
              left: (currentIndex + 1) * scrollWidth,
              behavior: "smooth",
            });
          }
          break;

        case "ArrowRight":
          // Move to previous image
          if (currentIndex > 0) {
            setTemporaryImage(images[currentIndex - 1]);
            imagesRef.current.scrollTo({
              left: (currentIndex - 1) * scrollWidth,
              behavior: "smooth",
            });
          }
          break;

        case "Enter":
          // Apply selected wallpaper if an image is selected
          if (temporaryImage) {
            setBackgroundImage(temporaryImage);
            setUiState((prev) => ({
              ...prev,
              isImgContainerVisible: false,
            }));
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [uiState.isImgContainerVisible, temporaryImage, setBackgroundImage]);

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
            onClick={() => toggleUIState("isNewsContainerVisible")}
          >
            <img src={newsIcon} alt="news" className={styles.newsIcon} />
          </IconButton>
          {/* News Container Element */}
          <Box
            ref={newsContainerRef}
            className={`${styles.newsContainer} ${
              uiState.isNewsContainerVisible ? styles.visible : styles.hidden
            }`}
          >
            {/* Close button outside the scrollable area */}
            <IconButton
              onClick={() => toggleUIState("isNewsContainerVisible")}
              className={styles.closeButton}
            >
              <img src={closeIcon} alt="Close" />
            </IconButton>

            {isLoading ? (
              <Box className={styles.loadingContainer}>
                <CircularProgress className={styles.loadingSpinner} />
              </Box>
            ) : (
              <>
                <Box className={styles.newsHeader}>
                  <Typography className={styles.newsTitle}>
                    اخر الاخبار
                  </Typography>
                </Box>
                <Box className={styles.newsContent}>
                  {/* Swiper and news content */}
                  <Box className={styles.container}>
                    <Paper className={styles.paper}>
                      <Box className={styles.relativeBox}>
                        <Swiper
                          modules={[Pagination]}
                          pagination={paginationConfig}
                          onSlideChange={(swiper) =>
                            setActiveStep(swiper.activeIndex)
                          }
                          initialSlide={activeStep}
                          allowTouchMove={true}
                          dir="rtl"
                          onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                          }}
                        >
                          {news.slice(0, 3).map((item) => (
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

                  {/* News Images */}
                  {news.slice(0, 3).map((item, index) => (
                    <Box key={index} className={styles.newsItem}>
                      <Box className={styles.newsTextContent}>
                        <Box className={styles.newsImageBox}>
                          <Avatar
                            src={item.imgPath}
                            alt={item.label}
                            onError={(e) => {
                              e.target.src = firstWallpaperImg;
                            }}
                            className={styles.newsThumbnail}
                            variant="rounded"
                          />
                        </Box>
                        {/* News Text */}
                        <Box className={styles.newsText}>
                          {/* Date */}
                          <Typography className={styles.newsDate}>
                            {currentDate}
                          </Typography>
                          {/* News Title */}
                          <Typography className={styles.newsFirstTitle}>
                            {item.title.split(" ").slice(0, 4).join(" ")}
                          </Typography>

                          <Box className={styles.newsBox}>
                            <Typography className={styles.newsData}>
                              {/* News Description */}
                              {item.description
                                ? item.description
                                    .split(" ")
                                    .slice(0, 10)
                                    .join(" ") + "..."
                                : "No description available"}
                            </Typography>
                            {/* News Button */}
                            <IconButton
                              className={styles.newsDesButton}
                              onClick={() => {
                                setSelectedNews(item);
                                setUiState((prev) => ({
                                  ...prev,
                                  isNewsContainerVisible: false,
                                  isNewsDesContainerVisible: true,
                                }));
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
              </>
            )}
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
            <IconButton className={styles.menuIcon}>
              <Avatar
                src={menuIcon}
                alt="menu"
                className={styles.avatarIcon}
                variant="square"
              />
            </IconButton>
          </Badge>
          {/* Img icon button */}
          <IconButton
            className={styles.imgIconButton}
            onClick={() => toggleUIState("isImgContainerVisible")}
          >
            <Avatar
              src={picIcon}
              alt="pic"
              className={styles.avatarIcon}
              variant="square"
            />
          </IconButton>
          {/* Black layer when clicking on pic or news Icon */}

          <Box
            className={`${styles.blackLayer} ${
              uiState.isImgContainerVisible ||
              uiState.isNewsContainerVisible ||
              uiState.isNewsDesContainerVisible
                ? styles.visible
                : styles.hidden
            }`}
          />

          {/*Img container element */}

          <Box
            ref={containerRef}
            className={`${styles.imgContainer} ${
              uiState.isImgContainerVisible ? styles.visible : styles.hidden
            } ${dragState.isDragging ? styles.dragging : ""}`}
          >
            <Typography className={styles.backgroundText}>الخلفيات</Typography>

            <Box
              ref={imagesRef}
              className={`${styles.imageScrollContainer} ${
                dragState.isDragging ? styles.dragging : ""
              }`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={() =>
                setDragState({ ...dragState, isDragging: false })
              }
              onMouseLeave={() =>
                setDragState({ ...dragState, isDragging: false })
              }
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
                  className={styles.iconButtonImage}
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
                    className={`${styles.wallpaperImage} ${
                      temporaryImage === imgSrc ? styles.selectedWallpaper : ""
                    }`}
                  />
                </IconButton>
              ))}
            </Box>
            <Box>
              <IconButton
                disableRipple
                disableFocusRipple
                className={styles.iconButtonPrimary}
                onClick={() => {
                  if (temporaryImage) {
                    setBackgroundImage(temporaryImage);
                  }
                  toggleUIState("isImgContainerVisible");
                }}
              >
                <Typography className={styles.typographyWhite}>
                  تعيين الخلفية
                </Typography>
              </IconButton>
              <IconButton
                disableRipple
                disableFocusRipple
                className={styles.iconButton}
                onClick={() => toggleUIState("isImgContainerVisible")}
              >
                <Typography className={styles.typographyCancel}>
                  إلغاء
                </Typography>
              </IconButton>
            </Box>
          </Box>

          <Stack className={styles.stackContainer}>
            <Chip
              className={styles.chip}
              avatar={<Avatar src={avatarPic} className={styles.avatar} />}
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <IconButton className={styles.expandIcon}>
                    <ExpandMoreIcon />
                  </IconButton>
                  <Typography className={styles.labelText}>
                    عمر الألفي
                  </Typography>
                </Stack>
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
          backdropFilter: "blur(10px)",

          borderRadius: "10px",
          opacity: uiState.isNewsDesContainerVisible ? 1 : 0,
          visibility: uiState.isNewsDesContainerVisible ? "visible" : "hidden",
          transform: uiState.isNewsDesContainerVisible
            ? "translateY(0)"
            : "translateY(-10px)",
          zIndex: 9999,
        }}
      >
        <Box className={styles.cursolContainer}>
          <Paper className={styles.cursolPaper}>
            <Box className={styles.relativeBox}>
              {/* cursol Images */}
              <Box>
                {selectedNews && (
                  <img
                    src={selectedNews.imgPath}
                    alt={selectedNews.label}
                    onError={(e) => {
                      e.target.src = firstWallpaperImg;
                    }}
                    className={styles.cursolImage}
                  />
                )}
              </Box>
            </Box>
          </Paper>
        </Box>
        {/* close button */}
        <IconButton
          className={styles.closeButton}
          onClick={() => {
            setUiState((prev) => ({
              ...prev,
              isNewsContainerVisible: false,
              isNewsDesContainerVisible: false,
            }));
          }}
        >
          <img src={closeIcon} alt="close" />
        </IconButton>
        {/* back to news button */}
        <IconButton
          onClick={() => {
            setUiState((prev) => ({
              ...prev,
              isNewsContainerVisible: true,
              isNewsDesContainerVisible: false,
            }));
          }}
          className={styles.backToNewsButton}
        >
          <Typography className={styles.backToNewsText}>
            الرجوع لكل الأخبار
          </Typography>
          <img src={leftArrow} alt="leftArrow" />
        </IconButton>
        {/* second title */}
        <Typography className={styles.secondTitle}>اخر الاخبار</Typography>
        <Typography className={styles.dateText}>{currentDate}</Typography>
        {selectedNews && selectedNews.title ? (
          <Box className={styles.newsWrapper}>
            <Typography className={styles.newsSecTitle}>
              {selectedNews.title}
            </Typography>
            {/* news description */}
            <Typography className={styles.newsDescription}>
              {selectedNews.description
                ? selectedNews.description
                : "لا يوجد وصف متاح"}
            </Typography>
          </Box>
        ) : (
          <Typography className={styles.noNewsSelected}>
            لم يتم تحديد خبر بعد
          </Typography>
        )}
      </Box>
      ;{/* end cursol */}
    </nav>
  );
}
