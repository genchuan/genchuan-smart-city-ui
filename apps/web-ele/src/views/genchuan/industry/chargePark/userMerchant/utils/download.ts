import { downloadFileFromBlobPart } from '@vben/utils';

type DownloadOptions = {
  fileName?: string;
  source:
    | BlobPart
    | {
        data: BlobPart;
        headers?: Record<string, any>;
      };
};

const DEFAULT_DOWNLOAD_FILE_NAME = 'download.xls';

function decodeFileName(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getHeaderValue(headers: Record<string, any> = {}, key: string) {
  if (typeof headers.get === 'function') {
    return String(headers.get(key) || headers.get(key.toLowerCase()) || '');
  }

  const targetKey = key.toLowerCase();
  const headerKey = Object.keys(headers).find(
    (item) => item.toLowerCase() === targetKey,
  );

  return headerKey ? String(headers[headerKey]) : '';
}

function getFileNameFromDisposition(disposition: string) {
  const utf8FileName = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (utf8FileName) {
    return decodeFileName(utf8FileName.replaceAll('"', ''));
  }

  const fileName = disposition.match(/filename="?([^";]+)"?/i)?.[1];
  return fileName ? decodeFileName(fileName) : '';
}

function resolveDownloadSource(source: DownloadOptions['source']) {
  if (
    source &&
    typeof source === 'object' &&
    !(source instanceof Blob) &&
    'data' in source
  ) {
    const disposition = getHeaderValue(source.headers, 'content-disposition');
    return {
      fileName: getFileNameFromDisposition(disposition),
      source: source.data,
    };
  }

  return {
    fileName: '',
    source,
  };
}

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
  const resolved = resolveDownloadSource(source);
  const finalFileName =
    resolved.fileName || fileName || DEFAULT_DOWNLOAD_FILE_NAME;
  const finalSource = resolved.source;

  if (finalSource instanceof Blob && isJsonBlob(finalSource)) {
    const text = await finalSource.text();
    const trimmedText = text.trim();

    if (!trimmedText.startsWith('{') && !trimmedText.startsWith('[')) {
      downloadFileFromBlobPart({
        fileName: finalFileName,
        source: finalSource,
      });
      return;
    }

    const data = JSON.parse(trimmedText);

    if (data && typeof data === 'object') {
      throw new Error(getErrorMessage(data));
    }
  }

  downloadFileFromBlobPart({ fileName: finalFileName, source: finalSource });
}
