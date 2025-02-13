const baseURL = 'http://localhost:3002'

const users = '/users'
const orders = '/orders'
const groups = '/groups'
const logIn = '/auth/sign-in'
const createUser = '/auth/sign-up'
const creatPassword = 'auth/set-password'
const creatNewPassword = 'auth/set-NewPassword'
const usersActivate = '/auth/send-activation-link'
const recoverPassword = '/auth/send-recovery-link';
const usersBan = '/users/ban'
const usersUnBan = '/users/unban'
const refreshToken = "/auth/refresh-token";


const urls = {
    logIn,
    orders,
    users,
    groups,
    createUser,
    usersBan,
    usersUnBan,
    usersActivate,
    recoverPassword,
    creatPassword,
    creatNewPassword,
    refreshToken
}
export {
    baseURL,
    urls
}