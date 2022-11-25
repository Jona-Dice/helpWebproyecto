import { Component, OnInit } from '@angular/core';

import { PrimeNGConfig, MessageService, MenuItem, ConfirmationService } from 'primeng/api';
import * as FileSaver from 'file-saver';
import { AjustesService } from 'src/app/services/ajustes.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.component.html',
  styleUrls: ['./my-cart.component.css'],
  providers: [ MessageService, ConfirmationService ]
})
export class MyCartComponent implements OnInit {

  // Menú botón exportar
  itemExport!: MenuItem[];
  // Variables para ejemplificar una exportación en formatos xlsx y pdf respectivamente
  paises!: any[];
  pais!:any;
  // ******************* //
  forma!:FormGroup;
  cargando:boolean = true;
  verModal:boolean = false;
  submitted: boolean = false;

  constructor( private primengConfig: PrimeNGConfig, private messageService: MessageService,
               private service: AjustesService, private fb: FormBuilder ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.itemExport = [
      {
        label: 'Excel',
        icon: 'pi pi-file-excel',
        command: () => {
          this.exportExcel();
        }
      },
      {
        label: 'PDF',
        icon: 'pi pi-file-pdf',
        command: () => {
          this.exportPdf();
        }
      }
    ];
    this.cargarDatos();
    this.crearForm();
  }
  
  cargarDatos(){
    this.service.userTabla().subscribe({
      next: (res:any) => {
        this.cargando = false;
        this.paises = res;
      }, 
      error: (err: any) => {
        console.error(err);
        this.messageService.add({severity: "error", summary: "Error", detail: 'Contacte con un administrador'})
      },
      complete: () => {}
    })
  }

  crearForm(){
    this.forma = this.fb.group({
      nombre :  ['', [ Validators.required, Validators.minLength(3)] ],
      capital :  [ '', [ Validators.required, Validators.minLength(3) ] ],
      // clave  :  ['', [ Validators.required, Validators.minLength(3) ]  ],
      // recordar: [  ]
    });
  }
  
  nuevo(){
    this.forma = this.fb.group({
      // imagen :  [ ],
      nombre :  ['', [ Validators.required, Validators.minLength(3)] ],
      capital :  [ '', [ Validators.required, Validators.minLength(3) ] ],
    });
    this.submitted = false;
    this.verModal = true;
  }
  
  editar(pais: any) {
    this.pais = {...pais};
    this.forma = this.fb.group({
      // imagen :  [ {src:pais.flags.svg} ],
      nombre :  [ pais.name.common, [ Validators.required, Validators.minLength(3) ] ],
      capital :  [ pais.capital, [ Validators.required ] ],
    });
    this.verModal = true;
    console.log(pais);
  }

  eliminar( pais:any ) {
    this.paises = this.paises.filter( val => val.name.common !== pais.name.common );
    this.pais = {};
    console.log(this.paises);
    this.messageService.add({severity:'success', summary: 'Hecho', detail: 'País eliminado', life: 3000});
    // this.confirmationService.confirm({
    //     message: 'Are you sure you want to delete ' + product.name + '?',
    //     header: 'Confirm',
    //     icon: 'pi pi-exclamation-triangle',
    //     accept: () => {
    //     }
    // });
  }

  cerrarModal() {
    this.verModal = false;
    this.submitted = false;
  }

  exportPdf() {
    console.log('Pendiente');
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.paises);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "products");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

}
