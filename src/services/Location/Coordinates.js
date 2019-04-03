import { setLocation } from "../../store/actions";

setLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      const coordsEvent = {
        nativeEvent: {
          coordinate: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }
        }
      };
      setLocation(coordsEvent.nativeEvent.coordinate);
    },
    err => {
      console.log("error getting location", err);
      return { error: "Fetching the Position failed, please pick one manually!"};
    })
  };

  export default setLocationHandler;

  export let locationChange = (previousLocation, currentLocation) => {
    // when location data is recieved typically it is to 7 decimal places
    // https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude
    // fourth decimal place is worth up to 11 m
    // if the location matches up to this decimal then we'll consider this as the same location

    let isNewLocation = true;


    return isNewLocation;
  }

 