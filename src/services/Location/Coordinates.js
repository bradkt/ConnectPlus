getLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      const coordsEvent = {
        nativeEvent: {
          coordinate: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }
        }
      };
      return coordsEvent;
    },
    err => {
      console.log(err);
      return { error: "Fetching the Position failed, please pick one manually!"};
    })
  };

  locationChange = (previousLocation) => {
    let currentLocation = this.getLocationHandler();
    let isNewLocation = true;


    return isNewLocation;
  }

  export default getLocationHandler;