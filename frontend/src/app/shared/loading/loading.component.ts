import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'fgs-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  constructor(
    private loadingService:LoadingService
  ) { }

  loading$=this.loadingService.loading$;

  ngOnInit(): void {

  }

}
