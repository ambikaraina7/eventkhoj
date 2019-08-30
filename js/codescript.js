// (function () {
// 'use strict';
  var app1 = angular.module('EventApp', ['ngMaterial', 'ngMessages','angular-svg-round-progressbar','ngAnimate']);

  app1.controller('DemoCtrl', function ($scope, $http, $window) {

    // $scope.main_url="http://localhost:8081";
    $scope.main_url='http://hw8-ar-nodejs.us-west-1.elasticbeanstalk.com';
    $scope.noipapi = true;

  console.log("before ###5");

  ///////////////////////////////ip-api call starts////////////////////////////////////////////
  //ip-api call
  var init = function () {
  // $window.onload = function () {
    $http.get('http://ip-api.com/json')
        .then(function(response) {

          console.log('###5');
          console.log(response);
          console.log("through AngularJS\tLon:" + response.data.lon + "\tLat: " + response.data.lat);
        
          $scope.noipapi = false;
          $scope.lath = response.data.lat;
          $scope.lonh = response.data.lon;
      });
  };
  init(); // and fire it after definition
  ///////////////////////////////ip-api call ends////////////////////////////////////////////

    $scope.keyword ="";
    $scope.category = "All";
    $scope.distance = '';
    $scope.disMode = "miles";
    $scope.location_rb = "current";
    $scope.location_tb = "";

    // $scope.keep_pb1 = 1;

    $scope.favoriteDisablede = 0;
    $scope.favoriteDisabledv = 0;
    $scope.showLimit = "5";
    $scope.moreLessBtn = "Show More";

    $scope.fadein = true;
    $scope.fctr = 0;
    // $scope.fadeout = false;

    $scope.favourite_ids=[];
    $scope.p = 1;

    //Result/Fav Buttons
    $scope.resultclass = "btn-primary";
    $scope.favclass = "btn-link";

    $scope.location_rb='current';
    $scope.loctabClass = 'form-control form-control-sm validationinput';
    
    

  ///////////////////////////event search api call starts/////////////////////////////////
  $scope.fn1 = function(event) {


    console.log('###4' + $scope + " distance: " + $scope.distance);
    console.log("inside fn1");
    $scope.keyword = document.getElementById("keyword").value;

    $scope.event_pg =1;
    console.log("Page" + $scope.event_pg);
    $scope.p = 1;
    $scope.detailsDisabled = 0;
    $scope.starStyle = "star_border";
    $scope.detailsEnter = 0;




    // $scope.keyword = encodeURI('Los Angeles Lakers');

    e_lath = $scope.lath;
    e_lonh = $scope.lonh;

    if($scope.distance == '')
      $scope.distance = "10";



    //event-search api call via node js
    function escall() {
      var xhttp = new XMLHttpRequest();
      esearch_url = $scope.main_url + '/eventsearch?keyword=' + $scope.keyword + '&category=' + $scope.category + '&distance=' + $scope.distance + '&disMode=' + $scope.disMode + '&location_rb=' + $scope.location_rb + '&locationtb=' + $scope.location_tb + '&latitude=' + e_lath + '&longitude=' + e_lonh;
      console.log($scope.keyword + '&category=' + $scope.category + '&distance=' + $scope.distance + '&disMode=' + $scope.disMode + '&location_rb=' + $scope.location_rb + '&locationtb=' + $scope.location_tb + '&latitude=' + e_lath + '&longitude=' + e_lonh);
      
       // xhttp.open("GET",esearch_url, true);
       console.log(esearch_url);


       xhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200) {
           var eObj = JSON.parse(xhttp.responseText);

           if (typeof(eObj._embedded) == "undefined"){
              $scope.search_success = 0;
              $scope.$apply();
            }
            else{
                $scope.e_search = [];
                // $scope.favourite_checker = {};
                
               e_events = eObj._embedded.events;

               event_length=e_events.length;

               for(var i =0; i < e_events.length;i++){
                  favourite_checker ={};

                  e_name_full_value = e_events[i].name;
                  if(e_name_full_value.length > 35){
                    pos = 34;
                    while(e_name_full_value.charAt(pos) != ' '){
                      pos--;
                    }
                    console.log('\n' + pos);
                    e_name = e_name_full_value.substring(0,pos) + ' ...';
                    console.log('\n' + e_name);
                  }
                  else 
                    e_name = e_name_full_value;

                  // for favourite star button, initially everything is false
                  fav_id = e_events[i].id;
                  favourite_checker[fav_id] = false;

                  
                  $scope.e_search.push({
                    e_date : eObj._embedded.events[i].dates.start.localDate,
                    e_name_full_value : e_name_full_value,
                    e_name : e_name,
                    e_segment : e_events[i].classifications[0].segment.name,
                    e_genre : e_events[i].classifications[0].genre.name,
                    e_venue_name : e_events[i]._embedded.venues[0].name,
                    v_lat : e_events[i]._embedded.venues[0].location.latitude,
                    v_lon : e_events[i]._embedded.venues[0].location.longitude,
                    e_id : e_events[i].id,
                    // fav_id : my_fav_id,
                    fav_id : favourite_checker,
                    e_star : "star_border"
                  });
                }

                $scope.search_success = 1;
                $scope.search_nofail = 1;
                $scope.keep_pb1 = 0;

                $scope.$apply();
                console.log("CALL 1!!!!");
                // console.log("Fav Checker: " + JSON.stringify($scope.favourite_checker));
                console.log($scope.e_search);
            }
          }
             
          else{
            $scope.search_success = 0;
            console.log("error in search details");
            // $scope.$apply();
          }
       };

       xhttp.open("GET",esearch_url, true);
       xhttp.onprogress = function (e) {
            if (e.lengthComputable) {
                $scope.rm=e.total;
                $scope.ratio = ((e.loaded / e.total) * 100) + '%';
                console.log($scope.ratio + "moving");
                $('#pb1').css('width', $scope.ratio);
            }
            else{
                $('#pb1').css('width', '100%');
            }
            // $scope.$apply();
        }
        xhttp.onloadstart = function (e) {
            // progressBar.value = 0;
            $scope.ratio = 0 + '%';
            $('#pb1').css('width', '0%');
            $('#pb1div').css('display','block');
            $('#searchlistdiv').css('display','none');
            // $scope.$apply();
        }
        xhttp.onloadend = function (e) {
            // progressBar.value = e.loaded;
            $scope.ratio = ((e.loaded / e.total) * 100) + '%';
            $('#pb1').css('width', $scope.ratio);
            console.log("loading midway");
            // $('#pb1div').css('display', 'none');
            // if($scope.ratio == '100%')
              setTimeout(function(){
                console.log("loading Completed");
                $('#pb1div').css('display', 'none');
                $('#searchlistdiv').css('display', 'block');
              },500);
            // $scope.$apply();
        }
        xhttp.onerror = function () {
          console.log("** An error occurred during the transaction");
          $scope.search_nofail = 0;
        };

       xhttp.send();
    };



    ////////////////////////geocode api call starts/////////////////////////////////////
    // geocode api call via node js
    if($scope.location_rb == "other"){
      $http
        .get($scope.main_url + '/geocode?locationtb=' + $scope.location_tb)
        .then(function(response) {
          //console.log(searchText);
          console.log('###7');

          console.log($scope.location_tb);
          console.log(response);
        
          e_lath = response.data.results[0].geometry.location.lat;
          e_lonh = response.data.results[0].geometry.location.lng;
          
          console.log('geocode through AngularJS\tlatitude' + e_lath + '\tlongitude' + e_lonh);

        });
        var x;
        setTimeout(escall, 1000);
    }
    else{
      escall();
    }
    ////////////////////////geocode api call ends/////////////////////////////////////
    
  }

  ////////////////////////event search api call ends/////////////////////////////////////


  $scope.validkeyword = function(){
    console.log("inside validkeyword()");
    keytab = document.getElementById('keyword');
    if(keytab.value == null || keytab.value.trim() == ''){
      keytab.style.borderColor = "red";
    }
    else{
      keytab.style.borderColor = "#ced4da";
    }
  }
  $scope.resultClick = function(e_id) {
    // e_id = 1;//need to work on this
    console.log("inside resultClick" + e_id + ": event id");
    $scope.event_pg =1;
    console.log("Page" + $scope.event_pg);
    $scope.p = 1;
    $scope.resultclass = "btn-primary";
    $scope.favclass = "btn-link";
  }

  $scope.listClick = function(e_id) {
    // e_id = 1;//need to work on this
    console.log("inside listClick" + e_id + ": event id");
    if($scope.p == 1){
      $scope.event_pg =1;
      console.log("Page" + $scope.event_pg);
    }
    else if($scope.p == 2){
      $scope.event_pg =3;
      console.log("Page" + $scope.event_pg);
    }
  }

  $scope.detailsClick = function(e_id) {
    // e_id = 1;//need to work on this
    console.log("inside listClick" + e_id + ": event id");
    $scope.event_pg =2;
    console.log("Page" + $scope.event_pg);
  }

  $scope.delete = function(e_id) {
    console.log("inside delete" + e_id + ": event id");
        // $scope.favourite_checker[e_id].fav_value =false;
      //$scope.e_search.fav_id[e_id] =false;
      for(var i =0;i<$scope.e_search.length;i++){
        if($scope.e_search[i].e_id == e_id){
            $scope.e_search[i].fav_id[e_id] =false;
            $scope.e_search[i].e_star = "star_border";

            
          }
      }
      ///////local storage starts///////
      if (typeof(Storage) !== "undefined") {
        // Delete
        localStorage.removeItem(e_id);
        // Retrieve
        //var eObj = JSON.parse(localStorage.getItem(e_id));
        console.log("Deleting "+ e_id +"from Local Storage: " + localStorage);
      } else {
          console.log("Sorry, your browser does not support Web Storage...");
      }
      ///////local storage ends///////
      if($scope.e_details){
        $scope.e_details.e_star = "star_border";
      }
      $scope.insideStar = "star_border";
      //favouritesTab();

      for(var i =0;i<$scope.localvalues.length;i++){
      if($scope.localvalues[i].e_id == e_id){
        console.log("Will delete " + e_id + "from localvalues array");
        var remIndex = i;
        $scope.localvalues.splice(remIndex,1);
      }
    }

  }

  $scope.showMoreLess = function(){
    console.log("inside showMoreLess" + $scope.fadein); 
    if( $scope.moreLessBtn == "Show More"){ 
      $scope.showLimit = "$scope.upcoming_ev.length";
      $scope.moreLessBtn = "Show Less";
      console.log("please Show More" + $scope.fadein);
    }
    else{
      $scope.showLimit = "5";
      $scope.moreLessBtn = "Show More";
      console.log("please Show Less" + $scope.fadein);
    }

      // $scope.fadein = !$scope.fadein;
  }

  /////////////////////////////favourites function starts//////////////////////////////////////////////
  $scope.favourites = function(e_id) {
    console.log("inside favourites:" + e_id);

    if($scope.favourite_ids.indexOf(e_id) == -1){           //adding to favourites
      $scope.favourite_ids.push(e_id);
        // $scope.favourite_checker[e_id].fav_value =true;
      for(var i =0;i<$scope.e_search.length;i++){
        if($scope.e_search[i].e_id == e_id){
            $scope.e_search[i].fav_id[e_id] =true;
            $scope.e_search[i].e_star = "star";

            ///////local storage starts///////
            if (typeof(Storage) !== "undefined") {
              // Store
              localitem ={};
              localitem = {
                e_date: $scope.e_search[i].e_date,
                e_genre: $scope.e_search[i].e_genre,
                e_id: $scope.e_search[i].e_id,
                e_name: $scope.e_search[i].e_name,
                e_name_full_value: $scope.e_search[i].e_name_full_value,
                e_segment: $scope.e_search[i].e_segment,
                e_star: $scope.e_search[i].e_star,
                e_venue_name: $scope.e_search[i].e_venue_name,
                v_lat: $scope.e_search[i].v_lat,
                v_lon: $scope.e_search[i].v_lon
              };
              localStorage.setItem(e_id, JSON.stringify(localitem));

              console.log("Current Local Item: " + JSON.stringify(localitem));
            } else {
                console.log("Sorry, your browser does not support Web Storage...");
            }
            ///////local storage ends///////

          }
      }
      if($scope.e_details){
        $scope.e_details.e_star = "star";
      }
      $scope.insideStar = "star";
    }
    else{                                                   //removing from favourites
      var remIndex = $scope.favourite_ids.indexOf(e_id);
      $scope.favourite_ids.splice(remIndex,1);
      for(var i =0;i<$scope.e_search.length;i++){
        if($scope.e_search[i].e_id == e_id){
            $scope.e_search[i].fav_id[e_id] =false;
            $scope.e_search[i].e_star = "star_border";

            ///////local storage starts///////
            if (typeof(Storage) !== "undefined") {
              // Delete
              localStorage.removeItem(e_id);
              // Retrieve
              console.log("Remaining Local Storage: " + localStorage);
            } else {
                console.log("Sorry, your browser does not support Web Storage...");
            }
            ///////local storage ends///////
          }
      }
      if($scope.e_details){
        $scope.e_details.e_star = "star_border";
      }
      $scope.insideStar = "star_border";
    }

    $scope.fav_id = e_id;

    
    console.log("Favourite ID List: " + $scope.favourite_ids);
    // console.log("Change in Favourite Checker List: " + JSON.stringify($scope.favourite_checker));
    console.log("Change in Esearch List: " + JSON.stringify($scope.e_search));

  }

  $scope.favouritesTab = function() {
    // var eObj = JSON.parse(localStorage.getItem(e_id));
    $scope.event_pg =3;
    console.log("Page" + $scope.event_pg);
    $scope.p = 2;
    $scope.favclass = "btn-primary";
    $scope.resultclass = "btn-link";
    if (typeof(Storage) !== "undefined") {
      $scope.localvalues = [];

      // $scope.localvalues = [];
      keys = Object.keys(localStorage);

      for(var i =0;i<keys.length;i++){
        $scope.localvalues.push( JSON.parse(localStorage.getItem(keys[i])) );
      }

      console.log("Local Storage: " + localStorage.getItem(0));
      console.log($scope.localvalues[0].e_name_full_value);

      console.log("Local Value: " + $scope.localvalues);

      //$scope.localLength = keys.length;
      // console.log(localStorage.getItem("G5eYZ48NmY8i_") );
    } else {
        console.log("Sorry, your browser does not support Web Storage...");
    }
  }

  /////////////////////////////favourites function ends//////////////////////////////////////////////


  $scope.eventDetails = function(e_id,e_star) {
    console.log("inside eventDetails" + e_id + ": event id");
    $scope.event_pg =2;
    console.log("Page" + $scope.event_pg);
    $scope.detailsDisabled = 1;
    $scope.currentId = e_id;
    $scope.detailsEnter = 1;
    $scope.insideStar = e_star;
    console.log("$scope.detailsEnter = " + $scope.detailsEnter);
    // $scope.keyword = encodeURI('Los Angeles Lakers');

    /////////////////////////////event details api call starts//////////////////////////////////////////////
    //event-details api call via node js
    function edetailscall() {
      var xhttp = new XMLHttpRequest();
      edetails_url = $scope.main_url + '/eventdetails?e_id=' + e_id ;
        
      xhttp.open("GET",edetails_url, true);
      console.log(edetails_url);

      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var eObj = JSON.parse(xhttp.responseText);
          $scope.e_details = [];

          console.log("event details success" + eObj);

          event_name = null;
          if(eObj.hasOwnProperty('name')){
            event_name = eObj.name;
          }
          e_venue = null;
          e_arteam = null;
          event_artteam_keywords = []; //using for artist/teams
          if(eObj.hasOwnProperty('_embedded')){  
            if(eObj._embedded.hasOwnProperty('attractions')){
              for(var i =0; i < eObj._embedded.attractions.length;i++){
                if(eObj._embedded.attractions[i].hasOwnProperty('name')){

                  if(i==0){
                    e_arteam = "";
                    e_arteam += eObj._embedded.attractions[i].name;
                  }
                  else
                    e_arteam += " | " + eObj._embedded.attractions[i].name;

                  event_artteam_keywords.push(eObj._embedded.attractions[i].name); //using for artist/teams
                }
              }

              if(eObj._embedded.hasOwnProperty('venues')){
                e_venue = eObj._embedded.venues[0].name;
              }
            }
          }

          e_time =null;
          if(eObj.hasOwnProperty('dates')){
            g=0;
            if(eObj.dates.start.hasOwnProperty('localDate')){
              e_time ="";
              edate= eObj.dates.start.localDate;
              e_time += moment(edate).format('LL');
              g=1;
            } 
            if(eObj.dates.start.hasOwnProperty('localTime')){
              if(g==1)
                e_time += "  " + eObj.dates.start.localTime;
              else{
                e_time ="";
                e_time += eObj.dates.start.localTime;
              }
            }
          }

          e_genre =null;
          event_category =null; //using for artist/teams
          if(eObj.hasOwnProperty('classifications')){
            g=0;
            e_classifications = eObj.classifications;
            if((e_classifications[0].hasOwnProperty('genre')) && (e_classifications[0].genre.name != "Undefined")){
              e_genre ="";
              e_genre += e_classifications[0].genre.name;
              g=1;
            }
            if((e_classifications[0].hasOwnProperty('segment')) && (e_classifications[0].segment.name != "Undefined")){
              if(g==1)
                e_genre += " | " + e_classifications[0].segment.name;
              else{
                e_genre ="";
                e_genre += e_classifications[0].segment.name;
              }
              event_category = e_classifications[0].segment.name;
            }
          }

            
          e_price = null;
          if(eObj.hasOwnProperty('priceRanges')){
            e_currency = 'USD';
            if(eObj.priceRanges[0].hasOwnProperty('currency')){
              e_currency = eObj.priceRanges[0].currency;
            }
            const formatter = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: e_currency,
              minimumFractionDigits: 2
            });
            if((eObj.priceRanges[0].hasOwnProperty('min')) && (eObj.priceRanges[0].hasOwnProperty('max'))){
              e_price = "";
              e_price += formatter.format(eObj.priceRanges[0].min);
              e_price += " ~ " + formatter.format(eObj.priceRanges[0].max);
            }
            else if((eObj.priceRanges[0].hasOwnProperty('min')) && (!(eObj.priceRanges[0].hasOwnProperty('max')))){
              e_price = "";
              e_price += formatter.format(eObj.priceRanges[0].min);
            }
            else if((eObj.priceRanges[0].hasOwnProperty('max')) && (!(eObj.priceRanges[0].hasOwnProperty('min')))){
              e_price = "";
              e_price += formatter.format(eObj.priceRanges[0].max);
            }
            
          }

          e_ticketStatus = null;
          if(eObj.hasOwnProperty('dates')){
            if(eObj.dates.hasOwnProperty('status')){
              e_ticketStatus = eObj.dates.status.code;
            }
          }
          
          e_url = null;
          if(eObj.hasOwnProperty('url')){
            e_url = eObj.url;
          }

          e_seatMap = null;
          if(eObj.hasOwnProperty('seatmap')){
            e_seatMap = eObj.seatmap.staticUrl;
          }

          $scope.e_details.push({
            event_name : event_name,
            artist_team : e_arteam,
            e_venue_name : e_venue,
            e_time : e_time,
            e_category : e_genre,
            e_price : e_price,
            e_ticketStatus : e_ticketStatus,
            e_url : e_url,
            e_seatMap : e_seatMap,
            e_star : e_star
          });

          $scope.favoriteDisablede = 1;
          $scope.ed_nofail = 1;
          $scope.$apply();
          console.log("CALL 2!!!!");
          console.log($scope.e_details);


          if(event_category == "Music"){

            console.log("When category is Music" + event_artteam_keywords);
            

            
            // a_name = [];
            for(var i =0; i<event_artteam_keywords.length;i++){

              // $scope.artist_details = {};
              $scope.artist_details = [];
              $scope.art_name = [];
              // $scope.artist_details = new Object();

              ///////////////////////////////artist detail api call (spotify) starts////////////////////////////////////////////
              //calling artist detail api
              function atcall(i){
                var athttp = new XMLHttpRequest();
                eartist_url = $scope.main_url + '/artistdetail?artist_name=' + event_artteam_keywords[i] ;
                
                athttp.open("GET",eartist_url, true);
                console.log(eartist_url);

                athttp.onreadystatechange = function() {
                 if (this.readyState == 4 && this.status == 200) {
                    var eObj = JSON.parse(athttp.responseText);

                    console.log("artist details success " + i + eObj);
                    
                    currentArtist = eObj.currentartist;
                    $scope.art_name.push(currentArtist);
                    console.log("Current Artist: " + currentArtist);
                    // $scope.artist_details = [];
                    a_name=null;
                    if(eObj.artists.items[0].hasOwnProperty('name'))
                      a_name = eObj.artists.items[0].name;

                    a_followers=null;
                    if(eObj.artists.items[0].followers.hasOwnProperty('total')){
                      a_followers = eObj.artists.items[0].followers.total;
                      a_followers = a_followers.toLocaleString('en');
                    }

                    a_popularity=null;
                    if(eObj.artists.items[0].hasOwnProperty('popularity'))
                      a_popularity = eObj.artists.items[0].popularity;

                    a_ext_url=null;
                    if(eObj.artists.items[0].external_urls.hasOwnProperty('spotify'))
                      a_ext_url = eObj.artists.items[0].external_urls.spotify;

                    $scope.artist_details[currentArtist] = {};

                      $scope.artist_details.push({
                        a_heading : currentArtist,
                        a_name : a_name,
                        a_followers : a_followers,
                        a_popularity : a_popularity,
                        a_ext_url : a_ext_url,
                        ctr: i
                    });
                    $scope.at_nofail = 1;

                    $scope.$apply();
                    console.log("CALL 3!!!!");
                    console.log("Scope Artist Details: " + JSON.stringify($scope.artist_details));
                    // console.log("Artist name: " + JSON.stringify($scope.artist_details[currentArtist].a_name));
                    console.log("Current Artist ka naam toh batao: " + JSON.stringify($scope.art_name));
                  }
                };
                athttp.onerror = function () {
                  console.log("** An error occurred during the event details transaction");
                  $scope.at_nofail = 0;
                };
                athttp.send();
              }  
              atcall(i);
              ///////////////////////////////artist detail api call (spotify) ends////////////////////////////////////////////
            


              ///////////////////////////////artist photos api call (google custom search engine) starts////////////////////////////////////////////
              //calling artist detail api
              function apmcall(){
                var aphttp = new XMLHttpRequest();
                ephoto_url = $scope.main_url + '/artistphoto?artist_name=' + event_artteam_keywords[i] ;
                
                aphttp.open("GET",ephoto_url, true);
                console.log(ephoto_url);

                aphttp.onreadystatechange = function() {
                 if (this.readyState == 4 && this.status == 200) {
                    var eObj = JSON.parse(aphttp.responseText);

                    console.log("artist photo - google custom search success " + eObj);

                    currentArtistphoto = eObj.queries.request[0].searchTerms;

                    a_photo=[];

                    for(var j =0; j<eObj.items.length;j++){

                      if(eObj.items[j].hasOwnProperty('link'))
                        a_photo.push(eObj.items[j].link);
                      
                    }
                    console.log("Photos of "+ currentArtistphoto + " : " +a_photo);

                    for(var k =0; k<$scope.artist_details.length;k++){
                      if($scope.artist_details[k].a_heading == currentArtistphoto){
                        $scope.artist_details[k].a_photo = a_photo;
                      }
                    }
                    // $scope.artist_details[currentArtistphoto].a_photo = a_photo;

                    $scope.apm_nofail = 1;
                    $scope.$apply();
                    console.log("CALL 4!!!!");
                    console.log("Scope Artist Photo Details: " + JSON.stringify($scope.artist_details));
                  }
                };
                aphttp.onerror = function () {
                  console.log("** An error occurred during the event details transaction");
                  $scope.apm_nofail = 0;
                };
                aphttp.send();
              }  
              apmcall();
              ///////////////////////////////artist photos api call (google custom search engine) ends////////////////////////////////////////////

           }
           
         }

         if(event_category != null && event_category != "Music"){

            console.log("When category is other than Music" + event_artteam_keywords);
            

            
            // a_name = [];
            for(var i =0; i<event_artteam_keywords.length;i++){

              $scope.artist_details = [];
              $scope.art_name = [];

              ///////////////////////////////artist photos api call (google custom search engine) starts [other than Music]////////////////////////////////////////////
              //calling artist photos api
              function apcall(i){
                var aphttp = new XMLHttpRequest();
                ephoto_url = $scope.main_url + '/artistphoto?artist_name=' + event_artteam_keywords[i] ;
                
                aphttp.open("GET",ephoto_url, true);
                console.log(ephoto_url);

                aphttp.onreadystatechange = function() {
                 if (this.readyState == 4 && this.status == 200) {
                    var eObj = JSON.parse(aphttp.responseText);

                    console.log("artist photo - google custom search success " + eObj);
                    

                    currentArtistphoto = eObj.queries.request[0].searchTerms;
                    a_photo=[];

                    for(var j =0; j<eObj.items.length;j++){

                      if(eObj.items[j].hasOwnProperty('link'))
                        a_photo.push(eObj.items[j].link);
                      
                    }

                    console.log("Photos of "+ currentArtistphoto + " : " +a_photo);

                    $scope.artist_details.push({
                        a_photo : a_photo,
                        a_heading : currentArtistphoto,
                        ctr: i
                    });
                    $scope.ap_nofail = 1;
                    $scope.$apply();
                    console.log("CALL 5!!!!");
                    console.log("Scope Artist Photo Details: " + JSON.stringify($scope.artist_details));
                    
                  }
                };
                aphttp.onerror = function () {
                  console.log("** An error occurred during the event details transaction");
                  $scope.ap_nofail = 0;
                };
                aphttp.send();
              }  
              apcall(i);
              ///////////////////////////////artist photos api call (google custom search engine) ends [other than Music]////////////////////////////////////////////

              
           // console.log("Scope Full Artist Details: " + JSON.stringify($scope.artist_details));
           }
           
         }
          
          if(e_venue != null){
            
            ///////////////////////////////venue details api call starts////////////////////////////////////////////
            function vdcall(){
              //calling venue details api
              var vhttp = new XMLHttpRequest();
              evenue_url = $scope.main_url + '/venuedetails?venue_name=' + e_venue ;
              
              vhttp.open("GET",evenue_url, true);
              console.log(evenue_url);

              vhttp.onreadystatechange = function() {
               if (this.readyState == 4 && this.status == 200) {
                  var eObj = JSON.parse(vhttp.responseText);
                  $scope.venue_details = [];

                  console.log("venue details success" + eObj);

                  v_addr = null;
                  if(eObj._embedded.venues[0].hasOwnProperty('address') && eObj._embedded.venues[0].address.hasOwnProperty('line1'))
                    v_addr = eObj._embedded.venues[0].address.line1;
                  console.log(v_addr);
                  
                  v_city = null;
                  g=0;
                  if(eObj._embedded.venues[0].hasOwnProperty('city') && eObj._embedded.venues[0].city.hasOwnProperty('name')){
                    v_city = "";
                    v_city += eObj._embedded.venues[0].city.name;
                    g = 1;
                  }
                  if(eObj._embedded.venues[0].hasOwnProperty('state') && eObj._embedded.venues[0].state.hasOwnProperty('stateCode')){
                    if(g==1)
                      v_city += ", " + eObj._embedded.venues[0].state.stateCode;
                    else{
                      v_city = "";
                      v_city += eObj._embedded.venues[0].state.stateCode;
                    }
                  }
                  console.log(v_city);

                  v_phno = null;
                  if(eObj._embedded.venues[0].hasOwnProperty('boxOfficeInfo') && eObj._embedded.venues[0].boxOfficeInfo.hasOwnProperty('phoneNumberDetail'))
                    v_phno = eObj._embedded.venues[0].boxOfficeInfo.phoneNumberDetail;
                  // console.log(v_phno);

                  v_openhrs = null;
                  if(eObj._embedded.venues[0].hasOwnProperty('boxOfficeInfo') && eObj._embedded.venues[0].boxOfficeInfo.hasOwnProperty('openHoursDetail'))
                    v_openhrs = eObj._embedded.venues[0].boxOfficeInfo.openHoursDetail;
                  // console.log(v_openhrs);

                  v_grule = null;
                  if(eObj._embedded.venues[0].hasOwnProperty('generalInfo') && eObj._embedded.venues[0].generalInfo.hasOwnProperty('generalRule'))
                    v_grule = eObj._embedded.venues[0].generalInfo.generalRule;
                  // console.log(v_grule);

                  v_crule = null;
                  if(eObj._embedded.venues[0].hasOwnProperty('generalInfo') && eObj._embedded.venues[0].generalInfo.hasOwnProperty('childRule'))
                    v_crule = eObj._embedded.venues[0].generalInfo.childRule;
                  console.log(v_crule);


                  // v_lat = e_events[i]._embedded.venues[0].location.latitude;
                  // v_lon = e_events[i]._embedded.venues[0].location.longitude;
                  if(eObj._embedded.venues[0].hasOwnProperty('location') && eObj._embedded.venues[0].location.hasOwnProperty('latitude'))
                    vlat = eObj._embedded.venues[0].location.latitude;
                  console.log("map lat" + vlat);
                  if(eObj._embedded.venues[0].hasOwnProperty('location') && eObj._embedded.venues[0].location.hasOwnProperty('longitude'))
                    vlon = eObj._embedded.venues[0].location.longitude;
                  console.log("map lon" + vlon);

                  ///////////////////////////////google map display starts////////////////////////////////////////////
                  function initMap(vlat,vlon) {
                  // function initMap() {
                    console.log("inside init_map");
                    var uluru = {lat: parseFloat(vlat), lng: parseFloat(vlon)};
                    // The map, centered at Uluru
                    console.log(uluru);

                    $scope.maploaded = true;
                    var map = new google.maps.Map(document.getElementById('map'), {zoom: 14, center: uluru});
                    console.log(map);
                    // The marker, positioned at Uluru
                    var marker = new google.maps.Marker({position: uluru, map: map});
                    console.log(marker);
                    console.log("CALL 6!!!!");
                  }
                  
                  ///////////////////////////////google map display ends////////////////////////////////////////////

                  // setTimeout(vdcall, 200);
                  initMap(vlat,vlon);

                  $scope.venue_details.push({
                    v_addr : v_addr,
                    v_city : v_city,
                    v_phno : v_phno,
                    v_openhrs : v_openhrs,
                    v_grule : v_grule,
                    v_crule : v_crule,
                    v_lat : vlat,
                    v_lon : vlon
                  });

                  $scope.favoriteDisabledv = 1;
                  $scope.v_nofail = 1;
                  $scope.$apply();
                  console.log("Venue Details: " + $scope.venue_details);

                  // initMap(vlat,vlon);

                  console.log("CALL 7!!!!");
                }
              };
              vhttp.onerror = function () {
                  console.log("** An error occurred during the event details transaction");
                  $scope.v_nofail = 0;
              };
              vhttp.send();
            }
            setTimeout(vdcall, 200);
            // vdcall();
           ///////////////////////////////venue details api call ends////////////////////////////////////////////


           ///////////////////////////////search venue (songkick) api call starts////////////////////////////////////////////
           function svcall(){
              var sv_http = new XMLHttpRequest();
              sv_url = $scope.main_url + '/searchvenue?venue_name=' + e_venue ;
              
              sv_http.open("GET",sv_url, true);
              console.log(sv_url);

              sv_http.onreadystatechange = function() {
               if (this.readyState == 4 && this.status == 200) {
                  var eObj = JSON.parse(sv_http.responseText);
                  // $scope.venue_id_sk = [];
                  ue_length = 0;
                  console.log("search venue - songkick (call 1) success" + eObj);


                  ven_id_sk = null;
                  if(eObj.resultsPage.results.hasOwnProperty('venue') && eObj.resultsPage.results.venue[0].hasOwnProperty('id')){
                    ven_id_sk = eObj.resultsPage.results.venue[0].id;
                  }

                  console.log(ven_id_sk);
                  $scope.ven_id_sk =ven_id_sk;
                  console.log("CALL 8!!!!" + $scope.ven_id_sk);
                  if(ven_id_sk != null){
                    console.log("hello frands. songkick ka second api chala lo");

                    ///////////////////////////////upcoming events api call starts////////////////////////////////////////////

                      function uecall(){
                        var sv2_http = new XMLHttpRequest();
                        sv2_url = $scope.main_url + '/upcomingevents?venue_id=' + ven_id_sk ;
                        
                        sv2_http.open("GET",sv2_url, true);
                        console.log(sv2_url);

                        sv2_http.onreadystatechange = function() {
                         if (this.readyState == 4 && this.status == 200) {
                            var eObj = JSON.parse(sv2_http.responseText);
                            // $scope.venue_id_sk = [];

                            console.log("upcoming events - songkick (call 2) success" + eObj);
                            console.log("hello frands. songkick ka second api chala liya");

                            $scope.upcoming_ev = [];
                             // if(eObj.resultsPage.results.event[0].hasOwnProperty('event'))
                             if(eObj.resultsPage.results.hasOwnProperty('event')){
                                u_events = eObj.resultsPage.results.event;
                             

                               for(var i =0; i < u_events.length;i++){
                                  ue_name = null;
                                  if(u_events[i].hasOwnProperty('displayName'))
                                    ue_name = u_events[i].displayName;
                                  // console.log('\n' + ue_name);

                                  ue_url = null;
                                  if(u_events[i].hasOwnProperty('uri'))
                                    ue_url = u_events[i].uri;
                                  // console.log('\t|\t' + ue_url);

                                  ue_artist_name = null;
                                  if(u_events[i].performance[0].artist.hasOwnProperty('displayName'))
                                    ue_artist_name = u_events[i].performance[0].artist.displayName;
                                  // console.log('\t|\t' + ue_artist_name);

                                  ue_date_time = null;
                                  ue_date =null // for sorting upcoming events
                                  if(u_events[i].hasOwnProperty('start')){
                                    g=0;
                                    if(u_events[i].start.hasOwnProperty('date')){
                                      ue_date_time ="";
                                      uedatetime = u_events[i].start.date;
                                      ue_date_time += moment(uedatetime).format('LL');
                                      ue_date = uedatetime; // for sorting upcoming events
                                      g=1;
                                    } 
                                    if(u_events[i].start.hasOwnProperty('time') && u_events[i].start.time != null){
                                      if(g==1)
                                        ue_date_time += " " + u_events[i].start.time;
                                      else{
                                        ue_date_time ="";
                                        ue_date_time += u_events[i].start.time;
                                      }
                                    }
                                  }
                                  // console.log('\t|\t' + ue_date_time);

                                  ue_type = null;
                                  if(u_events[i].hasOwnProperty('type'))
                                    ue_type = u_events[i].type;
                                  // console.log('\t|\t' + ue_type);
                                  
                                  $scope.upcoming_ev.push({
                                    ue_name : ue_name,
                                    ue_url : ue_url,
                                    ue_artist_name : ue_artist_name,
                                    ue_date_time : ue_date_time,
                                    ue_type : ue_type,
                                    ue_date : ue_date
                                  });
                                }                      
                              }
                            console.log("CALL 9!!!!");
                            console.log($scope.upcoming_ev);
                            console.log($scope.upcoming_ev.length);
                            $scope.sv2_nofail = 1;
                            $scope.$apply();
                          }
                        };
                        sv2_http.onerror = function () {
                          console.log("** An error occurred during the event details transaction");
                          $scope.sv2_nofail = 0;
                        };
                        sv2_http.send();
                      }
                      //uecall();
                      setTimeout(uecall, 200);

                    ///////////////////////////////upcoming events api call ends////////////////////////////////////////////
                  }

                  // $scope.venue_id_sk = ven_id_sk;
                  // console.log($scope.venue_id_sk);

                  // $scope.$apply();
                }
              };
              sv_http.onerror = function () {
                console.log("** An error occurred during the event details transaction");
                $scope.sv_nofail = 0;
              }
              sv_http.send();
           }
           // svcall();
           setTimeout(svcall, 200);
             
         }
         


        }
      };

       xhttp.onprogress = function (e) {
            if (e.lengthComputable) {
                $scope.rm2=e.total;
                $scope.ratio2 = ((e.loaded / e.total) * 100) + '%';
                console.log($scope.ratio2 + "moving");
                $('#pb2').css('width', $scope.ratio2);
            }
            else{
                $('#pb2').css('width', '100%');
            }
            // $scope.$apply();
        }
        xhttp.onloadstart = function (e) {
            // progressBar.value = 0;
            $scope.ratio2 = 0 + '%';
            $('#pb2').css('width', '0%');
            $('#pb2div').css('display','block');
            $('#detailsdiv').css('display','none');
            // $scope.$apply();
        }
        xhttp.onloadend = function (e) {
            // progressBar.value = e.loaded;
            $scope.ratio2 = ((e.loaded / e.total) * 100) + '%';
            $('#pb2').css('width', $scope.ratio);
            console.log("loading midway2");
            // $('#pb1div').css('display', 'none');
            // if($scope.ratio2 == '100%')
              setTimeout(function(){
                console.log("loading Completed2");
                $('#pb2div').css('display', 'none');
                $('#detailsdiv').css('display', 'block');
              },500);
            // $scope.$apply();
        }
        xhttp.onerror = function () {
          console.log("** An error occurred during the event details transaction");
          $scope.ed_nofail = 0;
        };
      xhttp.send();
    }

    edetailscall();
    /////////////////////////////event details api call starts//////////////////////////////////////////////
          

  }



  //clear button
  $scope.clearForm = function(event) {
    // var el = angular.element(document.querySelector('#result'));
    // el.empty();
    // $scope.keyword ="";

    //for form elements
    document.getElementById("keyword").value="";
    $scope.category = "All";
    $scope.distance = '';
    $scope.disMode = "miles";
    $scope.location_rb = "current";
    $scope.location_tb = "";

    //for result div
    $scope.event_pg = 0;  
    console.log("Page" + $scope.event_pg);

    $scope.currentId = 0;
  }


  $scope.demo = {
      showTooltip: false,
      tipDirection: "bottom"
  };

  var self = this;
  console.log('###1');

  // list of `state` value/display objects
  // self.states        = loadAll();
  // self.selectedItem  = null;
  self.searchText    = null;
  // self.querySearch   = querySearch;


  ///////////////////////////////autocomplete call starts////////////////////////////////////////////
  //autocomplete api call via node js
  $scope.query = function(searchText) {
  return $http
    .get($scope.main_url + '/autocomplete?searchText=' + searchText)
    .then(function(response) {
      console.log(searchText);
      console.log(response.data._embedded.attractions[0].name)
      console.log('###2');
      var e_name =[];
      for(var i = 0;i<response.data._embedded.attractions.length;i++)
        e_name.push(response.data._embedded.attractions[i].name);
      console.log(e_name);
      return e_name;
    });
  };
  ///////////////////////////////autocomplete call ends////////////////////////////////////////////

  
  console.log('###6');
});




function validKeyword(){
  keytab = document.getElementById('keyword');
  if(keytab.value == null || keytab.value.trim() == ''){
    keytab.style.borderColor = "red";
  }
  else{
    keytab.style.borderColor = "#ced4da";
  }
}