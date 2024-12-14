import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  @Output() nameChange = new EventEmitter<string>();
  @Input() label = 'Search';
  @Input() placeholder = 'Enter search term';

  readonly searchBar = new FormControl('');

  constructor() {
    // Want to send values only if they have changed
    this.searchBar.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntilDestroyed(),
    ).subscribe(name => {
      if (name !== null) {
        this.nameChange.emit(name);
      }
    });
  }
}
