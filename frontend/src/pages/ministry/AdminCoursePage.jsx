import { useState, useEffect, useMemo, useCallback } from "react";
import Page from "../../components/Page";
import {
  Typography,
  Button,
  Container,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Stack,
  CircularProgress,
  Alert,
  Pagination,
} from "@mui/material";
import Iconify from "../../components/Iconify";
import exportToExcel from "../../utils/exportToExcel";
import { getCoursesListApi, searchCourseApi } from "../../utils/api";
import { CourseCard, formatDate } from "../../components/CourseList";

// Years for filter
const years = ["2022", "2023", "2024", "2025", "2026", "2027"];

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

  // Format course data for display
  const formatCourseData = useCallback((courseData) => {
    if (!courseData) return null;
    try {
      return {
        id: courseData.MaKhoaHoc || "",
        name: courseData.TenKhoaHoc || "",
        instructor: courseData.GiangVienID?.HoTen || "Unknown",
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
      };
    } catch (err) {
      console.error("Error formatting course data:", err);
      return null;
    }
  }, []);

  const fetchCourses = useCallback(async (
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
      //console.log("API response:", response);
      if (
        response?.data &&
        response.data?.data &&
        Array.isArray(response.data.data)
      ) {
        // Update total records and pages for pagination
        setTotalRecords(response.data.total || 0);
        const newTotalPages = Math.max(1, Math.ceil((response.data.total || 0) / size));
        setTotalPages(newTotalPages);

        const formattedCourses = response.data.data
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
      setError(`Không thể tải dữ liệu khóa học: ${err.message || "Unknown error"}`);
      setCourses([]);
      setTotalPages(1);
      setTotalRecords(0);
    } finally {
      setLoading(false);
      setInitialLoading(false);
      setIsFetching(false);
    }
  }, [pageNumber, pageSize, sortBy, sortOrder, formatCourseData, isFetching]);

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
      
      if (response?.data && Array.isArray(response.data)) {
        const formattedResults = response.data
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
        setError(`Lỗi tìm kiếm: ${err.response?.data?.message || err.message || "Unknown error"}`);
      }
    } finally {
      setLoading(false);
      setIsFetching(false);
    }
  }, [searchTerm, pageSize, sortBy, sortOrder, formatCourseData, fetchCourses, isFetching]);

  // Initial data fetch
  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle page change
  const handlePageChange = useCallback((event, value) => {
    // Prevent page change if another request is in progress
    if (isFetching) return;
    setPageNumber(value);
    if (!isSearchActive) {
      fetchCourses(value, pageSize, sortBy, sortOrder);
    }
  }, [isSearchActive, pageSize, sortBy, sortOrder, fetchCourses, isFetching]);

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
        displayList = displayList.filter((course) => 
          course && course.year === filterYear
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
  }, [courses, searchResults, isSearchActive, filterYear, pageNumber, pageSize]);

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
    <Page title="Admin Course Page">
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Box sx={{ my: 4 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4" gutterBottom>
              Danh sách khóa học {isSearchActive && "- Kết quả tìm kiếm"}
            </Typography>
            <Button
              color="success"
              variant="contained"
              disabled={!displayedCourses || displayedCourses.length === 0 || loading}
              onClick={() =>
                exportToExcel(
                  [
                    "Mã khóa học",
                    "Tên khóa học",
                    "Giảng viên",
                    "Số tín chỉ",
                    "Sinh viên đăng ký",
                    "Sinh viên tối đa",
                    "Ngày bắt đầu",
                    "Ngày kết thúc",
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
              Xuất Excel
            </Button>
          </Stack>

          <Box sx={{ mb: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tìm kiếm theo tên hoặc mã khóa học"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Nhập tên hoặc mã khóa học"
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
                  <InputLabel>Năm</InputLabel>
                  <Select
                    value={filterYear}
                    label="Năm"
                    onChange={handleYearChange}
                    disabled={loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  >
                    <MenuItem value="">Tất cả</MenuItem>
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
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Tìm kiếm"
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