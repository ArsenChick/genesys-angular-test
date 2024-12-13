import { IGetAllCharactersResponse, IGetCharacterResponse } from "../interfaces/api-responses.interface";

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

export const ERROR_PAGE_CHAR: IGetAllCharactersResponse = {
    info: {
        pages: -1
    },
    results: []
};

export const ERROR_CHAR: IGetCharacterResponse = {
    id: -1,
    name: "",
    status: "",
    species: "",
    gender: "",
    image: ""
}