import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiClock, FiUser, FiTag, FiBarChart2 } from 'react-icons/fi';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import Button from '../../components/ui/Button';
import Loader from '../../components/ui/Loader';
import ConfirmModal from '../../components/ui/ConfirmModal';
import LessonManager from '../../components/lessons/LessonManager';
import courseService from '../../services/courseService';
import enrollmentService from '../../services/enrollmentService';
import { formatLevel, formatPrice } from '../../constants/courseConstants';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [isActing, setIsActing] = useState(false);

  const fetchCourse = async () => {
    try {
      const res = await courseService.getAdminCourseById(id);
      setCourse(res.data.course);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not load course');
      navigate('/admin/courses', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    setEnrollmentsLoading(true);
    try {
      const res = await enrollmentService.getCourseEnrollments(id, { page: 1, limit: 50 });
      setEnrollments(res.data.enrollments);
    } catch {
      setEnrollments([]);
    } finally {
      setEnrollmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (course) fetchEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?._id]);

  const handleToggleStatus = async () => {
    setIsActing(true);
    try {
      const nextStatus = course.status === 'published' ? 'draft' : 'published';
      const res = await courseService.updateCourseStatus(course._id, nextStatus);
      setCourse(res.data.course);
      toast.success(`Course ${nextStatus === 'published' ? 'published' : 'moved to draft'}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update status');
    } finally {
      setIsActing(false);
    }
  };

  const handleDelete = async () => {
    setIsActing(true);
    try {
      await courseService.deleteCourse(course._id);
      toast.success('Course deleted');
      navigate('/admin/courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not delete course');
      setIsActing(false);
    }
  };

  if (isLoading) return <PageContainer><Loader fullScreen /></PageContainer>;
  if (!course) return null;

  return (
    <PageContainer>
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
        <div>
          <h2 className="mb-1">{course.title}</h2>
          <span className="badge rounded-pill" style={{ backgroundColor: course.status === 'published' ? 'var(--scm-success)' : 'var(--scm-border)', color: course.status === 'published' ? '#fff' : 'var(--scm-text)' }}>
            {course.isDeleted ? 'Deleted' : course.status === 'published' ? 'Published' : 'Draft'}
          </span>
        </div>
        {!course.isDeleted && (
          <div className="d-flex gap-2 flex-wrap">
            <Link to={`/admin/courses/${course._id}/edit`}><Button variant="outline">Edit</Button></Link>
            <Button variant="primary" onClick={handleToggleStatus} isLoading={isActing}>
              {course.status === 'published' ? 'Unpublish' : 'Publish'}
            </Button>
            <Button variant="outline" className="border-danger text-danger" onClick={() => setConfirmingDelete(true)}>Delete</Button>
          </div>
        )}
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <img src={course.thumbnail} alt={course.title} className="w-100 rounded-scm mb-4" style={{ aspectRatio: '16/9', objectFit: 'cover' }} />
          <Card hoverable={false} className="mb-4">
            <h5 className="mb-2">Description</h5>
            <p className="text-secondary-custom mb-0">{course.description}</p>
          </Card>
          {course.requirements?.length > 0 && (
            <Card hoverable={false} className="mb-4">
              <h5 className="mb-3">Requirements</h5>
              <ul className="mb-0">{course.requirements.map((r) => <li key={r}>{r}</li>)}</ul>
            </Card>
          )}
          {course.benefits?.length > 0 && (
            <Card hoverable={false}>
              <h5 className="mb-3">Benefits</h5>
              <ul className="mb-0">{course.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
            </Card>
          )}
        </div>

        <div className="col-12 col-lg-5">
          <Card hoverable={false}>
            <h5 className="mb-3">Course Info</h5>
            <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
              <li className="d-flex align-items-center gap-2"><FiUser /><strong>Instructor:</strong> {course.instructor}</li>
              <li className="d-flex align-items-center gap-2"><FiTag /><strong>Category:</strong> {course.category}</li>
              <li className="d-flex align-items-center gap-2"><FiBarChart2 /><strong>Level:</strong> {formatLevel(course.level)}</li>
              <li className="d-flex align-items-center gap-2"><FiClock /><strong>Duration:</strong> {course.duration}</li>
              <li className="d-flex align-items-center gap-2"><strong>Price:</strong> <span style={{ color: 'var(--scm-primary)' }} className="fw-bold">{formatPrice(course.price)}</span></li>
              <li><strong>Slug:</strong> <code>{course.slug}</code></li>
            </ul>
          </Card>
        </div>
      </div>

      {/* ── Lesson Manager ──────────────────────────────────────── */}
      {!course.isDeleted && (
        <div className="mt-4">
          <Card hoverable={false}>
            <LessonManager courseId={course._id} />
          </Card>
        </div>
      )}

      {/* ── Enrollments ──────────────────────────────────────────── */}
      <div className="mt-4">
        <Card hoverable={false}>
          <h5 className="mb-3">Student Enrollments ({enrollments.length})</h5>
          {enrollmentsLoading ? (
            <Loader fullScreen={false} />
          ) : enrollments.length === 0 ? (
            <EmptyState icon={<FiUser />} title="No enrollments yet" description="Students will appear here once they enroll." />
          ) : (
            <div className="table-responsive">
              <table className="table table-sm mb-0">
                <thead>
                  <tr><th>Student Name</th><th>Email</th><th>Status</th><th>Progress</th><th>Enrolled Date</th></tr>
                </thead>
                <tbody>
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment._id}>
                      <td className="align-middle">{enrollment.student.fullName}</td>
                      <td className="align-middle">{enrollment.student.email}</td>
                      <td className="align-middle">
                        <span className="badge rounded-pill" style={{ backgroundColor: enrollment.status === 'completed' ? 'var(--scm-success)' : 'var(--scm-hover-glow)', color: 'white' }}>
                          {enrollment.status === 'completed' ? 'Completed' : 'Enrolled'}
                        </span>
                      </td>
                      <td className="align-middle">
                        <div style={{ width: '100px' }}>
                          <div className="progress" style={{ height: '6px' }}>
                            <div className="progress-bar" role="progressbar" style={{ width: `${enrollment.progress}%` }} aria-valuenow={enrollment.progress} aria-valuemin="0" aria-valuemax="100" />
                          </div>
                          <small className="text-secondary-custom">{enrollment.progress}%</small>
                        </div>
                      </td>
                      <td className="align-middle text-secondary-custom small">{new Date(enrollment.enrolledAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <ConfirmModal
        isOpen={confirmingDelete}
        title="Delete this course?"
        message={`"${course.title}" will be moved to Deleted and hidden from students.`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={isActing}
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </PageContainer>
  );
}
