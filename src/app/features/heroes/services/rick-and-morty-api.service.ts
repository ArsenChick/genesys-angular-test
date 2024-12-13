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

const EMPTY_PAGE_RESP: IGetAllCharactersResponse = {
  info: {
    pages: 0
  },
  results: []
};

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
  private readonly _currentPage = new ReplaySubject<number>(1);
  private readonly _pattern = new ReplaySubject<string>(1);

  readonly totalPages$ = this._totalPages.asObservable();
  readonly currentPageData$ = this._currentPageData.asObservable();
  readonly loadingData$ = this._loadingData.asObservable();
  readonly currentPage$ = this._currentPage.asObservable().pipe(
    distinctUntilChanged(),
  );
  private readonly pattern$ = this._pattern.asObservable().pipe(
    debounceTime(500),
    distinctUntilChanged(),
  );

  constructor(
    private readonly http: HttpClient
  ) {
    combineLatest([
      this.currentPage$,
      this.pattern$,
    ]).pipe(
      tap(() => this._loadingData.next(true)),
      switchMap(([page, name]) =>
        this._getPageOfCharactersByName(page, name).pipe(
          catchError(() => of(EMPTY_PAGE_RESP)),
          finalize(() => this._loadingData.next(false)),
        )),
    ).subscribe(response => {
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
    this._currentPage.next(page);
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
