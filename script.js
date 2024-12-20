document.addEventListener('DOMContentLoaded', () => {
    const cartElement = document.getElementById('cart-items');
    const totalElement = document.getElementById('total-amount');
    const cartWindow = document.getElementById('cart-window');
    const cartIcon = document.getElementById('cart-icon');
    const closeCartButton = document.getElementById('close-cart');
    const grid = document.querySelector('.grid'); 

    updateCartUI();

    // Función para obtener los productos desde la API usando async/await
    async function loadProducts(categoria) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/productos');
            const data = await response.json(); //Conversión a JSON
            const productos = data; // Asumimos que los productos están en "data.data"
            const filteredProducts = categoria ? productos.filter(producto => producto.Categoria === categoria) : productos;
            renderProducts(filteredProducts); // Mostrar los productos filtrados
        } catch (error) {
            console.error('Error al cargar los productos:', error);
        }
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
            cartItem.classList.add('cart-item'); // Clase para el elemento del carrito
            cartItem.innerHTML = `
                <p>${item.name} - $${item.price} x ${item.quantity}</p>
                <button class="remove-from-cart button-remove" data-id="${item.id}">Eliminar</button>
            `;
            cartElement.appendChild(cartItem);
        });
        const total = calculateTotal(cart);
        totalElement.textContent = `$${total}`;
    }

    function calculateTotal(cart) {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    cartIcon.addEventListener('click', () => {
        cartWindow.classList.toggle('show');
        cartWindow.classList.toggle('hidden');
        updateCartUI();
    });
 // addEventListener se encarga de permitir la interaccion con el click
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

    function getCart() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    }

    function removeFromCart(item) {
        let cart = getCart(); // Obtener el carrito desde localStorage
        cart = cart.filter(cartItem => cartItem.id !== item.id);

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Integración del formulario de pedido
    document.getElementById('pedido-form').addEventListener('submit', async function(event) {
        event.preventDefault();
    
        // Captura datos del cliente
        const nombreCliente = document.getElementById('nombre').value;
        const telefonoCliente = document.getElementById('telefono').value;
        const direccionCliente = document.getElementById('direccion').value;
    
        // Obtiene los productos desde el carrito
        const productos = getCart().map(item => ({
            id: item.id,
            precio: parseFloat(item.price),
            cantidad: item.quantity
        }));
    
        // Calcular el valor total del pedido
        const valorTotal = calculateTotal(getCart());
    
        // Crear objeto de pedido
        const pedido = {
            nombre: nombreCliente,
            telefono: telefonoCliente,
            direccion: direccionCliente,
            productos: productos,
            valorTotal: valorTotal
        };
    
        try {
            // Cambia la URL al endpoint de tu API Laravel
            const response = await fetch('http://127.0.0.1:8000/api/pedidos', {
                method: 'POST',
                body: JSON.stringify(pedido),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                const data = await response.json();
                alert('Pedido enviado exitosamente');
                console.log('Respuesta de la API:', data);
                clearCart(); // Vaciar el carrito
                updateCartUI(); // Actualizar la UI
            } else {
                console.error('Error en la respuesta de la API:', response.statusText);
                alert('Error al enviar el pedido');
            }
        } catch (error) {
            console.error('Error al enviar el pedido:', error);
            alert('Error al enviar el pedido');
        }
    });
    

    // Función para vaciar el carrito
    function clearCart() {
        localStorage.removeItem('cart'); // Vaciar el carrito en localStorage
        cartElement.innerHTML = ''; // Limpiar el carrito en la UI
        totalElement.textContent = '$0';
    }
});

