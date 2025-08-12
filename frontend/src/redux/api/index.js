import axios from "axios";
const API = axios.create({
  baseURL: "https://test-app-server-pcz9.onrender.com/api/v1",
});
API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

// AUTH
export const signIn = (newUser) => API.post("/auth/signIn/", newUser);
export const signUp = (newUser) => API.post("/auth/signUp/", newUser);

// USER
export const getAuthor = () => API.get("/auth/");
export const getAuthorById = (id) => API.get(`/auth/${id}`);

// ALL QUESTIONS
export const fetchAllQuestion = (id) => API.get(`/questions/${id}`);

// TEST
export const createTest = (newTest) => API.post("/test/", newTest);
export const fetchTest = () => API.get("/test");
export const fetchTestByID = (id) => API.get(`/test/${id}`);
export const deleteTestById = (id) => API.delete(`/test/${id}`);
export const updateTestById = (id, updatedTest) =>
  API.put(`/test/${id}`, updatedTest);

// CATEGORY QUESTIONS
export const fetchCategoryQuestion = () => API.get("/category-questions");
export const fetchCategoryQuestionByID = (id) =>
  API.get(`/category-questions/${id}`);
export const createCategoryQuestion = (newQuestion) =>
  API.post("/category-questions/", newQuestion);
export const deleteCategoryQuestionById = (id) =>
  API.delete(`/category-questions/${id}`);
export const updateCategoryQuestionById = (id, updatedQuestion) =>
  API.put(`/category-questions/${id}`, updatedQuestion);

// CLOZE QUESTIONS
export const fetchClozeQuestion = () => API.get("/cloze-questions");
export const fetchClozeQuestionByID = (id) => API.get(`/cloze-questions/${id}`);
export const createClozeQuestion = (newQuestion) =>
  API.post("/cloze-questions/", newQuestion);
export const deleteClozeQuestionById = (id) =>
  API.delete(`/cloze-questions/${id}`);
export const updateClozeQuestionById = (id, updatedQuestion) =>
  API.put(`/cloze-questions/${id}`, updatedQuestion);

// PASSAGE QUESTIONS
export const fetchPassageQuestion = () => API.get("/passage-questions");
export const fetchPassageQuestionByID = (id) =>
  API.get(`/passage-questions/${id}`);
export const createPassageQuestion = (newQuestion) =>
  API.post("/passage-questions/", newQuestion);
export const deletePassageQuestionById = (id) =>
  API.delete(`/passage-questions/${id}`);
export const updatePassageQuestionById = (id, updatedQuestion) =>
  API.put(`/passage-questions/${id}`, updatedQuestion);
