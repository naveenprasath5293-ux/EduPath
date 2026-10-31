import { COURSE_LEVELS } from '../../constants/courseConstants';

export default function FilterBar({ categories = [], category, level, onCategoryChange, onLevelChange, className = '' }) {
  return (
    <div className={`d-flex gap-2 flex-wrap ${className}`}>
      <select
        className="form-select"
        style={{ maxWidth: '200px' }}
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select
        className="form-select"
        style={{ maxWidth: '200px' }}
        value={level}
        onChange={(e) => onLevelChange(e.target.value)}
      >
        <option value="">All Levels</option>
        {COURSE_LEVELS.map((lvl) => (
          <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
        ))}
      </select>
    </div>
  );
}
