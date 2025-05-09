
// fetch payment type mast 
export const fetchPaymentTypeRecords = async () => {
  try {
    const res = await fetch("api/paymenttype");
    const data = await res.json();
    const paymentmast = Array.from(new Set(data.filter((item) => item.status == "Active").map((item) => item.payment)));
    return paymentmast
    // setPaymentType(paymentmast);
  } catch (err) {
    return console.error("Failed to fetch records:", err);
  }
};