export const getRandomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const getInitials = (name) => {
  let initials;
  const nameSplit = name.split(" ");
  const nameLength = nameSplit.length;
  if (nameLength > 1) {
    initials =
      nameSplit[0].substring(0, 1) + nameSplit[nameLength - 1].substring(0, 1);
  } else if (nameLength === 1) {
    initials = nameSplit[0].substring(0, 1);
  } else return;

  return initials.toUpperCase();
};

export const createImageFromInitials = (size, name, color) => {
  if (name == null) return;
  if (typeof document !== "undefined") {
    name = getInitials(name);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = canvas.height = size;

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, size, size);

    context.fillStyle = `${color}`;
    context.fillRect(0, 0, size, size);

    context.fillStyle = "#fff";
    context.textBaseline = "middle";
    context.textAlign = "center";
    context.font = `${size / 2}px Helvetica`;
    context.fillText(name, size / 2, size / 2);

    return canvas.toDataURL();
  }
};

const stringToHslColor = (str, s, l) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let h = hash % 360;
  return "hsl(" + h + ", " + s + "%, " + l + "%)";
};

export const getHexColor = (name) => {
  const saturation = 30;
  const lightness = 60;
  const hexColor = stringToHslColor(name, saturation, lightness);

  return hexColor;
};
