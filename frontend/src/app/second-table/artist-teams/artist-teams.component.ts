import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-artist-teams',
  templateUrl: './artist-teams.component.html',
  styleUrls: ['./artist-teams.component.css']
})
export class ArtistTeamsComponent implements OnInit {
  @Input() artTeamObj: Array<object>[];

  constructor() { }

  ngOnInit() {
  }

}
