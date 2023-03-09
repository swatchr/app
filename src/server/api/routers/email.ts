import { renderToStaticMarkup } from 'react-dom/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import EmailService from 'lib/nodemailer';
import {
  adminFeedbackEmail,
  feedbackEmail,
  verificationEmail,
} from 'lib/nodemailer/emails';
import { handleServerError } from '../utils';

export const emailRouter = createTRPCRouter({
  feedback: publicProcedure
    .input(z.object({ subject: z.string(), email: z.string().optional() }))
    .mutation(async ({ input }) => {
      const emailService = new EmailService();

      try {
        if (input.email) {
          const emailHTML = feedbackEmail({
            subject: input.subject,
            email: input?.email,
          });
          await emailService.sendTransactionalEmail({
            subject: input.subject,
            email: input.email,
            html: renderToStaticMarkup(emailHTML),
          });
        }
        const adminEmailHTML = adminFeedbackEmail(input);
        await emailService.sendAdminEmail({
          subject: input.subject,
          html: renderToStaticMarkup(adminEmailHTML),
        });

        return {
          status: 'success',
          message: 'Emails sent successfully',
        };
      } catch (e) {
        return handleServerError(e, 'There was an error sending emails');
      }
    }),
  verify: publicProcedure
    .input(z.object({ email: z.string(), subject: z.string() }))
    .mutation(async ({ input }) => {
      const emailService = new EmailService();
      try {
        const emailHTML = verificationEmail(input);
        await emailService.sendTransactionalEmail({
          ...input,
          html: renderToStaticMarkup(emailHTML),
        });

        return {
          status: 'success',
          message: 'Emails sent successfully',
        };
      } catch (e) {
        return handleServerError(e, 'There was an error sending the email');
      }
    }),
});
