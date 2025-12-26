export const db = {
  equipment: [
    { id: 'EQ-1', name: 'Boots' },
    { id: 'EQ-2', name: 'Helmet' },
    { id: 'EQ-3', name: 'Vest' }
  ],

  reservations: [
    {
      id: 'R-1',
      employeeId: 'EMP-0001',
      equipmentId: 'EQ-1',
      equipmentName: 'Boots',
      reservationDate: '2024-12-20',
      status: 'Returned',
      returnDate: '2024-12-22'
    },
    {
      id: 'R-2',
      employeeId: 'EMP-0002',
      equipmentId: 'EQ-3',
      equipmentName: 'Vest',
      reservationDate: '2024-12-23',
      status: 'Overdue',
      returnDate: '2024-11-22'
    }
  ],

  calendarBlockedDates: [
    { date: '2025-12-25', reason: 'Reserved' },
    { date: '2025-12-28', reason: 'Maintenance' }
  ]
}