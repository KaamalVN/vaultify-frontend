import { Filters } from "canvas-filters"

export const applyCartoonFilter = (imageElement) => {
  if (!imageElement || !imageElement.complete) {
    return null
  }

  try {
    // Create a canvas element
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    // Set canvas dimensions to match the image
    canvas.width = imageElement.naturalWidth || imageElement.width
    canvas.height = imageElement.naturalHeight || imageElement.height

    // Draw the image on the canvas
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height)

    // Apply cartoon filter
    Filters.cartoon(canvas)

    // Return the filtered image as a data URL
    return canvas.toDataURL("image/png")
  } catch (error) {
    console.error("Error applying cartoon filter:", error)
    return null
  }
}
