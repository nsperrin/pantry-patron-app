import { Injectable } from '@angular/core';
import { ElectronService } from 'ngx-electron';
import { BehaviorSubject, timer } from 'rxjs';
import { take } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class PatronService {
  private _patrons = new BehaviorSubject<any[]>([]);

  constructor(private electron: ElectronService) { 
    electron.ipcRenderer.on('patrons:retrieved', (e, data: any[]) => {
      this._patrons.next(data);
    });
  }

  get(){
    timer(0, 500).pipe(take(3)).subscribe(() => this.electron.ipcRenderer.send('get:all'));
    return this._patrons;
  }

  delete(patron){
    this.electron.ipcRenderer.send('delete', patron._id);
  }

  save(patron){
    this.electron.ipcRenderer.send('save', patron);
  }

  addVisit(patron, signature){
    this.electron.ipcRenderer.send('visit', {patron, signature});
  }
}
