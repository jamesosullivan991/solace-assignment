"use client";
import { useEffect, useState } from "react";
import { styles } from './styles';
import axios from 'axios';

interface Advocate {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: string;
  phoneNumber: string;
}

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdvocates = async () => {
      try {
        const { data: { data } } = await axios.get('/api/advocates');
        setAdvocates(data);
        setFilteredAdvocates(data);
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

    fetchAdvocates();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value.toLowerCase();
    setSearchTerm(newSearchTerm);

    const filtered = advocates.filter((advocate) => {
      return (
        advocate.firstName.toLowerCase().includes(newSearchTerm) ||
        advocate.lastName.toLowerCase().includes(newSearchTerm) ||
        advocate.city.toLowerCase().includes(newSearchTerm) ||
        advocate.degree.toLowerCase().includes(newSearchTerm) ||
        advocate.specialties.some(specialty => 
          specialty.toLowerCase().includes(newSearchTerm)
        ) ||
        advocate.yearsOfExperience.toString().includes(newSearchTerm)
      );
    });

    setFilteredAdvocates(filtered);
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilteredAdvocates(advocates);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Solace Advocates</h1>
      <div className={styles.searchSection}>
        <p className={styles.searchLabel}>Search</p>
        <p className={styles.searchTerm}>
          Searching for: <span id="search-term">{searchTerm}</span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input 
            className={styles.searchInput} 
            onChange={handleSearch}
            value={searchTerm}
            placeholder="Search advocates..."
          />
          <button className={styles.resetButton} onClick={handleReset}>
            Reset Search
          </button>
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
