import { Injectable } from '@angular/core';
import { Imagen, TipoImagen } from '../clases/imagen';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { v4 as uuidv4 } from 'uuid';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
} from 'firebase/storage';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
} from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root',
})
export class ImagenService {
  public static fotosFeas: Imagen[] = [];
  public static fotosBonitas: Imagen[] = [];
  public static fotosUsuario: Imagen[] = [];
  public static imagenes: Imagen[] = [];

  constructor(
    private storage: AngularFireStorage,
    private toastController: ToastController,
    private firestore: Firestore
  ) {}

  async sacarFoto(usuario: Usuario, tipo: TipoImagen): Promise<Imagen> {
    const imagen = new Imagen();
    let carpeta = '';

    try {
      const imageData = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.Base64,
        correctOrientation: true,
        source: CameraSource.Prompt,
        promptLabelHeader: 'Subir foto',
        promptLabelCancel: 'Cancelar',
        promptLabelPhoto: 'Subir desde galería',
        promptLabelPicture: 'Nueva foto',
      });
      imagen.id = uuidv4();
      imagen.base64 = imageData.base64String || '';
      imagen.fecha = new Date().toUTCString();
      imagen.usuario = usuario.id;
      imagen.nombreUsuario = usuario.nombre;
      imagen.tipo = tipo;
      imagen.votos = [];

      carpeta = tipo === TipoImagen.POSITIVA ? 'bonitas' : 'feas';

      const storageRef  = await this.guardarImagen(imagen, carpeta);
      imagen.url = await getDownloadURL(storageRef);

      console.log('url: ' + imagen.url);
      await this.actualizarOCrear(imagen);

      if (tipo === TipoImagen.POSITIVA) {
        ImagenService.fotosBonitas.push(imagen);
      } else {
        ImagenService.fotosFeas.push(imagen);
      }
    } catch (error) {
      console.log('error creando: ' + error);
      this.presentToast('Por favor suba o seleccione una foto');
    }

    return imagen;
  }

  async guardarImagen(imagen: Imagen, carpeta: string) {
    const storage = getStorage(); // instancia de Firebase Storage

    const path = `${carpeta}/${imagen.id}`;
    const storageRef = ref(storage, path);

    const metadata = {
      contentType: 'image/jpeg',
      customMetadata: {
        user: imagen.usuario,
        userName: imagen.nombreUsuario,
        date: imagen.fecha,
        puntaje: imagen.votos.length.toString(),
      },
    };

    await uploadString(storageRef, imagen.base64, 'base64', metadata)
    .then(() =>{
      console.log('string upload succesfully')
    })
    .catch(() => {
      console.log("Error al subir el archivo")
    });
    return storageRef; // ya que se usa para getDownloadURL()
  }

  descargarImagen(carpeta: string, usuario: string) {
    return this.storage.ref(`${carpeta}/${usuario}`).getDownloadURL();
  }

  async actualizarOCrear(imagen: Imagen): Promise<void> {
    const { base64, ...imagenSinBase64 } = imagen;
    let imagenesCollection = collection(this.firestore, 'imagenes');
    const userDocRef = doc(imagenesCollection, imagen.id);

    setDoc(userDocRef, { ...imagenSinBase64 }, { merge: true })
      .then(() => console.info('Actualización de imagen exitosa'))
      .catch((error) =>
        console.error('No se pudo actualizar la imagen', error)
      );
  }

  async borrar(id: string): Promise<void> {
    const docRef = doc(this.firestore, `imagenes/${id}`);
    await deleteDoc(docRef);
  }

  async fetchAll(): Promise<void> {
    const imagenesRef = collection(this.firestore, 'imagenes');
    const snapshot = await getDocs(imagenesRef);

    ImagenService.imagenes = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const aux = Imagen.CrearImagen(
        docSnap.id,
        data['base64'],
        data['url'],
        data['usuario'],
        data['nombreUsuario'],
        data['fecha'],
        data['tipo'],
        data['votos']
      );
      console.log('imagen fetchAll: ' + aux)
      ImagenService.imagenes.push(aux);
    });

    this.getFeas();
    this.getLindas();
  }

  fetchUsuario(id: string) {
    ImagenService.fotosUsuario =
      ImagenService.imagenes
        .filter((img) => img.usuario === id)
        .sort((a, b) => this.comparadorFechas(a, b)) ?? [];
  }

  getFeas() {
    ImagenService.fotosFeas =
      ImagenService.imagenes
        .filter((img) => img.tipo === TipoImagen.NEGATIVA)
        .sort((a, b) => this.comparadorFechas(a, b)) ?? [];
  }

  getLindas() {
    ImagenService.fotosBonitas =
      ImagenService.imagenes
        .filter((img) => img.tipo === TipoImagen.POSITIVA)
        .sort((a, b) => this.comparadorFechas(a, b)) ?? [];
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
    });
    toast.present();
  }

  comparadorFechas(fotoA: Imagen, fotoB: Imagen): number {
    return new Date(fotoB.fecha).getTime() - new Date(fotoA.fecha).getTime();
  }
}
