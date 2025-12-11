// Función para cargar productos
async function cargarProductos() {
    try {
        const response = await fetch("https://proyectoecomerce-io.onrender.com/api/productos");
        const productos = await response.json();
        const grid = document.getElementById("product-grid");

        grid.innerHTML = productos.map(producto => `
            <div class="product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-1"
                data-category="${producto.categoria || 'general'}"
                data-price="${producto.precio}"
                data-product-id="${producto.productID}">

                <div class="relative bg-gradient-to-bg from-gray-100 to-gray-200 h-48 flex items-center justify-center overflow-hidden">
                    <img src="${producto.image}" alt="${producto.nombre}"
                        class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        loading="lazy">
                    <div class="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-b-full text-xs font-bold">
                        -15%
                    </div>
                </div>

                <div class="p-6">
                    <h3 class="text-lg font-bold text-gray-900 mb-2">${producto.nombre}</h3>
                    <p class="text-gray-700 mb-4">${producto.descripcion}</p>
                    
                    <div class="flex items-center justify-between mb-4">
                        <span class="text-2xl font-bold text-gray-900">
                            $${(producto.precio || 0).toLocaleString('es-CO')}
                        </span>
                        <div class="text-yellow-500">★★★★★</div>
                    </div>

                    <div class="flex space-x-2">
                        <button class="ver-detalles-btn bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition duration-300 flex-1 text-sm">
                            Ver detalles
                        </button> 
                        <button class="add-to-cart-btn bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition duration-300 flex-1 text-sm">
                            Comprar
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        console.log("✅ Productos cargados con éxito");
    } catch (error) {
        console.error("❌ Error al cargar los productos:", error);
    }
}

// Llamar a la función
cargarProductos();
// cargar automaticamente los productos al cargar la pagina
setInterval(() => {
    cargarProductos();
},5000); // 5000 ms = 5 segundos
