document.addEventListener('DOMContentLoaded', () => {
    const cartElement = document.getElementById('cart-items');
    const totalElement = document.getElementById('total-amount');
    const cartWindow = document.getElementById('cart-window');
    const cartIcon = document.getElementById('cart-icon');
    const closeCartButton = document.getElementById('close-cart');
    const grid = document.querySelector('.grid'); // Selecciona la grilla donde se agregarán los productos

    updateCartUI();

    // Función para obtener los productos desde la API
    function loadProducts(categoria) {
        fetch('https://script.google.com/macros/s/AKfycbzpKy4zfR03gQGr9bltiVNhOLnrbTKPbFZqKnfV3Fk7qJI42B4QenLv53WIrB6b5Zft/exec')
            .then(response => response.json())
            .then(data => {
                const productos = data.data; // Asumimos que los productos están en "data.data"
                const filteredProducts = categoria ? productos.filter(producto => producto.Categoria === categoria) : productos;
                renderProducts(filteredProducts); // Renderizamos los productos filtrados
            })
            .catch(error => console.error('Error al cargar los productos:', error));
    }

    function renderProducts(productos) {
        grid.innerHTML = ''; // Limpiar la grilla antes de renderizar
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

    // Función para obtener el parámetro de la URL
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Obtener la categoría de la URL
    const categoriaActual = getUrlParameter('categoria'); // Cargar la categoría desde la URL
    loadProducts(categoriaActual); // Cargar productos de la categoría especificada

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

    document.addEventListener('DOMContentLoaded', () => {
        updateCartUI();
    });

    function calculateTotal(cart) {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    cartIcon.addEventListener('click', () => {
        cartWindow.classList.toggle('show');
        cartWindow.classList.toggle('hidden');
        updateCartUI();
    });

    closeCartButton.addEventListener('click', () => {
        cartWindow.classList.add('hidden');
        cartWindow.classList.remove('show');
    });

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
