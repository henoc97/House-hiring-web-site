
class User{
    
    constructor(id, firstname, lastname, email, pwd, contactmoov, contacttg, sold){
            this.userID = id;
            this.firstname = firstname;
            this.lastname = lastname;
            this.email = email;
            this.pwd = pwd;
            this.contactmoov = contactmoov;
            this.contacttg = contacttg;
            this.sold = sold;
    }


    toJson(){
        return {
            "id": this.userID,
            "firstname": this.firstname,
            "lastname": this.lastname,
            "email" : this.email,
            "pwd" : this.pwd,
            "contactmoov" : this.contactmoov,
            "contacttg" : this.contacttg,
            "sold" : this.sold
        }
    }

    static jsonToNewUser (user) {
        const  newUser = new User(
            user.id,
            user.firstname,
            user.lastname,
            user.email,
            user.pwd,
            user.contactmoov,
            user.contacttg,
            user.sold
            );
        return newUser;
    }
}

module.exports = {User}