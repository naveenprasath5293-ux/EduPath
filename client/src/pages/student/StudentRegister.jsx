import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FiStar, FiArrowRight, FiBookOpen, FiAward, FiUsers } from 'react-icons/fi';
import { slideInLeft, slideInRight } from '../../animations/variants';
import Input from '../../components/ui/Input';
import PasswordInput from '../../components/ui/PasswordInput';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../constants/routePaths';
import { IMG_AUTH_STUDENT } from '../../assets/images/imageAssets';

export default function StudentRegister() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success('Account created! Welcome to EduPath.');
      navigate(ROUTES.STUDENT_DASHBOARD, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
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
          flex: '0 0 44%',
          position: 'relative',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${IMG_AUTH_STUDENT})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(165deg, rgba(47,42,38,0.60) 0%, rgba(107,79,58,0.85) 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '3rem' }}>
          <div className="mb-4">
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF8EE', fontFamily: 'var(--scm-font-display)' }}>
              Edu<span style={{ color: 'var(--scm-gold)' }}>Path</span>
            </span>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(217,164,65,0.20)', color: 'var(--scm-gold)', borderRadius: 99, padding: '0.4rem 1rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem', border: '1px solid rgba(217,164,65,0.30)' }}>
            <FiStar size={13} /> Free to join · No credit card needed
          </div>

          <h2 style={{ color: '#FFF8EE', fontWeight: 800, fontSize: '1.85rem', lineHeight: 1.25, marginBottom: '0.875rem' }}>
            Your learning<br />journey starts here
          </h2>
          <p style={{ color: 'rgba(255,248,238,0.75)', lineHeight: 1.75, marginBottom: '2rem', fontSize: '0.92rem', maxWidth: 300 }}>
            Join thousands of students across India building real skills and advancing their careers.
          </p>

          {[
            { icon: <FiBookOpen size={15} />, label: 'Structured courses' },
            { icon: <FiAward size={15} />, label: 'Recognised certificates' },
            { icon: <FiUsers size={15} />, label: 'Active student community' },
          ].map((item) => (
            <div key={item.label} className="d-flex align-items-center gap-3 mb-3">
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,248,238,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--scm-gold)', flexShrink: 0 }}>
                {item.icon}
              </div>
              <span style={{ color: 'rgba(255,248,238,0.82)', fontSize: '0.9rem' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Right panel — register form ── */}
      <motion.div
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        style={{
          flex: 1, background: 'var(--scm-background)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2.5rem 1.5rem', overflowY: 'auto',
        }}
      >
        <div style={{ width: '100%', maxWidth: 440 }}>
          <div className="d-lg-none mb-4 text-center">
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--scm-primary)', fontFamily: 'var(--scm-font-display)' }}>
              Edu<span style={{ color: 'var(--scm-gold)' }}>Path</span>
            </span>
          </div>

          <h2 style={{ fontWeight: 800, color: 'var(--scm-text)', marginBottom: '0.4rem', fontFamily: 'var(--scm-font-display)' }}>Create your account</h2>
          <p style={{ color: 'var(--scm-text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
            Free forever. Start learning in under 2 minutes.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Input label="Full Name" placeholder="Your full name" error={errors.fullName}
              {...register('fullName', { required: 'Full name is required', minLength: { value: 2, message: 'At least 2 characters' } })} />
            <Input label="Email address" type="email" placeholder="you@example.com" error={errors.email}
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' } })} />
            <Input label="Phone Number" type="tel" placeholder="10-digit mobile number" error={errors.phone}
              {...register('phone', { required: 'Phone number is required', pattern: { value: /^[+]?[0-9]{10,15}$/, message: 'Enter a valid phone number (10-15 digits)' } })} />
            <PasswordInput label="Password" placeholder="Create a strong password" error={errors.password}
              {...register('password', {
                required: 'Password is required',
                pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, message: 'Min 8 chars, uppercase, lowercase, number & special character' },
              })} />
            <PasswordInput label="Confirm Password" placeholder="Repeat your password" error={errors.confirmPassword}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === watch('password') || 'Passwords do not match',
              })} />

            <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-100 mt-1" size="lg"
              style={{ borderRadius: 'var(--scm-radius-sm)', fontWeight: 700 }}>
              Create Account <FiArrowRight size={16} />
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <hr style={{ borderColor: 'var(--scm-border)', margin: '0 0 1.5rem' }} />
            <p className="mb-0" style={{ fontSize: '0.9rem', color: 'var(--scm-text-secondary)' }}>
              Already have an account?{' '}
              <Link to={ROUTES.STUDENT_LOGIN} style={{ color: 'var(--scm-primary)', fontWeight: 700 }}>Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
