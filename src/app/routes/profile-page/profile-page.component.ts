import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, distinctUntilChanged, EMPTY, map, switchMap } from 'rxjs';

import { LoadingSpinnerComponent } from '../../components/widgets/loading-spinner/loading-spinner.component';

import { RickAndMortyApiService } from '../../features/heroes/services/rick-and-morty-api.service';

import { ROUTE_NAMES } from '../../constants';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    AsyncPipe,
    NgOptimizedImage,
    RouterLink,
    LoadingSpinnerComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  readonly characterId$ = this.route.paramMap.pipe(
    map(params => Number(params.get('id'))),
    distinctUntilChanged(),
  );

  readonly characterData$ = this.characterId$.pipe(
    switchMap(id => {
      if (!isNaN(id)) {
        this.error.set(false);

        return this.apiService.getCharacterById(id).pipe(
          catchError(() => {
            this.error.set(true);
            return EMPTY;
          }));
      }

      this.error.set(true);
      return EMPTY;
    }),
  );

  readonly homeLink = `/${ROUTE_NAMES.home}`;
  readonly error = signal(false);

  constructor (
    private readonly apiService: RickAndMortyApiService,
    private readonly route: ActivatedRoute,
  ) {}
}
