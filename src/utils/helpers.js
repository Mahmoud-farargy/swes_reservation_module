import { Notyf } from "notyf"
const notyf = new Notyf()

export const generateId = (prefix = "item") => {
  return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export const getTodayDate = () => {
    const today = new Date().toISOString().split("T")[0];
    return today;
}

export const toastify = ({type, message}) => {
    notyf.open({
        type: type || 'info',
        message: message
    });  
}
