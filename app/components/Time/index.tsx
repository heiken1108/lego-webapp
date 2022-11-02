import moment from "moment-timezone";
import config from "app/config";
import type { Dateish } from "app/models";
import "app/models";
type Props = {
  format?: string;
  time?: Dateish;
  wordsAgo?: boolean;
};

function getFormattedDateTime(time: Dateish, format: string): string {
  if (format === 'timeAgoInWords') {
    return moment(time).fromNow();
  } else if (format === 'nowToTimeInWords') {
    return moment().to(time);
  }

  return moment(time).format(format);
}

/**
 * A wrapper for the HTML <time>-element
 * that automatically adds the datetime attribute and formats
 * the content according to the given props.
 */
function Time({
  format = 'YYYY-MM-d',
  time,
  wordsAgo = false,
  ...props
}: Props) {
  const formatted = getFormattedDateTime(moment.tz(time || moment(), config.timezone), wordsAgo ? 'timeAgoInWords' : format);
  return <time dateTime={time} {...(props as Record<string, any>)}>
      {formatted}
    </time>;
}

export const FormatTime = ({
  time,
  format
}: {
  time: Dateish;
  format?: string;
}) => {
  const dateTime = moment(time);

  if (!format) {
    const defaultFormat = moment().isSame(dateTime, 'year') ? 'dddd DD. MMM HH:mm' : 'dddd DD. MMM YYYY HH:mm';
    return <Time time={dateTime} format={defaultFormat} />;
  } else {
    return <Time time={dateTime} format={format} />;
  }
};
export const FromToTime = ({
  from,
  to
}: {
  from: Dateish;
  to: Dateish;
}) => {
  const fromTime = moment(from);
  const toTime = moment(to);
  const toIsUnderADayAfter = toTime.diff(fromTime) < moment.duration(1, 'day');
  let fromFormat = 'dd DD. MMM, HH:mm';

  if (!moment().isSame(fromTime, 'year')) {
    fromFormat = 'dd DD. MMM YYYY HH:mm';

    if (toIsUnderADayAfter) {
      fromFormat = 'dddd DD. MMM YYYY HH:mm';
    }
  } else if (toIsUnderADayAfter) {
    fromFormat = 'dddd DD. MMM, HH:mm';
  }

  const toFormat = toIsUnderADayAfter ? 'HH:mm' : fromFormat;
  return <span>
      <FormatTime time={fromTime} format={fromFormat} /> -{' '}
      <FormatTime time={toTime} format={toFormat} />
    </span>;
};
export default Time;