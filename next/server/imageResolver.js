const BUCKET_URL = "https://storage.googleapis.com/truehodler-dev";
const BUCKET_FOLDER_PATH = "hodler_images";
const FILE_EXTENSION = "svg";

exports.getHodlerImageUrlById = (id) => {
    return `${BUCKET_URL}/${BUCKET_FOLDER_PATH}/${id}.${FILE_EXTENSION}`;
}