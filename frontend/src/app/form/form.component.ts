import { Component, OnInit, Output, EventEmitter, Input, AfterViewInit} from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerService } from '../server.service';
declare var Rx : any;

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @Output() autoCompleteEvent = new EventEmitter<string[][]>();
  @Output() formSubmittedEvent = new EventEmitter<string[][]>();
  @Output() resetEvent = new EventEmitter<void>();
  @Input() autoCompleteAttractionArr: Array<string>[];

  keyword: string = '';
  category: string = 'All';
  categoryArr: string[] = ['All', 'Music', 'Sports', 'Arts & Theatre', 'Film', 'Miscellaneous'];
  distance: string = '';
  unit: string = 'Miles';
  unitArr: string[] = ['Miles', 'Kilometers'];
  locationIndex: number = 0;
  location: string = '';
  userLat: string = undefined;
  userLon: string = undefined;
  isSearchButtonOff: boolean = true;
  eventObject: object = undefined;
  isSpace: boolean = false;


 

  constructor(private serverService: ServerService) {};

  ngOnInit() {
    let ipUrl = 'http://ip-api.com/json';
    this.serverService.getServers(ipUrl, [])
      .subscribe(
        (response : HttpClient) => {
          this.userLat = response["lat"];
          this.userLon = response["lon"];
          console.log("lat", this.userLat, "lon", this.userLon);
          if (this.userLat != undefined && this.userLon != undefined) {
             this.isSearchButtonOff = false;
          } 
        },
        (error) => console.log(error)
      );
  }

  ngAfterViewInit() {
    try {
      const input = document.getElementById('keyInput');
      const input$ = Rx.Observable
        .fromEvent(input, 'keyup')
        .map(keyword => keyword.currentTarget.value)
        .debounceTime(1000)
      input$.subscribe(keyword => this.sendValues(keyword));
    } catch (error) {
      console.log(error);
    }

  }

  sendValues(keyword){
    if (this.isSpace) {
      console.log("don't send");
      return;
    }
    console.log(keyword);
    let parameterArr = [];
    parameterArr.push(['keyword',keyword]);
    this.autoCompleteEvent.emit(parameterArr);
  }

  onSubmit() {
    let parameterArr = [];
    parameterArr.push(['keyword', this.keyword]);
    parameterArr.push(['category', this.category]);
    parameterArr.push(['distance', this.distance == '' ? '10' : this.distance]);
    parameterArr.push(['unit', this.unit == "Miles" ? "miles" : "km"]);
    parameterArr.push(['location', this.location]);
    parameterArr.push(['userLat', this.userLat]);
    parameterArr.push(['userLon', this.userLon]);
    parameterArr.push(['locationIndex', this.locationIndex]); 
    this.formSubmittedEvent.emit(parameterArr); //locationIndex  number => string!!!
    // this.onGet(prefix, parameterArr);
  }

  /**
   * reset the form 
   * @param {ngForm}
   * @param {ngModel}
   * @param {ngModel}
   */
  reset(formData, keywordInput, locationInput) {

    // formData.reset(); ===> category,unit,indexId = null ???? How to solve
    // console.log('formData', formData);
    // console.log('keywordInput', keywordInput);
    // console.log('locationInput', locationInput);
    keywordInput.reset(); 
    locationInput.reset();  
    this.keyword = '';
    this.category = 'All';
    this.distance = '';
    this.unit = 'Miles';
    this.locationIndex = 0;
    this.location = '';
    this.resetEvent.emit();
  }

  onChange($event, type) {
    if (type === 0) {
        console.log('category:',this.category);
    }
    else if (type === 1) {
        console.log('unit:',this.unit);
    }
    else if (type === 2) {
        console.log('locationIndex:',this.locationIndex);
        // console.log(!locationInput.valid && locationInput.touched && this.locationIndex===1);
    }
  }

  checkIsSpace($event) {
    //Step1 : check whether autoComplete is caused by reset
    //clear=>reset=>keyword=>null?
    if (this.keyword == null) {
      this.isSpace = false;
      this.keyword = '';
      return;
    } 
    this.isSpace = this.keyword.trim().length === 0;
    console.log(this.isSpace);
    // return;
    if (this.isSpace == false) {
      // let parameterArr = [];
      // parameterArr.push(['keyword',this.keyword]);
      // this.autoCompleteEvent.emit(parameterArr);
    } else {
      //space don't autoComplete or do autocomplete???
      this.autoCompleteAttractionArr = [];
    }
  }

  radioChange($event, index) {
    console.log(index);
    this.locationIndex = index;
  }
}

