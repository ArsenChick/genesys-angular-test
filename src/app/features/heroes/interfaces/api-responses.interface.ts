import { ICharacter } from "./character.interface";

export interface IGetAllCharactersResponse {
  info: {
    pages: number;
  };
  results: ICharacter[];
}