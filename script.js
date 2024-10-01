document.addEventListener('DOMContentLoaded', () => {
    const cartElement = document.getElementById('cart-items');
    const totalElement = document.getElementById('total-amount');
    const cartWindow = document.getElementById('cart-window');
    const cartIcon = document.getElementById('cart-icon');
    const closeCartButton = document.getElementById('close-cart');
    const grid = document.querySelector('.grid'); // Selecciona la grilla donde se agregarán los productos

    updateCartUI();

    // Función para obtener los productos desde la API
    function loadProducts() {
        fetch('https://script.google.com/macros/s/AKfycbzpKy4zfR03gQGr9bltiVNhOLnrbTKPbFZqKnfV3Fk7qJI42B4QenLv53WIrB6b5Zft/exec') // Reemplaza con la URL de tu API de Google Sheets
            .then(response => response.json()) // Convertimos la respuesta en JSON
            .then(data => {
                const productos = data.data; // Asumimos que los productos están en "data.data"
                renderProducts(productos); // Renderizamos los productos en la página
            })
            .catch(error => console.error('Error al cargar los productos:', error));
    }

    function renderProducts(productos) {
        productos.forEach(producto => {
            const productElement = document.createElement('div');
            productElement.classList.add('grid-item');

            productElement.innerHTML = `
                <div class="img-container">
                    <img src="${producto.Imagen}" alt="${producto.Productos}">
                </div>
                <h3>${producto.Productos}</h3>
                <p>${producto.Descripcion}</p>
                <p>$${producto.Precio}</p>
                <button class="add-to-cart" data-id="${producto.id}" data-name="${producto.Productos}" data-price="${producto.Precio}">
                    Añadir al carrito
                </button>
            `;

            grid.appendChild(productElement);
        });
    }

    // Cargar los productos cuando se cargue la página
    loadProducts();

    

    function updateCartUI() {
        const cart = getCart(); // Obtener el carrito desde localStorage
        cartElement.innerHTML = '';
        cart.forEach((item) => {
            const cartItem = document.createElement('div');
            cartItem.innerHTML = `
                <p>${item.name} - $${item.price} x ${item.quantity}</p>
                <button class="remove-from-cart" data-id="${item.id}">Eliminar</button>
            `;
            cartElement.appendChild(cartItem);
        });
        const total = calculateTotal(cart);
        totalElement.textContent = total;
    }
    
    // Asegurarse de actualizar el UI del carrito al cargar la página
    document.addEventListener('DOMContentLoaded', () => {
        updateCartUI();
    });
    

    function calculateTotal(cart) {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Mostrar el carrito al hacer clic en el ícono
    cartIcon.addEventListener('click', () => {
        cartWindow.classList.toggle('show');
        cartWindow.classList.toggle('hidden');
        updateCartUI();
    });

    // Cerrar el carrito
    closeCartButton.addEventListener('click', () => {
        cartWindow.classList.add('hidden');
        cartWindow.classList.remove('show');
    });

    // Agregar listener para agregar elementos al carrito
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const item = {
                id: e.target.dataset.id,
                name: e.target.dataset.name,
                price: e.target.dataset.price,
            };
            addToCart(item);
            updateCartUI();
        }
    });
    

    // Agregar listener para eliminar elementos del carrito
    cartElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart')) {
            const item = {
                id: e.target.dataset.id,
            };
            removeFromCart(item);
            updateCartUI();
        }
    });
});
