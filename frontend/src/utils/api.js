import axiosInstance from "./axios";

// authentication
export const loginApi = (data) => axiosInstance.post("/auth/login", data);
export const registerApi = (data) => axiosInstance.post("/auth/register", data);

//admin
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
