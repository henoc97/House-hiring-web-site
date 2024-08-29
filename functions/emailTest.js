

const mailTest =  function (mail){
    const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(mail)) {
            return false;
        }else{
            return true;
        }
}

module.exports = mailTest;