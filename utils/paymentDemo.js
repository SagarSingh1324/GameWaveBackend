/**
 * Simulates checking if a transaction ID is new.
 *
 * @param {Mongoose.Model} orderModel - Your Order mongoose model.
 * @param {string} transactionId - Unique ID from your frontend (can be fake for demo).
 * @returns {Promise<boolean>} True if transaction is new.
 */
export async function checkIfNewTransaction(orderModel, transactionId) {
  try {
    const orders = await orderModel.find({
      'paymentResult.id': transactionId,
    });
    return orders.length === 0;
  } catch (err) {
    console.error('Error checking transaction:', err);
    throw err;
  }
}

/**
 * Simulates verifying a payment. Always returns successful result in demo.
 *
 * @param {string} transactionId - Fake or generated transaction ID.
 * @param {string} paymentMethod - Payment method: "Credit Card", "UPI", "COD", etc.
 * @returns {Promise<Object>} A mock verification result.
 */
export async function verifyPaymentDemo(transactionId, paymentMethod) {
  // You can add custom logic here based on the method
  if (paymentMethod === 'COD') {
    return {
      verified: true,
      value: null, // no upfront value
    };
  }

  // Simulate online payment success
  return {
    verified: true,
    value: '1000.00', // demo amount
  };
}
