import { db } from "@/data/mockDb"
import {
  generateId,
  todayISO,
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
  } = params || {}

  if (path === "/api/equipment-history" && method === "GET") {
    const searchLc = lowerString(search)
    const equipmentLc = lowerString(equipment)
    const excludedStatusSet = new Set(
      excludedStatus
        .split(",")
        .filter(Boolean)
        .map((status) => lowerString(status))
    )

    const filtered = db.reservations?.filter((reservation) => {
      const employeeId = lowerString(reservation.employeeId) ?? ""
      const equipmentId = lowerString(reservation.equipmentId) ?? ""
      const status = lowerString(reservation.status) ?? ""
      const resDate = new Date(reservation.reservationDate).getTime()

      // --- search ---
      const matchesSearch = !searchLc || employeeId.includes(searchLc)

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

    return await simulateRequest({ status: 200, data: filtered }, shouldFail)
  }

  if (path === "/api/reservations" && method === "POST") {
    const body = JSON.parse(options.body)

    if (!body.employeeId) {
      return simulateRequest({ status: 400, error: "Employee ID required" })
    }

    const newEntry = {
      id: generateId("reservation"),
      ...body,
      date: todayISO(),
      status: "Pending",
      returnDate: todayISO(),
    }

    db.reservations.unshift(newEntry)

    return simulateRequest({ status: 201, data: newEntry })
  }

  if (path === "/api/notify" && method === "POST") {
    return await simulateRequest(
      { status: 200, message: "Email Sent Successfully" },
      shouldFail
    )
  }

  return await simulateRequest({ status: 404 }, true)
}
