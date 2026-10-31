import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import CourseForm from '../../components/courses/CourseForm';
import courseService from '../../services/courseService';

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await courseService.getAdminCourseById(id);
        if (!cancelled) setCourse(res.data.course);
      } catch (err) {
        if (!cancelled) {
          toast.error(err.response?.data?.message || 'Could not load course');
          navigate('/admin/courses', { replace: true });
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const handleSubmit = async (data, thumbnailFile) => {
    setIsSubmitting(true);
    try {
      await courseService.updateCourse(id, data, thumbnailFile);
      toast.success('Course updated successfully');
      navigate('/admin/courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update course');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Loader fullScreen />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <h2 className="mb-1">Edit Course</h2>
      <p className="text-secondary-custom mb-4">{course?.title}</p>

      <Card hoverable={false}>
        <CourseForm
          initialValues={course}
          existingThumbnail={course?.thumbnail}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Save Changes"
        />
      </Card>
    </PageContainer>
  );
}
