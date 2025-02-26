import styles from "./SideNavbar.module.scss";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import folderIcon from "/public/folderIcon.svg";
import searchIcon from "/public/search-md.svg";

export default function SideNavbar() {
  return (
    <Box className={styles.sideNav}>
      <Box className={styles.sideNavContainer}>
        {/* search Icon*/}
        <Box className={styles.searchIcon}>
          <img src={searchIcon} alt="searchIcon" />
        </Box>

        {/* text */}
        <Box className={styles.boxtextSideBar}>
          <Typography className={styles.textSideBar}>
            الخدمات الذاتيه
          </Typography>
        </Box>

        {/* folder Icons*/}
        {[...Array(4)].map((_, index) => (
          <Box key={index} className={styles.folderIcon}>
            <img src={folderIcon} alt="foldericon" />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
