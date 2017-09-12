// ========= Utility Methods ========== //

export function pluralizeString(str) {
    let str1 = str.charAt(0) === '_' ? str.slice(1) : str;
    return str1.charAt(0).toLowerCase() + str1.slice(1) + 's';
}

export function clone(obj) {
    return JSON.parse(JSON.stringify(obj))
}

export function msToSec(ms)
{
      var milliseconds = ms % 1000;
      var seconds = Math.floor(ms / 1000);
      return minutes + ":" + seconds + "." + milliseconds;
}