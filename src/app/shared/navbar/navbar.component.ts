import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api';
import { AjustesService } from 'src/app/services/ajustes.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [ MessageService ]
})
export class NavbarComponent implements OnInit {

  items!: MenuItem[];
  panelItems!: MenuItem[];
  visibleSidebar1!:boolean;

  constructor( private messageService: MessageService, private ajustes: AjustesService, private primengConfig: PrimeNGConfig ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.ajustes.cambiarTema();
    this.items = [
      {
        label:'Menu',
        icon:'pi pi-fw pi-angle-right',
        command: () => {
          this.visibleSidebar1 = true;
        }
      },
      {
        label:'Themes',
        icon:'pi pi-fw pi-palette',
        items:[
          {
            label:'Lara Dark Blue',
            icon:'pi pi-fw pi-circle',
            command: () => {
              this.ajustes.cambiarTema("assets/themes/lara-light-blue/theme.css");
            },
          },
          {
            label:'Lara Dark Blue',
            icon:'pi pi-fw pi-circle-fill',
            command: () => {
              this.ajustes.cambiarTema("assets/themes/lara-dark-blue/theme.css");
            },
          },
        ]
      },
      {
        label:'Quit',
        icon:'pi pi-fw pi-power-off',
        routerLink: '/login',
        style: {'margin-left': 'auto'},
        command: () => {
          sessionStorage.removeItem("usr_tk");
        }
      }
    ];
    // panel menu lateral
    this.panelItems = [
      {
        label: 'Empleados',
        icon: 'pi pi-fw pi-users',
        routerLink: 'users'
      }
    ]
  }

}
