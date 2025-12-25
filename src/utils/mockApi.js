import { reservations } from "@/data/mockDb";

const simulateRequest = (response, shouldFail = false) => {
  const NETWORK_DELAY = Math.floor(Math.random() * 1500);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if(shouldFail) {
        reject(new Error('Network error. Please try again later!'));
      } else {
        const res = new Response(JSON.stringify(response), {
          headers: { 'Content-Type': 'application/json' }
        })
        resolve(res);
      }
    }, NETWORK_DELAY);
  });
}
export default async function mockApi(endpoint, options = {method: 'GET'}){
  const shouldFail = Math.random() < 0.05;

    if (endpoint === '/api/equipment-history' && options.method === 'GET') {
        return await simulateRequest({status: 200, data: reservations}, shouldFail);
    }

    if (endpoint === '/api/reservations' && options.method === 'POST') {
        const body = JSON.parse(options.body);
        
        // if (!body.employeeId) {
        //     return new Response(JSON.stringify({ error: "Employee ID required" }), { status: 400 });
        // }

        // const newEntry = { id: `RES-${Math.floor(Math.random()*1000)}`, ...body, status: "Pending" };
        // db.reservations.unshift(newEntry);
        // return new Response(JSON.stringify(newEntry), { status: 201 });
    }

    if (endpoint === '/api/notify' && options.method === 'POST') {
        // return new Response(JSON.stringify({ message: "Email Sent" }), { status: 200 });
    }

    // return new Response(JSON.stringify({ error: "Not Found" }), { status: 404 });
    return await simulateRequest({status: 404}, true);
}