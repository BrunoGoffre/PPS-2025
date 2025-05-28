import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { Imagen, TipoImagen } from 'src/app/clases/imagen';
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
  Sabado
}

@Component({
  selector: 'app-grafico-torta-feas',
  templateUrl: './grafico-torta-feas.component.html',
  styleUrls: ['./grafico-torta-feas.component.scss'],
  standalone: false
})
export class GraficoTortaFeasComponent implements OnInit {
  public highchart!: Chart;
  public data: any[] = [];
  public semana: Dia[] = [
    Dia.Domingo,
    Dia.Lunes,
    Dia.Martes,
    Dia.Miercoles,
    Dia.Jueves,
    Dia.Viernes,
    Dia.Sabado,
  ];
  public fotos: Imagen[] = [];
  public assets: string[] = [];

  constructor() {}

  ngOnInit(): void {
    this.fotos = ImagenService.fotosFeas;
    if (this.fotos?.length) {
      setTimeout(() => {
        this.procesarDatos();
        this.crearGrafico(this.assets);
      }, 0);
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
          const fecha = new Date(voto.fecha);
          if (fecha.getDay() === dia) {
            votoActual++;
            if (votoActual > mayorVotos) {
              mayorVotos = votoActual;
              imgSrc = foto.url;
              auxiliar = {
                name: Dia[fecha.getDay()],
                y: mayorVotos,
              };
            }
          }
        });
      });

      if (auxiliar) {
        this.assets.push(imgSrc);
        votosPorDia.push(auxiliar);
      }
    });

    this.data = votosPorDia;
    console.log('Datos torta:', this.data);
  }

  crearGrafico(imagenes: string[]): void {
    this.highchart = new Chart({
      chart: {
        height: 400,
        width: 400,
        marginTop: 40,
        type: 'pie',
      },
      title: {
        text: 'Mayor cantidad de votos por día',
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        useHTML: true,
        shared: true,
        shape: 'callout',
        borderRadius: 15,
        formatter(this: any): string {
          const index = this.point?.x ?? 0;
          const votos = this.y ?? 0;
          return `<span>Foto con mayor cantidad de votos: ${votos}</span><br>
                  <p><img src="${imagenes[index]}" width="600" height="150"></p>`;
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
          },
          showInLegend: true,
        },
      },
      series: [
        {
          type: 'pie',
          name: 'Votos',
          colorByPoint: true,
          data: this.data,
        } as any,
      ],
    });
  }
}
