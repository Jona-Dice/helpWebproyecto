import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AjustesService } from 'src/app/services/ajustes.service';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css'],
  providers: [ MessageService ]
})
export class Step3Component implements OnInit {

  forma!:FormGroup;
  blockedDocument:boolean = false;
  infoNewUser:any;
  vacio:boolean = false;

  constructor( private primengConfig: PrimeNGConfig, private fb: FormBuilder,
               private service: AjustesService, private messageService: MessageService,
               private router: Router ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.crearFormulario();
  }
  
  crearFormulario(){
    this.infoNewUser = this.service.arrayRegistro;
    if ( Object.keys(this.infoNewUser).length == 0 ) {
      this.vacio = true;
      this.forma = this.fb.group({
        nombres :   [ '' , [ Validators.required, Validators.minLength(3)] ],
        apellidos : [ '' , [ Validators.required, Validators.minLength(3)] ],
        edad :      [ '18' , [ Validators.required, Validators.min(18)] ],
        correo :    [ '' , [ Validators.required, Validators.minLength(5)] ],
        clave :     [ '', [ Validators.required, Validators.minLength(6) ] ],
        telefono :  [ '' , [ Validators.required] ],
      });
      this.router.navigate(['/register/step1'])
    }else{
      this.vacio = false;
      this.forma = this.fb.group({
        nombres :   [ this.infoNewUser.nombres , [ Validators.required, Validators.minLength(3)] ],
        apellidos : [ this.infoNewUser.apellidos , [ Validators.required, Validators.minLength(3)] ],
        edad :      [ this.infoNewUser.edad , [ Validators.required, Validators.min(18)] ],
        correo :    [ this.infoNewUser.correo , [ Validators.required, Validators.minLength(5)] ],
        clave :     [ this.infoNewUser.clave, [ Validators.required, Validators.minLength(6) ] ],
        telefono :  [ this.infoNewUser.telefono , [ Validators.required] ],
      });
    }
  }
  
  prueba(){
    this.router.navigate(['/login']);
  }
  
  sigPaso(){
    if (this.forma.invalid) {
        this.messageService.add({severity: "error", summary: "Error", detail: 'Campos Vacíos, contacte con un administrador'});
    }else{
      this.messageService.clear();
      this.blockedDocument = true;
      this.service.limpiarArr();
      this.service.nuevaCuenta( this.forma.value ).subscribe({
        next: (res:any) => {
          if (res.idToken) {
            console.log(res);
            return true;
          }else{
            return false;
          }
        }, 
        error: (err: any) => {
          if (err.error.error.code = 400) {
            this.messageService.add({severity: "error", summary: "Error", detail: 'Ya existe un usuario con la cuenta de correo ingresada'});
          }
        },
        complete: () => {
          this.messageService.clear();
          this.messageService.add({key:"siguiente", severity: "success", summary: "Hecho", detail: 'Cuenta creada con éxito!', life: 3000});
        }
      })
    }
  }

}
