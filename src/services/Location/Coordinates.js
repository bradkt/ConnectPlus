import { setLocation } from "../../store/actions";

setLocationHandler = () => {
  return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(pos => {
        const coordsEvent = {
          nativeEvent: {
            coordinate: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            }
          }
        };
        resolve(coordsEvent.nativeEvent.coordinate);
        //setLocation(coordsEvent.nativeEvent.coordinate);
      },
      err => {
        console.log("error getting location", err);
        // return { error: "Fetching the Position failed, please pick one manually!"};
        reject({ error: "Fetching the Position failed, please pick one manually!"});
      })
  });
};

export default setLocationHandler;

export let isNewLocation = (previousLocation, currentLocation) => {
  // when location data is recieved typically it is to 7 decimal places
  // https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude
  // fourth decimal place is worth up to 11 m
  // if the location matches up to this decimal then we'll consider this as the same location
  let newLocation = false;
  if (Object.entries(previousLocation).length === 0) {
    return;
  } 

  let pl_lat = previousLocation.latitude.toFixed(4);
  let pl_long = previousLocation.longitude.toFixed(4);
  let cl_lat = currentLocation.latitude.toFixed(4);
  let cl_long = currentLocation.longitude.toFixed(4);

  if (pl_lat != cl_lat || pl_long != cl_long) {
    console.log(pl_lat, " : ", cl_lat, " : ", pl_long, " : ", cl_long);
    newLocation = true;
  }

  return newLocation;
}

 