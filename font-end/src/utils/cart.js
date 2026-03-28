const CART_KEY = "cart";

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("getCart error", e);
    return [];
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error("saveCart error", e);
  }
}

export function addToCart(product, qty = 1) {
  if (!product || product.id == null) return;
  const cart = getCart();
  const idx = cart.findIndex((i) => i.id === product.id);
  if (idx !== -1) {
    cart[idx].quantity = (cart[idx].quantity || 1) + qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.img ?? product.image ?? "",
      quantity: qty,
    });
  }
  saveCart(cart);
}

export function updateCartItemQuantity(id, quantity) {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.id === id);
  if (idx === -1) return;
  cart[idx].quantity = Math.max(1, quantity);
  saveCart(cart);
}

export function removeFromCart(id) {
  const cart = getCart().filter((i) => i.id !== id);
  saveCart(cart);
}

export function clearCart() {
  saveCart([]);
}

export default {
  getCart,
  saveCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
};
