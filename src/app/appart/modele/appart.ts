import { User } from '../../user/modele/user';
import { Loyer } from '../../loyer/modele/loyer';

export interface Appart {
  reference: string;
  nom: string;
  prixLoyer: number;
  prixCaution: number;
  user: User | null;
  loyers: Loyer[]

}