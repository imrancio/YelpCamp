# YelpCamp
Welcome to YelpCamp! It is a web application designed to blog about fun campground locations. I created it while learning about web development from Colt Steele's [Web Developer Bootcamp](https://www.udemy.com/the-web-developer-bootcamp/) on Udemy. The backend uses Express.js and MongoDB. The frontend consists of EJS templates created using Bootstrap 4. A fully deployed version of the application is hosted [here](https://quiet-everglades-85480.herokuapp.com). Go ahead and check it out!

## User roles & Features
Users can register, login, add campgrounds, comments, etc. Admin users may add/edit/delete any users/campgrounds/comments as they see fit. Users may only add/edit/delete their own account/campgrounds/comments.

Campgrounds can be searched via name, price, description, location and author. Images can be displayed via URL links or file upload. Address field is intuitive, pulling the first result from Google Maps API. All updates show human-readable and user-friendly timestamps from Moment.js. All usernames link to the user's page showing their individual campgrounds. All pages feature responsive layout for PCs, tablets and smartphones.

## Development Setup
This application requires some setup to take full advantage of all APIs and features. Most importantly, it uses Google Maps API to show geolocation info on campgrounds. Furthermore, Cloudinary API is also required for local file upload feature as the images have to be hosted somewhere. Finally, a Gmail account is required to send emails to users during password reset process. Additional setup may involve installing MongoDB locally.

To simplify the process, an `example.env` file has been provided with environment variable names. Simply rename/copy the file to `.env` and fill in the values for all the environment variables after the '=' signs:

* ADMINPW - the password used to register admin user accounts
* GEOCODER_API_KEY - Google Maps Geocoder API key
* MAPS_JAVASCRIPT_API_KEY - Google Maps JavaScript API key
* GMAIL - the Gmail account from which YelpCamp sends password reset emails from
* GMAIL_CLIENT_ID - OAuth2 Client ID credential for Gmail
* GMAIL_CLIENT_SECRET - secret generated with the ID above
* GMAIL_REFRESH_TOKEN - token generated to use Gmail with OAuth2
* CLOUDINARY_CLOUD_NAME - cloud name for the cloudinary account for hosting images
* CLOUDINARY_API_KEY - API key for cloudinary account
* CLOUDINARY_API_SECRET - secret key for cloudinary account
* MONGO_URI (optional) - mongoDB instance to connect to; i.e. mongodb://...

### Notes
You must set up Google Maps APIs from [Google Developers Console](https://console.developers.google.com/). More info about setting up Google Maps geocoding API can be found [here](https://developers.google.com/maps/documentation/javascript/geocoding). Info about Maps JavaScript API keys can be found [here](https://developers.google.com/maps/documentation/javascript/get-api-key). Keep in mind that the JavaScript API key will be exposed in views, just like it is in my previous commits. To ensure it is not misused, it must be secured by restricting via HTTP referrers or IP addresses. I have restricted mine to only accept requests from my deployed HTTP referrer.

The Cloudinary keys should be auto-generated upon creating the appropriate account. More info can be found [here](https://cloudinary.com/documentation/solution_overview#account_and_api_setup).

The password reset feature will not work without a valid Gmail account and OAuth2 credentials. Follow [this guide](https://medium.com/@nickroach_50526/sending-emails-with-node-js-using-smtp-gmail-and-oauth2-316fe9c790a1) to set up your Gmail client ID, secret and refresh token.

## Run
First, install MongoDB following instructions from [here](https://docs.mongodb.com/v3.2/administration/install-community/). Alternatively, you may connect to any mongoDB instance by setting the `MONGO_URI` environment variable. Then, run the following commands on a fresh terminal:
```
git clone https://github.com/imrancio/YelpCamp.git
cd YelpCamp
npm i
```
After setting up `.env` file as described above, start the application:
```
npm run dev
```
The application starts on localhost:3000 by default. On exit, be sure to kill the local database properly by running:
```
npm run postdev
```

### Future
I may add new features and functionalities as I learn more about web development.
