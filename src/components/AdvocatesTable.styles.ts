export const styles = {
  table: "min-w-full border-collapse",
  tableHeader: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 bg-gray-50",
  tableRow: "hover:bg-gray-50 border-b border-gray-200",
  tableCell: "px-6 py-4 text-sm text-gray-500",
  tableCellPhone: "px-6 py-4 text-sm text-gray-500 text-right whitespace-nowrap min-w-[140px]",
  tableBody: "bg-white",
  specialtyItem: "inline-block px-2 py-1 mr-1 mb-1 text-xs rounded bg-blue-100 text-blue-800",
  mobileCards: "sm:hidden space-y-4",
  mobileCard: "bg-white p-4 rounded-lg shadow border border-gray-200",
  mobileCardField: "flex justify-between items-center py-2",
  mobileCardLabel: "text-sm font-medium text-gray-500",
  mobileCardValue: "text-sm text-gray-900",
  specialtiesContainer: "flex flex-wrap justify-end gap-1",
  specialtiesWrapper: "flex flex-wrap gap-1",
  showMoreButton: "inline-block px-2 py-1 text-xs rounded bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer",
} as const; 