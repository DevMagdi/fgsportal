import { Component, Input, OnInit } from '@angular/core';
import { Candidate } from 'src/app/interfaces/hr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.scss']
})
export class CandidateDetailsComponent implements OnInit {

  newServerApi = environment.newServerApi;
  @Input() candidate:Candidate;
  constructor() { }

  ngOnInit(): void {
  
    
  }

}
