import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginatorComponent {
  @Input() currentPage = 0;
  @Input() totalPages = 0;
  @Input() isDisabled = true;

  @Output() pageChange = new EventEmitter();

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
}
