import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MessageService, PrimeNGConfig } from 'primeng/api';
import { AjustesService } from 'src/app/services/ajustes.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  providers: [ MessageService ]
})
export class UsersComponent implements OnInit {

  empleados:any = [];
  loading:boolean = true;
  verModal:boolean = false;
  forma!:FormGroup;
  agregar:string = "Agregar";
  nuevo:string = "Nuevo Empleado";

  constructor( private service: AjustesService, private primengConfig: PrimeNGConfig,
               private messageService: MessageService, private fb:FormBuilder ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.getEmpleadosAll();
    this.crearFormulario();
  }

  getEmpleadosAll(){
    this.service.getEmpleados().subscribe({
      next: (res:any) => {
        this.loading = false;
        this.empleados = res;
        // console.log(res);
      }, 
      error: (err: any) => {
        console.error(err);
        this.messageService.add({severity: "error", summary: "Error", detail: 'Contacte con un administrador'})
      },
      complete: () => {}
    });
  }

  crearFormulario(){
    this.forma = this.fb.group({
      nombres :  ['', [ Validators.required, Validators.minLength(4) ] ],
      apellidos  :  ['', [ Validators.required, Validators.minLength(4) ]  ],
      tipo_docu  :  ['', [ Validators.required, Validators.minLength(3) ]  ],
      area  :  ['', [ Validators.required, Validators.minLength(3) ]  ],
      subarea  :  ['', [ Validators.required, Validators.minLength(3) ]  ],
      idEmp: [ '' ]
    });
  }

  agregarUser(){
    if (this.forma.invalid) {
      Object.keys(this.forma.controls).forEach( key => {
        // Obteniendo errores de cada control
        if( this.forma.get(key)?.errors !== null ){
          this.messageService.add({severity: "error", summary: "Error", detail: `El campo "${key}" está incompleto o vacío`, sticky:true});
        }
      });
    }else{
      this.messageService.clear();
      this.service.addEmpleados(this.forma.value);
      this.messageService.add({ severity: "success", summary: "Hecho", detail: 'Empleado Agregado', life:2500 });
      this.forma.reset();
    }
  }

  borrarEmpleado( empleadoId:any ){
    this.messageService.clear();
    this.messageService.add({ severity: "success", summary: "Hecho", detail: 'Empleado Eliminado', life:2500 });
    this.service.deleteEmpleado(empleadoId);
    // console.log(empleadoId);
  }
  
  getById( empleado:any ){
    this.forma = this.fb.group({
      nombres :     [ empleado.nombres, [ Validators.required, Validators.minLength(4) ] ],
      apellidos  :  [ empleado.apellidos, [ Validators.required, Validators.minLength(4) ]  ],
      tipo_docu  :  [ empleado.tipo_docu, [ Validators.required, Validators.minLength(3) ]  ],
      area  :       [ empleado.area, [ Validators.required, Validators.minLength(3) ]  ],
      subarea  :    [ empleado.subarea, [ Validators.required, Validators.minLength(3) ]  ],
      idEmp: [ empleado.id ]
    });
  }
  
  editar(){
    this.service.update2(this.forma.value);
    this.messageService.add({ severity: "success", summary: "Hecho", detail: 'Empleado Editado con Éxito', life:2500 });
  }

  cleanModal(){
    this.forma.reset();
  }

  accionModal(){
    if ( this.agregar=="Agregar" ) {
      this.agregarUser();
    } else {
      this.editar();
    }
  }
  
}
