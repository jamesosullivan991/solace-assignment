"use client";

import { useEffect, useState } from "react";
import { styles } from './styles';

export default function Home() {
  const [advocates, setAdvocates] = useState([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState([]);

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e) => {
    const searchTerm = e.target.value;

    document.getElementById("search-term").innerHTML = searchTerm;

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        advocate.specialties.includes(searchTerm) ||
        advocate.yearsOfExperience.includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Solace Advocates</h1>
      <div className={styles.searchSection}>
        <p className={styles.searchLabel}>Search</p>
        <p className={styles.searchTerm}>
          Searching for: <span id="search-term"></span>
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input className={styles.searchInput} onChange={onChange} />
          <button className={styles.resetButton} onClick={onClick}>
            Reset Search
          </button>
        </div>
      </div>

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
    </main>
  );
}
