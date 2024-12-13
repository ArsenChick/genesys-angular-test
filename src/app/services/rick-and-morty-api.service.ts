import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, EMPTY, Observable, of, Subject, switchMap } from 'rxjs';

import {
  IGetCharacterResponse,
  IGetAllCharactersResponse
} from '../interfaces/api-responses.interface';
import {
  API_CHARACTER_ENDPOINT_FILTER_PARAMS,
  API_CHARACTER_ENDPOINT_URL,
  ERROR_CHAR,
  ERROR_PAGE_CHAR
} from '../constants';


@Injectable({
  providedIn: 'root'
})
export class RickAndMortyApiService {

  private _getPageOfCharsSubj = new Subject<{ page: number; name: string }>();

  private _totalPages$ = new Subject<number>();
  private _currentPageData$ = new Subject<IGetCharacterResponse[]>();

  get totalPages$() { return this._totalPages$.asObservable(); }
  get currentPageData$() { return this._currentPageData$.asObservable(); }

  constructor(
    private http: HttpClient
  ) {
    this._getPageOfCharsSubj.pipe(
      switchMap(({page, name}) => this._getPageOfCharactersByName(page, name))
    ).subscribe(response => {
      this._totalPages$.next(response.info.pages);
      this._currentPageData$.next(response.results);
    });
  }

  public getCharacterById(id: number):
    Observable<IGetCharacterResponse> {

    const url = `${API_CHARACTER_ENDPOINT_URL}/${id}`;
    return this.http.get<IGetCharacterResponse>(url)
      .pipe(catchError(error => {
        console.error(`Character request error. Details: `, error);
        return of(ERROR_CHAR);
      }));
  }

  /* maybe I should've named it 'request' rather than 'get'
   * as the function doesn't return a result, but makes the observables
   * totalPages$ and currentPageData$ emit new values */
  public getPageOfCharactersByName(page: number, name: string = "") {
    this._getPageOfCharsSubj.next({page, name});
  }

  private _getPageOfCharactersByName(page: number, name: string):
    Observable<IGetAllCharactersResponse> {
  
    const paramNames = API_CHARACTER_ENDPOINT_FILTER_PARAMS;
    let httpParams = new HttpParams().set(paramNames.page, page);
    if (name !== "")
      httpParams = httpParams.set(paramNames.name, name);
    const url = API_CHARACTER_ENDPOINT_URL;
    
    return this.http.get<IGetAllCharactersResponse>(url, {
      params: httpParams
    }).pipe(catchError(error => {
      console.error(`Page of characters request error. Details: `, error);
      return of(ERROR_PAGE_CHAR);
    }));
  }
}
