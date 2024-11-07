export async function readImages() {
  const imageFiles = await import.meta.glob(
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
  });

  return images;
}
