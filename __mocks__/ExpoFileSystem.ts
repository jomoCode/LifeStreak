export class Directory {
  uri: string;

  constructor(...pathParts: (string | Directory)[]) {
    this.uri = 'file://' + pathParts.map(p =>
      typeof p === 'string' ? p : (p as Directory).uri
    ).join('/');
  }
}

export class File {
  uri: string;
  exists: boolean;
  

  constructor(...pathParts: (string | Directory)[]) {
    this.uri = 'file://' + pathParts.map(p =>
      typeof p === 'string' ? p : (p as Directory).uri
    ).join('/');
    this.exists = true;
  }

  textSync(): string {
    return `{
      "event1": {
        "startDate": "2023-10-01T00:00:00.000Z",
        "interval": 1,
        "duration": 5,
        "startTime": "2023-10-01T09:00:00.000Z",
        "No_of_times_checked": 0,
        "No_of_times_to_be_checked": 5,
        "expired": false,
        "event_id": "event1",
        "last_checked": "2023-10-01T00:00:00.000Z"
      }
    }`;
  }
}

export const Paths = {
  document: '/mock/document',
};

export default { File, Directory, Paths };
