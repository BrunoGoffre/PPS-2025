import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Imagen, TipoImagen } from '../clases/imagen';
import { Usuario } from '../clases/usuario';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Filesystem } from '@capacitor/filesystem';

import {
  Storage,
  ref,
  uploadString,
  getDownloadURL,
} from '@angular/fire/storage';

import {
  Database,
  ref as dbRef,
  push,
  update,
  remove,
  onValue,
} from '@angular/fire/database';

@Injectable({
  providedIn: 'root',
})
export class ImagenService {
  public static fotosFeas: Imagen[] = [];
  public static fotosBonitas: Imagen[] = [];
  public static fotosUsuario: Imagen[] = [];
  public static imagenes: Imagen[] = [];

  constructor(
    private storage: Storage,
    private database: Database,
    private toastController: ToastController
  ) {}

  async subirVariasFotos(usuario: Usuario, tipo: TipoImagen): Promise<Imagen[]> {
    const carpeta = tipo === TipoImagen.POSITIVA ? 'bonitas' : 'feas';
    const imagenes: Imagen[] = [];

    try {
      const resp = await Camera.pickImages({ quality: 90, limit: 2 });

      for (const photo of resp.photos) {
        const file = await Filesystem.readFile({ path: photo.path as string });

        const imagen = new Imagen();
        imagen.base64 = file.data as string;
        imagen.fecha = new Date().toUTCString();
        imagen.usuario = usuario.id;
        imagen.nombreUsuario = usuario.nombre;
        imagen.tipo = tipo;
        imagen.votos = [];

        const newRef = await push(dbRef(this.database, 'imagenes'), imagen);
        imagen.id = newRef.key!;

        const imgRef = ref(this.storage, `${carpeta}/${imagen.id}`);
        await uploadString(imgRef, imagen.base64, 'base64', {
          contentType: 'image/jpeg',
          customMetadata: {
            user: imagen.usuario,
            userName: imagen.nombreUsuario,
            date: imagen.fecha,
            puntaje: imagen.votos.length.toString(),
          },
        });

        imagen.url = await getDownloadURL(imgRef);
        await update(dbRef(this.database, `imagenes/${imagen.id}`), imagen);

        imagenes.push(imagen);

        if (tipo === TipoImagen.POSITIVA) ImagenService.fotosBonitas.push(imagen);
        else ImagenService.fotosFeas.push(imagen);
      }
    } catch (err: any) {
      this.presentToast(err.message || 'Error al subir imagen');
    }

    return imagenes;
  }

  async sacarFoto(usuario: Usuario, tipo: TipoImagen): Promise<Imagen> {
    const imagen = new Imagen();
    const carpeta = tipo === TipoImagen.POSITIVA ? 'bonitas' : 'feas';

    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        promptLabelHeader: 'Seleccione una opción',
        promptLabelPhoto: 'Galería',
        promptLabelPicture: 'Cámara',
      });

      imagen.base64 = photo.base64String!;
      imagen.fecha = new Date().toUTCString();
      imagen.usuario = usuario.id;
      imagen.nombreUsuario = usuario.nombre;
      imagen.tipo = tipo;
      imagen.votos = [];

      const newRef = await push(dbRef(this.database, 'imagenes'), imagen);
      imagen.id = newRef.key!;

      const imgRef = ref(this.storage, `${carpeta}/${imagen.id}`);
      await uploadString(imgRef, imagen.base64, 'base64', {
        contentType: 'image/jpeg',
        customMetadata: {
          user: imagen.usuario,
          userName: imagen.nombreUsuario,
          date: imagen.fecha,
          puntaje: imagen.votos.length.toString(),
        },
      });

      imagen.url = await getDownloadURL(imgRef);
      await update(dbRef(this.database, `imagenes/${imagen.id}`), imagen);
    } catch (error: any) {
      this.presentToast(error.message || 'Error al sacar la foto');
    }

    return imagen;
  }

  public async descargarImagen(carpeta: string, usuario: string) {
    const imgRef = ref(this.storage, `${carpeta}/${usuario}`);
    return getDownloadURL(imgRef);
  }

  public async fetchAll() {
    return new Promise<any>((resolve) => {
      const imgsRef = dbRef(this.database, 'imagenes');
      onValue(imgsRef, (snapshot) => {
        ImagenService.imagenes = [];
        snapshot.forEach((child) => {
          const data = child.val();
          const aux = Imagen.CrearImagen(
            data.id,
            data.base64,
            data.url,
            data.usuario,
            data.nombreUsuario,
            data.fecha,
            data.tipo,
            data.votos
          );
          ImagenService.imagenes.push(aux);
        });

        this.getFeas();
        this.getLindas();
        resolve('OK');
      });
    });
  }

  public actualizar(imagen: Imagen): Promise<void> {
    return update(dbRef(this.database, `imagenes/${imagen.id}`), imagen);
  }

  public borrar(id: string): Promise<void> {
    return remove(dbRef(this.database, `imagenes/${id}`));
  }

  public fetchUsuario(id: string) {
    ImagenService.fotosUsuario = ImagenService.imagenes
      .filter((img) => img.usuario === id)
      .sort((a, b) => this.comparadorFechas(a, b));
  }

  public getFeas() {
    ImagenService.fotosFeas = ImagenService.imagenes
      .filter((img) => img.tipo === TipoImagen.NEGATIVA)
      .sort((a, b) => this.comparadorFechas(a, b));
  }

  public getLindas() {
    ImagenService.fotosBonitas = ImagenService.imagenes
      .filter((img) => img.tipo === TipoImagen.POSITIVA)
      .sort((a, b) => this.comparadorFechas(a, b));
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    await toast.present();
  }

  comparadorFechas(fotoA: Imagen, fotoB: Imagen) {
    return new Date(fotoB.fecha).getTime() - new Date(fotoA.fecha).getTime();
  }
}
