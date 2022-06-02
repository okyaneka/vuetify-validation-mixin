import i18n from "../lang";

function formatDate(date) {
  const locale = i18n.locale == "en" ? "en-US" : "ja-JP";
  return new Date(date).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(date) {
  try {
    const locale = i18n.locale == "en" ? "en-US" : "ja-JP";
    if (!isNaN(date)) date = date * 1000;
    const localeDate = new Date(date);
    const d = localeDate.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const t = localeDate.toLocaleTimeString(locale, {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${d} ${t}`;
  } catch (error) {
    return date;
  }
}

function getFileName(url) {
  try {
    url = new URL(url);
    return url.pathname.split("/").pop();
  } catch (error) {
    return url;
  }
}

function isObject(object) {
  return object && typeof object === "object" && !Array.isArray(object);
}

function deepMerge(target) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = this.mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

export { formatDate, formatDateTime, getFileName, deepMerge };
