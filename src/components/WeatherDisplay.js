import React, {useMemo} from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from '@material-ui/core';
import { Tooltip } from '@material-ui/core';
import { Avatar } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

const useStyles = makeStyles(theme => ({

    largeAvatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));


function WeatherDisplay({ weatherData }) {
    const classes = useStyles();
    const { temp, description, icon, windTransform, windSpeed } = useMemo(() => {
        const [weather] = weatherData.weather || [];
        return {
            temp: weatherData.main && weatherData.main.temp ? Math.round(weatherData.main.temp).toString() : "",
            description: weather ? weather.description : "",
            icon: weather ? `http://openweathermap.org/img/wn/${weather.icon}@2x.png` : "",
            windTransform: weatherData.wind ? weatherData.wind.deg - 90 : null,
            windSpeed: weatherData.wind ? Math.round(weatherData.wind.speed) : 0,
        };
    }, [weatherData]);

    return (
        <>
            {temp && <Typography variant="h6">{temp}&deg;C</Typography>}
            {icon && (
                <Tooltip title={description} aria-label={description}>
                    <Avatar className={classes.largeAvatar} alt={description} src={icon} />
                </Tooltip>
            )}
            {windSpeed > 0 && (
                <>
                    <Typography variant="h6">{`${windSpeed} km/h`}</Typography>
                    {windTransform !== null && (
                        <ArrowRightAltIcon style={{ transform: `rotateZ(${windTransform}deg)` }} />
                    )}
                </>
            )}
        </>
    );
}

export default WeatherDisplay;