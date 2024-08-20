

const mailTest =  function (mail){
    const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(mail)) {
            console.log("false");
            return false;
        }else{
            console.log("true");
            return true;
        }
}

module.exports = mailTest;