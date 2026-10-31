import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff,
  FiChevronDown, FiChevronUp, FiCheck, FiX,
} from 'react-icons/fi';
import lessonService from '../../services/lessonService';
import { fadeInUp } from '../../animations/variants';

function LessonForm({ courseId, lesson, nextNumber, onSave, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: lesson
      ? { title: lesson.title, lessonNumber: lesson.lessonNumber, description: lesson.description, content: lesson.content, videoUrl: lesson.videoUrl, duration: lesson.duration, isPublished: lesson.isPublished }
      : { lessonNumber: nextNumber, isPublished: false },
  });

  const onSubmit = async (data) => {
    try {
      let res;
      if (lesson) {
        res = await lessonService.updateLesson(courseId, lesson._id, data);
      } else {
        res = await lessonService.createLesson(courseId, data);
      }
      toast.success(lesson ? 'Lesson updated' : 'Lesson created');
      onSave(res.data.lesson);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save lesson');
    }
  };

  const inputStyle = { borderRadius: 'var(--scm-radius-sm)', border: '1px solid var(--scm-border)', padding: '0.55rem 0.875rem', fontSize: '0.9rem', width: '100%', background: 'var(--scm-card-bg)', color: 'var(--scm-text)' };
  const labelStyle = { fontWeight: 600, fontSize: '0.82rem', color: 'var(--scm-text)', marginBottom: '0.3rem', display: 'block' };
  const errorStyle = { fontSize: '0.78rem', color: '#c0392b', marginTop: 4 };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ background: 'var(--scm-section-bg)', borderRadius: 'var(--scm-radius)', border: '1px solid var(--scm-border)', padding: '1.5rem', marginBottom: '1rem' }}>
      <h6 style={{ fontWeight: 700, marginBottom: '1.25rem', color: 'var(--scm-text)' }}>
        {lesson ? '✏️ Edit Lesson' : '➕ New Lesson'}
      </h6>
      <div className="row g-3">
        <div className="col-12 col-md-8">
          <label style={labelStyle}>Lesson Title *</label>
          <input style={inputStyle} placeholder="e.g. Introduction to HTML" {...register('title', { required: 'Title required' })} />
          {errors.title && <div style={errorStyle}>{errors.title.message}</div>}
        </div>
        <div className="col-6 col-md-2">
          <label style={labelStyle}>Number *</label>
          <input type="number" min="1" style={inputStyle} {...register('lessonNumber', { required: 'Required', valueAsNumber: true, min: { value: 1, message: 'Min 1' } })} />
          {errors.lessonNumber && <div style={errorStyle}>{errors.lessonNumber.message}</div>}
        </div>
        <div className="col-6 col-md-2">
          <label style={labelStyle}>Duration</label>
          <input style={inputStyle} placeholder="e.g. 15 mins" {...register('duration')} />
        </div>
        <div className="col-12">
          <label style={labelStyle}>YouTube URL</label>
          <input style={inputStyle} placeholder="https://youtube.com/watch?v=..." {...register('videoUrl')} />
          {errors.videoUrl && <div style={errorStyle}>{errors.videoUrl.message}</div>}
        </div>
        <div className="col-12">
          <label style={labelStyle}>Description</label>
          <textarea rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Brief lesson overview..." {...register('description')} />
        </div>
        <div className="col-12">
          <label style={labelStyle}>Lesson Notes / Content</label>
          <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Detailed notes or text content..." {...register('content')} />
        </div>
        <div className="col-12 d-flex align-items-center gap-3">
          <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer', fontSize: '0.88rem', color: 'var(--scm-text)' }}>
            <input type="checkbox" className="form-check-input m-0" {...register('isPublished')} />
            Publish this lesson
          </label>
        </div>
      </div>
      <div className="d-flex gap-2 mt-3">
        <button type="submit" className="btn btn-primary btn-sm d-flex align-items-center gap-1" style={{ borderRadius: 'var(--scm-radius-xs)', fontWeight: 600 }} disabled={isSubmitting}>
          {isSubmitting ? <span className="spinner-border spinner-border-sm" /> : <FiCheck size={14} />}
          {lesson ? 'Save Changes' : 'Create Lesson'}
        </button>
        <button type="button" className="btn btn-sm d-flex align-items-center gap-1" style={{ borderRadius: 'var(--scm-radius-xs)', background: 'none', border: '1px solid var(--scm-border)', color: 'var(--scm-text-secondary)' }} onClick={onCancel}>
          <FiX size={14} /> Cancel
        </button>
      </div>
    </form>
  );
}

export default function LessonManager({ courseId }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editLesson, setEditLesson] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchLessons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await lessonService.getAdminLessons(courseId);
      setLessons(res.data.lessons || []);
    } catch {
      toast.error('Failed to load lessons');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => { fetchLessons(); }, [fetchLessons]);

  const handleSave = (saved) => {
    setLessons((prev) => {
      const idx = prev.findIndex((l) => l._id === saved._id);
      if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next.sort((a, b) => a.lessonNumber - b.lessonNumber); }
      return [...prev, saved].sort((a, b) => a.lessonNumber - b.lessonNumber);
    });
    setShowForm(false);
    setEditLesson(null);
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm('Delete this lesson permanently?')) return;
    setDeletingId(lessonId);
    try {
      await lessonService.deleteLesson(courseId, lessonId);
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
      toast.success('Lesson deleted');
    } catch {
      toast.error('Failed to delete lesson');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (lessonId) => {
    try {
      const res = await lessonService.togglePublish(courseId, lessonId);
      const updated = res.data.lesson;
      setLessons((prev) => prev.map((l) => (l._id === updated._id ? updated : l)));
      toast.success(updated.isPublished ? 'Lesson published' : 'Lesson unpublished');
    } catch {
      toast.error('Failed to update lesson');
    }
  };

  const nextNumber = lessons.length > 0 ? Math.max(...lessons.map((l) => l.lessonNumber)) + 1 : 1;

  return (
    <div style={{ marginTop: '2rem' }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 style={{ fontWeight: 700, color: 'var(--scm-text)', margin: 0 }}>
          📚 Course Lessons ({lessons.length})
        </h5>
        {!showForm && !editLesson && (
          <button
            className="btn btn-primary btn-sm d-flex align-items-center gap-1"
            style={{ borderRadius: 'var(--scm-radius-xs)', fontWeight: 600 }}
            onClick={() => setShowForm(true)}
          >
            <FiPlus size={14} /> Add Lesson
          </button>
        )}
      </div>

      <AnimatePresence>
        {(showForm && !editLesson) && (
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -8 }}>
            <LessonForm courseId={courseId} nextNumber={nextNumber} onSave={handleSave} onCancel={() => setShowForm(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="text-center py-4"><span className="spinner-border" style={{ color: 'var(--scm-primary)' }} /></div>
      ) : lessons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2.5rem', background: 'var(--scm-section-bg)', borderRadius: 'var(--scm-radius)', border: '1px dashed var(--scm-border)' }}>
          <p style={{ color: 'var(--scm-text-secondary)', margin: 0 }}>No lessons yet. Add the first lesson above.</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-2">
          {lessons.map((lesson) => (
            <motion.div key={lesson._id} variants={fadeInUp} initial="hidden" animate="visible">
              {editLesson?._id === lesson._id ? (
                <LessonForm courseId={courseId} lesson={lesson} nextNumber={nextNumber} onSave={handleSave} onCancel={() => setEditLesson(null)} />
              ) : (
                <div style={{ background: 'var(--scm-card-bg)', borderRadius: 'var(--scm-radius-sm)', border: '1px solid var(--scm-border)', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: lesson.isPublished ? 'var(--scm-primary-light)' : 'var(--scm-section-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: lesson.isPublished ? 'var(--scm-primary)' : 'var(--scm-text-muted)' }}>{lesson.lessonNumber}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--scm-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lesson.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--scm-text-secondary)', marginTop: 2 }}>
                      {lesson.duration && <span>{lesson.duration} · </span>}
                      <span style={{ color: lesson.isPublished ? 'var(--scm-success)' : 'var(--scm-text-muted)', fontWeight: 600 }}>
                        {lesson.isPublished ? '● Published' : '○ Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex gap-1 flex-shrink-0">
                    <button title={lesson.isPublished ? 'Unpublish' : 'Publish'} className="btn btn-sm" style={{ padding: '0.3rem', background: 'none', border: '1px solid var(--scm-border)', borderRadius: 'var(--scm-radius-xs)', color: lesson.isPublished ? 'var(--scm-primary)' : 'var(--scm-text-muted)' }} onClick={() => handleToggle(lesson._id)}>
                      {lesson.isPublished ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                    <button title="Edit" className="btn btn-sm" style={{ padding: '0.3rem', background: 'none', border: '1px solid var(--scm-border)', borderRadius: 'var(--scm-radius-xs)', color: 'var(--scm-text-secondary)' }} onClick={() => { setEditLesson(lesson); setShowForm(false); }}>
                      <FiEdit2 size={14} />
                    </button>
                    <button title="Delete" className="btn btn-sm" style={{ padding: '0.3rem', background: 'none', border: '1px solid rgba(192,57,43,0.25)', borderRadius: 'var(--scm-radius-xs)', color: '#c0392b' }} onClick={() => handleDelete(lesson._id)} disabled={deletingId === lesson._id}>
                      {deletingId === lesson._id ? <span className="spinner-border spinner-border-sm" style={{ width: 14, height: 14 }} /> : <FiTrash2 size={14} />}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
