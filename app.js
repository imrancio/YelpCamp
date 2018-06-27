var express = require('express');
var app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('landing');
});

app.get('/campgrounds', (req, res) => {
  var campgrounds = [
    {name: 'Salmon Creek', image: 'https://res.cloudinary.com/simpleview/image/fetch/c_fill,f_auto,h_452,q_75,w_982/http://res.cloudinary.com/simpleview/image/upload/v1469218578/clients/lanecounty/constitution_grove_campground_by_natalie_inouye_417476ef-05c3-464d-99bd-032bb0ee0bd5.png'},
    {name: 'Mountain Peak', image: 'https://www.nationalparks.nsw.gov.au/-/media/npws/images/parks/munmorah-state-conservation-area/background/freemans-campground-background.jpg'},
    {name: 'Sutton Falls', image: 'http://www.suttonfalls.com/communities/4/004/012/498/244//images/4628314067_550x441.jpg'}
  ];

  res.render('campgrounds', {campgrounds: campgrounds});
});

app.listen(3000, console.log('YelpCamp server started on port 3000'));
