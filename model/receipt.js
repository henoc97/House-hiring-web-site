

class Receipt{
    constructor(id, sumpayed, monthpayed, date) {
        this.id = id;
        this.sumpayed = sumpayed;
        this.monthpayed = monthpayed;
        this.date = date;
    }


    toJSON(){
        return {
            id: this.id,
            sumpayed: this.sumpayed,
            monthpayed: this.monthpayed,
            date: this.date
        }
    }

    jsonToReceipt(){
        return new Receipt(
            this.id, 
            this.sumpayed, 
            this.monthpayed, 
            this.date
        );
    }
}


module.exports = {Receipt}