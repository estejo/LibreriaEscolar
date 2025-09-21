function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsUl = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItemsUl.innerHTML = '';

    if (cart.length === 0) {
        cartItemsUl.innerHTML = '<li>El carrito está vacío</li>';
        cartTotal.textContent = '0';
        return;
    }

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

    // Eventos de botones
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

// Cambiar cantidad de un producto
function changeQty(index, delta) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Eliminar producto del carrito
function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', renderCart);


