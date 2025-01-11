export function readImages() {
  const pattern = /png|jpg|jpeg|gif|webp/gi

  const imageFiles = import.meta.glob(
    "/public/images/photos/**/*.(png|jpg|jpeg|gif|webp)"
  );

  const images = Object.entries(imageFiles).map(([path, importFunc]) => {
    const fileName = path.split("/").pop() || "";
    const urlPath = path.replace("/public", "");

    return {
      fileName,
      path: urlPath,
      url: urlPath,
      import: importFunc,
    };
  }).sort((a, b) => Number(a.fileName.replace(pattern, '')) - Number(b.fileName.replace(pattern, '')));

  return images;
}
