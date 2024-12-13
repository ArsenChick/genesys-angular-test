import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, Subject, Subscription, takeUntil, timer } from 'rxjs';

import { DataTableComponent } from "./components/data-table/data-table.component";
import { SearchBarComponent } from "./components/search-bar/search-bar.component";
import { PaginatorComponent } from "./components/paginator/paginator.component";
import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";

import { RickAndMortyApiService } from '../../services/rick-and-morty-api.service';

import { IGetCharacterResponse } from '../../interfaces/api-responses.interface';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    AsyncPipe,
    DataTableComponent,
    LoadingSpinnerComponent,
    SearchBarComponent,
    PaginatorComponent,
],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPageComponent implements OnInit, OnDestroy {

  totalPages$!: Observable<number>;
  currentPageData$!: Observable<IGetCharacterResponse[]>;

  isPaginatorDisabled = true;
  isTableLoading = true;
  currentSearchTerm = '';
  currentPage = 1;

  private destroy$ = new Subject<void>();
  private tableLoadingDelaySubscription?: Subscription;

  constructor (
    private apiService: RickAndMortyApiService,
    private changeDetectionRef: ChangeDetectorRef,
  ) {}

  onNameChange(name: string) {
    this.currentSearchTerm = name;
    this.onPageChange(1);
  }

  onPageChange(page: number) {
    this.isPaginatorDisabled = true;
    this.tableLoadingDelaySubscription = timer(250)     // <--- To prevent flickering of loading
      .pipe(takeUntil(this.destroy$))                   //      spinner decided to add a delay for
      .subscribe(_ => {                                 //      setting the property to true
        this.isTableLoading = true;
        this.changeDetectionRef.markForCheck();
      });      
    this.currentPage = page;
    this.apiService.getPageOfCharactersByName(page, this.currentSearchTerm);
  }

  ngOnInit() {
    this.totalPages$ = this.apiService.totalPages$;
    this.currentPageData$ = this.apiService.currentPageData$;

    this.currentPageData$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(_ => {
      if (this.tableLoadingDelaySubscription) {
        // If there was a subscription, unsubscribe
        this.tableLoadingDelaySubscription.unsubscribe();
      }
      this.isPaginatorDisabled = false;
      this.isTableLoading = false;
    });

    this.apiService.getPageOfCharactersByName(
      this.currentPage, this.currentSearchTerm);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
