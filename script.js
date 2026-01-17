document.getElementById("convertBtn").addEventListener("click", convertCurrency);

function convertCurrency() {
    const from = document.getElementById("fromCurrency").value;
    const to = document.getElementById("toCurrency").value;
    const amount = document.getElementById("amount").value;

    if (amount === "" || amount <= 0) {
        document.getElementById("result").innerText =
            "Please enter a valid amount";
        document.getElementById("rate").innerText = "";
        return;
    }

    // 1️⃣ Fetch exchange rate
    fetch(`http://localhost:5000/rate?from=${from}&to=${to}`)
        .then(res => res.json())
        .then(rateData => {
            if (rateData.error) {
                document.getElementById("rate").innerText = rateData.error;
                return;
            }

            document.getElementById("rate").innerText =
                `1 ${from} = ${rateData.rate} ${to}`;
        });

    // 2️⃣ Fetch converted amount
    fetch(`http://localhost:5000/convert?from=${from}&to=${to}&amount=${amount}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                document.getElementById("result").innerText = data.error;
            } else {
                document.getElementById("result").innerText =
                    `Converted Amount: ${data.convertedAmount}`;
            }
        })
        .catch(() => {
            document.getElementById("result").innerText =
                "Unable to connect to server";
        });
}
