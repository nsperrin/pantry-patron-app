import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { 
  MatInputModule, MatCheckboxModule, 
  MatSelectModule, MatRadioModule, 
  MatTableModule, MatDialogModule, 
  MatButtonModule, MatSortModule,
} from '@angular/material';
import { NgxElectronModule } from 'ngx-electron';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { PatronComponent } from './components/patron/patron.component';
import { SignatureComponent } from './components/signature/signature.component';
import { SignatureDialogComponent } from './components/signature-dialog/signature-dialog.component';
import { DeleteConfirmationDialogComponent } from './components/delete-confirmation-dialog/delete-confirmation-dialog.component';

import { LastVisitPipe } from './pipes/last-visit.pipe';

import { PatronService } from './services/patron/patron.service';

import { WINDOW, windowFactory } from './tokens/dom-tokens';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { DaysUntilPipe } from './pipes/days-until.pipe';

library.add(fas, far);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PatronComponent,
    SignatureComponent,
    SignatureDialogComponent,
    DeleteConfirmationDialogComponent,
    LastVisitPipe,
    DaysUntilPipe
  ],
  imports: [
    CommonModule, 
    BrowserModule,
    NgxElectronModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatSelectModule,
    MatRadioModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    AppRoutingModule,
  ],
  entryComponents: [
    SignatureDialogComponent,
    DeleteConfirmationDialogComponent,
  ],
  providers: [
    PatronService,
    { provide: WINDOW, useFactory: windowFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
