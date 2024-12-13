import { IGetAllCharactersResponse } from "../features/heroes/interfaces/api-responses.interface";

export const LOADING_IMG_PATH = '/assets/images/loading.svg';
export const API_CHARACTER_ENDPOINT_URL = 'https://rickandmortyapi.com/api/character';
export const API_CHARACTER_ENDPOINT_FILTER_PARAMS = {
  name: 'name',
  page: 'page',
};

export const ROUTE_NAMES = {
  home: 'characters',
  profile: 'character'
};