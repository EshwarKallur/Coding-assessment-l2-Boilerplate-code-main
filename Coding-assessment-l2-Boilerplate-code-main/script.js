// Fetch cart data from API and render items
async function fetchCartData() {
  try {
    const response = await fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889');
    const data = await response.json();
    renderCartItems(data.items);
    updateTotals(data);
  } catch (error) {
    console.error('Error fetching cart data:', error);
  }
}

// Render cart items dynamically
function renderCartItems(items) {
  const cartContainer = document.getElementById('cart-container');
  cartContainer.innerHTML = '';

  items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <img src="${item.image}" alt="${item.title}" width="60">
        <p>${item.title}</p>
      </td>
      <td>₹${(item.price / 100).toLocaleString('en-IN')}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input">
      </td>
      <td>₹<span class="item-subtotal" data-id="${item.id}">${((item.price * item.quantity) / 100).toLocaleString('en-IN')}</span></td>
      <td><button class="remove-item" data-id="${item.id}">🗑️</button></td>
    `;
    cartContainer.appendChild(row);
  });

  attachEventListeners();
}

// Update subtotal and total
function updateTotals(data) {
  const subtotal = data.original_total_price / 100;
  document.getElementById('subtotal').innerText = `₹${subtotal.toLocaleString('en-IN')}`;
  document.getElementById('total').innerText = `₹${subtotal.toLocaleString('en-IN')}`;
}

// Attach event listeners for quantity change and remove button
function attachEventListeners() {
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', handleQuantityChange);
  });

  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', handleRemoveItem);
  });
}

// Handle quantity change
function handleQuantityChange(event) {
  const itemId = event.target.getAttribute('data-id');
  const newQuantity = parseInt(event.target.value);
  const itemSubtotal = document.querySelector(`.item-subtotal[data-id="${itemId}"]`);
  const price = parseInt(event.target.closest('tr').querySelector('td:nth-child(2)').innerText.replace(/₹|,/g, ''));

  itemSubtotal.innerText = `₹${(price * newQuantity).toLocaleString('en-IN')}`;
  recalculateTotals();
}

// Handle item removal
function handleRemoveItem(event) {
  const itemId = event.target.getAttribute('data-id');
  event.target.closest('tr').remove();
  recalculateTotals();
}

// Recalculate total price after changes
function recalculateTotals() {
  let total = 0;
  document.querySelectorAll('.item-subtotal').forEach(subtotal => {
    total += parseInt(subtotal.innerText.replace(/₹|,/g, ''));
  });

  document.getElementById('subtotal').innerText = `₹${total.toLocaleString('en-IN')}`;
  document.getElementById('total').innerText = `₹${total.toLocaleString('en-IN')}`;
}

// Checkout button
const checkoutBtn = document.getElementById('checkout-btn');
checkoutBtn.addEventListener('click', () => {
  alert('Proceeding to checkout!');
});

// Initialize cart on page load
window.onload = fetchCartData;

attachEventListeners();
