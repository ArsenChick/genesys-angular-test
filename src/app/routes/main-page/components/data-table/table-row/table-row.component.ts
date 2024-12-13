import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { IGetCharacterResponse } from '../../../../../interfaces/api-responses.interface';

@Component({
  selector: '[app-table-row]',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './table-row.component.html',
  styleUrl: './table-row.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableRowComponent {
  @Input() rowData?: IGetCharacterResponse;
  @Output() nameClick = new EventEmitter<number>();

  onNameClick() {
    if (this.rowData)
      this.nameClick.emit(this.rowData.id);
  }
}
