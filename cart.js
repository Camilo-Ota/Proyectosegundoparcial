// Función para agregar un elemento al carrito
function addToCart(item) {
    const cart = getCart(); // Obtener el carrito desde localStorage
    let itemExists = false;

    // Verificar si el item ya existe en el carrito
    cart.forEach(cartItem => {
        if (cartItem.id === item.id) {
            cartItem.quantity += 1; // Incrementar la cantidad si ya existe
            itemExists = true;
        }
    });

    if (!itemExists) {
        item.quantity = 1; // Establecer la cantidad inicial a 1
        cart.push(item); // Agregar el nuevo item al carrito
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para obtener el carrito desde localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Función para eliminar un elemento del carrito
function removeFromCart(item) {
    let cart = getCart(); // Obtener el carrito desde localStorage
    cart = cart.filter(cartItem => cartItem.id !== item.id);

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para vaciar el carrito
function clearCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
}




