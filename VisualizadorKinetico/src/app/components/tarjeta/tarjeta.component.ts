import { Component, Input, OnInit } from '@angular/core';
import { Imagen } from 'src/app/clases/imagen';
import { Usuario } from 'src/app/clases/usuario';
import { DataService } from 'src/app/services/data.service';
import { ImagenService } from 'src/app/services/imagen.service';

@Component({
  selector: 'app-tarjeta',
  templateUrl: './tarjeta.component.html',
  styleUrls: ['./tarjeta.component.scss'],
  standalone: false
})
export class TarjetaComponent implements OnInit {
  @Input() imagen: Imagen;
  usuario: Usuario;

  constructor(private dataService: DataService, private imagenService: ImagenService) 
  {
    this.dataService.obtenerLocal()
        .then( data => {
          this.usuario = Object.assign(new Usuario, data);
        });
  }

  ngOnInit() {
    console.log('imagen a mostrar: ' + this.imagen.nombreUsuario)
  }

  votar()
  {
    if(!this.imagen.votos || !(this.imagen.votos && this.imagen.votos.find((voto) => voto.userId == this.usuario.id)))
    {
      const voto = {
        userId: this.usuario.id,
        fecha: new Date().toUTCString(),
      }
      this.imagen.votos.push(voto);
      this.imagenService.actualizarOCrear(this.imagen);

    }
  }

}
