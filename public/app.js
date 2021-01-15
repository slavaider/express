const toCurrency = price => {
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency'
    }).format(Number(price));
}
document.querySelectorAll('.price').forEach((el) => {
    el.textContent = toCurrency(el.textContent);
})

const $card = document.getElementById('card')
if ($card) {
    $card.addEventListener('click', (event) => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id
            fetch('/card/remove/' + id, {method: 'DELETE'})
                .then(response => response.json())
                .then(card => {
                    if (card.courses.length) {
                        $card.querySelector('tbody').innerHTML = card.courses.map(c => {
                            return `
                            <tr>
                                <td>${c.title}</td>
                                    <td>${c.count}</td>
                                    <td>
                                        <button class="btn btn-danger small js-remove" data-id="${c.id}">
                                            Удалить
                                        </button>
                                </td>
                            </tr>
                        `
                        }).join('')
                        $card.querySelector('.price').textContent = toCurrency(card.price)
                    } else {
                        $card.innerHTML = 'Корзина пуста'
                    }
                })
        }
    })
}
