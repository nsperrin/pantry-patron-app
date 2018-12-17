import { Component } from '@angular/core';

@Component({
  selector: 'app-signature-dialog',
  templateUrl: './signature-dialog.component.html',
  styleUrls: ['./signature-dialog.component.scss']
})
export class SignatureDialogComponent {
  public signature

  saveSignature(signature){
    this.signature = signature;
  }
}
