export interface IGetAllCharactersResponse {
    info: {
        pages: number;
    };
    results: IGetCharacterResponse[]
}

export interface IGetCharacterResponse {
    id: number;
    name: string;
    status: string;
    species: string;
    gender: string;
    image: string;
}