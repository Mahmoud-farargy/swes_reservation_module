import { db } from "@/data/mockDb"
import { generateId, getTodayDate } from "@/utils/helpers"

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
  const shouldFail = Math.random() < 0.05

  if (endpoint === "/api/equipment-history" && options.method === "GET") {
    return await simulateRequest(
      { status: 200, data: db.reservations },
      shouldFail
    )
  }

  if (endpoint === "/api/reservations" && options.method === "POST") {
    const body = JSON.parse(options.body)

    if (!body.employeeId) {
      return simulateRequest({ status: 400, error: "Employee ID required" })
    }

    const newEntry = {
      id: generateId("reservation"),
      ...body,
      date: getTodayDate(),
      status: "Pending",
      returnDate: getTodayDate(),
    }

    db.reservations.unshift(newEntry)

    return simulateRequest({ status: 201, data: newEntry })
  }

  if (endpoint === "/api/notify" && options.method === "POST") {
    return await simulateRequest(
      { status: 200, message: "Email Sent Successfully" },
      shouldFail
    )
  }

  return await simulateRequest({ status: 404 }, true)
}
