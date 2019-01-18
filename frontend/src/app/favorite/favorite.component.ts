import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {
  eventListArr: Array<object>[] = this.getValueArray ();
  favoriteListMaps: Map<string, object> = new Map<string, object>(JSON.parse(localStorage.getItem('favoriteListMaps')));
  @Input() isSecondTableClicked: boolean;
  @Input() choosenEventObjFromList: object;
  @Input() isReturnList: number;
  @Output() clickToSecondTalbeEvent = new EventEmitter<object>();
  @Output() clickToReturnSecondTalbeEvent = new EventEmitter<object>();

  constructor() { }

  ngOnInit() {
  
  }

  getEventDetail(index: number) {
    this.clickToSecondTalbeEvent.emit(this.eventListArr[index]);
  }

  delete(eventId: string) {
  	let favoriteListMaps = new Map<string, object>(JSON.parse(localStorage.getItem('favoriteListMaps')));
  	favoriteListMaps.delete(eventId);
  	localStorage.setItem("favoriteListMaps", JSON.stringify(Array.from(favoriteListMaps.entries())));
  	this.eventListArr = this.getValueArray ();
  	this.favoriteListMaps = new Map<string, object>(JSON.parse(localStorage.getItem('favoriteListMaps')));
  }

  getValueArray () {
  	let result = [];
  	let favoriteListMaps = new Map<string, object>(JSON.parse(localStorage.getItem('favoriteListMaps')));
  	let iterator = favoriteListMaps.entries();
  	let currEntry = iterator.next().value;
  	while (currEntry != undefined) {
  		result.push(currEntry[1]);
  		currEntry = iterator.next().value;
  	}
  	return result;
  }

  clickToReturnSecondTalbe() {
    this.clickToReturnSecondTalbeEvent.emit();
  }
}
