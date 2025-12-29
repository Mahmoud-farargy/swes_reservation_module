import { Notyf } from "notyf"
const notyf = new Notyf()

export const generateId = (prefix = "item") => {
  return (
    prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2)
  )
}

export const refreshApp = () => {
  window.location.reload()
}

export const getCurrentSearchParams = () => {
  return new URLSearchParams(window.location.search)
}

export const urlToObject = (params) => Object.fromEntries(params)

export const objectToUrl = (params, baseUrl = location.pathname) => {
  const queryString = params.toString()
  return `${baseUrl}${queryString ? "?" : ""}${queryString}`
}

export const lowerString = (value) => {
  if (value == null) return ""
  if (typeof value === "number") return String(value)
  return String(value).toLowerCase()
}

export const upperString = (value) => {
  if (value == null) return ""
  if (typeof value === "number") return String(value)
  return String(value).toUpperCase()
}

export const todayISO = () => new Date().toISOString().split("T")[0]

export const clampDate = (value, { min, max }) => {
  if (!value) return value
  if (min && value < min) return min
  if (max && value > max) return max
  return value
}

export const toastify = ({ type, message }) => {
  notyf.open({
    type: type || "info",
    message: message,
    duration: 6000,
  })
}
