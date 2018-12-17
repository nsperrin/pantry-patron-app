import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-signature-dialog',
  templateUrl: './signature-dialog.component.html',
  styleUrls: ['./signature-dialog.component.scss']
})
export class SignatureDialogComponent {
  public signature
  public date = new FormControl('');

  ngOnInit(){
    this.date.valueChanges.subscribe(date =>{
      this.signature = {...this.signature, date}
      console.log(this.signature);
    });
  }

  saveSignature(signature){
    this.signature = {...this.signature, signature};
    console.log(this.signature);
  }
}
