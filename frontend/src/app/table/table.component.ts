import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
// import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})

export class TableComponent implements OnInit {
  @Input() isSecondTableClicked: boolean;
  @Input() eventListArr: Array<object>[];
  @Input() choosenEventObjFromList: object;
  @Input() isReturnList: number;
  @Input() isFavorite: boolean;
	@Output() clickToSecondTalbeEvent = new EventEmitter<object>();
  @Output() clickToFavoriteEvent = new EventEmitter<object>();
  @Output() clickToReturnSecondTalbeEvent = new EventEmitter<object>();
  favoriteListMaps: Map<string, object> = new Map<string, object>(JSON.parse(localStorage.getItem('favoriteListMaps')));
  constructor() { }

  ngOnInit() {
    // this.favoriteArr = new Array<boolean>(this.eventListArr.length);
    // for (let i = 0, length = this.favoriteArr.length; i < length; i++) {
    //   this.favoriteArr[i] = false;
    // }
  }

  getEventDetail(index: number) {
  	// let parameter = [];
   //  parameter.push(['eventId',this.eventListArr[index]['eventId']]);
   //  console.log(this.eventListArr[index]['eventId']); 
  	this.clickToSecondTalbeEvent.emit(this.eventListArr[index]);
  }

  favorite(index: number) {
    if (typeof(Storage) == "undefined") {
      console.log('Sorry! Your browser has no Web Storage support');
      return;
    }
    let eventId = this.eventListArr[index]['eventId'];
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
    favoriteListMaps.set(eventId, this.eventListArr[index]);
    console.log('after add', favoriteListMaps);
    localStorage.setItem("favoriteListMaps", JSON.stringify(Array.from(favoriteListMaps.entries())));
    console.log(localStorage);
    this.favoriteListMaps = favoriteListMaps;
    console.log(this.favoriteListMaps.entries());
  }

  clickToReturnSecondTalbe() {
    this.clickToReturnSecondTalbeEvent.emit();
  }
}