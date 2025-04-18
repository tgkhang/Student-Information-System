import { data } from "react-router-dom";
import axiosInstance from "./axios";

// authentication
export const loginApi = (data) => axiosInstance.post("/auth/login", data);
export const registerApi = (data) => axiosInstance.post("/auth/register", data);

//student
export const getStudentListApi = (params = {}) => {
  const queryParams = {
    pageSize:  params.size || 10,
    pageNumber: params.page || 1,
    sortBy:  params.sort || "mssv",
    sortOrder: params.order || "asc",
  };

  return axiosInstance.get("/sinhvien/getList_Student", {
    params: queryParams,
  });
};

export const getStudentByMssvApi = (mssv) => 
  axiosInstance.get(`/sinhvien/get_student/${mssv}`);

export const searchStudentApi = (query) => 
  axiosInstance.get(`/sinhvien/search_student`, { params: { query } });


export const addStudentApi = (studentData) => 
  axiosInstance.post("/sinhvien/add_student", studentData);

export const updateStudentApi = (mssv, updateData) => 
  axiosInstance.put(`/sinhvien/update_student/${mssv}`, updateData);

export const deleteStudentApi = (mssv) => 
  axiosInstance.delete(`/sinhvien/delete_student/${mssv}`);

export const getStudentNoti = () => {axiosInstance.get("/sinhvien/getStudentNoti")};
export const markStudentNotiAsRead = (id) => { axiosInstance.post(`/sinhvien/markNotiAsRead/${id}`) };
//teacher
export const getTeacherInfo = (id) => 
  axiosInstance.get(`/giangvien/getTeacher/${id}`);
export const getListCourses = (id) =>
  axiosInstance.get(`/giangvien/getCourses/${id}`);

export const getTeacherListApi = (params = {}) => {
  const queryParams = {
    pageSize: params.size || 10,
    pageNumber: params.page || 1,
    sortBy: params.sort || "MaGV",
    sortOrder: params.order || "asc",
    ...params,
  };

  return axiosInstance.get("/GiangVien/getListTeacher", {
    params: queryParams,
  });
};

export const getTeacherByIdApi = (id) =>{
  return axiosInstance.get(`/GiangVien/getTeacher/${id}`);
}

export const addTeacherApi = (teacherData) =>{
  return axiosInstance.post("/GiangVien/addTeacher", teacherData);
}

export const searchTeacherApi = (query) =>
  axiosInstance.get(`/GiangVien/searchTeacher`, { params: { query } });

export const getTeacherNoti = () => {axiosInstance.get("/GiangVien/getTeacherNoti")};
export const markTeacherNotiAsRead = (id) => { axiosInstance.post(`/GiangVien/markNotiAsRead/${id}`) };

//FACULTY
export const getFacultyListApi = (params = {}) => {
  const queryParams = {
    pageSize: params.size || 10,
    pageNumber: params.page || 1,
    sortBy: params.sort || "MaGV",
    sortOrder: params.order || "asc",
    ...params,
  };
  return axiosInstance.get("/Khoa/getListFaculty", {
    params: queryParams,
  });
}
//NOTIFICATION 
export const getNotificationListApi = () => {
  return axiosInstance.get("/ThongBao");
};
export const getNotificationByIdApi = (id) => {
  return axiosInstance.get(`/ThongBao/getNotiByID/${id}`);
}
export const createNotificationApi = (data) => {
  return axiosInstance.post("/ThongBao/addNoti", data);
}

//COURSE
export const getCoursesListApi = (params = {}) => {
  const queryParams = {
    pageSize: params.size || 10,
    pageNumber: params.page || 1,
    sortBy: params.sort || "CourseId",
    sortOrder: params.order || "asc",
    ...params,
  };
  return axiosInstance.get("/KhoaHoc/getListCourse", {
    params: queryParams,
  });
}
export const searchCourseApi = (query) =>
  axiosInstance.get(`/KhoaHoc/searchCourse`, { params: { query } });
export const getCourseById = (id) => {
  return axiosInstance.get(`/KhoaHoc/getCourse/${id}`);
}
export const createDeadline = (id, data) => {
  return axiosInstance.post(`/KhoaHoc/${id}/deadline`, data);
}