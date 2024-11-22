document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const ordersTable = document.getElementById('orders-table');
    const filterBtn = document.getElementById('filter-btn');
    const filterStatus = document.getElementById('filter-status');
    const filterClient = document.getElementById('filter-client'); // Campo para filtrar por cliente

    // Verificar si el usuario está autenticado
    if (!token) {
        alert('Debes iniciar sesión para acceder a esta página.');
        window.location.href = 'login.html';
    } else {
        loadOrders('all', ''); // Cargar todos los pedidos al inicio sin filtro de cliente
    }

    // Función para cargar pedidos
    async function loadOrders(status, client) {
        try {
            let url = `http://127.0.0.1:8000/api/empleados/pedidos/cliente/${client}`;
            
            if (status && status !== 'all') {
                url += `?status=${status}`; // Si el estado está presente, agregarlo al filtro
            }
    
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 401) {
                alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                localStorage.removeItem('token');
                window.location.href = 'login.html';
                return;
            }
    
            const orders = await response.json();
            renderOrders(orders.pedidos); // Asegúrate de que `orders.pedidos` sea el nombre correcto
        } catch (error) {
            console.error('Error al cargar los pedidos:', error);
        }
    }

    // Función para renderizar los pedidos en la tabla
    function renderOrders(orders) {
        ordersTable.innerHTML = '';
        orders.forEach(order => {
            const row = `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.clientName}</td>
                    <td>${order.status}</td>
                    <td>${order.total}</td>
                    <td>
                        ${order.status === 'pending' 
                            ? `<button onclick="updateOrderStatus(${order.id})">Atender</button>` 
                            : 'Completado'}
                    </td>
                </tr>
            `;
            ordersTable.innerHTML += row;
        });
    }


    // Cambiar el estado de un pedido
    window.updateOrderStatus = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/orders/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'completed' }),
            });

            if (response.ok) {
                alert('Pedido actualizado a "Atendido".');
                loadOrders(filterStatus.value, filterClient.value); // Recargar pedidos con los filtros actuales
            } else {
                alert('No se pudo actualizar el estado del pedido.');
            }
        } catch (error) {
            console.error('Error al actualizar el pedido:', error);
        }
    };

    // Filtrar pedidos
    filterBtn.addEventListener('click', () => {
        // Recargar los pedidos con los filtros aplicados
        loadOrders(filterStatus.value, filterClient.value);
    });

    // Cerrar sesión
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});
