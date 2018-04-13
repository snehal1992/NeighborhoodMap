var list = [
	{
		title : 'Park Ave Penthouse',
		visibility : true
	},
	{
		title : 'Chelsea Loft',
		visibility : true
	},
	{
		title : 'Union Square Open Floor Plan',
		visibility : true
	},
	{
		title : 'East Village Hip Studio',
		visibility : true
	},
	{
		title : 'Chinatown Homey Space',
		visibility : true
	}
]

var model = function(data) {
	this.title = ko.observable(data.title);
	this.visibility = ko.observable(data.visibility);
}

var viewModel = function() {

	var self = this;


	this.itemList = ko.observableArray()

	list.forEach(function(item){
		self.itemList.push(new model(item));
	});

	var map;
  	// Create a new blank array for all the listing markers.
	var markers = [];
	
	this.filterList = function() {
		// PASS DATA OF SEARCH INPUT INTO FILTER LIST
		// RUN AND CHECK EACH MARKER AND LIST
		// USE FILTER TO SELECT THE LIST AND MARKERS 
		// USE VISIBILITY TO DISPLAY DATA ON MAP RATHER THAN REMOVING FROM LIST
		self.itemList.splice(4,1);
		console.log(self.itemList)
	}

	// Animates the corresponding marker of clicked item
	this.clickListItem = function(clickedItem) {
		var largeInfowindow = new google.maps.InfoWindow();
		for (i = 0; i < markers.length; i++) {
			if(clickedItem.title() == markers[i].title) {
				toggleBounce(markers[i])
				populateInfoWindow(markers[i],largeInfowindow)
			}
		}
	}	

	$.ajax({
		type: "POST",
   	    crossDomain : true,
   	    dataType: "jsonp",
		url: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDhes67x9mO2OR3XZlPRdLQUqdudBoyuGw&v=3",
        success: function(){
            initMap();
        }
    });

	// Initial setup of Map 
	var initMap = function() {
		// Constructor creates a new map - only center and zoom are required.
		map = new google.maps.Map(document.getElementById('map'), {
		  	center: {lat: 40.7413549, lng: -73.9980244},
		  	zoom: 13
		});
		// These are the real estate listings that will be shown to the user.
		// Normally we'd have these in a database instead.
		var locations = locationsData
		var largeInfowindow = new google.maps.InfoWindow();
		var bounds = new google.maps.LatLngBounds();
		// The following group uses the location array to create an array of markers on initialize.
		for (var i = 0; i < locations.length; i++) {
		  // Get the position from the location array.
			var position = locations[i].location;
			var title = locations[i].title;
			  // Create a marker per location, and put into markers array.
			var marker = new google.maps.Marker({
				map: map,
				position: position,
				title: title,
				animation: google.maps.Animation.DROP,
				id: i
			});
			  // Push the marker to our array of markers.
			markers.push(marker);

			  // Create an onclick event to open an infowindow at each marker.
			marker.addListener('click', function() {
				populateInfoWindow(this, largeInfowindow);
				toggleBounce(this);
			});
			bounds.extend(markers[i].position);
		}

		// Extend the boundaries of the map for each marker
		map.fitBounds(bounds);
	}

	// Animate the marker 
	var toggleBounce = function(marker) {
		if (marker.getAnimation() != null) {
	  	marker.setAnimation(null);
		} else {
	    marker.setAnimation(google.maps.Animation.BOUNCE);
		}
	}

	// This function populates the infowindow when the marker is clicked. We'll only allow
	// one infowindow which will open at the marker that is clicked, and populate based
	// on that markers position.
	var populateInfoWindow = function(marker, infowindow) {
	// Check to make sure the infowindow is not already opened on this marker.
		if (infowindow.marker != marker) {
			infowindow.marker = marker;
			infowindow.setContent('<div>' + marker.title + '</div>');
			infowindow.open(map, marker);
			// Make sure the marker property is cleared if the infowindow is closed.
			infowindow.addListener('closeclick',function(){
				infowindow.setMarker = null;
			});
		}
	}
	
}

ko.applyBindings(new viewModel());