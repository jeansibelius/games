const terminalSize = {
  width: process.stdout.columns,
  height: process.stdout.rows,
};

export const addLeftPadding = (str: string, leftPadding: number) => {
  return " ".repeat(leftPadding).concat(str);
};

export const getLeftPaddingToCenter = (str: string, centerBy?: string) => {
  const strLen = centerBy ? str.length - centerBy.length + str.length : str.length;
  return Math.floor((terminalSize.width - strLen) / 2);
};
