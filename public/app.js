const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(Number(price));
}
document.querySelectorAll('.price').forEach((el) => {
    el.textContent = toCurrency(el.textContent);
})

const $cart = document.getElementById('cart')
if ($cart) {
    $cart.addEventListener('click', (event) => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id
            const csrf = event.target.dataset.csrf
            fetch('/cart/remove/' + id, {
                method: 'DELETE',
                headers: {
                    'X-XSRF-TOKEN': csrf
                }
            })
                .then(response => response.json())
                .then(cart => {
                    if (cart.items.length) {
                        $cart.querySelector('tbody').innerHTML = cart.items.map(c => {
                            return `
                            <tr>
                                <td>${c.title}</td>
                                    <td>${c.count}</td>
                                    <td>
                                        <button class="btn btn-danger small js-remove" 
                                        data-csrf="${csrf}"
                                        data-id="${c.id}">
                                            Удалить
                                        </button>
                                </td>
                            </tr>
                        `
                        }).join('')
                        $cart.querySelector('.price').textContent = toCurrency(cart.price)
                    } else {
                        $cart.innerHTML = 'Корзина пуста'
                    }
                })
        }
    })
}
const toDate = (date) => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date(date))
}

document.querySelectorAll('.date').forEach((el) => {
    el.textContent = toDate(el.textContent);
})

M.Tabs.init(document.querySelectorAll('.tabs'));
