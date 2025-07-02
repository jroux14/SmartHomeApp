
// TODO: Move these endpoints to environment files
export const ROOT_URL: string = "http://localhost:8080/smarthome/";
export const AUTH_ENDPOINT: string = "auth/";
export const DEVICE_ENDPOINT: string = "device/";

/* Device Types */
export const NAME_SENSOR: string = "Sensor";
export const TYPE_SENSOR: string = "TYPE_SENSOR";
export const NAME_OUTLET: string = "Outlet"
export const TYPE_OUTLET: string = "TYPE_OUTLET";

/* Device and Room Popups */
export const DISPLAY_ROOM_POPUP: string = "Add Room";
export const VALUE_ROOM_POPUP: string = "ROOM_POPUP";
export const DISPLAY_DEVICE_POPUP: string = "Add Device";
export const VALUE_DEVICE_POPUP: string = "DEVICE_POPUP";

/* Dashboard Panel Types */
export const DISPLAY_DEVICE_PANEL: string = "Add Device Panel";
export const VALUE_DEVICE_PANEL: string = "DEVICE_PANEL";
export const DISPLAY_STATISTICS_PANEL: string = "Add Statistics Panel";
export const VALUE_STATISTICS_PANEL: string = "STATISTICS_PANEL";

/* Device Filter Types */
export const DEVICE_ROOM_FILTER_DISPLAY: string = "Room";
export const DEVICE_ROOM_FILTER_VALUE: string = "FILTER_ROOM";
export const DEVICE_TYPE_FILTER_DISPLAY: string = "Device Type";
export const DEVICE_TYPE_FILTER_VALUE: string = "FILTER_TYPE";
