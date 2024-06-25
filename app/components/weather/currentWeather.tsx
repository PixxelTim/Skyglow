import { useState, useEffect } from "react";

import Image from "next/image";

const CurrentWeather = ({ data }) => {
  const [iconSrc, setIconSrc] = useState<string | StaticImport>(null);

  useEffect(() => {
    const loadIcon = async () => {
      const icon = data.weather[0].icon;
      const imageSrc = await getImageSrc(icon);
      setIconSrc(imageSrc);
    };

    loadIcon();
  }, [data.weather]);

  const getImageSrc = (icon) => {
    const imageMap = {
      "01d": import("./../../icons/clearSkyDay.svg"),
      "01n": import("./../../icons/clearSkyNight.svg"),
      "02d": import("./../../icons/fewCloudsDay.svg"),
      "02n": import("./../../icons/fewCloudsNight.svg"),
      "03d": import("./../../icons/scatteredCloudsDay.svg"),
      "03n": import("./../../icons/scatteredCloudsNight.svg"),
      "04d": import("./../../icons/brokenCloudsDay.svg"),
      "04n": import("./../../icons/brokenCloudsNight.svg"),
      "09d": import("./../../icons/showerRainDay.svg"),
      "09n": import("./../../icons/showerRainNight.svg"),
      "10d": import("./../../icons/rainDay.svg"),
      "10n": import("./../../icons/rainNight.svg"),
      "11d": import("./../../icons/thunderstormDay.svg"),
      "11n": import("./../../icons/thunderstormNight.svg"),
      "13d": import("./../../icons/snowDay.svg"),
      "13n": import("./../../icons/snowNight.svg"),
      "50d": import("./../../icons/mistDay.svg"),
      "50n": import("./../../icons/mistNight.svg"),
    };

    return imageMap[icon];
  };

  const celvinToCelsius = (kelvin) => {
    return kelvin - 273.15;
  };

  const temperature = celvinToCelsius(data.main.temp).toFixed(1);
  const feelsLike = celvinToCelsius(data.main.feels_like).toFixed(1);
  const windSpeed = data.wind.speed;
  const humidity = data.main.humidity;
  const pressure = data.main.pressure;

  if (!iconSrc) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="weather">
        <p className="city">{data.city}</p>
        <p className="weather__description">{data.weather[0].description}</p>
        <Image src={iconSrc} alt="Icon Sonne" className="weather__icon" />
        <div className="parameter-row flex justify-between items-center py-2">
          <div className="parameter-label text-gray-200">Temperatur</div>
          <div className="parameter-value text-blue-500">{temperature} °C</div>
        </div>
        <div className="parameter-row flex justify-between items-center py-2">
          <div className="parameter-label text-gray-200">
            Gefühlte Temperatur
          </div>
          <div className="parameter-value text-blue-500">{feelsLike} °C</div>
        </div>
        <div className="parameter-row flex justify-between items-center py-2">
          <div className="parameter-label text-gray-200">
            Windgeschwindigkeit
          </div>
          <div className="parameter-value text-blue-500">{windSpeed} m/s</div>
        </div>
        <div className="parameter-row flex justify-between items-center py-2">
          <div className="parameter-label text-gray-200">Luftfeuchtigkeit</div>
          <div className="parameter-value text-blue-500">{humidity} %</div>
        </div>
        <div className="parameter-row flex justify-between items-center py-2">
          <div className="parameter-label text-gray-200">Luftdruck</div>
          <div className="parameter-value text-blue-500">{pressure} hPa</div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
