'use strict';

const SEARCH_URL = "https://api.foursquare.com/v2/venues/";//explore";
// "https://api.foursquare.com/v2/venues/VENUE_ID";

const JOKE_SEARCH_URL = 'https://official-joke-api.appspot.com/random_joke';//'https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_joke';
 
var myJoke ="";
var myPunchline="";
var venHours = "";
var venRating = 0;//==



/////////////////// FOURSQUARE API

function getDataFromApi(venueSearch, locationSearch, urlEXtension, callback) {
  const query = {
    client_id: 'WZZAVWT5OF4P4UPBSXZF53UJX3NLO3QPEHKIIBYYTAYQDINZ',
    client_secret: 'F205HL4CMHFLA2LLXWXZDAGM2AONX354VWEFCW3MBBY2KKHN',
    intent: 'global',
    query: venueSearch, //`${locationSearch}`,
    near: locationSearch, //`${venueSearch}`,
    v: 20180604, 
    limit: 50
  } 
  let result = $.ajax({
    url: SEARCH_URL+urlEXtension,
    data: query,
    dataType: "json",
    type: "GET"
  })
   .done(function(result) {
    if (urlEXtension == "explore"){
      callback(result);
    }
  })
  .fail(function(result) {
    console.log( "$.get failed" );
  });
}

function callback(data) {
    let display = data.response.groups['0'].items.map((item, index) => {
    return renderResults(item)});
    $("#searchResults").html(display);
    makeCollapsible();
}

//how to render foursquare results
function renderResults(item, joke, punchline) {
    let venueName = item.venue.name;
    let venueAddress = item.venue.location.address;
    let venueCrossStreet = item.venue.location.crossStreet;
    let venueID = item.venue.id;

    if (venueAddress == undefined) {
      venueAddress = "Sorry, none provided.";
    }    
    if (venueCrossStreet == undefined) {
      venueCrossStreet = "Sorry, none provided.";
    }

    return `
    <button class="collapsible focus">${venueName}</button>
    <div class="content">
      <ul>
        <li>Address: ${venueAddress}</li>
        <li>Cross Streets: ${venueCrossStreet}</li>
        <li attr="${venueID}" class="goToVenue">
          <a class="venue-url" href="#" data-venueID="${venueID}" target="_blank" >Go to Venue website ></a>
        </li>
        </ul>
    </div>`
}// <p onclick="window.open('https://xxx.com')">xxx</p>

///// have to do a separate call to the foursquare api because the url is different to get details of venue... explore vs venue_id
function goToVenue(venueID,self){
    const query = {
    client_id: 'WZZAVWT5OF4P4UPBSXZF53UJX3NLO3QPEHKIIBYYTAYQDINZ',
    client_secret: 'F205HL4CMHFLA2LLXWXZDAGM2AONX354VWEFCW3MBBY2KKHN',
    intent: 'global',
    v: 20180604, 
    limit: 5
  } 
  let result = $.ajax({
    url: `https://api.foursquare.com/v2/venues/${venueID}`,
    data: query,
    dataType: "json",
    type: "GET"
  })
   .done(function(result) {
     if (result.response.venue.url !== (undefined)){
       console.log(self);
       $(self).attr('href', result.response.venue.url);
       $(self)[0].click();
      //  window.open(result.response.venue.url);
    }
    else {
      alert("Sorry, No URL provided.");
    }
  })
  .fail(function(result) {
    console.log( "$.get gotovenue failed" );
  });
}

//make search results list collapsible
function makeCollapsible(){
var coll = document.getElementsByClassName("collapsible");

var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}};


//handle search button
function watchSubmit() {
    $('#js-search-form').on('submit', function (event) {
        event.preventDefault();
        let venueSearch = $('#venue').val();
        let locationSearch = $("#location").val();
        let exploreURL = "explore";
        $('#searchResults').prop('hidden', false);
        //$("#initialrow").removeClass('col-12').addClass('col-6');
        getDataFromApi(venueSearch, locationSearch, exploreURL, callback);
        //$('.search').click(() => {
          $('html, body').animate({
            scrollTop: $("#searchResults").offset().top
          }, 
          1000);
        //});
    });

    $('#searchResults').on('click','.venue-url',function(e){
      if($(this).attr('href')=='#'){
        e.preventDefault();
        var venueID = $(this).attr('data-venueID');
        goToVenue(venueID,this);
      } else {
        e.stopPropagation();
        return true;
      }
    });
}

$(watchSubmit);



/////////////////// JOKE API

document.addEventListener('DOMContentLoaded', function() {
    getDataFromJOKESApi();
}, false);


function getDataFromJOKESApi(){
    $.getJSON((JOKE_SEARCH_URL), function(myResult) {
        myJoke = myResult.setup;
        myPunchline = myResult.punchline;
        displayJokeData(myJoke, myPunchline);
    });
;}

function renderResult(joke, punchline) {
  return `
  <div class="jokeCollapsible">
    ${joke}
  </div>
  <div class="jokeContent">
    <p>${punchline}</p>
  </div>
  `;
}


function displayJokeData(joke, punchline) {
  const results = renderResult(joke, punchline);
  $('#jokeResults').html(results);
  makeCollapsible2();
}

function makeCollapsible2(){
var coll = document.getElementsByClassName("jokeCollapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("jokeActive");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}};
