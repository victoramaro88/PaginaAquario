import { Component, OnInit } from '@angular/core';
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

  constructor(
    private router: Router,
    private httpServicos: Servicos,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this.CarregaInformacoes();
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
}
