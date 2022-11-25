import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AjustesService } from 'src/app/services/ajustes.service';
import CryptoES from 'crypto-es';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {

  forma!:FormGroup;
  blockedPanel:boolean = false;
  token?:string;

  constructor( private fb:FormBuilder, private messageService: MessageService,
               private ajustes: AjustesService, private router: Router,
               private primengConfig: PrimeNGConfig, private service: AjustesService ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.crearFormulario();
    this.ajustes.cambiarTema();
  }
  
  crearFormulario(){
    this.forma = this.fb.group({
      correo :  ['', [ Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')] ],
      clave  :  ['', [ Validators.required, Validators.minLength(6) ]  ],
      recordar: [  ]
    });
    this.recordarCredenciales();
  }

  recordarCredenciales(){
    if ( localStorage.getItem("correo") ) {
      let correoDecrypt = CryptoES.AES.decrypt( localStorage.getItem("correo")!, 'mail_user' ).toString(CryptoES.enc.Utf8);
      this.forma.get('correo')?.setValue(correoDecrypt);
      this.forma.get('recordar')?.setValue(true);
    } else {
      this.forma.get('recordar')?.setValue(false);
    }
  }

  login(){
    if (this.forma.invalid) {
      Object.keys(this.forma.controls).forEach( key => {
        // Obteniendo errores de cada control
        if( this.forma.get(key)?.errors !== null ){
          this.messageService.add({severity: "error", summary: "Error", detail: `El campo "${key}" está incompleto o vacío`, sticky:true});
        }
      });
    }else{
      this.messageService.clear();
      try {
        if ( this.forma.get('recordar')?.value == true ) {
          //                                      **value                     **key
          let correo = CryptoES.AES.encrypt( this.forma.get('correo')?.value, 'mail_user' ).toString();
          localStorage.setItem( "correo", correo );
        }else{
          localStorage.removeItem("correo");
        }
  
        this.service.login(this.forma.value).subscribe({
          next: (res:any) => {
            // console.log(res);
            let token = CryptoES.AES.encrypt( res.idToken, 'token_usuario' ).toString();
            
            sessionStorage.setItem( "usr_tk", token );
          }, 
          error: (err: any) => {
            // console.error(err);
            if (err.status == 400) {
              this.messageService.add({severity: "error", summary: "Error", detail: 'Usuario y/o contraseña inválidos'})
            }else{
              this.messageService.add({severity: "error", summary: "Error", detail: 'Favor contacte con un administrador'})
            }
          },
          complete: () => {
            this.router.navigate(['/test']);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

}