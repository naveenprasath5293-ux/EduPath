import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiShield, FiBarChart2, FiUsers, FiBookOpen, FiArrowRight } from 'react-icons/fi';
import { slideInLeft, slideInRight } from '../../animations/variants';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routePaths';
import { IMG_AUTH_ADMIN } from '../../assets/images/imageAssets';

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await adminLogin({ email: data.email, password: data.password });
      toast.success('Welcome back, Admin.');
      navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* ── Left panel — admin image ── */}
      <motion.div
        variants={slideInLeft}
        initial="hidden"
        animate="visible"
        className="d-none d-lg-flex"
        style={{
          flex: '0 0 44%',
          position: 'relative',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${IMG_AUTH_ADMIN})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        {/* Darker overlay for professional feel */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(165deg, rgba(26,23,20,0.65) 0%, rgba(47,42,38,0.90) 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '3rem' }}>
          <div className="mb-4">
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF8EE', fontFamily: 'var(--scm-font-display)' }}>
              Edu<span style={{ color: 'var(--scm-primary)' }}>Path</span>
            </span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,130,58,0.18)', color: 'var(--scm-primary)', borderRadius: 99, padding: '0.4rem 1rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem', border: '1px solid rgba(201,130,58,0.30)' }}>
            <FiShield size={13} /> Admin Portal · Restricted Access
          </div>

          <h2 style={{ color: '#FFF8EE', fontWeight: 800, fontSize: '1.85rem', lineHeight: 1.25, marginBottom: '0.875rem' }}>
            Platform<br />Management
          </h2>
          <p style={{ color: 'rgba(255,248,238,0.65)', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.92rem', maxWidth: 300 }}>
            Manage courses, students, and enrollments from the EduPath admin portal.
          </p>

          {[
            { icon: <FiBookOpen size={15} />, label: 'Course Management' },
            { icon: <FiUsers size={15} />, label: 'Student Oversight' },
            { icon: <FiBarChart2 size={15} />, label: 'Enrollment Analytics' },
          ].map((item) => (
            <div key={item.label} className="d-flex align-items-center gap-3 mb-3">
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(201,130,58,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--scm-primary)', flexShrink: 0 }}>
                {item.icon}
              </div>
              <span style={{ color: 'rgba(255,248,238,0.78)', fontSize: '0.9rem' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Right panel — admin form ── */}
      <motion.div
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        style={{
          flex: 1, background: '#F8F4EF',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2.5rem 1.5rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div className="d-lg-none mb-4 text-center">
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--scm-text)', fontFamily: 'var(--scm-font-display)' }}>
              Edu<span style={{ color: 'var(--scm-primary)' }}>Path</span>
            </span>
          </div>

          <div className="d-flex align-items-center gap-2 mb-1">
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(201,130,58,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FiShield size={18} style={{ color: 'var(--scm-primary)' }} />
            </div>
            <h2 style={{ fontWeight: 800, color: 'var(--scm-text)', margin: 0, fontFamily: 'var(--scm-font-display)', fontSize: '1.5rem' }}>Admin Portal</h2>
          </div>
          <p style={{ color: 'var(--scm-text-secondary)', marginBottom: '2rem', marginTop: '0.4rem', fontSize: '0.9rem' }}>
            Restricted access — administrators only.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input label="Admin Email" type="email" placeholder="admin@edupath.com" error={errors.email}
              {...register('email', { required: 'Email is required' })} />
            <PasswordInput label="Password" placeholder="Enter admin password" error={errors.password}
              {...register('password', { required: 'Password is required' })} />
            <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-100 mt-2" size="lg"
              style={{ borderRadius: 'var(--scm-radius-sm)', fontWeight: 700 }}>
              Access Dashboard <FiArrowRight size={16} />
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <hr style={{ borderColor: 'var(--scm-border)', margin: '0 0 1.5rem' }} />
            <p className="mb-0" style={{ fontSize: '0.85rem', color: 'var(--scm-text-muted)' }}>
              Not an admin?{' '}
              <Link to={ROUTES.STUDENT_LOGIN} style={{ color: 'var(--scm-primary)', fontWeight: 600 }}>Student login</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
