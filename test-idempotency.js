const sendRequest = async () => {
   
   
const response = await fetch("http://localhost:3000/api/events", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWMzYTc0ZjM0YjRhNjViMGE4ZWZhNTYiLCJpYXQiOjE3OTE0NTg3ODksImV4cCI6MTc5MTU0NTE4OX0.wcSf0W1e2tTvcabn4GlEoBJO_wbr_ltwl8U0CwULNEw",
            "Idempotency-Key": "simultaneous-test-001"
        },
        body: JSON.stringify({
            type: "invoice.paid",
            data: {
                invoiceId: "INV-999",
                amount: 5000
            }
        })
    });

    return {
        status: response.status,
        body: await response.json()
    };
};

const requests = [];

for (let i = 0; i < 10; i++) {
    requests.push(sendRequest());
}

const results = await Promise.all(requests);

console.log(results);