import { db } from "@/data/mockDb"
import { API } from "@/constants/api"
import {
  generateId,
  urlToObject,
  lowerString,
  upperString,
} from "@/utils/helpers"

const simulateRequest = (response, shouldFail = false) => {
  const NETWORK_DELAY = Math.floor(Math.random() * 1500)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Network error. Please try again later!"))
      } else {
        const res = new Response(JSON.stringify(response), {
          headers: { "Content-Type": "application/json" },
        })
        resolve(res)
      }
    }, NETWORK_DELAY)
  })
}

export default async function mockApi(endpoint, options = { method: "GET" }) {
  const method = upperString(options.method ?? "GET")
  const shouldFail = Math.random() < 0.01 //simulate a very low chance of failure
  const [path, queryString] = endpoint.split("?") || ["", ""]
  const params = urlToObject(new URLSearchParams(queryString))
  const {
    search = "",
    equipment = "",
    dateFrom = "",
    dateTo = "",
    excludedStatus = "",
    sortBy = "",
    page = 1,
    limit = 10,
  } = params || {}

  if (path === API.EQUIPMENT_HISTORY && method === "GET") {
    const searchLc = lowerString(search)
    const equipmentLc = lowerString(equipment)
    const excludedStatusSet = new Set(
      excludedStatus
        .split(",")
        .filter(Boolean)
        .map((status) => lowerString(status))
    )

    const allReservations = db.reservations || []

    // 1) FILTERING
    const filteredItems = allReservations.filter((reservation) => {
      const employeeId = lowerString(reservation.employeeId) ?? ""
      const equipmentId = lowerString(reservation.equipmentId) ?? ""
      const status = lowerString(reservation.status) ?? ""
      const resDate = new Date(reservation.reservationDate).getTime()

      // --- search ---
      const matchesSearch = !searchLc || employeeId.includes(searchLc) || reservation.id?.includes(searchLc) 

      // --- equipment ---
      const matchesEquipment = !equipmentLc || equipmentId === equipmentLc

      // --- status exclusion ---
      const matchesStatus =
        !excludedStatusSet.size || !excludedStatusSet.has(status)

      // --- date range ---
      let matchesDate = true

      if (dateFrom) {
        const from = new Date(dateFrom).getTime()
        matchesDate = matchesDate && resDate >= from
      }

      if (dateTo) {
        const to = new Date(dateTo).getTime()
        matchesDate = matchesDate && resDate <= to
      }

      return matchesSearch && matchesEquipment && matchesStatus && matchesDate
    })

    // 2) SORTING
    const order = params?.order === "desc" ? "desc" : "asc"

    const sortedItems = [...filteredItems].sort((a, b) => {
      if (!sortBy) return 0

      let valueA = a[sortBy]
      let valueB = b[sortBy]

      switch (sortBy) {
        case "employeeId":
          valueA = parseInt(valueA.replace(/\D+/g, ""), 10)
          valueB = parseInt(valueB.replace(/\D+/g, ""), 10)
          break
        case "reservationDate":
          valueA = new Date(valueA)
          valueB = new Date(valueB)
          break
        case "equipmentName":
        case "status":
          valueA = lowerString(valueA)
          valueB = lowerString(valueB)
          break
        default:
          valueA = lowerString(valueA)
          valueB = lowerString(valueB)
      }

      const dir = order === "asc" ? 1 : -1

      if (valueA > valueB) return dir
      if (valueA < valueB) return -dir
      return 0

    })

    // 3) PAGINATION
    const totalItems = sortedItems.length
    const pageSize = Number(limit)
    const currentPage = Math.max(Number(page), 1)
    const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1)

    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize

    const paginatedItems = sortedItems.slice(startIndex, endIndex)

    const pagination = {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
    }

    return await simulateRequest(
      { status: 200, data: paginatedItems, pagination },
      shouldFail
    )
  }

  if (path === API.RESERVATIONS && method === "POST") {
    const body = JSON.parse(options.body)

    if (!body.employeeId) {
      return simulateRequest({ status: 400, error: "Employee ID required" })
    }

    const newReservationEntry = {
      id: generateId("reservation"),
      ...body,
      returnDate: null,
      status: "Pending",
    }
    const newCalendarEventEntry = {
      date: body.reservationDate,
      reason: "Reserved"
    }

    db.reservations.unshift(newReservationEntry)
    db.calendarBlockedDates.unshift(newCalendarEventEntry)

    return simulateRequest({ status: 201, data: newReservationEntry })
  }

  if (path === API.NOTIFY && method === "POST") {
    return await simulateRequest(
      { status: 200, message: "Email Sent Successfully" },
      shouldFail
    )
  }

  if (path === API.EQUIPMENT_CATEGORIES && method === "GET") {
    return await simulateRequest(
      { status: 200, data: db.equipment },
      shouldFail
    )
  }

  if (path === API.CALENDAR_BLOCKED_DATES && method === "GET") {
    return await simulateRequest(
      { status: 200, data: db.calendarBlockedDates },
      shouldFail
    )
  }


  return await simulateRequest({ status: 404 }, true)
}
