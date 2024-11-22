document.addEventListener('DOMContentLoaded', () => {
    // Llamada para autenticar al usuario
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                // Guardar el token en localStorage
                const token = data.token;
                localStorage.setItem('token', token);

                alert('Login exitoso!');
                console.log('Token guardado:', token);
                
                // Redirigir a la página de gestión de pedidos
                window.location.href = 'gestion-pedidos.html';
            } else {
                alert('Credenciales incorrectas');
            }
        } catch (error) {
            console.error('Error al intentar hacer login:', error);
            alert('Hubo un problema al intentar hacer login');
        }
    });
});
