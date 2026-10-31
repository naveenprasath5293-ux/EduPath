import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiRotateCcw, FiEye } from 'react-icons/fi';
import { formatLevel, formatPrice } from '../../constants/courseConstants';

function StatusBadge({ status }) {
  const isPublished = status === 'published';
  return (
    <span
      className="badge rounded-pill"
      style={{
        backgroundColor: isPublished ? 'var(--scm-success)' : 'var(--scm-border)',
        color: isPublished ? '#fff' : 'var(--scm-text)',
      }}
    >
      {isPublished ? 'Published' : 'Draft'}
    </span>
  );
}

export default function CourseTable({ courses, viewingDeleted = false, onDelete, onRestore, onToggleStatus }) {
  if (!courses || courses.length === 0) {
    return <p className="text-secondary-custom text-center py-4">No courses found.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Course</th>
            <th>Category</th>
            <th>Level</th>
            <th>Price</th>
            <th>Status</th>
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    width={56}
                    height={36}
                    className="rounded-scm"
                    style={{ objectFit: 'cover' }}
                  />
                  <div>
                    <div className="fw-medium">{course.title}</div>
                    <div className="text-secondary-custom small">{course.instructor}</div>
                  </div>
                </div>
              </td>
              <td>{course.category}</td>
              <td>{formatLevel(course.level)}</td>
              <td>{formatPrice(course.price)}</td>
              <td>
                {viewingDeleted ? (
                  <span className="badge rounded-pill bg-light text-secondary-custom border">Deleted</span>
                ) : (
                  <StatusBadge status={course.status} />
                )}
              </td>
              <td>
                <div className="d-flex justify-content-end gap-2">
                  <Link to={`/admin/courses/${course._id}`} className="btn btn-sm btn-outline-primary" title="View">
                    <FiEye />
                  </Link>

                  {viewingDeleted ? (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      title="Restore"
                      onClick={() => onRestore(course)}
                    >
                      <FiRotateCcw />
                    </button>
                  ) : (
                    <>
                      <Link to={`/admin/courses/${course._id}/edit`} className="btn btn-sm btn-outline-primary" title="Edit">
                        <FiEdit2 />
                      </Link>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        title={course.status === 'published' ? 'Unpublish' : 'Publish'}
                        onClick={() => onToggleStatus(course)}
                      >
                        {course.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                        onClick={() => onDelete(course)}
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
