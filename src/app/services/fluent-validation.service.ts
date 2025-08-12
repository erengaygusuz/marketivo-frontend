import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Validator } from 'fluentvalidation-ts';
import { CheckoutFormData, CheckoutFormValidator } from '../validators/checkout-form.validator';

// Type definitions for validation
type MockObject = Record<string, unknown>;

@Injectable({
    providedIn: 'root',
})
export class FluentValidationService {
    private checkoutValidator = new CheckoutFormValidator();

    constructor(private translate: TranslateService) {}

    /**
     * Creates a validator function that can be used with Angular reactive forms
     * @param validatorInstance The fluent validator instance to use
     * @param propertyPath The path to the property being validated (e.g., 'customer.firstName')
     * @returns A ValidatorFn that can be used with Angular forms
     */
    /**
     * Creates a validator function that can be used with Angular reactive forms
     * @param validatorInstance The fluent validator instance to use
     * @param propertyPath The path to the property being validated (e.g., 'customer.firstName')
     * @returns A ValidatorFn that can be used with Angular forms
     */
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

    /**
     * Creates a mock object with the value set at the specified property path
     */
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

    /**
     * Extracts validation error for a specific property from the validation result
     */
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

    /**
     * Helper method to check if a form control has validation errors
     */
    hasFieldError(control: AbstractControl | null): boolean {
        return (
            control !== null &&
            control.invalid &&
            control.errors !== null &&
            control.errors['fluentValidation'] !== undefined
        );
    }

    /**
     * Helper method to get the validation error message for a form control
     */
    getFieldErrorMessage(control: AbstractControl | null): string {
        if (control && control.errors && control.errors['fluentValidation']) {
            const translationKey = control.errors['fluentValidation'];
            // Try to translate the key, fallback to the key itself if translation is not found
            const translatedMessage = this.translate.instant(translationKey);

            return translatedMessage !== translationKey ? translatedMessage : translationKey;
        }

        return '';
    }

    /**
     * Validates form data and sets errors on form controls (generic version)
     */
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

    /**
     * Validates checkout form data specifically (convenience method)
     */
    validateCheckoutForm(formGroup: FormGroup, formData: CheckoutFormData): boolean {
        return this.validateAndSetErrors(formGroup, formData, this.checkoutValidator);
    }

    /**
     * Sets validation errors on form controls (generic version)
     */
    private setValidationErrorsOnForm(formGroup: FormGroup, validationErrors: Record<string, unknown>) {
        // Clear all existing errors first
        this.clearAllFormErrors(formGroup);

        // Recursively set errors based on the validation error structure
        this.setErrorsRecursively(formGroup, validationErrors, '');
    }

    /**
     * Recursively sets errors on form controls based on validation error structure
     */
    private setErrorsRecursively(formGroup: FormGroup, errors: Record<string, unknown>, parentPath: string) {
        Object.keys(errors).forEach(key => {
            const fullPath = parentPath ? `${parentPath}.${key}` : key;
            const errorValue = errors[key];

            if (typeof errorValue === 'string') {
                // This is an actual error message
                this.setControlError(formGroup, fullPath, errorValue);
            } else if (typeof errorValue === 'object' && errorValue !== null) {
                // This is a nested object, recurse into it
                this.setErrorsRecursively(formGroup, errorValue as Record<string, unknown>, fullPath);
            }
        });
    }

    /**
     * Sets error on a specific form control (generic version)
     */
    private setControlError(formGroup: FormGroup, controlPath: string, errorMessage: string) {
        const control = formGroup.get(controlPath);

        if (control) {
            control.setErrors({ fluentValidation: errorMessage });
        }
    }

    /**
     * Clears all validation errors from the form (generic version)
     */
    private clearAllFormErrors(formGroup: FormGroup) {
        this.clearErrorsRecursively(formGroup);
    }

    /**
     * Recursively clears all form control errors
     */
    private clearErrorsRecursively(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);

            if (control) {
                if (control instanceof FormGroup) {
                    // If it's a nested FormGroup, recurse into it
                    this.clearErrorsRecursively(control);
                } else {
                    // Clear errors on the control
                    control.setErrors(null);
                }
            }
        });
    }
}
