/**
 * Interface pour les informations du logement
 */
export interface LogementInfo {
    reference: string;
    description: string;
    adresse: string;
    codePostal: string;
    ville: string;
}

/**
 * Interface pour les informations du bail
 */
export interface BailInfo {
    id?: number;
    reference: string;
    dateEntree: string;
    dateSortie?: string;
    montantLoyer: number;
    montantCharges?: number;
    montantCaution: number;
    actif: boolean;
}

/**
 * Interface pour les informations du locataire
 */
export interface LocataireInfo {
    reference: string;
    name: string;
    email: string;
    appartements: LocataireAppartement[];
}

/**
 * Interface pour les appartements du locataire
 */
export interface LocataireAppartement {
    reference: string;
    nom: string;
    logement: LogementInfo;
    bail: BailInfo;
}

/**
 * Interface pour les informations de paiement
 */
export interface PaiementInfo {
    reference: string;
    date: string;
    montant: number;
    type: string;
    statut: string;
    appartementReference: string;
}

/**
 * Interface pour l'historique des loyers
 */
export interface HistoriqueLoyer {
    reference: string;
    mois: string;
    montantLoyer: number;
    montantCharges: number;
    totalDu: number;
    dateLimitePayement: string;
    statut: string;
    paiements: PaiementInfo[];
}

