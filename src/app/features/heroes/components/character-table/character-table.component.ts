import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { CharacterRowComponent } from "./character-row/character-row.component";
import { LoadingSpinnerComponent } from '../../../../components/widgets/loading-spinner/loading-spinner.component';

import { ICharacter } from '../../interfaces/character.interface';
import { ROUTE_NAMES } from '../../../../constants';

@Component({
  selector: 'app-character-table',
  standalone: true,
  imports: [LoadingSpinnerComponent, CharacterRowComponent],
  templateUrl: './character-table.component.html',
  styleUrl: './character-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterTableComponent {
  @Input() tableRows: ICharacter[] = [];
  @Input() isLoading = true;

  constructor(
    private router: Router,
  ) {}

  onNameClick(id: number) {
    this.router.navigate([`/${ROUTE_NAMES.profile}`, id]);
  }
}
