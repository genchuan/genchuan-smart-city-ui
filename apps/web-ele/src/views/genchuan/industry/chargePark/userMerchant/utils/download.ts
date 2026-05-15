import { downloadFileFromBlobPart } from '@vben/utils';

type DownloadOptions = {
  fileName: string;
  source: BlobPart;
};

function isJsonBlob(blob: Blob) {
  return (
    blob.type.includes('application/json') ||
    blob.type.includes('text/') ||
    blob.type === ''
  );
}

function getErrorMessage(data: any) {
  return data?.msg || data?.message || data?.error || 'Download failed';
}

export async function downloadFileIfValid({
  fileName,
  source,
}: DownloadOptions) {
  if (source instanceof Blob && isJsonBlob(source)) {
    const text = await source.text();
    const trimmedText = text.trim();

    if (!trimmedText.startsWith('{') && !trimmedText.startsWith('[')) {
      downloadFileFromBlobPart({ fileName, source });
      return;
    }

    const data = JSON.parse(trimmedText);

    if (data && typeof data === 'object') {
      throw new Error(getErrorMessage(data));
    }
  }

  downloadFileFromBlobPart({ fileName, source });
}
