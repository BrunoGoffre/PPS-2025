
export class Usuario
{
    id: string = '';
    nombre: string = '';
    email: string = '';
    pass: string = '';
    rol: string = '';
    imagenes: string[] = []; 

    public Usuario()
    {
        this.rol = "Usuario";
        this.imagenes = [];
    }

    public static CrearUsuario(id: string,nombre:string ,email: string, imagenes: string[],rol:string) : Usuario
    {
        let usuario = new Usuario();
        usuario.id = id;
        usuario.nombre = nombre;
        usuario.email = email;
        usuario.imagenes.push(...imagenes);
        usuario.rol = rol;

        return usuario;
    }   
}