import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from 'src/app/tokens/dom-tokens';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit {
  public signaturePad;
  public consentCanvas;

  @Output() public stroke: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    @Inject(DOCUMENT) private  document,
    @Inject(WINDOW) private window
  ){}

  ngOnInit() {
    this.consentCanvas = this.document.querySelector('.consent');
    this.signaturePad = new SignaturePad(this.consentCanvas, {
      minWidth: 0.5,
      maxWidth: 2.5,
      backgroundColor: 'rgb(230, 230, 230)',
      penColor: "rgb(66, 133, 244)", 
      onEnd: () => this.emitData(),
      onBegin: () => this.emitData(),
    });
    this.window.addEventListener("resize", this.resizeCanvas);
    this.resizeCanvas();
  }

  resizeCanvas() {
    var ratio =  Math.max(window.devicePixelRatio || 1, 1);
    this.consentCanvas.width = this.consentCanvas.offsetWidth * ratio;
    this.consentCanvas.height = this.consentCanvas.offsetHeight * ratio;
    this.consentCanvas.getContext("2d").scale(ratio, ratio);
    this.clear();
  }

  clear(){
    this.signaturePad.clear();
    this.signaturePad.onEnd();
  }

  emitData(){
    this.stroke.emit(
      this.signaturePad.isEmpty()
        ? null
        : this.signaturePad.toDataURL("image/svg+xml")
    );
  }
}
