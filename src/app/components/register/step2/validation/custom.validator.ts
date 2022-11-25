import { AbstractControl, FormGroup } from '@angular/forms';

// export function ValidatePass(control: AbstractControl) {
//   if (control.get('repClave')?.value == control.get('clave')?.value) {
//     console.log(control.get(['repClave'])?.value);
//     return { passwordMatch: false };
//   }
//   return null;
// }

export function ValidatePass(control: FormGroup): { [key: string]: boolean} | any {
    console.log(control);
    // if (control.value < this.fb.controls.scales[0].controls.min.value && control.value > this.scalesForm.controls.scales[0].controls.max.value) {
    //   return { invalidOrigin: true };
    // } else {
    //   return null;
    // }
}