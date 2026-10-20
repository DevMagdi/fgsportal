import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-chat-gpt',
  templateUrl: './chat-gpt.component.html',
  styleUrls: ['./chat-gpt.component.scss']
})
export class ChatGPTComponent implements OnInit {
  prompt = '';
  completion = '';
  constructor(private openaiService:DatabaseService) { }

  ngOnInit(): void {
  }

  onComplete() {
    this.openaiService.chatGPTConnection(this.prompt).subscribe(res => {
      
      this.completion = res.choices[0].text;
    });
  }
}
