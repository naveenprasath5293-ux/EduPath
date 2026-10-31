import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiArrowRight, FiBookOpen, FiAward, FiTrendingUp } from 'react-icons/fi';
import { slideInLeft, slideInRight } from '../../animations/variants';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routePaths';
import { IMG_AUTH_STUDENT } from '../../assets/images/imageAssets';

const BENEFITS = [
  { icon: <FiBookOpen size={14} />, text: 'Access structured courses anytime' },
  { icon: <FiTrendingUp size={14} />, text: 'Track your real learning progress' },
  { icon: <FiAward size={14} />, text: 'Earn recognised certificates' },
];

export default function StudentLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login({ email: data.email, password: data.password });
      toast.success('Welcome back!');
      const redirectTo = location.state?.from?.pathname || ROUTES.STUDENT_DASHBOARD;
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex' }}>
      {/* ── Left panel — background image ── */}
      <motion.div
        variants={slideInLeft}
        initial="hidden"
        animate="visible"
        className="d-none d-lg-flex"
        style={{
          flex: '0 0 48%',
          position: 'relative',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${IMG_AUTH_STUDENT})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        {/* Warm overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(165deg, rgba(107,79,58,0.55) 0%, rgba(47,42,38,0.80) 100%)',
        }} />

        {/* Content over image */}
        <div style={{ position: 'relative', zIndex: 1, padding: '3rem' }}>
          <div className="mb-4">
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF8EE', fontFamily: 'var(--scm-font-display)', letterSpacing: '-0.02em' }}>
              Edu<span style={{ color: 'var(--scm-gold)' }}>Path</span>
            </span>
          </div>
          <h2 style={{ color: '#FFF8EE', fontWeight: 800, fontSize: '1.85rem', lineHeight: 1.25, marginBottom: '0.875rem' }}>
            Continue your<br />learning journey
          </h2>
          <p style={{ color: 'rgba(255,248,238,0.78)', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.95rem', maxWidth: 320 }}>
            Thousands of students across India grow their skills every day with EduPath.
          </p>
          <ul className="list-unstyled d-flex flex-column gap-3 mb-0">
            {BENEFITS.map((b) => (
              <li key={b.text} className="d-flex align-items-center gap-3">
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,248,238,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--scm-gold)' }}>
                  {b.icon}
                </div>
                <span style={{ color: 'rgba(255,248,238,0.87)', fontSize: '0.9rem' }}>{b.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* ── Right panel — login form ── */}
      <motion.div
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        style={{
          flex: 1, background: 'var(--scm-background)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2.5rem 1.5rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div className="d-lg-none mb-4 text-center">
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--scm-primary)', fontFamily: 'var(--scm-font-display)' }}>
              Edu<span style={{ color: 'var(--scm-gold)' }}>Path</span>
            </span>
          </div>

          <h2 style={{ fontWeight: 800, color: 'var(--scm-text)', marginBottom: '0.4rem', fontFamily: 'var(--scm-font-display)' }}>Welcome back</h2>
          <p style={{ color: 'var(--scm-text-secondary)', marginBottom: '2.25rem', fontSize: '0.95rem' }}>
            Sign in to continue your learning journey.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              error={errors.email}
              {...register('email', { required: 'Email is required' })}
            />
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              error={errors.password}
              {...register('password', { required: 'Password is required' })}
            />
            <div className="d-flex justify-content-between align-items-center mb-4">
              <label className="d-flex align-items-center gap-2 small" style={{ cursor: 'pointer', color: 'var(--scm-text-secondary)' }}>
                <input type="checkbox" className="form-check-input m-0" {...register('rememberMe')} />
                Remember me
              </label>
              <button type="button" className="btn btn-link p-0 small" style={{ color: 'var(--scm-primary)', textDecoration: 'none', fontSize: '0.85rem' }}
                onClick={() => toast('Password reset is not yet available.', { icon: '🔧' })}>
                Forgot password?
              </button>
            </div>
            <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-100" size="lg"
              style={{ borderRadius: 'var(--scm-radius-sm)', fontWeight: 700 }}>
              Sign In <FiArrowRight size={16} />
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <hr style={{ borderColor: 'var(--scm-border)', margin: '0 0 1.5rem' }} />
            <p className="mb-0" style={{ fontSize: '0.9rem', color: 'var(--scm-text-secondary)' }}>
              New to EduPath?{' '}
              <Link to={ROUTES.STUDENT_REGISTER} style={{ color: 'var(--scm-primary)', fontWeight: 700 }}>Create a free account</Link>
            </p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link to={ROUTES.ADMIN_LOGIN} style={{ fontSize: '0.8rem', color: 'var(--scm-text-muted)' }}>Admin? Sign in here</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
