import { Injectable } from '@angular/core';
import { Usuario } from '../clases/usuario';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private firebaseAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private storage: Storage
  ) {}

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

  getUserDetail() {
    return this.firebaseAuth.currentUser;
  }

  crear(usuario: Usuario): Promise<void> {
    if (!usuario.id) return Promise.reject('ID de usuario no definido');
    return this.db.object(`usuarios/${usuario.id}`).set(usuario);
  }

  actualizar(usuario: Usuario): Promise<void> {
    if (!usuario.id) return Promise.reject('ID de usuario no definido');
    return this.db.object(`usuarios/${usuario.id}`).update(usuario)
      .then(() => console.info("Actualización exitosa"))
      .catch(() => console.info("No se pudo actualizar"));
  }

  borrar(id: string): Promise<void> {
    return this.db.object(`usuarios/${id}`).remove()
      .then(() => console.info("Usuario eliminado"))
      .catch(() => console.info("No se pudo realizar la baja."));
  }

  guardarLocal(usuario: Usuario): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!usuario.id) {
        reject('ID de usuario no definido');
        return;
      }

      this.db.object(`usuarios/${usuario.id}`).valueChanges().subscribe(
        (data) => {
          this.storage.set('usuario', data).then(() => resolve());
        },
        (error) => reject(error)
      );
    });
  }

  obtenerLocal(): Promise<Usuario> {
    return this.storage.get('usuario');
  }

  leer(): Promise<Usuario[]> {
    return new Promise((resolve) => {
      this.db.list('usuarios').snapshotChanges().subscribe(snapshot => {
        const usuarios: Usuario[] = [];

        snapshot.forEach(child => {
          const data: any = child.payload.val();
          const key = child.payload.key;
          usuarios.push(Usuario.CrearUsuario(key || '', data.nombre, data.email, data.imagenes, data.rol));
        });

        resolve(usuarios);
      });
    });
  }
}
