import { Transform } from 'class-transformer';
import dayjs from 'dayjs';

export function TransformToISODate() {
  return Transform(({ value }) => {
    if (!value) return null;
    return dayjs(value).toISOString();
  });
}
