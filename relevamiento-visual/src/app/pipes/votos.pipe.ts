import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'votos',
  standalone: false
})
export class VotosPipe implements PipeTransform {

  transform(value: string[], ...args: unknown[]): unknown {
    if(value)
    {
      return value.length
    }
    else
    {
      return 0;
    }
  }

}
