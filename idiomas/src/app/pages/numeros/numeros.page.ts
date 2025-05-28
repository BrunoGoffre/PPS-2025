import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AudioService, Idioma, ILenguajeSeleccionado } from 'src/app/services/audio.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-numeros',
  templateUrl: './numeros.page.html',
  styleUrls: ['./numeros.page.scss'],
  standalone:false
})
export class NumerosPage implements OnInit {
  opcion: ILenguajeSeleccionado;

  numeros: { nombre:any,img:any, audio_es:any, audio_en:any, audio_pt:any }[] = environment.numeros;

  banderas : ILenguajeSeleccionado[] = [
    {
      idioma: Idioma.Español,
      img : '/assets/img/spanish.png'
    },
    {
      idioma: Idioma.Ingles,
      img : '/assets/img/english.png'
    },
    {
      idioma: Idioma.Portugues,
      img : '/assets/img/portuguese.png'
    }
  ];

  constructor(private audioService: AudioService) 
  {
    this.opcion = AudioService.idiomaSeleccionado; 
  }
  ngOnInit() 
  {
  }

  play(audioId: string)
  {
    this.audioService.play(audioId);
  }

  seleccionar(opcion: ILenguajeSeleccionado)
  {
    this.opcion.idioma = opcion.idioma;
    this.opcion.img = opcion.img;

    AudioService.idiomaSeleccionado = this.opcion;
  }

}
