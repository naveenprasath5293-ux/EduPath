import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import ConfirmModal from '../../components/ui/ConfirmModal';
import Button from '../../components/ui/Button';
import CourseTable from '../../components/courses/CourseTable';
import SearchBar from '../../components/courses/SearchBar';
import Pagination from '../../components/courses/Pagination';
import courseService from '../../services/courseService';
import { ADMIN_STATUS_TABS } from '../../constants/courseConstants';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [isActing, setIsActing] = useState(false);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await courseService.getAdminCourses({ page, status: status || undefined, search: search || undefined });
      setCourses(res.data.courses);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load courses');
    } finally {
      setIsLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleStatusTab = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleToggleStatus = async (course) => {
    const nextStatus = course.status === 'published' ? 'draft' : 'published';
    try {
      await courseService.updateCourseStatus(course._id, nextStatus);
      toast.success(`Course ${nextStatus === 'published' ? 'published' : 'moved to draft'}`);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update status');
    }
  };

  const handleRestore = async (course) => {
    try {
      await courseService.restoreCourse(course._id);
      toast.success('Course restored');
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not restore course');
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setIsActing(true);
    try {
      await courseService.deleteCourse(pendingDelete._id);
      toast.success('Course deleted');
      setPendingDelete(null);
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete course');
    } finally {
      setIsActing(false);
    }
  };

  return (
    <PageContainer>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="mb-1">Course Management</h2>
          <p className="text-secondary-custom mb-0">Create, edit, publish, and manage every course.</p>
        </div>
        <Link to="/admin/courses/new">
          <Button variant="primary">+ Add Course</Button>
        </Link>
      </div>

      <Card hoverable={false}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <ul className="nav nav-pills gap-2">
            {ADMIN_STATUS_TABS.map((tab) => (
              <li className="nav-item" key={tab.value}>
                <button
                  type="button"
                  className={`btn btn-sm ${status === tab.value ? 'btn-primary text-white' : 'btn-outline-primary'}`}
                  onClick={() => handleStatusTab(tab.value)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
          <SearchBar placeholder="Search by title..." onSearch={handleSearch} className="w-100" />
        </div>

        {isLoading ? (
          <Loader fullScreen />
        ) : (
          <>
            <CourseTable
              courses={courses}
              viewingDeleted={status === 'deleted'}
              onDelete={setPendingDelete}
              onRestore={handleRestore}
              onToggleStatus={handleToggleStatus}
            />
            <div className="mt-4">
              <Pagination pagination={pagination} onPageChange={setPage} />
            </div>
          </>
        )}
      </Card>

      <ConfirmModal
        isOpen={Boolean(pendingDelete)}
        title="Delete this course?"
        message={pendingDelete ? `"${pendingDelete.title}" will be moved to Deleted and hidden from students. You can restore it later.` : ''}
        confirmLabel="Delete"
        variant="danger"
        isLoading={isActing}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </PageContainer>
  );
}
