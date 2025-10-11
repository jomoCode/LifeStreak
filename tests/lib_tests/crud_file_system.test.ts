import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { readEvents } from '@/lib/CRUD_file_system';
import { File } from 'expo-file-system';

// Tell Jest to use the mock version
jest.mock('expo-file-system');

describe('readEvents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns fail if file does not exist', async () => {
    // @ts-ignore — override the mock’s property for test
    File.prototype.exists = false;
    const result = await readEvents();
    expect(result).toEqual({ fail: 'storage file not found' });
  });

  test('returns pass if file exists but contains no data', async () => {
    // @ts-ignore
    File.prototype.exists = true;
    // @ts-ignore
    File.prototype.textSync = jest.fn(() => '');

    const result = await readEvents();
    expect(result).toEqual({ pass: 'no data' });
  });

  test('returns parsed JSON if file exists and contains data', async () => {
    // @ts-ignore
    File.prototype.exists = true;
    // @ts-ignore
    File.prototype.textSync = jest.fn(() =>
      `{"event1":{"event_id":"event1","expired":false}}`
    );

    const result = await readEvents();

    expect(result).toHaveProperty('event1');
    expect(result.event1).toEqual(
      expect.objectContaining({
        event_id: 'event1',
        expired: false,
      })
    );
  });
});
