import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { Imagen } from 'src/app/clases/imagen';
import { ImagenService } from 'src/app/services/imagen.service';

interface Serie {
  name: string;
  data: any;
}

enum Dia {
  Domingo,
  Lunes,
  Martes,
  Miercoles,
  Jueves,
  Viernes,
  Sabado,
}

@Component({
  selector: 'app-grafico-barras',
  templateUrl: './grafico-barras.component.html',
  styleUrls: ['./grafico-barras.component.scss'],
  standalone: false,
})
export class GraficoBarrasComponent implements OnInit {
  public highchart!: Chart;
  public data: any[] = [];
  public chartOptions: any;
  public fotos: Imagen[] = [];
  public semana: Dia[] = [
    Dia.Domingo,
    Dia.Lunes,
    Dia.Martes,
    Dia.Miercoles,
    Dia.Jueves,
    Dia.Viernes,
    Dia.Sabado,
  ];
  public assets: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.fotos = ImagenService.imagenes;
    if (this.fotos?.length) {
      this.procesarDatos();
      this.crearGrafico(this.assets);
    }
  }

  procesarDatos(): void {
    const votosPorDia: any[] = [];

    this.semana.forEach((dia) => {
      let imgSrc = '';
      let mayorVotos = 0;
      let auxiliar: any;

      this.fotos.forEach((foto) => {
        let votoActual = 0;
        
        foto.votos?.forEach((voto) => {
          console.log(voto.fecha)
          const fecha = new Date(voto.fecha);
          if (fecha.getDay() === dia) {
            votoActual++;

            if (votoActual > mayorVotos) {
              mayorVotos = votoActual;
              imgSrc = foto.url;
            
              auxiliar = {
                name: `${fecha.getDate()}/${
                  fecha.getMonth() + 1
                }/${fecha.getFullYear()}`,
                y: mayorVotos,
              };
            }
          }
        });
      });

      if (auxiliar) {
        console.log('resultaod: '+ auxiliar)
        this.assets.push(imgSrc);
        votosPorDia.push(auxiliar);
      }
    });

    this.data = votosPorDia;
    console.log('Datos procesados:', this.data);
  }

  crearGrafico(imagenes: string[]): void {
    this.highchart = new Chart({
      chart: {
        height: 400,
        width: 400,
        marginTop: 40,
        type: 'column',
      },
      title: {
        text: '',
      },
      subtitle: {
        text: 'Mayor cantidad de votos por día',
      },
      credits: {
        enabled: false,
      },
      xAxis: {
        categories: [
          'Domingo',
          'Lunes',
          'Martes',
          'Miércoles',
          'Jueves',
          'Viernes',
          'Sábado',
        ],
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Cantidad de votos',
        },
      },
      tooltip: {
        useHTML: true,
        shape: 'callout',
        borderRadius: 15,
        formatter(this: any): string {
          const index = this.point?.index ?? 0;
          const votos = this.y ?? 0;
          return `<span>Foto con mayor cantidad de votos: ${votos}</span><br>
            <p><img src="${imagenes[index]}" width="300" height="150"></p>`;
        },
      },
      series: [
        {
          type: 'column',
          name: '',
          colorByPoint: true,
          data: this.data,
        },
      ],
    });
  }
}
