import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import ErrorIcon from "@material-ui/icons/Error";
import WeatherDisplay from './WeatherDisplay';


const useStyles = makeStyles(theme => ({
    headerLine: {
        display: "flex",
        alignItems: "center",
    },
    location: {
        flex: 1,
    },
    detailLine: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    description: {
        flex: 1,
    },

}));

const REACT_APP_WEATHER_API_KEY = 'dd8fccdba7dc57fd3627a616118818a3';
const GetApi = async location => {
    try {
        const result = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${REACT_APP_WEATHER_API_KEY}&units=metric`,
        );

        if (result.status === 200) {
            return { success: true, data: await result.json() };
        }

        return { success: false, error: result.statusText };
    } catch (ex) {
        return { success: false, error: ex.message };
    }
};


function LoadingIndicator({ isLoading }) {
    return isLoading ? <CircularProgress /> : null;
}

function ErrorMessage({ apiError }) {
    if (!apiError) return null;

    return (
        <>
            <ErrorIcon color="error" />
            <Typography color="error" variant="h6">
                {apiError}
            </Typography>
        </>
    );
}



function LocationWeather({ location }) {
    const classes = useStyles();

    const [weatherData, setWeatherData] = useState({});
    const [apiError, setApiError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadingIndicatorTimeout = setTimeout(() => setIsLoading(true), 500);
        const getWeather = async () => {
            const result = await GetApi(location);
            clearTimeout(loadingIndicatorTimeout);
            setIsLoading(false);
            setWeatherData(result.success ? result.data : {});
            setApiError(result.success ? "" : result.error);
        };

        getWeather();
        return () => clearTimeout(loadingIndicatorTimeout);
    }, [location]);

    const { flagIcon, countryCode } = React.useMemo(() => {
        return {
            flagIcon: weatherData.sys ? `https://www.countryflags.io/${weatherData.sys.country}/shiny/32.png` : "",
            countryCode: weatherData.sys ? weatherData.sys.country : "",
        };
    }, [weatherData]);

    return (
        <>
            <div className={classes.headerLine}>
                <Typography className={classes.location} variant="h5">
                    {location}
                </Typography>
                {flagIcon && <img alt={countryCode} src={flagIcon} />}
            </div>
            <div className={classes.detailLine}>
                <LoadingIndicator isLoading={isLoading} />
                <ErrorMessage apiError={apiError} />
                <WeatherDisplay weatherData={weatherData} />
            </div>
        </>
    );
}

LocationWeather.propTypes = {
    location: PropTypes.string.isRequired,
};

export default LocationWeather;

