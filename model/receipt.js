/**
 * Class representing a receipt.
 */
class Receipt {
  /**
   * Create a receipt.
   * @param {number} id - The unique identifier for the receipt.
   * @param {number} sumpayed - The total amount paid.
   * @param {string} monthpayed - The month for which the payment was made.
   * @param {string} date - The date of the receipt.
   */
  constructor(id, sumpayed, monthpayed, date) {
    this.id = id;
    this.sumpayed = sumpayed;
    this.monthpayed = monthpayed;
    this.date = date;
  }

  /**
   * Convert the receipt instance to a JSON representation.
   * @returns {Object} The JSON representation of the receipt.
   */
  toJSON() {
    return {
      id: this.id,
      sumpayed: this.sumpayed,
      monthpayed: this.monthpayed,
      date: this.date,
    };
  }

  /**
   * Create a new Receipt instance from a JSON object.
   * @param {Object} receipt - The JSON object representing the receipt.
   * @param {number} receipt.id - The unique identifier for the receipt.
   * @param {number} receipt.sumpayed - The total amount paid.
   * @param {string} receipt.monthpayed - The month for which the payment was made.
   * @param {string} receipt.date - The date of the receipt.
   * @returns {Receipt} A new Receipt instance.
   */
  static jsonToReceipt(receipt) {
    return new Receipt(
      receipt.id,
      receipt.sumpayed,
      receipt.monthpayed,
      receipt.date
    );
  }
}

module.exports = { Receipt };
