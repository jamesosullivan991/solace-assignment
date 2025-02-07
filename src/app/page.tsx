"use client";
import { useEffect, useState, useCallback } from "react";
import { styles } from './styles';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { AdvocatesTable } from '../components/AdvocatesTable';
import { Advocate } from '../types/advocate';
import { PaginationData } from '../types/pagination';
import { SearchBar } from '../components/SearchBar';

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

  const fetchAdvocates = async (page: number, search: string, signal: AbortSignal) => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/api/advocates', {
        params: {
          page,
          search
        },
        signal
      });
      setAdvocates(data.data);
      setFilteredAdvocates(data.data);
      setPagination(data.pagination);
    } catch (err) {
      if (axios.isAxiosError(err) && err.name === 'CanceledError') return;
      
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
    const controller = new AbortController();
    fetchAdvocates(pagination.page, searchTerm, controller.signal);
    return () => controller.abort();
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
      <SearchBar 
        inputValue={inputValue}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onReset={handleReset}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

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
        <AdvocatesTable advocates={filteredAdvocates} />
      )}
    </main>
  );
}
