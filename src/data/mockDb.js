export const db = {
  equipment: [
    { id: "EQ-1", name: "Boots" },
    { id: "EQ-2", name: "Vest" },
    { id: "EQ-3", name: "Helmet" },
  ],

  reservations: [
    {
      id: "R-1",
      employeeId: "EMP-0001",
      equipmentId: "EQ-1",
      equipmentName: "Boots",
      reservationDate: "2025-12-20",
      status: "Returned",
    },
    {
      id: "R-2",
      employeeId: "EMP-0002",
      equipmentId: "EQ-2",
      equipmentName: "Vest",
      reservationDate: "2025-12-23",
      status: "Overdue",
    },
  ],

  calendarBlockedDates: [
    { date: "2025-12-25", reason: "Reserved" },
    { date: "2025-12-28", reason: "Maintenance" },
  ],
}
