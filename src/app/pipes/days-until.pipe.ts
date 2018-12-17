import { Pipe, PipeTransform } from '@angular/core';
import {differenceInCalendarDays} from 'date-fns'
@Pipe({
  name: 'daysUntil'
})
export class DaysUntilPipe implements PipeTransform {

  transform(value: Date): any {
    const daysSinceLast = differenceInCalendarDays(new Date(), value);
    const daysLeft = 365 - daysSinceLast;
    return daysLeft > 0 ? daysLeft : 0 
  }
}
