import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { Usuario } from 'src/app/clases/usuario';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-popinfo',
  templateUrl: './popinfo.component.html',
  styleUrls: ['./popinfo.component.scss'],
  standalone: false
})
export class PopinfoComponent  implements OnInit {

  @Input() selectUser: Subject<{mail:string, pass:string, rol:string}> = new Subject();
  perfiles: any = environment.usuario;
  mensaje: string = '';
  rol: string = "";
  constructor(public toastController: ToastController) { }

  ngOnInit() {}
  onClick( valor: string)
  {
    this.rol = valor;
    const data = {
      mail: this.perfiles[this.rol.toLocaleLowerCase()].email,
      pass: this.perfiles[this.rol.toLocaleLowerCase()].pass,
      rol: this.perfiles[this.rol.toLocaleLowerCase()].rol,
    };
    
    this.selectUser.next(data);
    // this.dataService.login(this.usuario).then(()=>{
    //   this.presentToast(`Perfil : ${this.usuario.rol}`);
    //   this.router.navigate(['/menu']);
    // }).
    // catch( err => this.presentToast(err)).
    // finally(() => this.popoverCtrl.dismiss());
  }
}
