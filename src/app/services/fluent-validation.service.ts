import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Validator } from 'fluentvalidation-ts';
import { CheckoutFormData } from '../models/checkout-form-data';
import { CheckoutFormValidator } from '../validators/checkout-form.validator';

// Type definitions for validation
type MockObject = Record<string, unknown>;

@Injectable({
    providedIn: 'root',
})
export class FluentValidationService {
    private checkoutValidator = new CheckoutFormValidator();

    constructor(private translate: TranslateService) {}

    createValidatorFn<T>(validatorInstance: Validator<T>, propertyPath: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value === null || control.value === undefined) {
                // Let the fluent validator handle null/undefined values
                const mockObject = this.createMockObjectFromPath(propertyPath, control.value) as T;
                const result = validatorInstance.validate(mockObject);

                return this.extractErrorForProperty(result, propertyPath);
            }

            // Create a mock object with the control's value at the correct property path
            const mockObject = this.createMockObjectFromPath(propertyPath, control.value) as T;
            const result = validatorInstance.validate(mockObject);

            return this.extractErrorForProperty(result, propertyPath);
        };
    }

    private createMockObjectFromPath(path: string, value: unknown): MockObject {
        const pathParts = path.split('.');
        const result: MockObject = {};
        let current: Record<string, unknown> = result;

        for (let i = 0; i < pathParts.length - 1; i++) {
            current[pathParts[i]] = {};
            current = current[pathParts[i]] as Record<string, unknown>;
        }

        current[pathParts[pathParts.length - 1]] = value;

        return result;
    }

    private extractErrorForProperty(
        validationResult: Record<string, unknown>,
        propertyPath: string
    ): ValidationErrors | null {
        const pathParts = propertyPath.split('.');
        let current: unknown = validationResult;

        for (const part of pathParts) {
            if (current && typeof current === 'object' && current !== null && part in current) {
                current = (current as Record<string, unknown>)[part];
            } else {
                return null;
            }
        }

        if (typeof current === 'string') {
            return { fluentValidation: current };
        }

        return null;
    }

    hasFieldError(control: AbstractControl | null): boolean {
        return (
            control !== null &&
            control.invalid &&
            control.errors !== null &&
            control.errors['fluentValidation'] !== undefined &&
            (control.touched || control.dirty)
        );
    }

    getFieldErrorMessage(control: AbstractControl | null): string {
        if (control && control.errors && control.errors['fluentValidation']) {
            const translationKey = control.errors['fluentValidation'];
            const translatedMessage = this.translate.instant(translationKey);

            return translatedMessage !== translationKey ? translatedMessage : translationKey;
        }

        return '';
    }

    validateAndSetErrors<T>(formGroup: FormGroup, formData: T, validator: Validator<T>): boolean {
        const validationErrors = validator.validate(formData);
        const hasValidationErrors = Object.keys(validationErrors).length > 0;

        if (hasValidationErrors) {
            this.setValidationErrorsOnForm(formGroup, validationErrors);
        } else {
            this.clearAllFormErrors(formGroup);
        }

        return hasValidationErrors;
    }

    validateCheckoutForm(formGroup: FormGroup, formData: CheckoutFormData): boolean {
        return this.validateAndSetErrors(formGroup, formData, this.checkoutValidator);
    }

    private setValidationErrorsOnForm(formGroup: FormGroup, validationErrors: Record<string, unknown>) {
        this.clearAllFormErrors(formGroup);

        this.setErrorsRecursively(formGroup, validationErrors, '');
    }

    private setErrorsRecursively(formGroup: FormGroup, errors: Record<string, unknown>, parentPath: string) {
        Object.keys(errors).forEach(key => {
            const fullPath = parentPath ? `${parentPath}.${key}` : key;
            const errorValue = errors[key];

            if (typeof errorValue === 'string') {
                this.setControlError(formGroup, fullPath, errorValue);
            } else if (typeof errorValue === 'object' && errorValue !== null) {
                this.setErrorsRecursively(formGroup, errorValue as Record<string, unknown>, fullPath);
            }
        });
    }

    private setControlError(formGroup: FormGroup, controlPath: string, errorMessage: string) {
        const control = formGroup.get(controlPath);

        if (control) {
            control.setErrors({ fluentValidation: errorMessage });
        }
    }

    private clearAllFormErrors(formGroup: FormGroup) {
        this.clearErrorsRecursively(formGroup);
    }

    private clearErrorsRecursively(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);

            if (control) {
                if (control instanceof FormGroup) {
                    this.clearErrorsRecursively(control);
                } else {
                    control.setErrors(null);
                }
            }
        });
    }
}
