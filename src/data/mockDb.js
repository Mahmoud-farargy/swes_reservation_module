export const equipment = [
  { id: 'EQ-1', name: 'Laptop Dell', type: 'Laptop' },
  { id: 'EQ-2', name: 'iPhone 14', type: 'Phone' },
  { id: 'EQ-3', name: 'iPad Pro', type: 'Tablet' }
];

export const reservations = [
  {
    id: 'R-1',
    employeeId: 'EMP-001',
    equipment: "Boots",
    date: '2024-12-20',
    status: 'Returned',
    returnDate: '2024-12-22'
  },
  {
    id: 'R-2',
    employeeId: 'EMP-002',
    equipment: "Vest",
    date: '2024-12-23',
    status: 'Pending',
    returnDate: null
  }
];

export const availability = {
  "2023-12-25": { status: "blocked" }
}