const keys = require('../keys');
module.exports = function (to, token) {
    return {
        to,
        from: keys.EMAIL_FROM,
        subject: 'Reset Password',
        html: `
        <h1>Восстановление пароля</h1>
        <p>Если нет, то проигнорируйте данное письмо</p>
        <p>Иначе нажмите на ссылку ниже:</p>
        <p><a href=${keys.BASE_URL}/auth/password/${token}>Восстановить пароль</a></p>
        <hr>
        <a href=${keys.BASE_URL}>Магазин</a>
        `
    }
}

