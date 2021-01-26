const keys = require('../keys');
module.exports = function (to) {
    return {
        to,
        from: keys.EMAIL_FROM,
        subject: 'Register Success',
        html: `
        <h1>Добро пожаловать в наш магазин</h1>
        <p>Вы успешно создали аккаунт с email: ${to}</p>
        <hr>
        <a href=${keys.BASE_URL}>Магазин</a>
        `
    }
}
