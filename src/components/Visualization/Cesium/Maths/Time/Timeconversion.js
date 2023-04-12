import TimeConstants from "./TimeConstants";


function computeJulianDateComponentsLikeCesium(
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond
  ) {
    // Algorithm from page 604 of the Explanatory Supplement to the
    // Astronomical Almanac (Seidelmann 1992).
  
    const a = ((month - 14) / 12) | 0;
    const b = year + 4800 + a;
    let dayNumber =
      (((1461 * b) / 4) | 0) +
      (((367 * (month - 2 - 12 * a)) / 12) | 0) -
      (((3 * (((b + 100) / 100) | 0)) / 4) | 0) +
      day -
      32075;
  
    // JulianDates are noon-based
    hour = hour - 12;
    if (hour < 0) {
      hour += 24;
    }
  
    const secondsOfDay =
      second +
      (hour * TimeConstants.SECONDS_PER_HOUR +
        minute * TimeConstants.SECONDS_PER_MINUTE +
        millisecond * TimeConstants.SECONDS_PER_MILLISECOND);
  
    if (secondsOfDay >= 43200.0) {
      dayNumber -= 1;
    }
  
    return [dayNumber, secondsOfDay];
  }