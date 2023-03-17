import { renderToStaticMarkup } from 'react-dom/server';
import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

import { analytics } from 'lib/analytics';
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
          analytics.track('feedback-confirmation-email', {
            category: 'email',
            label: 'feedback:confirmation:sent',
            value: 1,
            ...input,
          });
        }
        const adminEmailHTML = adminFeedbackEmail(input);
        await emailService.sendAdminEmail({
          subject: input.subject,
          html: renderToStaticMarkup(adminEmailHTML),
        });
        analytics.track('admin-feedback-notify', {
          category: 'email',
          label: 'admin:feedback:notified',
          value: 1,
          ...input,
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
        analytics.track('transaction-email', {
          category: 'email',
          label: 'transaction:sent',
          value: 1,
          ...input,
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
