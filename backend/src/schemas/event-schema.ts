import { z } from 'zod';

const minPageErrorMessage = 'Page number must be greater than 0';
const minLimitErrorMessage = 'Limit must be greater than 0';
const maxLimitErrorMessage = 'Limit must be less than or equal to 5';
const eventIdErrorMessage = 'Event ID must be greater than 0';
const titleErrorMessage = 'Title must be between 1 and 255 characters';
const descriptionErrorMessage = 'Description cannot be empty';
const venueErrorMessage = 'Venue must be between 1 and 255 characters';
const totalSeatsErrorMessage = 'Total seats must be greater than 0';
const dateErrorMessage = 'Date must be in the future';
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

const bookingSchema = z.object({
  eventId: z.coerce.number().int().min(1, { message: eventIdErrorMessage }),
});

const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: titleErrorMessage })
    .max(255, { message: titleErrorMessage }),
  description: z.string().trim().min(1, { message: descriptionErrorMessage }),
  date: z.coerce.date().refine(date => date > new Date(), {
    message: dateErrorMessage,
  }),
  venue: z
    .string()
    .trim()
    .min(1, { message: venueErrorMessage })
    .max(255, { message: venueErrorMessage }),
  totalSeats: z.coerce
    .number()
    .int()
    .min(1, { message: totalSeatsErrorMessage }),
});

const updateEventSchema = eventSchema.extend({ id: eventIdSchema });

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
  email: z.string(),
});

export {
  eventPageSchema,
  eventIdSchema,
  bookingSchema,
  eventSchema,
  updateEventSchema,
  userSchema,
};
