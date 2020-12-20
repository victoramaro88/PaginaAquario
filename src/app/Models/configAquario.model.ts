export class ConfigAquarioModel {
  idConfig: number;
  descLocal: string;
  dataAtualizacao: Date;
  infoMACUltimoAcesso: string;
  temperatura: number;
  tempMaxResfr: number;
  tempMinAquec: number;
  tempDesliga: number;
  iluminHoraLiga: string;
  iluminHoraDesliga: string;
  flagCirculador: boolean;
  flagBolhas: boolean;
  flagIluminacao: boolean;
  flagAquecedor: boolean;
  flagResfriador: boolean;
  flagEncher: boolean;
  senhaSecundária: string;
}
