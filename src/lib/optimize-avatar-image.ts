/** Resize/compress avatar in-browser before upload (matches account settings behavior). */
export async function optimizeAvatarImage(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const maxSide = 512;
  const scale = Math.min(maxSide / bitmap.width, maxSide / bitmap.height, 1);
  const targetWidth = Math.max(1, Math.round(bitmap.width * scale));
  const targetHeight = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not optimize image");

  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", 0.82);
  });
  bitmap.close();

  if (!blob) throw new Error("Could not process image");
  const name = file.name.replace(/\.[^.]+$/, "") || "avatar";
  return new File([blob], `${name}.webp`, { type: "image/webp" });
}
