import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AudioService, Idioma, ILenguajeSeleccionado } from 'src/app/services/audio.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-colores',
  templateUrl: './colores.page.html',
  styleUrls: ['./colores.page.scss'],
  standalone:false
})
export class ColoresPage implements OnInit {
  opcion: ILenguajeSeleccionado;

  colores: { nombre:any,img:any, audio_es:any, audio_en:any, audio_pt:any }[] =  environment.colores;

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
    
  }

  ngOnInit() 
  {
    this.opcion = AudioService.idiomaSeleccionado; 
  }

  seleccionar(opcion: ILenguajeSeleccionado)
  {
    this.opcion.idioma = opcion.idioma;
    this.opcion.img = opcion.img;

    AudioService.idiomaSeleccionado = this.opcion;
  }


}
