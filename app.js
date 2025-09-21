// Variables globales
let products = [];

// Clases
class Product {
  constructor({id, title, category, price, img}) {
    this.id = id;
    this.title = title;
    this.category = category;
    this.price = price;
    this.img = img;
  }
}


function renderProducts(list) {
  const container = document.getElementById('products');
  container.innerHTML = '';
  
  list.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.category} - $${p.price}</p>
      <div class="actions">
        <button class="add-btn" data-id="${p.id}">Agregar al carrito</button>
      </div>
    `;
    container.appendChild(card);
  });

  // Asignar evento a los botones de agregar
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => addToCart(Number(btn.dataset.id)));
  });
}

// Función para cargar productos desde JSON
async function loadProducts() {
  try {
    const res = await fetch('./products.json');
    const data = await res.json();
    products = data.map(d => new Product(d));
    renderProducts(products);
    renderCategories();
  } catch (err) {
    console.error("Error al cargar products.json:", err);
  }
}

// Render categorías en el select
function renderCategories() {
  const select = document.getElementById('category-filter');
  const categories = [...new Set(products.map(p => p.category))];
  select.innerHTML = '<option value="all">Todas las categorías</option>';
  categories.forEach(c => {
    const option = document.createElement('option');
    option.value = c;
    option.textContent = c;
    select.appendChild(option);
  });
}

// Buscar productos por nombre
document.getElementById('search-input').addEventListener('input', e => {
  const query = e.target.value.toLowerCase();
  renderProducts(products.filter(p => p.title.toLowerCase().includes(query)));
});

// Filtrar por categoría
document.getElementById('category-filter').addEventListener('change', e => {
  const cat = e.target.value;
  renderProducts(cat === 'all' ? products : products.filter(p => p.category === cat));
});

// Botón recargar productos
document.getElementById('reload-btn').addEventListener('click', loadProducts);

// Función agregar productos al carrito (guardado en localStorage)
function addToCart(id) {
  const prod = products.find(p => p.id === id);
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const index = cart.findIndex(ci => ci.product.id === id);

  if (index > -1) {
    cart[index].qty++;
  } else {
    cart.push({ product: prod, qty: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Actualizar contador de carrito en la página
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  document.getElementById('cart-count').textContent = cart.reduce((a, c) => a + c.qty, 0);
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  updateCartCount();
});
