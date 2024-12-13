import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { TableRowComponent } from "./table-row/table-row.component";
import { LoadingSpinnerComponent } from "../../../../components/loading-spinner/loading-spinner.component";

import { IGetCharacterResponse } from '../../../../interfaces/api-responses.interface';
import { ROUTE_NAMES } from '../../../../constants';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [LoadingSpinnerComponent, TableRowComponent],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {
  @Input() tableRows: IGetCharacterResponse[] = [];
  @Input() isLoading = true;

  constructor(
    private router: Router,
  ) {}

  onNameClick(id: number) {
    this.router.navigate([`/${ROUTE_NAMES.profile}`, id]);
  }
}
