import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeInUp } from '../../animations/variants';
import PageContainer from '../../components/layout/PageContainer';
import Button from '../../components/ui/Button';
import { ROUTES } from '../../constants/routePaths';

export default function NotFound() {
  return (
    <PageContainer>
      <motion.div
        className="text-center py-5"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        <h1 className="display-3 fw-bold" style={{ color: 'var(--scm-primary)' }}>404</h1>
        <p className="text-secondary-custom mb-4">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link to={ROUTES.HOME}>
          <Button variant="primary">Back to Home</Button>
        </Link>
      </motion.div>
    </PageContainer>
  );
}
