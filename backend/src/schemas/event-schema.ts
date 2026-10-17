import { z } from 'zod';

const minPageErrorMessage = 'Page number must be greater than 0';
const minLimitErrorMessage = 'Limit must be greater than 0';
const maxLimitErrorMessage = 'Limit must be less than or equal to 5';
const eventIdErrorMessage = 'Event ID must be greater than 0';
const eventPageSchema = z.object({
  page: z.coerce.number().int().min(1, { message: minPageErrorMessage }),
  limit: z.coerce
    .number()
    .int()
    .min(1, { message: minLimitErrorMessage })
    .max(5, { message: maxLimitErrorMessage }),
});

const eventIdSchema = z.coerce
  .number()
  .int()
  .min(1, { message: eventIdErrorMessage });

export { eventPageSchema, eventIdSchema };
