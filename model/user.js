/**
 * Class representing a user.
 */
class User {
    /**
     * Create a user.
     * @param {number} id - The unique identifier for the user.
     * @param {string} firstname - The first name of the user.
     * @param {string} lastname - The last name of the user.
     * @param {string} email - The email address of the user.
     * @param {string} pwd - The password of the user.
     * @param {string} contactmoov - The Moov contact number of the user.
     * @param {string} contacttg - The Togo contact number of the user.
     * @param {number} sold - The balance or sold of the user.
     */
    constructor(id, firstname, lastname, email, pwd, contactmoov, contacttg, sold) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.pwd = pwd;
        this.contactmoov = contactmoov;
        this.contacttg = contacttg;
        this.sold = sold;
    }

    /**
     * Convert the user instance to a JSON representation.
     * @returns {Object} The JSON representation of the user.
     */
    toJson() {
        return {
            id: this.id,
            firstname: this.firstname,
            lastname: this.lastname,
            email: this.email,
            pwd: this.pwd,
            contactmoov: this.contactmoov,
            contacttg: this.contacttg,
            sold: this.sold
        };
    }

    /**
     * Create a new User instance from a JSON object.
     * @param {Object} user - The JSON object representing the user.
     * @param {number} user.id - The unique identifier for the user.
     * @param {string} user.firstname - The first name of the user.
     * @param {string} user.lastname - The last name of the user.
     * @param {string} user.email - The email address of the user.
     * @param {string} user.pwd - The password of the user.
     * @param {string} user.contactmoov - The Moov contact number of the user.
     * @param {string} user.contacttg - The Togo contact number of the user.
     * @param {number} user.sold - The balance or sold of the user.
     * @returns {User} A new User instance.
     */
    static jsonToNewUser(user) {
        return new User(
            user.id,
            user.firstname,
            user.lastname,
            user.email,
            user.pwd,
            user.contactmoov,
            user.contacttg,
            user.sold
        );
    }
}

module.exports = { User };
