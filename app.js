let products = [];
let cart = [];

// Clases
class Product {
  constructor({id, title, category, price, img}){
    this.id=id; this.title=title; this.category=category; this.price=price; this.img=img;
  }
}
class CartItem{
  constructor(product, qty=1){ this.product=product; this.qty=qty; }
}

// Render productos
function renderProducts(list){
  const container=document.getElementById('products');
  container.innerHTML='';
  list.forEach(p=>{
    const card=document.createElement('div');
    card.className='card';
    card.innerHTML=`
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.category} - $${p.price}</p>
      <div class="actions">
        <button class="add-btn" data-id="${p.id}">Agregar al carrito</button>
      </div>`;
    container.appendChild(card);
  });
  // Agregar evento a cada botón
  document.querySelectorAll('.add-btn').forEach(btn=>{
    btn.addEventListener('click',()=> addToCart(Number(btn.dataset.id)));
  });
}

// Render carrito
function renderCart(){
  const cartSection=document.getElementById('cart');
  const cartItemsUl=document.getElementById('cart-items');
  const cartTotal=document.getElementById('cart-total');

  cartItemsUl.innerHTML='';
  cart.forEach((item,i)=>{
    const li=document.createElement('li');
    li.innerHTML=`
      ${item.product.title} - $${item.product.price} x ${item.qty} = $${item.qty*item.product.price}
      <button class="inc-btn" data-index="${i}">+</button>
      <button class="dec-btn" data-index="${i}">-</button>
      <button class="del-btn" data-index="${i}">Eliminar</button>
    `;
    cartItemsUl.appendChild(li);
  });

  cartTotal.textContent=cart.reduce((a,c)=>a+c.qty*c.product.price,0);
  cartSection.classList.remove('hidden');

  // Eventos de botones
  document.querySelectorAll('.inc-btn').forEach(btn=>{
    btn.addEventListener('click',()=> changeQty(Number(btn.dataset.index),1));
  });
  document.querySelectorAll('.dec-btn').forEach(btn=>{
    btn.addEventListener('click',()=> changeQty(Number(btn.dataset.index),-1));
  });
  document.querySelectorAll('.del-btn').forEach(btn=>{
    btn.addEventListener('click',()=> removeItem(Number(btn.dataset.index)));
  });
}

// Agregar productos al carrito
function addToCart(id){
  const prod=products.find(p=>p.id===id);
  const item=cart.find(ci=>ci.product.id===id);
  if(item){ item.qty++; } else { cart.push(new CartItem(prod,1)); }
  updateCartUI();
  renderCart();
}

// Cambiar cantidad
function changeQty(index, delta){
  cart[index].qty += delta;
  if(cart[index].qty<=0) removeItem(index);
  updateCartUI();
  renderCart();
}

// Eliminar item
function removeItem(index){
  cart.splice(index,1);
  updateCartUI();
  renderCart();
}

// Actualizar contador
function updateCartUI(){
  document.getElementById('cart-count').textContent=cart.reduce((a,c)=>a+c.qty,0);
}

// Eventos
document.getElementById('view-cart-btn').addEventListener('click',renderCart);
document.getElementById('close-cart').addEventListener('click',()=> document.getElementById('cart').classList.add('hidden'));

document.getElementById('search-input').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase();
  renderProducts(products.filter(p=>p.title.toLowerCase().includes(q)));
});
document.getElementById('category-filter').addEventListener('change',e=>{
  const v=e.target.value;
  renderProducts(v==='all'?products:products.filter(p=>p.category===v));
});
document.getElementById('reload-btn').addEventListener('click',loadProducts);

// Cargar productos desde JSON
async function loadProducts(){
  try{
    const res=await fetch('products.json');
    const data=await res.json();
    products=data.map(d=>new Product(d));
    renderProducts(products);
    renderCategories();
  }catch(err){
    console.error("Error al cargar products.json", err);
  }
}

// Render categorías
function renderCategories(){
  const select=document.getElementById('category-filter');
  const cats=[...new Set(products.map(p=>p.category))];
  select.innerHTML='<option value="all">Todas las categorías</option>';
  cats.forEach(c=>{
    const op=document.createElement('option');
    op.value=c; op.textContent=c; select.appendChild(op);
  });
}

// Inicialización
loadProducts();

