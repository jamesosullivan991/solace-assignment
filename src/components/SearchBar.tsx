import { styles } from './SearchBar.styles';

interface SearchBarProps {
  inputValue: string;
  searchTerm: string;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  pagination: {
    page: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export function SearchBar({ 
  inputValue, 
  searchTerm, 
  onSearch, 
  onReset, 
  pagination, 
  onPageChange 
}: SearchBarProps) {
  return (
    <div className={styles.searchSection}>
      <p className={styles.searchLabel}>Search</p>
      <p className={styles.searchTerm}>
        Searching for: <span id="search-term">{searchTerm}</span>
      </p>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input 
            className={styles.searchInput} 
            onChange={onSearch}
            value={inputValue}
            placeholder="Search advocates..."
          />
          <button className={styles.resetButton} onClick={onReset}>
            Reset Search
          </button>
        </div>

        <div className={styles.pagination}>
          <button
            className={styles.paginationButton}
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            ← Previous
          </button>
          <span className={styles.paginationInfo}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            className={styles.paginationButton}
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
} 