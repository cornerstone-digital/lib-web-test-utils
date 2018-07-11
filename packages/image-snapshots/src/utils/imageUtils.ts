import { PNG } from 'pngjs'

export const fillSizeDifference = (width: number, height: number) => (image: PNG) => {
  const inArea = (x: number, y: number) => y > height || x > width
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      if (inArea(x, y)) {
        const idx = ((image.width * y) + x) << 2
        image.data[idx] = 0
        image.data[idx + 1] = 0
        image.data[idx + 2] = 0
        image.data[idx + 3] = 64
      }
    }
  }

  return image
}

export const createImageResizer = (width: number, height: number) => (source: PNG) => {
  const resized = new PNG({ width, height, fill: true })
  PNG.bitblt(source, resized, 0, 0, source.width, source.height, 0, 0)
  return resized
}

export const alignImagesToSameSize = (firstImage: PNG, secondImage: PNG) => {
  // Keep original sizes to fill extended area later
  const firstImageWidth = firstImage.width
  const firstImageHeight = firstImage.height
  const secondImageWidth = secondImage.width
  const secondImageHeight = secondImage.height
  // Calculate biggest common values
  const resizeToSameSize = createImageResizer(
    Math.max(firstImageWidth, secondImageWidth),
    Math.max(firstImageHeight, secondImageHeight)
  )
  // Resize both images
  const resizedFirst = resizeToSameSize(firstImage)
  const resizedSecond = resizeToSameSize(secondImage)
  // Fill resized area with black transparent pixels
  return [
    fillSizeDifference(firstImageWidth, firstImageHeight)(resizedFirst),
    fillSizeDifference(secondImageWidth, secondImageHeight)(resizedSecond)
  ]
}

export const diffImages = (baseImage: PNG, compareImage: PNG) => {
  console.log(baseImage, compareImage)
}
