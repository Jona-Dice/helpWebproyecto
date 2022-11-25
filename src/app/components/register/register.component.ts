import { Component, OnInit } from '@angular/core';

import { PrimeNGConfig } from 'primeng/api';
import { MessageService, MenuItem } from 'primeng/api';
import { AjustesService } from 'src/app/services/ajustes.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {

  items!:MenuItem[];
  
  constructor( private messageService: MessageService, private primengConfig: PrimeNGConfig, private ajustes: AjustesService ) { }
  
  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.ajustes.cambiarTema();
    this.items = [{
        label: 'Básico',
        routerLink: '/register/step1'
      },
      {
        label: 'Personal',
        routerLink: '/register/step2'
      },
      {
        label: 'Completado',
        routerLink: '/register/step3'
      },
      // {
      //   label: 'Confirmation',
      //   routerLink: 'confirmation'
      // }
    ];
  }

}
