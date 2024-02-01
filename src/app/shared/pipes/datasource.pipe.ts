import { Pipe, PipeTransform } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";

@Pipe({
  name: 'datasource',
  standalone: true
})
export class DatasourcePipe implements PipeTransform {

  transform(value: any[] | null): MatTableDataSource<any> {
    // Se il valore è null, ritorna un nuovo MatTableDataSource con un array vuoto
    return new MatTableDataSource(value ?? []);
  }

}
