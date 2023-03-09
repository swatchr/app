import { Box } from '@chakra-ui/react';

export function EmailWrapper({
  subject,
  children,
}: {
  subject: string;
  children: React.ReactNode;
}) {
  return (
    <html>
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <meta charSet="utf-8" />
        <title>{subject || 'Swatchr App'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Box
          as="main"
          p={4}
          borderWidth={1}
          borderRadius={4}
          border="1px solid red"
          bg="#000"
        >
          {children}
        </Box>
      </body>
    </html>
  );
}
