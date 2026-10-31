import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiClock, FiSend } from 'react-icons/fi';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { fadeInUp, staggerContainer } from '../../animations/variants';

export default function Contact() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 700));
    toast.success('Message received! We\'ll get back to you within 24 hours.');
    reset();
  };

  return (
    <div style={{ background: 'var(--scm-background)' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #6B4F3A 0%, #C9823A 100%)', padding: '4rem 0 3rem' }}>
        <div className="container text-center" style={{ maxWidth: '600px' }}>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.span variants={fadeInUp} style={{ display: 'inline-block', background: 'rgba(255,248,238,0.15)', color: '#FFF8EE', borderRadius: 99, padding: '0.3rem 1rem', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', border: '1px solid rgba(255,248,238,0.25)', marginBottom: '1rem' }}>
              Get In Touch
            </motion.span>
            <motion.h1 variants={fadeInUp} style={{ color: '#FFF8EE', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontFamily: 'var(--scm-font-display)', marginBottom: '0.75rem' }}>
              Contact Us
            </motion.h1>
            <motion.p variants={fadeInUp} style={{ color: 'rgba(255,248,238,0.80)', fontSize: '1rem' }}>
              Have a question or need help? We're here to assist you.
            </motion.p>
          </motion.div>
        </div>
      </div>

      <section className="page-section">
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div className="row gy-5 align-items-start">
            {/* Contact info */}
            <div className="col-12 col-lg-4">
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {[
                  { icon: <FiMail size={20} />, title: 'Email', info: 'help@edupath.in', sub: 'We reply within 24 hours' },
                  { icon: <FiPhone size={20} />, title: 'Phone', info: '+91 98765 43210', sub: 'Mon–Sat, 9 AM – 6 PM IST' },
                  { icon: <FiClock size={20} />, title: 'Support Hours', info: 'Mon – Sat', sub: '9:00 AM – 6:00 PM IST' },
                ].map((item, i) => (
                  <motion.div key={item.title} variants={fadeInUp} transition={{ delay: i * 0.1 }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.75rem' }}
                  >
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--scm-primary-light)', color: 'var(--scm-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <h6 style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{item.title}</h6>
                      <div style={{ fontWeight: 600, color: 'var(--scm-text)', fontSize: '0.9rem' }}>{item.info}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--scm-text-secondary)' }}>{item.sub}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Contact form */}
            <div className="col-12 col-lg-7 offset-lg-1">
              <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                style={{ background: 'var(--scm-card-bg)', borderRadius: 'var(--scm-radius)', border: '1px solid var(--scm-border)', padding: '2rem', boxShadow: 'var(--scm-shadow-soft)' }}
              >
                <h4 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Send a Message</h4>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <Input label="Full Name" placeholder="Your name" error={errors.name}
                        {...register('name', { required: 'Name is required' })} />
                    </div>
                    <div className="col-12 col-sm-6">
                      <Input label="Email" type="email" placeholder="you@example.com" error={errors.email}
                        {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} />
                    </div>
                  </div>
                  <Input label="Subject" placeholder="How can we help?" error={errors.subject}
                    {...register('subject', { required: 'Subject is required' })} />
                  <Input label="Message" as="textarea" placeholder="Write your message here..." error={errors.message}
                    {...register('message', { required: 'Message is required', minLength: { value: 20, message: 'Please write at least 20 characters' } })} />
                  <Button type="submit" variant="primary" isLoading={isSubmitting} className="w-100 mt-2" style={{ fontWeight: 700 }}>
                    <FiSend size={15} /> Send Message
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
