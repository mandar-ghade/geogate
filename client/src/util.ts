export function getRandomCoordinates(
  lat: number, lon: number, radius: number
) {
  // Convert radius in km to rough lat/lon degrees
  const degreeOffset = radius / 111_111; // 111,111m per degree at the equator
  const latOffset = (Math.random() * 2 - 1) * degreeOffset;
  const lonOffset = (Math.random() * 2 - 1) * degreeOffset;
  return {
    lat: lat + latOffset,
    lon: lon + lonOffset
  };
}
