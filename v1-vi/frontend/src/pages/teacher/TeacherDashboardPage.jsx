"use client";
import {useEffect, useState} from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid2,
} from "@mui/material";
import Page from "../../components/Page";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PersonIcon from "@mui/icons-material/Person";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { getTeacherInfo} from "../../utils/api";
import useAuth from "../../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const response = await getTeacherInfo(user.username);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching teacher info:", error);
      }
    }
    fetchTeacherInfo();
  }, []);

  return (
    <Page title="My Dashboard">
      <Box sx={{ display: "flex" }}>
        <Box
          component="main"
          sx={{
            p: 3,
            mt: 8,
            transition: (theme) =>
              theme.transitions.create(["margin", "width"], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
              }),
            marginLeft: 0,
            width:  "100%",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              mb: 4,
            }}
          >
            Teacher Dashboard
          </Typography>

          <Grid2
            container
            spacing={4}
            sx={{
              width: "100%",
              flexGrow: 1,
              maxWidth: "100%",
            }}
          >
            {/* Teacher Profile Card */}
            <Grid2 item xs={12} sx={{ height: "100%", width: "100%" }}>
              <Card elevation={0} sx={{ borderRadius: 2, height: "100%" }}>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        mb: 2,
                        bgcolor: "primary.main",
                        fontSize: "2.5rem",
                      }}
                    >
                      {profile?.HoTen?.charAt(0) || "T"}
                    </Avatar>
                    <Typography variant="h3" sx={{ fontWeight: "700" }}>
                      {profile?.HoTen}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Teacher
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid2
                    container
                    spacing={2}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Left Column */}
                    <Grid2 item xs={12} md={6}>
                      {/* First set of list items */}
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <FingerprintIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Teacher ID"
                            secondary={profile?.MaGV}
                            primaryTypographyProps={{
                              variant: "body2",
                              fontWeight: 500,
                              color: "secondary.main",
                            }}
                            secondaryTypographyProps={{
                              variant: "body1",
                              fontWeight: "medium",
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <EmailIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Email"
                            secondary={user?.email}
                            primaryTypographyProps={{
                              variant: "body2",
                              fontWeight: 500,
                              color: "secondary.main",
                            }}
                            secondaryTypographyProps={{
                              variant: "body1",
                              fontWeight: "medium",
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <PhoneIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Phone"
                            secondary={profile?.SoDienThoai || "Not provided"} 
                            primaryTypographyProps={{
                              variant: "body2",
                              fontWeight: 500,
                              color: "secondary.main",
                            }}
                            secondaryTypographyProps={{
                              variant: "body1",
                              fontWeight: "medium",
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CalendarTodayIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Date of Birth"
                            secondary={profile?.NgaySinh || "Not provided"}
                            primaryTypographyProps={{
                              variant: "body2",
                              fontWeight: 500,
                              color: "secondary.main",
                            }}
                            secondaryTypographyProps={{
                              variant: "body1",
                              fontWeight: "medium",
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <PersonIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Gender"
                            secondary={profile?.GioiTinh || "Not provided"}
                            primaryTypographyProps={{
                              variant: "body2",
                              fontWeight: 500,
                              color: "secondary.main",
                            }}
                            secondaryTypographyProps={{
                              variant: "body1",
                              fontWeight: "medium",
                            }}
                          />
                        </ListItem>

                        <ListItem>
                          <ListItemIcon>
                            <HomeIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Address"
                            secondary={profile?.DiaChi || "Not provided"}
                            primaryTypographyProps={{
                              variant: "body2",
                              fontWeight: 500,
                              color: "secondary.main",
                            }}
                            secondaryTypographyProps={{
                              variant: "body1",
                              fontWeight: "medium",
                            }}
                          />
                        </ListItem>
                      </List>
                    </Grid2>

                    {/* Right Column */}
                    <Grid2 item xs={12} md={6}>
                      {/* Second set of list items */}

                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Role"
                          secondary="Teacher"
                          primaryTypographyProps={{
                            variant: "body2",
                            fontWeight: 500,
                            color: "secondary.main",
                          }}
                          secondaryTypographyProps={{
                            variant: "body1",
                            fontWeight: "medium",
                          }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <ApartmentIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Faculty"
                          secondary={profile?.KhoaID?.TenKhoa || "Not provided"}
                          primaryTypographyProps={{
                            variant: "body2",
                            fontWeight: 500,
                            color: "secondary.main",
                          }}
                          secondaryTypographyProps={{
                            variant: "body1",
                            fontWeight: "medium",
                          }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PersonIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Personal ID"
                          secondary={profile?.CCCD || "Not provided"}
                          primaryTypographyProps={{
                            variant: "body2",
                            fontWeight: 500,
                            color: "secondary.main",
                          }}
                          secondaryTypographyProps={{
                            variant: "body1",
                            fontWeight: "medium",
                          }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <HistoryEduIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Academic"
                          secondary={profile?.TrinhDo || "Not provided"}
                          primaryTypographyProps={{
                            variant: "body2",
                            fontWeight: 500,
                            color: "secondary.main",
                          }}
                          secondaryTypographyProps={{
                            variant: "body1",
                            fontWeight: "medium",
                          }}
                        />
                      </ListItem>
                    </Grid2>
                  </Grid2>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 3,
                    }}
                  >
                    {/* <Button
                      variant="contained"
                      color="primary"
                      startIcon={<EditIcon />}
                    >
                      Edit Profile
                    </Button> */}
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>
        </Box>
      </Box>
    </Page>
  );
}