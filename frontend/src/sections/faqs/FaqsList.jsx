// @mui
import { Accordion, Typography, AccordionSummary, AccordionDetails } from "@mui/material";
// components
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

// Example mock FAQ list
const faqs = [
  { id: 1, heading: "What is your return policy?", detail: "You can return any item within 30 days of purchase." },
  { id: 2, heading: "Do you offer international shipping?", detail: "Yes, we ship worldwide. Delivery times vary by location." },
  { id: 3, heading: "How can I track my order?", detail: "You will receive a tracking link via email once your order ships." },
  { id: 4, heading: "What payment methods do you accept?", detail: "We accept Visa, MasterCard, PayPal, and Apple Pay." },
  { id: 5, heading: "Can I change or cancel my order?", detail: "Orders can be modified or canceled within 24 hours of placement." },
];

export default function FaqsList() {
  return (
    <>
      {faqs.map((accordion) => (
        <Accordion key={accordion.id}>
          <AccordionSummary
            expandIcon={<Iconify icon={"eva:arrow-ios-downward-fill"} width={20} height={20} />}
          >
            <Typography variant="subtitle1">{accordion.heading}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{accordion.detail}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}
