export class Usuario
{
    id: string;
    email: string;
    pass: string;
    nombre: string;
    apellido: string;
    dni: number;
    direccion: string;
    telefono: number;
    rol: string;

    public Usuario()
    {
        this.rol = "Usuario";
    }

    public static CrearUsuario(id: string, nombre: string, apellido: string, 
                                email: string, dni: number, direccion: string, 
                                telefono: number, rol: string) : Usuario
    {
        let usuario = new Usuario();
        usuario.id = id;
        usuario.email = email;
        usuario.nombre = nombre;
        usuario.apellido = apellido;
        usuario.direccion = direccion;
        usuario.telefono = telefono;
        usuario.dni = dni;
        usuario.rol = rol;

        return usuario;
    }   

}