import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MessageService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { AjustesService } from 'src/app/services/ajustes.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css'],
  providers: [ MessageService ]
})
export class Step1Component implements OnInit{

  forma!:FormGroup;
  blockedDocument:boolean = false;
  formVal:any = {};

  constructor( private messageService: MessageService, private fb: FormBuilder,
               private primengConfig: PrimeNGConfig, private router: Router,
               private service: AjustesService ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.crearFormulario();
  }

  crearFormulario(){
    this.forma = this.fb.group({
      nombres : [null, [ Validators.required, Validators.minLength(3)] ],
      apellidos : [null, [ Validators.required, Validators.minLength(3)] ],
      edad : ['18', [ Validators.required, Validators.min(18)] ],
    });
  }

  prueba(){
    this.router.navigate(['/register/step2']);
  }

  sigPaso(){
    if (this.forma.invalid) {
      
      Object.keys(this.forma.controls).forEach( key => {
        // Get errors of every form control
        console.log(this.forma.get(key)?.errors);
        if( this.forma.get(key)?.errors !== null ){
          this.messageService.add({severity: "error", summary: "Error", detail: `El campo "${key}" posee errores`});
        }
      });
      // console.log(this.forma.getError("nombres"))
    }else{
      this.messageService.clear();
      this.blockedDocument = true;
      this.service.nextStep(this.forma.value);

      this.messageService.add({key:"siguiente", severity: "success", summary: "Hecho", detail: 'Enviado con éxito', life: 3000})
    }
  }

}
