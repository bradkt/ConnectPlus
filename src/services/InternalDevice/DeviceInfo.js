import DeviceInfo from 'react-native-device-info';

class DeviceInfo {

  getDeviceData = () => {
    const uniqueId = DeviceInfo.getUniqueID();
    const manufacturer = DeviceInfo.getManufacturer();
    const model = DeviceInfo.getModel();
    const timezone = DeviceInfo.getTimezone();

    console.log("model: " ,model);
    console.log("manufacturer: " ,manufacturer);
    console.log("uniqueId: " ,uniqueId);
    console.log("timezone: " ,timezone);

    DeviceInfo.getMACAddress().then(mac => {
      // "E5:12:D8:E5:69:97"
      console.log(mac);
      
    });
    DeviceInfo.isBatteryCharging().then(isCharging => {
      console.log(`is charging: ${isCharging}`)
    
    });
  }
}

export default DeviceInfo;
