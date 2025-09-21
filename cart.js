function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsUl = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItemsUl.innerHTML = '';
    cart.forEach((item, i) => {
        const li = document.createElement('li');
        li.innerHTML = `
      ${item.product.title} - $${item.product.price} x ${item.qty} = $${item.qty * item.product.price}
      <button class="inc-btn" data-index="${i}">+</button>
      <button class="dec-btn" data-index="${i}">-</button>
      <button class="del-btn" data-index="${i}">Eliminar</button>
    `;
        cartItemsUl.appendChild(li);
    });

    cartTotal.textContent = cart.reduce((a, c) => a + c.qty * c.product.price, 0);

    document.querySelectorAll('.inc-btn').forEach(btn => {
        btn.addEventListener('click', () => changeQty(Number(btn.dataset.index), 1));
    });
    document.querySelectorAll('.dec-btn').forEach(btn => {
        btn.addEventListener('click', () => changeQty(Number(btn.dataset.index), -1));
    });
    document.querySelectorAll('.del-btn').forEach(btn => {
        btn.addEventListener('click', () => removeItem(Number(btn.dataset.index)));
    });
}

function changeQty(index, delta) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

document.addEventListener('DOMContentLoaded', renderCart);
