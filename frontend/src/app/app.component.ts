import { Component, HostBinding } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

import { HttpClient } from '@angular/common/http';
import { ServerService } from './server.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule, MatButtonModule } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fromLeftToRight', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('300ms', style({transform: 'translateX(0%)'}))
      ]),
    ]),
    trigger('fromRightToLeft', [
      transition(':enter', [
        style({transform: 'translateX(100%)'}),
        animate('300ms', style({transform: 'translateX(0%)'}))
      ]),
    ]),
  ]
})


export class AppComponent {
  state = 'start'; 
  isReturnList: number = -1;
  title = 'hw8';
  seconds: number = 0;
  isClear: boolean = false;
  isFavorite: boolean = false;
  isShowFirstTable: boolean = false;
  shiftMode: number = -1;
  isShowSecondTable: boolean = false;
  isSecondTableClicked: boolean = false;
  refinedAutoCompleteAttractionArrObj: object = [];
  
  //initially => undefined
  //no record => []
  //some record => [...]
  //error => ?????????
  refinedeventListJsonObjetAfterSubmit: object[] = undefined;
  choosenEventObjFromList: object = undefined;
  eventDetailObject: object[] = undefined;
  artTeamObj: object[] = undefined;
  venueObj: object[] = undefined;
  upComingEventsObj: object[] = undefined;

  runTimer() {
  	this.seconds = 0;
  	let timer = setInterval(()=>{
  		this.seconds++;
  		if (this.seconds > 0) {
			clearInterval(timer);
		}
		console.log(this.seconds);
  	},1000);
  }

  createTableAfterformSubmitted(parameterArr: string[][]) {
    this.isReturnList = -1;
    this.isClear = false;
  	this.isShowSecondTable = false;
    this.isFavorite = false;
    this.isShowFirstTable = true;
    this.isSecondTableClicked = false;
  	let prefix = 'http://ticketsearchhw8.us-east-2.elasticbeanstalk.com/eventSearchApi';
  	this.getJson(1, prefix, parameterArr,-1);
  	this.runTimer();
  }

  constructor(private serverService: ServerService) {}

  /**
   * [getJson return json from requesting api]
   * @param {number}     mode         [0=>autoComplete, 1=>submitform, 2=>getEventDetail]
   * @param {string}     prefix       [description]
   * @param {string[][]} parameterArr [description]
   * @param {number} index [index of the artist and team]
   */
  getJson(mode: number, prefix : string, parameterArr : string[][], index: number) {
    this.serverService.getServers(prefix, parameterArr)
	  .subscribe(
	    (response : HttpClient) => {
	      if (mode == 0) {
	      	console.log('autocompleteRawData', response);
	      	this.refinedAutoCompleteAttractionArrObj = this.generateSelectedAutoCompleteAttractionArrObj(response);
	      	console.log('refinedAutoCompleteAttractionArrObj',this.refinedAutoCompleteAttractionArrObj);
	      }
	      else if (mode == 1) {
	      	console.log('eventListJsonObjetAfterSubmitRawData', response);
	      	this.refinedeventListJsonObjetAfterSubmit = this.generateSelectedEventListObj(response);
	      	console.log('refinedeventListJsonObjetAfterSubmit', this.refinedeventListJsonObjetAfterSubmit);
	      }
	      else if (mode == 2) {
	      	//getEventDetail
	      	console.log('getEventDetail', response);
	      	this.eventDetailObject = this.generateSelectedEventDetailObj(parameterArr[0][1], response);
	      	console.log('getSelectedEventDetail', this.eventDetailObject);
	      }
	      else if (mode == 3) {
	      	//getArtistTeamDetail
	      	console.log('getArtistTeamsDetail', response);
	      	this.artTeamObj[index]['picture'] = this.generateSelectedArtTeamObj(index, parameterArr, response);
	      	console.log('getSelectedArtistTeamsDetail', this.artTeamObj);
	      }
	      else if (mode == 4) {
	      	//getSpotifyDetail
	      	console.log('getSpotifyDetail', response);
	      	this.artTeamObj[index]['table'] = this.generateSelectedSpotifyObj(index, parameterArr, response);
	      	console.log('getSelectedSpotifyDetail', this.artTeamObj);
	      }
	      else if (mode == 5) {
	      	//getVenueDetail
	      	console.log('getVenueDetail', response);
	      	this.venueObj = this.generateSelectedVenueObj(response);
	      	console.log('getSelectedVenueDetail', this.venueObj);
	      }
	      else if (mode == 6) {
	      	//getUpcomingEventsDetail
	      	console.log('getUpcomingEventsDetail', response);
	      	this.upComingEventsObj = this.generateSelectedUpcomingEventsObj(response);
	      	console.log('getSelectedUpcomingEventsDetail', this.upComingEventsObj);
	      }
	    },
	    (error) => {
        // if (mode == 5) {
        //   this.venueObj = [];
        // }
        console.log(error);
      }
    );
  }

  generateSelectedUpcomingEventsObj (jsonObj: object) {
  	let eventsArr = this.tryGetObj("jsonObj['resultsPage']['results']['event']", jsonObj, -1);
  	if (eventsArr == undefined) {
  		return [];
  	}
  	console.log('eventsArr', eventsArr);
  	let result = [];
  	for (let index = 0, length = eventsArr.length; index < length; index++) {
  		let title = this.tryGetObj("jsonObj['resultsPage']['results']['event'][index]['displayName']", jsonObj, index);
  		let url = this.tryGetObj("jsonObj['resultsPage']['results']['event'][index]['uri']", jsonObj, index);
  		let artist = this.tryGetObj("jsonObj['resultsPage']['results']['event'][index]['performance'][0]['displayName']", jsonObj, index);
  		let date = this.tryGetObj("jsonObj['resultsPage']['results']['event'][index]['start']['date']", jsonObj, index);
  		let time = this.tryGetObj("jsonObj['resultsPage']['results']['event'][index]['start']['time']", jsonObj, index);
  		let type = this.tryGetObj("jsonObj['resultsPage']['results']['event'][index]['type']", jsonObj, index);
  		let eachEventObj = {
  			'title' : title,
  			'url' : url,
  			'artist' : artist,
  			'date' : date,
  			'time' : time,
  			'type' : type,
  		};
      if (title == undefined && url == undefined && artist == undefined && date == undefined && time == undefined && type == undefined) {
        continue;
      }
  		result.push(eachEventObj);
  	}
  	return result;
  }

  generateSelectedVenueObj (jsonObj: object) {
    let state = this.tryGetObj("jsonObj['_embedded']['venues'][0]['state']['name']", jsonObj, -1);
    let stateCode = this.tryGetObj("jsonObj['_embedded']['venues'][0]['state']['stateCode']", jsonObj, -1);
    let postalCode = this.tryGetObj("jsonObj['_embedded']['venues'][0]['postalCode']", jsonObj, -1);
    let name = this.tryGetObj("jsonObj['_embedded']['venues'][0]['name']", jsonObj, -1);
  	let address = this.tryGetObj("jsonObj['_embedded']['venues'][0]['address']['line1']", jsonObj, -1);
  	let city = this.tryGetObj("jsonObj['_embedded']['venues'][0]['city']['name']", jsonObj, -1);
  	let phoneNumber = this.tryGetObj("jsonObj['_embedded']['venues'][0]['boxOfficeInfo']['phoneNumberDetail']", jsonObj, -1);
  	let openHours = this.tryGetObj("jsonObj['_embedded']['venues'][0]['boxOfficeInfo']['openHoursDetail']", jsonObj, -1);
  	let generalRule = this.tryGetObj("jsonObj['_embedded']['venues'][0]['generalInfo']['generalRule']", jsonObj, -1);
  	let childRule = this.tryGetObj("jsonObj['_embedded']['venues'][0]['generalInfo']['childRule']", jsonObj, -1);
  	let location = this.tryGetObj("jsonObj['_embedded']['venues'][0]['location']", jsonObj, -1);
  	let lon = this.tryGetObj("jsonObj['_embedded']['venues'][0]['location']['longitude']", jsonObj, -1);
  	let lat = this.tryGetObj("jsonObj['_embedded']['venues'][0]['location']['latitude']", jsonObj, -1);
    let result = [];
    // if (address == undefined && city == undefined && phoneNumber == undefined && openHours == undefined && generalRule == undefined && childRule == undefined && (lon == undefined || lat == undefined)) {
    //   return result;
    // }
    result.push({
      'state' : state,
      'stateCode' : stateCode,
      'postalCode' : postalCode,
      'name' : name,
      'address' : address,
      'city' : city,
      'phoneNumber' : phoneNumber,
      'openHours' : openHours,
      'generalRule' : generalRule,
      'childRule' : childRule,
      // 'location' : location,
      'lon' : lon,
      'lat' : lat,
    });
  	return result;
  }

  generateSelectedSpotifyObj (index: number, parameterArr: string[][], jsonObj: object) {
  	let result = {};

  	let itemArr = this.tryGetObj("jsonObj['artists']['items']", jsonObj, -1);
  	let nameTarget = parameterArr[0][1];
  	if (itemArr == undefined) {
  		// this.artTeamObj[index]['table'] = undefined;
  		return undefined;
  	}

  	for (let index = 0, length = itemArr.length; index < length; index++) {
  		if (itemArr[index]['name'].toLowerCase() == nameTarget.toLowerCase()) {
  
  			console.log('name1', itemArr[index]['name'].toLowerCase());
  			console.log('name2', nameTarget);
			let name = this.tryGetObj("jsonObj['artists']['items'][index]['name']", jsonObj, index);
			let followers = this.tryGetObj("jsonObj['artists']['items'][index]['followers']['total']", jsonObj, index);
			let popularity = this.tryGetObj("jsonObj['artists']['items'][index]['popularity']", jsonObj, index);
			let checkAt = this.tryGetObj("jsonObj['artists']['items'][index]['external_urls']['spotify']", jsonObj, index);
  			return {
  				'name' : name,
  				'followers' : followers,
  				'popularity' : popularity,
  				'checkAt' : checkAt,
  			}
  		}
  	}
  	return undefined;
  }

  generateSelectedArtTeamObj (index: number, parameterArr: string[][], jsonObj: object) {
  	let urlArr = [];
  		// singleElement.id = index;
  	// singleElement.picture = [];
  	let nameTarget = parameterArr[0][1];

    let itemsArr = this.tryGetObj('jsonObj["items"]', jsonObj, -1);
  	if (itemsArr == undefined) {
  		// this.artTeamObj[index]['picture']['url'] = urlArr;
  		return {
  			'name' : nameTarget,
  			'url' : [],
  		};
  	}
  	for (let i in itemsArr) {
  		try {
  			urlArr.push(itemsArr[i]["link"]);
  		} catch (error) {
  			console.log('push error');
  		}
  	}
  	return {
  		'name' : nameTarget,
  		'url' : urlArr,
  	}
  	 // this.artTeamObj
  	 // this.artTeamObj[index]['picture']['url'] = urlArr;
  	 console.log('createdpicurls',this.artTeamObj);
  }

  generateSelectedEventDetailObj(eventId: string, jsonObj: object) {
  	console.log('jsonObj',jsonObj);

  	let eventNmae = this.tryGetObj ('jsonObj["name"]', jsonObj, -1);
  	//1 Artist and team
  	let artistTeamObj = this.tryGetObj ('jsonObj["_embedded"]["attractions"]', jsonObj, -1);
  	//2 Venue
  	let venueObj = this.tryGetObj ('jsonObj["_embedded"]["venues"][0]["name"]', jsonObj, -1);
  	//3 Time
  	// let startObj = this.tryGetObj ('jsonObj["dates"]["start"]', jsonObj, -1);
  	let localDataObj = this.tryGetObj ('jsonObj["dates"]["start"]["localDate"]', jsonObj, -1);
  	let localTimeObj = this.tryGetObj ('jsonObj["dates"]["start"]["localTime"]', jsonObj, -1);
  	//4 Category
  	let segmentObj = this.tryGetObj ('jsonObj["classifications"][0]["segment"]["name"]', jsonObj, -1);
//=====================================================After getting artistTeamObj => immediately get api
  	this.getArtTeamObj(artistTeamObj, segmentObj);
    this.getUpcomingEvents(venueObj);
  	this.getVenue(venueObj);
  	let genreObj = this.tryGetObj ('jsonObj["classifications"][0]["genre"]["name"]', jsonObj, -1);

  	if (segmentObj && segmentObj.toLowerCase() == 'undefined') {
  		segmentObj = undefined;
  	}
  	if (genreObj && genreObj.toLowerCase() == 'undefined') {
  		genreObj = undefined;
  	}
  	//5 price Range
  	// let priceCurrencyObj = this.tryGetObj ('jsonObj["priceRanges"][0]["currency"]', jsonObj, -1);
  	let priceCurrencyObj = "$"; //no need do this anymore ===> use currency pipe!!!!!
  	let priceMinObj = this.tryGetObj ('jsonObj["priceRanges"][0]["min"]', jsonObj, -1);
  	let priceMaxObj = this.tryGetObj ('jsonObj["priceRanges"][0]["max"]', jsonObj, -1);
  	// ticket status
  	let statusObj = this.tryGetObj ('jsonObj["dates"]["status"]["code"]', jsonObj, -1);
  	statusObj = statusObj.charAt(0).toUpperCase() + statusObj.slice(1);
  	// buyTicketAtObject
  	let buyTicketAtObject = this.tryGetObj ('jsonObj["url"]', jsonObj, -1);
  	// seatMapObject
  	let seatMapObject = this.tryGetObj ('jsonObj["seatmap"]["staticUrl"]', jsonObj, -1);
  	// let result = [artistTeamObj, venueObj, startObj, classObj, priceObj, priceObj, statusObj, buyTicketAtObject, seatMapObject];
  	if (eventNmae == undefined && artistTeamObj == undefined && venueObj == undefined && localDataObj == undefined && 
      localTimeObj == undefined && segmentObj == undefined && genreObj == undefined && priceMinObj == undefined && 
      priceMaxObj == undefined && statusObj == undefined && buyTicketAtObject == undefined && seatMapObject == undefined) {
      return [];
    }

    let result = {
      'eventId' : eventId,
  		'eventName' : eventNmae,
  		'Artist/Teams(s)' : {'artistTeamObj': artistTeamObj},
  	  	'Venue' : {'venueObj': venueObj},
  	  	'Time' : {'localDataObj': localDataObj, 'localTimeObj': localTimeObj},
  	  	'Category' : {'segmentObj': segmentObj, 'genreObj' : genreObj},
  	  	'Price Range' : {'priceCurrencyObj': priceCurrencyObj, 'priceMinObj': priceMinObj, 'priceMaxObj': priceMaxObj},
  	  	'Ticket Status' : {'statusObj': statusObj},
  	  	'Buy Ticket At' : {'buyTicketAtObject': buyTicketAtObject},
  	  	'Seat Map' : {'seatMapObject': seatMapObject},
	  }
	  return [result];
  }

  /**
   * [generateSelectedAutoCompleteAttractionArrObj create refined autocomplete attraction array]
   * @param {object} jsonObj [json from autocomplete api]
   */
  generateSelectedAutoCompleteAttractionArrObj(jsonObj: object) {
  	let result = [];
  	let attractionArr = this.tryGetObj ('jsonObj["_embedded"]["attractions"]',jsonObj, -1);
  	if (attractionArr == undefined) {
  		return result;
  	}
  	// for (let index in attractionArr) {
  	for (let index = 0, size = attractionArr.length; index < size; index++) {
  		let attractionName = this.tryGetObj ('jsonObj["_embedded"]["attractions"][index]["name"]',jsonObj, index);
		if (attractionName != undefined) {
			result.push(attractionName);
		}
  	}
  	return result;
  }

	//generate html of Event table list
	generateSelectedEventListObj(jsonObj) {
		let result = [];
		// if (jsonObj.page.totalElements == 0 || typeof jsonObj._embedded.events == undefined || jsonObj._embedded.events.length == 0) {
		// 	return result;
		// }
		let eventArr = this.tryGetObj('jsonObj._embedded.events', jsonObj, -1);
		if (eventArr == undefined || eventArr.length == 0) {
			return result;
		}
		for (let index = 0, size = eventArr.length; index < size; index++) {
		// for (let index in jsonObj._embedded.events) { 
			let eventObj = jsonObj._embedded.events[index];
			if (eventObj == undefined) {
				continue;
			}
			let name = this.tryGetObj ('jsonObj["name"]',jsonObj, index);
			let date = this.tryGetObj ('jsonObj["_embedded"]["events"][index]["dates"]["start"]["localDate"]',jsonObj, index);
			let eventId = this.tryGetObj ('jsonObj["_embedded"]["events"][index]["id"]',jsonObj, index);
			let eventName = this.tryGetObj ('jsonObj["_embedded"]["events"][index]["name"]',jsonObj, index);
			let genre = this.tryGetObj ('jsonObj["_embedded"]["events"][index]["classifications"][0]["genre"]["name"]',jsonObj, index);
			let segment = this.tryGetObj ('jsonObj["_embedded"]["events"][index]["classifications"][0]["segment"]["name"]',jsonObj, index);
			let venue = this.tryGetObj ('jsonObj["_embedded"]["events"][index]["_embedded"]["venues"][0]["name"]', jsonObj, index);


      if (segment && segment.toLowerCase() == 'undefined') {
        segment = undefined;
      }
      if (genre && genre.toLowerCase() == 'undefined') {
        genre = undefined;
      }
      
      //result.push()?????????
			result[index] = {
				'date' : date,
				'eventId' : eventId,
				'eventName' : eventName,
				'genre' : genre,
				'segment': segment,
				'venue' : venue,
			}
		}
		return result;
	}

	//if location_arr exist, return the value, else return undefined
	/**
	 * [tryGetObj description]
	 * @param {string} location_string [eval location in json object]
	 * @param {object} jsonObj      [json]
	 * @param {number} index        [index involved]
	 */
	tryGetObj (location_string: string, jsonObj: object, index: number) {
		let value = undefined;
		try {
			value = eval(location_string);
			if ((typeof value) == "undefined") {
				value = undefined;
			}
			return value;
		} catch (error) {
			// console.log(error);
			return undefined;
		}
	}

	clear () {
    this.shiftMode = -1;
		this.isClear = true;
    this.isSecondTableClicked = false;
    this.isShowFirstTable = false;
		this.isShowSecondTable = false;
    this.isFavorite = false;
		this.refinedeventListJsonObjetAfterSubmit = undefined;
		this.artTeamObj = undefined;
		this.eventDetailObject = undefined;
		this.venueObj = undefined;
		this.upComingEventsObj = undefined;
    this.choosenEventObjFromList = undefined;
	}

  autoComplete(parameterArr: string[][]) {
	let prefix = 'http://ticketsearchhw8.us-east-2.elasticbeanstalk.com/autoCompleteApi';
	console.log(parameterArr);
	this.getJson(0, prefix, parameterArr,-1);
  }

  getEventDetail(eventObj: object, mode: number) {

    this.state = 'start';
    this.state = 'end';
    this.shiftMode = mode;
    this.isFavorite = false;
    this.isSecondTableClicked = true;
  	this.isShowSecondTable = true;
    this.isShowFirstTable = false;
    this.choosenEventObjFromList = eventObj;
    let parameterArr: string[][] = [['eventId', eventObj['eventId']]];
  	let prefix = 'http://ticketsearchhw8.us-east-2.elasticbeanstalk.com/getEventDetailApi';
  	this.getJson(2, prefix, parameterArr,-1);
    // console.log('mode', mode);
    this.runTimer();
  }

  getArtTeamObj(artTeamObjArr: string[], segment: string) { 
  	// this.artTeamObj['artTeamObjArr'] = new Array(artTeamObj.length);
    if (artTeamObjArr == undefined) {
      this.artTeamObj = [];
      return;
    }
  	let length = artTeamObjArr.length;
  	this.artTeamObj = new Array(length);

  	for (let i = 0; i < length; i++) {
  		this.artTeamObj[i] = {
			'table': undefined,
			'picture': undefined,
  		};
  	}
  	// console.log('new',this.artTeamObjArr);
  	let prefix3 = 'http://ticketsearchhw8.us-east-2.elasticbeanstalk.com/getArtistTeamsApi';
  	if (segment.toLowerCase() == 'music') {
  		let prefix4 = 'http://ticketsearchhw8.us-east-2.elasticbeanstalk.com/spotifyApi';
  		for (let i = 0; i < length; i++) {
  			this.getJson(3, prefix3, [['name', artTeamObjArr[i]['name']]], i);
  			this.getJson(4, prefix4, [['name', artTeamObjArr[i]['name']]], i);
  		}
  	} else {
  		for (let i = 0; i < length; i++) {
  			this.getJson(3, prefix3, [['name', artTeamObjArr[i]['name']]], i);
  		}
  	}
  }

  getVenue(venueName: string) {
    let timer = setTimeout(()=>{
      let prefix = 'http://ticketsearchhw8.us-east-2.elasticbeanstalk.com/getVenueDetailApi';
      this.getJson(5, prefix, [['keyword', venueName]], -1);
    }, 1000);
  }

  getUpcomingEvents(venueName: string) {
  	let prefix = 'http://ticketsearchhw8.us-east-2.elasticbeanstalk.com/getSongkickDetailApi';
  	this.getJson(6, prefix, [['query', venueName]], -1);
  }

  returnList() {
    console.log('returnMode', this.shiftMode);
    this.isReturnList = this.shiftMode;
  	this.isShowSecondTable = false;
    this.isShowFirstTable = this.shiftMode == 0 ? true : false;
    this.isFavorite = this.shiftMode == 1 ? true : false;
  }

  clickToReturnSecondTalbeEvent() {
    this.isShowSecondTable = true;
    this.isShowFirstTable = false;
    this.isFavorite = false;
  }

  favorite(index: number) {
    this.shiftMode = -1;
    this.isReturnList = -1;
    this.isFavorite = index == 1 ? true : false;
    this.isShowFirstTable = index == 0 ? true : false;
    this.isShowSecondTable = false;
    console.log(this.isFavorite);
  }
}