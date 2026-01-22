
export const getFileFromUrl = async (url: string, name = "image.png"): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], name, { type: blob.type });
};
