import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import CourseForm from '../../components/courses/CourseForm';
import courseService from '../../services/courseService';

export default function AddCourse() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data, thumbnailFile) => {
    setIsSubmitting(true);
    try {
      await courseService.createCourse(data, thumbnailFile);
      toast.success('Course created successfully');
      navigate('/admin/courses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not create course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <h2 className="mb-1">Add Course</h2>
      <p className="text-secondary-custom mb-4">New courses are saved as a draft until you publish them.</p>

      <Card hoverable={false}>
        <CourseForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Create Course" />
      </Card>
    </PageContainer>
  );
}
