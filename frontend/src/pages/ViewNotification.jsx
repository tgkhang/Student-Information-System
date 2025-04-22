import { Box, Typography, Paper, Stack, Chip, Divider } from "@mui/material";
import Page from "../components/Page";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNotificationByIdApi } from "../utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function ViewNotification() {
  const { id } = useParams();
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        setLoading(true);
        const response = await getNotificationByIdApi(id);
        setNotification(response.data);
      } catch (error) {
        console.error("Error fetching notification:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotification();
  }, [id]);

  const formattedTime = notification?.NgayTao
    ? new Date(notification.NgayTao).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const timeAgo = notification?.NgayTao
    ? dayjs(notification.NgayTao).fromNow()
    : "";

  return (
    <Page title="View Notifications">
      <Box maxWidth={800} mx="auto" mt="64px" p={2}>
        <Typography 
          variant="h4" 
          fontWeight={700} 
          gutterBottom 
          sx={{ 
            mb: 3, mt: 2,
            textAlign: "center",
            color: "primary.main"
          }}
        >
          Notification Details
        </Typography>

        <Paper 
          elevation={4} 
          sx={{ 
            p: 4, 
            borderRadius: 2,
            backgroundColor: "primary.lighter"
          }}
        >
          {loading ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography>Loading notification...</Typography>
            </Box>
          ) : notification ? (
            <Stack spacing={3}>
              {/* Time ago chip displayed at the top */}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Chip 
                  label={`Posted ${timeAgo}`} 
                  color="primary" 
                  size="small" 
                  variant="outlined"
                />
              </Box>
              
              {/* Title section */}
              <Box>
                <Typography variant="body1" color="secondary.main" gutterBottom>
                  Title
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    fontWeight: 600, 
                    p: 2, 
                    backgroundColor: "rgba(0,0,0,0.02)", 
                    borderRadius: 1
                  }}
                >
                  {notification?.TenThongBao || ""}
                </Typography>
              </Box>
              
              <Divider />
              
              {/* Content section */}
              <Box>
                <Typography variant="body1" color="secondary.main" gutterBottom>
                  Content
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    p: 2, 
                    backgroundColor: "rgba(0,0,0,0.02)", 
                    borderRadius: 1,
                    minHeight: "150px",
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {notification?.NoiDung || ""}
                </Typography>
              </Box>
              
              <Divider />
              
              {/* Timestamp section */}
              <Box>
                <Typography variant="body1" color="secondary.main" gutterBottom>
                  Created At
                </Typography>
                <Typography variant="body1">
                  {formattedTime}
                </Typography>
              </Box>
            </Stack>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Typography color="error" sx={{fontStyle: "italic", fontWeight: 500}}>
                Failed to load notification or notification not found.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Page>
  );
}