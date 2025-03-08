import { useState } from "react";
// @mui
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
  Backdrop,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
// Components
import Page from "../components/Page";
import PhoneIcon from "@mui/icons-material/Phone";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EmailIcon from "@mui/icons-material/Email";

const teamMembers = [
  {
    name: "Lâm Tiến Huy",
    role: "CEO",
    img: "https://source.unsplash.com/100x100/?man",
    email: "example@gmail.com",
    phone: "0123-456-789",
    university: "Đại học Bách Khoa",
    major: "Khoa học Máy tính",
    bio: "Lãnh đạo với tầm nhìn chiến lược, giúp công ty phát triển mạnh mẽ trong lĩnh vực công nghệ.",
  },
  {
    name: "Kha Vĩnh Thuận",
    role: "CTO",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Pig_farm_Vampula_1.jpg/330px-Pig_farm_Vampula_1.jpg",
    email: "example@gmail.com",
    phone: "0987-654-321",
    university: "Đại học Khoa học Tự nhiên",
    major: "Công nghệ Phần mềm",
    bio: "Chuyên gia phát triển hệ thống với hơn 10 năm kinh nghiệm trong ngành công nghệ.",
  },
  {
    name: "Nguyễn Trọng Nhân",
    role: "Lead Designer",
    img: "https://source.unsplash.com/100x100/?designer",
    email: "example@gmail.com",
    phone: "0345-678-901",
    university: "Đại học Mỹ thuật",
    major: "Thiết kế Đồ họa",
    bio: "Đam mê sáng tạo và thiết kế giao diện người dùng đẹp mắt, hiện đại.",
  },
  {
    name: "Trần Gia Khang",
    role: "Marketing Manager",
    img: "https://source.unsplash.com/100x100/?marketing",
    email: "example@gmail.com",
    phone: "0567-890-123",
    university: "Đại học Kinh tế Quốc dân",
    major: "Marketing",
    bio: "Dẫn dắt chiến lược tiếp thị và xây dựng thương hiệu mạnh mẽ.",
  },
  {
    name: "Phạm Thị Mỹ Hạnh",
    role: "HR Manager",
    img: "https://source.unsplash.com/100x100/?woman",
    email: "example@gmail.com",
    phone: "0678-901-234",
    university: "Đại học Lao động Xã hội",
    major: "Quản trị Nhân sự",
    bio: "Chuyên gia quản lý nhân sự, giúp đội ngũ phát triển bền vững.",
  },
];

export default function AboutUs() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <Page title="About Us">
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Section: Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            textAlign="center"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            About Us
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            We are a passionate team dedicated to delivering outstanding digital
            solutions that drive real impact.
          </Typography>
        </motion.div>
        <Grid container spacing={5} sx={{ mt: 5 }}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://source.unsplash.com/600x400/?team,office"
                alt="Our Mission"
                style={{ width: "100%", borderRadius: 16 }}
              />
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6} display="flex" alignItems="center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Our mission is to innovate and create digital products that help
                businesses grow. We focus on user experience, cutting-edge
                technology, and impactful solutions.
              </Typography>
            </motion.div>
          </Grid>
        </Grid>
        {/* Section: Meet Our Team */}
        <Typography
          variant="h3"
          textAlign="center"
          fontWeight="bold"
          sx={{ mt: 10, mb: 5 }}
        >
          Meet Our Team
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                {/* Card */}
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    p: 3,
                    borderRadius: 3,
                    boxShadow: 3,
                    height: "100%",
                    position: "relative",
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  <Avatar
                    src={member.img}
                    sx={{ width: 80, height: 80, mb: 2 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.role}
                    </Typography>
                  </CardContent>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mt: 2 }}
                    onClick={() => setSelectedMember(member)}
                  >
                    Click to View Detail
                  </Button>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Hover Info Box - Centered */}
      <AnimatePresence>
        {selectedMember && (
          <>
            {/* Backdrop */}
            <Backdrop
              open
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => setSelectedMember(null)}
            >
              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                style={{
                  width: "350px",
                  background: "#fff",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                  borderRadius: "10px",
                  padding: "20px",
                  zIndex: 20,
                  textAlign: "center",
                }}
                onClick={(e) => e.stopPropagation()} // Ngăn click đóng khi bấm vào card
              >
                <Avatar
                  src={selectedMember.img}
                  sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
                />
                <Typography variant="h5" fontWeight="bold">
                  {selectedMember.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {selectedMember.role}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 1,
                  }}
                >
                  <PhoneIcon fontSize="small" /> {selectedMember.phone}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 1,
                  }}
                >
                  <EmailIcon fontSize="small" /> {selectedMember.email}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 1,
                  }}
                >
                  <SchoolIcon fontSize="small" /> {selectedMember.university}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    gap: 1,
                  }}
                >
                  <MenuBookIcon fontSize="small" /> {selectedMember.major}
                </Typography>
                
                <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
                  {selectedMember.bio}
                </Typography>
              </motion.div>
            </Backdrop>
          </>
        )}
      </AnimatePresence>
    </Page>
  );
}
