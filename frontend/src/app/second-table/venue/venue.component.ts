import { Component, OnInit, Input } from '@angular/core';
declare var google : any;

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent implements OnInit {
  @Input() venueObj: Array<object>[];
  constructor() { }

  ngOnInit() {
  	if (this.venueObj !== undefined) {
  		console.log(this.venueObj);
	  	var uluru = {lat: Number(this.venueObj[0]['lat']), lng: Number(this.venueObj[0]['lon'])};
	  	// The map, centered at Uluru
		var map = new google.maps.Map(document.getElementById('map'), {zoom: 14, center: uluru});
		// The marker, positioned at Uluru

		// var contentString = `<div><span><b>${this.venueObj[0]['name']}</b></span><br>
		// 						 <span>${this.venueObj[0]['address']}</span><br>
		// 						 <span>${this.venueObj[0]['city']},${this.venueObj[0]['stateCode']} ${this.venueObj[0]['postalCode']}</span><br>
		// 						 <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.venueObj[0]['name'])}" target="_blank">View on Google Maps</a>
		// 					</div>`;
		// var infowindow = new google.maps.InfoWindow({
		// 	content: contentString
		// });
		var marker = new google.maps.Marker({position: uluru, map: map});
		// marker.addListener('click', function() {
		// 	infowindow.open(map, marker);
		// });
  	}
  }
}
