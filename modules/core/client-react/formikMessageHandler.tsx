import React, { ComponentType } from 'react';
import { FieldError } from '@module/validation-common-react';

export type HandleError = (
  asyncCallback: () => Promise<{ errors: Array<{ field: string; message: string }> }>,
  messageError: string
) => Promise<{ errors: Array<{ field: string; message: string }> }>;
export type FormikMessageHandler = (Component: ComponentType) => ComponentType;
export type AsyncCallback = () => Promise<{
  errors: Array<{ field: string; message: string }>;
  user: { [key: string]: any };
}>;

export const formikMessageHandler: FormikMessageHandler = (Component: ComponentType) => {
  const handleError: HandleError = async (asyncCallback: AsyncCallback, messageError: string) => {
    const result = await asyncCallback();

    const errors = new FieldError(result.errors);

    if (errors.hasAny()) {
      throw { ...errors.errors, messageError };
    }

    return result;
  };

  return (props: any) => <Component {...props} handleError={handleError} />;
};