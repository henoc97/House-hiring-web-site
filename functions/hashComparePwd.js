const bcrypt = require('bcrypt');


const hashPassword = async function (password){
    const saltRounds = 10;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error("Error while hashing password :", error);
        throw new Error("Error while hashing password.")
    }
}

async function comparePasswords(plainPassword, hashedPassword) {
    try {
       const res = await bcrypt.compare(plainPassword, hashedPassword);
       return res;
    } catch (error) {
        console.error('Error during password comparaison:', error);
        return false; 
    }
}

module.exports = {hashPassword, comparePasswords};

(async () => {
    const hashedPwd = await hashPassword('nono');
    console.log(hashedPwd);
})();