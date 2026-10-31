import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiSearch } from 'react-icons/fi';
import CourseCard from '../../components/courses/CourseCard';
import SearchBar from '../../components/courses/SearchBar';
import FilterBar from '../../components/courses/FilterBar';
import Pagination from '../../components/courses/Pagination';
import Loader from '../../components/ui/Loader';
import EmptyState from '../../components/ui/EmptyState';
import { staggerContainer, fadeInUp } from '../../animations/variants';
import courseService from '../../services/courseService';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    courseService.getCategories()
      .then((res) => setCategories(res.data.categories))
      .catch(() => {});
  }, []);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      let res;
      if (search) {
        res = await courseService.searchCourses(search, { page });
      } else {
        res = await courseService.getPublicCourses({ page, category: category || undefined, level: level || undefined });
      }
      setCourses(res.data.courses);
      setPagination(res.data.pagination);
    } catch {
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [page, category, level, search]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const handleSearch = (value) => { setSearch(value); setPage(1); };

  return (
    <div style={{ background: 'var(--scm-background)', minHeight: '100vh' }}>
      {/* Page header */}
      <div style={{ background: 'linear-gradient(135deg, var(--scm-warm-brown) 0%, var(--scm-primary) 100%)', padding: '3.5rem 0 3rem' }}>
        <div className="container" style={{ maxWidth: '1280px' }}>
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="text-center">
            <span style={{ display: 'inline-block', background: 'rgba(255,248,238,0.15)', color: '#FFF8EE', borderRadius: 99, padding: '0.3rem 1rem', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '1rem', border: '1px solid rgba(255,248,238,0.25)' }}>
              Course Catalog
            </span>
            <h1 style={{ color: '#FFF8EE', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', marginBottom: '0.75rem', fontFamily: 'var(--scm-font-display)' }}>
              All Courses
            </h1>
            <p style={{ color: 'rgba(255,248,238,0.80)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
              Browse practical courses, search by keyword, or filter by category and level.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters bar */}
      <div style={{ background: 'var(--scm-card-bg)', borderBottom: '1px solid var(--scm-border)', padding: '1.25rem 0', position: 'sticky', top: 68, zIndex: 100 }}>
        <div className="container" style={{ maxWidth: '1280px' }}>
          <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="flex-grow-1" style={{ minWidth: 220, maxWidth: 440 }}>
              <SearchBar placeholder="Search courses..." onSearch={handleSearch} className="w-100" />
            </div>
            {!search && (
              <FilterBar
                categories={categories}
                category={category}
                level={level}
                onCategoryChange={(v) => { setCategory(v); setPage(1); }}
                onLevelChange={(v) => { setLevel(v); setPage(1); }}
              />
            )}
            {pagination && !isLoading && (
              <span style={{ fontSize: '0.82rem', color: 'var(--scm-text-secondary)', marginLeft: 'auto', whiteSpace: 'nowrap' }}>
                {pagination.total ?? courses.length} course{courses.length !== 1 ? 's' : ''} found
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Course grid */}
      <div className="container py-5" style={{ maxWidth: '1280px' }}>
        {isLoading ? (
          <div className="row g-4">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-4">
                <div className="card" style={{ height: 340 }}>
                  <div className="skeleton" style={{ height: 180, borderRadius: 'var(--scm-radius) var(--scm-radius) 0 0' }} />
                  <div className="p-3">
                    <div className="skeleton mb-2" style={{ height: 10, width: '55%' }} />
                    <div className="skeleton mb-2" style={{ height: 16, width: '90%' }} />
                    <div className="skeleton" style={{ height: 10, width: '40%' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState
            icon={<FiSearch size={36} />}
            title="No courses found"
            description="Try a different search term or remove filters to see all courses."
          />
        ) : (
          <>
            <motion.div
              className="row g-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {courses.map((course) => (
                <motion.div className="col-12 col-sm-6 col-lg-4" key={course._id} variants={fadeInUp}>
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-5">
              <Pagination pagination={pagination} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
