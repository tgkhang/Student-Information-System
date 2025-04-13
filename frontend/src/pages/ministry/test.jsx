import { useState, useEffect, useMemo } from "react";
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
// components
import Page from "../../components/Page";
import Iconify from "../../components/Iconify";
import exportToExcel from "../../utils/exportToExcel";
import { getCoursesListApi, searchCourseApi } from "../../utils/api";
import { CourseCard, formatDate } from "../../components/CourseList";

// Years for filter
const years = ["2024", "2025", "2026", "2027"];

export default function AdminCoursePage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting state
  const [sortBy, setSortBy] = useState("MaKhoaHoc");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");

  // Search state
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Format course data for display
  const formatCourseData = (courseData) => {
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
      year: new Date(courseData.NgayBatDau || new Date()).getFullYear().toString(),
    };
  };

  const fetchCourses = async (
    page = pageNumber,
    size = pageSize,
    sort = sortBy,
    order = sortOrder
  ) => {
    try {
      setLoading(true);
      setError(null);
      setIsSearchActive(false);
      
      const response = await getCoursesListApi({
        pageSize: size,
        pageNumber: page,
        sortBy: sort,
        sortOrder: order,
      });
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setTotalRecords(response.data.total || 0);
        setTotalPages(Math.ceil((response.data.total || 0) / size));
        
        const formattedCourses = response.data.data.map(formatCourseData);
        setCourses(formattedCourses);
      } else {
        setError("API response format is unexpected");
        setCourses([]);
      }
    } catch (err) {
      console.error("Error fetching course data:", err);
      setError(`Không thể tải dữ liệu khóa học: ${err.message}`);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = async () => {
    // If search term is empty, revert to regular listing
    if (!searchTerm.trim()) {
      setIsSearchActive(false);
      return fetchCourses(1, pageSize, sortBy, sortOrder);
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await searchCourseApi(searchTerm);
      
      if (response.data && Array.isArray(response.data)) {
        const formattedResults = response.data.map(formatCourseData);
        setSearchResults(formattedResults);
        setIsSearchActive(true);
        setTotalRecords(formattedResults.length);
        setTotalPages(Math.ceil(formattedResults.length / pageSize));
      } else {
        setError("Không tìm thấy khóa học phù hợp");
        setSearchResults([]);
        setIsSearchActive(true);
      }
    } catch (err) {
      console.error("Error searching courses:", err);
      setError(`Không thể tìm kiếm: ${err.response?.data?.message || err.message}`);
      setSearchResults([]);
      setIsSearchActive(true);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPageNumber(value);
    
    // If in search mode, we handle pagination on client side
    if (isSearchActive) {
      // No need to fetch from API again, just update the page
    } else {
      fetchCourses(value, pageSize, sortBy, sortOrder);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setFilterYear("");
    setIsSearchActive(false);
    setSearchResults([]);
    setPageNumber(1);
    fetchCourses(1, pageSize, sortBy, sortOrder);
  };

  // Handle filter year change
  const handleYearChange = (e) => {
    setFilterYear(e.target.value);
  };

  // Get displayed courses based on search status and filters
  const displayedCourses = useMemo(() => {
    let displayList = isSearchActive ? searchResults : courses;
    
    // Apply year filter
    if (filterYear) {
      displayList = displayList.filter(course => course.year === filterYear);
    }
    
    // Handle local pagination for search results
    if (isSearchActive) {
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return displayList.slice(startIndex, endIndex);
    }
    
    return displayList;
  }, [courses, searchResults, isSearchActive, filterYear, pageNumber, pageSize]);

  // Update total pages when filter changes
  useEffect(() => {
    if (isSearchActive) {
      let filteredResults = searchResults;
      if (filterYear) {
        filteredResults = searchResults.filter(course => course.year === filterYear);
      }
      setTotalPages(Math.ceil(filteredResults.length / pageSize));
      setTotalRecords(filteredResults.length);
      
      // Reset to first page if current page would be out of bounds
      const newTotalPages = Math.ceil(filteredResults.length / pageSize);
      if (pageNumber > newTotalPages && newTotalPages > 0) {
        setPageNumber(1);
      }
    }
  }, [filterYear, searchResults, isSearchActive, pageSize]);

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
              disabled={displayedCourses.length === 0}
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
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
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
                  >
                    Tìm kiếm
                  </Button>
                  {(isSearchActive || filterYear) && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleClearSearch}
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
                <Button color="inherit" size="small" onClick={handleClearSearch}>
                  Quay lại
                </Button>
              }
            >
              {searchResults.length > 0 
                ? `Tìm thấy ${totalRecords} khóa học cho "${searchTerm}"`
                : `Không tìm thấy khóa học nào cho "${searchTerm}"`}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              {displayedCourses.length > 0 ? (
                <Grid container spacing={2}>
                  {displayedCourses.map((course) => (
                    <Grid item xs={12} key={course.id}>
                      <CourseCard course={course} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    Không tìm thấy khóa học phù hợp với tiêu chí của bạn.
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={totalPages}
                page={pageNumber}
                onChange={handlePageChange}
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