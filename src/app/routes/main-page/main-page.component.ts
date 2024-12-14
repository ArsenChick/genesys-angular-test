import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { distinctUntilChanged, map, Observable, startWith, switchMap, timer } from 'rxjs';

import { CharacterTableComponent } from '../../features/heroes/components/character-table/character-table.component';
import { SearchBarComponent } from '../../features/search-bar/search-bar.component';
import { PaginatorComponent } from '../../features/paginator/paginator.component';
import { LoadingSpinnerComponent } from '../../components/widgets/loading-spinner/loading-spinner.component';

import { RickAndMortyApiService } from '../../features/heroes/services/rick-and-morty-api.service';

import { ICharacter } from '../../features/heroes/interfaces/character.interface';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    AsyncPipe,
    CharacterTableComponent,
    LoadingSpinnerComponent,
    SearchBarComponent,
    PaginatorComponent,
],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit {

  readonly totalPages$: Observable<number> = this.apiService.totalPages$;
  readonly currentPageData$: Observable<ICharacter[]> = this.apiService.currentPageData$;
  readonly isPaginatorDisabled$: Observable<boolean> = this.apiService.loadingData$;
  readonly currentPage$ = this.apiService.currentPage$;

  // To prevent flickering of the loading spinner
  readonly isTableLoading$ = this.apiService.loadingData$.pipe(
    switchMap(loading => loading
      ? timer(250).pipe(map(() => true))      // Delaying the value of isTableLoading$ = true
      : timer(0).pipe(map(() => false)),      // However, false will arrive immediately
    ),
    startWith(false),
    distinctUntilChanged(),
  );

  constructor (
    private readonly apiService: RickAndMortyApiService,
  ) {}

  onNameChange(name: string) {
    this.apiService.setName(name);
  }

  onPageChange(page: number) {
    this.apiService.setPage(page);
  }

  ngOnInit() {
    // First page, no name filter
    this.apiService.setPage(1);
    this.apiService.setName('');
  }
}
