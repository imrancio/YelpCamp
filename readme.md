# YelpCamp
Welcome to YelpCamp! It is a web application designed to blog about fun campground locations. I created it while learning about web development from Colt Steele's [Web Developer Bootcamp](https://www.udemy.com/the-web-developer-bootcamp/) on Udemy. The backend uses Node + ExpressJS and MongoDB. The frontend consists of EJS templates created using Bootstrap 4.

## User roles
Users can register, login, add campgrounds, comments, etc. Admin users may add/edit/delete any users/campgrounds/comments as they see fit. Users may only add/edit/delete their own account/campgrounds/comments.

## Setup
This application requires some setup to take full advantage of all APIs and features. Most importantly, it uses Google Maps API to show geolocation info on campgrounds. Furthermore, Cloudinary API is also required for local file upload feature as the images have to be hosted somewhere. Finally, a Gmail account is required to send emails to users during password reset process. Additional setup required involves installing MongoDB.

To simplify the process, an `example.env` file has been provided with environment variable names. Simply rename/copy the file to `.env` and fill in the values for all the variables after the '=' signs:

* ADMINPW - the password used to register admin user accounts
* GEOCODER_API_KEY - Google Maps Geocoder API key
* MAPS_JAVASCRIPT_API_KEY - Google Maps JavaScript API key
* GMAIL - the Gmail account from which YelpCamp sends password reset emails from
* GMAILPW - the password for the above-mentioned Gmail account
* CLOUDINARY_CLOUD_NAME - cloud name for the cloudinary account for hosting images
* CLOUDINARY_API_KEY - API key for cloudinary account
* CLOUDINARY_API_SECRET - secret key for cloudinary account

### Notes
You must set up Google Maps APIs from Google Cloud Platform. More info about setting up Google Maps geocoding API can be found [here](https://developers.google.com/maps/documentation/javascript/geocoding). Info about Maps JavaScript API keys can be found [here](https://developers.google.com/maps/documentation/javascript/get-api-key). Keep in mind that the JavaScript API key will be exposed in views, just like it is in my previous commits. To ensure it is not misused, it must be secured by restricting via HTTP referrers or IP addresses. I have restricted mine to only accept requests from my IP address.

The Cloudinary keys should be auto-generated upon creating the appropriate account. More info can be found [here](https://cloudinary.com/documentation/solution_overview#account_and_api_setup).

The password reset feature will not work without a valid Gmail account and password.

## Run
First, install MongoDB following instructions from [here](https://docs.mongodb.com/v3.2/administration/install-community/), then start the database using:
```
mongod
```
Then, run the following commands:
```
git clone https://github.com/imrancio/YelpCamp
cd YelpCamp
npm i -g nodemon
npm i
```
After setting up `.env` file as described above, start the application:
```
nodemon
```
The application starts on localhost:3000 by default.

### TODOS & Future
The seedDB() function in seeds.js may have to be updated as it was created earlier in the project with simpler models. This only affects the initial campgrounds populating MongoDB on first run.

I may add new features and functionalities as I learn more about web development.
