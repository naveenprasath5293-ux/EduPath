import apiClient from './apiClient';

/**
 * Builds a multipart/form-data payload from a plain course object.
 * requirements/benefits are sent as JSON strings (see
 * server/validators/course.validator.js's parseStringArray, which
 * expects exactly this shape) since FormData can't carry real arrays
 * alongside a file. `thumbnailFile` is optional on update (existing
 * thumbnail is kept if omitted).
 */
function buildCourseFormData(course, thumbnailFile) {
  const formData = new FormData();
  const fields = ['title', 'category', 'level', 'duration', 'price', 'instructor', 'description', 'shortDescription'];

  fields.forEach((field) => {
    if (course[field] !== undefined && course[field] !== null) {
      formData.append(field, course[field]);
    }
  });

  formData.append('requirements', JSON.stringify(course.requirements || []));
  formData.append('benefits', JSON.stringify(course.benefits || []));

  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile);
  }

  return formData;
}

const courseService = {
  // ---- Public ----
  getPublicCourses: (params) => apiClient.get('/courses', { params }).then((res) => res.data),
  getPublicCourseBySlug: (slug) => apiClient.get(`/courses/${slug}`).then((res) => res.data),
  searchCourses: (q, params) => apiClient.get('/courses/search', { params: { q, ...params } }).then((res) => res.data),
  getCategories: () => apiClient.get('/courses/categories').then((res) => res.data),

  // ---- Admin ----
  getAdminCourses: (params) => apiClient.get('/admin/courses', { params }).then((res) => res.data),
  getAdminCourseById: (id) => apiClient.get(`/admin/courses/${id}`).then((res) => res.data),
  getDashboardStats: () => apiClient.get('/admin/courses/stats').then((res) => res.data),

  createCourse: (course, thumbnailFile) => {
    const formData = buildCourseFormData(course, thumbnailFile);
    return apiClient.post('/admin/courses', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => res.data);
  },

  updateCourse: (id, course, thumbnailFile) => {
    const formData = buildCourseFormData(course, thumbnailFile);
    return apiClient.put(`/admin/courses/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => res.data);
  },

  deleteCourse: (id) => apiClient.delete(`/admin/courses/${id}`).then((res) => res.data),
  restoreCourse: (id) => apiClient.patch(`/admin/courses/${id}/restore`).then((res) => res.data),
  updateCourseStatus: (id, status) => apiClient.patch(`/admin/courses/${id}/status`, { status }).then((res) => res.data),
};

export default courseService;
