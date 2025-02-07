"use client";
import { useEffect, useState, useCallback } from "react";
import { styles } from './styles';
import axios from 'axios';
import debounce from 'lodash/debounce';

interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: string;
  phoneNumber: string;
}

interface PaginationData {
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    totalPages: 1,
    hasMore: false
  });

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      setSearchTerm(term);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 300),
    []
  );

  const fetchAdvocates = async (page: number, search: string) => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/api/advocates', {
        params: {
          page,
          search
        }
      });
      setAdvocates(data.data);
      setFilteredAdvocates(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(
        axios.isAxiosError(err) 
          ? err.response?.data?.message || err.message
          : 'Failed to fetch advocates'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvocates(pagination.page, searchTerm);
  }, [pagination.page, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toLowerCase();
    setInputValue(newValue);
    debouncedSearch(newValue);
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handleReset = () => {
    setInputValue('');
    setSearchTerm('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Solace Advocates</h1>
      <div className={styles.searchSection}>
        <p className={styles.searchLabel}>Search</p>
        <p className={styles.searchTerm}>
          Searching for: <span id="search-term">{searchTerm}</span>
        </p>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input 
              className={styles.searchInput} 
              onChange={handleSearch}
              value={inputValue}
              placeholder="Search advocates..."
            />
            <button className={styles.resetButton} onClick={handleReset}>
              Reset Search
            </button>
          </div>

          <div className={styles.pagination}>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              ← Previous
            </button>
            <span className={styles.paginationInfo}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasMore}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingText}>Loading advocates...</div>
        </div>
      ) : error ? (
        <div className={styles.errorContainer}>
          <div className={styles.errorText}>Error: {error}</div>
        </div>
      ) : filteredAdvocates.length === 0 ? (
        <div className={styles.noResultsContainer}>
          <div className={styles.noResultsText}>No advocates found</div>
          <div className={styles.noResultsSubText}>
            Try adjusting your search terms or {' '}
            <button 
              onClick={handleReset} 
              className={styles.resetLink}
            >
              reset the search
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.tableHeader}>First Name</th>
                <th className={styles.tableHeader}>Last Name</th>
                <th className={styles.tableHeader}>City</th>
                <th className={styles.tableHeader}>Degree</th>
                <th className={styles.tableHeader}>Specialties</th>
                <th className={styles.tableHeader + " text-right"}>Years of Experience</th>
                <th className={styles.tableHeader + " text-right"}>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdvocates.map((advocate) => (
                <tr className={styles.tableRow}>
                  <td className={styles.tableCell}>{advocate.firstName}</td>
                  <td className={styles.tableCell}>{advocate.lastName}</td>
                  <td className={styles.tableCell}>{advocate.city}</td>
                  <td className={styles.tableCell}>{advocate.degree}</td>
                  <td className={styles.tableCell}>
                    {advocate.specialties.map((s) => (
                      <div className={styles.specialtyItem}>{s}</div>
                    ))}
                  </td>
                  <td className={styles.tableCell + " text-right"}>{advocate.yearsOfExperience}</td>
                  <td className={styles.tableCell + " text-right"}>{advocate.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile Cards */}
          <div className={styles.mobileCards}>
            {filteredAdvocates.map((advocate) => (
              <div className={styles.mobileCard}>
                <div className={styles.mobileCardField}>
                  <span className={styles.mobileCardLabel}>Name</span>
                  <span className={styles.mobileCardValue}>{advocate.firstName} {advocate.lastName}</span>
                </div>
                <div className={styles.mobileCardField}>
                  <span className={styles.mobileCardLabel}>City</span>
                  <span className={styles.mobileCardValue}>{advocate.city}</span>
                </div>
                <div className={styles.mobileCardField}>
                  <span className={styles.mobileCardLabel}>Degree</span>
                  <span className={styles.mobileCardValue}>{advocate.degree}</span>
                </div>
                <div className={styles.mobileCardField}>
                  <span className={styles.mobileCardLabel}>Years of Experience</span>
                  <span className={styles.mobileCardValue}>{advocate.yearsOfExperience}</span>
                </div>
                <div className={styles.mobileCardField}>
                  <span className={styles.mobileCardLabel}>Phone</span>
                  <span className={styles.mobileCardValue}>{advocate.phoneNumber}</span>
                </div>
                <div className={styles.mobileCardField}>
                  <span className={styles.mobileCardLabel}>Specialties</span>
                  <div className="flex flex-wrap justify-end gap-1">
                    {advocate.specialties.map((s) => (
                      <div className={styles.specialtyItem}>{s}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
