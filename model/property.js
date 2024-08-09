
class Property{
    constructor(id, address, description, price) {
        this.id = id;
        this.address = address;
        this.description = description;
        this.price = price;
    }

    toJSON() {
        return {
            "id": this.id,
            "address": this.address,
            "description": this.description,
            "price": this.price
        };
    }


    static jsonTONewProperty(property){
        return new Property(
            property.id, 
            property.address, 
            property.descriptions, 
            property.price
        );
    }
}


module.exports = {Property}