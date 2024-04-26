import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { IZipFile } from "./zip"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateFullPathFileName(file: IZipFile) {
  if(file.file_parent_folder === "") {
    return `${file.file_name}.${file.file_extension}`
  }

  return `${file.file_parent_folder}/${file.file_name}.${file.file_extension}`
}
