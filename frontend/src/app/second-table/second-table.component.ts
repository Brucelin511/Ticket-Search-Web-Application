import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-second-table',
  templateUrl: './second-table.component.html',
  styleUrls: ['./second-table.component.css'],
})
export class SecondTableComponent implements OnInit {
  @Input() eventDetailObject: object[];
  @Input() artTeamObj: object[];
  @Input() upComingEventsObj: object[];
  @Input() venueObj: object[];
  @Input() choosenEventObjFromList: object;
  @Input() seconds: number;
  // @Input() : ;
  @Output() clickToReturnListEvent = new EventEmitter<void>();
 
  tabIndex: number = 0;
  favoriteListMaps: Map<string, object> = new Map<string, object>(JSON.parse(localStorage.getItem('favoriteListMaps')));

  constructor() { }

  ngOnInit() {
    console.log('artasdflkajsdfj', this.artTeamObj);
  }

  changeTabIndex(tabIndex: number) {
  	this.tabIndex = tabIndex;
  }

  returnList() {
    this.clickToReturnListEvent.emit();
  }

  favorite() {
    if (typeof(Storage) == "undefined") {
      console.log('Sorry! Your browser has no Web Storage support');
      return;
    }
    let eventId = this.choosenEventObjFromList['eventId'];
    let favoriteListMaps = new Map<string, object>(JSON.parse(localStorage.getItem('favoriteListMaps')));
    //remove favorite
    if (favoriteListMaps.has(eventId)) {
      console.log('before remove', favoriteListMaps);
      favoriteListMaps.delete(eventId);
      console.log('after remove', favoriteListMaps);
      localStorage.setItem("favoriteListMaps", JSON.stringify(Array.from(favoriteListMaps.entries())));
      console.log(localStorage);
      this.favoriteListMaps = favoriteListMaps;
      console.log(this.favoriteListMaps.entries());
      return;
    }
    //add favorite
    console.log('before add', favoriteListMaps);
    favoriteListMaps.set(eventId, this.choosenEventObjFromList);
    console.log('after add', favoriteListMaps);
    localStorage.setItem("favoriteListMaps", JSON.stringify(Array.from(favoriteListMaps.entries())));
    console.log(localStorage);
    this.favoriteListMaps = favoriteListMaps;
    console.log(this.favoriteListMaps.entries());
  }
}
