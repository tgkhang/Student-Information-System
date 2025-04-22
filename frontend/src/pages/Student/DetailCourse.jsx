import { useEffect, useState } from 'react';
import CourseSection from '../../sections/dashboard/CourseSection';
import Page from '../../components/Page';
import { useParams } from 'react-router-dom';
import { getCourseById } from "../../utils/api";

export default function DetailCourse() {
  const { id } = useParams();
    const [course, setCourse] = useState(null);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourseById(id);
        setCourse(response.data);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
    fetchCourse();
  }
  , [id]); // Fetch course data when component mounts or id changes
    return (
      <Page title="Course Details">
        
        <CourseSection course={course} 
        />
      </Page>
    );
  }