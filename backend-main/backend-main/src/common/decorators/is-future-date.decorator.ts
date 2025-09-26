import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsFutureDate(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isFutureDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value instanceof Date && value.getTime() > Date.now();
        },
        defaultMessage(): string {
          return 'La fecha debe ser posterior a la actual';
        },
      },
    });
  };
}
