import { Component, OnInit, Input, HostBinding} from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.css'],

  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   
        style({opacity:0}),
        animate(500, style({opacity:1})) 
      ]),
      transition(':leave', [ 
        animate(500, style({opacity:0})) 
      ])
    ])
  ]
})
export class UpcomingEventsComponent implements OnInit {
  @Input() upComingEventsObj: Array<object>[];
  sortedUpComingEventsObj : Array<object>[];
  mode: number = 0;
  index: number = 0;
  showState: number = 0;
  state: string = "showMore";

  constructor() { }

  ngOnInit() {
  }

  changeState() {
    this.showState = this.showState == 0 ? 1 : 0;
  }

  /**
   * [sort description]
   * @param {number} index [1=>title 2=>date,time 3=>artist 4=>type]
   * @param {number} mode     [0=>ascending 1=>descending]
   */
  sort(index: number, mode: number) {
  	console.log(`index: ${index} mode: ${mode}`);
  	if (index == 0) {
  		return
  	};
  	this.sortedUpComingEventsObj = this.upComingEventsObj.slice();
  	if (index == 1) {
  		this.sortedUpComingEventsObj.sort((a, b) => { 
  			if (a['title'] < b['title']) {
  				return mode == 1 ? 1 : -1;
  			} 
  			else if (a['title'] > b['title']) {
  				return mode == 1 ? -1 : 1;
  			}
  			else {
  				return 0;
  			}
  		});
  	}
  	else if (index == 2) {
  		this.sortedUpComingEventsObj.sort((a, b) => { 
  			if (a['date'] < b['date']) {
  				return mode == 1 ? 1 : -1;
  			} 
  			else if (a['date'] > b['date']) {
  				return mode == 1 ? -1 : 1;
  			}
  			else {
          if (a['time'] < b['time']) {
            return mode == 1 ? 1 : -1;
          }
          else if (a['time'] > b['time']) {
            return mode == 1 ? -1 : 1;
          }
  			  return 0;
  			}
  		});
  	}
  	else if (index == 3) {
  		this.sortedUpComingEventsObj.sort((a, b) => { 
  			if (a['artist'] < b['artist']) {
  				return mode == 1 ? 1 : -1;
  			} 
  			else if (a['artist'] > b['artist']) {
  				return mode == 1 ? -1 : 1;
  			}
  			else {
  				return 0;
  			}
  		});
  	}
  	else if (index == 4) {
  		this.sortedUpComingEventsObj.sort((a, b) => { 
  			if (a['type'] < b['type']) {
  				return mode == 1 ? 1 : -1;
  			} 
  			else if (a['type'] > b['type']) {
  				return mode == 1 ? -1 : 1;
  			}
  			else {
  				return 0;
  			}
  		});	
  	}
  }
}
