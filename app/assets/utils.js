export const getIconForField = (fieldName) => {
  const icons = {
    // Common fields
    bedrooms: "bed-outline",
    bathrooms: "water-outline",
    squareFootage: "square-outline",
    totalArea: "square-outline",
    landArea: "map-outline",

    // Building features
    totalFloors: "layers-outline",
    yearBuilt: "calendar-outline",
    yearRenovated: "construct-outline",
    hasGarage: "car-outline",
    garageCapacity: "car-outline",
    hasBasement: "home-outline",
    hasGarden: "leaf-outline",
    gardenSize: "leaf-outline",

    // Apartment specific
    hasElevator: "arrow-up-outline",
    hasBalcony: "sunny-outline",
    balconySize: "resize-outline",
    parkingSpots: "car-outline",
    monthlyMaintenance: "cash-outline",

    // Office specific
    numberOfOffices: "business-outline",
    numberOfMeetingRooms: "people-outline",
    hasReception: "desktop-outline",
    parkingSpaces: "car-outline",
    hasLoadingDock: "cube-outline",
    internetSpeed: "wifi-outline",
    hasBackupPower: "flash-outline",
    securityLevel: "shield-outline",

    // Commercial
    frontage: "storefront-outline",
    hasStorefront: "storefront-outline",
    storageSpace: "file-tray-stacked-outline",
    hasLoadingBay: "cube-outline",
    footTraffic: "walk-outline",
    zoning: "map-outline",
    previousBusiness: "business-outline",
    signageAllowed: "sign-outline",

    // Warehouse
    numberOfDocks: "boat-outline",
    hasOfficeSpace: "business-outline",
    officeArea: "business-outline",
    hasYard: "leaf-outline",
    yardSize: "resize-outline",
    powerCapacity: "flash-outline",
    sprinklerSystem: "water-outline",
    securityFeatures: "shield-checkmark-outline",

    // Land
    topography: "map-outline",
    hasUtilities: "flash-outline",
    roadAccess: "car-outline",
    soilType: "earth-outline",
    floodZone: "water-outline",
    hasWaterRights: "water-outline",
    mineralRights: "diamond-outline",
    environmentalReport: "document-text-outline",

    // Luxury properties
    hasPool: "water-outline",
    hasGuesthouse: "home-outline",
    staffQuarters: "people-outline",
    securitySystem: "shield-outline",
    landscapeType: "leaf-outline",

    // Hotel
    numberOfRooms: "bed-outline",
    numberOfSuites: "home-outline",
    starRating: "star-outline",
    hasRestaurant: "restaurant-outline",
    hasSpa: "fitness-outline",
    conferenceCapacity: "people-outline",
    occupancyRate: "stats-chart-outline",
  };
  return icons[fieldName] || "information-circle-outline";
};

export const getUnitForField = (fieldName) => {
  const units = {
    // Area measurements
    squareFootage: " sq ft",
    totalArea: " sq ft",
    landArea: " acres",
    balconySize: " sq ft",
    gardenSize: " sq ft",
    officeArea: " sq ft",
    yardSize: " sq ft",
    storageSpace: " sq ft",

    // Counting units
    totalFloors: " floors",
    parkingSpaces: " spaces",
    parkingSpots: " spots",
    garageCapacity: " cars",
    numberOfOffices: " offices",
    numberOfMeetingRooms: " rooms",
    numberOfDocks: " docks",
    numberOfRooms: " rooms",
    numberOfSuites: " suites",
    conferenceCapacity: " people",

    // Measurements
    frontage: " ft",
    internetSpeed: " Mbps",

    // Financial
    monthlyMaintenance: " ETB/month",

    // Percentages
    occupancyRate: "%",

    // Ratings
    starRating: " stars",

    // Time
    yearBuilt: "",
    yearRenovated: "",

    // Traffic
    footTraffic: " daily visits",
  };
  return units[fieldName] || "";
};
