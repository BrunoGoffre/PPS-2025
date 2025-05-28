export class Imagen
{
    id: string ;
    url: string;
    base64: string;
    usuario: string;
    nombreUsuario: string;
    fecha: string;
    tipo: TipoImagen = TipoImagen.NEGATIVA
    votos: any[] = [];

    public Imagen()
    {
        this.votos = [];
    }

    public static CrearImagen(id: string, base64: string, url: string, usuario: string, 
                            nombreUsuario: string,fecha: string, tipo: TipoImagen, votos: any[])
    {
        let imagen = new Imagen();

        imagen.id = id;
        imagen.base64 = base64;
        imagen.url = url;
        imagen.usuario = usuario;
        imagen.nombreUsuario = nombreUsuario;
        imagen.fecha = fecha;
        imagen.tipo = tipo;
        imagen.votos = [];
        if(votos)
        {
            imagen.votos.push(...votos);
        }
        
        return imagen;
    }
}

export enum TipoImagen
{
    POSITIVA = 'positiva',
    NEGATIVA = 'negativa'
}