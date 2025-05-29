import { Timestamp } from "firebase/firestore";

export class Usuario {
  userId: string; // referencia al id del usuario
  tiempo: number; // en segundos
  fecha: Timestamp; // fecha de juego
  nivel: 'fácil' | 'medio' | 'difícil';
}
