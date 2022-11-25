import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})

export class AjustesService {

  private url = environment.url;
  private apiKey = environment.apiKey;
  
  // Crear un nuevo usuario
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
  // Iniciar sesión con cuenta ya existente
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  arrayRegistro:any = {};

  constructor( @Inject(DOCUMENT) private document: Document, private http: HttpClient,
               private firestore: AngularFirestore ) {}
  
  // Si hay tema en localStorage y no viene orden de cambio, se conserva; sino se cambia
  cambiarTema( tema?:string ){
    let temaSt = localStorage.getItem("Tema");
    if ( temaSt && !tema ) {
      // localStorage.setItem("Tema", `${tema}`);
      let themeLink = this.document.getElementById('app-tema') as HTMLLinkElement;
      let temaSt = localStorage.getItem("Tema");
      themeLink.href = `${temaSt}`;
    }else if( tema ){
      localStorage.setItem("Tema", `${tema}`);
      let themeLink = this.document.getElementById('app-tema') as HTMLLinkElement;
      let temaSt = localStorage.getItem("Tema");
      themeLink.href = `${temaSt}`;
    }
  }

  logout(){
    // usr_tk
  }

  login( jsonArr:any ){
    let authData = {
      email: jsonArr.correo,
      password: jsonArr.clave,
      returnSecureToken: true
    }
    return this.http.post(`${this.url}:signInWithPassword?key=${this.apiKey}`, authData);
  }

  nuevaCuenta( jsonArr:any ){
    let authData = {
      email: jsonArr.correo,
      password: jsonArr.clave,
      returnSecureToken: true
    }
    return this.http.post(`${this.url}:signUp?key=${this.apiKey}`, authData);
  }

  nextStep( jsonArr:any ){
    // Agregando elementos al final del objeto
    this.arrayRegistro = Object.assign(this.arrayRegistro, jsonArr)
    // console.log(this.arrayRegistro);
    
  }

  limpiarArr(){
    this.arrayRegistro = {}
    // console.log(this.arrayRegistro);
  }

  userTabla(){
    return this.http.get(`https://restcountries.com/v3.1/region/ame`).pipe(
      map( res => this.crearArreglo(res) )
    );
  }

  getEmpleados(){
    return this.firestore.collection('empleados').valueChanges().pipe(
      map( res => this.crearArreglo(res) )
    );
  }
  
  addEmpleados(form:any){
    // console.log(form);
    let id:any;
    this.firestore.collection('empleados').add(form).then(function(docRef) {
      console.log("Document written with ID: ", docRef.id);
      id = docRef.id;
      // console.log(id);
    }).finally(()=>this.update(id));
  }

  update(id:any){
    this.firestore.collection('empleados').doc(`${id}`).update({"id":id})
  }
  
  update2(forma:any){
    // console.log(forma);
    return this.firestore.collection('empleados').doc(`${forma.idEmp}`).update(
      {
        "nombres": forma.nombres,
        "apellidos": forma.apellidos,
        "area": forma.area,
        "subarea": forma.subarea,
        "tipo_docu": forma.tipo_docu
      }
    );
  }

  deleteEmpleado( id:any ){
    // return this.firestore.collection('empleados').doc('oJeUbizpmzgirpj2SC1X').delete()
    return this.firestore.collection('empleados').doc(id).delete();
  }

  crearArreglo( paisesArr: any ){

    const paises:any=[];

    Object.keys( paisesArr ).forEach( key =>{
      const pais = paisesArr[key];
      paises.push(pais);
    });
    return paises;
  }

}