import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { COURSE_LEVELS } from '../../constants/courseConstants';

/**
 * Requirements/benefits are edited as one-item-per-line text, then
 * split into arrays on submit - simpler and more predictable for a
 * course-authoring form than a fully dynamic field-array UI, while
 * still producing the same array-of-strings shape the API expects.
 */
function linesToArray(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function arrayToLines(arr) {
  return Array.isArray(arr) ? arr.join('\n') : '';
}

export default function CourseForm({ initialValues, existingThumbnail, onSubmit, isSubmitting, submitLabel = 'Save Course' }) {
  const [preview, setPreview] = useState(existingThumbnail || null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailError, setThumbnailError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: initialValues?.title || '',
      category: initialValues?.category || '',
      level: initialValues?.level || '',
      duration: initialValues?.duration || '',
      price: initialValues?.price ?? '',
      instructor: initialValues?.instructor || '',
      description: initialValues?.description || '',
      shortDescription: initialValues?.shortDescription || '',
      requirements: arrayToLines(initialValues?.requirements),
      benefits: arrayToLines(initialValues?.benefits),
    },
  });

  const isEditMode = Boolean(existingThumbnail);

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setThumbnailError('Thumbnail must be a JPG, JPEG, PNG, or WEBP image');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setThumbnailError('Thumbnail must be 2 MB or smaller');
      return;
    }

    setThumbnailError('');
    setThumbnailFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = (data) => {
    if (!isEditMode && !thumbnailFile) {
      setThumbnailError('Course thumbnail is required');
      return;
    }

    onSubmit(
      {
        ...data,
        requirements: linesToArray(data.requirements),
        benefits: linesToArray(data.benefits),
      },
      thumbnailFile
    );
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} noValidate>
      <div className="row">
        <div className="col-12 col-md-8">
          <Input
            label="Course Title"
            error={errors.title}
            {...register('title', { required: 'Title is required', maxLength: { value: 150, message: 'Title is too long' } })}
          />

          <div className="row">
            <div className="col-12 col-md-6">
              <Input
                label="Category"
                placeholder="e.g. Web Development"
                error={errors.category}
                {...register('category', { required: 'Category is required' })}
              />
            </div>
            <div className="col-12 col-md-6 mb-3">
              <label className="form-label fw-medium">Level</label>
              <select className={`form-select ${errors.level ? 'is-invalid' : ''}`} {...register('level', { required: 'Level is required' })}>
                <option value="">Select...</option>
                {COURSE_LEVELS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                ))}
              </select>
              {errors.level && <div className="invalid-feedback d-block">{errors.level.message}</div>}
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-md-4">
              <Input
                label="Duration"
                placeholder="e.g. 6 weeks"
                error={errors.duration}
                {...register('duration', { required: 'Duration is required' })}
              />
            </div>
            <div className="col-12 col-md-4">
              <Input
                label="Price (₹)"
                type="number"
                step="0.01"
                min="0"
                error={errors.price}
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 0, message: 'Price cannot be negative' },
                })}
              />
            </div>
            <div className="col-12 col-md-4">
              <Input
                label="Instructor"
                error={errors.instructor}
                {...register('instructor', { required: 'Instructor is required' })}
              />
            </div>
          </div>

          <Input
            label="Short Description"
            as="textarea"
            rows={2}
            placeholder="One or two sentences shown on the course card"
            error={errors.shortDescription}
            {...register('shortDescription', { maxLength: { value: 200, message: 'Keep it under 200 characters' } })}
          />

          <Input
            label="Full Description"
            as="textarea"
            rows={5}
            error={errors.description}
            {...register('description', { required: 'Description is required' })}
          />

          <div className="row">
            <div className="col-12 col-md-6">
              <Input
                label="Requirements (one per line)"
                as="textarea"
                rows={4}
                placeholder={'Basic HTML/CSS knowledge\nA computer with internet access'}
                {...register('requirements')}
              />
            </div>
            <div className="col-12 col-md-6">
              <Input
                label="Benefits (one per line)"
                as="textarea"
                rows={4}
                placeholder={'Build 5 real projects\nCertificate of completion'}
                {...register('benefits')}
              />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <label className="form-label fw-medium">Course Thumbnail</label>
          <div
            className="rounded-scm border d-flex align-items-center justify-content-center mb-2 overflow-hidden"
            style={{ aspectRatio: '16/9', backgroundColor: 'var(--scm-section-bg)', borderColor: 'var(--scm-border)' }}
          >
            {preview ? (
              <img src={preview} alt="Thumbnail preview" className="w-100 h-100" style={{ objectFit: 'cover' }} />
            ) : (
              <span className="text-secondary-custom small">No image selected</span>
            )}
          </div>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className={`form-control ${thumbnailError ? 'is-invalid' : ''}`}
            onChange={handleThumbnailChange}
          />
          {thumbnailError && <div className="invalid-feedback d-block">{thumbnailError}</div>}
          <div className="form-text">JPG, JPEG, PNG, or WEBP. Max 2 MB.</div>
        </div>
      </div>

      <Button type="submit" variant="primary" isLoading={isSubmitting} className="mt-3">
        {submitLabel}
      </Button>
    </form>
  );
}
