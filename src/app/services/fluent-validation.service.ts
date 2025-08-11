import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';
import { CheckoutFormValidator, CheckoutFormData } from '../validators/checkout-form.validator';
import { TranslateService } from '@ngx-translate/core';

/**
 * Generic Fluent Validation Service
 * 
 * This service provides a generic way to integrate fluent-validation-ts with Angular reactive forms.
 * It can be used with any form and any fluent validator.
 * 
 * Usage Example:
 * 
 * 1. Create your validator:
 * ```typescript
 * export class MyFormValidator extends Validator<MyFormData> {
 *   constructor() {
 *     super();
 *     this.ruleFor('fieldName')
 *       .notEmpty()
 *       .withMessage('Field is required');
 *   }
 * }
 * ```
 * 
 * 2. In your component:
 * ```typescript
 * constructor(private fluentValidationService: FluentValidationService) {}
 * 
 * validateMyForm() {
 *   const formData: MyFormData = this.myForm.value;
 *   const myValidator = new MyFormValidator();
 *   
 *   const hasErrors = this.fluentValidationService.validateAndSetErrors(
 *     this.myForm, 
 *     formData, 
 *     myValidator
 *   );
 * }
 * 
 * // Template helpers
 * hasFieldError(control: any): boolean {
 *   return this.fluentValidationService.hasFieldError(control);
 * }
 * 
 * getFieldErrorMessage(control: any): string {
 *   return this.fluentValidationService.getFieldErrorMessage(control);
 * }
 * ```
 * 
 * 3. In your template:
 * ```html
 * <input formControlName="fieldName" />
 * @if (hasFieldError(myForm.get('fieldName'))) {
 *   <div class="error">{{ getFieldErrorMessage(myForm.get('fieldName')) }}</div>
 * }
 * ```
 */
@Injectable({
    providedIn: 'root'
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
    createValidatorFn<T>(validatorInstance: any, propertyPath: string): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value === null || control.value === undefined) {
                // Let the fluent validator handle null/undefined values
                const mockObject = this.createMockObjectFromPath(propertyPath, control.value);
                const result = validatorInstance.validate(mockObject);
                return this.extractErrorForProperty(result, propertyPath);
            }

            // Create a mock object with the control's value at the correct property path
            const mockObject = this.createMockObjectFromPath(propertyPath, control.value);
            const result = validatorInstance.validate(mockObject);
            
            return this.extractErrorForProperty(result, propertyPath);
        };
    }

    /**
     * Creates a mock object with the value set at the specified property path
     */
    private createMockObjectFromPath(path: string, value: any): any {
        const pathParts = path.split('.');
        const result: any = {};
        let current = result;

        for (let i = 0; i < pathParts.length - 1; i++) {
            current[pathParts[i]] = {};
            current = current[pathParts[i]];
        }

        current[pathParts[pathParts.length - 1]] = value;
        return result;
    }

    /**
     * Extracts validation error for a specific property from the validation result
     */
    private extractErrorForProperty(validationResult: any, propertyPath: string): ValidationErrors | null {
        const pathParts = propertyPath.split('.');
        let current = validationResult;

        for (const part of pathParts) {
            if (current && current[part]) {
                current = current[part];
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
    hasFieldError(control: any): boolean {
        return control && control.invalid && control.errors && control.errors['fluentValidation'];
    }

    /**
     * Helper method to get the validation error message for a form control
     */
    getFieldErrorMessage(control: any): string {
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
    validateAndSetErrors<T>(formGroup: FormGroup, formData: T, validator: any): boolean {
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
    private setValidationErrorsOnForm(formGroup: FormGroup, validationErrors: any) {
        // Clear all existing errors first
        this.clearAllFormErrors(formGroup);

        // Recursively set errors based on the validation error structure
        this.setErrorsRecursively(formGroup, validationErrors, '');
    }

    /**
     * Recursively sets errors on form controls based on validation error structure
     */
    private setErrorsRecursively(formGroup: FormGroup, errors: any, parentPath: string) {
        Object.keys(errors).forEach(key => {
            const fullPath = parentPath ? `${parentPath}.${key}` : key;
            const errorValue = errors[key];

            if (typeof errorValue === 'string') {
                // This is an actual error message
                this.setControlError(formGroup, fullPath, errorValue);
            } else if (typeof errorValue === 'object' && errorValue !== null) {
                // This is a nested object, recurse into it
                this.setErrorsRecursively(formGroup, errorValue, fullPath);
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
