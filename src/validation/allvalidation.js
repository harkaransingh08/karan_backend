export const validName = (name) => {
    const nameRe = /^[A-Za-z ]{2,50}$/;
    return nameRe.test(name)
}
export const validwmail = (email) => {
    const emailRe = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRe.test(email)

}
export const validpassword = (pass) => {
    const passRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?& ]{8,}$/;
    return passRe.test(pass)

}