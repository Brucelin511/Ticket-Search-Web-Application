import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  @Input() eventDetailObject: object;
  constructor() { }

  ngOnInit() {
    // this.eventDetailObject['Price Range']['priceCurrencyObj'] = '$';
    // console.log('eventDetailObject', this.eventDetailObject);
  }
}
