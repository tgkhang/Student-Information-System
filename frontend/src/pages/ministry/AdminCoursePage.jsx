import { useState, useEffect, useMemo, useCallback } from "react";
import Page from "../../components/Page";
import {
  Typography,
  Button,
  Container,
  Box,
  TextField,
  Select,
  Card,
  CardContent,
  Chip,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Stack,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import ClassIcon from "@mui/icons-material/Class";
import Iconify from "../../components/Iconify";
import exportToExcel from "../../utils/exportToExcel";
import { getCoursesListApi, searchCourseApi } from "../../utils/api";
import { formatDate } from "../../components/CourseList";

// CourseCard component: display individual course information
const CourseCard = ({ course, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        mb: 2,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {/* Course ID and Name */}
          <Box>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: "bold", fontSize: "1rem" }}
            >
              {course?.id} - {course?.name?.toUpperCase()}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Instructor: {course?.instructor}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {course?.description}
          </Typography>

          {/*Course details*/}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            <Chip
              icon={<AccessTimeIcon fontSize="small" />}
              label={`${formatDate(course.startDate)} - ${formatDate(
                course.endDate
              )}`}
              size="small"
              sx={{ bgcolor: "#f0f7ff", color: "#0057b7" }}
            />
            <Chip
              icon={<PersonIcon fontSize="small" />}
              label={course?.assistantName || "No Assistant"}
              size="small"
              sx={{ bgcolor: "#f5f5f5" }}
            />
            <Chip
              icon={<PeopleIcon fontSize="small" />}
              label={`${course.registeredStudents}/${course.maxStudents} Students`}
              size="small"
              sx={{ bgcolor: "#f5f5f5" }}
            />
            <Chip
              icon={<ClassIcon fontSize="small" />}
              label={`${course.credits} Credits`}
              size="small"
              sx={{ bgcolor: "#f5f5f5" }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Years for filter
const years = [
  "K18", "K19", "K20",
  "K21", "K22", "K23", "K24",
  "K25",
];

export default function AdminCoursePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting state
  const [sortBy, setSortBy] = useState("CourseId");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // Search state
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Request state
  const [isFetching, setIsFetching] = useState(false);

  const formatCourseData = useCallback((courseData) => {
    if (!courseData) return null;
    try {
      const instructorName =
        Array.isArray(courseData.GiangVienID) &&
        courseData.GiangVienID.length > 0
          ? courseData.GiangVienID[0]?.HoTen || "Unknown"
          : typeof courseData.GiangVienID === "object" &&
            courseData.GiangVienID !== null
          ? courseData.GiangVienID.HoTen || "Unknown"
          : "Unknown";

      return {
        id: courseData.MaKhoaHoc || "",
        name: courseData.TenKhoaHoc || "",
        instructor: instructorName,
        assistantId: courseData.TroGiangID || "",
        assistantName: courseData.TroGiangID?.HoTen || "No Assistant",
        credits: courseData.SoTinChi || 0,
        description: courseData.MoTa || "No description available",
        registeredStudents: courseData.SoLuongSinhVienDangKy || 0,
        maxStudents: courseData.SoLuongToiDa || 0,
        registrationDeadline: courseData.HanDangKy || "",
        startDate: courseData.NgayBatDau || "",
        endDate: courseData.NgayKetThuc || "",
        departmentId: courseData.KhoaID || "",
        year: courseData.NgayBatDau
          ? new Date(courseData.NgayBatDau).getFullYear().toString()
          : new Date().getFullYear().toString(),
        schedule: Array.isArray(courseData.LichHoc) ? courseData.LichHoc : [],
        // Add deadlines info
        deadlines: Array.isArray(courseData.Deadlines)
          ? courseData.Deadlines
          : [],
      };
    } catch (err) {
      console.error("Error formatting course data:", err);
      return null;
    }
  }, []);

  const fetchCourses = useCallback(
    async (
      page = pageNumber,
      size = pageSize,
      sort = sortBy,
      order = sortOrder
    ) => {
      // Prevent multiple simultaneous requests
      if (isFetching) {
        console.log("Request already in progress, skipping");
        return;
      }

      try {
        setIsFetching(true);
        setLoading(true);
        setError(null);

        const response = await getCoursesListApi({
          pageSize: size,
          pageNumber: page,
          sortBy: sort,
          sortOrder: order,
        });
        //console.log("API response:", response.data);

        // Handle different response formats - direct array or paginated data object
        if (response?.data) {
          let responseData = response.data;
          let totalItems = 0;
          let dataArray = [];

          // Check if response is an array directly
          if (Array.isArray(responseData)) {
            dataArray = responseData;
            totalItems = responseData.length;
          }
          // Check if response is a paginated data object
          else if (responseData?.data && Array.isArray(responseData.data)) {
            dataArray = responseData.data;
            totalItems = responseData.total || dataArray.length;
          }
          // Handle single object response
          else if (typeof responseData === "object" && responseData !== null) {
            dataArray = [responseData];
            totalItems = 1;
          }

          // Update total records and pages for pagination
          setTotalRecords(totalItems);
          const newTotalPages = Math.max(1, Math.ceil(totalItems / size));
          setTotalPages(newTotalPages);

          const formattedCourses = dataArray
            .map(formatCourseData)
            .filter(Boolean); // Remove any null results

          setCourses(formattedCourses);
          setIsSearchActive(false);
          setError(null);
        } else {
          setError("API response format is unexpected");
          setCourses([]);
          setTotalPages(1);
          setTotalRecords(0);
        }
      } catch (err) {
        console.error("Error fetching course data:", err);
        setError(
          `Error fetching course data: ${err.message || "Unknown error"}`
        );
        setCourses([]);
        setTotalPages(1);
        setTotalRecords(0);
      } finally {
        setLoading(false);
        setInitialLoading(false);
        setIsFetching(false);
      }
    },
    [pageNumber, pageSize, sortBy, sortOrder, formatCourseData, isFetching]
  );

  const handleSearch = useCallback(async () => {
    // Prevent searching while another request is in progress
    if (isFetching) {
      console.log("Request already in progress, skipping search");
      return;
    }

    if (!searchTerm || !searchTerm.trim()) {
      setIsSearchActive(false);
      return fetchCourses(1, pageSize, sortBy, sortOrder);
    }

    try {
      setIsFetching(true);
      setLoading(true);
      setError(null);

      const trimmedSearchTerm = searchTerm.trim();
      const response = await searchCourseApi(trimmedSearchTerm);

      // Handle different response formats
      if (response?.data) {
        let dataArray = [];

        if (Array.isArray(response.data)) {
          dataArray = response.data;
        } else if (
          typeof response.data === "object" &&
          response.data !== null
        ) {
          if (response.data.data && Array.isArray(response.data.data)) {
            dataArray = response.data.data;
          } else {
            // Single object response
            dataArray = [response.data];
          }
        }

        const formattedResults = dataArray
          .map(formatCourseData)
          .filter(Boolean); // Remove any null results

        setSearchResults(formattedResults);
        setIsSearchActive(true);

        const filteredCount = formattedResults.length;
        setTotalRecords(filteredCount);

        const newTotalPages = Math.max(1, Math.ceil(filteredCount / pageSize));
        setTotalPages(newTotalPages);
        setPageNumber(1); // Reset to first page on new search
      } else {
        setSearchResults([]);
        setIsSearchActive(true);
        setTotalRecords(0);
        setTotalPages(1);
        setPageNumber(1);
      }
    } catch (err) {
      console.error("Error searching courses:", err);
      if (err.response?.status === 404) {
        setSearchResults([]);
        setIsSearchActive(true);
        setTotalRecords(0);
        setTotalPages(1);
        setPageNumber(1);
      } else {
        setError(
          `Error searching courses: ${
            err.response?.data?.message || err.message || "Unknown error"
          }`
        );
      }
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [
    searchTerm,
    pageSize,
    sortBy,
    sortOrder,
    formatCourseData,
    fetchCourses,
    isFetching,
  ]);

  // Initial data fetch
  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle page change
  const handlePageChange = useCallback(
    (event, value) => {
      // Prevent page change if another request is in progress
      if (isFetching) return;
      setPageNumber(value);
      if (!isSearchActive) {
        fetchCourses(value, pageSize, sortBy, sortOrder);
      }
    },
    [isSearchActive, pageSize, sortBy, sortOrder, fetchCourses, isFetching]
  );

  // Handle year filter change
  const handleYearChange = useCallback((e) => {
    setFilterYear(e.target.value);
  }, []);

  // Handle clear search and filters
  const handleClearSearch = useCallback(() => {
    if (isFetching) return;
    setSearchTerm("");
    setFilterYear("");
    setIsSearchActive(false);
    setSearchResults([]);
    setPageNumber(1);
    fetchCourses(1, pageSize, sortBy, sortOrder);
  }, [pageSize, sortBy, sortOrder, fetchCourses, isFetching]);

  // Get displayed courses based on search status and filters
  const displayedCourses = useMemo(() => {
    try {
      let displayList = isSearchActive ? searchResults : courses;

      if (!Array.isArray(displayList)) {
        return [];
      }
      if (filterYear) {
        displayList = displayList.filter(
          (course) => course && course.year === filterYear
        );
      }
      if (isSearchActive) {
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return displayList.slice(startIndex, endIndex);
      }
      return displayList;
    } catch (err) {
      console.error("Error in displayedCourses:", err);
      return [];
    }
  }, [
    courses,
    searchResults,
    isSearchActive,
    filterYear,
    pageNumber,
    pageSize,
  ]);

  // Update total pages when filter changes for search results
  useEffect(() => {
    if (isSearchActive && searchResults) {
      try {
        let filteredResults = searchResults;

        if (filterYear) {
          filteredResults = filteredResults.filter(
            (course) => course && course.year === filterYear
          );
        }

        const filteredCount = filteredResults.length;
        setTotalRecords(filteredCount);

        const newTotalPages = Math.max(1, Math.ceil(filteredCount / pageSize));
        setTotalPages(newTotalPages);

        // Reset to first page if current page would be out
        if (pageNumber > newTotalPages) {
          setPageNumber(1);
        }
      } catch (err) {
        console.error("Error updating pagination for filtered results:", err);
      }
    }
  }, [filterYear, searchResults, isSearchActive, pageSize, pageNumber]);

  return (
    <Page title="All Courses">
      <Container maxWidth="xl" sx={{ mt: "64px" }}>
        <Box sx={{ p: 2 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              my: 2
            }}
          >
            <Typography variant="h4" gutterBottom
              sx={{color: "primary.main"}}
            >
              All Courses {isSearchActive && "- Search Results"}
            </Typography>
            <Button
              color="success"
              variant="contained"
              disabled={
                !displayedCourses || displayedCourses.length === 0 || loading
              }
              onClick={() =>
                exportToExcel(
                  [
                    "Course ID",
                    "Course Name",
                    "Lecturer",
                    "Credits",
                    "Students Registered",
                    "Max Students",
                    "Start Date",
                    "End Date",
                  ],
                  displayedCourses.map((course) => [
                    course.id,
                    course.name,
                    course.instructor,
                    course.credits,
                    course.registeredStudents,
                    course.maxStudents,
                    formatDate(course.startDate),
                    formatDate(course.endDate),
                  ])
                )
              }
              startIcon={<Iconify icon={"eva:download-fill"} />}
            >
              Export Spreadsheet
            </Button>
          </Stack>

          <Box sx={{ mb: 5 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Name or Course ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Input Name or Course ID"
                  disabled={loading}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !loading) {
                      handleSearch();
                    }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={filterYear}
                    label="Year"
                    onChange={handleYearChange}
                    disabled={loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    {years.map((year) => (
                      <MenuItem key={year} value={year}>
                        {year}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Stack direction="row" spacing={1}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleSearch}
                    disabled={loading}
                    sx={{ height: "4em" }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        <Iconify icon="eva:search-outline" sx={{ mr: 1 }} />
                        Search
                      </>
                    )}
                  </Button>
                  {(isSearchActive || filterYear) && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleClearSearch}
                      disabled={loading}
                    >
                      <Iconify icon={"eva:close-fill"} />
                    </Button>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {isSearchActive && (
            <Alert
              severity="info"
              sx={{ mb: 2 }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={handleClearSearch}
                  disabled={loading}
                >
                  Quay lại
                </Button>
              }
            >
              {searchResults && searchResults.length > 0
                ? `Tìm thấy ${totalRecords} khóa học cho "${searchTerm}"`
                : `Không tìm thấy khóa học nào cho "${searchTerm}"`}
            </Alert>
          )}

          {initialLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                  <CircularProgress size={30} />
                </Box>
              )}

              {!loading && displayedCourses.length > 0 ? (
                <Grid container spacing={2}>
                  {displayedCourses.map((course, index) => (
                    <Grid item xs={12} key={course.id || `course-${index}`}>
                      <CourseCard course={course} />
                    </Grid>
                  ))}
                </Grid>
              ) : !loading ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Không tìm thấy khóa học phù hợp với tiêu chí của bạn.
                  </Typography>
                </Box>
              ) : null}
            </Box>
          )}

          {totalPages > 1 && !loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={pageNumber}
                onChange={handlePageChange}
                disabled={loading}
                variant="outlined"
                shape="rounded"
                color="primary"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 0,
                  },
                }}
              />
            </Box>
          )}
        </Box>
      </Container>
    </Page>
  );
}
