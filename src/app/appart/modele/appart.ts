export interface Appart {
  reference: string;
  nom: string;
  prixLoyer: number;
  prixCaution: number;
  bailleur?: User;
  baux: Bail[];

}

export interface Bail {
  id: number;
  locataire: User;
  dateEntree: string;
  dateSortie?: string | null;
  montantLoyer: number;
  montantCaution: number;
  actif: boolean;
}

export interface Transaction {
  id: number;
  datePaiement: string;
  montant: number;
}

export interface User {
  reference: string;
  name: string;
}

export interface UpdateAppartRequest {
  reference: string;
  nom: string;
  prixLoyer: number;
  prixCaution: number;
  bailleurId: string;
}

export interface Loyer {
  mois: string;
  montantAttendu: number;
  montantVerse: number;
  ok: boolean;
  courant: boolean;
}