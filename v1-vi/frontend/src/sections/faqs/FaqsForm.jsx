import { motion } from "framer-motion";
import { Button, Typography, TextField, Stack } from "@mui/material";

export default function FaqsForm() {
  return (
    <Stack spacing={3} component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Typography variant="h4">Have not found the right help?</Typography>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <TextField fullWidth label="Name" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
        <TextField fullWidth label="Email" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <TextField fullWidth label="Subject" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
        <TextField fullWidth label="Enter your message here." multiline rows={4} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
        <Button size="large" variant="contained">
          Submit Now
        </Button>
      </motion.div>
    </Stack>
  );
}
