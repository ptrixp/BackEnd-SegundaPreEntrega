const socket = io(); 
//La instancia de Socket.io del lado del cliente. 


//Lo que tengo que hacer es escuchar al Backend, que este me va a mandar los productos: 

socket.on("productos", (data) => {
    console.log(data); 
})

//Tienen que renderizar en pantalla estos productos. 
//1) Sumar un boton para eliminar productos. 
//2) Sumar un formulario para crear nuevos productos. 
//TODO ESTO SE TIENE QUE ACTUALIZAR EL TIEMPO REAL. 