const randomstring = require('randomstring'); 


const codeOTP = randomstring.generate({
    length: 6,
    charset: 'numeric'
})

module.exports = codeOTP;