GetLocation - Your Emergency Location Companion 🌍
GetLocation is a React-based application that helps users identify their current location and provides a list of nearby hospitals and police stations within a 1 km radius. The app is designed to be intuitive, fast, and helpful in emergency situations, where every second matters.

Features 🚀
Current Location Detection: Fetches the user's latitude and longitude using the browser's Geolocation API.
Address Details: Provides the user's current address, including:
State
City
Locality
Division
Pincode
Nearby Hospitals and Police Stations: Displays a list of nearby:
Hospitals 🏥
Police Stations 🚓
Distance Calculation: Lists the distance (in kilometers) from the user to each nearby hospital or police station.
Responsive UI: A clean and user-friendly interface designed for mobile and desktop users.
How It Works 🛠️
Fetch Location:

The app uses the browser's navigator.geolocation API to detect the user's current coordinates.
Reverse Geocoding:

The app uses the Nominatim API to convert the coordinates into a readable address.
Nearby Places Search:

The app queries the Overpass API to find hospitals and police stations within a 1 km radius of the user's location.
Distance Calculation:

Employs the Haversine formula to calculate the distance from the user to each nearby place.
Installation & Setup 🛠️
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/GetLocation.git
cd GetLocation
Install dependencies:

bash
Copy code
npm install
Start the development server:

bash
Copy code
npm start
Access the app:

Open your browser and go to http://localhost:3000.
Usage 📋
Open the app.
Click the "Fetch Location Details" button.
View your current address details.
Explore the list of nearby hospitals and police stations along with their distances.
Technologies Used 💻
Frontend: React, HTML, CSS
APIs:
Nominatim API for reverse geocoding.
Overpass API for fetching nearby places.
Distance Calculation: Haversine formula.
Future Enhancements 🚀
Add support for more amenities like pharmacies, fire stations, etc.
Include live traffic data for better ETA estimations.
Optimize API calls to handle large datasets efficiently.
Enable offline functionality with cached location data.
Contributing 🤝
Contributions are welcome! If you'd like to improve this project:

Fork the repository.
Create a new branch:
bash
Copy code
git checkout -b feature-name
Commit your changes:
bash
Copy code
git commit -m "Add feature-name"
Push to the branch:
bash
Copy code
git push origin feature-name
Open a pull request.

Acknowledgments 🙌
Thanks to OpenStreetMap for their open data.
Inspired by the need to improve public emergency services through technology.
Let’s make emergency assistance smarter and faster! 🚑 🚓


