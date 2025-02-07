import { useState } from 'react';
import { styles } from './AdvocatesTable.styles';
import { Advocate } from '../types/advocate';
import { parsePhoneNumber } from 'libphonenumber-js';

interface AdvocatesTableProps {
  advocates: Advocate[];
}

const INITIAL_SHOW_COUNT = 3;

const formatPhoneNumber = (phoneNumber: string) => {
  try {
    return parsePhoneNumber(phoneNumber, 'US').formatNational();
  } catch (error) {
    return phoneNumber;
  }
};

export function AdvocatesTable({ advocates }: AdvocatesTableProps) {
  return (
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
            <th className={`${styles.tableHeader} text-right`}>Years of Experience</th>
            <th className={`${styles.tableHeader} text-right`}>Phone Number</th>
          </tr>
        </thead>
        <tbody className={styles.tableBody}>
          {advocates.map((advocate) => (
            <tr key={advocate.id} className={styles.tableRow}>
              <td className={styles.tableCell}>{advocate.firstName}</td>
              <td className={styles.tableCell}>{advocate.lastName}</td>
              <td className={styles.tableCell}>{advocate.city}</td>
              <td className={styles.tableCell}>{advocate.degree}</td>
              <td className={styles.tableCell}>
                {advocate.specialties.map((s) => (
                  <div key={s} className={styles.specialtyItem}>{s}</div>
                ))}
              </td>
              <td className={`${styles.tableCell} text-right`}>{advocate.yearsOfExperience}</td>
              <td className={styles.tableCellPhone}>{formatPhoneNumber(advocate.phoneNumber)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className={styles.mobileCards}>
        {advocates.map((advocate) => (
          <div key={advocate.id} className={styles.mobileCard}>
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
              <span className={styles.mobileCardValue}>{formatPhoneNumber(advocate.phoneNumber)}</span>
            </div>
            <div className={styles.mobileCardField}>
              <span className={styles.mobileCardLabel}>Specialties</span>
              <div className="flex flex-wrap justify-end gap-1">
                {advocate.specialties.map((s) => (
                  <div key={s} className={styles.specialtyItem}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
} 