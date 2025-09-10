import { Box, Typography, Badge } from "@mui/material";

export default function NotificationList({notifications, role, markAsRead}) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {notifications.map((notif) => (
        <Box
          key={notif._id}
          onMouseEnter={() => markAsRead(notif._id)}
          onClick={() => window.location.href = `/${role}/notification/${notif.thongBaoId?._id}`}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5em",
            p: 2,
            cursor: "pointer",
            "&:hover": { bgcolor: "grey.200" }
          }}
        >
          <Badge
            variant="dot"
            sx={{
              "& .MuiBadge-dot": {
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: notif?.isRead ? "gray" : "primary.main",
              },
            }}
          />

          {/* Notification Content */}
          <Typography 
            variant="notification"
            sx={{ flex: 1, fontWeight: notif.isRead ? "normal" : "bold" }}
          >
            {notif?.thongBaoId?.TenThongBao}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}