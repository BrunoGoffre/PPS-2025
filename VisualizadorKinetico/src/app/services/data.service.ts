import { Injectable } from '@angular/core';
import { Usuario } from '../clases/usuario';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, collection, doc, setDoc, updateDoc, deleteDoc, docData, CollectionReference, DocumentData, collectionData  } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage-angular';
import { Observable, from, firstValueFrom } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DataService {
  private usuariosCollection: CollectionReference<DocumentData>;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private firestore: Firestore,
    private storage: Storage
  ) {
    this.storage.create();
    this.usuariosCollection = collection(this.firestore, 'usuarios');
  }

  login(usuario: Usuario): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firebaseAuth.signInWithEmailAndPassword(usuario.email, usuario.pass || '')
        .then(response => {
          if (!response.user) {
            reject('No user in response');
            return;
          }

          usuario.id = response.user.uid;

          this.actualizar(usuario).then(() => {
            this.guardarLocal(usuario).then(() => {
              resolve(response);
            });
          }).catch((e) => reject(e));
        }, error => reject(error));
    });
  }

  registrar(usuario: Usuario): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.firebaseAuth.createUserWithEmailAndPassword(usuario.email, usuario.pass || '')
        .then(response => {
          if (!response.user) {
            reject('No user in response');
            return;
          }

          usuario.pass = ''; // limpiamos la contraseña por seguridad
          usuario.id = response.user.uid;

          this.crear(usuario).then(() => {
            resolve(response);
          });
        }, error => reject(error));
    });
  }

  getUserDetail(): Observable<firebase.default.User | null> {
    return this.firebaseAuth.authState;
  }

  crear(usuario: Usuario): Promise<void> {
    if (!usuario.id) {
      return Promise.reject('ID de usuario no definido');
    }
    const userDocRef = doc(this.usuariosCollection, usuario.id);
    return setDoc(userDocRef, { ...usuario });
  }

  actualizar(usuario: Usuario): Promise<void> {
    if (!usuario.id) {
      return Promise.reject('ID de usuario no definido');
    }
    console.log('id de usuario a actualizar: ' + usuario.imagenes)
    const userDocRef = doc(this.usuariosCollection, usuario.id);
    console.log('imagenes de usuario a actualizar: ' + usuario.imagenes)
    return setDoc(userDocRef, { ...usuario }, {merge: true})
      .then(() => console.info("Actualización exitosa"))
      .catch((error) => console.error("No se pudo actualizar", error));
  }

  borrar(id: string): Promise<void> {
    const userDocRef = doc(this.usuariosCollection, id);
    return deleteDoc(userDocRef)
      .then(() => console.info("Usuario eliminado"))
      .catch((error) => console.error("No se pudo realizar la baja.", error));
  }

  guardarLocal(usuario: Usuario): Promise<void> {
    return this.storage.set('usuario', usuario);
  }
  
  limpiarLocal(){
    return this.storage.clear()
  }

  obtenerLocal(): Promise<Usuario | null> {
    return this.storage.get('usuario');
  }

  leer(): Observable<Usuario[]> {
    return collectionData(this.usuariosCollection, { idField: 'id' }) as Observable<Usuario[]>;
  }
}