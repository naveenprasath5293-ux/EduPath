export default function Pagination({ pagination, onPageChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages } = pagination;

  const pages = [];
  const windowSize = 2;
  for (let p = Math.max(1, page - windowSize); p <= Math.min(totalPages, page + windowSize); p += 1) {
    pages.push(p);
  }

  return (
    <nav aria-label="Course pagination">
      <ul className="pagination justify-content-center mb-0">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button type="button" className="page-link" onClick={() => onPageChange(page - 1)}>
            Previous
          </button>
        </li>

        {pages[0] > 1 && (
          <>
            <li className="page-item"><button type="button" className="page-link" onClick={() => onPageChange(1)}>1</button></li>
            {pages[0] > 2 && <li className="page-item disabled"><span className="page-link">…</span></li>}
          </>
        )}

        {pages.map((p) => (
          <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
            <button type="button" className="page-link" onClick={() => onPageChange(p)}>{p}</button>
          </li>
        ))}

        {pages[pages.length - 1] < totalPages && (
          <>
            {pages[pages.length - 1] < totalPages - 1 && <li className="page-item disabled"><span className="page-link">…</span></li>}
            <li className="page-item"><button type="button" className="page-link" onClick={() => onPageChange(totalPages)}>{totalPages}</button></li>
          </>
        )}

        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
          <button type="button" className="page-link" onClick={() => onPageChange(page + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
