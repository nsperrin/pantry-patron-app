import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common'

@Pipe({
  name: 'lastVisit'
})
export class LastVisitPipe implements PipeTransform {

  transform(value: any[]): any {
    const datePipe = new DatePipe(navigator.language);
    return value.length 
      ? datePipe.transform(value[value.length-1].date, 'MM/dd/yyy')
      : "N/A";
  }

}
