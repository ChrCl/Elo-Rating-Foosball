import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { EloService } from '../elo.service';

@Component({
  selector: 'app-create-match',
  templateUrl: './create-match.component.html',
  styleUrls: ['./create-match.component.less']
})
export class CreateMatchComponent implements OnInit {

  constructor(private eloService: EloService) { }

  ngOnInit() {
  }

}
