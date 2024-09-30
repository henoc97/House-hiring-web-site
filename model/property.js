/**
 * Class representing a property.
 */
class Property {
  /**
   * Create a property.
   * @param {number} id - The unique identifier for the property.
   * @param {string} address - The address of the property.
   * @param {string} description - A description of the property.
   * @param {number} price - The price of the property.
   */
  constructor(id, address, description, price) {
    this.id = id;
    this.address = address;
    this.description = description;
    this.price = price;
  }

  /**
   * Convert the property instance to a JSON representation.
   * @returns {Object} The JSON representation of the property.
   */
  toJSON() {
    return {
      id: this.id,
      address: this.address,
      description: this.description,
      price: this.price,
    };
  }

  /**
   * Create a new Property instance from a JSON object.
   * @param {Object} property - The JSON object representing the property.
   * @param {number} property.id - The unique identifier for the property.
   * @param {string} property.address - The address of the property.
   * @param {string} property.description - A description of the property.
   * @param {number} property.price - The price of the property.
   * @returns {Property} A new Property instance.
   */
  static jsonToNewProperty(property) {
    return new Property(
      property.id,
      property.address,
      property.description, // Fixed the property name from 'descriptions' to 'description'
      property.price
    );
  }
}

module.exports = { Property };
