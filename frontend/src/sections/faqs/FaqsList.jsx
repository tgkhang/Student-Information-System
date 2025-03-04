// @mui
import { Accordion, Typography, AccordionSummary, AccordionDetails } from "@mui/material";
// components
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

// Example mock FAQ list
const faqs = [
  { id: 1, heading: "What is a Student Information System (SIS)?", detail: "An SIS is a software application that helps educational institutions manage student data, including enrollment, grades, attendance, and more." },
  { id: 2, heading: "How do I log in to the Student Information System?", detail: "You can log in using your student ID and password provided by your institution. If you have trouble, contact the IT support team." },
  { id: 3, heading: "What should I do if I forget my password?", detail: "Use the 'Forgot Password' option on the login page or contact the system administrator to reset your password." },
  { id: 4, heading: "How can I update my personal information in the SIS?", detail: "You can update some details like contact information in your profile settings. For major changes like name or address, contact the registrar’s office." },
  { id: 5, heading: "How do I check my grades?", detail: "Log in to the SIS and navigate to the 'Grades' or 'Academic Records' section to view your current and past grades." },
  { id: 6, heading: "Can I register for courses through the SIS?", detail: "Yes, most SIS platforms allow students to register for courses online during the enrollment period." },
  { id: 7, heading: "How do I drop or withdraw from a course?", detail: "You can drop courses through the SIS before the deadline. If the deadline has passed, you may need to submit a request to the academic office." },
  { id: 8, heading: "How can I check my class schedule?", detail: "Your class schedule is available under the 'Schedule' or 'Timetable' section in the SIS." },
  { id: 9, heading: "Does the SIS provide attendance records?", detail: "Yes, you can usually check your attendance records under the 'Attendance' section. Some institutions also send alerts for excessive absences." },
  { id: 10, heading: "How do I request an official transcript?", detail: "You can request official transcripts through the SIS or by visiting the registrar’s office. Some systems allow digital transcript downloads." },
  { id: 11, heading: "Can I see my financial aid status in the SIS?", detail: "Yes, most SIS platforms have a 'Financial Aid' section where you can check your application status and awarded funds." },
  { id: 12, heading: "Where can I find my tuition fee details?", detail: "Your tuition and fee details are available in the 'Billing' or 'Financials' section of the SIS." },
  { id: 13, heading: "How do I contact my professors through the SIS?", detail: "Many SIS platforms include a messaging feature or provide faculty contact details in the 'Course Information' section." },
  { id: 14, heading: "Can I access past coursework and assignments?", detail: "Yes, past coursework and assignments may be available in the 'Course Materials' or 'Grades' section of the SIS." },
  { id: 15, heading: "Is there a mobile app for the SIS?", detail: "Some institutions provide a mobile app version of the SIS, which you can download from the App Store or Google Play." },
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
