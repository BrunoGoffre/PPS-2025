import { Component, OnInit } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  Platform,
  ToastController,
} from '@ionic/angular';
import { Usuario } from 'src/app/clases/usuario';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { Carta } from 'src/app/clases/carta';
import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false,
})
export class MenuPage implements OnInit {
  estado: 'seleccion' | 'juego' | 'puntajes' = 'seleccion';
  nivel: 'facil' | 'medio' | 'dificil' | null = null;

  cartas: any[] = [];
  segundos = 0;
  timer: any;
  bloqueo = false;
  primeraCartaIndex: number | null = null;
  won: boolean = false;

  top5: any[] = [];

  imagenes = {
    facil: ['animales/caballo.jpg', 'animales/leon.jpg', 'animales/toro.jpg'],
    medio: [
      'herramientas/serrucho.jpg',
      'herramientas/martillo.jpg',
      'herramientas/pala.jpg',
      'herramientas/destornillador.jpg',
      'herramientas/pinzas.jpg',
    ],
    dificil: [
      'frutas/anana.jpg',
      'frutas/banana.jpg',
      'frutas/frutilla.jpg',
      'frutas/limon.jpg',
      'frutas/naranja.jpg',
      'frutas/pera.jpg',
      'frutas/sandia.jpg',
      'frutas/uva.jpg',
    ],
  };

  constructor(
    private dataService: DataService,
    private toastCtrl: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  seleccionarNivel(n: 'facil' | 'medio' | 'dificil') {
    this.nivel = n;
  }

  iniciarJuego() {
    if (!this.nivel) return;

    const imagenesNivel = this.imagenes[this.nivel];
    const duplicadas = [...imagenesNivel, ...imagenesNivel];
    const barajadas = this.shuffle(duplicadas);

    this.cartas = barajadas.map((img) => ({
      img,
      flipped: false,
      matched: false,
    }));

    this.estado = 'juego';
    this.segundos = 0;
    this.timer = setInterval(() => this.segundos++, 1000);
  }

  shuffle(array: string[]): string[] {
    return array.sort(() => Math.random() - 0.5);
  }

  
  async voltearCarta(index: number) {
    if (
      this.bloqueo ||
      this.cartas[index].flipped ||
      this.cartas[index].matched
    )
      return;

    this.cartas[index].flipped = true;

    if (this.primeraCartaIndex === null) {
      this.primeraCartaIndex = index;
    } else {
      this.bloqueo = true;
      const primera = this.cartas[this.primeraCartaIndex];
      const segunda = this.cartas[index];

      if (primera.img === segunda.img) {
        primera.matched = true;
        segunda.matched = true;
        this.primeraCartaIndex = null;
        this.bloqueo = false;

        if (this.cartas.every((c) => c.matched)) {
          this.won = true;
          clearInterval(this.timer);
          await this.guardarPuntaje();
          this.mostrarToast(`🎉 Juego terminado en ${this.segundos} segundos`);
        }
      } else {
        setTimeout(() => {
          primera.flipped = false;
          segunda.flipped = false;
          this.primeraCartaIndex = null;
          this.bloqueo = false;
        }, 1000);
      }
    }
  }

  async guardarPuntaje() {
    const usuario = await this.dataService.obtenerLocal();
    if (usuario && usuario.id) {
      await this.dataService.guardarPuntaje(
        usuario.id,
        this.segundos,
        this.nivel || 'facil'
      );
    }
  }

  async verPuntajes() {
    if (!this.nivel) {
      this.mostrarToast('Selecciona un nivel');
      return;
    }
    await this.cargarTop5();
    this.estado = 'puntajes';
  }

  async cargarTop5() {
    this.presentLoading('Cargando puntajes...');
    const db = getFirestore();
    const ref = collection(db, 'puntajes');
    const q = query(
      ref,
      where('nivel', '==', this.nivel),
      orderBy('tiempo', 'asc'),
      limit(5)
    );

    const snapshot = await getDocs(q);
    this.top5 = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const user = await this.dataService.getUserInfo((data as any).userId);
        this.stopLoader();
        return {
          ...data,
          nombre: user?.nombre || 'Anónimo',
        };
      })
    );
    if (this.top5.length < 5){
      let vacio = {
        nombre:'---------',
        tiempo:'----',
        fecha:'--------',
      }
      const faltan = 5 - this.top5.length;
      for (let index = 1; index <= faltan; index++) {
        this.top5.push(vacio)       
      }
    }
  }

  reiniciarJuego() {
    clearInterval(this.timer);
    this.cartas = [];
    this.segundos = 0;
    this.nivel = null;
    this.primeraCartaIndex = null;
    this.bloqueo = false;
    this.top5 = [];
    this.estado = 'seleccion';
    this.won = false;
  }

  async mostrarToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      position: 'top',
      color: 'success',
    });
    toast.present();
  }

  async presentLoading(message) {
    const loading = await this.loadingController.create({
      message,
    });
    loading.present();
    console.log('Loading dismissed!');
  }

  stopLoader() {
    this.loadingController.dismiss();
  }
}
