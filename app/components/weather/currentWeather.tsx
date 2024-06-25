import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";

import clearSkyDay from "./../../icons/clearSkyDay.svg";
import clearSkyNight from "./../../icons/clearSkyNight.svg";
import fewCloudsDay from "./../../icons/fewCloudsDay.svg";
import fewCloudsNight from "./../../icons/fewCloudsNight.svg";
import scatteredCloudsDay from "./../../icons/scatteredCloudsDay.svg";
import scatteredCloudsNight from "./../../icons/scatteredCloudsNight.svg";
import brokenCloudsDay from "./../../icons/brokenCloudsDay.svg";
import brokenCloudsNight from "./../../icons/brokenCloudsNight.svg";
import showerRainDay from "./../../icons/showerRainDay.svg";
import showerRainNight from "./../../icons/showerRainNight.svg";
import rainDay from "./../../icons/rainDay.svg";
import rainNight from "./../../icons/rainNight.svg";
import thunderstormDay from "./../../icons/thunderstormDay.svg";
import thunderstormNight from "./../../icons/thunderstormNight.svg";
import snowDay from "./../../icons/snowDay.svg";
import snowNight from "./../../icons/snowNight.svg";
import mistDay from "./../../icons/mistDay.svg";
import mistNight from "./../../icons/mistNight.svg";

interface WeatherData {
  weather: { icon: string; description: string }[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  wind: { speed: number };
  city: string;
}

interface CurrentWeatherProps {
  data: WeatherData;
}

const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  const [iconSrc, setIconSrc] = useState<string | StaticImageData | null>(null);

  useEffect(() => {
    const loadIcon = () => {
      const icon = data.weather[0].icon;
      const imageSrc = getImageSrc(icon);
      setIconSrc(imageSrc);
    };

    loadIcon();
  }, [data.weather]);

  const getImageSrc = (icon: string): StaticImageData | null => {
    const imageMap: { [key: string]: StaticImageData } = {
      "01d": clearSkyDay,
      "01n": clearSkyNight,
      "02d": fewCloudsDay,
      "02n": fewCloudsNight,
      "03d": scatteredCloudsDay,
      "03n": scatteredCloudsNight,
      "04d": brokenCloudsDay,
      "04n": brokenCloudsNight,
      "09d": showerRainDay,
      "09n": showerRainNight,
      "10d": rainDay,
      "10n": rainNight,
      "11d": thunderstormDay,
      "11n": thunderstormNight,
      "13d": snowDay,
      "13n": snowNight,
      "50d": mistDay,
      "50n": mistNight,
    };

    return imageMap[icon] || null;
  };

  const kelvinToCelsius = (kelvin: number): number => {
    return kelvin - 273.15;
  };

  const temperature = kelvinToCelsius(data.main.temp).toFixed(1);
  const feelsLike = kelvinToCelsius(data.main.feels_like).toFixed(1);
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
