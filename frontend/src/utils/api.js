import axiosInstance from "./axios";

// authentication
export const loginApi = (data) => axiosInstance.post("/auth/login", data);
export const registerApi = (data) => axiosInstance.post("/auth/register", data);

//student
export const getStudentListApi = (params = {}) => {
  const queryParams = {
    pageSize: params.pageSize || 10,
    pageNumber: params.pageNumber || 1,
    sortBy: params.sortBy || "mssv",
    sortOrder: params.sortOrder || "asc",
    ...params,
  };

  return axiosInstance.get("/sinhvien/getList_Student", {
    params: queryParams,
  });
};

export const getStudentByMssvApi = (mssv) => 
  axiosInstance.get(`/sinhvien/get_student/${mssv}`);

export const searchStudentApi = (query) => 
  axiosInstance.get(`/sinhvien/search`, { params: { query } });

export const addStudentApi = (studentData) => 
  axiosInstance.post("/sinhvien/add_student", studentData);

export const updateStudentApi = (mssv, updateData) => 
  axiosInstance.put(`/sinhvien/update_student/${mssv}`, updateData);

export const deleteStudentApi = (mssv) => 
  axiosInstance.delete(`/sinhvien/delete_student/${mssv}`)


//teacher
export const getTeacherInfo = (id) => 
  axiosInstance.get(`/giangvien/getTeacher/${id}`);
export const getListCourses = (id) =>
  axiosInstance.get(`/giangvien/getCourses/${id}`);