import { FormLabel, FormLabelProps } from '@chakra-ui/react';

type CustomLabelProps = { label?: string } & FormLabelProps;

export const CustomLabel = ({
  label,
  requiredIndicator,
  optionalIndicator,
  children,
}: CustomLabelProps) => {
  /*

    @SEE: https://discord.com/channels/660863154703695893/1055796000146587718
    * requiredIndicator={<abbr title="required">*</abbr>}
    * optionalIndicator={<Badge bg="yellow.400">Optional</Badge>}
 */
  return (
    <FormLabel
      fontSize="sm"
      fontWeight="bold"
      color="gray.500"
      requiredIndicator={requiredIndicator}
      optionalIndicator={optionalIndicator}
    >
      {label || children}
    </FormLabel>
  );
};
