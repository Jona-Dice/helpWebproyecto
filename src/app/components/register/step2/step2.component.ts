import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { AjustesService } from 'src/app/services/ajustes.service';

// Validacion personalizada
import { ValidatePass } from './validation/custom.validator';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css'],
  providers: [ MessageService ]
})
export class Step2Component implements OnInit {

  forma!:FormGroup;
  blockedDocument:boolean = false;
  habilitar:boolean = false;

  constructor( private router:Router, private messageService: MessageService,
               private primengConfig: PrimeNGConfig, private fb: FormBuilder,
               private service: AjustesService ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.crearFormulario();
  }

  crearFormulario(){
    this.forma = this.fb.group({
      correo :   ['', [ Validators.required, Validators.minLength(5), Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$') ] ],
      clave :    ['', [ Validators.required, Validators.minLength(6) ] ],
      repClave : ['', [ Validators.required ] ],
      telefono : ['', [ Validators.required] ],
    });
  }

  prueba(){
    this.router.navigate(['/register/step3']);
  }

  sigPaso(){
    if (this.forma.invalid) {
      Object.keys(this.forma.controls).forEach( key => {
        // Obteniendo errores de cada control
        if( this.forma.get(key)?.errors !== null ){
          this.messageService.add({severity: "error", summary: "Error", detail: `El campo "${key}" posee errores`});
        }
      });
    }
    else if( this.forma.get('repClave')?.value !== this.forma.get('clave')?.value ){
      this.forma.get('repClave')?.setErrors([Validators.required]);
      this.messageService.add({severity: "error", summary: "Error", detail: `Los campos "Clave y Repetir Clave" no coinciden`});
    }
    else{
      this.messageService.clear();
      this.blockedDocument = true;
      this.service.nextStep(this.forma.value);

      this.messageService.add({key:"siguiente", severity: "success", summary: "Hecho", detail: 'Enviado con éxito', life: 3000})
    }
  }

}