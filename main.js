let empanadasData; 
let recargarPag = false;

fetch('base.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudo cargar el archivo JSON.');
    }
    return response.json();
  })
  .then(data => {
    empanadasData = data.empanadas;

    const empanadasList = document.getElementById('empanadasList');

    empanadasData.forEach(empanada => {
      const cardContainer = document.createElement('div');
      cardContainer.classList.add('col-md-3', 'mb-4');

      const card = document.createElement('div');
      card.classList.add('card');

      const cardImage = document.createElement('img');
      cardImage.classList.add('card-img-top');
      cardImage.src = empanada.imagen;
      cardImage.alt = 'Imagen de Empanada';

      const cardBody = document.createElement('div');
      cardBody.classList.add('card-body');

      const cardTitle = document.createElement('h2');
      cardTitle.textContent = empanada.catalogo;

      const cardTipo = document.createElement('p');
      cardTipo.textContent = `Tipo: ${empanada.tipo}`;

      const cardHornoBtn = document.createElement('button');
      cardHornoBtn.classList.add('btn', 'btn-primary', 'm-1');
      cardHornoBtn.textContent = `Horno: $${empanada.precioHorno}`;
      cardHornoBtn.addEventListener('click', () => agregarAlCarrito(empanada.id, 'Horno'));

      const cardFritaBtn = document.createElement('button');
      cardFritaBtn.classList.add('btn', 'btn-primary', 'm-1');
      cardFritaBtn.textContent = `Frita: $${empanada.precioFrita}`;
      cardFritaBtn.addEventListener('click', () => agregarAlCarrito(empanada.id, 'Frita'));

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardTipo);
      cardBody.appendChild(cardHornoBtn);
      cardBody.appendChild(cardFritaBtn);

      card.appendChild(cardImage);
      card.appendChild(cardBody);

      cardContainer.appendChild(card);

      empanadasList.appendChild(cardContainer);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });

const carrito = [];

function agregarAlCarrito(empanadaId, tipo) {
    const empanadaSeleccionada = empanadasData.find(empanada => empanada.id === empanadaId);

    if (empanadaSeleccionada) {
        const empanadaEnCarrito = { ...empanadaSeleccionada };
        empanadaEnCarrito.tipo = tipo;
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        
        Toast.fire({
          icon: 'success',
          title: `Empanada de ${empanadaEnCarrito["catalogo"]} ${tipo === "Horno" ? "al " + tipo : tipo} agregada al carrito`
        })

        const existeEnCarrito = carrito.find(item => item.id === empanadaEnCarrito.id && item.tipo === tipo);

        if (existeEnCarrito) {
            existeEnCarrito.cantidad++;
        } else {
            empanadaEnCarrito.cantidad = 1;
            carrito.push(empanadaEnCarrito);
        }

        actualizarCarrito();
    }
}

function incrementarCantidad(empanadaId, tipo) {
    const empanadaEnCarrito = carrito.find(empanada => empanada.id === empanadaId && empanada.tipo === tipo);

    if (empanadaEnCarrito && empanadaEnCarrito.cantidad) {
        empanadaEnCarrito.cantidad++;
        actualizarCarrito();
    }
}

function decrementarCantidad(empanadaId, tipo) {
    const empanadaEnCarrito = carrito.find(empanada => empanada.id === empanadaId && empanada.tipo === tipo);

    if (empanadaEnCarrito && empanadaEnCarrito.cantidad > 1) {
        empanadaEnCarrito.cantidad--;
        actualizarCarrito();
    }
}

function actualizarCarrito() {
    const carritoList = document.getElementById("carritoList");
    const totalElement = document.getElementById("total");
    const mostrarCarrito = document.getElementById('mostrarCarrito');
    const botonPagar = document.getElementById('pagar');
    const vaciarCarrito = document.getElementById('vaciarCarrito');
    const mostrarTotal = document.getElementById('mostrartotal');
    const datoInput = document.getElementById('datoInput');
    const nombre = document.getElementById('nombre');
    const telefono = document.getElementById('telefono');
    const direccion = document.getElementById('direccion');

    carritoList.innerHTML = "";

    let total = 0;

    carrito.forEach(empanada => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<div class = "anchoLinea"><div class = "anchoTexto">
        Cantidad: ${empanada.cantidad} - Tipo: ${empanada.tipo} - $${(empanada.tipo === 'Horno' ? empanada.precioHorno : empanada.precioFrita) * empanada.cantidad} - ${empanada.catalogo} </div>
        ${empanada.tipo === 'Horno' ? `<div class="centrarBotones"> <button id='boton' class="btn btn-dark" onclick="incrementarCantidad(${empanada.id}, 'Horno')">+</button> <button id='boton'  class="btn btn-dark" onclick="decrementarCantidad(${empanada.id}, 'Horno')">-</button></div> ` : 
        `<div class="centrarBotones"><button id='boton' class="btn btn-dark" onclick="incrementarCantidad(${empanada.id}, 'Frita')">+</button> <button id='boton' class="btn btn-dark" onclick="decrementarCantidad(${empanada.id}, 'Frita')">-</button></div>`}`;
        carritoList.appendChild(listItem);
        total += (empanada.tipo === 'Horno' ? empanada.precioHorno : empanada.precioFrita) * empanada.cantidad;
    });

    totalElement.innerText = total.toFixed(2);

    if (carrito.length > 0){
        mostrarCarrito.style.display = 'block'; 
        botonPagar.style.display = 'block';    
        vaciarCarrito.style.display = 'block';
        mostrarTotal.style.display = 'block';
        datoInput.style.display = 'block';
        nombre.style.display = 'block';
        telefono.style.display = 'block';
        direccion.style.display = 'block';
    }else{
        mostrarCarrito.style.display = 'none'; 
        botonPagar.style.display = 'none';
        vaciarCarrito.style.display = 'none';
        mostrarTotal.style.display = 'none';
        datoInput.style.display = 'none';
        nombre.style.display = 'none';
        telefono.style.display = 'none';
        direccion.style.display = 'none';
    }
}

const pagado = document.getElementById('pagado');

function vaciarCarrito() {
    carrito.length = 0;
    actualizarCarrito();
}

document.getElementById("vaciarCarrito").addEventListener("click", () => {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: 'Esta seguro?',
        text: "No podra revertirlo",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Si, vaciar!',
        cancelButtonText: 'No, cancelar!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire(
                'Borrado!',
                'Tu carrito ha sido vaciado.',
                'success'
            );
            pagado.innerHTML = '';
            vaciarCarrito();
        } else if (
            result.dismiss === Swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'Cancelado',
                'Tu carrito esta a salvo',
                'error'
            );
        }
    });
});

document.getElementById("pagar").addEventListener("click", () => {
    const total = parseFloat(document.getElementById("total").innerText.replace("$", ""));
    const pagoCon = parseFloat(document.getElementById("datoInput").value);
    const nombreUsuario = document.getElementById("nombre").value;
    const tel = document.getElementById("telefono").value;
    const dir = document.getElementById("direccion").value;

    if (!nombreUsuario){
        pagado.innerHTML = `Por favor ingresa tu nombre y apellido`;
    }else{
        if (!tel){
            pagado.innerHTML = `Por favor ingresa tu telefono`;
        }else{
            if (!direccion){
                pagado.innerHTML = `Por favor ingresa tu direccion`;
            }else{
                if (!isNaN(total) && !isNaN(pagoCon) && pagoCon >= total) {
                    const vuelto = pagoCon - total;
            
                    pagado.innerHTML = '';
                    recargarPag = true;
                    Swal.fire(
                        'Pago Aprobado!',
                        `Tus empanadas estan en camino! Su vuelto es: $${vuelto.toFixed(2)}`,
                        'success'
                    );
                    guardarDatosLocal(nombreUsuario, dir, tel, vuelto);
                    vaciarCarrito();
                    datoInput.value = '';
                    nombre.value = '';
                    telefono.value = '';
                    direccion.value = '';
            
                } else {
                    pagado.innerHTML = `El monto ingresado es insuficiente.`;
                }
            }
        }
    }
});

function guardarDatosLocal(nombreUsuario, dir, tel, vuelto) {
    const datos = JSON.parse(localStorage.getItem('datosClientes')) || [];
    const nuevoCliente = {
        nombreUsuario: nombreUsuario,
        dir: dir,
        tel: tel,
        facturado: vuelto
    };
    datos.push(nuevoCliente);
    localStorage.setItem('datosClientes', JSON.stringify(datos));
}

actualizarCarrito();
