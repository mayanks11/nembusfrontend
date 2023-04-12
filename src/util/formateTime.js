const monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];
  export const formatAMPM = (date) => {
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    let seconds = date.getUTCSeconds();
    let milliseconds=date.getUTCMilliseconds();
    
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? (hours<10 ? '0' + hours : hours) : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    seconds = seconds < 10 ? '0'+seconds : seconds;
    milliseconds=milliseconds<10?'0'+milliseconds:milliseconds;
    let strTime = hours + ':' + minutes + ':' + seconds +'.' +milliseconds+''+ ampm;
    return strTime;
  }
  
export const toUTCDateString = (d) => {
    let oldDate = new Date(d)
    let date = new Date(oldDate.getTime() );
    const dateString = `${monthNames[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()} at ${formatAMPM(date)} UTC+0`
    return dateString
}