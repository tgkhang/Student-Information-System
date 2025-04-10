import { useNavigate } from "react-router-dom";
import { Paper, Popper, List, ListItem, ListItemButton, ListItemText } from "@mui/material";

const menuItems = [
  { label: "Profile", path: "/student/dashboard" },
  { label: "Calendar", path: "/student/calendar" },
  { label: "Academic Results", path: "/student/dashboard" },
  { label: "Subject Scores", path: "/student/dashboard" },
  { label: "Log Out", path: "/" },
];

export default function ProfileMenu({ user, anchorEl, open, onClose }) {
  const navigate = useNavigate();

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      disablePortal
      modifiers={[
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ]}
      sx={{ zIndex: 1201 }}
    >
      <Paper sx={{ width: "20rem", p: 1, boxShadow: 3, borderRadius: 0 }}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  onClose();
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Popper>
  );
}