import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';

import { LoadingSpinnerComponent } from "../../components/loading-spinner/loading-spinner.component";

import { RickAndMortyApiService } from '../../services/rick-and-morty-api.service';
import { IGetCharacterResponse } from '../../interfaces/api-responses.interface';
import { ERROR_CHAR, ROUTE_NAMES } from '../../constants';

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
export class ProfilePageComponent implements OnInit {

  characterData$!: Observable<IGetCharacterResponse>;
  homeLink = `/${ROUTE_NAMES.home}`;

  constructor (
    private apiService: RickAndMortyApiService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const characterId = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(characterId)) {
      this.characterData$ = of(ERROR_CHAR);
    } else {
      this.characterData$ = this.apiService.getCharacterById(characterId);
    }
  }
}
