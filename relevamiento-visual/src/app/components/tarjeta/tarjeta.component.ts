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

  ngOnInit() {}

  votar()
  {
    if(!this.imagen.votos.includes(this.usuario.id))
    {
      this.imagen.votos.push(this.usuario.id);
      this.imagenService.actualizar(this.imagen);

    }
  }

}
