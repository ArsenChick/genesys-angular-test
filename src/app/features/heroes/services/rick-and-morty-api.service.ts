import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  BehaviorSubject, EMPTY, Observable, ReplaySubject, Subject,
  catchError, combineLatest, debounceTime, distinctUntilChanged,
  finalize, of, switchMap, tap, throwError,
} from 'rxjs';

import { IGetAllCharactersResponse } from '../interfaces/api-responses.interface';
import { ICharacter } from '../interfaces/character.interface';
import { API_CHARACTER_ENDPOINT_URL, API_CHARACTER_ENDPOINT_FILTER_PARAMS } from '../../../constants';

// Empty response constant, will be sent when request results in error
const EMPTY_PAGE_RESP: IGetAllCharactersResponse = {
  info: {
    pages: 0
  },
  results: [],
};

// Small macro to reuse in the component's methods
const handleApiError$ = <T>(consoleMessage: string, errorMessage: string) => {
  return catchError<T, Observable<never>>(error => {
    console.error(consoleMessage, error);
    return throwError(() => new Error(errorMessage));
  });
};

@Injectable({
  providedIn: 'root'
})
export class RickAndMortyApiService {

  private readonly _totalPages = new ReplaySubject<number>(1);
  private readonly _currentPageData = new ReplaySubject<ICharacter[]>(1);
  private readonly _loadingData = new BehaviorSubject<boolean>(false);
  private readonly _currentPageIndex = new ReplaySubject<number>(1);
  private readonly _pattern = new ReplaySubject<string>(1);

  readonly totalPages$ = this._totalPages.asObservable();
  readonly currentPageData$ = this._currentPageData.asObservable();
  readonly loadingData$ = this._loadingData.asObservable();
  readonly currentPage$ = this._currentPageIndex.asObservable().pipe(
    distinctUntilChanged(),
  );
  // To not perform many requests at once on input change
  // (will only send one after 500ms of inactivity in the search bar)
  private readonly pattern$ = this._pattern.asObservable().pipe(
    debounceTime(500),
    distinctUntilChanged(),
    /* Also need to set the page to the first one on every pattern change.
     * I suppose the request for the previous search term may fire still,
     * however, the new pattern will emmited from the observable 
     * virtually at the same time. */
    tap(() => this._currentPageIndex.next(1)),
  );

  constructor(
    private readonly http: HttpClient
  ) {
    // Perform request for a table page whenever the page or searchTerm change
    // (when the respective observables emit new values, to be precise)
    combineLatest([
      this.currentPage$,
      this.pattern$,
    ]).pipe(
      // Set loading to true
      tap(() => this._loadingData.next(true)),
      // Perform request with switchMap to cancel the pending ones
      switchMap(([page, name]) =>
        this._getPageOfCharactersByName(page, name).pipe(
          catchError(() => of(EMPTY_PAGE_RESP)),
          // Indicate that the loading has finished
          finalize(() => this._loadingData.next(false)),
        )),
    ).subscribe(response => {
      // Send new values to the observables
      this._totalPages.next(response.info.pages);
      this._currentPageData.next(response.results);
    });
  }

  public getCharacterById(id: number): Observable<ICharacter> {
    const url = `${API_CHARACTER_ENDPOINT_URL}/${id}`;
    return this.http.get<ICharacter>(url).pipe(
      handleApiError$('Character request error. Details: ', 'Error'),
    );
  }

  public setPage(page: number) {
    this._currentPageIndex.next(page);
  }

  public setName(name: string) {
    this._pattern.next(name);
  }

  private _getPageOfCharactersByName(page: number, name: string): Observable<IGetAllCharactersResponse> {
    const paramNames = API_CHARACTER_ENDPOINT_FILTER_PARAMS;
    let httpParams = new HttpParams().set(paramNames.page, page);
    if (name !== "")
      httpParams = httpParams.set(paramNames.name, name);
    const url = API_CHARACTER_ENDPOINT_URL;

    return this.http.get<IGetAllCharactersResponse>(url, { params: httpParams }).pipe(
      handleApiError$(`Page of characters request error. Details: `, 'Error'),
    );
  }
}
