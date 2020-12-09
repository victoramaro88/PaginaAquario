import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfigAquarioModel } from 'src/app/Models/configAquario.model';
import { Servicos } from 'src/app/Services/servicos.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService]
})
export class HomeComponent implements OnInit {
  msgs = [];
  blocked = false;
  valoresRetorno: ConfigAquarioModel = new ConfigAquarioModel();
  valoresNovos: ConfigAquarioModel = new ConfigAquarioModel();
  intervalo: any;
  flagEditarParametros = false;

  constructor(
    private router: Router,
    private httpServicos: Servicos,
    private messageService: MessageService,
    ) { }

    ngOnInit(): void {
      this.CarregaInformacoes();
      this.SetarCarregamentoAutomático();
    }

    CarregaInformacoes() {
      this.blocked = true;
      this.httpServicos.GetValores().subscribe((ret: ConfigAquarioModel) => {
        // console.log(ret);
        this.valoresRetorno = ret;
        console.log(this.valoresRetorno);
        this.blocked = false;
      }, (err) => {
        // console.log(err.error);
        this.blocked = false;
        this.messageService.add({severity:'error', summary:'Erro: ', detail: err.error});
      });
    }

    SetarCarregamentoAutomático() {
      this.intervalo = setInterval(() => {
        this.httpServicos.GetValores().subscribe((ret: ConfigAquarioModel) => {
          this.valoresRetorno = ret;
          console.log(this.valoresRetorno);
          this.blocked = false;
        }, (err) => {
          // console.log(err.error);
          this.blocked = false;
          this.messageService.add({severity:'error', summary:'Erro: ', detail: err.error});
        });
      }, 5000);
    }

    AlteraStatusFlag(parametro: string) {
      switch (parametro) {
        case 'ILUMINAÇÃO':
        this.valoresNovos.flagIluminacao = !this.valoresNovos.flagIluminacao
        console.log('Iluminação Alterada!');
        console.log(this.valoresNovos.flagIluminacao);
        break;

        case 'AQUECEDOR':
        this.valoresNovos.flagAquecedor = !this.valoresNovos.flagAquecedor
        console.log('Aquecedor Alterado!');
        console.log(this.valoresNovos.flagAquecedor);
        break;

        case 'RESFRIADOR':
        this.valoresNovos.flagResfriador = !this.valoresNovos.flagResfriador
        console.log('Resfriador Alterado!');
        console.log(this.valoresNovos.flagResfriador);
        break;

        case 'BOMBADEAGUA':
        this.valoresNovos.flagEncher = !this.valoresNovos.flagEncher
        console.log('Bomba De Água Alterada!');
        console.log(this.valoresNovos.flagEncher);
        break;

        default:
        break;
      }
    }

    ngOnDestroy() {
      if (this.intervalo) {
        clearInterval(this.intervalo);
      }
    }
  }
