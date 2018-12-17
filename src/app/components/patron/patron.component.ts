import { Component, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { PatronService } from '../../services/patron/patron.service';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { isToday } from 'date-fns';

@Component({
  selector: 'app-patron',
  templateUrl: './patron.component.html',
  styleUrls: ['./patron.component.scss']
})
export class PatronComponent implements OnDestroy, AfterViewInit {
  public form: FormGroup;
  public nameControl;
  public dobControl;
  public phoneControl;
  public addressControl;
  public cityControl;
  public stateControl;
  public zipControl;
  public membersInHouseholdControl;
  public monthlyGrossIncomeControl;
  public dateOfConsentControl;
  public signature;

  private datePipe = new DatePipe(navigator.language)
  private patronData;
  private subscriptions = new Subscription();

  private valueIsToday = ():ValidatorFn => async (control): Promise<{[key: string]: any} | null> => 
    isToday(control.value)
      ? null
      : { 'valueIsToday': {value: control.value}} ;
  

  constructor(
    fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private patronService: PatronService) {    
    this.form = fb.group({
      personal: fb.group({
        name: ['', Validators.required],
        dob: ['', Validators.required],
        phone: ['', Validators.required],
        address: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required]
      }),
      ethnicity: fb.group({
        black: [false],
        white: [false],
        asian: [false],
        hispanic: [false],
        amIndian: [false],
        pacific: [false],
        other: [false],
        otherValue: ['']
      }),
      proofOfSelf: fb.group({
        proofOfIdentity: [''],
        proofOfIdentityOtherValue: [''],
        proofOfAddress: [''],
        proofOfAddressOtherValue: ['']
      }),
      eligibility: fb.group({
        sectionA: fb.group({
          proofOfParticipation: ['']
        }),
        sectionB: fb.group({
          membersInHousehold: ['', Validators.required],
          monthlyGrossIncome: ['', Validators.required]
        })
      }),
      memberAges: fb.array(['','','','','','','','','','']),
      consent: fb.group({
        dateOfConsent: [this.currentDate(), Validators.required, this.valueIsToday()]
      })
    });

    const personalGroup = this.form.controls['personal'] as FormGroup;
    this.nameControl = personalGroup.controls['name'];
    this.dobControl = personalGroup.controls['dob'];
    this.phoneControl = personalGroup.controls['phone'];
    this.addressControl = personalGroup.controls['address'];
    this.cityControl = personalGroup.controls['city'];
    this.stateControl = personalGroup.controls['state'];
    this.zipControl = personalGroup.controls['zip'];

    const housholdGroup = (this.form.controls['eligibility'] as FormGroup).controls['sectionB'] as FormGroup
    this.membersInHouseholdControl = housholdGroup.controls['membersInHousehold'];
    this.monthlyGrossIncomeControl = housholdGroup.controls['monthlyGrossIncome'];

    const consent = this.form.controls['consent'] as FormGroup;
    this.dateOfConsentControl = consent.controls['dateOfConsent'];

    this.subscriptions.add(this.route.queryParams.pipe(
      switchMap(params => this.patronService.get().pipe(
        map(patrons => patrons.filter(patron => patron._id === params.id))
      ))
    ).subscribe((data:any) => {
      this.patronData = data;
    }));
   }

  ngAfterViewInit(): void {
    if(this.patronData && this.patronData.length){
      this.form.patchValue(this.patronData[0]);
      this.cd.detectChanges();
    }
  }

  ngOnDestroy(){
    if(this.subscriptions){
      this.subscriptions.unsubscribe
    }
  }

  array(n: number){
    return Array(n);
  }

  save(){
    const value = this.form.value;
    value.consent.signature = this.signature;
    if(this.patronData && this.patronData.length){
      const data = this.patronData[0];
      value._id = data._id;
    }
    this.patronService.save(value);
    this.router.navigate(['/']);
  }

  storeSignature(signature){
    this.signature = signature;
  }

  private currentDate() {
    return this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }
}
