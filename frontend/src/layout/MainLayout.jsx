import { useState } from "react";
import { Outlet } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
//
import MainHeader from "./MainHeader";
import MainSideBar from "./MainSideBar";
import MainRightSidebar from "./MainRightSidebar";

// ----------------------------------------------------------------------

const DRAWER_WIDTH = 250;
const COLLAPSED_WIDTH_LEFT = 85;
const COLLAPSED_WIDTH_RIGHT = 0;

const MainStyle = styled("main")(({ theme }) => ({
  flexGrow: 1,

  [theme.breakpoints.up("lg")]: {
    width: "100%",
    transition: theme.transitions.create("margin-left", {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

// ----------------------------------------------------------------------

export default function MainLayout() {
  const [isCollapse, setCollapse] = useState(true);
  const [isCollapseRight, setCollapseRight] = useState(true);

  return (
    <Box
      sx={{
        display: { lg: "flex" },
        minHeight: { lg: 1 },
      }}
    >
      <MainHeader isCollapse={isCollapse} />

      <MainSideBar
        isOpenSidebar={isCollapse}
        onToggleSidebar={() => setCollapse(!isCollapse)}
      />

      <MainStyle sx={{ height: "calc(100vh - 64px)", marginTop: "64px",
                      marginRight: isCollapseRight ? `${DRAWER_WIDTH}px` : `${COLLAPSED_WIDTH_RIGHT}px` }}>
        <Outlet />
      </MainStyle>

      <MainRightSidebar
        isOpen={isCollapseRight}
        onToggle={() => setCollapseRight(!isCollapseRight)}
      />

    </Box>
  );
}