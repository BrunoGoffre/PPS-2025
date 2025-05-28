import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  standalone: false
})
export class SplashComponent implements OnInit {

  constructor(
    public viewCtrl: ModalController,
    private router: Router
  ) {
    setTimeout(() => {
      this.viewCtrl.dismiss().then(() => console.log("Dismiss"));
    }, 5000);
  }

  ngOnInit() {
    
  }
}
